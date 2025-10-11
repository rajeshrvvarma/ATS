/**
 * Enhanced Authentication Service with Firebase
 * Replaces mock authentication with real Firebase auth
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase.js';

// User roles
export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

// Permissions for each role
export const PERMISSIONS = {
  [ROLES.STUDENT]: [
    'view_courses',
    'enroll_courses',
    'view_progress',
    'download_certificates',
    'update_profile'
  ],
  [ROLES.INSTRUCTOR]: [
    'view_courses',
    'create_courses',
    'edit_courses',
    'view_students',
    'grade_assignments',
    'view_analytics'
  ],
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_courses',
    'view_analytics',
    'manage_system',
    'view_audit_logs',
    'manage_certificates'
  ]
};

/**
 * Register new student after course enrollment
 */
export const registerStudent = async (studentData, courseType) => {
  try {
    const { email, password, name, phone, paymentReference } = studentData;
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Update user profile
    await updateProfile(user, { displayName: name });
    // Generate unique student ID
    const studentId = `ST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      studentId,
      email,
      name,
      phone,
      role: ROLES.STUDENT,
      courseType,
      paymentReference,
      paymentStatus: 'verified',
      enrolledAt: serverTimestamp(),
      status: 'active',
      profile: { avatar: null, bio: '', location: '', socialLinks: {} },
      courseProgress: { currentLesson: 0, completedLessons: [], totalProgress: 0, lastAccessed: serverTimestamp() },
      certificates: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await sendEmailVerification(user);
    await logActivity(user.uid, 'user_registered', {
      courseType,
      paymentReference,
      registrationMethod: 'course_enrollment'
    });
    return {
      success: true,
      user,
      studentId,
      message: 'Registration successful! Please check your email for verification.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login existing user
 */
export const loginStudent = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    const userData = userDoc.data();
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await logActivity(user.uid, 'user_login', { loginMethod: 'email_password' });
    return {
      success: true,
      user,
      userData,
      message: 'Login successful!'
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout current user
 */
export const logoutStudent = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await logActivity(user.uid, 'user_logout', { logoutTime: new Date().toISOString() });
    }
    await signOut(auth);
    return { success: true, message: 'Logged out successfully!' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent! Check your inbox.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => auth.currentUser;

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback) => onAuthStateChanged(auth, callback);

/**
 * Check if user has specific permission
 */
export const hasPermission = async (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return false;
  const userData = userDoc.data();
  const userPermissions = PERMISSIONS[userData.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if user has course access
 */
export const hasCourseAccess = async (courseType) => {
  const user = getCurrentUser();
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return false;
  const userData = userDoc.data();
  // Check if user is enrolled in the requested course type
  return userData.courseType === courseType && userData.paymentStatus === 'verified';
};

/**
 * Get user profile data
 */
export const getStudentProfile = async (uid = null) => {
  try {
    const userId = uid || getCurrentUser()?.uid;
    if (!userId) return null;
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return {
      uid: userId,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateStudentProfile = async (updates) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    await updateDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    // Log profile update activity
    await logActivity(user.uid, 'profile_updated', {
      updatedFields: Object.keys(updates)
    });
    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Log user activity
 */
export const logActivity = async (userId, activityType, metadata = {}) => {
  try {
    await addDoc(collection(db, 'studentActivity'), {
      userId,
      activityType,
      metadata,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // Would need backend for real IP
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Generate unique student ID
 */
export const generateStudentId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ST${timestamp}${random}`;
};
/**
 * Enhanced Authentication Service with Firebase
 * Replaces mock authentication with real Firebase auth
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase.js';

// User roles
export const ROLES = {
  USER: 'user',
  INSTRUCTOR: 'instructor', 
  ADMIN: 'admin'
};

// Permissions for each role
export const PERMISSIONS = {
  [ROLES.STUDENT]: [
    'view_courses',
    'enroll_courses', 
    'view_progress',
    'download_certificates',
    'update_profile'
  ],
  [ROLES.INSTRUCTOR]: [
    'view_courses',
    'create_courses',
    'edit_courses', 
    'view_students',
    'grade_assignments',
    'view_analytics'
  ],
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_courses',
    'view_analytics',
    'manage_system',
    'view_audit_logs',
    'manage_certificates'
  ]
};

/**
 * Register new student after course enrollment
 */
export const registerStudent = async (studentData, courseType) => {
  try {
    const { email, password, name, phone, paymentReference } = studentData;
    
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: name
    });
    
    // Generate unique student ID
    const studentId = `ST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
      studentId,
      email,
      name,
      phone,
      role: ROLES.STUDENT,
      courseType, // '7-day-bootcamp' or '2-month-premium'
      paymentReference,
      paymentStatus: 'verified', // Since manual verification
      enrolledAt: serverTimestamp(),
      status: 'active',
      profile: {
        avatar: null,
        bio: '',
        location: '',
        socialLinks: {}
      },
      courseProgress: {
        currentLesson: 0,
        completedLessons: [],
        totalProgress: 0,
        lastAccessed: serverTimestamp()
      },
      certificates: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Log registration activity
      await logActivity(user.uid, 'user_registered', {
      courseType,
      paymentReference,
      registrationMethod: 'course_enrollment'
    });
    
    return {
      success: true,
      user,
      studentId,
      message: 'Registration successful! Please check your email for verification.'
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Login existing student
 */
export const loginStudent = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get student data from Firestore
    const studentDoc = await getDoc(doc(db, 'students', user.uid));
    
    if (!studentDoc.exists()) {
      throw new Error('Student profile not found');
    }
    
    const studentData = studentDoc.data();
    
    // Update last login
    await updateDoc(doc(db, 'students', user.uid), {
    await setDoc(doc(db, 'users', user.uid), {
      updatedAt: serverTimestamp()
    });
    
    // Log login activity
    await logActivity(user.uid, 'student_login', {
      loginMethod: 'email_password'
    });
    
    return {
      success: true,
      user,
      studentData,
      message: 'Login successful!'
    };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
      const userDoc = await getDoc(doc(db, 'users', user.uid));
  }
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
/**
 * Logout current user
      const userData = userDoc.data();
export const logoutStudent = async () => {
  try {
      await updateDoc(doc(db, 'users', user.uid), {
    
    if (user) {
      // Log logout activity
      await logActivity(user.uid, 'student_logout', {
        logoutTime: new Date().toISOString()
      await logActivity(user.uid, 'user_login', {
    }
    
    await signOut(auth);
    
    return {
      success: true,
        userData,
    };
    
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    return {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
      message: 'Password reset email sent! Check your inbox.'
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
  } catch (error) {
    console.error('Password reset error:', error);
    const userData = userDoc.data();
      success: false,
      error: error.message
    await updateDoc(doc(db, 'users', user.uid), {
  }
};

/**
 * Get current authenticated user
    await logActivity(user.uid, 'user_login', {
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
      userData,
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user has specific permission
 */
export const hasPermission = async (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  
export const hasPermission = async (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return false;
  const userData = userDoc.data();
  const userPermissions = PERMISSIONS[userData.role] || [];
  return userPermissions.includes(permission);
};

export const hasCourseAccess = async (courseType) => {
  const user = getCurrentUser();
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return false;
  const userData = userDoc.data();
  // Check if user is enrolled in the requested course type
  return userData.courseType === courseType && userData.paymentStatus === 'verified';
};

export const getStudentProfile = async (uid = null) => {
  try {
    const userId = uid || getCurrentUser()?.uid;
    if (!userId) return null;
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return {
      uid: userId,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
export const updateStudentProfile = async (updates) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    
    await updateDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    // Log profile update activity
    await logActivity(user.uid, 'profile_updated', {
      updatedFields: Object.keys(updates)
    });
    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Log student activity
 */
export const logActivity = async (userId, activityType, metadata = {}) => {
  try {
    await addDoc(collection(db, 'studentActivity'), {
      userId,
      activityType,
      metadata,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // Would need backend for real IP
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Generate unique student ID
 */
export const generateStudentId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ST${timestamp}${random}`;
}