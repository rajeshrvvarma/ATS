import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, AlertCircle } from 'lucide-react';
import { loginStudent, loginWithGoogle } from '@/services/firebaseAuthService';
import TwoFactorAuth from '@/components/TwoFactorAuth';

/**
 * LoginPage - User authentication with 2FA support
 */
export default function LoginPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginStudent(formData.email, formData.password);
      
      if (result.success) {
        setUser(result.user);
        
        // Check if 2FA is enabled (for future implementation)
        if (result.userData?.twoFactorEnabled) {
          setShowTwoFactor(true);
        } else {
          onLogin?.(result.user);
          onNavigate('dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await loginWithGoogle();
      if (result.success) {
        onLogin?.(result.user);
        onNavigate('dashboard');
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = () => {
    onLogin?.(user);
    onNavigate('dashboard');
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-2 text-slate-400">
            Access your learning dashboard
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900 px-2 text-slate-400">or</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogle} 
            disabled={isLoading} 
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-600 rounded-lg bg-white text-slate-800 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Demo Credentials (match mock authService.js) */}
          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Demo Credentials (Development Only):</h3>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong>Admin:</strong> admin@agnidhra.com / SecureAdmin@2024!</div>
              <div><strong>Owner (admin perms):</strong> owner@agnidhra.com / OwnerPass@2024!</div>
              <div><strong>Student:</strong> student@agnidhra.com / StudentDemo@2024!</div>
            </div>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-sky-400 hover:text-sky-300 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      {showTwoFactor && (
        <TwoFactorAuth
          onVerify={handleTwoFactorSuccess}
          onCancel={handleTwoFactorCancel}
        />
      )}
    </div>
  );
}