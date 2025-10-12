/**
 * Access Control Context
 * Manages enrollment-based content access and permissions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase.js';
import { 
  verifyAccessCourse, 
  getStudentEnrollments, 
  getSecureContentUrl,
  updateLessonProgress
} from '@/services/enrollmentService.js';

const AccessControlContext = createContext();

export const AccessControlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [accessCache, setAccessCache] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserEnrollments(firebaseUser.uid);
      } else {
        setUser(null);
        setEnrollments([]);
        setAccessCache({});
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Load user enrollments
   */
  const loadUserEnrollments = async (userId) => {
    try {
      const userEnrollments = await getStudentEnrollments(userId);
      setEnrollments(userEnrollments);
      
      // Preload access cache for active enrollments
      const activeEnrollments = userEnrollments.filter(e => e.enrollment.status === 'active');
      const cacheEntries = {};
      
      activeEnrollments.forEach(enrollment => {
        const cacheKey = `${userId}_${enrollment.courseId}`;
        cacheEntries[cacheKey] = {
          hasAccess: true,
          enrollment,
          accessLevel: enrollment.enrollment.accessLevel,
          progress: enrollment.enrollment.progress
        };
      });
      
      setAccessCache(cacheEntries);
      
    } catch (error) {
      console.error('Failed to load user enrollments:', error);
    }
  };

  /**
   * Check if user has access to a course
   */
  const checkCourseAccess = async (courseId) => {
    if (!user) return { hasAccess: false, reason: 'Not authenticated' };
    
    const cacheKey = `${user.uid}_${courseId}`;
    
    // Return cached result if available
    if (accessCache[cacheKey]) {
      return accessCache[cacheKey];
    }

    try {
      const accessResult = await verifyAccessCourse(user.uid, courseId);
      
      // Cache the result
      setAccessCache(prev => ({
        ...prev,
        [cacheKey]: accessResult
      }));
      
      return accessResult;
      
    } catch (error) {
      console.error('Access check failed:', error);
      return { hasAccess: false, reason: 'Access check failed' };
    }
  };

  /**
   * Get secure URL for course content
   */
  const getContentUrl = async (courseId, contentPath) => {
    if (!user) return null;
    
    try {
      const secureUrl = await getSecureContentUrl(user.uid, courseId, contentPath);
      return secureUrl;
      
    } catch (error) {
      console.error('Failed to get content URL:', error);
      return null;
    }
  };

  /**
   * Update lesson progress
   */
  const updateProgress = async (courseId, lessonId, progressPercentage, completed = false) => {
    if (!user) return { success: false, reason: 'Not authenticated' };
    
    try {
      const result = await updateLessonProgress(
        user.uid, 
        courseId, 
        lessonId, 
        progressPercentage, 
        completed
      );
      
      if (result.success) {
        // Update local cache
        const cacheKey = `${user.uid}_${courseId}`;
        if (accessCache[cacheKey]) {
          setAccessCache(prev => ({
            ...prev,
            [cacheKey]: {
              ...prev[cacheKey],
              progress: result.progress
            }
          }));
        }
        
        // Refresh enrollments
        await loadUserEnrollments(user.uid);
      }
      
      return result;
      
    } catch (error) {
      console.error('Progress update failed:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user is enrolled in any course
   */
  const hasAnyEnrollment = () => {
    return enrollments.some(e => e.enrollment.status === 'active');
  };

  /**
   * Get course enrollment details
   */
  const getCourseEnrollment = (courseId) => {
    return enrollments.find(e => e.courseId === courseId && e.enrollment.status === 'active');
  };

  /**
   * Get user's course progress
   */
  const getCourseProgress = (courseId) => {
    const enrollment = getCourseEnrollment(courseId);
    return enrollment ? enrollment.enrollment.progress : 0;
  };

  /**
   * Get completed lessons for a course
   */
  const getCompletedLessons = (courseId) => {
    const enrollment = getCourseEnrollment(courseId);
    return enrollment ? enrollment.enrollment.completedLessons : [];
  };

  /**
   * Check if specific lesson is completed
   */
  const isLessonCompleted = (courseId, lessonId) => {
    const completedLessons = getCompletedLessons(courseId);
    return completedLessons.includes(lessonId);
  };

  /**
   * Get user's active enrollments
   */
  const getActiveEnrollments = () => {
    return enrollments.filter(e => e.enrollment.status === 'active');
  };

  /**
   * Refresh enrollment data
   */
  const refreshEnrollments = async () => {
    if (user) {
      await loadUserEnrollments(user.uid);
    }
  };

  /**
   * Clear access cache (useful after enrollment changes)
   */
  const clearAccessCache = () => {
    setAccessCache({});
  };

  const contextValue = {
    // User state
    user,
    loading,
    
    // Enrollment data
    enrollments,
    activeEnrollments: getActiveEnrollments(),
    
    // Access control methods
    checkCourseAccess,
    getContentUrl,
    
    // Progress tracking
    updateProgress,
    getCourseProgress,
    getCompletedLessons,
    isLessonCompleted,
    
    // Utility methods
    hasAnyEnrollment,
    getCourseEnrollment,
    refreshEnrollments,
    clearAccessCache
  };

  return (
    <AccessControlContext.Provider value={contextValue}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error('useAccessControl must be used within AccessControlProvider');
  }
  return context;
};

/**
 * Higher-order component for protecting content based on enrollment
 */
export const withAccessControl = (WrappedComponent, requiredCourseId) => {
  return function ProtectedComponent(props) {
    const { checkCourseAccess, loading } = useAccessControl();
    const [accessGranted, setAccessGranted] = useState(false);
    const [accessLoading, setAccessLoading] = useState(true);

    useEffect(() => {
      const checkAccess = async () => {
        if (!loading && requiredCourseId) {
          const result = await checkCourseAccess(requiredCourseId);
          setAccessGranted(result.hasAccess);
        }
        setAccessLoading(false);
      };

      checkAccess();
    }, [loading, requiredCourseId, checkCourseAccess]);

    if (loading || accessLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-white">Loading...</div>
        </div>
      );
    }

    if (!accessGranted) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Access Restricted</h3>
            <p className="text-slate-400">Please enroll in this course to access the content.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default AccessControlContext;