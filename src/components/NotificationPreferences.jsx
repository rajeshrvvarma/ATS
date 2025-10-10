/**
 * Notification Preferences Panel
 * Allows users to customize notification settings and frequency
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Clock, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Users,
  Trophy,
  BookOpen,
  Zap,
  Save,
  RefreshCw
} from 'lucide-react';
import { notificationService, NOTIFICATION_TYPES } from '../services/notificationService.js';

const NotificationPreferences = ({ userId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    enabled: true,
    pushEnabled: false,
    emailEnabled: true,
    digestFrequency: 'weekly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    types: {
      [NOTIFICATION_TYPES.FORUM_REPLY]: { push: true, email: true, priority: 'normal' },
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: { push: true, email: true, priority: 'high' },
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: { push: true, email: true, priority: 'normal' },
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: { push: true, email: false, priority: 'high' },
      [NOTIFICATION_TYPES.LEVEL_UP]: { push: true, email: false, priority: 'high' },
      [NOTIFICATION_TYPES.COURSE_REMINDER]: { push: true, email: false, priority: 'low' },
      [NOTIFICATION_TYPES.NEW_CONTENT]: { push: true, email: true, priority: 'normal' },
      [NOTIFICATION_TYPES.WEEKLY_DIGEST]: { push: false, email: true, priority: 'low' },
      [NOTIFICATION_TYPES.PEER_MESSAGE]: { push: true, email: false, priority: 'normal' },
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: { push: true, email: true, priority: 'normal' }
    }
  });

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      // Load user's notification preferences from Firestore
      // This would be implemented in the notification service
      const result = await notificationService.getUserPreferences(userId);
      
      if (result.success && result.data) {
        setPreferences(prev => ({ ...prev, ...result.data }));
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save preferences to Firestore
      const result = await notificationService.saveUserPreferences(userId, preferences);
      
      if (result.success) {
        // If push notifications are enabled, request permission
        if (preferences.pushEnabled && !notificationService.currentToken) {
          await notificationService.requestPermission(userId);
        }
        
        // Show success message
        console.log('✅ Notification preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotificationType = (type, method) => {
    setPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          [method]: !prev.types[type][method]
        }
      }
    }));
  };

  const handlePriorityChange = (type, priority) => {
    setPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          priority
        }
      }
    }));
  };

  const getNotificationTypeIcon = (type) => {
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
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: Bell
    };

    return iconMap[type] || Bell;
  };

  const getNotificationTypeLabel = (type) => {
    const labelMap = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: 'Forum Replies',
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: 'Mentorship Requests',
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: 'Study Group Invitations',
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: 'Achievement Unlocks',
      [NOTIFICATION_TYPES.LEVEL_UP]: 'Level Up',
      [NOTIFICATION_TYPES.COURSE_REMINDER]: 'Course Reminders',
      [NOTIFICATION_TYPES.NEW_CONTENT]: 'New Content',
      [NOTIFICATION_TYPES.WEEKLY_DIGEST]: 'Weekly Digest',
      [NOTIFICATION_TYPES.PEER_MESSAGE]: 'Peer Messages',
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: 'System Announcements'
    };

    return labelMap[type] || type;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg">Loading preferences...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Global Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h3>
            
            <div className="space-y-4">
              {/* Master Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {preferences.enabled ? 
                    <Bell className="w-5 h-5 text-green-600" /> : 
                    <BellOff className="w-5 h-5 text-gray-400" />
                  }
                  <div>
                    <p className="font-medium text-gray-900">Enable Notifications</p>
                    <p className="text-sm text-gray-600">Receive all notification types</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.enabled}
                    onChange={(e) => setPreferences(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Instant notifications on this device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushEnabled}
                    onChange={(e) => setPreferences(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                    className="sr-only peer"
                    disabled={!preferences.enabled}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Notifications sent to your email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailEnabled}
                    onChange={(e) => setPreferences(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                    className="sr-only peer"
                    disabled={!preferences.enabled}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              {/* Digest Frequency */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Digest Frequency
                </label>
                <select
                  value={preferences.digestFrequency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, digestFrequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!preferences.enabled || !preferences.emailEnabled}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Quiet Hours */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Quiet Hours</p>
                      <p className="text-sm text-gray-600">No notifications during these hours</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                      disabled={!preferences.enabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                  </label>
                </div>

                {preferences.quietHours.enabled && (
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notification Type Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
            
            <div className="space-y-3">
              {Object.entries(preferences.types).map(([type, settings]) => {
                const IconComponent = getNotificationTypeIcon(type);
                
                return (
                  <div key={type} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          {getNotificationTypeLabel(type)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Priority:</span>
                        <select
                          value={settings.priority}
                          onChange={(e) => handlePriorityChange(type, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={!preferences.enabled}
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.push && preferences.pushEnabled}
                          onChange={() => handleToggleNotificationType(type, 'push')}
                          className="rounded text-blue-600 focus:ring-blue-500"
                          disabled={!preferences.enabled || !preferences.pushEnabled}
                        />
                        <span className="text-sm text-gray-700">Push</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.email && preferences.emailEnabled}
                          onChange={() => handleToggleNotificationType(type, 'email')}
                          className="rounded text-blue-600 focus:ring-blue-500"
                          disabled={!preferences.enabled || !preferences.emailEnabled}
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPreferences;