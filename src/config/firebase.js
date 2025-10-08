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
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "agnidhra-cybersecurity.firebaseapp.com",
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || "agnidhra-cybersecurity",
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "agnidhra-cybersecurity.appspot.com",
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase (prevent duplicate app error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;