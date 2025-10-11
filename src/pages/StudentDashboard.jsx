import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Calendar,
  Download,
  Settings,
  BarChart3,
  Target,
  Star,
  CheckCircle,
  Play,
  ExternalLink,
  ChevronRight,
  Trophy,
  Sparkles,
  Users,
  FileText,
  Video,
  Book
} from 'lucide-react';
import { getStudentProfile } from '@/services/firebaseAuthService';

/**
 * StudentDashboard - Comprehensive student learning dashboard
 */
export default function StudentDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual Firebase data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      coursesEnrolled: 3,
      coursesCompleted: 1,
      certificatesEarned: 1,
      studyHours: 24,
      currentStreak: 7,
      totalPoints: 2450
    },
    recentActivity: [
      { id: 1, type: 'course_complete', title: 'Completed React Fundamentals', time: '2 hours ago', icon: CheckCircle, color: 'text-green-400' },
      { id: 2, type: 'lesson_watch', title: 'Watched: Advanced State Management', time: '1 day ago', icon: Play, color: 'text-blue-400' },
      { id: 3, type: 'certificate', title: 'Earned JavaScript Certificate', time: '3 days ago', icon: Award, color: 'text-yellow-400' },
      { id: 4, type: 'quiz_complete', title: 'Completed: CSS Grid Quiz', time: '5 days ago', icon: Target, color: 'text-purple-400' }
    ],
    enrolledCourses: [
      {
        id: 1,
        title: 'React Development Bootcamp',
        progress: 75,
        totalLessons: 20,
        completedLessons: 15,
        nextLesson: 'Context API Deep Dive',
        instructor: 'Sarah Johnson',
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        id: 2,
        title: 'Advanced JavaScript Concepts',
        progress: 45,
        totalLessons: 15,
        completedLessons: 7,
        nextLesson: 'Async/Await Patterns',
        instructor: 'Mike Chen',
        duration: '6 weeks',
        difficulty: 'Advanced'
      },
      {
        id: 3,
        title: 'Web Design Fundamentals',
        progress: 90,
        totalLessons: 12,
        completedLessons: 11,
        nextLesson: 'Portfolio Project',
        instructor: 'Emma Davis',
        duration: '4 weeks',
        difficulty: 'Beginner'
      }
    ],
    certificates: [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        issueDate: '2024-10-01',
        grade: 'A+',
        credentialId: 'JS-FUND-2024-001'
      }
    ],
    upcomingDeadlines: [
      { id: 1, title: 'React Project Submission', date: '2024-10-15', course: 'React Bootcamp' },
      { id: 2, title: 'JavaScript Quiz', date: '2024-10-18', course: 'Advanced JS' }
    ]
  });

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    if (user) {
      try {
        const profile = await getStudentProfile(user.uid);
        setStudentData(profile);
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Courses Enrolled</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.coursesEnrolled}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Study Hours</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.studyHours}h</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.certificatesEarned}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{dashboardData.stats.currentStreak} days</p>
            </div>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
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

        {/* Upcoming Deadlines */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {dashboardData.upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{deadline.title}</p>
                  <p className="text-xs text-slate-400">{deadline.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-400 font-medium">{deadline.date}</p>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Courses</h2>
        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
          Browse Courses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboardData.enrolledCourses.map((course) => (
          <div key={course.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.difficulty}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white font-medium">{course.progress}%</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                <span>{course.duration}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Next: {course.nextLesson}</p>
                <button className="w-full flex items-center justify-center space-x-2 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Continue Learning</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Certificates</h2>
        <div className="flex items-center space-x-2 text-slate-400">
          <Trophy className="w-5 h-5" />
          <span>{dashboardData.certificates.length} earned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.certificates.map((cert) => (
          <div key={cert.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                <p className="text-sm text-slate-400">Grade: {cert.grade}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-400">
              <p>Issued: {cert.issueDate}</p>
              <p>ID: {cert.credentialId}</p>
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Download Certificate</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Learning Progress</h2>
      
      {/* Progress Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Overall Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                  strokeDasharray="60, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">60%</span>
              </div>
            </div>
            <p className="text-slate-400 mt-2">Course Completion</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="85, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">85%</span>
              </div>
            </div>
            <p className="text-slate-400 mt-2">Assignment Score</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="70, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">70%</span>
              </div>
            </div>
            <p className="text-slate-400 mt-2">Skill Level</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || user?.displayName || ''}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <input
                type="text"
                value={user?.role || 'Student'}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Learning Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Email Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Dark Mode</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Progress Reminders</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
            </div>
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
          <p className="text-slate-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard" user={user} onNavigate={onNavigate}>
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
      {activeTab === 'courses' && renderCourses()}
      {activeTab === 'certificates' && renderCertificates()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'settings' && renderSettings()}
    </DashboardLayout>
  );
}