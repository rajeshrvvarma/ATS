import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getIndexAlerts } from '@/services/indexAlertService.js';

export default function IndexAlertBanner({ mode = 'admin', onOpenAdminAlerts }) {
  const [alerts, setAlerts] = useState([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      setAlerts(getIndexAlerts());
    } catch (_) {
      setAlerts([]);
    }
  }, []);

  if (hidden || alerts.length === 0) return null;

  const count = alerts.length;
  const latest = alerts[0];

  return (
    <div className="mb-4">
      <div className="rounded-md border border-yellow-400/30 bg-yellow-50 text-yellow-900 px-4 py-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600" />
          <div>
            <div className="font-semibold">Some Firestore queries require composite indexes</div>
            <div className="text-sm">
              {count} pending alert{count > 1 ? 's' : ''}. {latest?.source ? `Latest: ${latest.source}` : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'admin' && (
            <button
              onClick={() => onOpenAdminAlerts && onOpenAdminAlerts()}
              className="px-3 py-1.5 rounded bg-yellow-600 text-white text-sm hover:bg-yellow-700"
            >
              Open Index Alerts
            </button>
          )}
          <button
            onClick={() => setHidden(true)}
            className="text-yellow-900/70 hover:text-yellow-900 text-sm"
            aria-label="Dismiss index alerts banner"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
