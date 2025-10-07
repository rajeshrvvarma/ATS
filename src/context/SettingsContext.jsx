import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SettingsContext = createContext({
  compactLessons: false,
  enableShortcuts: true,
  open: false,
  setCompactLessons: () => {},
  setEnableShortcuts: () => {},
  toggleOpen: () => {},
});

export function SettingsProvider({ children }) {
  const [compactLessons, setCompactLessons] = useState(false);
  const [enableShortcuts, setEnableShortcuts] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings') || '{}');
    if (typeof saved.compactLessons === 'boolean') setCompactLessons(saved.compactLessons);
    if (typeof saved.enableShortcuts === 'boolean') setEnableShortcuts(saved.enableShortcuts);
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify({ compactLessons, enableShortcuts }));
  }, [compactLessons, enableShortcuts]);

  const toggleOpen = () => setOpen(v => !v);
  const value = useMemo(() => ({ compactLessons, enableShortcuts, open, setCompactLessons, setEnableShortcuts, toggleOpen }), [compactLessons, enableShortcuts, open]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}


