import React from 'react';
import { Shield, GraduationCap, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import UserMenu from '@/components/UserMenu.jsx';

/**
 * DashboardLayout - Shared layout for all dashboard types
 * Includes header with user info, logout button, and main content area
 */
export default function DashboardLayout({ children, title, user, onNavigate }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate && onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'instructor':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'student':
        return <User className="w-5 h-5 text-green-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'instructor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'student':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Determine dashboard label and icon by role
  let dashboardLabel = 'Dashboard';
  let dashboardIcon = <User className="w-5 h-5 text-white" />;
  let roleLabel = 'User';
  if (user?.role === 'admin') {
    dashboardLabel = 'Admin Dashboard';
    dashboardIcon = <Shield className="w-5 h-5 text-white" />;
    roleLabel = 'Admin';
  } else if (user?.role === 'instructor') {
    dashboardLabel = 'Instructor Dashboard';
    dashboardIcon = <GraduationCap className="w-5 h-5 text-white" />;
    roleLabel = 'Instructor';
  } else if (user?.role === 'student') {
    dashboardLabel = 'Student Dashboard';
    dashboardIcon = <User className="w-5 h-5 text-white" />;
    roleLabel = 'Student';
  }

  const handleProfile = () => {
    if (onNavigate) onNavigate('profile');
    // If using react-router, use navigate('/profile')
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title for Role */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-sky-600 to-blue-800 rounded-lg flex items-center justify-center border-2 border-sky-400">
                  {dashboardIcon}
                </div>
                <span className="text-white font-bold text-lg tracking-wide">{dashboardLabel}</span>
              </div>
              {title && (
                <>
                  <div className="h-6 w-px bg-slate-600"></div>
                  <h1 className="text-xl font-semibold text-white">{title}</h1>
                </>
              )}
            </div>

            {/* User Menu Dropdown */}
            <UserMenu user={user} onLogout={handleLogout} onProfile={handleProfile} roleLabel={roleLabel} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}