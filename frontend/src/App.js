import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 flex items-center justify-center">
                <span className="text-white text-lg">∞</span>
              </div>
              <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400">
                DigiManifest
              </span>
            </div>
            <div>
              <button className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Quantum Wealth</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400">
                Manifestation
              </span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
              Transform your financial reality with AI-powered quantum manifestation technology that reprograms your subconscious for abundance.
            </p>
            <div className="mt-8">
              <button className="px-8 py-4 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity text-lg">
                Start Free Trial
              </button>
              <p className="mt-3 text-sm text-gray-400">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
          
          {/* Demo Notification */}
          <div className="mt-16 flex justify-center">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl">$</span>
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
                <div className="mt-4 text-xs text-gray-500">
                  <p>Powered by DigiManifest AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Revolutionary technology designed to reprogram your subconscious for financial abundance
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500/20 text-cyan-400 mb-4">
                <span className="text-xl">🔔</span>
              </div>
              <h3 className="text-lg font-medium text-white">Intelligent Notifications</h3>
              <p className="mt-2 text-gray-300">
                AI-powered push notifications delivered at optimal times when your subconscious is most receptive.
              </p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500/20 text-purple-400 mb-4">
                <span className="text-xl">🔢</span>
              </div>
              <h3 className="text-lg font-medium text-white">Grabovoi Codes</h3>
              <p className="mt-2 text-gray-300">
                Authentic numerical sequences that activate quantum fields of abundance through sacred geometry.
              </p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500/20 text-amber-400 mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-medium text-white">Subliminal Flash</h3>
              <p className="mt-2 text-gray-300">
                Millisecond-precision programming that bypasses your conscious mind to influence beliefs.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community Stats */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-6">Community Manifestation Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">1.2M+</p>
                  <p className="text-sm text-gray-400">Notifications Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">$47M+</p>
                  <p className="text-sm text-gray-400">Manifested</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">92%</p>
                  <p className="text-sm text-gray-400">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">28K+</p>
                  <p className="text-sm text-gray-400">Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;