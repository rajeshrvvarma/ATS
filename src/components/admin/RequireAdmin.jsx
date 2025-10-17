import React from 'react';
import { useAuth } from '@/context/AuthContext.jsx';

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Checking permissions...</div>;
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-slate-400">You must be an admin to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
