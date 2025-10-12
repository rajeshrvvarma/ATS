import React, { useEffect, useState } from 'react';
import { getIndexAlerts, dismissIndexAlert, clearIndexAlerts } from '@/services/indexAlertService.js';

export default function AdminIndexAlerts() {
  const [alerts, setAlerts] = useState([]);

  const load = () => setAlerts(getIndexAlerts());

  useEffect(() => {
    load();
  }, []);

  const handleDismiss = (key) => {
    dismissIndexAlert(key);
    load();
  };

  const handleClearAll = () => {
    clearIndexAlerts();
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Firestore Index Alerts</h3>
        <button onClick={handleClearAll} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm text-white">Clear All</button>
      </div>
      {alerts.length === 0 ? (
        <div className="text-slate-400">No index alerts recorded. All good!</div>
      ) : (
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.key} className="bg-slate-800 border border-slate-700 rounded p-3">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="text-white font-medium">{a.source}</div>
                  <div className="text-slate-300 text-sm">{a.message}</div>
                  {a.path && <div className="text-slate-400 text-xs mt-1">Path: {a.path}</div>}
                  <div className="text-slate-400 text-xs mt-1">Count: {a.count} • Last seen: {new Date(a.lastSeen).toLocaleString()}</div>
                  {a.indexLink && (
                    <a href={a.indexLink} target="_blank" rel="noreferrer" className="text-sky-400 text-sm mt-2 inline-block">Create required index →</a>
                  )}
                </div>
                <button onClick={() => handleDismiss(a.key)} className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
