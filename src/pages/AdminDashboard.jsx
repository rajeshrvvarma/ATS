import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAdmin from '@/components/admin/RequireAdmin.jsx';
import { useAuth } from "@/context/AuthContext.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

export default function AdminDashboard() {
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
          <div className="flex gap-6 border-b border-slate-700 mb-6">
            <button onClick={() => setTab('overview')} className={tab === 'overview' ? 'text-white border-b-2 border-sky-500 px-3 py-2' : 'px-3 py-2 text-slate-400'}>Overview</button>
            <button onClick={() => setTab('users')} className={tab === 'users' ? 'text-white border-b-2 border-sky-500 px-3 py-2' : 'px-3 py-2 text-slate-400'}>Users</button>
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
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No users found.</td></tr>
                      ) : filtered.map(u => (
                        <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-2">{u.displayName || 'Unknown'}</td>
                          <td className="px-4 py-2">{u.email}</td>
                          <td className="px-4 py-2">{u.status || 'active'}</td>
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

