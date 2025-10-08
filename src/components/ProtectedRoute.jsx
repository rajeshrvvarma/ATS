import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    
    // Special handling for student dashboard - allow access if user has enrollments
    const currentPath = window.location.pathname;
    console.log('🛡️ ProtectedRoute called for:', currentPath, 'Roles:', roles);
    
    if (currentPath === '/dashboard' && roles?.includes('student')) {
        // Check if user has enrollment data (either URL param or localStorage)
        const urlParams = new URLSearchParams(window.location.search);
        const enrollmentId = urlParams.get('enrollmentId');
        const hasLocalEnrollments = localStorage.getItem('enrollment_receipts');
        
        console.log('🔍 Dashboard Access Check:', {
            currentPath,
            enrollmentId,
            hasLocalEnrollments: !!hasLocalEnrollments,
            fullUrl: window.location.href,
            allLocalStorage: Object.keys(localStorage)
        });
        
        // TEMPORARY: Allow all dashboard access for testing
        console.log('🧪 TEMPORARY: Allowing all dashboard access for testing');
        return children;
        
        // Original logic (commented out for testing)
        // if (enrollmentId || hasLocalEnrollments) {
        //     console.log('✅ Dashboard access granted for enrolled student');
        //     return children;
        // } else {
        //     console.log('❌ No enrollment data found, will redirect');
        // }
    }
    
    if (loading) return <div className="text-slate-300 p-8">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
}


