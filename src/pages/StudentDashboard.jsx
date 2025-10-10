import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { 
  User, 
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
  GraduationCap,
  X,
  Brain,
  Trophy,
  Sparkles,
  MessageSquare,
  Users
} from 'lucide-react';
import { loadCourses } from '@/services/courseService.js';
import { downloadCertificate } from '@/services/certificateService.js';
import { getStudentEnrollments, getStudentData } from '@/services/studentManagementService.js';
import StudentProfile from '@/components/StudentProfile.jsx';
import ProgressTracker from '@/components/ProgressTracker.jsx';
import Leaderboard from '@/components/Leaderboard.jsx';
import StudentAnalytics from '@/components/StudentAnalytics.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import CourseRecommendations from '@/components/CourseRecommendations.jsx';
import DiscussionForum from '@/components/DiscussionForum.jsx';
import CreateThreadModal from '@/components/CreateThreadModal.jsx';
import ThreadDetailModal from '@/components/ThreadDetailModal.jsx';

/**
 * StudentDashboard - Main dashboard for students
 * Shows progress, certificates, stats, and course management
 */
export default function StudentDashboard({ onNavigate }) {
  const { user } = useAuth(); // Get authenticated user
  const [studentData, setStudentData] = useState({
    name: 'Student Name',
    email: 'student@example.com',
    joinDate: '2024-01-15',
    totalHours: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [firebaseEnrollments, setFirebaseEnrollments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [lastCourseId, setLastCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEnrollment, setNewEnrollment] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCareerAdvisor, setShowCareerAdvisor] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showForum, setShowForum] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [showThreadDetail, setShowThreadDetail] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [preselectedThreadType, setPreselectedThreadType] = useState(null);
  
  // Determine user type: authenticated student vs enrollment-based access
  const isAuthenticated = !!user;
  const isEnrollmentAccess = !user && (
    new URLSearchParams(window.location.search).get('enrollmentId') || 
    localStorage.getItem('enrollment_receipts')
  );

  // Load student data from localStorage and Firebase
  useEffect(() => {
    const loadStudentDashboard = async () => {
      try {
        setLoading(true);

        // Determine user data source and email
        let userEmail = 'student@example.com';
        
        if (user) {
          // Authenticated user - use user data
          setStudentData({
            name: user.name,
            email: user.email,
            joinDate: user.joinDate || '2024-01-15',
            totalHours: 0,
            coursesCompleted: 0,
            certificatesEarned: 0,
            currentStreak: 0,
            longestStreak: 0
          });
          userEmail = user.email;
        } else {
          // Enrollment-based access - try to get data from localStorage or URL
          const savedData = localStorage.getItem('studentData');
          const urlParams = new URLSearchParams(window.location.search);
          const enrollmentId = urlParams.get('enrollmentId');
          
          if (savedData) {
            setStudentData(JSON.parse(savedData));
            userEmail = JSON.parse(savedData).email;
          } else if (enrollmentId) {
            // Try to get email from recent enrollment receipts
            const receipts = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
            const recentReceipt = receipts.find(r => r.enrollmentId === enrollmentId);
            if (recentReceipt && recentReceipt.studentEmail) {
              userEmail = recentReceipt.studentEmail;
              setStudentData({
                name: recentReceipt.studentName || 'Student',
                email: recentReceipt.studentEmail,
                joinDate: new Date().toISOString(),
                totalHours: 0,
                coursesCompleted: 0,
                certificatesEarned: 0,
                currentStreak: 0,
                longestStreak: 0
              });
            }
          }
        }
        
        console.log('Loading enrollments for:', userEmail);
        
        const firebaseEnrollmentsData = await getStudentEnrollments(userEmail);
        console.log('Firebase enrollments loaded:', firebaseEnrollmentsData);
        setFirebaseEnrollments(firebaseEnrollmentsData);

        // Check for new enrollment from URL params (reuse enrollmentId from above)
        if (enrollmentId) {
          const newEnrollment = firebaseEnrollmentsData.find(e => e.enrollmentId === newEnrollmentId);
          if (newEnrollment) {
            setNewEnrollment(newEnrollment);
            // Clear URL params after showing welcome
            window.history.replaceState({}, '', window.location.pathname);
          }
        }

        // Load legacy enrolled courses from localStorage
        const enrolled = [];
        const courses = loadCourses();
        courses.forEach(course => {
          const enrollment = localStorage.getItem(`enrollment_${course.id}`);
          if (enrollment === 'true') {
            const progress = localStorage.getItem(`course_progress_${course.id}`);
            const progressData = progress ? JSON.parse(progress) : { courseProgress: 0, completedLessons: [], lastUpdated: 0 };
            
            enrolled.push({
              ...course,
              progress: progressData.courseProgress,
              completedLessons: progressData.completedLessons || [],
              isCompleted: progressData.courseProgress >= 100,
              lastUpdated: progressData.lastUpdated || 0,
              source: 'localStorage'
            });
          }
        });
        setEnrolledCourses(enrolled);

        // Determine last course by most recent progress update
        if (enrolled.length > 0) {
          const sorted = [...enrolled].sort((a,b) => (b.lastUpdated||0) - (a.lastUpdated||0));
          setLastCourseId(sorted[0]?.id || null);
        }

        // Load certificates
        const savedCertificates = localStorage.getItem('certificates');
        if (savedCertificates) {
          setCertificates(JSON.parse(savedCertificates));
        }

        // Load recent activity
        const savedActivity = localStorage.getItem('recentActivity');
        if (savedActivity) {
          setRecentActivity(JSON.parse(savedActivity));
        }

        // Load payment receipts
        const savedReceipts = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
        setReceipts(savedReceipts.sort((a,b)=> b.ts - a.ts));

      } catch (error) {
        console.error('Error loading student dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, []);

  // Calculate combined statistics from both localStorage and Firebase enrollments
  const allCourses = [...enrolledCourses, ...firebaseEnrollments];
  const stats = {
    totalCourses: allCourses.length,
    completedCourses: enrolledCourses.filter(course => course.isCompleted).length,
    inProgressCourses: enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length,
    firebaseEnrollments: firebaseEnrollments.length,
    totalHours: enrolledCourses.reduce((total, course) => {
      const duration = course.lessons?.reduce((sum, lesson) => {
        const [minutes, seconds] = (lesson.duration || '0:00').split(':').map(Number);
        return sum + (minutes * 60) + seconds;
      }, 0) || 0;
      return total + (duration / 3600) * ((course.progress || 0) / 100);
    }, 0),
    certificates: certificates.length
  };

  const formatTime = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours)}h`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'text-green-400';
    if (progress >= 70) return 'text-yellow-400';
    if (progress >= 30) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 30) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-6">
        {/* New Enrollment Welcome */}
        {newEnrollment && (
          <div className="mb-8 bg-gradient-to-r from-green-600 to-sky-600 rounded-xl p-6">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 rounded-full p-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">🎉 Enrollment Successful!</h2>
                <p className="opacity-90">
                  Welcome to {newEnrollment.courseType === 'bootcamp' ? '7-Day Cybersecurity Bootcamp' : '2-Month Premium Program'}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Enrollment ID: {newEnrollment.enrollmentId} • Started on {new Date(newEnrollment.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => onNavigate('video-learning')}
                  className="bg-white text-sky-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isAuthenticated ? (
                  <>Welcome back, {studentData.name}! 👋</>
                ) : (
                  <>Welcome, {studentData.name}! 🎓</>
                )}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-slate-400">
                  {isAuthenticated ? (
                    'Continue your cybersecurity learning journey'
                  ) : (
                    'Access your enrolled courses and track progress'
                  )}
                </p>
                {!isAuthenticated && (
                  <div className="bg-sky-500/20 px-3 py-1 rounded-full">
                    <span className="text-sky-400 text-sm font-medium">Enrollment Access</span>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="bg-green-500/20 px-3 py-1 rounded-full">
                    <span className="text-green-400 text-sm font-medium">Authenticated Student</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastCourseId && (
                <button
                  onClick={() => onNavigate('video-learning') || (window.location.href = `/video-learning?course=${lastCourseId}`)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Continue last course
                </button>
              )}
              <button
                onClick={() => onNavigate('video-learning')}
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </button>
              
              {/* Enhanced action buttons */}
              <button
                onClick={() => setShowLeaderboard(true)}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
              
              <button
                onClick={() => setShowAnalytics(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <BarChart3 className="w-5 h-5" />
                My Analytics
              </button>
              
              <button
                onClick={() => setShowProgress(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Progress
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={() => setShowProfile(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
              )}
              
              <button className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Student Profile Section - Only for authenticated users */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {studentData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{studentData.name}</h2>
                  <p className="text-slate-300">{studentData.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(studentData.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(stats.totalHours)} learned</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-400">{stats.completedCourses}</div>
                    <div className="text-slate-400 text-sm">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions for Enrollment Access */}
        {isEnrollmentAccess && (
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-sky-400 mb-2">Get Full Access</h3>
                <p className="text-slate-400 mb-4">
                  Create an account to unlock additional features, track progress across devices, and manage your profile.
                </p>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Create Account / Login
                </button>
              </div>
              <div className="text-slate-400">
                <User className="w-16 h-16" />
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalCourses}</span>
            </div>
            <h3 className="text-slate-400 text-sm">Total Enrollments</h3>
            <p className="text-xs text-slate-500 mt-1">
              {stats.firebaseEnrollments} active, {stats.completedCourses} completed
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{formatTime(stats.totalHours)}</span>
            </div>
            <h3 className="text-slate-400 text-sm">Learning Hours</h3>
            <p className="text-xs text-slate-500 mt-1">Total time invested</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.certificates}</span>
            </div>
            <h3 className="text-slate-400 text-sm">Certificates</h3>
            <p className="text-xs text-slate-500 mt-1">Achievements unlocked</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{studentData.currentStreak}</span>
            </div>
            <h3 className="text-slate-400 text-sm">Current Streak</h3>
            <p className="text-xs text-slate-500 mt-1">Days of continuous learning</p>
          </div>

          <div className="bg-gradient-to-br from-sky-500/20 to-blue-600/20 rounded-lg p-6 group hover:from-sky-500/30 hover:to-blue-600/30 transition-all cursor-pointer border border-sky-500/30"
               onClick={() => setShowCareerAdvisor(true)}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-500/20 rounded-lg group-hover:bg-sky-500/30 transition-colors">
                <Sparkles className="w-6 h-6 text-sky-400" />
              </div>
              <span className="text-lg font-bold text-sky-300">AI</span>
            </div>
            <h3 className="text-white text-sm font-semibold group-hover:text-sky-100">Career Guidance</h3>
            <p className="text-xs text-sky-200/80 mt-1 group-hover:text-sky-100/90">Get personalized advice</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-lg p-6 group hover:from-purple-500/30 hover:to-indigo-600/30 transition-all cursor-pointer border border-purple-500/30"
               onClick={() => onNavigate('quiz-library')}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg font-bold text-purple-300">NEW</span>
            </div>
            <h3 className="text-white text-sm font-semibold group-hover:text-purple-100">Quiz Analytics</h3>
            <p className="text-xs text-purple-200/80 mt-1 group-hover:text-purple-100/90">Track your progress</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-lg p-6 group hover:from-green-500/30 hover:to-teal-600/30 transition-all cursor-pointer border border-green-500/30"
               onClick={() => setShowRecommendations(true)}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-lg font-bold text-green-300">✨</span>
            </div>
            <h3 className="text-white text-sm font-semibold group-hover:text-green-100">Smart Recommendations</h3>
            <p className="text-xs text-green-200/80 mt-1 group-hover:text-green-100/90">AI-powered course suggestions</p>
          </div>
        </div>

        {/* Social Learning Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-blue-400" />
                Social Learning Features
              </h2>
              <p className="text-slate-400 mt-1">Connect, discuss, and learn with your cybersecurity community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Discussion Forum */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg p-6 group hover:from-blue-500/30 hover:to-cyan-600/30 transition-all cursor-pointer border border-blue-500/30"
                 onClick={() => setShowForum(true)}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-lg font-bold text-blue-300">NEW</span>
              </div>
              <h3 className="text-white text-sm font-semibold group-hover:text-blue-100">Discussion Forum</h3>
              <p className="text-xs text-blue-200/80 mt-1 group-hover:text-blue-100/90">Join conversations & get help</p>
            </div>

            {/* Study Groups */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg p-6 group hover:from-purple-500/30 hover:to-pink-600/30 transition-all cursor-pointer border border-purple-500/30"
                 onClick={() => {
                   setPreselectedThreadType('study-group');
                   setShowCreateThread(true);
                 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-lg font-bold text-purple-300">🎓</span>
              </div>
              <h3 className="text-white text-sm font-semibold group-hover:text-purple-100">Study Groups</h3>
              <p className="text-xs text-purple-200/80 mt-1 group-hover:text-purple-100/90">Form learning groups</p>
            </div>

            {/* Peer Mentoring */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-lg p-6 group hover:from-orange-500/30 hover:to-red-600/30 transition-all cursor-pointer border border-orange-500/30"
                 onClick={() => {
                   setPreselectedThreadType('peer-help');
                   setShowCreateThread(true);
                 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-lg font-bold text-orange-300">🤝</span>
              </div>
              <h3 className="text-white text-sm font-semibold group-hover:text-orange-100">Peer Mentoring</h3>
              <p className="text-xs text-orange-200/80 mt-1 group-hover:text-orange-100/90">Get & offer guidance</p>
            </div>

            {/* Knowledge Sharing */}
            <div className="bg-gradient-to-br from-teal-500/20 to-emerald-600/20 rounded-lg p-6 group hover:from-teal-500/30 hover:to-emerald-600/30 transition-all cursor-pointer border border-teal-500/30"
                 onClick={() => {
                   setPreselectedThreadType('resource-share');
                   setShowCreateThread(true);
                 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-teal-500/20 rounded-lg group-hover:bg-teal-500/30 transition-colors">
                  <BookOpen className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-lg font-bold text-teal-300">📚</span>
              </div>
              <h3 className="text-white text-sm font-semibold group-hover:text-teal-100">Knowledge Share</h3>
              <p className="text-xs text-teal-200/80 mt-1 group-hover:text-teal-100/90">Share resources</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Courses</h2>
                <button
                  onClick={() => onNavigate('video-learning')}
                  className="text-sky-400 hover:text-sky-300 text-sm"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {/* Firebase Enrollments */}
                {firebaseEnrollments.map((enrollment) => (
                  <div key={enrollment.enrollmentId} className="bg-gradient-to-r from-sky-700/30 to-sky-600/30 border border-sky-500/50 rounded-lg p-4 hover:from-sky-700/40 hover:to-sky-600/40 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-sky-500/20 p-2 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {enrollment.courseType === 'bootcamp' ? '7-Day Cybersecurity Bootcamp' : '2-Month Premium Program'}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Enrolled on {new Date(enrollment.enrollmentDate).toLocaleDateString('en-IN')} • ID: {enrollment.enrollmentId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          Active
                        </span>
                        <button
                          onClick={() => onNavigate('video-learning')}
                          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Access Course
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Start Date: {new Date(enrollment.startDate).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Payment: ₹{enrollment.paymentAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show message if no courses at all */}
                {enrolledCourses.length === 0 && firebaseEnrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-slate-400 mb-2">No courses enrolled yet</h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <button
                      onClick={() => onNavigate('video-learning')}
                      className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-600 p-2 rounded-lg">
                            <BookOpen className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{course.title}</h4>
                            <p className="text-slate-400 text-sm">{course.lessons.length} lessons • {course.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getProgressColor(course.progress)}`}>
                            {course.progress}%
                          </span>
                          <button
                            onClick={() => onNavigate('video-learning') || (window.location.href = `/video-learning?course=${course.id}`)}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                          >
                            {course.progress > 0 ? 'Continue' : 'Start'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-slate-400 text-sm">No recent activity</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.title}</p>
                        <p className="text-slate-400 text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Career Guidance */}
            <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-sky-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Career Advisor</h3>
                  <p className="text-sky-200/80 text-sm">Get personalized guidance</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Career path recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Skill gap analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>12-month roadmap</span>
                </div>
              </div>

              <button
                onClick={() => setShowCareerAdvisor(true)}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Get Career Guidance
              </button>
            </div>

            {/* Smart Course Recommendations */}
            <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Smart Recommendations</h3>
                  <p className="text-green-200/80 text-sm">AI-powered course suggestions</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>6 advanced algorithms</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Performance-based matching</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Peer collaborative filtering</span>
                </div>
              </div>

              <button
                onClick={() => setShowRecommendations(true)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" />
                Get Recommendations
              </button>
            </div>

            {/* Certificates */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Certificates</h3>
              <div className="space-y-3">
                {certificates.length === 0 ? (
                  <p className="text-slate-400 text-sm">No certificates earned yet</p>
                ) : (
                  certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{cert.courseName}</p>
                          <p className="text-slate-400 text-xs">{cert.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadCertificate(cert.id)}
                        className="p-2 text-sky-400 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>
              <div className="space-y-3">
                {receipts.length === 0 ? (
                  <p className="text-slate-400 text-sm">No payment history</p>
                ) : (
                  receipts.slice(0, 3).map((receipt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">₹{receipt.amount.toLocaleString('en-IN')}</p>
                        <p className="text-slate-400 text-xs">{new Date(receipt.ts).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Paid
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Student Profile Modal */}
      {showProfile && (
        <StudentProfile
          onNavigate={onNavigate}
          onClose={() => setShowProfile(false)}
        />
      )}
      
      {/* Progress Tracker Modal */}
      {showProgress && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Progress Tracker</h2>
                <p className="text-green-100">Track your learning journey and achievements</p>
              </div>
              <button
                onClick={() => setShowProgress(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ProgressTracker
                studentData={studentData}
                enrollments={enrolledCourses}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {/* Student Analytics Modal */}
      {showAnalytics && (
        <StudentAnalytics onClose={() => setShowAnalytics(false)} />
      )}

      {/* AI Career Advisor Modal */}
      {showCareerAdvisor && (
        <AiCareerAdvisor 
          isOpen={showCareerAdvisor}
          onClose={() => setShowCareerAdvisor(false)} 
        />
      )}

      {/* Course Recommendations Modal */}
      {showRecommendations && (
        <CourseRecommendations 
          onClose={() => setShowRecommendations(false)}
          onCourseSelect={(course) => {
            setShowRecommendations(false);
            onNavigate('video-learning', course.id);
          }}
        />
      )}

      {/* Discussion Forum Modal */}
      {showForum && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Discussion Forum
                </h2>
                <p className="text-blue-100">Connect with your cybersecurity learning community</p>
              </div>
              <button
                onClick={() => setShowForum(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <DiscussionForum 
                onCreateThread={(type = null) => {
                  setPreselectedThreadType(type);
                  setShowCreateThread(true);
                }}
                onViewThread={(threadId) => {
                  setSelectedThreadId(threadId);
                  setShowThreadDetail(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
      {showCreateThread && (
        <CreateThreadModal
          isOpen={showCreateThread}
          preselectedType={preselectedThreadType}
          onClose={() => {
            setShowCreateThread(false);
            setPreselectedThreadType(null);
          }}
          onThreadCreated={(threadData) => {
            setShowCreateThread(false);
            setPreselectedThreadType(null);
            // Optionally refresh forum data or show success message
          }}
        />
      )}

      {/* Thread Detail Modal */}
      {showThreadDetail && selectedThreadId && (
        <ThreadDetailModal
          isOpen={showThreadDetail}
          threadId={selectedThreadId}
          onClose={() => {
            setShowThreadDetail(false);
            setSelectedThreadId(null);
          }}
        />
      )}
    </div>
  );
}