import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, variant = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const toast = { id, message, variant };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({ notify, toasts, remove }), [notify, toasts, remove]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}


