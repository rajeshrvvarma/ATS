import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Move,
  Eye,
  Play,
  Upload,
  Link,
  Clock,
  Target,
  Users,
  Tag,
  FileText,
  Image,
  Video,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Copy,
  Settings,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  GripVertical,
  Square,
  RotateCcw,
  Download,
  ExternalLink,
  Loader2
} from 'lucide-react';

/**
 * EnhancedCourseCreator - Modern, comprehensive course creation interface
 * Features: Drag-and-drop lesson ordering, rich media support, preview mode
 */
export default function EnhancedCourseCreator({ 
  course = null, 
  isOpen, 
  onClose, 
  onSave 
}) {
  const [currentTab, setCurrentTab] = useState('details');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    duration: '',
    category: 'defensive',
    level: 'beginner',
    price: 0,
    thumbnail: '',
    tags: [],
    objectives: [''],
    prerequisites: [''],
    lessons: []
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'youtube', // Always YouTube
    videoId: '',
    videoUrl: '',
    duration: '10:00',
    resources: [],
    quiz: null
  });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    lessons: true,
    settings: false,
    preview: false
  });

  // Enhanced features state
  const [selectedLessons, setSelectedLessons] = useState(new Set());
  const [draggedLesson, setDraggedLesson] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  
  // Auto-save timer ref
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    if (course) {
      setCourseData({
        title: course.title || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        duration: course.duration || '',
        category: course.category || 'defensive',
        level: course.level || 'beginner',
        price: course.price || 0,
        thumbnail: course.thumbnail || '',
        tags: course.tags || [],
        objectives: course.objectives || [''],
        prerequisites: course.prerequisites || [''],
        lessons: course.lessons || []
      });
    }
  }, [course]);

  const handleSave = () => {
    const courseToSave = {
      ...courseData,
      id: course?.id || `course_${Date.now()}`,
      createdAt: course?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(courseToSave);
    onClose();
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!courseData.title.trim()) return; // Don't auto-save empty courses
    
    setAutoSaveStatus('saving');
    try {
      const courseToSave = {
        ...courseData,
        id: course?.id || `course_${Date.now()}`,
        createdAt: course?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Simulate auto-save (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem(`draft_course_${courseToSave.id}`, JSON.stringify(courseToSave));
      
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [courseData, course]);

  // Trigger auto-save on course data changes
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [courseData, autoSave]);

  const addLesson = () => {
    const newLesson = {
      id: `lesson_${Date.now()}`,
      ...lessonForm,
      order: courseData.lessons.length
    };
    setCourseData(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }));
    setLessonForm({
      title: '',
      description: '',
      type: 'youtube',
      videoId: '',
      videoUrl: '',
      duration: '10:00',
      resources: [],
      quiz: null
    });
    setShowLessonModal(false);
  };

  const updateLesson = () => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson => 
        lesson.id === editingLesson.id ? { ...lesson, ...lessonForm } : lesson
      )
    }));
    setShowLessonModal(false);
    setEditingLesson(null);
  };

  const deleteLesson = (lessonId) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
    }));
  };

  const moveLessonUp = (index) => {
    if (index === 0) return;
    const newLessons = [...courseData.lessons];
    [newLessons[index], newLessons[index - 1]] = [newLessons[index - 1], newLessons[index]];
    setCourseData(prev => ({ ...prev, lessons: newLessons }));
  };

  const moveLessonDown = (index) => {
    if (index === courseData.lessons.length - 1) return;
    const newLessons = [...courseData.lessons];
    [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]];
    setCourseData(prev => ({ ...prev, lessons: newLessons }));
  };

  // Enhanced lesson management functions
  const handleDragStart = (e, lesson, index) => {
    setDraggedLesson({ lesson, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedLesson(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedLesson || draggedLesson.index === dropIndex) return;

    const newLessons = [...courseData.lessons];
    const draggedItem = newLessons.splice(draggedLesson.index, 1)[0];
    newLessons.splice(dropIndex, 0, draggedItem);
    
    setCourseData(prev => ({ ...prev, lessons: newLessons }));
    setDraggedLesson(null);
    setDragOverIndex(null);
  };

  // Bulk operations
  const toggleLessonSelection = (lessonId) => {
    const newSelected = new Set(selectedLessons);
    if (newSelected.has(lessonId)) {
      newSelected.delete(lessonId);
    } else {
      newSelected.add(lessonId);
    }
    setSelectedLessons(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllLessons = () => {
    const allIds = new Set(courseData.lessons.map(lesson => lesson.id));
    setSelectedLessons(allIds);
    setShowBulkActions(true);
  };

  const deselectAllLessons = () => {
    setSelectedLessons(new Set());
    setShowBulkActions(false);
  };

  const duplicateSelectedLessons = () => {
    const selectedLessonObjects = courseData.lessons.filter(lesson => 
      selectedLessons.has(lesson.id)
    );
    
    const duplicatedLessons = selectedLessonObjects.map(lesson => ({
      ...lesson,
      id: `lesson_${Date.now()}_${Math.random()}`,
      title: `${lesson.title} (Copy)`,
      order: courseData.lessons.length
    }));

    setCourseData(prev => ({
      ...prev,
      lessons: [...prev.lessons, ...duplicatedLessons]
    }));
    
    deselectAllLessons();
  };

  const deleteSelectedLessons = () => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => !selectedLessons.has(lesson.id))
    }));
    deselectAllLessons();
  };

  // Media preview functions
  const openMediaPreview = (lesson) => {
    setPreviewMedia(lesson);
    setShowMediaPreview(true);
  };

  const getVideoEmbedUrl = (videoUrl, type) => {
    if (type === 'youtube') {
      const videoId = extractYouTubeId(videoUrl);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return videoUrl;
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addObjective = () => {
    setCourseData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index, value) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag) => {
    if (tag && !courseData.tags.includes(tag)) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {course ? 'Edit Course' : 'Create New Course'}
              </h2>
              <p className="text-sky-100">Build engaging cybersecurity courses</p>
            </div>
            
            {/* Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="w-4 h-4 text-yellow-300 animate-spin" />
                  <span className="text-yellow-100">Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span className="text-green-100">Auto-saved</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <X className="w-4 h-4 text-red-300" />
                  <span className="text-red-100">Save failed</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Course
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'details', label: 'Course Details', icon: BookOpen },
              { id: 'lessons', label: 'Lessons', icon: Play },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentTab === tab.id 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Course Details Tab */}
          {currentTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Course Title</label>
                      <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                        placeholder="Enter course title..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Short Description</label>
                      <input
                        type="text"
                        value={courseData.shortDescription}
                        onChange={(e) => setCourseData(prev => ({ ...prev, shortDescription: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                        placeholder="Brief description for course cards..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Detailed Description</label>
                      <textarea
                        value={courseData.description}
                        onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 h-24 resize-none"
                        placeholder="Detailed course description..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Duration</label>
                        <input
                          type="text"
                          value={courseData.duration}
                          onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                          placeholder="e.g., 4 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Price (₹)</label>
                        <input
                          type="number"
                          value={courseData.price}
                          onChange={(e) => setCourseData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Category</label>
                        <select
                          value={courseData.category}
                          onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="defensive">Defensive Security</option>
                          <option value="offensive">Offensive Security</option>
                          <option value="workshop">Workshop</option>
                          <option value="certification">Certification Prep</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Difficulty Level</label>
                        <select
                          value={courseData.level}
                          onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Learning Objectives</h3>
                  <div className="space-y-3">
                    {courseData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-sky-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                          placeholder="Learning objective..."
                        />
                        {courseData.objectives.length > 1 && (
                          <button
                            onClick={() => removeObjective(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addObjective}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add objective
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Course Thumbnail */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Thumbnail</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      {courseData.thumbnail ? (
                        <img 
                          src={courseData.thumbnail} 
                          alt="Course thumbnail" 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-slate-400">
                          <Image className="w-12 h-12 mx-auto mb-2" />
                          <p>Upload course thumbnail</p>
                          <p className="text-sm">Recommended: 1920x1080 pixels</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      value={courseData.thumbnail}
                      onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                      placeholder="Thumbnail URL..."
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-sky-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                      placeholder="Type and press Enter to add tags..."
                    />
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Prerequisites</h3>
                  <div className="space-y-3">
                    {courseData.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => setCourseData(prev => ({
                            ...prev,
                            prerequisites: prev.prerequisites.map((p, i) => i === index ? e.target.value : p)
                          }))}
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500"
                          placeholder="Prerequisite..."
                        />
                        {courseData.prerequisites.length > 1 && (
                          <button
                            onClick={() => setCourseData(prev => ({
                              ...prev,
                              prerequisites: prev.prerequisites.filter((_, i) => i !== index)
                            }))}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setCourseData(prev => ({
                        ...prev,
                        prerequisites: [...prev.prerequisites, '']
                      }))}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add prerequisite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lessons Tab */}
          {currentTab === 'lessons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">Course Lessons</h3>
                  {courseData.lessons.length > 0 && (
                    <span className="text-slate-400 text-sm">
                      {courseData.lessons.length} lesson{courseData.lessons.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Bulk Actions */}
                  {courseData.lessons.length > 1 && (
                    <div className="flex items-center gap-2 mr-4">
                      <button
                        onClick={selectedLessons.size === courseData.lessons.length ? deselectAllLessons : selectAllLessons}
                        className="text-slate-400 hover:text-white text-sm"
                      >
                        {selectedLessons.size === courseData.lessons.length ? 'Deselect All' : 'Select All'}
                      </button>
                      
                      {showBulkActions && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={duplicateSelectedLessons}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Duplicate ({selectedLessons.size})
                          </button>
                          <button
                            onClick={deleteSelectedLessons}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete ({selectedLessons.size})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setEditingLesson(null);
                      setLessonForm({
                        title: '',
                        description: '',
                        type: 'youtube',
                        videoId: '',
                        videoUrl: '',
                        duration: '10:00',
                        resources: [],
                        quiz: null
                      });
                      setShowLessonModal(true);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add YouTube Lesson
                  </button>
                </div>
              </div>

              {courseData.lessons.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-12 text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white fill-current" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No YouTube lessons yet</h4>
                  <p className="text-slate-400 mb-4">Start building your course by adding YouTube video lessons</p>
                  <button
                    onClick={() => setShowLessonModal(true)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add First YouTube Lesson
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {courseData.lessons.length > 1 && (
                    <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                      <GripVertical className="w-4 h-4" />
                      Drag lessons to reorder them
                    </div>
                  )}
                  
                  {courseData.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lesson, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`bg-slate-800 rounded-lg p-4 cursor-move transition-all duration-200 ${
                        dragOverIndex === index ? 'ring-2 ring-sky-500' : ''
                      } ${
                        draggedLesson?.index === index ? 'opacity-50' : ''
                      } ${
                        selectedLessons.has(lesson.id) ? 'ring-1 ring-purple-500 bg-slate-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        {courseData.lessons.length > 1 && (
                          <input
                            type="checkbox"
                            checked={selectedLessons.has(lesson.id)}
                            onChange={() => toggleLessonSelection(lesson.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                        {/* Drag Handle */}
                        <div className="flex items-center text-slate-400 hover:text-white cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Lesson Number */}
                        <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sky-400 font-semibold text-sm">{index + 1}</span>
                        </div>

                        {/* Lesson Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-medium truncate">{lesson.title}</h4>
                            {lesson.videoUrl && (
                              <button
                                onClick={() => openMediaPreview(lesson)}
                                className="text-slate-400 hover:text-sky-400 transition-colors"
                                title="Preview media"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1 text-red-400">
                              <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center">
                                <Play className="w-1.5 h-1.5 text-white fill-current" />
                              </div>
                              YouTube
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </span>
                            {lesson.description && (
                              <span className="truncate max-w-xs" title={lesson.description}>
                                {lesson.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveLessonUp(index)}
                            disabled={index === 0}
                            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1 rounded"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveLessonDown(index)}
                            disabled={index === courseData.lessons.length - 1}
                            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1 rounded"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingLesson(lesson);
                              setLessonForm({ ...lesson });
                              setShowLessonModal(true);
                            }}
                            className="text-sky-400 hover:text-sky-300 p-1 rounded"
                            title="Edit lesson"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const duplicatedLesson = {
                                ...lesson,
                                id: `lesson_${Date.now()}_${Math.random()}`,
                                title: `${lesson.title} (Copy)`,
                                order: courseData.lessons.length
                              };
                              setCourseData(prev => ({
                                ...prev,
                                lessons: [...prev.lessons, duplicatedLesson]
                              }));
                            }}
                            className="text-blue-400 hover:text-blue-300 p-1 rounded"
                            title="Duplicate lesson"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLesson(lesson.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded"
                            title="Delete lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {currentTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Enrollment Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Auto-approve enrollments</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Send welcome email</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Enable course reviews</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Certificate Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Issue certificate on completion</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Minimum completion percentage</label>
                      <input
                        type="number"
                        defaultValue="80"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Access Control</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Course is published</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Require enrollment approval</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Maximum enrollments</label>
                      <input
                        type="number"
                        placeholder="Leave empty for unlimited"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Advanced Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Enable discussions</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Track completion time</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Allow downloads</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {currentTab === 'preview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Course Preview</h3>
                <p className="text-slate-400">Preview how your course will appear to students</p>
              </div>

              {/* Course Card Preview */}
              <div className="bg-slate-800 rounded-lg overflow-hidden max-w-md mx-auto">
                {courseData.thumbnail && (
                  <img 
                    src={courseData.thumbnail} 
                    alt={courseData.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded text-xs uppercase">
                      {courseData.category}
                    </span>
                    <span className="text-slate-400 text-sm">{courseData.duration}</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{courseData.title || 'Course Title'}</h4>
                  <p className="text-slate-400 text-sm mb-4">{courseData.shortDescription || 'Course description'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">{courseData.lessons.length} lessons</span>
                    </div>
                    <div className="text-sky-400 font-semibold">
                      {courseData.price > 0 ? `₹${courseData.price}` : 'Free'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Creation Modal */}
        {showLessonModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Play className="w-4 h-4 text-red-600 fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingLesson ? 'Edit YouTube Lesson' : 'Add New YouTube Lesson'}
                  </h3>
                  <p className="text-red-100 text-sm">Connect your YouTube video content</p>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Lesson Title</label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter lesson title..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Description</label>
                    <textarea
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                      placeholder="Lesson description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Content Type</label>
                      <div className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-current" />
                        </div>
                        <span>YouTube Video</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Duration</label>
                      <input
                        type="text"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 15:30"
                      />
                    </div>
                  </div>

                  {/* YouTube Video Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">
                        YouTube Video URL or ID
                        <span className="text-slate-500 text-xs ml-2">(Paste full YouTube URL or just the video ID)</span>
                      </label>
                      <input
                        type="text"
                        value={lessonForm.videoUrl}
                        onChange={(e) => {
                          const input = e.target.value;
                          setLessonForm(prev => ({ 
                            ...prev, 
                            videoUrl: input,
                            videoId: extractYouTubeId(input) || input
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                      />
                    </div>
                    
                    {/* Video Preview */}
                    {lessonForm.videoUrl && extractYouTubeId(lessonForm.videoUrl) && (
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-slate-400 text-sm">Video Preview</span>
                          <button
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${extractYouTubeId(lessonForm.videoUrl)}`, '_blank')}
                            className="text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open on YouTube
                          </button>
                        </div>
                        <div className="aspect-video bg-black rounded overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(lessonForm.videoUrl)}`}
                            title="Video Preview"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingLesson ? updateLesson : addLesson}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {editingLesson ? 'Update YouTube Lesson' : 'Add YouTube Lesson'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Preview Modal */}
        {showMediaPreview && previewMedia && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Preview: {previewMedia.title}</h3>
                <button
                  onClick={() => setShowMediaPreview(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* YouTube Video Preview */}
                {previewMedia.videoUrl && extractYouTubeId(previewMedia.videoUrl) ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(previewMedia.videoUrl)}`}
                      title={previewMedia.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                      <p className="font-medium">YouTube Video Preview</p>
                      <p className="text-sm mt-1">
                        {previewMedia.videoUrl ? 'Invalid YouTube URL' : 'No video URL provided'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Platform:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center">
                          <Play className="w-2 h-2 text-white fill-current" />
                        </div>
                        <span className="text-white">YouTube Video</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white ml-2">{previewMedia.duration}</span>
                    </div>
                    {extractYouTubeId(previewMedia.videoUrl) && (
                      <div>
                        <span className="text-slate-400">Video ID:</span>
                        <span className="text-white ml-2 font-mono text-xs">
                          {extractYouTubeId(previewMedia.videoUrl)}
                        </span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-slate-400">Description:</span>
                      <p className="text-white mt-1">{previewMedia.description || 'No description'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingLesson(previewMedia);
                        setLessonForm({ ...previewMedia });
                        setShowMediaPreview(false);
                        setShowLessonModal(true);
                      }}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Lesson
                    </button>
                    
                    {extractYouTubeId(previewMedia.videoUrl) && (
                      <button
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${extractYouTubeId(previewMedia.videoUrl)}`, '_blank')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Watch on YouTube
                      </button>
                    )}
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