import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    
    const currentPath = window.location.pathname;
    console.log('🛡️ ProtectedRoute called for:', currentPath, 'Required roles:', roles);
    
    // Special handling for student dashboard - allow access for enrolled students OR authenticated users
    if (currentPath === '/dashboard') {
        // Check if user is authenticated with student role
        if (user && user.role === 'student') {
            console.log('✅ Authenticated student accessing dashboard');
            return children;
        }
        
        // Check for enrollment data (for non-authenticated access)
        const urlParams = new URLSearchParams(window.location.search);
        const enrollmentId = urlParams.get('enrollmentId');
        const hasLocalEnrollments = localStorage.getItem('enrollment_receipts');
        
        if (enrollmentId || hasLocalEnrollments) {
            console.log('✅ Dashboard access granted via enrollment data');
            return children;
        }
        
        // Redirect unauthenticated users without enrollments to home
        if (!user) {
            console.log('❌ No authentication or enrollment data, redirecting to home');
            return <Navigate to="/" replace />;
        }
    }
    
    // Admin dashboard access
    if (currentPath === '/admin') {
        if (!user || user.role !== 'admin') {
            console.log('❌ Admin access denied, redirecting to home');
            return <Navigate to="/" replace />;
        }
    }
    
    if (loading) return <div className="text-slate-300 p-8">Loading...</div>;
    
    // General role-based access control
    if (roles && roles.length) {
        if (!user) return <Navigate to="/login" replace />;
        if (!roles.includes(user.role)) return <Navigate to="/" replace />;
    }
    
    return children;
}


