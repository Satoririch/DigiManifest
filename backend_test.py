#!/usr/bin/env python3
"""
DigiManifest Backend API Testing Suite
Tests all backend endpoints for functionality and integration
"""

import requests
import sys
import json
from datetime import datetime
import time

class DigiManifestAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        self.test_user_password = "TestPass123!"
        self.test_user_name = "Test User"

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def make_request(self, method, endpoint, data=None, auth_required=False):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def test_health_endpoint(self):
        """Test health check endpoint"""
        print("\n🔍 Testing Health Endpoint...")
        response = self.make_request('GET', 'api/health')
        
        if response and response.status_code == 200:
            data = response.json()
            success = 'status' in data and data['status'] == 'healthy'
            return self.log_test("Health Check", success, f"Status: {data.get('status', 'unknown')}")
        else:
            return self.log_test("Health Check", False, f"Status code: {response.status_code if response else 'No response'}")

    def test_user_registration(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        
        user_data = {
            "email": self.test_user_email,
            "password": self.test_user_password,
            "name": self.test_user_name
        }
        
        response = self.make_request('POST', 'api/auth/register', user_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                self.token = data['access_token']
                self.user_data = data['user']
                return self.log_test("User Registration", True, f"User ID: {data['user']['user_id']}")
            else:
                return self.log_test("User Registration", False, "Missing token or user data")
        else:
            error_msg = response.json().get('detail', 'Unknown error') if response else 'No response'
            return self.log_test("User Registration", False, f"Status: {response.status_code if response else 'No response'}, Error: {error_msg}")

    def test_user_login(self):
        """Test user login with existing credentials"""
        print("\n🔍 Testing User Login...")
        
        login_data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        response = self.make_request('POST', 'api/auth/login', login_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                # Update token for subsequent tests
                self.token = data['access_token']
                return self.log_test("User Login", True, f"Token received for user: {data['user']['name']}")
            else:
                return self.log_test("User Login", False, "Missing token or user data")
        else:
            error_msg = response.json().get('detail', 'Unknown error') if response else 'No response'
            return self.log_test("User Login", False, f"Status: {response.status_code if response else 'No response'}, Error: {error_msg}")

    def test_user_profile(self):
        """Test getting user profile"""
        print("\n🔍 Testing User Profile...")
        
        response = self.make_request('GET', 'api/user/profile', auth_required=True)
        
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ['user_id', 'email', 'name', 'is_pro', 'created_at']
            has_all_fields = all(field in data for field in required_fields)
            return self.log_test("User Profile", has_all_fields, f"Email: {data.get('email', 'N/A')}, Pro: {data.get('is_pro', 'N/A')}")
        else:
            return self.log_test("User Profile", False, f"Status: {response.status_code if response else 'No response'}")

    def test_user_settings(self):
        """Test getting and updating user settings"""
        print("\n🔍 Testing User Settings...")
        
        # Get settings
        response = self.make_request('GET', 'api/user/settings', auth_required=True)
        
        if response and response.status_code == 200:
            settings = response.json()
            get_success = 'min_amount' in settings and 'max_amount' in settings
            self.log_test("Get User Settings", get_success, f"Min: ${settings.get('min_amount', 'N/A')}, Max: ${settings.get('max_amount', 'N/A')}")
            
            if get_success:
                # Update settings
                updated_settings = settings.copy()
                updated_settings['min_amount'] = 25.0
                updated_settings['max_amount'] = 500.0
                
                update_response = self.make_request('PUT', 'api/user/settings', updated_settings, auth_required=True)
                
                if update_response and update_response.status_code == 200:
                    return self.log_test("Update User Settings", True, "Settings updated successfully")
                else:
                    return self.log_test("Update User Settings", False, f"Status: {update_response.status_code if update_response else 'No response'}")
            else:
                return False
        else:
            return self.log_test("Get User Settings", False, f"Status: {response.status_code if response else 'No response'}")

    def test_user_stats(self):
        """Test getting user stats"""
        print("\n🔍 Testing User Stats...")
        
        response = self.make_request('GET', 'api/user/stats', auth_required=True)
        
        if response and response.status_code == 200:
            stats = response.json()
            required_fields = ['total_manifested', 'sessions_count', 'consecutive_days', 'daily_usage']
            has_all_fields = all(field in stats for field in required_fields)
            return self.log_test("User Stats", has_all_fields, f"Total: ${stats.get('total_manifested', 0)}, Daily: {stats.get('daily_usage', 0)}")
        else:
            return self.log_test("User Stats", False, f"Status: {response.status_code if response else 'No response'}")

    def test_manifestation_generation(self):
        """Test manifestation generation"""
        print("\n🔍 Testing Manifestation Generation...")
        
        response = self.make_request('GET', 'api/manifestation/generate', auth_required=True)
        
        if response and response.status_code == 200:
            manifestation = response.json()
            required_fields = ['amount', 'sender', 'bank', 'manifestation_type', 'timestamp']
            has_all_fields = all(field in manifestation for field in required_fields)
            
            # Check if amount is within expected range for free users
            amount = manifestation.get('amount', 0)
            amount_valid = 0 < amount <= 100  # Free user limit
            
            success = has_all_fields and amount_valid
            return self.log_test("Manifestation Generation", success, 
                               f"Amount: ${amount}, Sender: {manifestation.get('sender', 'N/A')}, Bank: {manifestation.get('bank', 'N/A')}")
        elif response and response.status_code == 429:
            # Daily limit reached - this is expected behavior
            return self.log_test("Manifestation Generation", True, "Daily limit reached (expected for free users)")
        else:
            return self.log_test("Manifestation Generation", False, f"Status: {response.status_code if response else 'No response'}")

    def test_grabovoi_codes(self):
        """Test Grabovoi codes endpoints"""
        print("\n🔍 Testing Grabovoi Codes...")
        
        # Test getting all codes
        response = self.make_request('GET', 'api/grabovoi/codes')
        
        if response and response.status_code == 200:
            codes = response.json()
            codes_success = isinstance(codes, list) and len(codes) > 0
            self.log_test("Get Grabovoi Codes", codes_success, f"Found {len(codes)} codes")
            
            # Test daily code
            daily_response = self.make_request('GET', 'api/grabovoi/daily')
            
            if daily_response and daily_response.status_code == 200:
                daily_code = daily_response.json()
                daily_success = 'code' in daily_code and 'label' in daily_code
                return self.log_test("Get Daily Grabovoi Code", daily_success, f"Code: {daily_code.get('code', 'N/A')}")
            else:
                return self.log_test("Get Daily Grabovoi Code", False, f"Status: {daily_response.status_code if daily_response else 'No response'}")
        else:
            return self.log_test("Get Grabovoi Codes", False, f"Status: {response.status_code if response else 'No response'}")

    def test_social_proof_endpoints(self):
        """Test social proof endpoints"""
        print("\n🔍 Testing Social Proof Endpoints...")
        
        # Test active users
        response = self.make_request('GET', 'api/social-proof/active-users')
        
        if response and response.status_code == 200:
            data = response.json()
            active_users_success = 'active_users' in data and isinstance(data['active_users'], int)
            self.log_test("Get Active Users", active_users_success, f"Active users: {data.get('active_users', 'N/A')}")
            
            # Test success stories
            stories_response = self.make_request('GET', 'api/social-proof/success-stories')
            
            if stories_response and stories_response.status_code == 200:
                stories = stories_response.json()
                stories_success = isinstance(stories, list)
                return self.log_test("Get Success Stories", stories_success, f"Found {len(stories)} stories")
            else:
                return self.log_test("Get Success Stories", False, f"Status: {stories_response.status_code if stories_response else 'No response'}")
        else:
            return self.log_test("Get Active Users", False, f"Status: {response.status_code if response else 'No response'}")

    def test_community_stats(self):
        """Test community stats endpoint"""
        print("\n🔍 Testing Community Stats...")
        
        response = self.make_request('GET', 'api/community/stats')
        
        if response and response.status_code == 200:
            stats = response.json()
            required_fields = ['total_users', 'total_manifested', 'success_rate', 'notifications_sent']
            has_all_fields = all(field in stats for field in required_fields)
            return self.log_test("Community Stats", has_all_fields, 
                               f"Users: {stats.get('total_users', 'N/A')}, Total: ${stats.get('total_manifested', 'N/A')}")
        else:
            return self.log_test("Community Stats", False, f"Status: {response.status_code if response else 'No response'}")

    def test_multiple_manifestations(self):
        """Test multiple manifestations to check daily limits"""
        print("\n🔍 Testing Daily Limits (Multiple Manifestations)...")
        
        successful_manifestations = 0
        max_attempts = 12  # Try more than the free limit of 10
        
        for i in range(max_attempts):
            response = self.make_request('GET', 'api/manifestation/generate', auth_required=True)
            
            if response and response.status_code == 200:
                successful_manifestations += 1
            elif response and response.status_code == 429:
                # Hit daily limit
                break
            else:
                break
            
            time.sleep(0.1)  # Small delay between requests
        
        # For free users, should hit limit around 10
        limit_working = successful_manifestations <= 10
        return self.log_test("Daily Limit Enforcement", limit_working, 
                           f"Generated {successful_manifestations} manifestations before limit")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting DigiManifest Backend API Tests")
        print("=" * 50)
        
        # Basic connectivity
        if not self.test_health_endpoint():
            print("❌ Health check failed - backend may not be running")
            return False
        
        # Authentication flow
        if not self.test_user_registration():
            print("❌ Registration failed - stopping tests")
            return False
        
        if not self.test_user_login():
            print("❌ Login failed - stopping tests")
            return False
        
        # User data endpoints
        self.test_user_profile()
        self.test_user_settings()
        self.test_user_stats()
        
        # Core functionality
        self.test_manifestation_generation()
        self.test_grabovoi_codes()
        self.test_social_proof_endpoints()
        self.test_community_stats()
        
        # Advanced testing
        self.test_multiple_manifestations()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend is working correctly.")
            return True
        else:
            failed_tests = self.tests_run - self.tests_passed
            print(f"⚠️  {failed_tests} test(s) failed. Check the issues above.")
            return False

def main():
    """Main test execution"""
    # Check if we should use the public endpoint
    try:
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            for line in env_content.split('\n'):
                if line.startswith('REACT_APP_BACKEND_URL='):
                    backend_url = line.split('=', 1)[1].strip()
                    print(f"Using backend URL from frontend .env: {backend_url}")
                    tester = DigiManifestAPITester(backend_url)
                    break
            else:
                tester = DigiManifestAPITester()
    except:
        tester = DigiManifestAPITester()
    
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())