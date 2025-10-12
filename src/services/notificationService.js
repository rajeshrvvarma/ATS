/**
 * Advanced Notification Service
 * Handles Firebase Cloud Messaging, Email Digests, and Push Notifications
 * Phase 4: Week 1-2 - Advanced Notification System Implementation
 */

import { 
  getMessaging, 
  getToken, 
  onMessage,
  isSupported as isMessagingSupported 
} from 'firebase/messaging';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { generateGeminiResponse } from '../api/gemini.js';

// VAPID Key for FCM (you'll need to generate this in Firebase Console)
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'your-vapid-key-here';

// Notification types
export const NOTIFICATION_TYPES = {
  FORUM_REPLY: 'forum_reply',
  MENTORSHIP_REQUEST: 'mentorship_request',
  STUDY_GROUP_INVITATION: 'study_group_invitation',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  LEVEL_UP: 'level_up',
  COURSE_REMINDER: 'course_reminder',
  NEW_CONTENT: 'new_content',
  WEEKLY_DIGEST: 'weekly_digest',
  PEER_MESSAGE: 'peer_message',
  SYSTEM_ANNOUNCEMENT: 'system_announcement'
};

// Notification priority levels
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

class NotificationService {
  constructor() {
    this.messaging = null;
    this.isSupported = false;
    this.currentToken = null;
    this.initialize();
  }

  /**
   * Initialize Firebase Cloud Messaging
   */
  async initialize() {
    try {
      // Check if messaging is supported
      this.isSupported = await isMessagingSupported();
      
      if (!this.isSupported) {
        console.warn('Firebase Messaging is not supported in this browser');
        return;
      }

      // Initialize messaging
      const { default: app } = await import('../config/firebase.js');
      this.messaging = getMessaging(app);

      // Set up message listener for foreground messages
      this.setupForegroundMessageListener();
    import { getDocsWithIndexFallback } from '@/services/firestoreIndexGuard.js';

      console.log('🔔 Notification Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  /**
   * Request notification permission and get FCM token
   */
  async requestPermission(userId) {
    if (!this.isSupported || !this.messaging) {
      return { success: false, error: 'Messaging not supported' };
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        return { success: false, error: 'Notification permission denied' };
      }

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY
      });

      if (token) {
        this.currentToken = token;
        
        // Save token to user's profile in Firestore
        await this.saveTokenToDatabase(userId, token);
        
        console.log('🎯 FCM Token obtained:', token.substring(0, 20) + '...');
        return { success: true, token };
      } else {
        return { success: false, error: 'Failed to get FCM token' };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save FCM token to user's database record
   */
  async saveTokenToDatabase(userId, token) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        lastTokenUpdate: serverTimestamp(),
        notificationsEnabled: true
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  /**
   * Set up listener for foreground messages
   */
  setupForegroundMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('📨 Foreground message received:', payload);
      
      // Display custom notification for foreground messages
      this.displayForegroundNotification(payload);
    });
  }

