import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const ToastConfirmContext = createContext(null);

export function useToasts() {
  const ctx = useContext(ToastConfirmContext);
  if (!ctx) throw new Error('useToasts must be used within ToastConfirmProvider');
  return ctx.toastsApi;
}

export function useConfirm() {
  const ctx = useContext(ToastConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ToastConfirmProvider');
  return ctx.confirmApi;
}

export function usePrompt() {
  const ctx = useContext(ToastConfirmContext);
  if (!ctx) throw new Error('usePrompt must be used within ToastConfirmProvider');
  return ctx.promptApi;
}

export default function ToastConfirmProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const idRef = useRef(1);

  const showToast = useCallback((type, message, ms = 4000) => {
    const id = idRef.current++;
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
  }, []);

  const toastsApi = {
    success: (msg, ms) => showToast('success', msg, ms),
    error: (msg, ms) => showToast('error', msg, ms),
    info: (msg, ms) => showToast('info', msg, ms),
  };

  const confirmApi = useCallback((message, title = 'Confirm') => {
    return new Promise(resolve => {
      setConfirmState({ message, title, resolve });
    });
  }, []);

  const promptApi = useCallback((message, opts = {}) => {
    return new Promise(resolve => {
      setPromptState({ message, title: opts.title || 'Input', defaultValue: opts.defaultValue || '', placeholder: opts.placeholder || '', resolve });
    });
  }, []);

  const handleConfirm = (ok) => {
    if (confirmState && typeof confirmState.resolve === 'function') confirmState.resolve(ok);
    setConfirmState(null);
  };

  return (
    <ToastConfirmContext.Provider value={{ toastsApi, confirmApi, promptApi }}>
      {children}
      {ReactDOM.createPortal(
        <div aria-live="polite" className="fixed right-4 top-4 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <div key={t.id} className={`px-4 py-2 rounded shadow-md text-sm ${t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-700 text-white'}`}>
              {t.message}
            </div>
          ))}
        </div>, document.body
      )}

      {confirmState && ReactDOM.createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-slate-800 text-white p-6 rounded shadow-lg z-10 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">{confirmState.title}</h3>
            <div className="mb-4 text-slate-200">{confirmState.message}</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-slate-600 rounded" onClick={() => handleConfirm(false)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 rounded text-white" onClick={() => handleConfirm(true)}>Confirm</button>
            </div>
          </div>
        </div>, document.body
      )}
      {promptState && ReactDOM.createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-slate-800 text-white p-6 rounded shadow-lg z-10 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">{promptState.title}</h3>
            <div className="mb-4 text-slate-200">{promptState.message}</div>
            <input autoFocus defaultValue={promptState.defaultValue} placeholder={promptState.placeholder} className="w-full px-3 py-2 bg-slate-700 rounded mb-4 text-white" onKeyDown={(e) => { if (e.key === 'Enter') { promptState.resolve(e.target.value); setPromptState(null); } }} />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-slate-600 rounded" onClick={() => { promptState.resolve(null); setPromptState(null); }}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 rounded text-white" onClick={() => {
                const input = document.querySelector('.bg-slate-700');
                const val = input ? input.value : '';
                promptState.resolve(val);
                setPromptState(null);
              }}>OK</button>
            </div>
          </div>
        </div>, document.body
      )}
    </ToastConfirmContext.Provider>
  );
}
