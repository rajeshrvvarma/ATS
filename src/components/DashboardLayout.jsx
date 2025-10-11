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
            {/* Logo and Title for Admin */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-sky-600 to-blue-800 rounded-lg flex items-center justify-center border-2 border-sky-400">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-wide">Admin Dashboard</span>
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
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-sky-700 flex items-center justify-center text-white font-bold border-2 border-sky-400">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('') : (user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : (user?.email ? user.email[0].toUpperCase() : 'A'))}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">
                    {user?.name || user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-red-500/30 bg-red-500/20 text-red-400">
                    <Shield className="w-4 h-4" /> Admin
                  </span>
                </div>
              </div>
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