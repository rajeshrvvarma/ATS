import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';

export default function AdminBatchManager() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ courseId: '', title: '', startDate: '', seats: 30, price: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'batches'));
      setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error('Failed to load batches:', err); }
    setLoading(false);
  }

  async function save() {
    try {
      await addDoc(collection(db, 'batches'), { ...form, seatsLeft: form.seats });
      setShowAdd(false); await load();
    } catch (err) { console.error('Failed to save batch:', err); }
  }

  async function removeBatch(id) { if (!confirm('Delete batch?')) return; try { await deleteDoc(doc(db, 'batches', id)); await load(); } catch (err) { console.error(err); } }

  if (loading) return <div className="text-slate-400">Loading batches...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Batch Manager</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus /> Add Batch</button>
      </div>

      <div className="grid gap-3">
        {batches.map(b => (
          <div key={b.id} className="bg-slate-800 p-3 rounded-md border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{b.title}</div>
              <div className="text-slate-400 text-sm">Starts: {b.startDate} • Seats: {b.seatsLeft}/{b.seats}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('Edit not implemented yet')} className="px-3 py-2 bg-slate-700 rounded-md"><Edit size={16} /></button>
              <button onClick={() => removeBatch(b.id)} className="px-3 py-2 bg-red-700 rounded-md"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="mt-4 bg-slate-800 p-4 rounded-md border border-slate-700">
          <div className="grid md:grid-cols-2 gap-3">
            <input value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} placeholder="Course ID" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Batch Title" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} placeholder="Start Date (YYYY-MM-DD)" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input type="number" value={form.seats} onChange={e => setForm({...form, seats: Number(e.target.value)})} placeholder="Seats" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={save} className="btn-primary">Save Batch</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
