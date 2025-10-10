/**
 * Achievement Notification - Shows achievement unlocks with animations
 * Displays floating notifications when users unlock achievements, badges, or level up
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Zap, 
  Crown,
  X,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const AchievementNotification = ({ achievements = [], onDismiss }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setIsVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);

  const currentAchievement = achievements[currentIndex];

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  // Icon mapping
  const getIcon = (iconName) => {
    const iconMap = {
      'trophy': Trophy,
      'star': Star,
      'award': Award,
      'zap': Zap,
      'crown': Crown,
      'sparkles': Sparkles,
      'chevron-up': ChevronUp
    };
    return iconMap[iconName] || Trophy;
  };

  if (!isVisible || !currentAchievement) return null;

  const IconComponent = getIcon(currentAchievement.icon);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Achievement Card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            delay: 0.1
          }}
          className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-yellow-400/30 max-w-md w-full overflow-hidden relative"
        >
          {/* Animated Background Glow */}
          <motion.div
            animate={{ 
              background: [
                'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />

          {/* Floating Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40],
                  x: [0, Math.random() * 20 - 10]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${60 + Math.random() * 20}%`
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
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
            {/* Achievement Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                damping: 15, 
                stiffness: 200,
                delay: 0.3
              }}
              className="mx-auto mb-6 relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              
              {/* Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 border-4 border-yellow-400 rounded-full"
              />
            </motion.div>

            {/* Achievement Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                {currentAchievement.title}
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                {currentAchievement.description}
              </p>
            </motion.div>

            {/* Points Earned */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  +30 XP Earned
                </span>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-between"
            >
              <div className="text-slate-400 text-sm">
                {currentIndex + 1} of {achievements.length}
              </div>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center gap-2"
              >
                {currentIndex < achievements.length - 1 ? 'Next' : 'Continue'}
                <ChevronUp className="w-4 h-4 rotate-90" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievement Progress Dots */}
        {achievements.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2"
          >
            {achievements.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-yellow-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementNotification;