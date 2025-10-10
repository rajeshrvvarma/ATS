/**
 * Quiz Component - Interactive quiz taking interface
 * Supports multiple question types with real-time scoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Trophy,
  Target,
  Brain,
  AlertCircle,
  Book
} from 'lucide-react';

const Quiz = ({ 
  quiz, 
  onComplete, 
  onClose,
  userId,
  userEmail
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 600); // Default 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle time up
  const handleTimeUp = useCallback(async () => {
    if (showResults) return;
    
    console.log('⏰ Time up! Auto-submitting quiz...');
    await handleSubmitQuiz();
  }, [showResults, answers]);

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit || 600);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // Navigate questions
  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    setLoading(true);
    
    try {
      // Import quiz service dynamically to avoid circular imports
      const { submitQuizAttempt } = await import('@/services/quizService.js');
      
      const result = await submitQuizAttempt(quiz.id, userId, answers, userEmail);
      
      if (result.success) {
        setQuizResults(result.data);
        setShowResults(true);

        // Update gamification stats
        try {
          const { updateQuizStats } = await import('@/services/gamificationService.js');
          await updateQuizStats(userEmail, { score: result.data.score });
        } catch (gamificationError) {
          console.error('Error updating gamification stats:', gamificationError);
          // Continue even if gamification fails
        }
        
        // Call completion callback
        if (onComplete) {
          onComplete(result.data);
        }
      } else {
        throw new Error(result.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit || 600);
    setQuizStarted(false);
    setShowResults(false);
    setQuizResults(null);
  };

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full border border-slate-700"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-slate-300 text-lg">{quiz.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalQuestions}</div>
              <div className="text-slate-300 text-sm">Questions</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatTime(quiz.timeLimit || 600)}</div>
              <div className="text-slate-300 text-sm">Time Limit</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{quiz.passingScore || 70}%</div>
              <div className="text-slate-300 text-sm">Passing Score</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Book className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white capitalize">{quiz.difficulty}</div>
              <div className="text-slate-300 text-sm">Difficulty</div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-300">
                <div className="font-semibold mb-1">Instructions:</div>
                <ul className="space-y-1 text-amber-200">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions during the quiz</li>
                  <li>• Submit before time runs out to save your answers</li>
                  <li>• Once submitted, you cannot change your answers</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Start Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 bg-slate-700 text-slate-300 font-semibold py-4 rounded-lg hover:bg-slate-600 transition-colors duration-300"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz results screen
  if (showResults && quizResults) {
    const { score, totalQuestions, percentage, passed, results } = quizResults;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700 mb-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`}>
                {passed ? <Trophy className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {passed ? 'Congratulations!' : 'Good Effort!'}
              </h2>
              <p className="text-slate-300 text-lg">
                {passed ? 'You passed the quiz!' : 'Keep studying and try again!'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{score}/{totalQuestions}</div>
                <div className="text-slate-300">Correct Answers</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage}%
                </div>
                <div className="text-slate-300">Final Score</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{quiz.passingScore}%</div>
                <div className="text-slate-300">Required to Pass</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestartQuiz}
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="bg-slate-700 text-slate-300 font-semibold px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>

          {/* Detailed Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Review Your Answers</h3>
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.questionId}
                  className={`border rounded-lg p-6 ${
                    result.isCorrect 
                      ? 'border-green-700/50 bg-green-900/20' 
                      : 'border-red-700/50 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex-1">
                      Question {index + 1}: {result.question}
                    </h4>
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Your Answer:</div>
                      <div className={`text-sm font-medium ${
                        result.isCorrect ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {quiz.questions[index]?.options?.[result.userAnswer] || result.userAnswer}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Correct Answer:</div>
                      <div className="text-sm font-medium text-green-300">
                        {quiz.questions[index]?.options?.[result.correctAnswer] || result.correctAnswer}
                      </div>
                    </div>
                  </div>
                  
                  {result.explanation && (
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Explanation:</div>
                      <div className="text-sm text-slate-300">{result.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz taking interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                timeLeft < 60 ? 'bg-red-900/50 text-red-300' : 'bg-slate-700 text-slate-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-slate-300 text-sm">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                    answers[currentQuestion.id] === index
                      ? 'border-indigo-500 bg-indigo-900/30 text-indigo-300'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-slate-500'
                    }`}>
                      {answers[currentQuestion.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : answers[quiz.questions[index].id] !== undefined
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {currentQuestionIndex === totalQuestions - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitQuiz}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;