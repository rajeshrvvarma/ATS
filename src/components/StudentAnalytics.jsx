/**
 * Student Analytics - Personal learning insights and progress analytics
 * Shows individual student progress, strengths, areas for improvement, and learning patterns
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Clock, 
  Calendar,
  Star,
  Award,
  BarChart3,
  Activity,
  BookOpen,
  Zap,
  Trophy,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const StudentAnalytics = ({ onClose }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'strengths', label: 'Strengths', icon: Star },
    { id: 'learning-path', label: 'Learning Path', icon: Activity }
  ];

  useEffect(() => {
    if (user?.email) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { getUserStats } = await import('@/services/gamificationService.js');
      const { getLearningPathAnalytics } = await import('@/services/analyticsService.js');
      
      // Get gamification stats
      const statsResult = await getUserStats(user.email);
      if (statsResult.success) {
        setAnalytics(statsResult.data);
      }

      // Get learning path analytics
      const pathResult = await getLearningPathAnalytics(user.email);
      if (pathResult.success) {
        setLearningPath(pathResult.data);
      }
    } catch (error) {
      console.error('Error loading student analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const ProgressCard = ({ title, current, total, color = 'blue', icon: Icon, subtitle }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{current}</div>
            {total && <div className="text-slate-400 text-sm">of {total}</div>}
          </div>
        </div>
        
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        {subtitle && <p className="text-slate-400 text-sm mb-3">{subtitle}</p>}
        
        {total && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-full rounded-full`}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level & XP Overview */}
      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Level {analytics?.level || 1}</h2>
              <p className="text-purple-300">{analytics?.levelInfo?.currentLevel?.title || 'Novice Explorer'}</p>
            </div>
          </div>
          
          {analytics?.rank && (
            <div className="text-right">
              <div className="text-sm text-slate-400">Your Rank</div>
              <div className="text-xl font-bold text-purple-400">#{analytics.rank}</div>
              <div className="text-xs text-slate-500">of {analytics.totalUsers} students</div>
            </div>
          )}
        </div>
        
        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Experience Points</span>
            <span>{analytics?.totalXP?.toLocaleString() || '0'} XP</span>
          </div>
          <div className="bg-slate-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analytics?.levelInfo?.progressToNext || 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
            />
          </div>
          {analytics?.levelInfo?.xpToNext > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {analytics.levelInfo.xpToNext} XP to Level {analytics.level + 1}
            </p>
          )}
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="Total Points"
          current={analytics?.totalPoints?.toLocaleString() || '0'}
          icon={Star}
          color="yellow"
          subtitle="Earned from activities"
        />
        
        <ProgressCard
          title="Learning Streak"
          current={analytics?.currentStreak || 0}
          total={analytics?.longestStreak || 0}
          icon={TrendingUp}
          color="orange"
          subtitle={`Best: ${analytics?.longestStreak || 0} days`}
        />
        
        <ProgressCard
          title="Quizzes Completed"
          current={analytics?.statistics?.quizzesCompleted || 0}
          icon={Brain}
          color="green"
          subtitle="Knowledge assessments"
        />
        
        <ProgressCard
          title="Achievements"
          current={analytics?.achievements?.length || 0}
          total={8} // Total available achievements
          icon={Award}
          color="purple"
          subtitle="Milestones unlocked"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Learning Activity</h3>
        <div className="space-y-3">
          {learningPath?.learningPath?.slice(0, 8).map((event, index) => {
            const getEventIcon = (eventType) => {
              switch (eventType) {
                case 'quiz_complete': return Brain;
                case 'course_completion': return BookOpen;
                case 'achievement_unlock': return Award;
                case 'level_up': return Trophy;
                default: return Activity;
              }
            };
            
            const getEventColor = (eventType) => {
              switch (eventType) {
                case 'quiz_complete': return 'text-blue-400';
                case 'course_completion': return 'text-green-400';
                case 'achievement_unlock': return 'text-yellow-400';
                case 'level_up': return 'text-purple-400';
                default: return 'text-slate-400';
              }
            };
            
            const Icon = getEventIcon(event.eventType);
            const colorClass = getEventColor(event.eventType);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <Icon className={`w-5 h-5 ${colorClass}`} />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">
                    {event.eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {event.timestamp ? new Date(event.timestamp.toDate()).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Study Time Analysis */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Study Time Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {Object.values(learningPath?.timeSpent || {}).reduce((sum, time) => sum + time, 0) || 0}m
            </div>
            <div className="text-slate-400 text-sm">Total Study Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {learningPath?.learningStreak || 0}
            </div>
            <div className="text-slate-400 text-sm">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {Object.keys(learningPath?.skillProgress || {}).length}
            </div>
            <div className="text-slate-400 text-sm">Skills Practiced</div>
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Skill Development</h3>
        <div className="space-y-4">
          {Object.entries(learningPath?.skillProgress || {}).map(([skill, progress]) => {
            const maxEvents = Math.max(...Object.values(learningPath?.skillProgress || {}).map(p => p.events));
            const percentage = maxEvents > 0 ? (progress.events / maxEvents) * 100 : 0;
            
            return (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium capitalize">
                    {skill.replace('-', ' ')}
                  </span>
                  <span className="text-slate-400 text-sm">{progress.events} activities</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Last activity: {progress.lastActivity ? 
                    new Date(progress.lastActivity.toDate()).toLocaleDateString() : 'Never'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStrengths = () => (
    <div className="space-y-6">
      {/* Achievements Showcase */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Your Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics?.achievements?.map((achievementId, index) => (
            <motion.div
              key={achievementId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-semibold capitalize">
                    {achievementId.replace('_', ' ')}
                  </div>
                  <div className="text-yellow-300 text-sm">Achievement Unlocked</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {(!analytics?.achievements || analytics.achievements.length === 0) && (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-400 mb-2">No Achievements Yet</h4>
            <p className="text-slate-500">Complete quizzes and courses to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-white">Quiz Performance</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {analytics?.statistics?.quizzesCompleted || 0} completed
              </div>
              <div className="text-slate-400 text-sm">Keep it up!</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white">Learning Consistency</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {analytics?.currentStreak || 0} day streak
              </div>
              <div className="text-slate-400 text-sm">
                {analytics?.currentStreak > 0 ? 'Excellent!' : 'Start your streak today'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Points Earned</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {analytics?.totalPoints?.toLocaleString() || 0} points
              </div>
              <div className="text-slate-400 text-sm">Great progress!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearningPath = () => (
    <div className="space-y-6">
      {/* Learning Timeline */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Your Learning Journey</h3>
        <div className="space-y-4">
          {learningPath?.learningPath?.slice(0, 15).map((event, index) => {
            const isLast = index === Math.min(14, (learningPath?.learningPath?.length || 1) - 1);
            
            return (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  {/* Timeline line */}
                  <div className="relative">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-800" />
                    {!isLast && (
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-px h-8 bg-slate-600" />
                    )}
                  </div>
                  
                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium">
                      {event.eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {event.timestamp ? 
                        new Date(event.timestamp.toDate()).toLocaleString() : 
                        'Recently'
                      }
                    </div>
                    {event.data && Object.keys(event.data).length > 0 && (
                      <div className="text-slate-500 text-xs mt-1">
                        {Object.entries(event.data).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {(!learningPath?.learningPath || learningPath.learningPath.length === 0) && (
          <div className="text-center py-8">
            <Activity className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-400 mb-2">No Activity Yet</h4>
            <p className="text-slate-500">Start learning to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">Loading Your Analytics</h3>
            <p className="text-slate-400">Analyzing your learning progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Learning Analytics</h2>
              <p className="text-indigo-100">Personal insights and progress tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-slate-800 border-b border-slate-700 px-6">
          <div className="flex gap-1 -mb-px">
            {views.map(view => {
              const Icon = view.icon;
              const isActive = activeView === view.id;
              
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'progress' && renderProgress()}
          {activeView === 'strengths' && renderStrengths()}
          {activeView === 'learning-path' && renderLearningPath()}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentAnalytics;