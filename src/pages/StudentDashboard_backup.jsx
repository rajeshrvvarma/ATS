import React, { useState, useEffect } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { loadCourses } from '@/services/courseService.js';
import { downloadCertificate } from '@/services/certificateService.js';
import { getStudentEnrollments, getStudentData } from '@/services/studentManagementService.js';

/**
 * StudentDashboard - Main dashboard for students
 * Shows progress, certificates, stats, and course management
 */
export default function StudentDashboard({ onNavigate }) {
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

  // Load student data from localStorage and Firebase
  useEffect(() => {
    const loadStudentDashboard = async () => {
      try {
        setLoading(true);

        // Load local student data
        const savedData = localStorage.getItem('studentData');
        if (savedData) {
          setStudentData(JSON.parse(savedData));
        }

        // Load Firebase enrollments for current user
        const userEmail = savedData ? JSON.parse(savedData).email : 'student@example.com';
        console.log('Loading enrollments for:', userEmail);
        
        const firebaseEnrollmentsData = await getStudentEnrollments(userEmail);
        console.log('Firebase enrollments loaded:', firebaseEnrollmentsData);
        setFirebaseEnrollments(firebaseEnrollmentsData);

        // Check for new enrollment from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const newEnrollmentId = urlParams.get('enrollmentId');
        if (newEnrollmentId) {
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
                Welcome back, {studentData.name}! 👋
              </h1>
              <p className="text-slate-400">
                Continue your cybersecurity learning journey
              </p></div>arget,
  Star,
  CheckCircle,
  Play,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { loadCourses } from '@/services/courseService.js';
import { downloadCertificate } from '@/services/certificateService.js';
import { getStudentEnrollments, getStudentData } from '@/services/studentManagementService.js';

/**
 * StudentDashboard - Main dashboard for students
 * Shows progress, certificates, stats, and course management
 */
export default function StudentDashboard({ onNavigate }) {
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

  // Load student data from localStorage and Firebase
  useEffect(() => {
    const loadStudentDashboard = async () => {
      try {
        setLoading(true);

        // Load local student data
        const savedData = localStorage.getItem('studentData');
        if (savedData) {
          setStudentData(JSON.parse(savedData));
        }

        // Load Firebase enrollments for current user
        const userEmail = savedData ? JSON.parse(savedData).email : 'student@example.com';
        console.log('Loading enrollments for:', userEmail);
        
        const firebaseEnrollmentsData = await getStudentEnrollments(userEmail);
        console.log('Firebase enrollments loaded:', firebaseEnrollmentsData);
        setFirebaseEnrollments(firebaseEnrollmentsData);

        // Check for new enrollment from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const newEnrollmentId = urlParams.get('enrollmentId');
        if (newEnrollmentId) {
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

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {studentData.name}! 👋
              </h1>
              <p className="text-slate-400">
                Continue your cybersecurity learning journey
              </p>
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
              <button className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <p className="text-xs text-slate-500 mt-1">Achievements earned</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{studentData.currentStreak}</span>
            </div>
            <h3 className="text-slate-400 text-sm">Day Streak</h3>
            <p className="text-xs text-slate-500 mt-1">Current learning streak</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">My Courses</h2>
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
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <div className="flex items-center gap-2">
                          {course.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className={`text-sm font-medium ${getProgressColor(course.progress)}`}>
                              {Math.round(course.progress)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{course.lessons.length} lessons</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="mt-3 text-right">
                        <button
                          onClick={() => onNavigate('video-learning') || (window.location.href = `/video-learning?course=${course.id}`)}
                          className="btn-primary px-4 py-2"
                        >
                          Continue watching
                        </button>
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
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0" />
                      <span className="text-slate-300">{activity.description}</span>
                      <span className="text-slate-500 ml-auto">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">My Certificates</h3>
                <span className="text-slate-400 text-sm">{certificates.length} total</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {certificates.length === 0 ? (
                  <p className="text-slate-400 text-sm">No certificates yet</p>
                ) : (
                  certificates.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{cert.courseName}</p>
                        <p className="text-slate-400 text-xs">{new Date(cert.earnedDate).toLocaleDateString()} • ID: <span className="font-mono">{cert.certificateId}</span></p>
                      </div>
                      <button
                        onClick={() => { try { downloadCertificate(cert.certificateId); } catch (e) { alert('Download failed'); } }}
                        className="text-sky-400 hover:text-sky-300"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('video-learning')}
                  className="w-full text-left p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span className="text-white">Browse Courses</span>
                </button>
                <button className="w-full text-left p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span className="text-white">View Progress</span>
                </button>
                <button className="w-full text-left p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">My Certificates</span>
                </button>
              </div>
            </div>
          </div>

            {/* Payment Receipts */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Receipts</h3>
              <div className="space-y-3">
                {receipts.length === 0 ? (
                  <p className="text-slate-400 text-sm">No receipts yet</p>
                ) : (
                  receipts.slice(0, 5).map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{r.courseId}</p>
                        <p className="text-slate-400 text-xs">Order: <span className="font-mono">{r.orderId}</span> • Payment: <span className="font-mono">{r.paymentId}</span></p>
                      </div>
                      <div className="text-right text-slate-400 text-xs">{new Date(r.ts).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}