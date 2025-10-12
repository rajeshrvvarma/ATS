import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Trophy, Award, Download, Play, FileText, Brain } from 'lucide-react';
import VideoCourse from '@/components/VideoCourse';
import TranscriptManager from '@/components/TranscriptManager';
import AIContentDashboard from '@/components/ai/AIContentDashboard';
import { loadCourses } from '@/services/courseService.js';
import { useToast } from '@/context/ToastContext.jsx';

/**
 * LearningManagementSystemPage - Main page for comprehensive learning management
 * Displays available courses, manages course enrollment, and provides LMS functionality
 */
export default function LearningManagementSystemPage({ onNavigate }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(new Set());
  const [list, setList] = useState(loadCourses());
  const [showTranscriptManager, setShowTranscriptManager] = useState(false);
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const location = useLocation();
  const { notify } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('course');
    if (courseId) {
      setSelectedCourse(courseId);
    }
  }, [location.search]);

  // Handle course completion
  const handleCourseComplete = (course) => {
    setCompletedCourses(prev => new Set([...prev, course.id]));
    
    // Show completion modal or notification
    notify(`You've completed ${course.title}!`, 'success');
  };

  // If a course is selected, show the course view
  if (selectedCourse) {
    const course = list.find(c => c.id === selectedCourse);
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
          
          <VideoCourse 
            course={course} 
            onCourseComplete={handleCourseComplete}
          />
        </div>
      </div>
    );
  }

  // Show course selection
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl font-bold text-white">Learning Portal - Video Library</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTranscriptManager(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Manage Transcripts
              </button>
              <button
                onClick={() => setShowAIDashboard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Brain className="w-4 h-4" />
                AI Content Dashboard
              </button>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Access our complete video library and course resources. Watch lessons, download materials, and learn at your own pace.
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            💡 Track your progress and manage enrollments in your <button onClick={() => onNavigate('dashboard')} className="text-blue-400 hover:text-blue-300 underline">Student Dashboard</button>
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {list.map((course) => {
            const isCompleted = completedCourses.has(course.id);
            const isEnrolled = localStorage.getItem(`enrollment_${course.id}`) === 'true';
            
            return (
              <div key={course.id} className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-all duration-300 transform hover:-translate-y-1">
                {/* Course Thumbnail */}
                <div className="relative">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-700 animate-pulse" />
                  )}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                  {isEnrolled && !isCompleted && (
                    <div className="absolute top-4 left-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Enrolled
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {course.price}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-slate-300 mb-4">{course.description}</p>
                  
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Award className="w-4 h-4" />
                      <span>{course.lessons.length} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Download className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedCourse(course.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : isEnrolled
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                    }`}
                  >
                    {isCompleted ? 'Review Course' : isEnrolled ? 'Continue Learning' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose Our Learning Management System?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Self-Paced Learning</h3>
              <p className="text-slate-400">Learn at your own speed with pause, rewind, and replay capabilities.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-slate-400">Track your learning progress and earn certificates upon completion.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Downloadable Resources</h3>
              <p className="text-slate-400">Access course materials, guides, and resources for offline study.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Manager Modal */}
      {showTranscriptManager && (
        <TranscriptManager onClose={() => setShowTranscriptManager(false)} />
      )}

      {/* AI Content Dashboard Modal */}
      {showAIDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">AI Content Dashboard</h2>
              <button
                onClick={() => setShowAIDashboard(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <AIContentDashboard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}