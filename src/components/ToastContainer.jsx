import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  if (!toasts?.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 rounded-lg shadow-lg px-4 py-3 border ${
          t.variant === 'success' ? 'bg-slate-800/95 border-green-500/30' :
          t.variant === 'error' ? 'bg-slate-800/95 border-red-500/30' :
          'bg-slate-800/95 border-sky-500/30'
        }`}>
          <div className="mt-0.5">
            {t.variant === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : t.variant === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <Info className="w-5 h-5 text-sky-400" />
            )}
          </div>
          <div className="text-slate-100 text-sm pr-2">{t.message}</div>
          <button onClick={() => remove(t.id)} className="ml-auto text-slate-400 hover:text-white text-sm">×</button>
        </div>
      ))}
    </div>
  );
}


