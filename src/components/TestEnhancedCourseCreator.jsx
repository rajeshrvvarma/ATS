import React, { useState } from 'react';
import EnhancedCourseCreator from './EnhancedCourseCreator.jsx';
import { BookOpen, Plus, Edit3 } from 'lucide-react';

/**
 * TestEnhancedCourseCreator - Demo component to test enhanced course creator features
 */
export default function TestEnhancedCourseCreator() {
  const [showCreator, setShowCreator] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);

  // Sample course data for testing
  const sampleCourse = {
    id: 'sample_course_1',
    title: 'Advanced Cybersecurity Fundamentals',
    description: 'A comprehensive course covering advanced cybersecurity concepts and practical implementations.',
    shortDescription: 'Learn advanced cybersecurity techniques and best practices.',
    duration: '8 hours',
    category: 'defensive',
    level: 'advanced',
    price: 2999,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    tags: ['cybersecurity', 'defense', 'network security'],
    objectives: [
      'Understand advanced threat detection techniques',
      'Implement security monitoring solutions',
      'Master incident response procedures'
    ],
    prerequisites: [
      'Basic networking knowledge',
      'Understanding of operating systems',
      'Prior cybersecurity experience recommended'
    ],
    lessons: [
      {
        id: 'lesson_1',
        title: 'Introduction to Advanced Threats',
        description: 'Understanding modern cybersecurity threats and attack vectors',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:30',
        order: 0,
        resources: []
      },
      {
        id: 'lesson_2',
        title: 'Network Monitoring Fundamentals',
        description: 'Setting up and configuring network monitoring tools',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '22:45',
        order: 1,
        resources: []
      },
      {
        id: 'lesson_3',
        title: 'Incident Response Playbook',
        description: 'Creating and executing incident response procedures',
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:20',
        order: 2,
        resources: []
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleSaveCourse = (courseData) => {
    console.log('Course saved:', courseData);
    setSavedCourses(prev => {
      const existing = prev.find(c => c.id === courseData.id);
      if (existing) {
        return prev.map(c => c.id === courseData.id ? courseData : c);
      }
      return [...prev, courseData];
    });
    
    // Show success message (in real app, this would be a toast notification)
    alert('Course saved successfully!');
  };

  const createNewCourse = () => {
    setEditCourse(null);
    setShowCreator(true);
  };

  const editExistingCourse = (course) => {
    setEditCourse(course);
    setShowCreator(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Enhanced YouTube Course Creator - Test Interface
          </h1>
          <p className="text-slate-400 mb-6">
            Test the new YouTube-optimized course creator with drag & drop, auto-save, bulk operations, and video preview features.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={createNewCourse}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Course
            </button>
            
            <button
              onClick={() => editExistingCourse(sampleCourse)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-5 h-5" />
              Edit Sample Course (3 lessons)
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-green-400 font-semibold mb-2">✨ Drag & Drop</div>
            <p className="text-slate-300 text-sm">Drag lessons to reorder them intuitively</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-blue-400 font-semibold mb-2">💾 Auto-Save</div>
            <p className="text-slate-300 text-sm">Automatic saving with live status updates</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-purple-400 font-semibold mb-2">🔄 Bulk Actions</div>
            <p className="text-slate-300 text-sm">Select multiple lessons for bulk operations</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-yellow-400 font-semibold mb-2">👁️ Media Preview</div>
            <p className="text-slate-300 text-sm">Preview videos and media directly in modal</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🧪 Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Drag & Drop Testing:</h3>
              <ul className="space-y-1">
                <li>• Open the sample course (3 lessons included)</li>
                <li>• Go to the "Lessons" tab</li>
                <li>• Drag lessons by the grip handle to reorder</li>
                <li>• Notice the visual feedback and animations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Auto-Save Testing:</h3>
              <ul className="space-y-1">
                <li>• Edit course details (title, description)</li>
                <li>• Watch the auto-save status in the header</li>
                <li>• Status changes: Saving → Auto-saved</li>
                <li>• Check console for save events</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Bulk Operations:</h3>
              <ul className="space-y-1">
                <li>• Select multiple lessons using checkboxes</li>
                <li>• Use "Select All" / "Deselect All" controls</li>
                <li>• Try "Duplicate" and "Delete" bulk actions</li>
                <li>• Notice the selection counters</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Media Preview:</h3>
              <ul className="space-y-1">
                <li>• Click the eye icon next to lessons</li>
                <li>• Preview videos in the modal popup</li>
                <li>• Test "Edit Lesson" and "Open in New Tab"</li>
                <li>• Try different media types</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Saved Courses Display */}
        {savedCourses.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">📚 Saved Courses</h2>
            <div className="grid gap-4">
              {savedCourses.map(course => (
                <div key={course.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <p className="text-slate-400 text-sm">{course.lessons?.length || 0} lessons • {course.duration}</p>
                    </div>
                    <button
                      onClick={() => editExistingCourse(course)}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Course Creator Modal */}
      {showCreator && (
        <EnhancedCourseCreator
          course={editCourse}
          isOpen={showCreator}
          onClose={() => {
            setShowCreator(false);
            setEditCourse(null);
          }}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
}