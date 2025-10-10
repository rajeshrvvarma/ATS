/**
 * Notification System Integration Demo
 * Shows how to integrate the advanced notification system into existing components
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import React, { useEffect, useState } from 'react';
import { 
  notificationService,
  sendForumReplyNotification,
  sendMentorshipRequestNotification,
  sendStudyGroupInvitationNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendCourseReminderNotification,
  sendNewContentNotification
} from '../services/notificationService.js';
import NotificationBell from '../components/NotificationBell.jsx';
import { useToasts, ToastContainer } from '../components/NotificationToast.jsx';
import NotificationPreferences from '../components/NotificationPreferences.jsx';

const NotificationDemo = ({ userId = 'demo-user' }) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  useEffect(() => {
    // Initialize notification service for this user
    initializeNotificationService();
  }, [userId]);

  const initializeNotificationService = async () => {
    try {
      // Request notification permission
      const result = await notificationService.requestPermission(userId);
      
      if (result.success) {
        console.log('✅ Notification permission granted');
        addToast({
          type: 'success',
          title: 'Notifications Enabled',
          body: 'You will now receive push notifications',
          duration: 3000
        });
      } else {
        console.log('❌ Notification permission denied');
        addToast({
          type: 'warning',
          title: 'Notifications Disabled',
          body: 'Enable notifications in browser settings for the best experience',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  // Demo functions to test different notification types
  const demoNotifications = {
    forumReply: async () => {
      await sendForumReplyNotification(
        userId,
        'Introduction to Ethical Hacking',
        'Sarah Kumar',
        'post-123'
      );
      
      addToast({
        type: 'forum_reply',
        title: '💬 New Reply on Your Post',
        body: 'Sarah Kumar replied to "Introduction to Ethical Hacking"',
        duration: 4000
      });
    },

    mentorshipRequest: async () => {
      await sendMentorshipRequestNotification(
        userId,
        'Alex Chen',
        'request-456'
      );
      
      addToast({
        type: 'mentorship_request',
        title: '🤝 New Mentorship Request',
        body: 'Alex Chen has requested your mentorship',
        duration: 4000
      });
    },

    studyGroupInvitation: async () => {
      await sendStudyGroupInvitationNotification(
        userId,
        'Advanced SOC Analysis',
        'Mike Rodriguez',
        'group-789'
      );
      
      addToast({
        type: 'study_group_invitation',
        title: '📚 Study Group Invitation',
        body: 'Mike Rodriguez invited you to join "Advanced SOC Analysis"',
        duration: 4000
      });
    },

    achievementUnlock: async () => {
      await sendAchievementNotification(
        userId,
        'First Quiz Master',
        '🏆'
      );
      
      addToast({
        type: 'achievement_unlock',
        title: '🏆 Achievement Unlocked!',
        body: "You've earned: First Quiz Master",
        duration: 5000
      });
    },

    levelUp: async () => {
      await sendLevelUpNotification(
        userId,
        5,
        'Security Analyst'
      );
      
      addToast({
        type: 'level_up',
        title: '🚀 Level Up!',
        body: "Congratulations! You've reached Security Analyst (Level 5)",
        duration: 5000
      });
    },

    courseReminder: async () => {
      await sendCourseReminderNotification(
        userId,
        'Incident Response Fundamentals',
        'course-101'
      );
      
      addToast({
        type: 'course_reminder',
        title: '📖 Course Reminder',
        body: 'Don\'t forget to continue "Incident Response Fundamentals"',
        duration: 4000
      });
    },

    newContent: async () => {
      await sendNewContentNotification(
        userId,
        'Advanced Malware Analysis Techniques',
        'course-102'
      );
      
      addToast({
        type: 'new_content',
        title: '🆕 New Content Available',
        body: 'Check out: Advanced Malware Analysis Techniques',
        duration: 4000
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Notification Bell */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🔔 Advanced Notification System Demo
            </h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ⚙️ Notification Settings
              </button>
              
              <NotificationBell userId={userId} />
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Forum Reply Notification */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">💬</span>
                <h3 className="font-semibold text-gray-900">Forum Reply</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate a reply to your forum post
              </p>
              <button
                onClick={demoNotifications.forumReply}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Send Demo Reply
              </button>
            </div>

            {/* Mentorship Request */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🤝</span>
                <h3 className="font-semibold text-gray-900">Mentorship Request</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate a new mentorship request
              </p>
              <button
                onClick={demoNotifications.mentorshipRequest}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Send Demo Request
              </button>
            </div>

            {/* Study Group Invitation */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">📚</span>
                <h3 className="font-semibold text-gray-900">Study Group</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate a study group invitation
              </p>
              <button
                onClick={demoNotifications.studyGroupInvitation}
                className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Send Demo Invitation
              </button>
            </div>

            {/* Achievement Unlock */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🏆</span>
                <h3 className="font-semibold text-gray-900">Achievement</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate unlocking an achievement
              </p>
              <button
                onClick={demoNotifications.achievementUnlock}
                className="w-full px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Unlock Achievement
              </button>
            </div>

            {/* Level Up */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="font-semibold text-gray-900">Level Up</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate reaching a new level
              </p>
              <button
                onClick={demoNotifications.levelUp}
                className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Trigger Level Up
              </button>
            </div>

            {/* Course Reminder */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">📖</span>
                <h3 className="font-semibold text-gray-900">Course Reminder</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate a course continuation reminder
              </p>
              <button
                onClick={demoNotifications.courseReminder}
                className="w-full px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Send Reminder
              </button>
            </div>

            {/* New Content */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🆕</span>
                <h3 className="font-semibold text-gray-900">New Content</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simulate new content availability
              </p>
              <button
                onClick={demoNotifications.newContent}
                className="w-full px-3 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Announce Content
              </button>
            </div>

            {/* Test All */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🔥</span>
                <h3 className="font-semibold text-gray-900">Test All</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Send all notification types at once
              </p>
              <button
                onClick={async () => {
                  for (const [key, fn] of Object.entries(demoNotifications)) {
                    await fn();
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
              >
                Fire All Notifications
              </button>
            </div>
          </div>

          {/* Integration Instructions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Integration Instructions
            </h2>
            
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-medium text-gray-900">1. Add Notification Bell to Header</h3>
                <code className="block mt-1 p-2 bg-gray-100 rounded">
                  {`import NotificationBell from './components/NotificationBell.jsx';

// In your header component:
<NotificationBell userId={currentUser.id} />`}
                </code>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">2. Send Notifications in Your Code</h3>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                  {`import { sendForumReplyNotification } from './services/notificationService.js';

// When someone replies to a forum post:
await sendForumReplyNotification(
  postAuthorId,
  postTitle,
  replierName,
  postId
);`}
                </code>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">3. Initialize Service on App Start</h3>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                  {`import { notificationService } from './services/notificationService.js';

// When user logs in:
await notificationService.requestPermission(userId);`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container for In-App Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
        position="top-right"
      />

      {/* Notification Preferences Modal */}
      {showPreferences && (
        <NotificationPreferences
          userId={userId}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};

export default NotificationDemo;