from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import jwt
import bcrypt
import uuid
import asyncio
from contextlib import asynccontextmanager
import stripe
import random

# Environment variables
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-here')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')

# Configure Stripe
stripe.api_key = STRIPE_SECRET_KEY

# Database client
mongodb_client = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global mongodb_client, database
    mongodb_client = AsyncIOMotorClient(MONGO_URL)
    database = mongodb_client.digimanifest
    
    # Create indexes
    await database.users.create_index("email", unique=True)
    await database.users.create_index("user_id", unique=True)
    
    yield
    
    # Shutdown
    if mongodb_client:
        mongodb_client.close()

# Initialize FastAPI
app = FastAPI(title="DigiManifest API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    user_id: str
    email: str
    name: str
    is_pro: bool
    created_at: datetime
    subscription_status: Optional[str] = None
    subscription_ends_at: Optional[datetime] = None

class ManifestationSettings(BaseModel):
    min_amount: float = 10.0
    max_amount: float = 1000.0
    frequency: str = "900"  # seconds or 'random'
    sender_mode: str = "random"  # 'random' or 'custom'
    custom_sender: Optional[str] = None
    bank_selection: str = "random"
    manifestation_type: str = "random"
    sound_enabled: bool = True
    volume: int = 50
    grabovoi_enabled: bool = False
    subliminal_enabled: bool = False
    spaced_repetition: bool = False
    circadian_optimized: bool = False
    twenty_one_day_cycle: bool = False

class Achievement(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    unlocked_at: Optional[datetime] = None

class UserStats(BaseModel):
    total_manifested: float = 0.0
    sessions_count: int = 0
    consecutive_days: int = 0
    total_code_views: int = 0
    daily_usage: int = 0
    last_usage_date: Optional[str] = None

class SocialProofEntry(BaseModel):
    amount: float
    code: str
    description: Optional[str] = None
    created_at: datetime = datetime.utcnow()
    user_id: str

class CustomAffirmation(BaseModel):
    text: str
    code: str
    created_at: datetime = datetime.utcnow()

class NotificationLog(BaseModel):
    user_id: str
    amount: float
    sender: str
    bank: str
    manifestation_type: str
    grabovoi_code: Optional[str] = None
    timestamp: datetime = datetime.utcnow()

# Utility Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await database.users.find_one({"user_id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Grabovoi Codes
GRABOVOI_CODES = [
    {"label": "Unexpected Money", "code": "5207418"},
    {"label": "Immediate Money", "code": "426499"},
    {"label": "Constant Flow", "code": "318612518714"},
    {"label": "Money Magnet", "code": "199621147"},
    {"label": "Financial Independence", "code": "51849617"},
    {"label": "Business Success", "code": "9707411"}
]

# Random data for manifestations
BANKS = [
    "Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "Capital One",
    "US Bank", "PNC Bank", "TD Bank", "Truist Bank", "Charles Schwab",
    "Goldman Sachs", "American Express", "Discover Bank", "Ally Bank",
    "Marcus by Goldman Sachs", "PayPal", "Venmo", "Cash App", "Zelle",
    "Apple Pay", "Google Pay", "Coinbase", "Robinhood", "E*TRADE",
    "Fidelity", "Vanguard", "Universe"
]

RANDOM_SENDERS = [
    "Universe", "Abundance Source", "Wealth Generator", "Money Magnet",
    "Fortune Flow", "Prosperity Portal", "Golden Gateway", "Success Stream",
    "Manifest Hub", "Wealth Wizard", "Fortune Frequency", "Money Miracle"
]

MANIFESTATION_TYPES = [
    {"key": "instant", "text": "⚡ Instant Transfer"},
    {"key": "investment", "text": "📈 Investment Return"},
    {"key": "cashback", "text": "💰 Cashback Reward"},
    {"key": "bonus", "text": "🎁 Bonus Payment"}
]

# API Endpoints

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/register")
async def register_user(user_data: UserRegister):
    # Check if user exists
    existing_user = await database.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    new_user = {
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_password,
        "is_pro": False,
        "created_at": datetime.utcnow(),
        "subscription_status": None,
        "subscription_ends_at": None,
        "settings": ManifestationSettings().dict(),
        "stats": UserStats().dict(),
        "achievements": [],
        "custom_affirmations": [],
        "social_proof_submissions": []
    }
    
    await database.users.insert_one(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserProfile(
            user_id=user_id,
            email=user_data.email,
            name=user_data.name,
            is_pro=False,
            created_at=new_user["created_at"]
        )
    }

@app.post("/api/auth/login")
async def login_user(user_data: UserLogin):
    # Find user
    user = await database.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserProfile(
            user_id=user["user_id"],
            email=user["email"],
            name=user["name"],
            is_pro=user["is_pro"],
            created_at=user["created_at"],
            subscription_status=user.get("subscription_status"),
            subscription_ends_at=user.get("subscription_ends_at")
        )
    }

@app.get("/api/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    return UserProfile(
        user_id=current_user["user_id"],
        email=current_user["email"],
        name=current_user["name"],
        is_pro=current_user["is_pro"],
        created_at=current_user["created_at"],
        subscription_status=current_user.get("subscription_status"),
        subscription_ends_at=current_user.get("subscription_ends_at")
    )

@app.get("/api/user/settings")
async def get_user_settings(current_user: dict = Depends(get_current_user)):
    return current_user.get("settings", ManifestationSettings().dict())

@app.put("/api/user/settings")
async def update_user_settings(
    settings: ManifestationSettings,
    current_user: dict = Depends(get_current_user)
):
    await database.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": {"settings": settings.dict()}}
    )
    return {"message": "Settings updated successfully"}

