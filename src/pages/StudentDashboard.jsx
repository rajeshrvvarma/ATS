import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useAccessControl } from '@/context/AccessControlContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import VideoCourse from '@/components/VideoCourse.jsx';
import SecureContentViewer from '@/components/SecureContentViewer.jsx';
import EnhancedEnrollmentButton from '@/components/EnhancedEnrollmentButton.jsx';
import { loadCourses } from '@/services/courseService.js';
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
  Book,
  ShoppingCart,
  ArrowLeft,
  Lock,
  Eye
} from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

/**
 * StudentDashboard - Comprehensive student learning dashboard
 */
export default function StudentDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { 
    enrollments, 
    activeEnrollments, 
    checkCourseAccess,
    getCourseProgress,
    getCompletedLessons,
    refreshEnrollments
  } = useAccessControl();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // LMS Integration states
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Content viewer states
  const [viewingContent, setViewingContent] = useState(null); // { course, lesson }
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
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
  const [adminNotes, setAdminNotes] = useState([]);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [replyingToNote, setReplyingToNote] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (user) {
      loadStudentData();
      loadAdminNotes();
    }
    // Load all courses for browsing
    setAllCourses(loadCourses());
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

  const loadAdminNotes = async () => {
    if (!user) return;
    
    try {
      // Fetch admin notes subcollection
      const notesCol = collection(db, 'users', user.uid, 'notes');
      const notesQuery = query(notesCol, orderBy('createdAt', 'desc'));
      const notesSnap = await getDocs(notesQuery);
      const notesList = notesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAdminNotes(notesList);
      
      // Show popup if there are unread notes
      const unreadNotes = notesList.filter(note => !note.readByUser);
      if (unreadNotes.length > 0) {
        setShowNotesPopup(true);
      }
    } catch (err) {
      console.error('Failed to load admin notes:', err);
    }
  };

  const handleReplyToNote = async (noteId) => {
    if (!replyText.trim()) return;
    
    try {
      const repliesCol = collection(db, 'users', user.uid, 'notes', noteId, 'replies');
      await addDoc(repliesCol, {
        reply: replyText,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp()
      });
      
      setReplyText('');
      setReplyingToNote(null);
      loadAdminNotes(); // Refresh notes
      alert('Reply sent to admin!');
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    }
  };

  const markNotesAsRead = async () => {
    // Mark all unread notes as read when popup is closed
    try {
      const unreadNotes = adminNotes.filter(note => !note.readByUser);
      
      // Update each unread note to mark as read
      for (const note of unreadNotes) {
        const noteRef = doc(db, 'users', user.uid, 'notes', note.id);
        await updateDoc(noteRef, { readByUser: true });
      }
      
      // Update local state
      setAdminNotes(prevNotes => 
        prevNotes.map(note => ({ ...note, readByUser: true }))
      );
      
      setShowNotesPopup(false);
    } catch (err) {
      console.error('Failed to mark notes as read:', err);
      setShowNotesPopup(false); // Close popup anyway
    }
  };

  // Content viewer handlers
  const handleOpenLesson = (course, lesson, lessonIndex = 0) => {
    setViewingContent({ course, lesson });
    setCurrentLessonIndex(lessonIndex);
  };

  const handleLessonComplete = (lessonId) => {
    // Mark lesson as completed in user progress
    console.log('Lesson completed:', lessonId);
    // In real app, this would update the database
  };

  const handleNextLesson = () => {
    if (!viewingContent) return;
    
    const nextIndex = currentLessonIndex + 1;
    if (nextIndex < viewingContent.course.lessons.length) {
      const nextLesson = viewingContent.course.lessons[nextIndex];
      setViewingContent({ 
        course: viewingContent.course, 
        lesson: nextLesson 
      });
      setCurrentLessonIndex(nextIndex);
    }
  };

  const handlePreviousLesson = () => {
    if (!viewingContent) return;
    
    const prevIndex = currentLessonIndex - 1;
    if (prevIndex >= 0) {
      const prevLesson = viewingContent.course.lessons[prevIndex];
      setViewingContent({ 
        course: viewingContent.course, 
        lesson: prevLesson 
      });
      setCurrentLessonIndex(prevIndex);
    }
  };

  const handleCloseViewer = () => {
    setViewingContent(null);
    setCurrentLessonIndex(0);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Learning', icon: Play },
    { id: 'browse', label: 'Browse Courses', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Video className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              {enrolledCourses.length > 0 ? 'Your Learning Hub' : 'Welcome to Your Dashboard'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {enrolledCourses.length > 0 
                ? 'Access your courses, track progress, and continue learning' 
                : 'Browse courses, enroll, and start your cybersecurity journey'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-slate-400 text-sm">Available Courses</p>
              <p className="text-2xl font-bold text-white">
                {allCourses.filter(course => course.status === 'published').length}
              </p>
            </div>
            <Video className="w-8 h-8 text-sky-400" />
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

      {/* Admin Notes Section */}
      {adminNotes.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Admin Notes
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {adminNotes.map(note => (
              <div key={note.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="text-slate-200 mb-2">{note.note}</div>
                {note.createdAt && (
                  <div className="text-xs text-slate-400 mb-2">
                    {note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : ''}
                  </div>
                )}
                
                {/* Reply Section */}
                {replyingToNote === note.id ? (
                  <div className="mt-3">
                    <textarea
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReplyToNote(note.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => setReplyingToNote(null)}
                        className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingToNote(note.id)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Reply to Admin
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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

  // Integrated Learning Section with LMS
  const renderMyLearning = () => {
    // If viewing a specific course, show the course player
    if (selectedCourse) {
      const course = enrolledCourses.find(c => c.id === selectedCourse) || allCourses.find(c => c.id === selectedCourse);
      const isEnrolled = enrolledCourses.some(c => c.id === selectedCourse);
      
      if (!isEnrolled) {
        return (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to My Learning
            </button>
            
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Course Not Accessible</h2>
              <p className="text-slate-400 mb-6">You need to enroll in this course to access the content.</p>
              <button
                onClick={() => onNavigate('enroll')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Enroll in Course
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Learning
          </button>
          
          <VideoCourse 
            course={course} 
            onCourseComplete={(course) => {
              // Handle course completion
              console.log('Course completed:', course);
              setSelectedCourse(null);
            }}
          />
        </div>
      );
    }

    // Main learning dashboard
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">My Learning</h2>
          <button 
            onClick={() => setActiveTab('browse')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            Browse More Courses
          </button>
        </div>

        {activeEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Start Your Learning Journey</h3>
            <p className="text-slate-400 text-lg mb-6">No enrolled courses yet. Browse our catalog to get started!</p>
            <button 
              onClick={() => setActiveTab('browse')}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Browse Available Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeEnrollments.map((enrollment) => {
              const course = allCourses.find(c => c.id === enrollment.courseId);
              if (!course) return null;

              const progress = enrollment.enrollment.progress || 0;
              const completedLessons = enrollment.enrollment.completedLessons?.length || 0;
              const totalLessons = course.lessons?.length || 0;

              return (
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
                      <span className="text-white font-medium">{Math.round(progress)}%</span>
                    </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(progress)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{completedLessons}/{totalLessons} lessons</span>
                    <span>{course.duration || 'Self-paced'}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">Next: {course.nextLesson || 'Start Course'}</p>
                    <button 
                      onClick={() => handleOpenLesson(course.id, 0)}
                      className="w-full flex items-center justify-center space-x-2 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Browse Courses Section
  const renderBrowseCourses = () => {
    // Filter courses: only show published and coming-soon courses
    const availableCourses = allCourses.filter(course => 
      course.status === 'published' || course.status === 'coming-soon'
    );

    const publishedCourses = availableCourses.filter(course => course.status === 'published');
    const comingSoonCourses = availableCourses.filter(course => course.status === 'coming-soon');

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Browse Courses</h2>
          {cart.length > 0 && (
            <button 
              onClick={() => onNavigate('enroll')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cart.length})
            </button>
          )}
        </div>

        {/* Published Courses */}
        {publishedCourses.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              Available Courses ({publishedCourses.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {publishedCourses.map((course) => {
                const isEnrolled = activeEnrollments.some(enrollment => enrollment.courseId === course.id);
                const inCart = cart.includes(course.id);
                
                return (
                  <div key={course.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="relative">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-slate-700 flex items-center justify-center">
                          <Video className="w-12 h-12 text-slate-500" />
                        </div>
                      )}
                      {isEnrolled && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Enrolled
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Available
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration || 'Self-paced'}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.lessons?.length || 0} lessons
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          course.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {course.level || 'All Levels'}
                        </span>
                        <span className="font-semibold text-sky-400">
                          {course.price > 0 ? `₹${course.price}` : 'Free'}
                        </span>
                      </div>
                      
                      {isEnrolled ? (
                        <button 
                          onClick={() => setSelectedCourse(course.id)}
                          className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Continue Learning
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <button 
                            onClick={() => setSelectedCourse(course.id)}
                            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview Course
                          </button>
                          <EnhancedEnrollmentButton
                            course={course}
                            user={user}
                            onEnrollmentSuccess={async (courseId) => {
                              await refreshEnrollments();
                              setCart(cart.filter(id => id !== courseId));
                            }}
                            className="w-full text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Courses */}
        {comingSoonCourses.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Coming Soon ({comingSoonCourses.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {comingSoonCourses.map((course) => (
                <div key={course.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 opacity-75">
                  <div className="relative">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-slate-700 flex items-center justify-center">
                        <Video className="w-12 h-12 text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                        <span className="text-white font-semibold">Coming Soon</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Coming Soon
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration || 'To be announced'}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessons?.length || 0} lessons planned
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        course.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {course.level || 'All Levels'}
                      </span>
                      <span className="font-semibold text-slate-400">
                        {course.price > 0 ? `₹${course.price}` : 'Free'}
                      </span>
                    </div>
                    
                    <button 
                      disabled
                      className="w-full py-2 bg-slate-700 text-slate-400 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Notify When Available
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {availableCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Courses Available</h3>
            <p className="text-slate-400 mb-6">
              New courses are being created by our instructors. Check back soon!
            </p>
            <button
              onClick={() => setActiveTab('overview')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  };

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

      {/* Quick Browse - Featured Courses */}
      {allCourses.filter(course => course.status === 'published').length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Featured Courses</h3>
            <button
              onClick={() => setActiveTab('browse')}
              className="text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1"
            >
              Browse All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCourses
              .filter(course => course.status === 'published')
              .slice(0, 3)
              .map((course) => {
                const isEnrolled = activeEnrollments.some(enrollment => enrollment.courseId === course.id);
                const inCart = cart.includes(course.id);
                
                return (
                  <div key={course.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="relative">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-slate-700 flex items-center justify-center">
                          <Video className="w-8 h-8 text-slate-500" />
                        </div>
                      )}
                      {isEnrolled && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Enrolled
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-1">{course.title}</h4>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.lessons?.length || 0} lessons
                        </span>
                        <span className="font-semibold text-sky-400">
                          {course.price > 0 ? `₹${course.price}` : 'Free'}
                        </span>
                      </div>
                      
                      {isEnrolled ? (
                        <button 
                          onClick={() => setSelectedCourse(course.id)}
                          className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm transition-colors"
                        >
                          Continue Learning
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedCourse(course.id)}
                            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                          >
                            Preview
                          </button>
                          <button 
                            onClick={() => {
                              if (inCart) {
                                setCart(cart.filter(id => id !== course.id));
                              } else {
                                setCart([...cart, course.id]);
                              }
                            }}
                            className={`flex-1 py-2 rounded text-sm transition-colors ${
                              inCart 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {inCart ? 'Remove' : 'Add to Cart'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Coming Soon Preview */}
      {allCourses.filter(course => course.status === 'coming-soon').length > 0 && (
        <div className="mt-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Coming Soon</h3>
                <p className="text-slate-400 text-sm">New courses in development</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allCourses
                .filter(course => course.status === 'coming-soon')
                .slice(0, 2)
                .map((course) => (
                  <div key={course.id} className="flex items-center gap-3 bg-slate-700 rounded-lg p-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{course.title}</h4>
                      <p className="text-slate-400 text-xs">
                        {course.lessons?.length || 0} lessons planned
                      </p>
                    </div>
                    <span className="text-blue-400 text-xs font-medium">Soon</span>
                  </div>
                ))}
            </div>
            
            {allCourses.filter(course => course.status === 'coming-soon').length > 2 && (
              <button
                onClick={() => setActiveTab('browse')}
                className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
              >
                View All Coming Soon Courses
              </button>
            )}
          </div>
        </div>
      )}
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
      {activeTab === 'courses' && renderMyLearning()}
      {activeTab === 'browse' && renderBrowseCourses()}
      {activeTab === 'certificates' && renderCertificates()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'settings' && renderSettings()}

      {/* Admin Notes Popup */}
      {showNotesPopup && adminNotes.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              New Admin Notes
            </h3>
            <div className="space-y-4">
              {adminNotes.filter(note => !note.readByUser).map(note => (
                <div key={note.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="text-slate-200 mb-2">{note.note}</div>
                  {note.createdAt && (
                    <div className="text-xs text-slate-400">
                      {note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={markNotesAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Content Viewer */}
      {viewingContent && (
        <SecureContentViewer
          course={viewingContent.course}
          lesson={viewingContent.lesson}
          lessonIndex={currentLessonIndex}
          onClose={handleCloseViewer}
          onNext={handleNextLesson}
          onPrevious={handlePreviousLesson}
          user={user}
        />
      )}
    </DashboardLayout>
  );
}