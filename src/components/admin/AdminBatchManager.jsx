import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import SessionUpload from './SessionUpload.jsx';
import { collection as collRef, getDocs as getDocsRef, deleteDoc as deleteDocRef, doc as docRef, updateDoc as updateDocRef } from 'firebase/firestore';

export default function AdminBatchManager() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ courseId: '', title: '', startDate: '', seats: 30, price: '' });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

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
      if (form.id) {
        // update existing batch
        await updateDoc(doc(db, 'batches', form.id), { ...form, seatsLeft: form.seats });
      } else {
        await addDoc(collection(db, 'batches'), { ...form, seatsLeft: form.seats });
      }
      setForm({ courseId: '', title: '', startDate: '', seats: 30, price: '' });
      setShowAdd(false);
      await load();
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
          <div key={b.id} className="bg-slate-800 p-3 rounded-md border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{b.title}</div>
                <div className="text-slate-400 text-sm">Starts: {b.startDate} • Seats: {b.seatsLeft}/{b.seats}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setForm({ ...b, id: b.id }) || setShowAdd(true)} className="px-3 py-2 bg-slate-700 rounded-md"><Edit size={16} /></button>
                <button onClick={() => removeBatch(b.id)} className="px-3 py-2 bg-red-700 rounded-md"><Trash2 size={16} /></button>
                <button onClick={async () => {
                  if (selectedBatch === b.id) { setSelectedBatch(null); setSessions([]); return; }
                  setSelectedBatch(b.id);
                  // load sessions
                  setSessionsLoading(true);
                  try {
                    const snap = await getDocsRef(collRef(db, 'batches', b.id, 'sessions'));
                    setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                  } catch (err) { console.error('Failed to load sessions', err); alert('Failed to load sessions'); }
                  setSessionsLoading(false);
                }} className="px-3 py-2 bg-slate-600 rounded-md">Manage Sessions</button>
              </div>
            </div>

            {selectedBatch === b.id && (
              <div className="mt-3 bg-slate-900 p-3 rounded-md border border-slate-700">
                <h4 className="text-sm font-semibold text-white mb-2">Sessions for {b.title}</h4>
                <div className="space-y-2">
                  {sessionsLoading && <div className="text-slate-400">Loading sessions...</div>}
                  {(!sessionsLoading && sessions.length === 0) && <div className="text-slate-400">No sessions yet. Upload below.</div>}
                  {sessions.map(s => (
                    <div key={s.id} className="bg-slate-800 p-2 rounded-md border border-slate-700 flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-medium">{s.title || 'Untitled session'}</div>
                          <div className="text-slate-400 text-xs">{s.size ? Math.round(s.size/1024) + ' KB' : ''}</div>
                        </div>
                        {s.recordingUrl && (
                          <div className="mt-2">
                            <video controls className="w-full max-h-48 bg-black rounded">
                              <source src={s.recordingUrl} />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={async () => {
                            const newTitle = prompt('Edit session title', s.title || '');
                            if (newTitle === null) return;
                            try {
                              await updateDocRef(docRef(db, 'batches', b.id, 'sessions', s.id), { title: newTitle });
                              setSessions(prev => prev.map(x => x.id === s.id ? { ...x, title: newTitle } : x));
                            } catch (err) { console.error('Failed to update session', err); alert('Failed to update session'); }
                          }} className="px-2 py-1 bg-slate-700 rounded">Edit</button>
                          <button onClick={async () => {
                            if (!confirm('Delete this session?')) return;
                            try {
                              await deleteDocRef(docRef(db, 'batches', b.id, 'sessions', s.id));
                              setSessions(prev => prev.filter(x => x.id !== s.id));
                            } catch (err) { console.error('Failed to delete session', err); alert('Failed to delete'); }
                          }} className="px-2 py-1 bg-red-700 rounded">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <h5 className="text-sm text-slate-300 mb-2">Upload new session recording</h5>
                  <SessionUpload batchId={b.id} onUploaded={(info) => {
                    // reload sessions after upload
                    (async () => {
                      setSessionsLoading(true);
                      try {
                        const snap = await getDocsRef(collRef(db, 'batches', b.id, 'sessions'));
                        setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                      } catch (err) { console.error(err); }
                      setSessionsLoading(false);
                    })();
                  }} />
                </div>
              </div>
            )}
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
