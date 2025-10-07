import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Trophy, Award, Download, Play } from 'lucide-react';
import VideoCourse from '@/components/VideoCourse';
import { loadCourses } from '@/services/courseService.js';
import { useToast } from '@/context/ToastContext.jsx';

/**
 * VideoLearningPage - Main page for video-based learning
 * Displays available courses and manages course enrollment
 */
export default function VideoLearningPage({ onNavigate }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(new Set());
  const [list, setList] = useState(loadCourses());
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
          <h1 className="text-4xl font-bold text-white mb-4">Video Learning Center</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Master cybersecurity through our comprehensive video-based training programs. 
            Learn at your own pace with expert-led content and hands-on labs.
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
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose Our Video Learning?</h2>
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
    </div>
  );
}