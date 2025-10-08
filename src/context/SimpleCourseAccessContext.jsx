/**
 * Simplified Course Access Context for Testing
 * Basic version without Firebase dependencies
 */

import React, { createContext, useContext, useState } from 'react';

const CourseAccessContext = createContext();

export const CourseAccessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCourseAccess = (courseId) => {
    // Simple mock - always return false for now
    return false;
  };

  const hasEnrollmentAccess = (courseType) => {
    // Simple mock - always return false for now  
    return false;
  };

  const value = {
    user,
    loading,
    checkCourseAccess,
    hasEnrollmentAccess,
    enrollments: {},
    studentProfile: null
  };

  return (
    <CourseAccessContext.Provider value={value}>
      {children}
    </CourseAccessContext.Provider>
  );
};

export const useCourseAccess = () => {
  const context = useContext(CourseAccessContext);
  if (!context) {
    throw new Error('useCourseAccess must be used within CourseAccessProvider');
  }
  return context;
};

export const ProtectedCourseRoute = ({ children, courseId, fallback }) => {
  // For now, just render children (no protection)
  return children;
};