  /**
   * Display notification when app is in foreground
   */
  displayForegroundNotification(payload) {
    const { notification, data } = payload;
    
    // Use browser notification (simplified, no service worker dependency)
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/logo.png',
        tag: data?.type || 'general'
      });
    }
  }

  /**
   * Get notification actions based on type
   */
  getNotificationActions(type) {
    const actions = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: [
        { action: 'reply', title: '💬 Reply', icon: '/action-reply.png' },
        { action: 'view', title: '👀 View', icon: '/action-view.png' }
      ],
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: [
        { action: 'accept', title: '✅ Accept', icon: '/action-accept.png' },
        { action: 'view', title: '👀 View', icon: '/action-view.png' }
      ],
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: [
        { action: 'join', title: '🤝 Join', icon: '/action-join.png' },
        { action: 'view', title: '👀 View', icon: '/action-view.png' }
      ],
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: [
        { action: 'view', title: '🏆 View Achievement', icon: '/action-trophy.png' }
      ]
    };

    return actions[type] || [
      { action: 'view', title: '👀 View', icon: '/action-view.png' }
    ];
  }

  /**
   * Send notification to specific user
   */
  async sendNotification(userId, notificationData) {
    try {
      // Check if notification should be sent based on user preferences
      const shouldSendPush = await this.shouldSendNotification(userId, notificationData.type, 'push');
      const shouldSendEmail = await this.shouldSendNotification(userId, notificationData.type, 'email');
      
      if (!shouldSendPush && !shouldSendEmail) {
        console.log('Notification blocked by user preferences');
        return { success: true, blocked: true };
      }

      const notification = {
        userId,
        type: notificationData.type,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        priority: notificationData.priority || NOTIFICATION_PRIORITY.NORMAL,
        read: false,
        clicked: false,
        createdAt: serverTimestamp(),
        expiresAt: this.calculateExpirationTime(notificationData.type),
        sentMethods: []
      };

      // Save to Firestore notifications collection
      const notificationsRef = collection(db, 'notifications');
      const docRef = await addDoc(notificationsRef, notification);

      // Send push notification if allowed
      if (shouldSendPush) {
        await this.sendPushNotification(userId, notificationData);
        notification.sentMethods.push('push');
      }

      // Send email notification if allowed (this would be handled by your email service)
      if (shouldSendEmail) {
        await this.sendEmailNotification(userId, notificationData);
        notification.sentMethods.push('email');
      }

      // Update the notification record with sent methods
      await updateDoc(docRef, {
        sentMethods: notification.sentMethods
      });

      return { success: true, notificationId: docRef.id, sentMethods: notification.sentMethods };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send push notification via FCM
   */
  async sendPushNotification(userId, notificationData) {
    try {
      // Get user's FCM token
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists() || !userDoc.data().fcmToken) {
        console.log('User has no FCM token, skipping push notification');
        return;
      }

      const fcmToken = userDoc.data().fcmToken;

      // This would typically be done on your backend
      // For now, we'll simulate the FCM call structure
      const message = {
        token: fcmToken,
        notification: {
          title: notificationData.title,
          body: notificationData.body,
          icon: '/icon-192x192.png'
        },
        data: {
          type: notificationData.type,
          ...notificationData.data
        },
        webpush: {
          fcmOptions: {
            link: this.getNotificationLink(notificationData.type, notificationData.data)
          }
        }
      };

      console.log('📤 Would send FCM message:', message);
      // In production, this would be sent from your backend
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(userId, notificationData) {
    try {
      // Get user's email from profile
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists() || !userDoc.data().email) {
        console.log('User has no email, skipping email notification');
        return;
      }

      const userEmail = userDoc.data().email;
      const userName = userDoc.data().name || userDoc.data().displayName || 'Student';

      // Use EmailJS to send the notification email
      const emailData = {
        to_email: userEmail,
        to_name: userName,
        subject: notificationData.title,
        message_body: notificationData.body,
        notification_type: notificationData.type,
        action_url: this.getNotificationLink(notificationData.type, notificationData.data),
        platform_name: 'Agnidhra Cybersecurity LMS'
      };

      // This would integrate with your existing email service
      console.log('📧 Would send email notification:', emailData);
      
      // Example EmailJS integration:
      // await emailjs.send('service_id', 'notification_template', emailData, 'user_id');
      
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  /**
   * Get notification link based on type
   */
  getNotificationLink(type, data) {
    const baseUrl = window.location.origin;
    
    const linkMap = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: `${baseUrl}/forum/post/${data.postId}`,
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: `${baseUrl}/mentoring/requests`,
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: `${baseUrl}/study-groups/${data.groupId}`,
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: `${baseUrl}/achievements`,
      [NOTIFICATION_TYPES.LEVEL_UP]: `${baseUrl}/dashboard`,
      [NOTIFICATION_TYPES.COURSE_REMINDER]: `${baseUrl}/courses/${data.courseId}`,
      [NOTIFICATION_TYPES.NEW_CONTENT]: `${baseUrl}/courses/${data.courseId}`
    };

    return linkMap[type] || `${baseUrl}/dashboard`;
  }

  /**
   * Calculate notification expiration time
   */
  calculateExpirationTime(type) {
    const now = new Date();
    const expirationHours = {
      [NOTIFICATION_TYPES.FORUM_REPLY]: 72, // 3 days
      [NOTIFICATION_TYPES.MENTORSHIP_REQUEST]: 168, // 7 days
      [NOTIFICATION_TYPES.STUDY_GROUP_INVITATION]: 48, // 2 days
      [NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK]: 336, // 14 days
      [NOTIFICATION_TYPES.LEVEL_UP]: 336, // 14 days
      [NOTIFICATION_TYPES.COURSE_REMINDER]: 24, // 1 day
      [NOTIFICATION_TYPES.NEW_CONTENT]: 168, // 7 days
      [NOTIFICATION_TYPES.WEEKLY_DIGEST]: 168, // 7 days
      [NOTIFICATION_TYPES.PEER_MESSAGE]: 72, // 3 days
      [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: 720 // 30 days
    };

    const hours = expirationHours[type] || 72;
    return new Date(now.getTime() + (hours * 60 * 60 * 1000));
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, limit = 20) {
    try {
      const notificationsRef = collection(db, 'notifications');
      // Use index guard with fallback
      const primary = () => getDocs(query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      ));
      const fallback = () => getDocs(query(
        notificationsRef,
        where('userId', '==', userId)
      ));
      const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'createdAt', sortDir: 'desc' });
      const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
        ? docs.map(doc => ({ id: doc.id, ...doc.data() }))
        : docs;
      const notifications = rows.map(data => ({
        id: data.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        expiresAt: data.expiresAt?.toDate?.() || data.expiresAt
      }));
      if (indexRequired) console.warn('Index required for getUserNotifications; using fallback sorting.');
      return { success: true, data: notifications };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notification as clicked
   */
  async markAsClicked(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        clicked: true,
        clickedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as clicked:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const primary = () => getDocs(query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(100)
      ));
      const fallback = () => getDocs(query(
        notificationsRef,
        where('userId', '==', userId)
      ));
      const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'createdAt', sortDir: 'desc' });
      const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
        ? docs.map(doc => ({ id: doc.id, ...doc.data() }))
        : docs;
      let total = 0;
      let unread = 0;
      let clicked = 0;
      const typeStats = {};

      rows.forEach(data => {
        total++;
        if (!data.read) unread++;
        if (data.clicked) clicked++;
        typeStats[data.type] = (typeStats[data.type] || 0) + 1;
      });
      if (indexRequired) console.warn('Index required for getNotificationStats; using fallback sorting.');

      return {
        success: true,
        data: {
          total,
          unread,
          clicked,
          clickRate: total > 0 ? Math.round((clicked / total) * 100) : 0,
          typeStats
        }
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().notificationPreferences) {
        return { success: true, data: userDoc.data().notificationPreferences };
      }
      
      // Return default preferences if none exist
      const defaultPreferences = {
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
      };
      
      return { success: true, data: defaultPreferences };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save user notification preferences
   */
  async saveUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        notificationPreferences: preferences,
        lastPreferencesUpdate: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  async shouldSendNotification(userId, notificationType, method = 'push') {
    try {
      const preferencesResult = await this.getUserPreferences(userId);
      
      if (!preferencesResult.success) {
        return true; // Default to sending if we can't get preferences
      }
      
      const preferences = preferencesResult.data;
      
      // Check if notifications are globally disabled
      if (!preferences.enabled) {
        return false;
      }
      
      // Check if specific method is disabled
      if (method === 'push' && !preferences.pushEnabled) {
        return false;
      }
      
      if (method === 'email' && !preferences.emailEnabled) {
        return false;
      }
      
      // Check if this notification type is enabled for this method
      const typeSettings = preferences.types[notificationType];
      if (!typeSettings || !typeSettings[method]) {
        return false;
      }
      
      // Check quiet hours for push notifications
      if (method === 'push' && preferences.quietHours.enabled) {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const startTime = this.parseTime(preferences.quietHours.start);
        const endTime = this.parseTime(preferences.quietHours.end);
        
        if (startTime > endTime) {
          // Quiet hours span midnight
          if (currentTime >= startTime || currentTime <= endTime) {
            return false;
          }
        } else {
          // Quiet hours within same day
          if (currentTime >= startTime && currentTime <= endTime) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      return true; // Default to sending if there's an error
    }
  }

  /**
   * Parse time string to minutes since midnight
   */
  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 100 + minutes;
  }

  /**
   * Check if user is in quiet hours
   */
  isQuietHours(preferences) {
    if (!preferences.quietHours.enabled) {
      return false;
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = this.parseTime(preferences.quietHours.start);
    const endTime = this.parseTime(preferences.quietHours.end);
    
    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Quiet hours within same day
      return currentTime >= startTime && currentTime <= endTime;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

/**
 * Convenience functions for different notification types
 */

export const sendForumReplyNotification = async (userId, postTitle, replierName, postId) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.FORUM_REPLY,
    title: '💬 New Reply on Your Post',
    body: `${replierName} replied to "${postTitle}"`,
    data: { postId, replierName },
    priority: NOTIFICATION_PRIORITY.NORMAL
  });
};

export const sendMentorshipRequestNotification = async (mentorId, menteeName, requestId) => {
  return await notificationService.sendNotification(mentorId, {
    type: NOTIFICATION_TYPES.MENTORSHIP_REQUEST,
    title: '🤝 New Mentorship Request',
    body: `${menteeName} has requested your mentorship`,
    data: { requestId, menteeName },
    priority: NOTIFICATION_PRIORITY.HIGH
  });
};

export const sendStudyGroupInvitationNotification = async (userId, groupName, inviterName, groupId) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.STUDY_GROUP_INVITATION,
    title: '📚 Study Group Invitation',
    body: `${inviterName} invited you to join "${groupName}"`,
    data: { groupId, groupName, inviterName },
    priority: NOTIFICATION_PRIORITY.NORMAL
  });
};

