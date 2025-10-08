/**
 * Course Access Control System
 * Protects course content based on student enrollment and payment verification
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser, getStudentProfile } from '@/services/firebaseAuthService.js';
import { checkCourseAccess } from '@/services/studentManagementService.js';

// Create Course Access Context
const CourseAccessContext = createContext();

/**
 * Course Access Provider Component
 */
export const CourseAccessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [accessCache, setAccessCache] = useState({});

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Get student profile data
        try {
          const profile = await getStudentProfile(firebaseUser.uid);
          setStudentProfile(profile);
          
          // Load course enrollments
          if (profile?.email) {
            await loadStudentEnrollments(profile.email);
          }
        } catch (error) {
          console.error('Error loading student profile:', error);
        }
      } else {
        setUser(null);
        setStudentProfile(null);
        setEnrollments({});
        setAccessCache({});
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Load student's course enrollments
   */
  const loadStudentEnrollments = async (studentEmail) => {
    try {
      const courseTypes = ['7-day-bootcamp', '2-month-premium'];
      const enrollmentData = {};
      
      for (const courseType of courseTypes) {
        const accessCheck = await checkCourseAccess(studentEmail, courseType);
        
        if (accessCheck.hasAccess) {
          enrollmentData[courseType] = {
            hasAccess: true,
            enrollment: accessCheck.enrollment,
            enrollmentId: accessCheck.enrollmentId,
            progress: accessCheck.progress
          };
        } else {
          enrollmentData[courseType] = {
            hasAccess: false,
            message: accessCheck.message
          };
        }
      }
      
      setEnrollments(enrollmentData);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  /**
   * Check if user has access to specific course
   */
  const hasCourseAccess = async (courseType) => {
    // Check cache first
    const cacheKey = `${user?.uid}-${courseType}`;
    if (accessCache[cacheKey]) {
      return accessCache[cacheKey];
    }
    
    if (!user || !studentProfile) {
      return { hasAccess: false, reason: 'not_authenticated' };
    }
    
    const enrollment = enrollments[courseType];
    
    if (!enrollment || !enrollment.hasAccess) {
      return { hasAccess: false, reason: 'not_enrolled' };
    }
    
    // Cache the result
    const result = { hasAccess: true, enrollment: enrollment.enrollment };
    setAccessCache(prev => ({
      ...prev,
      [cacheKey]: result
    }));
    
    return result;
  };

  /**
   * Get course progress for specific course
   */
  const getCourseProgress = (courseType) => {
    const enrollment = enrollments[courseType];
    
    if (!enrollment || !enrollment.hasAccess) {
      return {
        progress: 0,
        completedLessons: [],
        currentModule: 1,
        timeSpent: 0
      };
    }
    
    return {
      progress: enrollment.progress || 0,
      completedLessons: enrollment.enrollment?.course?.completedLessons || [],
      currentModule: enrollment.enrollment?.course?.currentModule || 1,
      timeSpent: enrollment.enrollment?.course?.timeSpent || 0,
      lastAccessed: enrollment.enrollment?.course?.lastAccessed
    };
  };

  /**
   * Check if user is enrolled in any course
   */
  const hasAnyEnrollment = () => {
    return Object.values(enrollments).some(enrollment => enrollment.hasAccess);
  };

  /**
   * Get all accessible courses
   */
  const getAccessibleCourses = () => {
    return Object.entries(enrollments)
      .filter(([_, enrollment]) => enrollment.hasAccess)
      .map(([courseType, enrollment]) => ({
        courseType,
        ...enrollment
      }));
  };

  /**
   * Refresh enrollment data
   */
  const refreshEnrollments = async () => {
    if (studentProfile?.email) {
      await loadStudentEnrollments(studentProfile.email);
      setAccessCache({}); // Clear cache
    }
  };

  const contextValue = {
    // Authentication state
    user,
    studentProfile,
    loading,
    
    // Course access
    enrollments,
    hasCourseAccess,
    getCourseProgress,
    hasAnyEnrollment,
    getAccessibleCourses,
    
    // Actions
    refreshEnrollments
  };

  return (
    <CourseAccessContext.Provider value={contextValue}>
      {children}
    </CourseAccessContext.Provider>
  );
};

/**
 * Hook to use Course Access Context
 */
export const useCourseAccess = () => {
  const context = useContext(CourseAccessContext);
  
  if (!context) {
    throw new Error('useCourseAccess must be used within a CourseAccessProvider');
  }
  
  return context;
};

/**
 * Higher-Order Component for Course Protection
 */
export const withCourseAccess = (WrappedComponent, requiredCourseType) => {
  return function ProtectedCourseComponent(props) {
    const { hasCourseAccess, loading, user } = useCourseAccess();
    const [accessResult, setAccessResult] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const checkAccess = async () => {
        if (loading) return;
        
        if (!user) {
          setAccessResult({ hasAccess: false, reason: 'not_authenticated' });
          setChecking(false);
          return;
        }
        
        try {
          const result = await hasCourseAccess(requiredCourseType);
          setAccessResult(result);
        } catch (error) {
          console.error('Access check error:', error);
          setAccessResult({ hasAccess: false, reason: 'error', error: error.message });
        }
        
        setChecking(false);
      };

      checkAccess();
    }, [loading, user, requiredCourseType, hasCourseAccess]);

    if (loading || checking) {
      return <CourseAccessLoader />;
    }

    if (!accessResult?.hasAccess) {
      return <CourseAccessDenied reason={accessResult?.reason} courseType={requiredCourseType} />;
    }

    return <WrappedComponent {...props} enrollment={accessResult.enrollment} />;
  };
};

