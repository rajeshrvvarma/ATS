import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, AlertCircle } from 'lucide-react';
import { login, loginWithGoogle } from '@/services/authService';
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setUser(result.user);
        
        // Check if 2FA is enabled
        if (result.user.twoFactorEnabled) {
          setShowTwoFactor(true);
        } else {
          onLogin?.(result.user);
          onNavigate('dashboard');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await loginWithGoogle();
      if (result.success) {
        onLogin?.(result.user);
        onNavigate('dashboard');
      }
    } catch (err) {
      setError(err.message);
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

          <button type="button" onClick={handleGoogle} disabled={isLoading} className="w-full py-3 rounded-lg bg-white text-slate-800 font-semibold hover:bg-slate-100 transition-colors">
            Continue with Google
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