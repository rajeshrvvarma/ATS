/**
 * Safe Course Access Control System
 * Protects course content with proper error handling
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Course Access Context
const CourseAccessContext = createContext();

/**
 * Course Access Provider Component with Safe Firebase Integration
 */
export const CourseAccessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [accessCache, setAccessCache] = useState({});
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase services safely
    const initializeFirebase = async () => {
      try {
        // Ensure Firebase config is loaded first
        await import('@/config/firebase.js');
        
        // Then load Firebase services only when needed
        const { onAuthStateChange, getStudentProfile } = await import('@/services/firebaseAuthService.js');
        const { checkCourseAccess } = await import('@/services/studentManagementService.js');
        
        setFirebaseReady(true);
        
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
          setLoading(true);
          
          if (firebaseUser) {
            setUser(firebaseUser);
            
            try {
              const profile = await getStudentProfile(firebaseUser.uid);
              setStudentProfile(profile);
              
              if (profile?.email) {
                await loadStudentEnrollments(profile.email);
              }
            } catch (error) {
              console.warn('Error loading student profile:', error);
              // Continue without profile data
            }
          } else {
            setUser(null);
            setStudentProfile(null);
            setEnrollments({});
            setAccessCache({});
          }
          
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.warn('Firebase initialization failed, using fallback mode:', error);
        setFirebaseReady(false);
        setLoading(false);
        return () => {};
      }
    };

    let unsubscribe;
    initializeFirebase().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Load student enrollments safely
   */
  const loadStudentEnrollments = async (email) => {
    if (!firebaseReady) return;
    
    try {
      const { getStudentEnrollments } = await import('@/services/studentManagementService.js');
      const studentEnrollments = await getStudentEnrollments(email);
      
      const enrollmentMap = {};
      studentEnrollments.forEach(enrollment => {
        enrollmentMap[enrollment.courseId] = enrollment;
      });
      
      setEnrollments(enrollmentMap);
    } catch (error) {
      console.warn('Error loading enrollments:', error);
    }
  };

  /**
   * Check if user has access to a specific course
   */
  const checkCourseAccess = async (courseId) => {
    if (!firebaseReady || !user) return false;
    
    const cacheKey = `${user.uid}-${courseId}`;
    
    if (accessCache[cacheKey] !== undefined) {
      return accessCache[cacheKey];
    }

    try {
      const { checkCourseAccess: checkAccess } = await import('@/services/studentManagementService.js');
      const hasAccess = await checkAccess(user.uid, courseId);
      
      setAccessCache(prev => ({
        ...prev,
        [cacheKey]: hasAccess
      }));
      
      return hasAccess;
    } catch (error) {
      console.warn('Error checking course access:', error);
      return false;
    }
  };

  /**
   * Check if user has enrollment access (for showing enrollment buttons)
   */
  const hasEnrollmentAccess = (courseType) => {
    if (!firebaseReady) return true; // Allow enrollment if Firebase not ready
    
    if (!user || !enrollments) return true;
    
    // Check if already enrolled in this course type
    const isEnrolled = Object.values(enrollments).some(
      enrollment => enrollment.courseType === courseType && enrollment.status === 'active'
    );
    
    return !isEnrolled;
  };

  /**
   * Refresh access data
   */
  const refreshAccess = async () => {
    if (!firebaseReady || !user || !studentProfile?.email) return;
    
    setAccessCache({});
    await loadStudentEnrollments(studentProfile.email);
  };

  const value = {
    // User state
    user,
    studentProfile,
    enrollments,
    loading,
    firebaseReady,
    
    // Access methods
    checkCourseAccess,
    hasEnrollmentAccess,
    refreshAccess,
    
    // Utility
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false
  };

  return (
    <CourseAccessContext.Provider value={value}>
      {children}
    </CourseAccessContext.Provider>
  );
};

/**
 * Hook to use course access context
 */
export const useCourseAccess = () => {
  const context = useContext(CourseAccessContext);
  if (!context) {
    throw new Error('useCourseAccess must be used within CourseAccessProvider');
  }
  return context;
};

/**
 * Component to protect course content
 */
export const ProtectedCourseRoute = ({ 
  children, 
  courseId, 
  fallback = null,
  showLoginPrompt = true 
}) => {
  const { checkCourseAccess, user, loading, firebaseReady } = useCourseAccess();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!firebaseReady) {
        // If Firebase not ready, allow access (fallback mode)
        setHasAccess(true);
        setChecking(false);
        return;
      }

      if (!user) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      const access = await checkCourseAccess(courseId);
      setHasAccess(access);
      setChecking(false);
    };

    verifyAccess();
  }, [courseId, user, firebaseReady, checkCourseAccess]);

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-blue-400">Verifying access...</div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-4">
          {!user ? 'Please log in to access this content' : 'You need enrollment to access this content'}
        </div>
        {showLoginPrompt && !user && (
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Login
          </button>
        )}
      </div>
    );
  }

  return children;
};