/**
 * Protected Route Component for Courses
 */
export const ProtectedCourseRoute = ({ children, courseType, fallback }) => {
  const { hasCourseAccess, loading, user } = useCourseAccess();
  const [accessResult, setAccessResult] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;
      
      if (!user) {
        setAccessResult({ hasAccess: false, reason: 'not_authenticated' });
        setChecking(false);
        return;
      }
      
      try {
        const result = await hasCourseAccess(courseType);
        setAccessResult(result);
      } catch (error) {
        console.error('Access check error:', error);
        setAccessResult({ hasAccess: false, reason: 'error', error: error.message });
      }
      
      setChecking(false);
    };

    checkAccess();
  }, [loading, user, courseType, hasCourseAccess]);

  if (loading || checking) {
    return <CourseAccessLoader />;
  }

  if (!accessResult?.hasAccess) {
    return fallback || <CourseAccessDenied reason={accessResult?.reason} courseType={courseType} />;
  }

  return children;
};

/**
 * Course Access Loader Component
 */
const CourseAccessLoader = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400 mx-auto mb-4"></div>
        <p className="text-slate-300 text-lg">Verifying course access...</p>
        <p className="text-slate-500 text-sm mt-2">Please wait while we check your enrollment</p>
      </div>
    </div>
  );
};

/**
 * Course Access Denied Component
 */
const CourseAccessDenied = ({ reason, courseType }) => {
  const courseNames = {
    '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
    '2-month-premium': '2-Month Premium Cybersecurity Program'
  };
  
  const messages = {
    not_authenticated: {
      title: 'Authentication Required',
      message: 'Please log in to access this course.',
      action: 'Login',
      actionUrl: '/login'
    },
    not_enrolled: {
      title: 'Enrollment Required', 
      message: `You need to enroll in the ${courseNames[courseType]} to access this content.`,
      action: 'Enroll Now',
      actionUrl: courseType === '7-day-bootcamp' ? '/bootcamp-landing' : '/premium-program-landing'
    },
    expired: {
      title: 'Course Access Expired',
      message: 'Your course access has expired. Please contact support for renewal.',
      action: 'Contact Support',
      actionUrl: '/contact'
    },
    error: {
      title: 'Access Verification Error',
      message: 'We encountered an error verifying your course access. Please try again.',
      action: 'Retry',
      actionUrl: window.location.href
    }
  };
  
  const config = messages[reason] || messages.error;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">{config.title}</h1>
          <p className="text-slate-300 mb-8">{config.message}</p>
          
          <div className="space-y-4">
            <a
              href={config.actionUrl}
              className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors inline-block"
            >
              {config.action}
            </a>
            
            <a
              href="/"
              className="w-full bg-slate-700 text-white py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors inline-block"
            >
              Go to Homepage
            </a>
          </div>
          
          <p className="text-slate-500 text-sm mt-6">
            Need help? <a href="/contact" className="text-sky-400 hover:text-sky-300">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Course Access Status Component
 */
export const CourseAccessStatus = ({ courseType, className = "" }) => {
  const { enrollments, getCourseProgress } = useCourseAccess();
  
  const enrollment = enrollments[courseType];
  const progress = getCourseProgress(courseType);
  
  if (!enrollment) {
    return (
      <div className={`bg-slate-700 rounded-lg p-4 ${className}`}>
        <div className="text-slate-400 text-sm">Loading access status...</div>
      </div>
    );
  }
  
  if (!enrollment.hasAccess) {
    return (
      <div className={`bg-red-500/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
        <div className="text-red-400 text-sm font-medium">No Access</div>
        <div className="text-red-300 text-xs">{enrollment.message}</div>
      </div>
    );
  }
  
  return (
    <div className={`bg-green-500/20 border border-green-500/30 rounded-lg p-4 ${className}`}>
      <div className="text-green-400 text-sm font-medium">Active Enrollment</div>
      <div className="text-green-300 text-xs">
        Progress: {Math.round(progress.progress)}% • 
        {progress.completedLessons.length} lessons completed
      </div>
    </div>
  );
};