@app.get("/api/user/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    return current_user.get("stats", UserStats().dict())

@app.put("/api/user/stats")
async def update_user_stats(
    stats: UserStats,
    current_user: dict = Depends(get_current_user)
):
    await database.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": {"stats": stats.dict()}}
    )
    return {"message": "Stats updated successfully"}

@app.get("/api/manifestation/generate")
async def generate_manifestation(current_user: dict = Depends(get_current_user)):
    settings = current_user.get("settings", {})
    
    # Check daily limits for free users
    stats = current_user.get("stats", {})
    today = datetime.utcnow().strftime("%Y-%m-%d")
    
    if not current_user["is_pro"] and stats.get("last_usage_date") == today and stats.get("daily_usage", 0) >= 10:
        raise HTTPException(status_code=429, detail="Daily limit reached. Upgrade to Pro for unlimited manifestations.")
    
    # Generate random manifestation
    min_amount = settings.get("min_amount", 10)
    max_amount = settings.get("max_amount", 1000)
    
    # Apply limits for free users
    if not current_user["is_pro"]:
        max_amount = min(max_amount, 100)
    
    amount = round(random.uniform(min_amount, max_amount), 2)
    
    # Select sender
    sender_mode = settings.get("sender_mode", "random")
    if sender_mode == "custom" and settings.get("custom_sender"):
        sender = settings["custom_sender"]
    else:
        sender = random.choice(RANDOM_SENDERS)
    
    # Select bank
    bank_selection = settings.get("bank_selection", "random")
    if bank_selection == "random":
        bank = random.choice(BANKS)
    else:
        bank = bank_selection
    
    # Select manifestation type
    manifestation_type = settings.get("manifestation_type", "random")
    if manifestation_type == "random":
        type_obj = random.choice(MANIFESTATION_TYPES)
        manifestation_type = type_obj["text"]
    else:
        type_obj = next((t for t in MANIFESTATION_TYPES if t["key"] == manifestation_type), MANIFESTATION_TYPES[0])
        manifestation_type = type_obj["text"]
    
    # Get Grabovoi code if enabled
    grabovoi_code = None
    if current_user["is_pro"] and settings.get("grabovai_enabled"):
        grabovoi_code = random.choice(GRABOVOI_CODES)["code"]
    
    # Update daily usage
    new_daily_usage = 1 if stats.get("last_usage_date") != today else stats.get("daily_usage", 0) + 1
    
    await database.users.update_one(
        {"user_id": current_user["user_id"]},
        {
            "$set": {
                "stats.daily_usage": new_daily_usage,
                "stats.last_usage_date": today,
                "stats.total_manifested": stats.get("total_manifested", 0) + amount
            }
        }
    )
    
    # Log notification
    notification_log = NotificationLog(
        user_id=current_user["user_id"],
        amount=amount,
        sender=sender,
        bank=bank,
        manifestation_type=manifestation_type,
        grabovoi_code=grabovoi_code
    )
    
    await database.notifications.insert_one(notification_log.dict())
    
    return {
        "amount": amount,
        "sender": sender,
        "bank": bank,
        "manifestation_type": manifestation_type,
        "grabovoi_code": grabovoi_code,
        "timestamp": datetime.utcnow()
    }

