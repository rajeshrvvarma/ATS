/**
 * Notification Center Component
 * Displays user notifications with real-time updates
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing, 
  Settings, 
  Check, 
  CheckCheck, 
  X,
  Filter,
  RefreshCw,
  MessageSquare,
  Users,
  Trophy,
  Zap,
  Clock,
  BookOpen,
  Mail,
  Speaker
} from 'lucide-react';
import { notificationService, NOTIFICATION_TYPES } from '../services/notificationService.js';
import NotificationPreferences from './NotificationPreferences.jsx';

const NotificationCenter = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    clicked: 0,
    clickRate: 0
  });

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications();
      loadStats();
    }
  }, [isOpen, userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getUserNotifications(userId, 50);
      
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await notificationService.getNotificationStats(userId);
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true, readAt: new Date() }
              : notif
          )
        );
        
        setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.read);
      
      await Promise.all(
        unreadNotifications.map(notif => 
          notificationService.markAsRead(notif.id)
        )
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      
      setStats(prev => ({ ...prev, unread: 0 }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as clicked for analytics
      await notificationService.markAsClicked(notification.id);
      
      // Mark as read if not already read
      if (!notification.read) {
        await handleMarkAsRead(notification.id);
      }
      
      // Navigate to the appropriate page based on notification type
      const url = getNotificationUrl(notification.type, notification.data);
      window.location.href = url;
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const getNotificationUrl = (type, data) => {
    const urlMap = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: `/forum/post/${data.postId}`,
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: `/mentoring/requests`,
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: `/study-groups/${data.groupId}`,
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: `/achievements`,
      [NOTIFICATION_TYPES.LEVEL_UP]: `/dashboard`,
      [NOTIFICATION_TYPES.COURSE_REMINDER]: `/courses/${data.courseId}`,
      [NOTIFICATION_TYPES.NEW_CONTENT]: `/courses/${data.courseId}`,
      [NOTIFICATION_TYPES.WEEKLY_DIGEST]: `/dashboard`,
      [NOTIFICATION_TYPES.PEER_MESSAGE]: `/messages`,
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: `/announcements`
    };

    return urlMap[type] || '/dashboard';
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: MessageSquare,
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: Users,
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: Users,
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: Trophy,
      [NOTIFICATION_TYPES.LEVEL_UP]: Zap,
      [NOTIFICATION_TYPES.COURSE_REMINDER]: Clock,
      [NOTIFICATION_TYPES.NEW_CONTENT]: BookOpen,
      [NOTIFICATION_TYPES.WEEKLY_DIGEST]: Mail,
      [NOTIFICATION_TYPES.PEER_MESSAGE]: MessageSquare,
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: Speaker
    };

    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type, priority) => {
    const colorMap = {
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: 'text-yellow-600 bg-yellow-50',
      [NOTIFICATION_TYPES.LEVEL_UP]: 'text-purple-600 bg-purple-50',
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: 'text-blue-600 bg-blue-50',
      [NOTIFICATION_TYPES.FORUM_REPLY]: 'text-green-600 bg-green-50',
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: 'text-indigo-600 bg-indigo-50'
    };

    if (priority === 'urgent') return 'text-red-600 bg-red-50';
    if (priority === 'high') return 'text-orange-600 bg-orange-50';
    
    return colorMap[type] || 'text-gray-600 bg-gray-50';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, x: 320 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 320 }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <BellRing className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {stats.unread > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                  {stats.unread}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreferences(true)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Notification Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{stats.total} total</span>
            <span>{stats.unread} unread</span>
            <span>{stats.clickRate}% engagement</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value={NOTIFICATION_TYPES.FORUM_REPLY}>Forum</option>
              <option value={NOTIFICATION_TYPES.MENTORSHIP_REQUEST}>Mentoring</option>
              <option value={NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK}>Achievements</option>
            </select>

            <div className="flex items-center space-x-2">
              {stats.unread > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              
              <button
                onClick={loadNotifications}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications found</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const colorClasses = getNotificationColor(notification.type, notification.priority);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${colorClasses}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm font-medium ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-blue-600 hover:text-blue-700 ml-2"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {notification.body}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            
                            {notification.priority === 'urgent' && (
                              <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">
                                Urgent
                              </span>
                            )}
                            
                            {notification.priority === 'high' && (
                              <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">
                                High
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Notification Preferences Modal */}
      {showPreferences && (
        <NotificationPreferences
          userId={userId}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </>
  );
};

export default NotificationCenter;