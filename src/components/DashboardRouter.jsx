import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import StudentDashboard from '@/pages/StudentDashboard.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';

/**
 * DashboardRouter - Routes users to appropriate dashboard based on role
 * Students -> StudentDashboard
 * Admin/Owner/Instructor -> AdminDashboard
 */
export default function DashboardRouter({ onNavigate }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
          <p className="text-slate-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check for enrollment-based access (non-authenticated students)
  const urlParams = new URLSearchParams(window.location.search);
  const enrollmentId = urlParams.get('enrollmentId');
  const hasLocalEnrollments = localStorage.getItem('enrollment_receipts');

  // If no user but has enrollment data, show student dashboard
  if (!user && (enrollmentId || hasLocalEnrollments)) {
    return <StudentDashboard onNavigate={onNavigate} />;
  }

  // If no user and no enrollment data, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route authenticated users based on role
  switch (user.role) {
    case 'student':
      return <StudentDashboard onNavigate={onNavigate} />;
    case 'admin':
      return <AdminDashboard onNavigate={onNavigate} />;
    default:
      // Fallback for unknown roles
      return <Navigate to="/" replace />;
  }
}