import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext.jsx';
import { useTheme } from '@/context/ThemeContext.jsx';

export default function SettingsDrawer() {
  const { open, toggleOpen, compactLessons, setCompactLessons, enableShortcuts, setEnableShortcuts } = useSettings();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`fixed inset-0 z-[70] pointer-events-none ${open ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={toggleOpen} />
      <div className={`absolute right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 shadow-xl pointer-events-auto`}> 
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold"><SlidersHorizontal className="w-4 h-4"/> Settings</div>
          <button onClick={toggleOpen} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4 space-y-4 text-slate-200">
          <div>
            <div className="text-sm font-semibold mb-2">Appearance</div>
            <button onClick={toggleTheme} className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700">
              Toggle Theme (Current: {theme})
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Lessons</div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={compactLessons} onChange={(e)=>setCompactLessons(e.target.checked)} />
              <span className="text-sm">Compact lesson list</span>
            </label>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Player</div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={enableShortcuts} onChange={(e)=>setEnableShortcuts(e.target.checked)} />
              <span className="text-sm">Enable keyboard shortcuts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}


