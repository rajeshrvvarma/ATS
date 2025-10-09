import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PWA Install Prompt Component
 * Encourages users to install the app for better mobile experience
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      // Check for PWA display mode
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      // Check for mobile app context
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isPWA) {
        setIsInstalled(true);
        return;
      }

      // Check localStorage for previous dismissal
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show prompt if:
      // 1. Not dismissed or dismissed more than 7 days ago
      // 2. User is on mobile device
      // 3. Not already installed
      if ((!dismissed || daysSinceDismissal > 7) && isMobile) {
        // Delay showing prompt to avoid being intrusive
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
      }
    };

    checkInstallation();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support automatic installation
      showManualInstallInstructions();
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setIsInstalled(true);
      } else {
        console.log('PWA installation declined');
        handleDismiss(7); // Don't show again for 7 days if declined
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('PWA installation failed:', error);
      showManualInstallInstructions();
    }
  };

  const handleDismiss = (days = 1) => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = "To install this app:\n\n";
    
    if (isIOS) {
      instructions += "1. Tap the Share button (square with arrow)\n";
      instructions += "2. Select 'Add to Home Screen'\n";
      instructions += "3. Tap 'Add' to install";
    } else if (isAndroid) {
      instructions += "1. Tap the menu (three dots) in your browser\n";
      instructions += "2. Select 'Add to Home Screen' or 'Install App'\n";
      instructions += "3. Tap 'Add' to install";
    } else {
      instructions += "1. Open browser menu\n";
      instructions += "2. Look for 'Add to Home Screen' or 'Install'\n";
      instructions += "3. Follow the prompts to install";
    }
    
    alert(instructions);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:left-auto md:right-4"
      >
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-2xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">Install Our App</h3>
              <p className="text-sky-100 text-sm mb-3 leading-relaxed">
                Get the best learning experience with offline access and instant notifications
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                  <Wifi className="w-3 h-3" />
                  <span>Offline access</span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                  <Zap className="w-3 h-3" />
                  <span>Faster loading</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={() => handleDismiss(1)}
                  className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            
            <button
              onClick={() => handleDismiss(7)}
              className="flex-shrink-0 text-sky-200 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * PWA Status Indicator Component
 * Shows install status and app shortcuts when installed
 */
export function PWAStatusIndicator() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    setIsInstalled(isPWA);

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isInstalled) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isOnline 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
      }`}>
        {isOnline ? '● Online' : '● Offline Mode'}
      </div>
    </div>
  );
}

/**
 * Register PWA Service Worker
 */
export function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA Service Worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('PWA update available');
          const newWorker = registration.installing;
          
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              if (confirm('A new version is available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
        
      } catch (error) {
        console.error('PWA Service Worker registration failed:', error);
      }
    });
  }
}