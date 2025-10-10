/**
 * Quiz Analytics - Advanced analytics dashboard for quiz performance
 * Shows detailed insights, performance trends, and learning recommendations
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Brain,
  Star,
  ChevronRight,
  Calendar,
  Users,
  Zap,
  Award,
  BookOpen,
  X,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const QuizAnalytics = ({ onClose }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (user?.email) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { getUserQuizAnalytics } = await import('@/services/quizService.js');
      const result = await getUserQuizAnalytics(user.email, timeRange);
      
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 80) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 70) return { level: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Quiz Analytics</h2>
              <p className="text-slate-400">Detailed performance insights and learning recommendations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Time Range:</span>
            <div className="flex gap-2">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: 'all', label: 'All Time' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === value
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'categories', label: 'Categories', icon: Target },
            { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!analytics ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Quiz Data Yet</h3>
              <p className="text-slate-400 mb-6">Take some quizzes to see your analytics here!</p>
              <button
                onClick={onClose}
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
              >
                Browse Quizzes
              </button>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">{analytics.totalQuizzes || 0}</span>
                      </div>
                      <h3 className="text-slate-400 text-sm">Quizzes Taken</h3>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                          <Trophy className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">{analytics.averageScore || 0}%</span>
                      </div>
                      <h3 className="text-slate-400 text-sm">Average Score</h3>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                          <Clock className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">{analytics.totalTimeSpent || 0}m</span>
                      </div>
                      <h3 className="text-slate-400 text-sm">Time Spent</h3>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                          <Award className="w-6 h-6 text-yellow-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">{analytics.passedQuizzes || 0}</span>
                      </div>
                      <h3 className="text-slate-400 text-sm">Quizzes Passed</h3>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Quiz Activity</h3>
                    <div className="space-y-3">
                      {analytics.recentAttempts?.slice(0, 5).map((attempt, index) => {
                        const performance = getPerformanceLevel(attempt.percentage);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-sky-500/20 rounded-lg">
                                <Brain className="w-4 h-4 text-sky-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{attempt.quizTitle}</p>
                                <p className="text-slate-400 text-sm">
                                  {new Date(attempt.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-lg font-bold ${performance.color}`}>
                                {attempt.percentage}%
                              </span>
                              <p className={`text-xs px-2 py-1 rounded-full ${performance.bg} ${performance.color}`}>
                                {performance.level}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-slate-400">Performance chart visualization would go here</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Best Scores</h3>
                      <div className="space-y-3">
                        {analytics.bestScores?.map((score, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-slate-300">{score.quizTitle}</span>
                            <span className="text-green-400 font-bold">{score.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Improvement Areas</h3>
                      <div className="space-y-3">
                        {analytics.improvementAreas?.map((area, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-slate-300">{area.category}</span>
                            <span className="text-yellow-400 font-bold">{area.averageScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics.categoryPerformance?.map((category, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-sky-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-sky-400" />
                          </div>
                          <h3 className="text-white font-semibold">{category.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Average Score</span>
                            <span className="text-white font-bold">{category.averageScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Quizzes Taken</span>
                            <span className="text-white">{category.quizzesTaken}</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-sky-500 h-2 rounded-full" 
                              style={{ width: `${category.averageScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-sky-500/20 to-blue-600/20 border border-sky-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                      {analytics.recommendations?.map((rec, index) => (
                        <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-sky-500/20 rounded-lg mt-1">
                              <ChevronRight className="w-4 h-4 text-sky-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">{rec.title}</h4>
                              <p className="text-slate-300 text-sm mb-2">{rec.description}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {rec.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizAnalytics;