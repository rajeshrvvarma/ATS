import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAdmin from '@/components/admin/RequireAdmin.jsx';
import { useAuth } from "@/context/AuthContext.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

<<<<<<< HEAD
export default function AdminDashboard() {
=======

// Component to show user replies to admin notes
function UserRepliesSection() {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserReplies();
  }, []);

  const loadUserReplies = async () => {
    try {
      // Get all users
      const usersCol = collection(db, "users");
      const usersSnapshot = await getDocs(usersCol);

      const allReplies = [];

      // For each user, check for replies to notes
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        // Get notes for this user
        const notesCol = collection(db, 'users', userId, 'notes');
        const notesSnapshot = await getDocs(notesCol);

        // For each note, check for replies
        for (const noteDoc of notesSnapshot.docs) {
          const noteId = noteDoc.id;
          const noteData = noteDoc.data();

          const repliesCol = collection(db, 'users', userId, 'notes', noteId, 'replies');
          const repliesQuery = query(repliesCol, orderBy('createdAt', 'desc'));
          const repliesSnapshot = await getDocs(repliesQuery);

          repliesSnapshot.docs.forEach(replyDoc => {
            const replyData = replyDoc.data();
            allReplies.push({
              id: replyDoc.id,
              ...replyData,
              noteId,
              noteText: noteData.note,
              userId,
              userName: userData.displayName || userData.email || 'Unknown User'
            });
          });
        }
      }

      // Sort by creation date (newest first)
      allReplies.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

      setReplies(allReplies.slice(0, 10)); // Show only recent 10 replies
    } catch (err) {
      console.error('Failed to load user replies:', err);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-slate-400">Loading replies...</div>;

  if (replies.length === 0) {
    return <div className="text-slate-400">No user replies yet.</div>;
  }

  return (
    <div className="space-y-4 max-h-60 overflow-y-auto">
      {replies.map(reply => (
        <div key={`${reply.userId}-${reply.noteId}-${reply.id}`} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-white">{reply.userName}</div>
            {reply.createdAt && (
              <div className="text-xs text-slate-400">
                {reply.createdAt.toDate ? reply.createdAt.toDate().toLocaleString() : ''}
              </div>
            )}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            Replying to: "{reply.noteText?.substring(0, 50)}..."
          </div>
          <div className="text-slate-200">{reply.reply}</div>
        </div>
      ))}
    </div>
  );
}


