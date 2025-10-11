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
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

/**
 * StudentDashboard - Comprehensive student learning dashboard
 */
export default function StudentDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real data states
  const [studentStats, setStudentStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    studyHours: 0,
    currentStreak: 0,
    totalPoints: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Load student's enrolled courses
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', user.uid)
      );
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Load courses details for enrolled courses
      const courseIds = enrollments.map(e => e.courseId);
      const courses = [];
      
      if (courseIds.length > 0) {
        // In a real app, you'd batch fetch courses
        for (const courseId of courseIds) {
          const courseQuery = query(collection(db, 'courses'), where('id', '==', courseId));
          const courseSnapshot = await getDocs(courseQuery);
          courseSnapshot.docs.forEach(doc => {
            const courseData = { id: doc.id, ...doc.data() };
            const enrollment = enrollments.find(e => e.courseId === courseId);
            courses.push({
              ...courseData,
              progress: enrollment?.progress || 0,
              completedLessons: enrollment?.completedLessons || 0,
              lastAccessed: enrollment?.lastAccessed
            });
          });
        }
      }
      
      setEnrolledCourses(courses);
      
      // Load student certificates
      const certificatesQuery = query(
        collection(db, 'certificates'),
        where('studentId', '==', user.uid)
      );
      const certificatesSnapshot = await getDocs(certificatesQuery);
      const userCertificates = certificatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertificates(userCertificates);
      
      // Load recent activity
      const activityQuery = query(
        collection(db, 'studentActivity'),
        where('studentId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const activities = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentActivity(activities);
      
      // Calculate stats
      const stats = {
        coursesEnrolled: courses.length,
        coursesCompleted: courses.filter(c => c.progress >= 100).length,
        certificatesEarned: userCertificates.length,
        studyHours: enrollments.reduce((total, e) => total + (e.studyHours || 0), 0),
        currentStreak: 0, // Calculate based on activity
        totalPoints: enrollments.reduce((total, e) => total + (e.points || 0), 0)
      };
      setStudentStats(stats);
      
    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Failed to load dashboard data');
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
              <p className="text-2xl font-bold text-white">{studentStats.coursesEnrolled}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Study Hours</p>
              <p className="text-2xl font-bold text-white">{studentStats.studyHours}h</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-white">{studentStats.certificatesEarned}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{studentStats.currentStreak} days</p>
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
            {recentActivity.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map((activity) => {
                const getActivityIcon = (type) => {
                  switch (type) {
                    case 'course_complete': return CheckCircle;
                    case 'lesson_watch': return Play;
                    case 'certificate': return Award;
                    case 'quiz_complete': return Target;
                    default: return BookOpen;
                  }
                };
                const getActivityColor = (type) => {
                  switch (type) {
                    case 'course_complete': return 'text-green-400';
                    case 'lesson_watch': return 'text-blue-400';
                    case 'certificate': return 'text-yellow-400';
                    case 'quiz_complete': return 'text-purple-400';
                    default: return 'text-gray-400';
                  }
                };
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <IconComponent className={`w-5 h-5 ${getActivityColor(activity.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                      <p className="text-xs text-slate-400">{activity.time || 'Recently'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No upcoming deadlines</p>
            ) : (
              upcomingDeadlines.map((deadline) => (
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
              ))
            )}
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
        {enrolledCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No courses enrolled yet</p>
            <button className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
              Browse Available Courses
            </button>
          </div>
        ) : (
          enrolledCourses.map((course) => (
            <div key={course.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {course.difficulty || 'Intermediate'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{course.progress || 0}%</span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{course.completedLessons || 0}/{course.totalLessons || 0} lessons</span>
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Next: {course.nextLesson || 'Start Course'}</p>
                  <button className="w-full flex items-center justify-center space-x-2 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Continue Learning</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Certificates</h2>
        <div className="flex items-center space-x-2 text-slate-400">
          <Trophy className="w-5 h-5" />
          <span>{certificates.length} earned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No certificates earned yet</p>
            <p className="text-slate-500 text-sm mt-2">Complete courses to earn certificates</p>
          </div>
        ) : (
          certificates.map((cert) => (
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
          ))
        )}
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
      
      {/* Profile editing is now handled via the Profile page, accessible from the user menu. */}

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