import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RequireAdmin from '@/components/admin/RequireAdmin.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Eye, Pencil, Trash2, BookOpen } from 'lucide-react';
import AdminEventsManagement from '@/components/admin/AdminEventsManagement.jsx';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, limit, startAfter, addDoc, serverTimestamp } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

// Simple audit logging helper for admin actions
async function logAdminAction(actorId, action, targetId = null, details = null) {
  try {
    await addDoc(collection(db, 'adminLogs'), {
      actorId: actorId || null,
      action: action,
      targetId: targetId || null,
      details: details || null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // don't block main flow if logging fails
    console.error('logAdminAction failed', err);
  }
}

function Tabs({ active, onChange }) {
  const list = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
    { id: 'orders', label: 'Orders' },
    { id: 'system', label: 'System' },
  ];
  return (
    <div className="flex gap-6 border-b border-slate-700 mb-6">
      {list.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} className={active === t.id ? 'text-white border-b-2 border-sky-500 px-3 py-2' : 'px-3 py-2 text-slate-400'}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const PAGE_SIZE = 25;
  const [pageCursor, setPageCursor] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  async function loadPage(cursor = null, pushToStack = false) {
    setLoading(true);
    try {
      let q;
      if (cursor) {
        q = query(collection(db, 'users'), orderBy('displayName'), startAfter(cursor), limit(PAGE_SIZE));
      } else {
        q = query(collection(db, 'users'), orderBy('displayName'), limit(PAGE_SIZE));
      }
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}), __snap: d }));
      setUsers(list);
      setHasMore(snap.size === PAGE_SIZE);
      const last = snap.docs[snap.docs.length - 1] || null;
      if (pushToStack && pageCursor) setCursorStack(s => [...s, pageCursor]);
      setPageCursor(last);
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  useEffect(() => { loadPage(null); }, []);

  const filtered = useMemo(() => users.filter(u => !search || (u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))), [users, search]);

  async function handleDelete(id) {
    if (currentUser && id === currentUser.uid) {
      return alert('You cannot delete your own user account.');
    }
    if (!confirm('Delete user?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(prev => prev.filter(p => p.id !== id));
      setSelectedIds(s => { const n = new Set(s); n.delete(id); return n; });
      // audit log
      try { await logAdminAction(currentUser?.uid, 'delete_user', id, null); } catch (e) { console.error(e); }
    } catch (err) {
      alert('Delete failed: ' + String(err));
    }
  }

  function openEdit(u) {
    if (currentUser && u.id === currentUser.uid) {
      // Allow viewing but prevent demoting self in edit UI by disabling the role selector later
      setEditingUser({ ...u });
      setShowEdit(true);
      return;
    }
    setEditingUser({ ...u });
    setShowEdit(true);
  }

  async function saveEdit() {
    if (!editingUser) return;
    try {
      const ref = doc(db, 'users', editingUser.id);
      await updateDoc(ref, { role: editingUser.role, status: editingUser.status });
      setUsers(prev => prev.map(p => p.id === editingUser.id ? { ...p, role: editingUser.role, status: editingUser.status } : p));
      setShowEdit(false);
      setEditingUser(null);
      // audit log
      try { await logAdminAction(currentUser?.uid, 'update_user', editingUser.id, { role: editingUser.role, status: editingUser.status }); } catch (e) { console.error(e); }
    } catch (err) {
      alert('Save failed: ' + String(err));
    }
  }

  function toggleSelect(id) {
    setSelectedIds(s => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filtered.map(u => u.id)));
  }

  async function nextPage() {
    if (!pageCursor) return;
    await loadPage(pageCursor, true);
  }

  async function prevPage() {
    const stack = [...cursorStack];
    const prev = stack.pop();
    if (!prev) {
      // load first page
      setCursorStack([]);
      await loadPage(null);
      return;
    }
    setCursorStack(stack);
    // We need to query starting at the prev cursor's previous position - simplest is to re-query from start and paginate until prev
    // For now, loadPage with prev as startAfter (works as 'next' of prev page) but this is an approximation.
    await loadPage(prev);
  }

  async function bulkUpdateRole(newRole) {
    if (selectedIds.size === 0) return alert('Select users first');
    if (!confirm(`Set role to ${newRole} for ${selectedIds.size} users?`)) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      if (currentUser && id === currentUser.uid && newRole !== 'admin') {
        // skip demoting self
        continue;
      }
      try {
        await updateDoc(doc(db, 'users', id), { role: newRole });
      } catch (err) {
        console.error('bulk role update failed for', id, err);
      }
    }
    setUsers(prev => prev.map(p => ids.includes(p.id) ? { ...p, role: (p.id === currentUser?.uid && newRole !== 'admin') ? p.role : newRole } : p));
    setSelectedIds(new Set());
    // audit log for bulk role change
    try { await logAdminAction(currentUser?.uid, 'bulk_update_role', null, { ids, newRole }); } catch (e) { console.error(e); }
  }

  async function bulkUpdateStatus(newStatus) {
    if (selectedIds.size === 0) return alert('Select users first');
    if (!confirm(`Set status to ${newStatus} for ${selectedIds.size} users?`)) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      try {
        await updateDoc(doc(db, 'users', id), { status: newStatus });
      } catch (err) {
        console.error('bulk status update failed for', id, err);
      }
    }
    setUsers(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: newStatus } : p));
    setSelectedIds(new Set());
    // audit log for bulk status change
    try { await logAdminAction(currentUser?.uid, 'bulk_update_status', null, { ids, newStatus }); } catch (e) { console.error(e); }
  }

  async function bulkDelete() {
    if (selectedIds.size === 0) return alert('Select users first');
    if (!confirm(`Delete ${selectedIds.size} users? This cannot be undone.`)) return;
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      if (currentUser && id === currentUser.uid) {
        // skip deleting self
        continue;
      }
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (err) {
        console.error('bulk delete failed for', id, err);
      }
    }
    setUsers(prev => prev.filter(p => !ids.includes(p.id) || (currentUser && p.id === currentUser.uid)));
    setSelectedIds(new Set());
    // audit log for bulk delete
    try { await logAdminAction(currentUser?.uid, 'bulk_delete_users', null, { ids }); } catch (e) { console.error(e); }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users" className="px-3 py-2 bg-slate-900 text-white rounded border border-slate-700" />
      </div>
      {loading ? <div>Loading users...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div>
          <div className="mb-3 flex gap-2 items-center">
            <button onClick={toggleSelectAll} className="px-3 py-2 bg-slate-700 rounded text-sm">Select all</button>
            <button onClick={() => bulkUpdateRole('instructor')} className="px-3 py-2 bg-yellow-600 rounded text-sm">Make Instructor</button>
            <button onClick={() => bulkUpdateRole('student')} className="px-3 py-2 bg-blue-600 rounded text-sm">Make Student</button>
            <button onClick={() => bulkUpdateStatus('active')} className="px-3 py-2 bg-green-600 rounded text-sm">Set Active</button>
            <button onClick={() => bulkUpdateStatus('inactive')} className="px-3 py-2 bg-red-600 rounded text-sm">Set Inactive</button>
            <button onClick={bulkDelete} className="px-3 py-2 bg-red-700 rounded text-sm text-white">Delete Selected</button>
            <div className="ml-auto text-sm text-slate-400">Selected: {selectedIds.size}</div>
          </div>
          <div className="mb-3 flex gap-2">
            <button onClick={prevPage} className="px-3 py-1 bg-slate-700 rounded text-sm">Prev</button>
            <button onClick={nextPage} className="px-3 py-1 bg-slate-700 rounded text-sm">Next</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-slate-800 rounded-lg text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="px-4 py-2 w-12"><input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.size === filtered.length && filtered.length > 0} /></th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-400">No users found.</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="px-4 py-2"><input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                    <td className="px-4 py-2">{u.displayName || 'Unknown'}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.status || 'active'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="p-2 rounded hover:bg-sky-700 text-sky-400" title="View"><Eye size={16} /></button>
                      <button className="p-2 rounded hover:bg-yellow-700 text-yellow-400" title="Edit" onClick={() => openEdit(u)}><Pencil size={16} /></button>
                      <button className="p-2 rounded hover:bg-red-700 text-red-400" onClick={() => handleDelete(u.id)} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Edit User</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Role</label>
                <select className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white" value={editingUser.role || 'student'} onChange={e => setEditingUser(s => ({ ...s, role: e.target.value }))}>
                  <option value="student">student</option>
                  <option value="instructor">instructor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Status</label>
                <select className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white" value={editingUser.status || 'active'} onChange={e => setEditingUser(s => ({ ...s, status: e.target.value }))}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowEdit(false); setEditingUser(null); }} className="px-4 py-2 bg-slate-600 text-white rounded">Cancel</button>
                <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const PAGE_SIZE_COURSES = 20;
  const [courseCursor, setCourseCursor] = useState(null);
  const [courseCursorStack, setCourseCursorStack] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCourseEdit, setShowCourseEdit] = useState(false);

  async function loadCourses(cursor = null, pushToStack = false) {
    setLoading(true);
    try {
      let q;
      if (cursor) q = query(collection(db, 'courses'), orderBy('title'), startAfter(cursor), limit(PAGE_SIZE_COURSES));
      else q = query(collection(db, 'courses'), orderBy('title'), limit(PAGE_SIZE_COURSES));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}), __snap: d }));
      setCourses(list);
      const last = snap.docs[snap.docs.length - 1] || null;
      if (pushToStack && courseCursor) setCourseCursorStack(s => [...s, courseCursor]);
      setCourseCursor(last);
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  useEffect(() => { loadCourses(null); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete course?')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      setCourses(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed: ' + String(err));
    }
  }

  async function nextCoursePage() {
    if (!courseCursor) return;
    await loadCourses(courseCursor, true);
  }

  async function prevCoursePage() {
    const stack = [...courseCursorStack];
    const prev = stack.pop();
    if (!prev) {
      setCourseCursorStack([]);
      await loadCourses(null);
      return;
    }
    setCourseCursorStack(stack);
    await loadCourses(prev);
  }

  function openCourseEdit(c) {
    setEditingCourse({ ...c });
    setShowCourseEdit(true);
  }

  async function saveCourseEdit() {
    if (!editingCourse) return;
    try {
      await updateDoc(doc(db, 'courses', editingCourse.id), { title: editingCourse.title, price: editingCourse.price });
      setCourses(prev => prev.map(p => p.id === editingCourse.id ? { ...p, title: editingCourse.title, price: editingCourse.price } : p));
      setShowCourseEdit(false);
      setEditingCourse(null);
    } catch (err) {
      alert('Save failed: ' + String(err));
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Courses</h3>
      {loading ? <div>Loading courses...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 rounded-lg text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">No courses found.</td></tr>
                  ) : courses.map(c => (
                <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="px-4 py-2">{c.title || c.name}</td>
                  <td className="px-4 py-2">{c.slug}</td>
                  <td className="px-4 py-2">{c.price || '-'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="p-2 rounded hover:bg-sky-700 text-sky-400" title="View"><BookOpen size={16} /></button>
                    <button className="p-2 rounded hover:bg-yellow-700 text-yellow-400" title="Edit" onClick={() => openCourseEdit(c)}><Pencil size={16} /></button>
                    <button className="p-2 rounded hover:bg-red-700 text-red-400" onClick={() => handleDelete(c.id)} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <button onClick={prevCoursePage} className="px-3 py-1 bg-slate-700 rounded">Prev</button>
        <button onClick={nextCoursePage} className="px-3 py-1 bg-slate-700 rounded">Next</button>
      </div>

  {showCourseEdit && editingCourse && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Course</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Title</label>
            <input className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white" value={editingCourse.title || ''} onChange={e => setEditingCourse(s => ({ ...s, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Price</label>
            <input className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white" value={editingCourse.price || ''} onChange={e => setEditingCourse(s => ({ ...s, price: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowCourseEdit(false); setEditingCourse(null); }} className="px-4 py-2 bg-slate-600 text-white rounded">Cancel</button>
            <button onClick={saveCourseEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const list = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
        if (mounted) setOrders(list);
      } catch (err) {
        if (mounted) setError(String(err));
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Orders</h3>
      {loading ? <div>Loading orders...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 rounded-lg text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">No orders found.</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="px-4 py-2">{o.id}</td>
                  <td className="px-4 py-2">{o.userEmail || o.customerEmail || '-'}</td>
                  <td className="px-4 py-2">{o.amount || o.total || '-'}</td>
                  <td className="px-4 py-2">{o.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <RequireAdmin>
      <DashboardLayout user={user}>
        <div className="p-6">
          <Tabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded">Summary widget (placeholder)</div>
                <div className="p-4 bg-slate-800 rounded">Another widget (placeholder)</div>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UsersTab currentUser={user} />}

          {activeTab === 'events' && <AdminEventsManagement />}

          {activeTab === 'courses' && <CoursesTab />}

          {activeTab === 'orders' && <OrdersTab />}

          {activeTab === 'system' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">System</h2>
              <div className="text-slate-400">System and settings placeholder.</div>
            </div>
          )}

        </div>
      </DashboardLayout>
    </RequireAdmin>
  );
}
