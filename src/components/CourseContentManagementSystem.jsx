import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Settings,
  MoreVertical,
  Folder,
  FolderOpen,
  FileText,
  Video,
  Image,
  Link,
  Archive,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadCourses, addCourse, updateCourse, deleteCourse } from '@/services/courseService.js';

/**
 * Enhanced Course Content Management System
 * Provides comprehensive course creation, management, and organization tools
 */
export default function CourseContentManagementSystem() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'popularity', 'rating'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);

  // Load courses and categories on component mount
  useEffect(() => {
    loadCoursesData();
  }, []);

  const loadCoursesData = async () => {
    setLoading(true);
    try {
      const coursesData = loadCourses();
      setCourses(coursesData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(coursesData.map(course => course.category || 'uncategorized'))];
      setCategories(['all', ...uniqueCategories]);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.enrollments || 0) - (a.enrollments || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'recent':
        default:
          return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      }
    });

  // Handle course creation
  const handleCreateCourse = async (courseData) => {
    try {
      const newCourse = {
        ...courseData,
        id: `course_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        enrollments: 0,
        completions: 0,
        rating: 0,
        lessons: []
      };
      
      await addCourse(newCourse);
      await loadCoursesData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  // Handle course update
  const handleUpdateCourse = async (courseId, updates) => {
    try {
      await updateCourse(courseId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      await loadCoursesData();
      setEditingCourse(null);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(courseId);
        await loadCoursesData();
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedCourses.length === 0) return;

    try {
      switch (bulkAction) {
        case 'delete':
          if (window.confirm(`Delete ${selectedCourses.length} courses? This cannot be undone.`)) {
            for (const courseId of selectedCourses) {
              await deleteCourse(courseId);
            }
            await loadCoursesData();
            setSelectedCourses([]);
          }
          break;
        case 'archive':
          for (const courseId of selectedCourses) {
            await handleUpdateCourse(courseId, { status: 'archived' });
          }
          setSelectedCourses([]);
          break;
        case 'publish':
          for (const courseId of selectedCourses) {
            await handleUpdateCourse(courseId, { status: 'published' });
          }
          setSelectedCourses([]);
          break;
        case 'draft':
          for (const courseId of selectedCourses) {
            await handleUpdateCourse(courseId, { status: 'draft' });
          }
          setSelectedCourses([]);
          break;
      }
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  // Toggle course selection
  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Select all courses
  const selectAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length 
        ? []
        : filteredCourses.map(course => course.id)
    );
  };

  // Export courses
  const exportCourses = () => {
    const dataStr = JSON.stringify(selectedCourses.length > 0 
      ? courses.filter(course => selectedCourses.includes(course.id))
      : courses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `courses-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Content Management</h2>
          <p className="text-slate-400">Create, manage, and organize your cybersecurity courses</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportCourses}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
              </span>
              
              <div className="flex items-center gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                >
                  <option value="">Bulk Actions</option>
                  <option value="publish">Publish</option>
                  <option value="draft">Move to Draft</option>
                  <option value="archive">Archive</option>
                  <option value="delete">Delete</option>
                </select>
                
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  Apply
                </button>
                
                <button
                  onClick={() => setSelectedCourses([])}
                  className="px-4 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Published</p>
              <p className="text-2xl font-bold text-white">
                {courses.filter(c => c.status === 'published').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Draft</p>
              <p className="text-2xl font-bold text-white">
                {courses.filter(c => c.status === 'draft').length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-white">
                {courses.reduce((sum, c) => sum + (c.enrollments || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Select All Checkbox */}
      {filteredCourses.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
              onChange={selectAllCourses}
              className="rounded border-slate-600 bg-slate-700 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-slate-300 text-sm">
              Select all {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            </span>
          </label>
        </div>
      )}

      {/* Courses Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
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
              isSelected={selectedCourses.includes(course.id)}
              onSelect={() => toggleCourseSelection(course.id)}
              onEdit={() => setEditingCourse(course)}
              onDelete={() => handleDeleteCourse(course.id)}
              onDuplicate={() => {
                const duplicated = {
                  ...course,
                  id: `course_${Date.now()}`,
                  title: `${course.title} (Copy)`,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  status: 'draft',
                  enrollments: 0,
                  completions: 0
                };
                handleCreateCourse(duplicated);
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No courses found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first course to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Course
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Course Modal */}
      <AnimatePresence>
        {(showCreateModal || editingCourse) && (
          <CourseModal
            course={editingCourse}
            isOpen={true}
            onClose={() => {
              setShowCreateModal(false);
              setEditingCourse(null);
            }}
            onSave={(courseData) => {
              if (editingCourse) {
                handleUpdateCourse(editingCourse.id, courseData);
              } else {
                handleCreateCourse(courseData);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual Course Card Component
 */
function CourseCard({ course, viewMode, isSelected, onSelect, onEdit, onDelete, onDuplicate }) {
  const [showActions, setShowActions] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-slate-600 bg-slate-700 text-sky-600"
          />
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-white">{course.title}</h3>
              <p className="text-sm text-slate-400 truncate">{course.description}</p>
            </div>
            
            <div className="text-center">
              <span className={`inline-block px-2 py-1 rounded-full text-xs border ${course.status ? course.status.charAt(0).toUpperCase() + course.status.slice(1) : 'Draft'}`}>
                {course.status || 'draft'}
              </span>
            </div>
            
            <div className="text-center">
              <span className="text-white font-medium">{course.enrollments || 0}</span>
              <p className="text-xs text-slate-400">Enrollments</p>
            </div>
            
            <div className="text-center">
              <span className="text-white font-medium">{course.lessons?.length || 0}</span>
              <p className="text-xs text-slate-400">Lessons</p>
            </div>
            
            <div className="flex justify-end">
              <CourseActions 
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200 overflow-hidden group"
    >
      {/* Course Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-slate-600 bg-slate-700 text-sky-600"
          />
          
          <span className={`px-2 py-1 rounded-full text-xs border ${course.status ? course.status : 'draft'}`}>
            {course.status || 'draft'}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {course.title}
        </h3>
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {course.description || 'No description available'}
        </p>
      </div>

      {/* Course Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-white">{course.lessons?.length || 0}</div>
            <div className="text-xs text-slate-400">Lessons</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{course.enrollments || 0}</div>
            <div className="text-xs text-slate-400">Enrolled</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {course.rating ? `${course.rating}★` : 'N/A'}
            </div>
            <div className="text-xs text-slate-400">Rating</div>
          </div>
        </div>
      </div>

      {/* Course Actions */}
      <div className="px-6 pb-6">
        <CourseActions 
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>
    </motion.div>
  );
}

/**
 * Course Actions Component
 */
function CourseActions({ onEdit, onDelete, onDuplicate }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm transition-colors"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      
      <button
        onClick={onDuplicate}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
        title="Duplicate Course"
      >
        <Copy className="w-4 h-4" />
      </button>
      
      <button
        onClick={onDelete}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        title="Delete Course"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Course Creation/Edit Modal
 */
function CourseModal({ course, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'defensive',
    level: 'beginner',
    duration: '1 week',
    price: 0,
    thumbnail: '',
    status: 'draft',
    ...course
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {course ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
              placeholder="Enter course title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
              placeholder="Brief description for course cards..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
              placeholder="Detailed course description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
              >
                <option value="defensive">Defensive Security</option>
                <option value="offensive">Offensive Security</option>
                <option value="specialized">Specialized Courses</option>
                <option value="technology">Technology Training</option>
                <option value="bootcamp">Bootcamp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                placeholder="e.g., 4 weeks, 10 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              {course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}