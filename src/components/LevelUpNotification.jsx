/**
 * Level Up Notification - Shows level up achievements with animations
 * Displays when users reach a new level with their XP progress
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Star, 
  Zap, 
  ChevronUp,
  X,
  Sparkles
} from 'lucide-react';
import { XP_LEVELS } from '@/services/gamificationService.js';

const LevelUpNotification = ({ 
  newLevel, 
  oldLevel, 
  totalXP, 
  onDismiss, 
  isVisible = false 
}) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isVisible && newLevel > oldLevel) {
      setShowNotification(true);
    }
  }, [isVisible, newLevel, oldLevel]);

  const handleClose = () => {
    setShowNotification(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  if (!showNotification || !newLevel) return null;

  const levelInfo = XP_LEVELS.find(l => l.level === newLevel);
  const nextLevelInfo = XP_LEVELS.find(l => l.level === newLevel + 1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Level Up Card */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.3, opacity: 0, rotateY: 180 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 300,
            delay: 0.1
          }}
          className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl shadow-2xl border-2 border-purple-400/50 max-w-lg w-full overflow-hidden relative"
        >
          {/* Animated Background Glow */}
          <motion.div
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 360],
                  y: [0, -30, -60],
                  x: [0, Math.random() * 40 - 20]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
                className="absolute"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${50 + Math.random() * 30}%`
                }}
              >
                {i % 2 === 0 ? (
                  <Star className="w-4 h-4 text-purple-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-blue-400" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Level Up Icon */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                damping: 15, 
                stiffness: 200,
                delay: 0.3
              }}
              className="mx-auto mb-6 relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-12 h-12 text-white" />
              </div>
              
              {/* Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-purple-400/50 rounded-full"
              />
              
              {/* Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 border-2 border-purple-400 rounded-full"
              />
            </motion.div>

            {/* Level Up Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Level Up!
              </h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl font-bold text-purple-400">
                  Level {oldLevel}
                </span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronUp className="w-6 h-6 text-white rotate-90" />
                </motion.div>
                <span className="text-2xl font-bold text-blue-400">
                  Level {newLevel}
                </span>
              </div>
              
              {levelInfo && (
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                  {levelInfo.title}
                </h3>
              )}
            </motion.div>

            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-black/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  {totalXP.toLocaleString()} Total XP
                </span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              
              {nextLevelInfo && (
                <div className="text-sm text-slate-300">
                  Next level at {nextLevelInfo.minXP.toLocaleString()} XP
                </div>
              )}
            </motion.div>

            {/* Level Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg p-4 mb-6"
            >
              <h4 className="text-white font-semibold mb-2">Level Benefits</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <div>• Unlock advanced quiz categories</div>
                <div>• Access to expert-level content</div>
                <div>• Enhanced leaderboard recognition</div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              onClick={handleClose}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Continue Learning
              <Crown className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpNotification;