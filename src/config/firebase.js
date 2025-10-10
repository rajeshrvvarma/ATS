/**
 * Firebase Configuration
 * Setup for Authentication, Firestore Database, and Storage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyACSDK7vfjEvWj7AyKJqLfcNaRmIIdr1_k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agnidhra-website-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agnidhra-website-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agnidhra-website-auth.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "484039318334",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:484039318334:web:03a75c9183855ada36ea6f"
};

// Initialize Firebase (prevent duplicate app error)
let app;
try {
  // Check if an app is already initialized
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log('Firebase initialized:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback: try to get existing app or create new one
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;