@app.get("/api/grabovoi/codes")
async def get_grabovoi_codes():
    return GRABOVOI_CODES

@app.get("/api/grabovoi/daily")
async def get_daily_grabovoi_code():
    # Return today's code based on date
    today = datetime.utcnow().day
    code_index = today % len(GRABOVOI_CODES)
    return GRABOVOI_CODES[code_index]

@app.get("/api/social-proof/active-users")
async def get_active_users():
    # Simulate active users count
    base_count = 1247
    variation = random.randint(-50, 100)
    return {"active_users": base_count + variation}

@app.get("/api/social-proof/success-stories")
async def get_success_stories():
    # Get recent success stories
    stories = await database.social_proof.find().sort("created_at", -1).limit(10).to_list(length=10)
    if not stories:
        # Return sample stories if none exist
        return [{
            "amount": 247.50,
            "code": "5207418",
            "description": "Received unexpected refund after focusing on the code for 3 days",
            "created_at": datetime.utcnow() - timedelta(hours=2)
        }]
    
    return stories

@app.post("/api/social-proof/submit")
async def submit_success_story(
    story: SocialProofEntry,
    current_user: dict = Depends(get_current_user)
):
    story.user_id = current_user["user_id"]
    await database.social_proof.insert_one(story.dict())
    return {"message": "Success story submitted"}

@app.get("/api/user/affirmations")
async def get_custom_affirmations(current_user: dict = Depends(get_current_user)):
    return current_user.get("custom_affirmations", [])

@app.post("/api/user/affirmations")
async def add_custom_affirmation(
    affirmation: CustomAffirmation,
    current_user: dict = Depends(get_current_user)
):
    await database.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$push": {"custom_affirmations": affirmation.dict()}}
    )
    return {"message": "Affirmation added"}

@app.post("/api/subscription/create-checkout-session")
async def create_checkout_session(
    plan_type: str,
    current_user: dict = Depends(get_current_user)
):
    if plan_type not in ["monthly", "yearly"]:
        raise HTTPException(status_code=400, detail="Invalid plan type")
    
    price_id = "price_monthly_444" if plan_type == "monthly" else "price_yearly_2999"
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'DigiManifest Pro - {plan_type.title()}',
                    },
                    'unit_amount': 444 if plan_type == "monthly" else 2999,  # in cents
                    'recurring': {
                        'interval': 'month' if plan_type == "monthly" else 'year',
                    },
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'{os.environ.get("FRONTEND_URL", "http://localhost:3000")}/success',
            cancel_url=f'{os.environ.get("FRONTEND_URL", "http://localhost:3000")}/cancel',
            client_reference_id=current_user["user_id"],
            metadata={
                'user_id': current_user["user_id"],
                'plan_type': plan_type
            }
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/community/stats")
async def get_community_stats():
    # Aggregate community statistics
    total_users = await database.users.count_documents({})
    total_manifested = await database.notifications.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(length=1)
    
    total_amount = total_manifested[0]["total"] if total_manifested else 0
    
    return {
        "total_users": max(total_users, 28000),  # Minimum for social proof
        "total_manifested": max(total_amount, 47000000),  # Minimum for social proof
        "success_rate": 92,
        "notifications_sent": max(total_users * 100, 1200000)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)