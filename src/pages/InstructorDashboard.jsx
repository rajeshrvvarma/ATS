import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  MessageSquare,
  FileText,
  Video,
  PlayCircle,
  Download,
  Upload,
  Target,
  Lightbulb,
  Brain,
  Activity
} from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import app from '@/config/firebase';

const db = getFirestore(app);

/**
 * InstructorDashboard - Comprehensive instructor panel for course management and student tracking
 */
export default function InstructorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState([]);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [error, setError] = useState('');

  // Real data states
  const [instructorStats, setInstructorStats] = useState({
    coursesCreated: 0,
    totalStudents: 0,
    totalEarnings: 0,
    avgRating: 0,
    hoursTeaching: 0,
    certificatesIssued: 0
  });
  const [myCourses, setMyCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructorEarnings, setInstructorEarnings] = useState({
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    pending: 0,
  });

  useEffect(() => {
    if (user) {
      loadInstructorData();
      loadAdminNotes();
    }
  }, [user]);

  const loadInstructorData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Load instructor's courses
      const coursesQuery = query(
        collection(db, 'courses'),
        where('instructorId', '==', user.uid)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyCourses(courses);

      // Load students enrolled in instructor's courses
      const courseIds = courses.map(c => c.id);
      const allStudents = [];
      
      if (courseIds.length > 0) {
        for (const courseId of courseIds) {
          const enrollmentsQuery = query(
            collection(db, 'enrollments'),
            where('courseId', '==', courseId)
          );
          const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
          const enrollments = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Add course info to each student
          enrollments.forEach(enrollment => {
            const course = courses.find(c => c.id === courseId);
            allStudents.push({
              ...enrollment,
              courseName: course?.title || 'Unknown Course'
            });
          });
        }
      }
      setStudents(allStudents);

      // Load recent activity
      const activityQuery = query(
        collection(db, 'instructorActivity'),
        where('instructorId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const activities = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentActivity(activities);

      // Calculate stats
      const totalStudents = allStudents.length;
      const totalEarnings = courses.reduce((sum, course) => sum + (course.earnings || 0), 0);
      const avgRating = courses.length > 0 
        ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length 
        : 0;
      const certificatesIssued = allStudents.filter(s => s.certificateEarned).length;

      const stats = {
        coursesCreated: courses.length,
        totalStudents,
        totalEarnings,
        avgRating: Math.round(avgRating * 10) / 10,
        hoursTeaching: courses.reduce((sum, course) => sum + (course.totalHours || 0), 0),
        certificatesIssued
      };
      setInstructorStats(stats);

      // Basic earnings breakdown (placeholder logic using totals)
      setInstructorEarnings({
        thisMonth: Math.round((stats.totalEarnings || 0) * 0.2),
        lastMonth: Math.round((stats.totalEarnings || 0) * 0.18),
        thisYear: Math.round((stats.totalEarnings || 0)),
        pending: Math.max(0, Math.round((stats.totalEarnings || 0) * 0.05)),
      });

    } catch (err) {
      console.error('Error loading instructor data:', err);
      setError('Failed to load dashboard data');
    }
    
    setLoading(false);
  };

  const loadAdminNotes = async () => {
    if (!user) return;
    
    try {
      // Fetch admin notes subcollection for instructor
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'earnings', label: 'Earnings', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Courses Created</p>
              <p className="text-2xl font-bold text-white">{instructorStats.coursesCreated}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white">{instructorStats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-white">${instructorStats.totalEarnings.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-white">{instructorStats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Teaching Hours</p>
              <p className="text-2xl font-bold text-white">{instructorStats.hoursTeaching}h</p>
            </div>
            <Clock className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-white">{instructorStats.certificatesIssued}</p>
            </div>
            <Target className="w-8 h-8 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
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
                    case 'student_complete': return CheckCircle;
                    case 'new_enrollment': return Users;
                    case 'question_asked': return MessageSquare;
                    case 'course_review': return Star;
                    default: return Activity;
                  }
                };
                const getActivityColor = (type) => {
                  switch (type) {
                    case 'student_complete': return 'text-green-400';
                    case 'new_enrollment': return 'text-blue-400';
                    case 'question_asked': return 'text-yellow-400';
                    case 'course_review': return 'text-purple-400';
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

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Course</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Video className="w-4 h-4" />
              <span className="text-sm">Add Lesson</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">View Q&A</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </button>
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
                  <div className="text-xs text-slate-400">
                    {note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Courses</h2>
        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {myCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No courses created yet</p>
            <button className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors">
              Create Your First Course
            </button>
          </div>
        ) : (
          myCourses.map((course) => (
            <div key={course.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                course.status === 'published' ? 'bg-green-500/20 text-green-400' :
                course.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Students Enrolled</span>
                <span className="text-white font-medium">{course.students}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Completion Rate</span>
                <span className="text-white font-medium">{course.completion}%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">{course.rating || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Earnings</span>
                <span className="text-white font-medium">${course.earnings.toLocaleString()}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-700 flex items-center space-x-2">
                <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Student Progress</h2>
        <div className="flex items-center space-x-2 text-slate-400">
          <Users className="w-5 h-5" />
          <span>{students.length} active students</span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No students enrolled yet</p>
                    <p className="text-slate-500 text-sm mt-2">Students will appear here when they enroll in your courses</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-sm text-slate-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-sky-500 h-2 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-white">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {student.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {student.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-sky-400 hover:text-sky-300">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Teaching Analytics</h2>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Course Views</p>
              <p className="text-2xl font-bold text-white">1,234</p>
              <p className="text-green-400 text-sm">+12% from last week</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">New Enrollments</p>
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-green-400 text-sm">+8% from last week</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">78%</p>
              <p className="text-red-400 text-sm">-2% from last week</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Student Satisfaction</p>
              <p className="text-2xl font-bold text-white">4.7/5</p>
              <p className="text-green-400 text-sm">+0.1 from last month</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Enrollment Trends</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <TrendingUp className="w-16 h-16" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Course Performance</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <BarChart3 className="w-16 h-16" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Earnings Dashboard</h2>
      
      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">${instructorEarnings.thisMonth.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Last Month</p>
              <p className="text-2xl font-bold text-white">${instructorEarnings.lastMonth.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Year</p>
              <p className="text-2xl font-bold text-white">${instructorEarnings.thisYear.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">${instructorEarnings.pending.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Payout Options */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Payout Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Auto Payout</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Minimum Threshold: $100</span>
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
              Change
            </button>
          </div>
          <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Request Payout
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Instructor Settings</h2>
        {/* Profile editing is now handled via the Profile page, accessible from the user menu. */}
        {/* Notification Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">New Student Enrollments</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Course Reviews</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Q&A Messages</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Payout Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
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
          <p className="text-slate-400 mt-4">Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Instructor Dashboard" user={user} onNavigate={onNavigate}>
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
      {activeTab === 'students' && renderStudents()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'earnings' && renderEarnings()}
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
    </DashboardLayout>
  );
}