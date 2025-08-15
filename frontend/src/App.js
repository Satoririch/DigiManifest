import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaInfinity as Infinity,
  FaBrain as Brain,
  FaAtom as Atom,
  FaDollarSign as DollarSign,
  FaBell as Bell,
  FaSquareRootAlt as SquareRoot,
  FaBolt as Zap,
  FaClock as Clock,
  FaUsers as Users,
  FaChartLine as TrendingUp,
  FaBars as Menu,
  FaTimes as X,
  FaPlay as Play,
  FaPause as Pause,
  FaCog as Settings,
  FaCrown as Crown,
  FaStar as Star,
  FaSignInAlt as LogIn,
  FaUserPlus as UserPlus
} from 'react-icons/fa';
import './App.css';

// API Service
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  // User endpoints
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
  
  getSettings: async (token) => {
    const response = await fetch(`${API_BASE}/api/user/settings`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
  
  updateSettings: async (token, settings) => {
    const response = await fetch(`${API_BASE}/api/user/settings`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings),
    });
    return response.json();
  },
  
  getStats: async (token) => {
    const response = await fetch(`${API_BASE}/api/user/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
  
  // Manifestation endpoints
  generateManifestation: async (token) => {
    const response = await fetch(`${API_BASE}/api/manifestation/generate`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
  
  getGrabovoiCodes: async () => {
    const response = await fetch(`${API_BASE}/api/grabovoi/codes`);
    return response.json();
  },
  
  getDailyCode: async () => {
    const response = await fetch(`${API_BASE}/api/grabovoi/daily`);
    return response.json();
  },
  
  // Community endpoints
  getActiveUsers: async () => {
    const response = await fetch(`${API_BASE}/api/social-proof/active-users`);
    return response.json();
  },
  
  getSuccessStories: async () => {
    const response = await fetch(`${API_BASE}/api/social-proof/success-stories`);
    return response.json();
  },
  
  getCommunityStats: async () => {
    const response = await fetch(`${API_BASE}/api/community/stats`);
    return response.json();
  }
};

// Components
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/20 rounded-full floating"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const Navigation = ({ user, onAuthClick, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="glass-card fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 flex items-center justify-center">
                  <Infinity className="text-white w-5 h-5" />
                </div>
                <span className="ml-2 text-xl font-bold quantum-gradient">DigiManifest</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium hover:text-cyan-400 transition-colors">Features</a>
                <a href="#technology" className="px-3 py-2 rounded-md text-sm font-medium hover:text-purple-400 transition-colors">Technology</a>
                <a href="#pricing" className="px-3 py-2 rounded-md text-sm font-medium hover:text-amber-400 transition-colors">Pricing</a>
                <a href="#about" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white transition-colors">About</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-md bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAuthClick('login')}
                    className="px-4 py-2 rounded-md text-white font-medium hover:text-cyan-400 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onAuthClick('register')}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <a href="#technology" className="block px-3 py-2 rounded-md text-base font-medium">Technology</a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium">About</a>
            {user ? (
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => onAuthClick('login')}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="w-full mt-2 px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const AuthModal = ({ mode, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (mode === 'register') {
        result = await api.register(formData);
      } else {
        result = await api.login({
          email: formData.email,
          password: formData.password,
        });
      }
      
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success(mode === 'register' ? 'Account created successfully!' : 'Login successful!');
        onSuccess(result.user);
        onClose();
      } else {
        toast.error(result.detail || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md holographic-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'register' ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => onClose()}
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            {mode === 'register' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ user, onStartManifestation }) => {
  const [dailyCode, setDailyCode] = useState(null);
  
  useEffect(() => {
    api.getDailyCode().then(setDailyCode).catch(console.error);
  }, []);
  
  return (
    <div className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Quantum Wealth</span>
              <span className="block quantum-gradient">Manifestation</span>
            </h1>
            <p className="mt-3 text-lg text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Transform your financial reality with AI-powered quantum manifestation technology that reprograms your subconscious for abundance.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-cyan-500/20 rounded-full p-2">
                      <Brain className="text-cyan-400 w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Neuroscience</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500/20 rounded-full p-2">
                      <Atom className="text-purple-400 w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Quantum Tech</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                {user ? (
                  <button
                    onClick={onStartManifestation}
                    className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity text-lg btn-glow"
                  >
                    Start Manifestation
                  </button>
                ) : (
                  <button className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity text-lg btn-glow">
                    Start Free Trial
                  </button>
                )}
                <p className="mt-3 text-sm text-gray-400">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl glass-card holographic-border p-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 flex items-center justify-center">
                    <DollarSign className="text-white w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white">Bank Transfer Notification</h3>
                <p className="mt-2 text-gray-300">Your subconscious is most receptive now</p>
                <div className="mt-6">
                  <div className="text-4xl font-bold text-white">+$3,745.00</div>
                  <p className="mt-1 text-gray-400">From: Quantum Investments LLC</p>
                </div>
                <div className="mt-6 flex justify-between">
                  <button className="flex-1 py-2 px-4 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                    Dismiss
                  </button>
                  <button className="flex-1 ml-3 py-2 px-4 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
                    Accept
                  </button>
                </div>
                {dailyCode && (
                  <div className="mt-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <p className="code-font text-lg font-bold text-purple-400">{dailyCode.code}</p>
                      <p className="mt-1 text-xs text-gray-400">{dailyCode.label}</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  <p>Powered by DigiManifest AI</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl opacity-70 -z-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full filter blur-3xl opacity-70 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Bell,
      title: "Intelligent Notifications",
      description: "AI-powered push notifications delivered at optimal times when your subconscious is most receptive to wealth programming.",
      color: "cyan"
    },
    {
      icon: SquareRoot,
      title: "Grabovoi Codes",
      description: "Authentic numerical sequences that activate quantum fields of abundance through sacred geometry and vibration.",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Subliminal Flash",
      description: "Millisecond-precision programming that bypasses your conscious mind to directly influence your subconscious beliefs.",
      color: "amber"
    },
    {
      icon: Clock,
      title: "Circadian Timing",
      description: "Manifestation aligned with your biological rhythms and sleep cycles for maximum subconscious absorption.",
      color: "green"
    },
    {
      icon: Users,
      title: "Social Proof",
      description: "Real-time success stories and community manifestations to reinforce your belief in abundance.",
      color: "pink"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your manifestation progress, engagement, and subconscious reprogramming effectiveness.",
      color: "indigo"
    }
  ];

  return (
    <div id="features" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="gradient-underline">Key Features</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
            Revolutionary technology designed to reprogram your subconscious for financial abundance
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-xl p-6 holographic-border notification-card">
                <div className={`flex items-center justify-center h-12 w-12 rounded-md bg-${feature.color}-500/20 text-${feature.color}-400`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                  <p className="mt-2 text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManifestationDashboard = ({ user, onLogout }) => {
  const [settings, setSettings] = useState({
    min_amount: 10,
    max_amount: 1000,
    frequency: "900",
    sender_mode: "random",
    custom_sender: "",
    bank_selection: "random",
    manifestation_type: "random",
    sound_enabled: true,
    volume: 50,
    grabovoi_enabled: false,
    subliminal_enabled: false,
    spaced_repetition: false,
    circadian_optimized: false,
    twenty_one_day_cycle: false
  });
  const [stats, setStats] = useState({
    total_manifested: 0,
    sessions_count: 0,
    consecutive_days: 0,
    total_code_views: 0,
    daily_usage: 0,
    last_usage_date: null
  });
  const [isActive, setIsActive] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  const [grabovaiCodes, setGrabovoiCodes] = useState([]);
  const [communityStats, setCommunityStats] = useState({});
  const [activeUsers, setActiveUsers] = useState(0);
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    loadUserData();
    loadGrabovoiCodes();
    loadCommunityStats();
  }, []);
  
  const loadUserData = async () => {
    try {
      const [settingsData, statsData] = await Promise.all([
        api.getSettings(token),
        api.getStats(token)
      ]);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };
  
  const loadGrabovoiCodes = async () => {
    try {
      const codes = await api.getGrabovoiCodes();
      setGrabovoiCodes(codes);
    } catch (error) {
      console.error('Failed to load Grabovoi codes:', error);
    }
  };
  
  const loadCommunityStats = async () => {
    try {
      const [communityData, activeUsersData] = await Promise.all([
        api.getCommunityStats(),
        api.getActiveUsers()
      ]);
      setCommunityStats(communityData);
      setActiveUsers(activeUsersData.active_users);
    } catch (error) {
      console.error('Failed to load community stats:', error);
    }
  };
  
  const triggerManifestation = async () => {
    try {
      const manifestation = await api.generateManifestation(token);
      setLastNotification(manifestation);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        total_manifested: prevStats.total_manifested + manifestation.amount,
        daily_usage: prevStats.daily_usage + 1
      }));
      
      toast.success(`💰 Manifested $${manifestation.amount} from ${manifestation.sender}!`);
      
      // Show notification-style alert
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`DigiManifest: +$${manifestation.amount}`, {
          body: `From: ${manifestation.sender}`,
          icon: '/logo192.png'
        });
      }
    } catch (error) {
      if (error.message.includes('429')) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited manifestations.');
      } else {
        toast.error('Failed to generate manifestation');
      }
    }
  };
  
  const saveSettings = async () => {
    try {
      await api.updateSettings(token, settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };
  
  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      toast.success('Manifestation paused');
    } else {
      setIsActive(true);
      toast.success('Manifestation activated');
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };
  
  const dailyLimit = user?.is_pro ? Infinity : 10;
  const usagePercentage = user?.is_pro ? 0 : (stats.daily_usage / dailyLimit) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass-card rounded-2xl p-6 mb-8 holographic-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold quantum-gradient">DigiManifest Dashboard</h1>
              <p className="text-gray-300 mt-2">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${user?.is_pro ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                {user?.is_pro ? '👑 PRO' : '🆓 FREE'}
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400">${stats.total_manifested?.toLocaleString() || 0}</div>
            <div className="text-gray-300 text-sm mt-1">Total Manifested</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.sessions_count || 0}</div>
            <div className="text-gray-300 text-sm mt-1">Sessions</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400">{stats.consecutive_days || 0}</div>
            <div className="text-gray-300 text-sm mt-1">Day Streak</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{activeUsers}</div>
            <div className="text-gray-300 text-sm mt-1">Active Users</div>
          </div>
        </div>
        
        {/* Usage Display for Free Users */}
        {!user?.is_pro && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Daily Manifestations</h3>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-gray-300 text-sm mt-2">{stats.daily_usage || 0} / {dailyLimit} used today</p>
            {stats.daily_usage >= dailyLimit && (
              <p className="text-red-400 text-sm mt-1">Daily limit reached! Upgrade to Pro for unlimited manifestations.</p>
            )}
          </div>
        )}
        
        {/* Main Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manifestation Controls */}
            <div className="glass-card rounded-xl p-6 holographic-border">
              <h3 className="text-xl font-medium text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-cyan-400" />
                Manifestation Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Amount ($)</label>
                  <input
                    type="number"
                    value={settings.min_amount}
                    onChange={(e) => setSettings({...settings, min_amount: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="1"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Amount ($)</label>
                  <input
                    type="number"
                    value={settings.max_amount}
                    onChange={(e) => setSettings({...settings, max_amount: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="1"
                    step="0.01"
                    max={user?.is_pro ? undefined : 100}
                  />
                  {!user?.is_pro && (
                    <p className="text-xs text-gray-400 mt-1">Free plan limited to $100</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleStartStop}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    isActive 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 inline mr-2" />
                      Stop Manifestation
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 inline mr-2" />
                      Start Manifestation
                    </>
                  )}
                </button>
                
                <button
                  onClick={triggerManifestation}
                  disabled={!user?.is_pro && stats.daily_usage >= dailyLimit}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  ⚡ Manifest Now
                </button>
              </div>
            </div>
            
            {/* Settings */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-medium text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-purple-400" />
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sound Enabled</span>
                  <button
                    onClick={() => setSettings({...settings, sound_enabled: !settings.sound_enabled})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.sound_enabled ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.sound_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {user?.is_pro && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Grabovoi Codes</span>
                    <button
                      onClick={() => setSettings({...settings, grabovoi_enabled: !settings.grabovoi_enabled})}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.grabovoi_enabled ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.grabovoi_enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={saveSettings}
                  className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            {/* Latest Manifestation */}
            {lastNotification && (
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Latest Manifestation</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">+${lastNotification.amount}</div>
                  <div className="text-gray-300 text-sm mt-1">From: {lastNotification.sender}</div>
                  <div className="text-gray-400 text-xs mt-1">{lastNotification.manifestation_type}</div>
                  {lastNotification.grabovoi_code && (
                    <div className="mt-3 p-2 bg-purple-900/30 rounded">
                      <div className="code-font text-purple-400">{lastNotification.grabovoi_code}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Grabovoi Codes */}
            {user?.is_pro && grabovaiCodes.length > 0 && (
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Sacred Codes</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {grabovaiCodes.map((code, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-300">{code.label}</div>
                        <div className="code-font text-purple-400 font-medium">{code.code}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code.code);
                          toast.success(`Copied ${code.code}`);
                        }}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Community Stats */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Community Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Users</span>
                  <span className="text-cyan-400 font-medium">{communityStats.total_users?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Manifested</span>
                  <span className="text-purple-400 font-medium">${communityStats.total_manifested?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-green-400 font-medium">{communityStats.success_rate}%</span>
                </div>
              </div>
            </div>
            
            {/* Upgrade Prompt for Free Users */}
            {!user?.is_pro && (
              <div className="glass-card rounded-xl p-6 holographic-border">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-300 text-sm mb-4">Unlock unlimited manifestations, Grabovoi codes, and advanced features</p>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                    <Star className="w-4 h-4 inline mr-2" />
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [currentView, setCurrentView] = useState('landing');
  
  useEffect(() => {
    // Check for stored user session
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setCurrentView('dashboard');
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('landing');
    toast.success('Logged out successfully');
  };
  
  const handleAuthClick = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };
  
  const handleStartManifestation = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      handleAuthClick('register');
    }
  };
  
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#e2e8f0',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          },
        }}
      />
      
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              {currentView === 'landing' ? (
                <>
                  <Navigation 
                    user={user} 
                    onAuthClick={handleAuthClick} 
                    onLogout={handleLogout} 
                  />
                  <HeroSection 
                    user={user}
                    onStartManifestation={handleStartManifestation}
                  />
                  <FeaturesSection />
                </>
              ) : (
                <ManifestationDashboard 
                  user={user} 
                  onLogout={handleLogout} 
                />
              )}
              
              <AuthModal
                mode={authModal.mode}
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ ...authModal, isOpen: false })}
                onSuccess={handleAuthSuccess}
              />
            </>
          } />
          
          <Route path="/success" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="glass-card rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-green-400 mb-4">Payment Successful!</h1>
                <p className="text-gray-300 mb-6">Welcome to DigiManifest Pro! Your upgrade is now active.</p>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          } />
          
          <Route path="/cancel" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="glass-card rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Payment Cancelled</h1>
                <p className="text-gray-300 mb-6">No worries! You can upgrade to Pro anytime.</p>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg"
                >
                  Continue with Free Plan
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </div>
  );
};

export default App;