import React, { useState, useEffect } from 'react';
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
  XCircle
} from 'lucide-react';
import { loadCourses, addCourse, updateCourse, deleteCourse, addLesson, updateLesson, deleteLesson, moveLesson, exportCourses, importCourses } from '@/services/courseService.js';
import EnhancedCourseCreator from '@/components/EnhancedCourseCreator.jsx';

/**
 * AdminDashboard - Complete admin panel for LMS management
 */
export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '1 hour', category: 'defensive' });
  const [courseList, setCourseList] = useState([]);
  const [lessonModal, setLessonModal] = useState({ open: false, courseId: null, lesson: null });
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'youtube', videoId: '', videoUrl: '', duration: '10:00' });

  // Load data from localStorage
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Load students (mock data - in real app, this would come from API)
    const mockStudents = [
      { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', status: 'active', courses: 3 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-20', status: 'active', courses: 2 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-02-01', status: 'inactive', courses: 1 },
    ];
    setStudents(mockStudents);

    // Load courses
    const list = loadCourses();
    setCourseList(list);

    // Load enrollments
    const allEnrollments = [];
    list.forEach(course => {
      const enrollment = localStorage.getItem(`enrollment_${course.id}`);
      if (enrollment === 'true') {
        const progress = localStorage.getItem(`course_progress_${course.id}`);
        const progressData = progress ? JSON.parse(progress) : { courseProgress: 0, completedLessons: [] };
        allEnrollments.push({
          courseId: course.id,
          courseName: course.title,
          studentName: 'Student Name',
          progress: progressData.courseProgress,
          enrolledDate: '2024-01-15',
          status: progressData.courseProgress >= 100 ? 'completed' : 'in-progress'
        });
      }
    });
    setEnrollments(allEnrollments);

    // Load certificates
    const savedCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    setCertificates(savedCertificates);
    // Load receipts
    const savedReceipts = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
    setReceipts(savedReceipts.sort((a,b)=> b.ts - a.ts));
  };

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    totalCourses: courseList.length,
    totalEnrollments: enrollments.length,
    completedCourses: enrollments.filter(e => e.status === 'completed').length,
    totalCertificates: certificates.length,
    revenue: 125000, // Mock revenue
    completionRate: enrollments.length > 0 ? (enrollments.filter(e => e.status === 'completed').length / enrollments.length) * 100 : 0
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-red-400 bg-red-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-400">Manage your LMS platform</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Student
              </button>
              <button className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.totalStudents}</span>
                </div>
                <h3 className="text-slate-400 text-sm">Total Students</h3>
                <p className="text-xs text-slate-500 mt-1">{stats.activeStudents} active</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.totalCourses}</span>
                </div>
                <h3 className="text-slate-400 text-sm">Total Courses</h3>
                <p className="text-xs text-slate-500 mt-1">{stats.totalEnrollments} enrollments</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{stats.totalCertificates}</span>
                </div>
                <h3 className="text-slate-400 text-sm">Certificates Issued</h3>
                <p className="text-xs text-slate-500 mt-1">{stats.completedCourses} completed</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{Math.round(stats.completionRate)}%</span>
                </div>
                <h3 className="text-slate-400 text-sm">Completion Rate</h3>
                <p className="text-xs text-slate-500 mt-1">Course completion</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Enrollments</h3>
                <div className="space-y-3">
                  {enrollments.slice(0, 5).map((enrollment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{enrollment.studentName}</p>
                        <p className="text-slate-400 text-sm">{enrollment.courseName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                        <p className="text-slate-400 text-xs mt-1">{enrollment.progress}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Certificates</h3>
                <div className="space-y-3">
                  {certificates.slice(0, 5).map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{cert.studentName}</p>
                        <p className="text-slate-400 text-sm">{cert.courseName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">{formatDate(cert.earnedDate)}</p>
                        <button className="text-sky-400 hover:text-sky-300">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Payment Receipts</h3>
                <div className="space-y-3">
                  {receipts.length === 0 ? (
                    <p className="text-slate-400 text-sm">No receipts yet</p>
                  ) : (
                    receipts.slice(0, 8).map((r, idx) => (
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
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Students Table */}
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Courses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(student.joinDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{student.courses}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
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
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Course Management</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingCourse(null); setShowCourseModal(true); }} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Add Course
                </button>
                <button onClick={() => { const data = exportCourses(); const blob = new Blob([data], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'courses.json'; a.click(); }} className="btn-secondary px-3 py-2">Export</button>
                <label className="btn-secondary px-3 py-2 cursor-pointer">
                  Import
                  <input type="file" accept="application/json" className="hidden" onChange={(e)=>{ const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { importCourses(reader.result); setCourseList(loadCourses()); } catch (err) { alert('Invalid file'); } }; reader.readAsText(file); }} />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseList.map((course) => (
                <div key={course.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingCourse(course); setShowCourseModal(true); }} className="text-sky-400 hover:text-sky-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={()=>{ deleteCourse(course.id); setCourseList(loadCourses()); }} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{course.lessons.length} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={()=>{ setLessonModal({ open:true, courseId: course.id, lesson: null }); setLessonForm({ title: '', type: 'youtube', videoId: '', videoUrl: '', duration: '10:00' }); }} className="btn-secondary px-3 py-1">Add Lesson</button>
                    <button onClick={()=>{ setLessonModal({ open:true, courseId: course.id, lesson: { id: '__manage__' } }); }} className="btn-primary px-3 py-1">Manage Lessons</button>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs text-slate-400 block mb-1">Thumbnail</label>
                    <div className="flex items-center gap-2">
                      <img src={course.thumbnail || '/logo.png'} alt="thumb" className="w-12 h-12 rounded-md border border-slate-700 object-cover" />
                      <label className="btn-secondary px-3 py-1 cursor-pointer">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e)=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ updateCourse(course.id, { thumbnail: reader.result }); setCourseList(loadCourses()); }; reader.readAsDataURL(file);} } />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <EnhancedCourseCreator
              course={editingCourse}
              isOpen={showCourseModal}
              onClose={() => setShowCourseModal(false)}
              onSave={(courseData) => {
                if (editingCourse) {
                  updateCourse(editingCourse.id, courseData);
                } else {
                  addCourse(courseData);
                }
                setCourseList(loadCourses());
                setShowCourseModal(false);
              }}
            />
            {lessonModal.open && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setLessonModal({ open:false, courseId:null, lesson:null })}>
                <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl p-6" onClick={(e)=>e.stopPropagation()}>
                  <h4 className="text-white text-lg font-semibold mb-4">{lessonModal.lesson && lessonModal.lesson.id === '__manage__' ? 'Manage Lessons' : (lessonModal.lesson ? 'Edit Lesson' : 'Add Lesson')}</h4>
                  {lessonModal.lesson && lessonModal.lesson.id === '__manage__' ? (
                    <div className="space-y-3">
                      {courseList.find(c=>c.id===lessonModal.courseId)?.lessons.map((lsn, idx) => (
                        <div key={lsn.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                          <div className="text-slate-200 text-sm">{lsn.title} <span className="text-slate-400">({lsn.type})</span></div>
                          <div className="flex items-center gap-2">
                            <button onClick={()=>{ if (idx>0) { moveLesson(lessonModal.courseId, idx, idx-1); setCourseList(loadCourses()); } }} className="text-slate-300 hover:text-white">↑</button>
                            <button onClick={()=>{ const len = courseList.find(c=>c.id===lessonModal.courseId)?.lessons.length || 0; if (idx<len-1) { moveLesson(lessonModal.courseId, idx, idx+1); setCourseList(loadCourses()); } }} className="text-slate-300 hover:text-white">↓</button>
                            <button onClick={()=>{ setLessonModal({ open:true, courseId: lessonModal.courseId, lesson: lsn }); setLessonForm({ title: lsn.title, type: lsn.type, videoId: lsn.videoId || '', videoUrl: lsn.videoUrl || '', duration: lsn.duration || '10:00' }); }} className="text-sky-400 hover:text-sky-300"><Edit className="w-4 h-4"/></button>
                            <button onClick={()=>{ deleteLesson(lessonModal.courseId, lsn.id); setCourseList(loadCourses()); }} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                      <div className="text-right pt-2">
                        <button onClick={()=> setLessonModal({ open:false, courseId:null, lesson:null })} className="btn-secondary px-4 py-2">Close</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Title</label>
                        <input value={lessonForm.title} onChange={(e)=>setLessonForm({ ...lessonForm, title:e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm text-slate-300 mb-1">Type</label>
                          <select value={lessonForm.type} onChange={(e)=>setLessonForm({ ...lessonForm, type:e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white">
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="direct">Direct</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-300 mb-1">Video ID</label>
                          <input value={lessonForm.videoId} onChange={(e)=>setLessonForm({ ...lessonForm, videoId:e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-300 mb-1">Video URL</label>
                          <input value={lessonForm.videoUrl} onChange={(e)=>setLessonForm({ ...lessonForm, videoUrl:e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Duration</label>
                        <input value={lessonForm.duration} onChange={(e)=>setLessonForm({ ...lessonForm, duration:e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white" />
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button onClick={()=> setLessonModal({ open:false, courseId:null, lesson:null })} className="btn-secondary px-4 py-2">Cancel</button>
                        <button onClick={()=>{ if (lessonModal.lesson) { updateLesson(lessonModal.courseId, lessonModal.lesson.id, lessonForm); } else { addLesson(lessonModal.courseId, lessonForm); } setCourseList(loadCourses()); setLessonModal({ open:false, courseId:null, lesson:null }); }} className="btn-primary px-4 py-2">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Certificate Management</h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Award className="w-4 h-4" />
                Generate Certificate
              </button>
            </div>

            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {certificates.map((cert, index) => (
                      <tr key={index} className="hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{cert.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{cert.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">{cert.certificateId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(cert.earnedDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-500/20">
                            Verified
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-sky-400 hover:text-sky-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-400 hover:text-green-300">
                              <Download className="w-4 h-4" />
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
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Completion Rate</h3>
                <div className="space-y-4">
                  {courses.map((course) => {
                    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                    const completionRate = courseEnrollments.length > 0 
                      ? (courseEnrollments.filter(e => e.status === 'completed').length / courseEnrollments.length) * 100 
                      : 0;
                    
                    return (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{course.title}</span>
                          <span className="text-sm text-slate-400">{Math.round(completionRate)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">New Students</span>
                    <span className="text-white font-semibold">+12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Course Enrollments</span>
                    <span className="text-white font-semibold">+28</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Certificates Issued</span>
                    <span className="text-white font-semibold">+15</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Revenue</span>
                    <span className="text-green-400 font-semibold">₹{stats.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}