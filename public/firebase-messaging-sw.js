/**
 * Firebase Messaging Service Worker
 * Handles background push notifications when the app is not active
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging';

// Firebase configuration (must match your main config)
const firebaseConfig = {
  apiKey: "AIzaSyACSDK7vfjEvWj7AyKJqLfcNaRmIIdr1_k",
  authDomain: "agnidhra-website-auth.firebaseapp.com",
  projectId: "agnidhra-website-auth",
  storageBucket: "agnidhra-website-auth.firebasestorage.app",
  messagingSenderId: "484039318334",
  appId: "1:484039318334:web:03a75c9183855ada36ea6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('📨 Background message received:', payload);

  const { notification, data } = payload;
  
  // Customize notification options
  const notificationTitle = notification?.title || 'Agnidhra Cybersecurity';
  const notificationOptions = {
    body: notification?.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data?.type || 'general',
    data: data,
    actions: getNotificationActions(data?.type),
    requireInteraction: data?.priority === 'urgent',
    timestamp: Date.now(),
    vibrate: [200, 100, 200], // Vibration pattern for mobile
    sound: '/sounds/notification.mp3' // Custom sound
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Get notification actions based on type
 */
function getNotificationActions(type) {
  const actions = {
    'forum_reply': [
      { action: 'reply', title: '💬 Reply', icon: '/action-reply.png' },
      { action: 'view', title: '👀 View', icon: '/action-view.png' }
    ],
    'mentorship_request': [
      { action: 'accept', title: '✅ Accept', icon: '/action-accept.png' },
      { action: 'view', title: '👀 View', icon: '/action-view.png' }
    ],
    'study_group_invitation': [
      { action: 'join', title: '🤝 Join', icon: '/action-join.png' },
      { action: 'view', title: '👀 View', icon: '/action-view.png' }
    ],
    'achievement_unlock': [
      { action: 'view', title: '🏆 View Achievement', icon: '/action-trophy.png' }
    ],
    'level_up': [
      { action: 'celebrate', title: '🎉 Celebrate', icon: '/action-celebrate.png' },
      { action: 'view', title: '👀 View Progress', icon: '/action-view.png' }
    ]
  };

  return actions[type] || [
    { action: 'view', title: '👀 View', icon: '/action-view.png' }
  ];
}

/**
 * Handle notification click events
 */
self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ Notification clicked:', event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  // Close the notification
  notification.close();

  // Handle different actions
  if (action === 'reply') {
    // Open reply interface
    event.waitUntil(
      clients.openWindow('/forum/reply?postId=' + data.postId)
    );
  } else if (action === 'accept') {
    // Open mentorship acceptance page
    event.waitUntil(
      clients.openWindow('/mentoring/requests?requestId=' + data.requestId)
    );
  } else if (action === 'join') {
    // Open study group
    event.waitUntil(
      clients.openWindow('/study-groups/' + data.groupId)
    );
  } else if (action === 'celebrate') {
    // Open achievements page with celebration
    event.waitUntil(
      clients.openWindow('/achievements?celebrate=true')
    );
  } else {
    // Default action - open appropriate page
    const url = getNotificationUrl(data.type, data);
    event.waitUntil(
      clients.openWindow(url)
    );
  }

  // Track notification click (send to analytics)
  trackNotificationClick(data.type, action, data);
});

/**
 * Get URL based on notification type
 */
function getNotificationUrl(type, data) {
  const baseUrl = self.location.origin;
  
  const urlMap = {
    'forum_reply': `${baseUrl}/forum/post/${data.postId}`,
    'mentorship_request': `${baseUrl}/mentoring/requests`,
    'study_group_invitation': `${baseUrl}/study-groups/${data.groupId}`,
    'achievement_unlock': `${baseUrl}/achievements`,
    'level_up': `${baseUrl}/dashboard`,
    'course_reminder': `${baseUrl}/courses/${data.courseId}`,
    'new_content': `${baseUrl}/courses/${data.courseId}`,
    'weekly_digest': `${baseUrl}/dashboard`,
    'peer_message': `${baseUrl}/messages`,
    'system_announcement': `${baseUrl}/announcements`
  };

  return urlMap[type] || `${baseUrl}/dashboard`;
}

/**
 * Track notification click for analytics
 */
function trackNotificationClick(type, action, data) {
  // This would send analytics data to your tracking service
  console.log('📊 Tracking notification click:', { type, action, data });
  
  // Example: Send to Google Analytics or your custom analytics
  // This would be implemented based on your analytics setup
}

/**
 * Handle notification close events
 */
self.addEventListener('notificationclose', function(event) {
  console.log('❌ Notification closed:', event.notification.data);
  
  // Track notification dismissal
  const data = event.notification.data || {};
  console.log('📊 Tracking notification dismissal:', data.type);
});

/**
 * Service Worker activation
 */
self.addEventListener('activate', function(event) {
  console.log('🔄 Firebase Messaging Service Worker activated');
});

/**
 * Service Worker installation
 */
self.addEventListener('install', function(event) {
  console.log('📦 Firebase Messaging Service Worker installed');
  self.skipWaiting(); // Activate immediately
});