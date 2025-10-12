import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Play,
  FileText,
  Clock,
  Users,
  BookOpen,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  Cloud,
  Video,
  Image,
  Link,
  Calendar,
  Target,
  Award,
  Filter,
  Search,
  Grid,
  List,
  MoreVertical,
  Copy,
  Archive,
  AlertCircle,
  CheckCircle,
  HardDrive,
  CloudUpload,
  File,
  Loader2,
  Shield,
  UserCheck
} from 'lucide-react';
import { loadCourses, addCourse, updateCourse, deleteCourse, addLesson, updateLesson, deleteLesson, requestCourseDeletion } from '@/services/courseService.js';
import { 
  uploadCourseVideo, 
  uploadCourseDocument, 
  formatFileSize, 
  getFileTypeIcon,
  cloudConfig 
} from '@/services/googleCloudStorage.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { 
  canEditCourse, 
  canDeleteCourse, 
  canRequestCourseDeletion, 
  isAdmin, 
  isInstructor,
  hasPermission 
} from '@/services/authService.js';

const InstructorContentManagement = forwardRef((props, ref) => {
  const { user } = useAuth();
  // Core state
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft', 'coming-soon'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'students'

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'technology',
    level: 'beginner',
    duration: '',
    price: 0,
    thumbnail: '',
    status: 'draft', // 'draft', 'published', 'coming-soon'
    tags: [],
    objectives: [''],
    prerequisites: [''],
    targetAudience: '',
    certificate: false
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'video', // 'video', 'document', 'quiz', 'assignment'
    content: '', // URL for video, file path for documents
    duration: '',
    order: 0,
    isPreview: false,
    resources: []
  });

  // File upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load courses on component mount
  useEffect(() => {
    loadCoursesData();
  }, []);

  const loadCoursesData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const coursesData = loadCourses();
      
      // Filter courses based on user role
      let filteredCourses = coursesData;
      
      if (isInstructor()) {
        // Instructors can only see their own courses
        filteredCourses = coursesData.filter(course => 
          course.instructorId === user.uid || course.createdBy === user.uid
        );
      }
      // Admin can see all courses (no filtering needed)
      
      setCourses(filteredCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'students':
          return (b.enrolledStudents || 0) - (a.enrolledStudents || 0);
        case 'recent':
        default:
          return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      }
    });

  // Course CRUD operations
  const handleCreateCourse = async () => {
    if (!user) return;
    
    try {
      const newCourse = {
        ...courseForm,
        id: `course_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: [],
        enrolledStudents: 0,
        instructorId: user.uid, // Add instructor ownership
        createdBy: user.uid,
        instructorName: user.displayName || user.email
      };
      
      addCourse(newCourse);
      await loadCoursesData();
      setShowCourseModal(false);
      resetCourseForm();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !canEditCourse(editingCourse.id, editingCourse.instructorId)) {
      alert('You do not have permission to edit this course.');
      return;
    }
    
    try {
      const updatedCourse = {
        ...courseForm,
        updatedAt: new Date().toISOString()
      };
      
      updateCourse(editingCourse.id, updatedCourse);
      await loadCoursesData();
      setShowCourseModal(false);
      setEditingCourse(null);
      resetCourseForm();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId, courseOwnerId) => {
    // Check permissions for deletion
    if (canDeleteCourse(courseId, courseOwnerId)) {
      // Admin can delete directly
      if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        try {
          deleteCourse(courseId);
          await loadCoursesData();
        } catch (error) {
          console.error('Error deleting course:', error);
        }
      }
    } else if (canRequestCourseDeletion(courseId, courseOwnerId)) {
      // Instructor can request deletion
      if (window.confirm('This will send a deletion request to the admin for approval. Do you want to proceed?')) {
        try {
          await requestCourseDeletionHelper(courseId);
        } catch (error) {
          console.error('Error requesting course deletion:', error);
        }
      }
    } else {
      alert('You do not have permission to delete this course.');
    }
  };

  // Helper function to request course deletion
  const requestCourseDeletionHelper = async (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    try {
      await requestCourseDeletion(
        courseId, 
        user.uid, 
        user.displayName || user.email,
        course.title
      );
      alert('Deletion request sent to admin for approval.');
    } catch (error) {
      if (error.message.includes('already pending')) {
        alert('A deletion request for this course is already pending admin approval.');
      } else {
        console.error('Error requesting course deletion:', error);
        alert('Error sending deletion request. Please try again.');
      }
    }
  };

  const handleDuplicateCourse = async (course) => {
    try {
      const duplicatedCourse = {
        ...course,
        id: `course_${Date.now()}`,
        title: `${course.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrolledStudents: 0
      };
      
      addCourse(duplicatedCourse);
      await loadCoursesData();
    } catch (error) {
      console.error('Error duplicating course:', error);
    }
  };

  // Lesson CRUD operations
  const handleCreateLesson = async () => {
    try {
      const newLesson = {
        ...lessonForm,
        id: `lesson_${Date.now()}`,
        courseId: selectedCourse.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addLesson(selectedCourse.id, newLesson);
      await loadCoursesData();
      setShowLessonModal(false);
      resetLessonForm();
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleUpdateLesson = async () => {
    try {
      const updatedLesson = {
        ...lessonForm,
        updatedAt: new Date().toISOString()
      };
      
      updateLesson(selectedCourse.id, editingLesson.id, updatedLesson);
      await loadCoursesData();
      setShowLessonModal(false);
      setEditingLesson(null);
      resetLessonForm();
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        deleteLesson(selectedCourse.id, lessonId);
        await loadCoursesData();
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  // Form helpers
  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      shortDescription: '',
      category: 'technology',
      level: 'beginner',
      duration: '',
      price: 0,
      thumbnail: '',
      status: 'draft',
      tags: [],
      objectives: [''],
      prerequisites: [''],
      targetAudience: '',
      certificate: false
    });
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      type: 'video',
      content: '',
      duration: '',
      order: 0,
      isPreview: false,
      resources: []
    });
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedFiles([]);
  };

  // File upload handlers
  const handleFileUpload = async (file, courseId, lessonId = null) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let result;
      if (file.type.startsWith('video/')) {
        result = await uploadCourseVideo(file, courseId, lessonId || 'temp', (progress) => {
          setUploadProgress(progress);
        });
      } else {
        result = await uploadCourseDocument(file, courseId, lessonId);
      }

      if (result.success) {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: result.videoUrl || result.documentUrl,
          uploadedAt: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, fileData]);

        // Update lesson form with file URL
        if (lessonForm.type === 'video' && file.type.startsWith('video/')) {
          setLessonForm(prev => ({ ...prev, content: fileData.url }));
        } else if (lessonForm.type === 'document') {
          setLessonForm(prev => ({ ...prev, content: fileData.url }));
        }

        console.log('File uploaded successfully:', fileData);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, courseId, lessonId) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], courseId, lessonId);
    }
  };

  const openCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ ...course });
    } else {
      setEditingCourse(null);
      resetCourseForm();
    }
    setShowCourseModal(true);
  };

  const openLessonModal = (course, lesson = null) => {
    setSelectedCourse(course);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({ ...lesson });
    } else {
      setEditingLesson(null);
      resetLessonForm();
    }
    setShowLessonModal(true);
  };

  // Expose imperative API for parent components (e.g., dashboard quick actions)
  useImperativeHandle(ref, () => ({
    openCreateCourse: () => openCourseModal(),
  }));


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-sky-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Content Management</h2>
            <p className="text-slate-300">Create and manage your courses and lessons</p>
          </div>
        </div>
        <button
          onClick={() => openCourseModal()}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Course
        </button>
      </div>

  {/* Filters and Search */}
  <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto min-w-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-auto min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="coming-soon">Coming Soon</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-auto min-w-[160px]"
          >
            <option value="recent">Most Recent</option>
            <option value="title">Title A-Z</option>
            <option value="students">Most Students</option>
          </select>
          
          <div className="flex border border-slate-600 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No courses found</h3>
          <p className="text-slate-300 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first course'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => openCourseModal()}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onEdit={() => openCourseModal(course)}
              onDelete={() => handleDeleteCourse(course.id, course.instructorId)}
              onDuplicate={() => handleDuplicateCourse(course)}
              onManageLessons={() => openLessonModal(course)}
            />
          ))}
        </div>
      )}

      {/* Course Modal */}
      <AnimatePresence>
        {showCourseModal && (
          <CourseModal
            isOpen={showCourseModal}
            onClose={() => {
              setShowCourseModal(false);
              setEditingCourse(null);
              resetCourseForm();
            }}
            courseForm={courseForm}
            setCourseForm={setCourseForm}
            onSave={editingCourse ? handleUpdateCourse : handleCreateCourse}
            isEditing={!!editingCourse}
          />
        )}
      </AnimatePresence>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && selectedCourse && (
          <LessonModal
            isOpen={showLessonModal}
            onClose={() => {
              setShowLessonModal(false);
              setEditingLesson(null);
              setSelectedCourse(null);
              resetLessonForm();
            }}
            course={selectedCourse}
            lessonForm={lessonForm}
            setLessonForm={setLessonForm}
            onSave={editingLesson ? handleUpdateLesson : handleCreateLesson}
            onDeleteLesson={handleDeleteLesson}
            isEditing={!!editingLesson}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    published: { classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30', label: 'Published' },
    draft: { classes: 'bg-slate-600/40 text-slate-200 border border-slate-500/40', label: 'Draft' },
    'coming-soon': { classes: 'bg-sky-500/15 text-sky-300 border border-sky-500/30', label: 'Coming Soon' }
  };
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
};

