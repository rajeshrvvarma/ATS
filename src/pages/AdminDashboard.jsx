import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import app from "@/config/firebase";

const db = getFirestore(app);
const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
};
const roleColors = {
  student: "bg-blue-100 text-blue-700",
  instructor: "bg-purple-100 text-purple-700",
  admin: "bg-yellow-100 text-yellow-700",
};


function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  // Shared user state for all tabs
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // User Management state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [refresh, setRefresh] = useState(false);

  // Fetch users from Firestore (for all tabs)
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (err) {
        setError("Failed to fetch users: " + err.message);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [refresh]);

  // Delete user from Firestore
  async function handleDelete(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setRefresh(r => !r);
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  }

  // Edit user (for now, just toggles status as a demo)
  async function handleEdit(user) {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "users", user.id), { status: newStatus });
      setRefresh(r => !r);
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  }

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || u.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Tab navigation
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "user", label: "User Management" },
    { key: "course", label: "Course Management" },
    { key: "analytics", label: "Analytics" },
    { key: "system", label: "System" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
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
          </>
        )}

        {tab === "user" && (
          <>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                className="border rounded px-3 py-2"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2"
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
                <table className="min-w-full bg-gray-800 rounded-lg">
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
                              <div className="font-semibold">{user.displayName || "Unknown"}</div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[user.role] || "bg-gray-200 text-gray-700"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[user.status] || "bg-gray-200 text-gray-700"}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{user.joinDate || "-"}</td>
                          <td className="px-4 py-2">{user.progress || "-"}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button title="View" className="hover:text-blue-400"><Eye size={18} /></button>
                            <button title="Edit" className="hover:text-yellow-400" onClick={() => handleEdit(user)}><Pencil size={18} /></button>
                            <button title="Delete" className="hover:text-red-400" onClick={() => handleDelete(user.id)}><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "course" && (
          <div className="py-12 text-center text-slate-400 text-lg">Course management section coming soon.</div>
        )}
        {tab === "analytics" && (
          <div className="py-12 text-center text-slate-400 text-lg">Analytics section coming soon.</div>
        )}
        {tab === "system" && (
          <div className="py-12 text-center text-slate-400 text-lg">System settings section coming soon.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default AdminDashboard;
