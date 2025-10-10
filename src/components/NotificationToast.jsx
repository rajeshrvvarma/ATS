/**
 * Notification Toast Component
 * Shows temporary in-app notifications with animations
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Trophy,
  Zap,
  MessageSquare,
  Users
} from 'lucide-react';
import { NOTIFICATION_TYPES } from '../services/notificationService.js';

const NotificationToast = ({ 
  notification, 
  onDismiss, 
  duration = 5000,
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const getToastConfig = () => {
    const configs = {
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: {
        icon: Trophy,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      },
      [NOTIFICATION_TYPES.LEVEL_UP]: {
        icon: Zap,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      },
      [NOTIFICATION_TYPES.FORUM_REPLY]: {
        icon: MessageSquare,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      },
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: {
        icon: Users,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: {
        icon: Users,
        color: 'bg-indigo-500',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        textColor: 'text-indigo-800'
      },
      success: {
        icon: CheckCircle,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      error: {
        icon: AlertCircle,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      },
      warning: {
        icon: AlertTriangle,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      },
      info: {
        icon: Info,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      }
    };

    return configs[notification.type] || configs.info;
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    return positions[position] || positions['top-right'];
  };

  const getAnimationConfig = () => {
    const animations = {
      'top-right': {
        initial: { opacity: 0, x: 300, y: -50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 300, y: -50 }
      },
      'top-left': {
        initial: { opacity: 0, x: -300, y: -50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -300, y: -50 }
      },
      'top-center': {
        initial: { opacity: 0, y: -100, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -100, scale: 0.9 }
      },
      'bottom-right': {
        initial: { opacity: 0, x: 300, y: 50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 300, y: 50 }
      },
      'bottom-left': {
        initial: { opacity: 0, x: -300, y: 50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -300, y: 50 }
      },
      'bottom-center': {
        initial: { opacity: 0, y: 100, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 100, scale: 0.9 }
      }
    };

    return animations[position] || animations['top-right'];
  };

  const config = getToastConfig();
  const IconComponent = config.icon;
  const animationConfig = getAnimationConfig();

  if (!notification) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animationConfig.initial}
            animate={animationConfig.animate}
            exit={animationConfig.exit}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`
              ${config.bgColor} ${config.borderColor} ${config.textColor}
              border rounded-lg shadow-lg overflow-hidden
            `}
          >
            {/* Progress bar for auto-dismiss */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`h-1 ${config.color}`}
              />
            )}

            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${config.color} text-white flex-shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium leading-5">
                    {notification.title}
                  </h4>
                  
                  {notification.body && (
                    <p className="text-sm mt-1 opacity-90">
                      {notification.body}
                    </p>
                  )}

                  {/* Action buttons for specific notification types */}
                  {(notification.type === NOTIFICATION_TYPES.MENTORSHIP_REQUEST ||
                    notification.type === NOTIFICATION_TYPES.STUDY_GROUP_INVITATION) && (
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors">
                        View
                      </button>
                      {notification.type === NOTIFICATION_TYPES.MENTORSHIP_REQUEST && (
                        <button className="text-xs px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors">
                          Accept
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toasts with stacking
 */
export const ToastContainer = ({ toasts, onDismiss, position = 'top-right' }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              zIndex: 50 + index
            }}
          >
            <NotificationToast
              notification={toast}
              onDismiss={() => onDismiss(toast.id)}
              position={position}
              duration={toast.duration}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Hook for managing toasts
 */
export const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (notification) => {
    const id = Date.now() + Math.random();
    const toast = { ...notification, id };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };
};

export default NotificationToast;