// Course Card Component
const CourseCard = ({ course, viewMode, onEdit, onDelete, onDuplicate, onManageLessons }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();
  
  // Check permissions for this specific course
  const canEdit = canEditCourse(course.id, course.instructorId);
  const canDelete = canDeleteCourse(course.id, course.instructorId);
  const canRequestDelete = canRequestCourseDeletion(course.id, course.instructorId);
  const showDeleteOption = canDelete || canRequestDelete;

  if (viewMode === 'list') {
    return (
  <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <img
              src={course.thumbnail || '/api/placeholder/80/60'}
              alt={course.title}
              className="w-20 h-15 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{course.title}</h3>
                <StatusBadge status={course.status} />
              </div>
              <p className="text-slate-300 text-sm mb-2 line-clamp-2">{course.shortDescription || course.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration || 'Not set'}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.lessons?.length || 0} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {course.enrolledStudents || 0} students
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onManageLessons}
              className="bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded"
              title="Manage Lessons"
            >
              <BookOpen className="h-4 w-4" />
            </button>
            {canEdit && (
              <button
                onClick={onEdit}
                className="text-slate-300 hover:text-white p-2 rounded"
                title="Edit Course"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {/* Show course owner indicator for instructors */}
            {isInstructor() && course.instructorId === user?.uid && (
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-500/10 rounded text-xs text-sky-300">
                <UserCheck className="h-3 w-3" />
                <span>Your Course</span>
              </div>
            )}
            {/* Admin can see course owner */}
            {isAdmin() && course.instructorName && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-600/30 rounded text-xs text-slate-200">
                <UserCheck className="h-3 w-3" />
                <span>{course.instructorName}</span>
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-slate-300 hover:text-white p-2 rounded"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-10">
                  <button
                    onClick={onDuplicate}
                    className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Duplicate
                  </button>
                  {showDeleteOption && (
                    <button
                      onClick={onDelete}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                        canDelete ? 'text-red-400 hover:bg-red-950/20' : 'text-orange-300 hover:bg-orange-950/20'
                      }`}
                      title={canDelete ? 'Delete course' : 'Request deletion (requires admin approval)'}
                    >
                      <Trash2 className="h-3 w-3" />
                      {canDelete ? 'Delete' : 'Request Delete'}
                    </button>
                  )}
                  {!canEdit && !showDeleteOption && (
                    <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Read Only
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
  className="bg-slate-700/40 border border-slate-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={course.thumbnail || '/api/placeholder/400/200'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={course.status} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-slate-300 text-sm mb-3 line-clamp-2">{course.shortDescription || course.description}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration || 'Not set'}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.lessons?.length || 0} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course.enrolledStudents || 0} students
          </span>
        </div>
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={onManageLessons}
                className="bg-sky-600 text-white px-3 py-1.5 rounded text-sm hover:bg-sky-700 transition-colors flex items-center gap-1"
              >
                <BookOpen className="h-3 w-3" />
                Lessons
              </button>
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="text-slate-300 hover:text-white p-1.5 rounded"
                  title="Edit"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>
            
            {/* Course ownership indicator */}
            <div className="flex items-center gap-2">
              {isInstructor() && course.instructorId === user?.uid && (
                <div className="flex items-center gap-1 px-2 py-1 bg-sky-500/10 rounded text-xs text-sky-300">
                  <UserCheck className="h-3 w-3" />
                  <span>Your Course</span>
                </div>
              )}
              {isAdmin() && course.instructorName && (
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-600/30 rounded text-xs text-slate-200">
                  <UserCheck className="h-3 w-3" />
                  <span>{course.instructorName}</span>
                </div>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-slate-300 hover:text-white p-1.5 rounded"
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-10">
                    <button
                      onClick={onDuplicate}
                      className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </button>
                    {showDeleteOption && (
                      <button
                        onClick={onDelete}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          canDelete ? 'text-red-400 hover:bg-red-950/20' : 'text-orange-300 hover:bg-orange-950/20'
                        }`}
                        title={canDelete ? 'Delete course' : 'Request deletion (requires admin approval)'}
                      >
                        <Trash2 className="h-3 w-3" />
                        {canDelete ? 'Delete' : 'Request Delete'}
                      </button>
                    )}
                    {!canEdit && !showDeleteOption && (
                      <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Read Only
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
};

// Course Modal Component
const CourseModal = ({ isOpen, onClose, courseForm, setCourseForm, onSave, isEditing }) => {
  const updateField = (field, value) => {
    setCourseForm(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, value) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-[1000] p-4 overscroll-contain"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
  className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Course' : 'Create New Course'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditing ? 'Update course information' : 'Build engaging learning experiences'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Course Title*</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter course title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={courseForm.shortDescription}
                      onChange={(e) => updateField('shortDescription', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Brief course description for cards..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Full Description</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Detailed course description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => updateField('category', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="technology">Technology</option>
                        <option value="cybersecurity">Cybersecurity</option>
                        <option value="data-science">Data Science</option>
                        <option value="cloud">Cloud Computing</option>
                        <option value="programming">Programming</option>
                        <option value="devops">DevOps</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Level</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => updateField('level', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Duration</label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={(e) => updateField('duration', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="e.g., 8 weeks, 40 hours"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={courseForm.price}
                        onChange={(e) => updateField('price', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                    <select
                      value={courseForm.status}
                      onChange={(e) => updateField('status', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Learning Objectives</h3>
                <div className="space-y-2">
                  {courseForm.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-sky-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateArrayField('objectives', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="What will students learn?"
                      />
                      {courseForm.objectives.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('objectives', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('objectives')}
                    className="text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add objective
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Course Thumbnail */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Course Thumbnail</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    {courseForm.thumbnail ? (
                      <img
                        src={courseForm.thumbnail}
                        alt="Course thumbnail"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="text-slate-400">
                        <Image className="w-12 h-12 mx-auto mb-2" />
                        <p>Upload course thumbnail</p>
                        <p className="text-sm">Recommended: 400x200 pixels</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    value={courseForm.thumbnail}
                    onChange={(e) => updateField('thumbnail', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Thumbnail URL or click to upload..."
                  />
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <HardDrive className="h-4 w-4" />
                    <span>Files will be stored in Google Cloud Storage</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Prerequisites</h3>
                <div className="space-y-2">
                  {courseForm.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={prerequisite}
                        onChange={(e) => updateArrayField('prerequisites', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="What should students know beforehand?"
                      />
                      {courseForm.prerequisites.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('prerequisites', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('prerequisites')}
                    className="text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add prerequisite
                  </button>
                </div>
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Additional Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Target Audience</label>
                    <textarea
                      value={courseForm.targetAudience}
                      onChange={(e) => updateField('targetAudience', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Who is this course designed for?"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="certificate"
                      checked={courseForm.certificate}
                      onChange={(e) => updateField('certificate', e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500"
                    />
                    <label htmlFor="certificate" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <Award className="h-4 w-4 text-sky-400" />
                      Offer completion certificate
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-300">
            {isEditing ? 'Update your course information' : 'Create engaging content for your students'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!courseForm.title.trim()}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

// Lesson Modal Component
const LessonModal = ({ isOpen, onClose, course, lessonForm, setLessonForm, onSave, onDeleteLesson, isEditing }) => {
  const updateField = (field, value) => {
    setLessonForm(prev => ({ ...prev, [field]: value }));
  };

  const lessonTypes = [
    { value: 'video', label: 'Video Content', icon: Video },
    { value: 'document', label: 'Document/PDF', icon: FileText },
    { value: 'quiz', label: 'Quiz/Assessment', icon: CheckCircle },
    { value: 'assignment', label: 'Assignment', icon: Edit }
  ];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-[1000] p-4 overscroll-contain"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
  className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Lesson' : 'Add New Lesson'}
                </h2>
                <p className="text-green-100 text-sm">
                  Course: {course.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lesson List */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Course Lessons ({course.lessons.length})</h3>
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-sky-500/10 text-sky-300 rounded text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-200">{lesson.title}</span>
                      {lesson.type === 'video' && <Video className="h-3 w-3 text-slate-400" />}
                      {lesson.type === 'document' && <FileText className="h-3 w-3 text-slate-400" />}
                    </div>
                    <button
                      onClick={() => onDeleteLesson(lesson.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Lesson Title*</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter lesson title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Lesson description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Content Type</label>
                <select
                  value={lessonForm.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {lessonTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  {lessonForm.type === 'video' ? 'Video URL or File' : 'Content URL or File'}
                </label>
                <input
                  type="text"
                  value={lessonForm.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={lessonForm.type === 'video' ? 'Video URL or upload path...' : 'Content URL or file path...'}
                />
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-300">
                  <Cloud className="h-4 w-4" />
                  <span>Files will be uploaded to Google Cloud Storage</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Duration</label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., 15 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Order</label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => updateField('order', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPreview"
                  checked={lessonForm.isPreview}
                  onChange={(e) => updateField('isPreview', e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="isPreview" className="text-sm font-medium text-slate-200">
                  Allow preview (visible to non-enrolled students)
                </label>
              </div>
            </div>
          </div>

          {/* Content Upload Area */}
          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CloudUpload className="h-5 w-5 text-sky-400" />
              <h4 className="font-medium text-white">Content Upload</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Upload to Google Cloud Storage: {cloudConfig.bucketName}
            </p>
            
            {/* File Upload Zone */}
            <div 
              className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center transition-colors hover:border-sky-500/50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, course.id, editingLesson?.id)}
            >
              {isUploading ? (
                <div className="space-y-2">
                  <CloudUpload className="h-8 w-8 text-sky-400 mx-auto animate-bounce" />
                  <p className="text-sky-300 font-medium">Uploading...</p>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sky-300 text-sm">{Math.round(uploadProgress)}% complete</p>
                </div>
              ) : (
                <div>
                  <HardDrive className="h-8 w-8 text-sky-400 mx-auto mb-2" />
                  <p className="text-sky-300 font-medium mb-1">
                    {lessonForm.type === 'video' ? 'Upload Video File' : 'Upload Document/File'}
                  </p>
                  <p className="text-slate-300 text-sm mb-3">
                    Drag & drop or click to select
                  </p>
                  <input
                    type="file"
                    accept={lessonForm.type === 'video' ? 'video/*' : '*'}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(file, course.id, editingLesson?.id);
                      }
                    }}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </label>
                </div>
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-white mb-2">Uploaded Files</h5>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('video/') && <Video className="h-4 w-4 text-sky-400" />}
                        {file.type.includes('pdf') && <FileText className="h-4 w-4 text-red-400" />}
                        {!file.type.startsWith('video/') && !file.type.includes('pdf') && <File className="h-4 w-4 text-slate-400" />}
                        <div>
                          <p className="text-sm font-medium text-slate-200">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded">
                          ✓ Uploaded
                        </span>
                        <button
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Info */}
            <div className="mt-3 text-xs text-sky-300 bg-sky-500/10 p-2 rounded border border-sky-500/20">
              <div className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                <span>Files stored in: {cloudConfig.region} | CDN: Global</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-300">
            Add engaging content for your students
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!lessonForm.title.trim()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Lesson' : 'Add Lesson'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default InstructorContentManagement;