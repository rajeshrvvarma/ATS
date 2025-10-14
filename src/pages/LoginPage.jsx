import React, { useState, useEffect } from 'react';
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
  const [cssLoaded, setCssLoaded] = useState(false);

  // Wait for CSS to be fully loaded before showing animations
  useEffect(() => {
    const checkCSSLoaded = () => {
      // Check if document is ready and stylesheets are loaded
      if (document.readyState === 'complete') {
        setCssLoaded(true);
      } else {
        // Wait for load event
        const handleLoad = () => {
          setTimeout(() => setCssLoaded(true), 50);
        };
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    };

    checkCSSLoaded();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-teal-900 flex items-center justify-center py-12 px-4 relative">
      {/* Show loading spinner while CSS loads */}
      {!cssLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-50">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Floating particles like homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 bg-green-400 rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-green-300 rounded-full top-32 left-32 animate-pulse delay-100"></div>
        <div className="absolute w-3 h-3 bg-green-500 rounded-full top-64 right-20 animate-pulse delay-200"></div>
        <div className="absolute w-1 h-1 bg-green-400 rounded-full bottom-32 left-20 animate-pulse delay-300"></div>
        <div className="absolute w-2 h-2 bg-green-300 rounded-full bottom-10 right-40 animate-pulse delay-500"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={cssLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-5xl w-full content-card flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left: Content - Area 1: Dark green like homepage */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-slate-800 via-green-800 to-teal-800 relative">
          {/* Small floating dots in the left section */}
          <div className="absolute w-1 h-1 bg-green-400 rounded-full top-4 right-8 animate-pulse"></div>
          <div className="absolute w-2 h-2 bg-green-300 rounded-full bottom-8 left-4 animate-pulse delay-200"></div>
          
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">Welcome Back to Agnidhra Technologies</h2>
          <p className="text-lg text-green-100 mb-6">
            Continue your journey to become a cybersecurity expert. Access your personalized learning dashboard, track your progress, and unlock new courses in cybersecurity, technology, and more.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-white">Industry-Ready Skills</h4>
                <p className="text-green-200 text-sm">Learn from real-world scenarios and industry best practices</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-white">Hands-On Learning</h4>
                <p className="text-green-200 text-sm">Practice with live labs, tools, and real security environments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-white">Career Growth</h4>
                <p className="text-green-200 text-sm">Join 1000+ students who've advanced their cybersecurity careers</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-700/50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-green-100 font-medium">"The only way to stay ahead in cybersecurity is to never stop learning."</p>
            <p className="text-green-300 text-sm mt-1">- Agnidhra Technologies</p>
          </div>
          <div className="mt-6 text-green-200 text-sm">
            <div className="flex items-center space-x-4 mb-2">
              <span className="font-semibold">🎯 1000+ Students Trained</span>
              <span className="font-semibold">🏆 Industry Experts</span>
            </div>
            <p>Join the community that's shaping the future of cybersecurity</p>
          </div>
        </div>
        {/* Right: Login Form - Area 2 & 3: Dark background with form styling */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-br from-slate-700/90 to-slate-800/90">
          <div className="max-w-sm mx-auto w-full">
            <h3 className="text-2xl font-bold text-gradient-blue mb-2 text-center">Sign In</h3>
            <p className="text-slate-300 text-center mb-6">Access your learning dashboard</p>
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isLoading}
              className="btn-gradient w-full gap-3 py-4 px-6 text-lg mb-4"
            >
              <FcGoogle className="w-6 h-6" />
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                className="text-green-600 hover:text-green-500 text-sm"
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