function AdminDashboard({ onNavigate }) {
>>>>>>> parent of 17cab90 (Update AdminDashboard.jsx)
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showProfile, setShowProfile] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
        if (mounted) setUsers(list);
      } catch (err) {
        if (mounted) setError(String(err));
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = users.filter(u => {
    const matchesSearch = !search || (u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All Status' || (u.status || 'active').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id) {
    if (!confirm('Delete user?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(u => u.filter(x => x.id !== id));
    } catch (err) {
      alert('Delete failed: ' + String(err));
    }
  }

  return (
    <RequireAdmin>
      <DashboardLayout user={user}>
        <div className="p-6">
<<<<<<< HEAD
          <div className="flex gap-6 border-b border-slate-700 mb-6">
            <button onClick={() => setTab('overview')} className={tab === 'overview' ? 'text-white border-b-2 border-sky-500 px-3 py-2' : 'px-3 py-2 text-slate-400'}>Overview</button>
            <button onClick={() => setTab('users')} className={tab === 'users' ? 'text-white border-b-2 border-sky-500 px-3 py-2' : 'px-3 py-2 text-slate-400'}>Users</button>
=======
        <IndexAlertBanner mode="admin" onOpenAdminAlerts={() => setTab('index-alerts')} />
        <div className="flex gap-6 border-b border-slate-700 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`px-3 py-2 font-medium border-b-2 transition-colors ${tab === t.key ? "border-sky-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>


  {tab === "overview" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
            {loading ? (
              <div>Loading overview...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-800 rounded-lg p-6 flex flex-col items-center">
                    <div className="text-3xl font-bold text-sky-400">{users.length}</div>
                    <div className="text-slate-400 mt-2">Total Users</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6 flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</div>
                    <div className="text-slate-400 mt-2">Active Users</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6 flex flex-col items-center">
                    <div className="text-3xl font-bold text-purple-400">{users.filter(u => u.role === 'instructor').length}</div>
                    <div className="text-slate-400 mt-2">Instructors</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6 flex flex-col items-center">
                    <div className="text-3xl font-bold text-blue-400">{users.filter(u => u.role === 'student').length}</div>
                    <div className="text-slate-400 mt-2">Students</div>
                  </div>
                </div>

                {/* Recent User Replies to Admin Notes */}
                <div className="bg-slate-800 rounded-lg p-6 mb-8">
                  <div className="text-lg font-semibold mb-4 text-white">Recent User Replies</div>
                  <UserRepliesSection />
                </div>

                {/* Recent activity */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="text-lg font-semibold mb-4 text-white">Recent User Activity</div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left text-slate-400">
                          <th className="px-4 py-2">USER</th>
                          <th className="px-4 py-2">ROLE</th>
                          <th className="px-4 py-2">STATUS</th>
                          <th className="px-4 py-2">JOIN DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .slice()
                          .sort((a, b) => (b.joinDate || '').localeCompare(a.joinDate || ''))
                          .slice(0, 5)
                          .map(user => (
                            <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                              <td className="px-4 py-2 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                  {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : 'U'}
                                </div>
                                <div>
                                  <div className="font-semibold">{user.displayName || 'Unknown'}</div>
                                  <div className="text-xs text-slate-400">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[user.role] || 'bg-gray-200 text-gray-700'}`}>{user.role}</span>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[user.status] || 'bg-gray-200 text-gray-700'}`}>{user.status}</span>
                              </td>
                              <td className="px-4 py-2">{user.joinDate || '-'}</td>
                            </tr>
                          ))}
                        {users.length === 0 && (
                          <tr><td colSpan={4} className="text-center py-4 text-slate-400">No recent activity.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Edit User Modal */}
            {showEditUser && editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-md">
                  <h3 className="text-lg font-semibold text-white mb-4">Edit User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={editingUser.displayName || ''}
                        onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={editingUser.email || ''}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                      <select
                        value={editingUser.role || 'student'}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                      <select
                        value={editingUser.status || 'active'}
                        onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSaveUser}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {setShowEditUser(false); setEditingUser(null);}}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            {ordersLoading && <div className="text-slate-400">Loading orders...</div>}
            {!ordersLoading && orders.length === 0 && <div className="text-slate-400">No orders available.</div>}
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="bg-slate-800 p-3 rounded border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">{o.gateway || 'gateway'} • {o.amount ? (o.amount/100) + ' ' + (o.currency || 'INR') : ''}</div>
                    <div className="text-white font-medium">{o.notes?.courseName || o.notes?.course_name || ''} — Order: {o.id} {o.processed ? <span className="text-green-300 ml-2">(Processed)</span> : <span className="text-yellow-300 ml-2">(Pending)</span>}</div>
                    <div className="text-xs text-slate-400">Customer: {o.customer?.email || o.notes?.email || o.customer?.contact || ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      if (!confirm('Reprocess this order?')) return;
                      try {
                        const resp = await fetch('/.netlify/functions/admin-reprocess-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'x-enrollment-secret': (import.meta.env.VITE_ENROLLMENT_API_SECRET || '') },
                          body: JSON.stringify({ orderId: o.id })
                        });
                        const data = await resp.json();
                        alert('Reprocess result: ' + JSON.stringify(data));
                      } catch (err) { console.error(err); alert('Reprocess failed'); }
                    }} className="px-3 py-2 bg-sky-600 rounded text-white">Reprocess</button>
                  </div>
                </div>
              ))}
            </div>
>>>>>>> parent of 17cab90 (Update AdminDashboard.jsx)
          </div>

          {tab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
              <div className="text-slate-300">Simple overview placeholder. Add widgets here.</div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users" className="px-3 py-2 bg-slate-900 text-white rounded border border-slate-700" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-900 text-white rounded border border-slate-700">
                  <option>All Status</option>
                  <option>active</option>
                  <option>inactive</option>
                </select>
              </div>

              {loading ? <div>Loading users...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-slate-800 rounded-lg text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
<<<<<<< HEAD
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No users found.</td></tr>
                      ) : filtered.map(u => (
                        <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-2">{u.displayName || 'Unknown'}</td>
                          <td className="px-4 py-2">{u.email}</td>
                          <td className="px-4 py-2">{u.status || 'active'}</td>
=======
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-2 flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                              {user.displayName ? user.displayName.split(" ").map(n => n[0]).join("") : "U"}
                            </div>
                            <div>
                              <button className="font-semibold text-sky-400 hover:underline" onClick={async () => {
                                setProfileUserLoading(true);
                                setProfileUser(user);
                                setShowUserProfile(true);
                                // Fetch user's courses
                                try {
                                  const coursesCol = collection(db, "courses");
                                  const q = query(coursesCol, where("students", "array-contains", user.id));
                                  const snap = await getDocs(q);
                                  setProfileUserCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                                } catch (err) {
                                  setProfileUserCourses([]);
                                }
                                setProfileUserLoading(false);
                              }}>{user.displayName || "Unknown"}</button>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
            {/* User Profile Modal */}
            {showUserProfile && profileUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">User Profile</h3>
                  {profileUserLoading ? (
                    <div className="text-slate-300">Loading...</div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="text-xl font-bold text-white">{profileUser.displayName}</div>
                        <div className="text-slate-400">{profileUser.email}</div>
                        <div className="text-slate-400 text-sm">Joined: {profileUser.joinDate || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold text-slate-300 mb-1">Courses Enrolled</div>
                        {profileUserCourses.length === 0 ? (
                          <div className="text-slate-500 text-sm">No courses found.</div>
                        ) : (
                          <ul className="list-disc pl-5 text-slate-200 text-sm">
                            {profileUserCourses.map(c => (
                              <li key={c.id}>{c.title || c.name || 'Untitled Course'} <span className="text-slate-400">(Fee Paid: ₹{c.feePaid || 0})</span></li>
                            ))}
                          </ul>
                        )}

                                {tab === "course-management" && (
                                  <div>
                                    <h2 className="text-2xl font-bold mb-4">Course Management</h2>
                                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                      <AdminCourseManager />
                                    </div>
                                  </div>
                                )}

                                {tab === "batch-management" && (
                                  <div>
                                    <h2 className="text-2xl font-bold mb-4">Batch & Session Management</h2>
                                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                      <AdminBatchManager />
                                    </div>
                                  </div>
                                )}
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold text-slate-300 mb-1">Progress</div>
                        <div className="text-slate-200">{profileUser.progress || '-'}</div>
                      </div>
                      {/* Admin Actions */}
                      <div className="flex flex-col gap-2 mt-6">
                        <div className="flex gap-2 flex-wrap">
                          {/* Deactivate/Activate */}
                          <button
                            onClick={async () => {
                              if (!profileUser) return;
                              const newStatus = profileUser.status === 'active' ? 'inactive' : 'active';
                              try {
                                await updateDoc(doc(db, 'users', profileUser.id), { status: newStatus });
                                setProfileUser({ ...profileUser, status: newStatus });
                                setRefresh(r => !r);
                              } catch (err) {
                                alert('Failed to update user status: ' + err.message);
                              }
                            }}
                            className={`px-3 py-2 rounded-md text-white ${profileUser.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                            {profileUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          </button>
                          {/* Promote/Demote Role */}
                          <button
                            onClick={async () => {
                              if (!profileUser) return;
                              const newRole = profileUser.role === 'student' ? 'instructor' : (profileUser.role === 'instructor' ? 'admin' : 'student');
                              try {
                                await updateDoc(doc(db, 'users', profileUser.id), { role: newRole });
                                setProfileUser({ ...profileUser, role: newRole });
                                setRefresh(r => !r);
                              } catch (err) {
                                alert('Failed to update user role: ' + err.message);
                              }
                            }}
                            className="px-3 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                          >
                            Promote/Demote Role
                          </button>
                          {/* Remove from Course */}
                          <button
                            onClick={async () => {
                              if (!profileUser || profileUserCourses.length === 0) return;
                              // Remove from first course as example
                              const course = profileUserCourses[0];
                              try {
                                await updateDoc(doc(db, 'courses', course.id), {
                                  students: (course.students || []).filter(id => id !== profileUser.id)
                                });
                                setProfileUserCourses(profileUserCourses.slice(1));
                                setRefresh(r => !r);
                              } catch (err) {
                                alert('Failed to remove from course: ' + err.message);
                              }
                            }}
                            className="px-3 py-2 rounded-md text-white bg-pink-600 hover:bg-pink-700"
                            disabled={profileUserCourses.length === 0}
                          >
                            Remove from Course
                          </button>
                          {/* Reset Progress */}
                          <button
                            onClick={async () => {
                              if (!profileUser) return;
                              try {
                                await updateDoc(doc(db, 'users', profileUser.id), { progress: 0 });
                                setProfileUser({ ...profileUser, progress: 0 });
                                setRefresh(r => !r);
                              } catch (err) {
                                alert('Failed to reset progress: ' + err.message);
                              }
                            }}
                            className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Reset Progress
                          </button>
                          {/* Download User Data */}
                          <button
                            onClick={async () => {
                              // Download user data as CSV
                              const { exportToCSV } = await import('@/services/reportingService.js');
                              const userData = [{ ...profileUser, courses: profileUserCourses.map(c => c.title).join('; ') }];
                              exportToCSV(userData, `${profileUser.displayName || profileUser.email}-data.csv`);
                            }}
                            className="px-3 py-2 rounded-md text-white bg-slate-500 hover:bg-slate-600"
                          >
                            Download User Data
                          </button>
                          {/* Impersonate User */}
                          <button
                            onClick={() => {
                              // Set impersonation in localStorage/session (simple demo)
                              localStorage.setItem('impersonateUserId', profileUser.id);
                              window.location.reload();
                            }}
                            className="px-3 py-2 rounded-md text-white bg-gray-700 hover:bg-gray-800"
                          >
                            Impersonate User
                          </button>
                          {/* Send Email */}
                          <button
                            onClick={async () => {
                              const { sendWelcomeEmail } = await import('@/services/emailService.js');
                              const result = await sendWelcomeEmail({ name: profileUser.displayName, email: profileUser.email }, { enrollmentId: 'ADMIN', courseType: 'admin', startDate: new Date(), accessUrl: window.location.origin });
                              alert(result.success ? 'Email sent!' : 'Failed: ' + result.error);
                            }}
                            className="px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Send Email
                          </button>
                          {/* View Payment History */}
                          <button
                            onClick={async () => {
                              // Query payments for this user (example: from Firestore 'payments' collection)
                              const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
                              const db = getFirestore();
                              const q = query(collection(db, 'payments'), where('userId', '==', profileUser.id));
                              const snap = await getDocs(q);
                              if (snap.empty) return alert('No payment history found.');
                              const payments = snap.docs.map(d => d.data());
                              alert(payments.map(p => `₹${p.amount} on ${p.date || p.createdAt}`).join('\n'));
                            }}
                            className="px-3 py-2 rounded-md text-white bg-green-700 hover:bg-green-800"
                          >
                            View Payment History
                          </button>
                          {/* View Activity Log */}
                          <button
                            onClick={async () => {
                              // Get forum and analytics activity
                              const { getUserForumStats } = await import('@/services/forumService.js');
                              const forumStats = await getUserForumStats(profileUser.id);
                              alert(forumStats.success ? `Threads: ${forumStats.data.threadsCreated}\nReplies: ${forumStats.data.repliesPosted}\nReputation: ${forumStats.data.reputation}` : 'No forum activity.');
                            }}
                            className="px-3 py-2 rounded-md text-white bg-orange-600 hover:bg-orange-700"
                          >
                            View Activity Log
                          </button>
                          {/* Add Note */}
                          <button
                            onClick={async () => {
                              const note = prompt('Enter note for this user:');
                              if (!note) return;
                              const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                              const db = getFirestore();
                              await addDoc(collection(db, `users/${profileUser.id}/notes`), { note, createdAt: serverTimestamp() });
                              alert('Note added!');
                            }}
                            className="px-3 py-2 rounded-md text-white bg-slate-700 hover:bg-slate-800"
                          >
                            Add Note
                          </button>
                        </div>
                        <button
                          onClick={() => setShowUserProfile(false)}
                          className="mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[(user.role || 'student').toLowerCase()] || "bg-gray-200 text-gray-700"}`}>
                              {(user.role || 'student')}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[(user.status || 'active').toLowerCase()] || "bg-gray-200 text-gray-700"}`}>
                              {(user.status || 'active')}
                            </span>
                          </td>
                          <td className="px-4 py-2">{user.joinDate || "-"}</td>
                          <td className="px-4 py-2">{user.progress || "-"}</td>
>>>>>>> parent of 17cab90 (Update AdminDashboard.jsx)
                          <td className="px-4 py-2 flex gap-2">
                            <button className="p-2 rounded hover:bg-sky-700 text-sky-400" onClick={() => { setProfileUser(u); setShowProfile(true); }}><Eye size={16} /></button>
                            <button className="p-2 rounded hover:bg-yellow-700 text-yellow-400" onClick={() => alert('Edit not implemented')}><Pencil size={16} /></button>
                            <button className="p-2 rounded hover:bg-red-700 text-red-400" onClick={() => handleDelete(u.id)}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showProfile && profileUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold text-white mb-2">{profileUser.displayName}</h3>
                    <div className="text-slate-400 mb-4">{profileUser.email}</div>
                    <div className="flex justify-end">
                      <button onClick={() => setShowProfile(false)} className="px-4 py-2 bg-slate-600 text-white rounded">Close</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </DashboardLayout>
    </RequireAdmin>
  );
}

                                const { getUserForumStats } = await import('@/services/forumService.js');
                                const forumStats = await getUserForumStats(profileUser.id);
                                alert(forumStats.success ? `Threads: ${forumStats.data.threadsCreated}\nReplies: ${forumStats.data.repliesPosted}\nReputation: ${forumStats.data.reputation}` : 'No forum activity.');
                              }}
                              className="px-3 py-2 rounded-md text-white bg-orange-600 hover:bg-orange-700"
                            >
                              View Activity Log
                            </button>
                            {/* Add Note */}
                            <button
                              onClick={async () => {
                                const note = prompt('Enter note for this user:');
                                if (!note) return;
                                const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                                const db = getFirestore();
                                await addDoc(collection(db, `users/${profileUser.id}/notes`), { note, createdAt: serverTimestamp() });
                                alert('Note added!');
                              }}
                              className="px-3 py-2 rounded-md text-white bg-slate-700 hover:bg-slate-800"
                            >
                              Add Note
                            </button>
                          </div>
                          <button
                            onClick={() => setShowUserProfile(false)}
                            className="mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ...other tab blocks go here, all properly closed... */}
        </div>
      </DashboardLayout>
    </RequireAdmin>
                                        const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
                                        <div>
                                          <h2 className="text-2xl font-bold mb-4">User Management</h2>
                                          <div className="flex flex-row gap-3 mb-6 items-center">
                                            <input
                                              className="border border-slate-700 rounded px-3 py-2 w-64 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                              placeholder="Search users..."
                                              value={search}
                                              onChange={e => setSearch(e.target.value)}
                                            />
                                            <select
                                              className="border border-slate-700 rounded px-3 py-2 w-40 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                              value={statusFilter}
                                              onChange={e => setStatusFilter(e.target.value)}
                                            >
                                              <option>All Status</option>
                                              <option>active</option>
                                              <option>inactive</option>
                                            </select>
                                          </div>
                                          {loading ? (
                                            <div>Loading users...</div>
                                          ) : error ? (
                                            <div className="text-red-600">{error}</div>
                                          ) : (
                                            <div className="overflow-x-auto">
                                              <table className="min-w-full bg-slate-800 rounded-lg text-sm">
                                                <thead>
                                                  <tr className="text-left text-gray-400">
                                                    <th className="px-4 py-2">USER</th>
                                                    <th className="px-4 py-2">ROLE</th>
                                                    <th className="px-4 py-2">STATUS</th>
                                                    <th className="px-4 py-2">JOIN DATE</th>
                                                    <th className="px-4 py-2">PROGRESS</th>
                                                    <th className="px-4 py-2">ACTIONS</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {filteredUsers.length === 0 ? (
                                                    <tr>
                                                      <td colSpan={6} className="text-center py-4 text-gray-400">No users found.</td>
                                                    </tr>
                                                  ) : (
                                                    filteredUsers.map(user => (
                                                      <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                                        <td className="px-4 py-2 flex items-center gap-2">
                                                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                            {user.displayName ? user.displayName.split(" ").map(n => n[0]).join("") : "U"}
                                                          </div>
                                                          <div>
                                                            <button className="font-semibold text-sky-400 hover:underline" onClick={async () => {
                                                              setProfileUserLoading(true);
                                                              setProfileUser(user);
                                                              setShowUserProfile(true);
                                                              // Fetch user's courses
                                                              try {
                                                                const coursesCol = collection(db, "courses");
                                                                const q = query(coursesCol, where("students", "array-contains", user.id));
                                                                const snap = await getDocs(q);
                                                                setProfileUserCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                                                              } catch (err) {
                                                                setProfileUserCourses([]);
                                                              }
                                                              setProfileUserLoading(false);
                                                            }}>{user.displayName || "Unknown"}</button>
                                                            <div className="text-xs text-gray-400">{user.email}</div>
                                                          </div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[(user.role || 'student').toLowerCase()] || "bg-gray-200 text-gray-700"}`}>
                                                            {(user.role || 'student')}
                                                          </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[(user.status || 'active').toLowerCase()] || "bg-gray-200 text-gray-700"}`}>
                                                            {(user.status || 'active')}
                                                          </span>
                                                        </td>
                                                        <td className="px-4 py-2">{user.joinDate || "-"}</td>
                                                        <td className="px-4 py-2">{user.progress || "-"}</td>
                                                        <td className="px-4 py-2 flex gap-2">
                                                          <button title="View" className="p-2 rounded hover:bg-sky-700 text-sky-400" aria-label="View"><Eye size={18} /></button>
                                                          <button title="Edit" className="p-2 rounded hover:bg-yellow-700 text-yellow-400" onClick={() => handleEdit(user)} aria-label="Edit"><Pencil size={18} /></button>
                                                          <button title="Delete" className="p-2 rounded hover:bg-red-700 text-red-400" onClick={() => handleDelete(user.id)} aria-label="Delete"><Trash2 size={18} /></button>
                                                        </td>
                                                      </tr>
                                                    ))
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                          {/* User Profile Modal rendered outside table */}
                                          {showUserProfile && profileUser && (
                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                              <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg">
                                                <h3 className="text-lg font-semibold text-white mb-4">User Profile</h3>
                                                {profileUserLoading ? (
                                                  <div className="text-slate-300">Loading...</div>
                                                ) : (
                                                  <div>
                                                    <div className="mb-4">
                                                      <div className="text-xl font-bold text-white">{profileUser.displayName}</div>
                                                      <div className="text-slate-400">{profileUser.email}</div>
                                                      <div className="text-slate-400 text-sm">Joined: {profileUser.joinDate || '-'}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                      <div className="font-semibold text-slate-300 mb-1">Courses Enrolled</div>
                                                      {profileUserCourses.length === 0 ? (
                                                        <div className="text-slate-500 text-sm">No courses found.</div>
                                                      ) : (
                                                        <ul className="list-disc pl-5 text-slate-200 text-sm">
                                                          {profileUserCourses.map(c => (
                                                            <li key={c.id}>{c.title || c.name || 'Untitled Course'} <span className="text-slate-400">(Fee Paid: ₹{c.feePaid || 0})</span></li>
                                                          ))}
                                                        </ul>
                                                      )}
                                                    </div>
                                                    <div className="mb-4">
                                                      <div className="font-semibold text-slate-300 mb-1">Progress</div>
                                                      <div className="text-slate-200">{profileUser.progress || '-'}</div>
                                                    </div>
                                                    {/* Admin Actions */}
                                                    <div className="flex flex-col gap-2 mt-6">
                                                      <div className="flex gap-2 flex-wrap">
                                                        {/* Deactivate/Activate */}
                                                        <button
                                                          onClick={async () => {
                                                            if (!profileUser) return;
                                                            const newStatus = profileUser.status === 'active' ? 'inactive' : 'active';
                                                            try {
                                                              await updateDoc(doc(db, 'users', profileUser.id), { status: newStatus });
                                                              setProfileUser({ ...profileUser, status: newStatus });
                                                              setRefresh(r => !r);
                                                            } catch (err) {
                                                              alert('Failed to update user status: ' + err.message);
                                                            }
                                                          }}
                                                          className={`px-3 py-2 rounded-md text-white ${profileUser.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                                        >
                                                          {profileUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                                                        </button>
                                                        {/* Promote/Demote Role */}
                                                        <button
                                                          onClick={async () => {
                                                            if (!profileUser) return;
                                                            const newRole = profileUser.role === 'student' ? 'instructor' : (profileUser.role === 'instructor' ? 'admin' : 'student');
                                                            try {
                                                              await updateDoc(doc(db, 'users', profileUser.id), { role: newRole });
                                                              setProfileUser({ ...profileUser, role: newRole });
                                                              setRefresh(r => !r);
                                                            } catch (err) {
                                                              alert('Failed to update user role: ' + err.message);
                                                            }
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                                                        >
                                                          Promote/Demote Role
                                                        </button>
                                                        {/* Remove from Course */}
                                                        <button
                                                          onClick={async () => {
                                                            if (!profileUser || profileUserCourses.length === 0) return;
                                                            // Remove from first course as example
                                                            const course = profileUserCourses[0];
                                                            try {
                                                              await updateDoc(doc(db, 'courses', course.id), {
                                                                students: (course.students || []).filter(id => id !== profileUser.id)
                                                              });
                                                              setProfileUserCourses(profileUserCourses.slice(1));
                                                              setRefresh(r => !r);
                                                            } catch (err) {
                                                              alert('Failed to remove from course: ' + err.message);
                                                            }
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-pink-600 hover:bg-pink-700"
                                                          disabled={profileUserCourses.length === 0}
                                                        >
                                                          Remove from Course
                                                        </button>
                                                        {/* Reset Progress */}
                                                        <button
                                                          onClick={async () => {
                                                            if (!profileUser) return;
                                                            try {
                                                              await updateDoc(doc(db, 'users', profileUser.id), { progress: 0 });
                                                              setProfileUser({ ...profileUser, progress: 0 });
                                                              setRefresh(r => !r);
                                                            } catch (err) {
                                                              alert('Failed to reset progress: ' + err.message);
                                                            }
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                        >
                                                          Reset Progress
                                                        </button>
                                                        {/* Download User Data */}
                                                        <button
                                                          onClick={async () => {
                                                            // Download user data as CSV
                                                            const { exportToCSV } = await import('@/services/reportingService.js');
                                                            const userData = [{ ...profileUser, courses: profileUserCourses.map(c => c.title).join('; ') }];
                                                            exportToCSV(userData, `${profileUser.displayName || profileUser.email}-data.csv`);
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-slate-500 hover:bg-slate-600"
                                                        >
                                                          Download User Data
                                                        </button>
                                                        {/* Impersonate User */}
                                                        <button
                                                          onClick={() => {
                                                            // Set impersonation in localStorage/session (simple demo)
                                                            localStorage.setItem('impersonateUserId', profileUser.id);
                                                            window.location.reload();
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-gray-700 hover:bg-gray-800"
                                                        >
                                                          Impersonate User
                                                        </button>
                                                        {/* Send Email */}
                                                        <button
                                                          onClick={async () => {
                                                            const { sendWelcomeEmail } = await import('@/services/emailService.js');
                                                            const result = await sendWelcomeEmail({ name: profileUser.displayName, email: profileUser.email }, { enrollmentId: 'ADMIN', courseType: 'admin', startDate: new Date(), accessUrl: window.location.origin });
                                                            alert(result.success ? 'Email sent!' : 'Failed: ' + result.error);
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                        >
                                                          Send Email
                                                        </button>
                                                        {/* View Payment History */}
                                                        <button
                                                          onClick={async () => {
                                                            // Query payments for this user (example: from Firestore 'payments' collection)
                                                            const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
                                                            const db = getFirestore();
                                                            const q = query(collection(db, 'payments'), where('userId', '==', profileUser.id));
                                                            const snap = await getDocs(q);
                                                            if (snap.empty) return alert('No payment history found.');
                                                            const payments = snap.docs.map(d => d.data());
                                                            alert(payments.map(p => `₹${p.amount} on ${p.date || p.createdAt}`).join('\n'));
                                                          }}
                                                          className="px-3 py-2 rounded-md text-white bg-green-700 hover:bg-green-800"
                                                        >
                                                          View Payment History
                                                        </button>
                                                        {/* View Activity Log */}
                                                        <button
                                                          onClick={async () => {
                                                            // Get forum and analytics activity

