/**
 * Leaderboard - Competitive ranking system for students
 * Shows top performers across different metrics with filtering and user positioning
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Target, 
  Brain, 
  Zap, 
  Star,
  TrendingUp,
  User,
  Award,
  X,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const Leaderboard = ({ onClose }) => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('points');
  const [refreshing, setRefreshing] = useState(false);

  // Leaderboard categories
  const categories = [
    { 
      id: 'points', 
      label: 'Points', 
      icon: Star, 
      color: 'text-yellow-400',
      description: 'Total points earned'
    },
    { 
      id: 'xp', 
      label: 'Experience', 
      icon: Zap, 
      color: 'text-purple-400',
      description: 'Total XP accumulated'
    },
    { 
      id: 'level', 
      label: 'Level', 
      icon: Crown, 
      color: 'text-indigo-400',
      description: 'Current user level'
    },
    { 
      id: 'streak', 
      label: 'Streak', 
      icon: TrendingUp, 
      color: 'text-orange-400',
      description: 'Longest learning streak'
    },
    { 
      id: 'quizzes', 
      label: 'Quizzes', 
      icon: Brain, 
      color: 'text-green-400',
      description: 'Quizzes completed'
    }
  ];

  // Load leaderboard data
  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const { getLeaderboard, getUserRank } = await import('@/services/gamificationService.js');
      
      // Get leaderboard data
      const leaderboardResult = await getLeaderboard(selectedCategory, 20);
      if (leaderboardResult.success) {
        setLeaderboardData(leaderboardResult.data);
      }

      // Get user rank if logged in
      if (user?.email) {
        const rankResult = await getUserRank(user.email, selectedCategory);
        if (rankResult.success) {
          setUserRank(rankResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  // Get value for display based on category
  const getDisplayValue = (userData, category) => {
    switch (category) {
      case 'points':
        return userData.totalPoints?.toLocaleString() || '0';
      case 'xp':
        return userData.totalXP?.toLocaleString() || '0';
      case 'level':
        return userData.level || '1';
      case 'streak':
        return userData.longestStreak || '0';
      case 'quizzes':
        return userData.statistics?.quizzesCompleted || '0';
      default:
        return '0';
    }
  };

  // Get rank styling
  const getRankStyling = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20',
          border: 'border-yellow-400/50',
          text: 'text-yellow-400',
          icon: Crown,
          glow: 'shadow-yellow-400/20'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-r from-slate-400/20 to-slate-500/20',
          border: 'border-slate-400/50',
          text: 'text-slate-300',
          icon: Medal,
          glow: 'shadow-slate-400/20'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-r from-amber-600/20 to-amber-700/20',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          icon: Award,
          glow: 'shadow-amber-400/20'
        };
      default:
        return {
          bg: 'bg-slate-800/50',
          border: 'border-slate-700',
          text: 'text-slate-300',
          icon: User,
          glow: 'shadow-slate-700/20'
        };
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const CategoryIcon = currentCategory?.icon || Star;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              <p className="text-indigo-100">Compete with fellow students</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Category Filter */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-medium">Category</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-white' : category.color}`} />
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Rank Display */}
        {user && userRank && (
          <div className="p-4 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your Rank:</span>
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">
                  #{userRank.rank} of {userRank.total}
                </span>
                <CategoryIcon className={`w-4 h-4 ${currentCategory.color}`} />
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-slate-400">Loading leaderboard...</p>
              </div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No Rankings Yet</h3>
              <p className="text-slate-500">Be the first to earn points and climb the leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {leaderboardData.map((userData, index) => {
                  const styling = getRankStyling(userData.rank);
                  const RankIcon = styling.icon;
                  const isCurrentUser = user?.email === userData.userEmail;
                  
                  return (
                    <motion.div
                      key={`${userData.userEmail}-${selectedCategory}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${
                        styling.bg
                      } ${styling.border} ${styling.glow} ${
                        isCurrentUser ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rank Badge */}
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            userData.rank <= 3 ? styling.bg : 'bg-slate-700'
                          } border ${styling.border}`}>
                            {userData.rank <= 3 ? (
                              <RankIcon className={`w-6 h-6 ${styling.text}`} />
                            ) : (
                              <span className={`font-bold ${styling.text}`}>
                                #{userData.rank}
                              </span>
                            )}
                          </div>

                          {/* User Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${
                                isCurrentUser ? 'text-indigo-300' : 'text-white'
                              }`}>
                                {userData.displayName}
                                {isCurrentUser && (
                                  <span className="text-xs text-indigo-400 ml-2">(You)</span>
                                )}
                              </h3>
                              <div className="text-xs text-slate-400">
                                Level {userData.level}
                              </div>
                            </div>
                            <div className="text-sm text-slate-400">
                              {userData.achievements?.length || 0} achievements
                            </div>
                          </div>
                        </div>

                        {/* Score Display */}
                        <div className="text-right">
                          <div className={`text-xl font-bold ${styling.text}`}>
                            {getDisplayValue(userData, selectedCategory)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {currentCategory?.description}
                          </div>
                        </div>
                      </div>

                      {/* Achievement Badges */}
                      {userData.achievements && userData.achievements.length > 0 && (
                        <div className="mt-3 flex gap-1 overflow-x-auto">
                          {userData.achievements.slice(0, 5).map((achievementId, idx) => (
                            <div
                              key={achievementId}
                              className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0"
                              title={`Achievement: ${achievementId}`}
                            >
                              <Award className="w-3 h-3 text-yellow-400" />
                            </div>
                          ))}
                          {userData.achievements.length > 5 && (
                            <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs text-slate-300">
                              +{userData.achievements.length - 5}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="text-center text-sm text-slate-400">
            Rankings update in real-time • Compete fairly and have fun! 🏆
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;