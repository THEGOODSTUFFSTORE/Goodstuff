"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, TrendingUp, Package, Users, BarChart3 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  // Auto-focus email input on mount
  useEffect(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Starting admin login process...');
      
      // First try to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase auth successful for user:', userCredential.user.uid);
      
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      console.log('🎫 Got ID token, length:', idToken.length);
      
      // Get token result to check claims
      const tokenResult = await userCredential.user.getIdTokenResult();
      console.log('👑 Token claims:', tokenResult.claims);
      console.log('🛡️ Admin claim:', tokenResult.claims.admin);
      
      // Send the ID token to backend
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      console.log('🌐 Session API response status:', sessionResponse.status);
      const sessionData = await sessionResponse.json();
      console.log('📦 Session response data:', sessionData);

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || 'Failed to create session');
      }

      console.log('🎉 Session created successfully, isAdmin:', sessionData.isAdmin);
      
      // Redirect to admin page after successful login
      router.push('/admin');
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        fullError: error
      });
      
      // Handle Firebase Auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          default:
            setError(error.message || 'Failed to login. Please try again.');
        }
      } else {
        // Handle session creation errors
        setError(error.message || 'Failed to create session. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Package,
      title: 'Product Management',
      description: 'Manage your entire product catalog with ease'
    },
    {
      icon: Users,
      title: 'Customer Insights',
      description: 'Track customer behavior and order history'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Monitor sales, trends, and business performance'
    },
    {
      icon: TrendingUp,
      title: 'Order Processing',
      description: 'Handle orders efficiently with real-time updates'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center">
        <div className="max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Goodstuff</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Take control of your business with powerful admin tools
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Goodstuff</h1>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Admin Access
              </h2>
              <p className="text-slate-300">
                Sign in to your admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${isFocused.email ? 'text-blue-400' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    className={`block w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isFocused.email ? 'border-blue-400' : 'border-white/20'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 ${isFocused.password ? 'text-blue-400' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    className={`block w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isFocused.password ? 'border-blue-400' : 'border-white/20'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-xs text-slate-400">
                Secure access to your business dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 