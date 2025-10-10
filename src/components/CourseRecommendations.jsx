/**
 * Course Recommendations Component
 * Displays intelligent course recommendations based on user analytics and learning patterns
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Users, 
  Star, 
  Clock,
  BarChart3,
  ChevronRight,
  X,
  BookOpen,
  Award,
  Zap,
  RefreshCw,
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const CourseRecommendations = ({ onClose, onCourseSelect }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async (options = {}) => {
    setLoading(true);
    try {
      const { getCourseRecommendations } = await import('@/services/recommendationService.js');
      const result = await getCourseRecommendations(user.email, {
        maxRecommendations: 8,
        includeCompleted: false,
        ...options
      });
      
      if (result.success) {
        setRecommendations(result.data.recommendations);
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
  };

  const filterRecommendations = (filter) => {
    setActiveFilter(filter);
    
    const filterOptions = {
      'all': {},
      'beginner': { focusArea: 'workshop' },
      'defensive': { focusArea: 'defensive' },
      'offensive': { focusArea: 'offensive' },
      'high-confidence': {}
    };
    
    if (filter === 'high-confidence') {
      return recommendations.filter(rec => rec.confidence >= 80);
    }
    
    if (filterOptions[filter].focusArea) {
      loadRecommendations(filterOptions[filter]);
    }
  };

  const getAlgorithmIcon = (algorithm) => {
    const icons = {
      'skill-based': Target,
      'performance-based': TrendingUp,
      'difficulty-progression': BarChart3,
      'category-affinity': Star,
      'peer-collaborative': Users,
      'ai-personalized': Brain
    };
    return icons[algorithm] || BookOpen;
  };

  const getAlgorithmColor = (algorithm) => {
    const colors = {
      'skill-based': 'text-red-400',
      'performance-based': 'text-green-400',
      'difficulty-progression': 'text-blue-400',
      'category-affinity': 'text-yellow-400',
      'peer-collaborative': 'text-purple-400',
      'ai-personalized': 'text-cyan-400'
    };
    return colors[algorithm] || 'text-gray-400';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-blue-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty?.includes('Beginner')) return 'bg-green-500/20 text-green-400';
    if (difficulty?.includes('Intermediate')) return 'bg-yellow-500/20 text-yellow-400';
    if (difficulty?.includes('Advanced')) return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Analyzing your learning profile...</p>
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
            <div className="p-3 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-lg">
              <Target className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Course Recommendations</h2>
              <p className="text-slate-400">Personalized suggestions based on your learning profile</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshRecommendations}
              disabled={refreshing}
              className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="p-6 border-b border-slate-700 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-400">{summary.userLevel}</div>
                <div className="text-sm text-slate-400">Your Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{summary.strongestCategory}</div>
                <div className="text-sm text-slate-400">Strongest Area</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{recommendations.length}</div>
                <div className="text-sm text-slate-400">Recommendations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{summary.totalAnalyzed}</div>
                <div className="text-sm text-slate-400">Courses Analyzed</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-slate-300 text-sm">{summary.nextMilestone}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 p-6 border-b border-slate-700 overflow-x-auto">
          {[
            { id: 'all', label: 'All Recommendations', icon: Target },
            { id: 'high-confidence', label: 'High Confidence', icon: Star },
            { id: 'beginner', label: 'Beginner Friendly', icon: BookOpen },
            { id: 'defensive', label: 'Defensive Security', icon: Award },
            { id: 'offensive', label: 'Offensive Security', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => filterRecommendations(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Recommendations Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your filters or complete more courses to get personalized recommendations.</p>
              <button
                onClick={() => filterRecommendations('all')}
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
              >
                Show All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeFilter === 'high-confidence' ? 
                recommendations.filter(rec => rec.confidence >= 80) : 
                recommendations
              ).map((recommendation, index) => {
                const AlgorithmIcon = getAlgorithmIcon(recommendation.algorithm);
                
                return (
                  <motion.div
                    key={recommendation.course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all group"
                  >
                    {/* Course Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {recommendation.course.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {recommendation.course.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className={`p-2 rounded-lg ${getAlgorithmColor(recommendation.algorithm)} bg-current/20`}>
                          <AlgorithmIcon className={`w-4 h-4 ${getAlgorithmColor(recommendation.algorithm)}`} />
                        </div>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.course.difficulty)}`}>
                        {recommendation.course.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {recommendation.course.duration}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <BookOpen className="w-4 h-4" />
                        {recommendation.course.lessons?.length || 5} lessons
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Confidence:</span>
                        <span className={`font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                          {Math.round(recommendation.confidence)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <span>Est. completion:</span>
                        <span className="text-white">{recommendation.metadata?.estimatedCompletionTime || 5} days</span>
                      </div>
                    </div>

                    {/* Recommendation Reasons */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Why we recommend this:</h4>
                      <ul className="space-y-1">
                        {recommendation.reasons.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 mt-0.5 text-sky-400 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onCourseSelect && onCourseSelect(recommendation.course)}
                      className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      Start Learning
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseRecommendations;