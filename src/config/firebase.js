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
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyACSDK7vfjEvWj7AyKJqLfcNaRmIIdr1_k",
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "aagnidhra-website-auth.firebaseapp.com",
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || "agnidhra-website-auth",
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "agnidhra-website-auth.firebasestorage.app",
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "484039318334",
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID || "1:484039318334:web:03a75c9183855ada36ea6f"
};

// Debug: Log the configuration being used
console.log('Firebase config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key'
});

// Initialize Firebase (prevent duplicate app error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;