import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  Award,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

/**
 * ProgressTracker - Comprehensive progress tracking for students
 * Shows course progress, lesson completion, time tracking, and goals
 */
export default function ProgressTracker({ studentData, enrollments, onNavigate }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [progressData, setProgressData] = useState({
    dailyProgress: [],
    weeklyGoal: 5, // hours per week
    weeklyProgress: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  useEffect(() => {
    calculateProgressData();
  }, [enrollments]);

  const calculateProgressData = () => {
    // Calculate daily progress for the last 7 days
    const dailyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate daily learning time (in real app, this would come from tracking)
      const hours = Math.random() * 2; // 0-2 hours per day
      dailyProgress.push({
        date: date.toISOString().split('T')[0],
        hours: hours,
        coursesStudied: Math.floor(Math.random() * 3) + 1
      });
    }

    const weeklyProgress = dailyProgress.reduce((sum, day) => sum + day.hours, 0);

    setProgressData({
      dailyProgress,
      weeklyGoal: 5,
      weeklyProgress,
      currentStreak: 3, // Would be calculated from actual data
      longestStreak: 7
    });
  };

  const getCourseProgress = (courseId) => {
    const progress = localStorage.getItem(`course_progress_${courseId}`);
    return progress ? JSON.parse(progress) : { courseProgress: 0, completedLessons: [] };
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-sky-500/20 rounded-lg">
              <Target className="w-6 h-6 text-sky-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {progressData.weeklyProgress.toFixed(1)}h
              </div>
              <div className="text-slate-400 text-sm">of {progressData.weeklyGoal}h goal</div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div 
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((progressData.weeklyProgress / progressData.weeklyGoal) * 100, 100)}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm">
            {((progressData.weeklyProgress / progressData.weeklyGoal) * 100).toFixed(0)}% of weekly goal
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{progressData.currentStreak}</div>
              <div className="text-slate-400 text-sm">day streak</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Longest: {progressData.longestStreak} days
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {enrollments.filter(e => getCourseProgress(e.id)?.courseProgress >= 100).length}
              </div>
              <div className="text-slate-400 text-sm">completed courses</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            {enrollments.length} total enrolled
          </p>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Daily Learning Activity</h3>
        <div className="flex items-end gap-2 h-32">
          {progressData.dailyProgress.map((day, index) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full bg-sky-500 rounded-t-md transition-all duration-300 hover:bg-sky-400"
                  style={{ height: `${(day.hours / 3) * 100}%` }}
                  title={`${day.hours.toFixed(1)} hours`}
                />
              </div>
              <div className="text-xs text-slate-400 mt-2">
                {formatDate(day.date).split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-4">
          <span>0h</span>
          <span>1.5h</span>
          <span>3h</span>
        </div>
      </div>

      {/* Course Progress Details */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Course Progress</h3>
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const progress = getCourseProgress(enrollment.id);
            const isExpanded = expandedCourse === enrollment.id;
            
            return (
              <div key={enrollment.id} className="bg-slate-700 rounded-lg overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => setExpandedCourse(isExpanded ? null : enrollment.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <BookOpen className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{enrollment.title}</h4>
                        <p className="text-slate-400 text-sm">
                          {progress.completedLessons?.length || 0} of {enrollment.lessons?.length || 0} lessons
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getProgressColor(progress.courseProgress)}`}>
                          {progress.courseProgress.toFixed(0)}%
                        </div>
                        <div className="w-24 bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(progress.courseProgress)}`}
                            style={{ width: `${progress.courseProgress}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-slate-600 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">Time Spent</span>
                        </div>
                        <div className="text-white font-semibold">
                          {((enrollment.lessons?.length || 0) * (progress.courseProgress / 100) * 0.5).toFixed(1)}h
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">Performance</span>
                        </div>
                        <div className="text-white font-semibold">
                          {progress.courseProgress >= 80 ? 'Excellent' : 
                           progress.courseProgress >= 60 ? 'Good' : 
                           progress.courseProgress >= 40 ? 'Fair' : 'Needs Work'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Lesson Progress */}
                    <div className="mb-4">
                      <h5 className="text-white font-medium mb-3">Lesson Progress</h5>
                      <div className="space-y-2">
                        {enrollment.lessons?.slice(0, 5).map((lesson, index) => {
                          const isCompleted = progress.completedLessons?.includes(lesson.id);
                          return (
                            <div key={lesson.id} className="flex items-center gap-3 text-sm">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 border border-slate-600 rounded-full" />
                              )}
                              <span className={isCompleted ? 'text-white' : 'text-slate-400'}>
                                {lesson.title}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                              )}
                            </div>
                          );
                        })}
                        {enrollment.lessons?.length > 5 && (
                          <div className="text-slate-400 text-sm">
                            +{enrollment.lessons.length - 5} more lessons
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onNavigate('video-learning') || (window.location.href = `/video-learning?course=${enrollment.id}`)}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue Learning
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Learning Goals</h3>
        <div className="space-y-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Complete Cybersecurity Fundamentals</span>
              <span className="text-sky-400">75%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Earn 3 Certifications This Month</span>
              <span className="text-yellow-400">33%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '33%' }} />
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Maintain 7-Day Learning Streak</span>
              <span className="text-green-400">43%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '43%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}