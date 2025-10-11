import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Settings, 
  BarChart3,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Database,
  Activity,
  AlertCircle,
  Plus,
  FileText,
  Star,
  MessageSquare
} from 'lucide-react';
import { getStudentProfile } from '@/services/firebaseAuthService';

/**
 * AdminDashboard - Comprehensive admin panel for LMS management
 */
export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual Firebase data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 1248,
      totalCourses: 24,
      activeLearners: 892,
      certificatesIssued: 346,
      revenue: 45670,
      avgCompletion: 73
    },
    recentActivity: [
      { id: 1, type: 'user_register', title: 'New user registered: john@email.com', time: '2 hours ago', icon: UserPlus, color: 'text-green-400' },
      { id: 2, type: 'course_complete', title: 'Course completed: React Fundamentals', time: '3 hours ago', icon: CheckCircle, color: 'text-blue-400' },
      { id: 3, type: 'certificate_issued', title: 'Certificate issued to sarah@email.com', time: '5 hours ago', icon: Award, color: 'text-yellow-400' },
      { id: 4, type: 'course_created', title: 'New course: Advanced Node.js', time: '1 day ago', icon: BookOpen, color: 'text-purple-400' }
    ],
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@email.com',
        role: 'student',
        status: 'active',
        joinDate: '2024-09-15',
        coursesEnrolled: 3,
        progress: 65
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        role: 'instructor',
        status: 'active',
        joinDate: '2024-08-20',
        coursesCreated: 5,
        studentsCount: 120
      },
      {
        id: 3,
        name: 'Mike Chen',
        email: 'mike@email.com',
        role: 'student',
        status: 'inactive',
        joinDate: '2024-07-10',
        coursesEnrolled: 1,
        progress: 25
      }
    ],
    courses: [
      {
        id: 1,
        title: 'React Development Bootcamp',
        instructor: 'Sarah Johnson',
        students: 45,
        completion: 78,
        status: 'active',
        created: '2024-08-15',
        revenue: 4500
      },
      {
        id: 2,
        title: 'Advanced JavaScript',
        instructor: 'Mike Wilson',
        students: 32,
        completion: 85,
        status: 'active',
        created: '2024-07-20',
        revenue: 3200
      },
      {
        id: 3,
        title: 'Web Design Fundamentals',
        instructor: 'Emma Davis',
        students: 28,
        completion: 92,
        status: 'draft',
        created: '2024-09-01',
        revenue: 0
      }
    ],
    systemHealth: {
      serverStatus: 'online',
      dbStatus: 'healthy',
      apiLatency: '120ms',
      uptime: '99.9%',
      activeConnections: 234
    }
  });

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    // Load real data from Firebase here
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Learners</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.activeLearners.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.certificatesIssued}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">${dashboardData.stats.revenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Completion</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.avgCompletion}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <IconComponent className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Server Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Latency</span>
              <span className="text-slate-400 text-sm">{dashboardData.systemHealth.apiLatency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Uptime</span>
              <span className="text-slate-400 text-sm">{dashboardData.systemHealth.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active Connections</span>
              <span className="text-slate-400 text-sm">{dashboardData.systemHealth.activeConnections}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {dashboardData.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {user.progress ? `${user.progress}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-sky-400 hover:text-sky-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Course Management</h2>
        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboardData.courses.map((course) => (
          <div key={course.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                course.status === 'active' ? 'bg-green-500/20 text-green-400' :
                course.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Instructor</span>
                <span className="text-white">{course.instructor}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Students</span>
                <span className="text-white">{course.students}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Completion Rate</span>
                <span className="text-white">{course.completion}%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Revenue</span>
                <span className="text-white">${course.revenue.toLocaleString()}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-700 flex items-center space-x-2">
                <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      
      {/* Analytics placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-16 h-16" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Course Completion Rates</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <TrendingUp className="w-16 h-16" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">User Registration</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Email Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Maintenance Mode</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Backup & Export */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export User Data</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Database className="w-4 h-4" />
              <span>Backup Database</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              <AlertCircle className="w-4 h-4" />
              <span>Reset System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
          <p className="text-slate-400 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" user={user} onNavigate={onNavigate}>
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'courses' && renderCourses()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'system' && renderSystem()}
    </DashboardLayout>
  );
}