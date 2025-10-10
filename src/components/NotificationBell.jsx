/**
 * Notification Bell Component
 * Header notification bell with unread count and click to open notification center
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing } from 'lucide-react';
import { notificationService } from '../services/notificationService.js';
import NotificationCenter from './NotificationCenter.jsx';

const NotificationBell = ({ userId, className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUnreadCount();
      
      // Set up real-time listener for new notifications (simplified)
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadUnreadCount = async () => {
    try {
      const result = await notificationService.getNotificationStats(userId);
      
      if (result.success) {
        const newUnreadCount = result.data.unread;
        
        // Check if there are new notifications
        if (newUnreadCount > unreadCount) {
          setHasNewNotification(true);
          
          // Remove the animation after 3 seconds
          setTimeout(() => {
            setHasNewNotification(false);
          }, 3000);
        }
        
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleBellClick = () => {
    setIsNotificationCenterOpen(true);
    setHasNewNotification(false); // Stop animation when user opens notifications
  };

  const handleNotificationCenterClose = () => {
    setIsNotificationCenterOpen(false);
    loadUnreadCount(); // Refresh count when closing
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.button
          onClick={handleBellClick}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {hasNewNotification ? (
              <motion.div
                key="bell-ring"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                exit={{ rotate: 0 }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                <BellRing className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="bell-static"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Bell className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Count Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse Animation for New Notifications */}
          <AnimatePresence>
            {hasNewNotification && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-blue-400"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          {unreadCount > 0 ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}` : 'Notifications'}
        </div>
      </div>

      {/* Notification Center */}
      <AnimatePresence>
        {isNotificationCenterOpen && (
          <NotificationCenter
            userId={userId}
            isOpen={isNotificationCenterOpen}
            onClose={handleNotificationCenterClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationBell;