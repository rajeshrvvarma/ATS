import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

export default function Profile({ onNavigate }) {
  // AuthContext was removed from the project. Use a local placeholder
  // so the page does not import the deleted module. This keeps the
  // component buildable; when no user is present the form is disabled.
  const user = null;
  const [profile, setProfile] = useState(null);
  const [adminNotes, setAdminNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfileAndNotes() {
      setLoading(true);
      setError('');
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        setProfile(snap.exists() ? snap.data() : {});
        // Fetch admin notes subcollection
        const notesCol = collection(db, 'users', user.uid, 'notes');
        const notesSnap = await getDocs(notesCol);
        const notesList = notesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by createdAt descending
        notesList.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        setAdminNotes(notesList);
      } catch (err) {
        setError('Failed to load profile: ' + err.message);
      }
      setLoading(false);
    }
    if (user?.uid) fetchProfileAndNotes();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    if (!user?.uid) {
      setError('You are not logged in.');
      setSaving(false);
      return;
    }
    try {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto bg-slate-800 rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">My Profile</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.name || ''} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.email || ''} disabled />
        </div>
        {user?.role === 'student' && (
          <>
            <div>
              <label className="block text-slate-300 mb-1">Enrollment Number</label>
              <input className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.enrollmentNumber || ''} onChange={e => setProfile(p => ({ ...p, enrollmentNumber: e.target.value }))} />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Course</label>
              <input className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.course || ''} onChange={e => setProfile(p => ({ ...p, course: e.target.value }))} />
            </div>
          </>
        )}
        {user?.role === 'instructor' && (
          <>
            <div>
              <label className="block text-slate-300 mb-1">Expertise</label>
              <input className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.expertise || ''} onChange={e => setProfile(p => ({ ...p, expertise: e.target.value }))} />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Bio</label>
              <textarea className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
            </div>
          </>
        )}
        {/* Show all admin notes from subcollection */}
        {adminNotes.length > 0 && (
          <div>
            <label className="block text-slate-300 mb-1">Admin Notes</label>
            <ul className="bg-slate-900 border rounded px-3 py-2 text-white space-y-2">
              {adminNotes.map(note => (
                <li key={note.id} className="border-b border-slate-700 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  <div>{note.note}</div>
                  {note.createdAt && <div className="text-xs text-slate-400 mt-1">{note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : ''}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Only admins can edit the main notes field */}
        {user?.role === 'admin' && (
          <div>
            <label className="block text-slate-300 mb-1">(Admin-only) Notes Field</label>
            <textarea className="w-full border rounded px-3 py-2 bg-slate-900 text-white" value={profile?.notes || ''} onChange={e => setProfile(p => ({ ...p, notes: e.target.value }))} />
          </div>
        )}
        <div className="flex gap-2 justify-end mt-6">
          <button type="button" className="px-4 py-2 bg-slate-700 text-white rounded" onClick={() => onNavigate && onNavigate('dashboard')}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
