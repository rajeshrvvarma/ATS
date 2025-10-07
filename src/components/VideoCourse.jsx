import React, { useState, useEffect } from 'react';
import { Play, Lock, CheckCircle, Clock, Download, BookOpen } from 'lucide-react';
import VideoLesson from './VideoLesson';

/**
 * VideoCourse Component - Course structure with video lessons
 * Manages course progress and lesson navigation
 */
export default function VideoCourse({ course, onCourseComplete }) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [courseProgress, setCourseProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Load course progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course_progress_${course.id}`);
    if (savedProgress) {
      const { completedLessons: saved, courseProgress: progress } = JSON.parse(savedProgress);
      setCompletedLessons(new Set(saved));
      setCourseProgress(progress);
    }
    
    // Check enrollment status
    const enrollment = localStorage.getItem(`enrollment_${course.id}`);
    setIsEnrolled(enrollment === 'true');
  }, [course.id]);

  // Save course progress
  const saveCourseProgress = (completed, progress) => {
    const progressData = {
      completedLessons: Array.from(completed),
      courseProgress: progress,
      lastUpdated: Date.now()
    };
    localStorage.setItem(`course_progress_${course.id}`, JSON.stringify(progressData));
  };

  // Handle lesson completion
  const handleLessonComplete = (lesson) => {
    const newCompleted = new Set([...completedLessons, lesson.id]);
    setCompletedLessons(newCompleted);
    
    const progress = (newCompleted.size / course.lessons.length) * 100;
    setCourseProgress(progress);
    
    saveCourseProgress(newCompleted, progress);
    
    // Check if course is completed
    if (progress >= 100) {
      onCourseComplete?.(course);
    }
  };

  // Handle lesson progress
  const handleLessonProgress = (progress) => {
    // You can add additional progress tracking here
  };

  // Check if lesson is unlocked
  const isLessonUnlocked = (lessonIndex) => {
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    return completedLessons.has(course.lessons[lessonIndex - 1].id);
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Calculate total course duration
  const totalDuration = course.lessons.reduce((total, lesson) => {
    const duration = lesson.duration || '0:00';
    const [minutes, seconds] = duration.split(':').map(Number);
    return total + (minutes * 60) + seconds;
  }, 0);

  if (!isEnrolled) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{course.title}</h2>
        <p className="text-slate-300 mb-6">{course.description}</p>
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Course Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons.length} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setIsEnrolled(true);
            localStorage.setItem(`enrollment_${course.id}`, 'true');
          }}
          className="bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300"
        >
          Enroll in Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          <div className="text-right">
            <div className="text-sm text-slate-400">Course Progress</div>
            <div className="text-lg font-semibold text-sky-400">{Math.round(courseProgress)}%</div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${courseProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{completedLessons.size} of {course.lessons.length} lessons completed</span>
          <span>{formatDuration(totalDuration)} total duration</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Lessons</h3>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isUnlocked = isLessonUnlocked(index);
                const isCompleted = completedLessons.has(lesson.id);
                const isCurrent = index === currentLesson;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => isUnlocked && setCurrentLesson(index)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isCurrent 
                        ? 'bg-sky-600 text-white' 
                        : isUnlocked 
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                          : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : isUnlocked ? (
                        <Play className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <Lock className="w-5 h-5 flex-shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{lesson.title}</div>
                        <div className="text-xs opacity-75">{lesson.duration}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Lesson */}
        <div className="lg:col-span-2">
          {course.lessons[currentLesson] && (
            <VideoLesson
              lesson={course.lessons[currentLesson]}
              onProgress={handleLessonProgress}
              onComplete={handleLessonComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}