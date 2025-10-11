import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Shield, GraduationCap } from 'lucide-react';

export default function UserMenu({ user, onLogout, onProfile, roleLabel = 'User' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'instructor':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'student':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium border border-slate-600 hover:border-slate-500 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-white font-bold border-2 border-sky-400">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('') : (user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : (user?.email ? user.email[0].toUpperCase() : 'U'))}
        </div>
        <span className="hidden sm:block">{user?.name || user?.displayName || user?.email?.split('@')[0] || roleLabel}</span>
        {getRoleIcon(user?.role)}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
            onClick={() => { setOpen(false); onProfile && onProfile(); }}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
            onClick={() => { setOpen(false); onLogout && onLogout(); }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
