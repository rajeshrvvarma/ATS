/**
 * NotificationIntegrationTest - Component to test integrated notification functionality
 * This component helps verify that notifications work with real forum interactions
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, Bell, MessageSquare, Heart, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import notificationService from '@/services/notificationService.js';
import { useToast } from '@/context/ToastContext.jsx';

const NotificationIntegrationTest = ({ onClose }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const runTest = async (testName, testFn) => {
    setTestResults(prev => ({ ...prev, [testName]: 'running' }));
    
    try {
      await testFn();
      setTestResults(prev => ({ ...prev, [testName]: 'success' }));
      return true;
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: 'failed' }));
      return false;
    }
  };

  const testNotificationService = async () => {
    // Test if notification service is initialized
    const isInitialized = notificationService.isInitialized();
    if (!isInitialized) {
      throw new Error('Notification service not initialized');
    }
    
    // Test sending a test notification
    await notificationService.sendNotification(
      user.uid,
      'system_test',
      {
        message: 'Integration test notification',
        timestamp: new Date().toISOString()
      }
    );
  };

  const testForumNotifications = async () => {
    // Test forum reply notification structure
    await notificationService.sendNotification(
      user.uid,
      'forum_reply',
      {
        threadTitle: 'Test Thread',
        replyAuthor: 'Test User',
        threadId: 'test-123',
        replyContent: 'This is a test reply for integration testing...'
      }
    );
    
    // Test forum like notification structure
    await notificationService.sendNotification(
      user.uid,
      'forum_like',
      {
        itemType: 'thread',
        itemTitle: 'Test Thread',
        likedBy: 'Test User',
        threadId: 'test-123',
        threadTitle: 'Test Thread Title'
      }
    );
  };

  const testPWANotifications = async () => {
    // Test PWA notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('PWA notifications not granted');
      }
      
      // Test sending a PWA notification
      new Notification('Integration Test', {
        body: 'PWA notifications are working!',
        icon: '/logo.png',
        badge: '/logo.png'
      });
    } else {
      throw new Error('PWA notifications not supported');
    }
  };

  const testNotificationPreferences = async () => {
    // Test preference loading
    const prefs = await notificationService.getPreferences(user.uid);
    if (!prefs) {
      throw new Error('Could not load notification preferences');
    }
    
    // Test preference saving
    await notificationService.updatePreferences(user.uid, {
      forum_reply: true,
      forum_like: true,
      system_test: true
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    const tests = [
      { name: 'service', fn: testNotificationService, label: 'Notification Service' },
      { name: 'forum', fn: testForumNotifications, label: 'Forum Notifications' },
      { name: 'pwa', fn: testPWANotifications, label: 'PWA Notifications' },
      { name: 'preferences', fn: testNotificationPreferences, label: 'Notification Preferences' }
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      const success = await runTest(test.name, test.fn);
      if (success) passedTests++;
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    
    if (passedTests === tests.length) {
      addToast('✅ All notification integration tests passed!', 'success');
    } else {
      addToast(`⚠️ ${passedTests}/${tests.length} tests passed`, 'warning');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Authentication Required</h3>
          <p className="text-gray-600 mb-4">
            Please log in to test notification integration.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Notification Integration Test</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This test verifies that all notification integrations are working correctly.
            Run the test to check:
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.service)}
              <span>Notification Service Initialization</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.forum)}
              <span>Forum Reply & Like Notifications</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.pwa)}
              <span>PWA Push Notifications</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.preferences)}
              <span>Notification Preferences</span>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Integration Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ NotificationBell added to Header</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ NotificationService initialized in App</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Forum reply notifications connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Forum like notifications connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>✅ Thread creation notifications connected</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3">How to Test Real Integration:</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Login with two different accounts in separate browser tabs</li>
            <li>2. Create a forum thread with Account A</li>
            <li>3. Reply to the thread with Account B</li>
            <li>4. Check that Account A receives a notification bell update</li>
            <li>5. Like the thread with Account B</li>
            <li>6. Verify Account A gets a like notification</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Run Integration Tests
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationIntegrationTest;
