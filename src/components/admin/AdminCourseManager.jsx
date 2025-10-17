import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', price: 'Free', category: 'general' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'courses'));
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
    setLoading(false);
  }

  function openAdd() { setForm({ title: '', slug: '', price: 'Free', category: 'general' }); setShowAdd(true); setEditing(null); }
  function openEdit(c) { setEditing(c); setForm({ title: c.title || '', slug: c.slug || '', price: c.price || 'Free', category: c.category || 'general' }); setShowAdd(true); }

  async function save() {
    try {
      if (editing) {
        await updateDoc(doc(db, 'courses', editing.id), { title: form.title, slug: form.slug, price: form.price, category: form.category });
      } else {
        await addDoc(collection(db, 'courses'), { title: form.title, slug: form.slug, price: form.price, category: form.category });
      }
      setShowAdd(false);
      await load();
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  }

  async function removeCourse(id) {
    if (!confirm('Delete this course?')) return;
    try { await deleteDoc(doc(db, 'courses', id)); await load(); } catch (err) { console.error(err); }
  }

  if (loading) return <div className="text-slate-400">Loading courses...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Course Manager</h3>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus /> Add Course</button>
        </div>
      </div>

      <div className="grid gap-3">
        {courses.map(c => (
          <div key={c.id} className="bg-slate-800 p-3 rounded-md border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{c.title}</div>
              <div className="text-slate-400 text-sm">{c.category} • {c.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(c)} className="px-3 py-2 bg-slate-700 rounded-md"><Edit size={16} /></button>
              <button onClick={() => removeCourse(c.id)} className="px-3 py-2 bg-red-700 rounded-md"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="mt-4 bg-slate-800 p-4 rounded-md border border-slate-700">
          <div className="grid md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={save} className="btn-primary">Save</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
