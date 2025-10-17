import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';

export default function PaymentsReconcile() {
  const { user, loading } = useAuth();
  const [missing, setMissing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!loading && user && user.role === 'admin') fetchMissing();
  }, [loading, user, page]);

  async function fetchMissing() {
    setIsLoading(true);
    try {
      // Admin endpoint requires header with secret
      const secret = window.__ENV__?.ENROLLMENT_API_SECRET || '';
      const res = await fetch(`/.netlify/functions/admin-list-missing-orders?limit=${perPage}&page=${page}`, {
        headers: { 'x-enrollment-secret': secret }
      });
      const data = await res.json();
      setMissing(data.missing || []);
    } catch (e) {
      console.error(e);
    } finally { setIsLoading(false); }
  }

  async function reprocess(orderId) {
    if (!confirm(`Reprocess order ${orderId}?`)) return;
    try {
      const secret = window.__ENV__?.ENROLLMENT_API_SECRET || '';
      const res = await fetch('/.netlify/functions/admin-reprocess-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-enrollment-secret': secret },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      alert('Result: ' + (data.result ? JSON.stringify(data.result) : JSON.stringify(data)));
      fetchMissing();
    } catch (e) { console.error(e); alert('Reprocess failed'); }
  }

  if (loading) return <div className="p-6">Checking auth...</div>;
  if (!user || user.role !== 'admin') return <div className="p-6">Access denied. Admins only.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Payments Reconciliation</h2>
      {isLoading ? <p>Loading...</p> : (
        <div>
          {missing.length === 0 && <p>No missing orders found.</p>}
          <ul>
            {missing.map(m => (
              <li key={m.orderId} className="border p-3 my-2 rounded">
                <div><strong>Order:</strong> {m.orderId}</div>
                <div><strong>Amount:</strong> {m.order?.amount || m.order?.payment?.amount}</div>
                <button onClick={() => reprocess(m.orderId)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Reprocess</button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded">Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
