
// Firebase Messaging Service Worker for FCM (using importScripts, not ES modules)
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyACSDK7vfjEvWj7AyKJqLfcNaRmIIdr1_k",
  authDomain: "agnidhra-website-auth.firebaseapp.com",
  projectId: "agnidhra-website-auth",
  storageBucket: "agnidhra-website-auth.firebasestorage.app",
  messagingSenderId: "484039318334",
  appId: "1:484039318334:web:03a75c9183855ada36ea6f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Agnidhra Cybersecurity';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.type || 'general',
    data: payload.data,
    requireInteraction: payload.data?.priority === 'urgent',
    timestamp: Date.now(),
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});