export const sendAchievementNotification = async (userId, achievementTitle, badgeIcon) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCK,
    title: '🏆 Achievement Unlocked!',
    body: `You've earned: ${achievementTitle}`,
    data: { achievementTitle, badgeIcon },
    priority: NOTIFICATION_PRIORITY.HIGH
  });
};

export const sendLevelUpNotification = async (userId, newLevel, newLevelName) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.LEVEL_UP,
    title: '🚀 Level Up!',
    body: `Congratulations! You've reached ${newLevelName} (Level ${newLevel})`,
    data: { newLevel, newLevelName },
    priority: NOTIFICATION_PRIORITY.HIGH
  });
};

export const sendCourseReminderNotification = async (userId, courseName, courseId) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.COURSE_REMINDER,
    title: '📖 Course Reminder',
    body: `Don't forget to continue "${courseName}"`,
    data: { courseId, courseName },
    priority: NOTIFICATION_PRIORITY.LOW
  });
};

export const sendNewContentNotification = async (userId, contentTitle, courseId) => {
  return await notificationService.sendNotification(userId, {
    type: NOTIFICATION_TYPES.NEW_CONTENT,
    title: '🆕 New Content Available',
    body: `Check out: ${contentTitle}`,
    data: { courseId, contentTitle },
    priority: NOTIFICATION_PRIORITY.NORMAL
  });
};

export default notificationService;