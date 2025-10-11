import React from 'react';
import { LogOut, User, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

/**
 * DashboardLayout - Shared layout for all dashboard types
 * Includes header with user info, logout button, and main content area
 */
export default function DashboardLayout({ children, title, user, onNavigate }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AT</span>
                </div>
                <span className="text-white font-semibold">AT-CS</span>
              </div>
              {title && (
                <>
                  <div className="h-6 w-px bg-slate-600"></div>
                  <h1 className="text-xl font-semibold text-white">{title}</h1>
                </>
              )}
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.photoURL || user?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=0ea5e9&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-slate-600"
                  />
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white">
                      {user?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)}`}>
                        {getRoleIcon(user?.role)}
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors border border-slate-600 hover:border-slate-500"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
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