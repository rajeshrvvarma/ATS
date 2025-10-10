/**
 * Quiz Library - Browse and select available quizzes
 * Displays quiz categories, difficulty levels, and user progress
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Target, 
  Trophy, 
  Play, 
  Book, 
  Shield, 
  Zap,
  Eye,
  Lock,
  Search,
  Filter,
  Star,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import Quiz from './Quiz.jsx';
import QuizAnalytics from './QuizAnalytics.jsx';
import { useAuth } from '@/context/AuthContext.jsx';

const QuizLibrary = ({ onClose }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Category icons mapping
  const categoryIcons = {
    'defensive-security': Shield,
    'ethical-hacking': Zap,
    'soc-fundamentals': Eye,
    'network-security': Lock,
    'malware-analysis': Brain,
    'incident-response': Target,
    'penetration-testing': Book,
    'general-security': Star
  };

  // Difficulty colors
  const difficultyColors = {
    beginner: 'from-green-500 to-emerald-500',
    intermediate: 'from-yellow-500 to-orange-500',
    advanced: 'from-red-500 to-rose-500'
  };

  // Load quizzes and user progress
  useEffect(() => {
    loadQuizzes();
  }, [user]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const { getAvailableQuizzes, getUserQuizProgress, createSampleQuizzes } = await import('@/services/quizService.js');
      
      // Try to get existing quizzes
      let quizzesResult = await getAvailableQuizzes();
      
      // If no quizzes exist, create sample ones
      if (quizzesResult.success && quizzesResult.data.length === 0) {
        console.log('No quizzes found, creating sample quizzes...');
        await createSampleQuizzes();
        quizzesResult = await getAvailableQuizzes();
      }
      
      if (quizzesResult.success) {
        setQuizzes(quizzesResult.data);
      }
      
      // Load user progress
      if (user?.email) {
        const progressResult = await getUserQuizProgress(user.email);
        if (progressResult.success) {
          setUserProgress(progressResult.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user progress for a specific quiz
  const getQuizProgress = (quizId) => {
    return userProgress.find(progress => progress.quizId === quizId);
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Handle quiz selection
  const handleQuizSelect = async (quiz) => {
    setLoading(true);
    try {
      const { getQuizById } = await import('@/services/quizService.js');
      const result = await getQuizById(quiz.id);
      
      if (result.success) {
        setSelectedQuiz(result.data);
        setShowQuiz(true);
      } else {
        throw new Error(result.error || 'Failed to load quiz');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setShowQuiz(false);
    setSelectedQuiz(null);
    // Reload user progress
    loadQuizzes();
  };

  // Handle quiz close
  const handleQuizClose = () => {
    setShowQuiz(false);
    setSelectedQuiz(null);
  };

  // Show quiz component
  if (showQuiz && selectedQuiz) {
    return (
      <Quiz
        quiz={selectedQuiz}
        userId={user?.email || 'anonymous'}
        userEmail={user?.email || 'anonymous@example.com'}
        onComplete={handleQuizComplete}
        onClose={handleQuizClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Library</h1>
          <p className="text-xl text-slate-300">Test your cybersecurity knowledge</p>
          
          {/* Analytics Button */}
          {user && (
            <div className="mt-6">
              <button
                onClick={() => setShowAnalytics(true)}
                className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <BarChart3 className="w-5 h-5" />
                View My Analytics
              </button>
            </div>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="defensive-security">Defensive Security</option>
                <option value="ethical-hacking">Ethical Hacking</option>
                <option value="soc-fundamentals">SOC Fundamentals</option>
                <option value="network-security">Network Security</option>
                <option value="malware-analysis">Malware Analysis</option>
                <option value="incident-response">Incident Response</option>
                <option value="penetration-testing">Penetration Testing</option>
                <option value="general-security">General Security</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <Target className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
            <p className="text-slate-300 mt-4">Loading quizzes...</p>
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => {
              const IconComponent = categoryIcons[quiz.category] || Book;
              const progress = getQuizProgress(quiz.id);
              
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  {/* Quiz Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${difficultyColors[quiz.difficulty]} bg-opacity-20`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {progress && progress.completed && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold">
                          <Trophy className="w-3 h-3" />
                          Completed
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Quiz Stats */}
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{quiz.questionsCount || quiz.questions?.length || 'N/A'}</div>
                        <div className="text-xs text-slate-400">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {quiz.timeLimit ? Math.floor(quiz.timeLimit / 60) : 'N/A'}m
                        </div>
                        <div className="text-xs text-slate-400">Time Limit</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyColors[quiz.difficulty]} text-white`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </div>
                      <div className="text-xs text-slate-400">
                        Pass: {quiz.passingScore || 70}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Best Score</span>
                          <span>{progress.bestScore}%</span>
                        </div>
                        <div className="bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress.bestScore}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizSelect(quiz)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {progress?.completed ? 'Retake Quiz' : 'Start Quiz'}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No Quizzes Found</h3>
            <p className="text-slate-500">
              {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                ? 'Try adjusting your search filters.'
                : 'Check back later for new quizzes.'}
            </p>
          </motion.div>
        )}

        {/* Close Button */}
        <div className="fixed top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-slate-800 text-slate-300 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-300 border border-slate-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Quiz Analytics Modal */}
      {showAnalytics && (
        <QuizAnalytics onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  );
};

export default QuizLibrary;