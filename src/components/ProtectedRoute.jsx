import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    
    // Special handling for student dashboard - allow access if user has enrollments
    const currentPath = window.location.pathname;
    console.log('ProtectedRoute - Current path:', currentPath);
    console.log('ProtectedRoute - Roles:', roles);
    console.log('ProtectedRoute - User:', user);
    
    if (currentPath === '/dashboard' && roles?.includes('student')) {
        // Check if user has enrollment data (either URL param or localStorage)
        const urlParams = new URLSearchParams(window.location.search);
        const enrollmentId = urlParams.get('enrollmentId');
        const hasLocalEnrollments = localStorage.getItem('enrollment_receipts');
        
        console.log('Dashboard access check - enrollmentId:', enrollmentId);
        console.log('Dashboard access check - hasLocalEnrollments:', !!hasLocalEnrollments);
        
        if (enrollmentId || hasLocalEnrollments) {
            console.log('Allowing dashboard access for enrolled student');
            // Allow access to dashboard for enrolled students
            return children;
        }
    }
    
    if (loading) {
        console.log('Auth loading...');
        return <div className="text-slate-300 p-8">Loading...</div>;
    }
    
    if (!user) {
        console.log('No user, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    if (roles && roles.length && !roles.includes(user.role)) {
        console.log('User role not authorized, redirecting to home');
        return <Navigate to="/" replace />;
    }
    
    console.log('Access granted');
    return children;
}


