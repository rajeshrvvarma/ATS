import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { uploadFile } from '@/services/uploadService.js';

export default function AdminCourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', price: 'Free', category: 'general', modules: [], thumbnailUrl: '' });
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);

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

  function openAdd() { setForm({ title: '', slug: '', price: 'Free', category: 'general', modules: [], thumbnailUrl: '' }); setShowAdd(true); setEditing(null); }
  function openEdit(c) { setEditing(c); setForm({ title: c.title || '', slug: c.slug || '', price: c.price || 'Free', category: c.category || 'general', modules: c.modules || [], thumbnailUrl: c.thumbnailUrl || '' }); setShowAdd(true); }

  async function save() {
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        price: form.price,
        category: form.category,
        modules: Array.isArray(form.modules) ? form.modules : [],
        thumbnailUrl: form.thumbnailUrl || ''
      };

      if (!payload.slug || payload.slug.trim() === '') {
        // derive slug from title
        payload.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (editing) {
        await updateDoc(doc(db, 'courses', editing.id), payload);
      } else {
        await addDoc(collection(db, 'courses'), payload);
      }
      setShowAdd(false);
      await load();
    } catch (err) {
      console.error('Failed to save course:', err);
      alert('Failed to save course: ' + err.message);
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
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug (optional)" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="p-2 bg-slate-900 border-slate-700 rounded-md" />
          </div>

          {/* Thumbnail upload */}
          <div className="mt-3">
            <label className="block text-sm text-slate-300 mb-1">Thumbnail (optional)</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                setUploadingThumb(true);
                setThumbProgress(0);
                try {
                  const slug = form.slug || form.title || 'course';
                  const safeSlug = slug.toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
                  const path = `thumbnails/courses/${safeSlug}-${Date.now()}_${f.name}`;
                  const url = await uploadFile(path, f, (p) => setThumbProgress(p));
                  setForm(prev => ({ ...prev, thumbnailUrl: url }));
                } catch (err) {
                  console.error('Thumbnail upload failed', err);
                  alert('Thumbnail upload failed: ' + err.message);
                } finally {
                  setUploadingThumb(false);
                }
              }} />
              {uploadingThumb && <div className="text-sm text-slate-400">Uploading: {thumbProgress}%</div>}
              {form.thumbnailUrl && <div className="text-sm text-slate-300">Uploaded</div>}
            </div>
          </div>

          {/* Modules list editor */}
          <div className="mt-4">
            <label className="block text-sm text-slate-300 mb-2">Modules (order matters)</label>
            <div className="space-y-2">
              {(form.modules || []).map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input value={m.title || ''} onChange={e => {
                    const arr = [...form.modules]; arr[idx] = { ...arr[idx], title: e.target.value }; setForm({ ...form, modules: arr });
                  }} placeholder="Module title" className="p-2 bg-slate-900 border-slate-700 rounded-md flex-1" />
                  <input value={m.duration || ''} onChange={e => {
                    const arr = [...form.modules]; arr[idx] = { ...arr[idx], duration: e.target.value }; setForm({ ...form, modules: arr });
                  }} placeholder="Duration (e.g., 2h)" className="p-2 bg-slate-900 border-slate-700 rounded-md w-40" />
                  <button onClick={() => { const arr = [...form.modules]; arr.splice(idx,1); setForm({ ...form, modules: arr }); }} className="px-2 py-1 bg-red-700 rounded-md"><Trash2 size={14} /></button>
                </div>
              ))}
              <div>
                <button onClick={() => setForm({ ...form, modules: [...(form.modules||[]), { title: '', duration: '' }] })} className="px-3 py-2 bg-slate-700 rounded-md flex items-center gap-2"><Plus size={14} /> Add Module</button>
              </div>
            </div>
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
