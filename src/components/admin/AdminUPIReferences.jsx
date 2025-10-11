// Admin UPI References Review (simple table, can be expanded)
import React, { useEffect, useState } from 'react';

export default function AdminUPIReferences() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    // For demo: load from localStorage (replace with Firestore in production)
    const data = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
    setReceipts(data.reverse());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">UPI Payment References</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 text-white rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Reference/UTR</th>
              <th className="px-4 py-2">Enrollment ID</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 && (
              <tr><td colSpan={7} className="text-center py-6 text-slate-400">No UPI payments found.</td></tr>
            )}
            {receipts.map((r, i) => (
              <tr key={i} className="border-b border-slate-700">
                <td className="px-4 py-2 text-xs">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{r.studentName}</td>
                <td className="px-4 py-2">{r.studentEmail}</td>
                <td className="px-4 py-2">{r.courseType}</td>
                <td className="px-4 py-2">₹{r.amount}</td>
                <td className="px-4 py-2 font-mono text-xs">{r.paymentId}</td>
                <td className="px-4 py-2 font-mono text-xs">{r.enrollmentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
