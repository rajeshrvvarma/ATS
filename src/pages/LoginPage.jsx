import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle } from '@/services/firebaseAuthService';
import TwoFactorAuth from '@/components/TwoFactorAuth';

/**
 * LoginPage - User authentication with 2FA support
 */
export default function LoginPage({ onNavigate, onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [user, setUser] = useState(null);

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await loginWithGoogle();
      if (result.success) {
        // Check if 2FA is enabled (for future implementation)
        if (result.userData?.twoFactorEnabled) {
          setUser(result.user);
          setShowTwoFactor(true);
        } else {
          onLogin?.(result.user);
          // Check for return URL
          const returnUrl = localStorage.getItem('returnUrl');
          if (returnUrl) {
            localStorage.removeItem('returnUrl');
            // All learning-related URLs now go to dashboard
            if (returnUrl === '/video-learning' || returnUrl.includes('course=')) {
              onNavigate('dashboard');
            } else {
              onNavigate('dashboard');
            }
          } else {
            onNavigate('dashboard');
          }
        }
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
    // Check for return URL
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      // All learning-related URLs now go to dashboard
      onNavigate('dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left: Content */}
  <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 animate-gradient-x">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-blue-800 mb-4 drop-shadow">Welcome Back to Agnidhra Technologies</h2>
          <p className="text-lg text-slate-700 mb-6">
            Continue your journey to become a cybersecurity expert. Access your personalized learning dashboard, track your progress, and unlock new courses in cybersecurity, technology, and more.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-slate-800">Industry-Ready Skills</h4>
                <p className="text-slate-600 text-sm">Learn from real-world scenarios and industry best practices</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-slate-800">Hands-On Learning</h4>
                <p className="text-slate-600 text-sm">Practice with live labs, tools, and real security environments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-slate-800">Career Growth</h4>
                <p className="text-slate-600 text-sm">Join 1000+ students who've advanced their cybersecurity careers</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-slate-700 font-medium">"The only way to stay ahead in cybersecurity is to never stop learning."</p>
            <p className="text-slate-500 text-sm mt-1">- Agnidhra Technologies</p>
          </div>
          <div className="mt-6 text-slate-600 text-sm">
            <div className="flex items-center space-x-4 mb-2">
              <span className="font-semibold">🎯 1000+ Students Trained</span>
              <span className="font-semibold">🏆 Industry Experts</span>
            </div>
            <p>Join the community that's shaping the future of cybersecurity</p>
          </div>
        </div>
        {/* Right: Login Form */}
  <div className="flex-1 p-8 flex flex-col justify-center bg-white border-l border-slate-100">
          <div className="max-w-sm mx-auto w-full">
            <h3 className="text-2xl font-bold text-blue-700 mb-2 text-center">Sign In</h3>
            <p className="text-slate-600 text-center mb-6">Access your learning dashboard</p>
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg mb-4"
            >
              <FcGoogle className="w-6 h-6" />
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                  Signing in with Google...
                </div>
              ) : (
                'Sign in with Google'
              )}
            </button>
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Secure authentication powered by Google
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Your Google account will be used to access the learning platform
              </p>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-sky-500 hover:text-sky-400 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
        {/* Two-Factor Authentication Modal */}
        {showTwoFactor && (
          <TwoFactorAuth
            onVerify={handleTwoFactorSuccess}
            onCancel={handleTwoFactorCancel}
          />
        )}
      </motion.div>
    </div>
  );
}