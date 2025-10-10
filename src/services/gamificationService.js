/**
 * Gamification Service - Complete student engagement system
 * Handles points, XP, levels, badges, achievements, streaks, and leaderboards
 * Integrates with Firebase Firestore for real-time data
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

// Points system constants
export const POINT_VALUES = {
  QUIZ_ATTEMPT: 10,
  QUIZ_COMPLETION: 25,
  QUIZ_PERFECT_SCORE: 50,
  COURSE_LESSON_COMPLETE: 15,
  COURSE_COMPLETION: 100,
  DAILY_LOGIN: 5,
  FIRST_LOGIN: 20,
  STREAK_BONUS_3_DAYS: 25,
  STREAK_BONUS_7_DAYS: 75,
  STREAK_BONUS_30_DAYS: 200,
  CERTIFICATE_EARNED: 150,
  ACHIEVEMENT_UNLOCK: 30
};

// XP Level thresholds
export const XP_LEVELS = [
  { level: 1, minXP: 0, maxXP: 100, title: 'Novice Explorer' },
  { level: 2, minXP: 101, maxXP: 250, title: 'Security Apprentice' },
  { level: 3, minXP: 251, maxXP: 500, title: 'Cyber Cadet' },
  { level: 4, minXP: 501, maxXP: 1000, title: 'Security Analyst' },
  { level: 5, minXP: 1001, maxXP: 2000, title: 'Threat Hunter' },
  { level: 6, minXP: 2001, maxXP: 3500, title: 'SOC Specialist' },
  { level: 7, minXP: 3501, maxXP: 5500, title: 'Security Expert' },
  { level: 8, minXP: 5501, maxXP: 8000, title: 'Cyber Guardian' },
  { level: 9, minXP: 8001, maxXP: 12000, title: 'Security Master' },
  { level: 10, minXP: 12001, maxXP: Infinity, title: 'Cybersecurity Legend' }
];

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'play-circle',
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    condition: { type: 'quiz_completion', count: 1 }
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: 'brain',
    color: 'purple',
    bgColor: 'bg-purple-500/20',
    condition: { type: 'quiz_completion', count: 10 }
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Achieve 100% on any quiz',
    icon: 'trophy',
    color: 'yellow',
    bgColor: 'bg-yellow-500/20',
    condition: { type: 'perfect_quiz_score', count: 1 }
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Complete your first course',
    icon: 'book-open',
    color: 'green',
    bgColor: 'bg-green-500/20',
    condition: { type: 'course_completion', count: 1 }
  },
  STREAK_WARRIOR: {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'flame',
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    condition: { type: 'learning_streak', count: 7 }
  },
  DEDICATION: {
    id: 'dedication',
    title: 'Dedication',
    description: 'Login for 30 consecutive days',
    icon: 'calendar',
    color: 'indigo',
    bgColor: 'bg-indigo-500/20',
    condition: { type: 'login_streak', count: 30 }
  },
  SECURITY_EXPERT: {
    id: 'security_expert',
    title: 'Security Expert',
    description: 'Reach Level 7',
    icon: 'shield',
    color: 'red',
    bgColor: 'bg-red-500/20',
    condition: { type: 'level_reached', count: 7 }
  },
  POINT_COLLECTOR: {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 1000 total points',
    icon: 'star',
    color: 'pink',
    bgColor: 'bg-pink-500/20',
    condition: { type: 'total_points', count: 1000 }
  }
};

// Badge definitions for different categories
export const BADGES = {
  SOC_FUNDAMENTALS: {
    id: 'soc_fundamentals',
    title: 'SOC Fundamentals Expert',
    description: 'Master SOC Fundamentals quizzes',
    icon: 'eye',
    color: 'blue',
    condition: { type: 'category_mastery', category: 'soc-fundamentals', count: 3 }
  },
  ETHICAL_HACKING: {
    id: 'ethical_hacking',
    title: 'Ethical Hacker',
    description: 'Master Ethical Hacking quizzes',
    icon: 'zap',
    color: 'red',
    condition: { type: 'category_mastery', category: 'ethical-hacking', count: 3 }
  },
  NETWORK_SECURITY: {
    id: 'network_security',
    title: 'Network Guardian',
    description: 'Master Network Security quizzes',
    icon: 'wifi',
    color: 'green',
    condition: { type: 'category_mastery', category: 'network-security', count: 3 }
  },
  MALWARE_ANALYSIS: {
    id: 'malware_analysis',
    title: 'Malware Hunter',
    description: 'Master Malware Analysis quizzes',
    icon: 'bug',
    color: 'orange',
    condition: { type: 'category_mastery', category: 'malware-analysis', count: 3 }
  }
};

/**
 * Initialize Firebase connection
 */
const getFirestore = async () => {
  const { db } = await import('@/config/firebase.js');
  return db;
};

/**
 * Get or create user gamification profile
 */
export const getUserGamificationProfile = async (userEmail) => {
  try {
    const db = await getFirestore();
    const userRef = doc(db, 'gamification', userEmail);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      // Create new profile
      const newProfile = {
        userEmail,
        totalPoints: 0,
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        achievements: [],
        badges: [],
        statistics: {
          quizzesCompleted: 0,
          coursesCompleted: 0,
          perfectScores: 0,
          totalStudyTime: 0,
          certificatesEarned: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userRef, newProfile);
      return { success: true, data: newProfile };
    }
  } catch (error) {
    console.error('Error getting user gamification profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Award points to user and check for level ups
 */
export const awardPoints = async (userEmail, pointType, customPoints = null) => {
  try {
    const db = await getFirestore();
    const userRef = doc(db, 'gamification', userEmail);
    
    const points = customPoints || POINT_VALUES[pointType] || 0;
    
    // Get current profile to check level ups
    const profileResult = await getUserGamificationProfile(userEmail);
    if (!profileResult.success) return profileResult;

    const currentProfile = profileResult.data;
    const newTotalXP = currentProfile.totalXP + points;
    const newLevel = calculateLevel(newTotalXP);
    
    const updateData = {
      totalPoints: increment(points),
      totalXP: increment(points),
      updatedAt: serverTimestamp()
    };

    // Check if level increased
    const leveledUp = newLevel > currentProfile.level;
    if (leveledUp) {
      updateData.level = newLevel;
    }

    await updateDoc(userRef, updateData);

    // Check for achievements after points update
    const achievementsUnlocked = await checkAchievements(userEmail);

    return { 
      success: true, 
      data: { 
        pointsAwarded: points, 
        newTotalXP: newTotalXP,
        leveledUp,
        newLevel: leveledUp ? newLevel : currentProfile.level,
        achievementsUnlocked: achievementsUnlocked.data || []
      }
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate user level based on XP
 */
export const calculateLevel = (totalXP) => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].minXP) {
      return XP_LEVELS[i].level;
    }
  }
  return 1;
};

/**
 * Get level information for current XP
 */
export const getLevelInfo = (totalXP) => {
  const level = calculateLevel(totalXP);
  const currentLevelInfo = XP_LEVELS.find(l => l.level === level);
  const nextLevelInfo = XP_LEVELS.find(l => l.level === level + 1);
  
  const progressInLevel = nextLevelInfo 
    ? ((totalXP - currentLevelInfo.minXP) / (nextLevelInfo.minXP - currentLevelInfo.minXP)) * 100
    : 100;

  return {
    currentLevel: currentLevelInfo,
    nextLevel: nextLevelInfo,
    progressToNext: Math.min(progressInLevel, 100),
    xpToNext: nextLevelInfo ? nextLevelInfo.minXP - totalXP : 0
  };
};

/**
 * Update learning streak
 */
export const updateLearningStreak = async (userEmail) => {
  try {
    const db = await getFirestore();
    const userRef = doc(db, 'gamification', userEmail);
    
    const profileResult = await getUserGamificationProfile(userEmail);
    if (!profileResult.success) return profileResult;

    const profile = profileResult.data;
    const today = new Date().toDateString();
    const lastLogin = profile.lastLoginDate ? new Date(profile.lastLoginDate.toDate()).toDateString() : null;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let newStreak = profile.currentStreak || 0;
    let streakBonus = 0;

    if (lastLogin !== today) {
      // First login today
      if (lastLogin === yesterday) {
        // Consecutive day
        newStreak += 1;
      } else if (lastLogin === null) {
        // First ever login
        newStreak = 1;
        streakBonus = POINT_VALUES.FIRST_LOGIN;
      } else {
        // Streak broken
        newStreak = 1;
      }

      // Award daily login points
      streakBonus += POINT_VALUES.DAILY_LOGIN;

      // Award streak bonuses
      if (newStreak === 3) streakBonus += POINT_VALUES.STREAK_BONUS_3_DAYS;
      if (newStreak === 7) streakBonus += POINT_VALUES.STREAK_BONUS_7_DAYS;
      if (newStreak === 30) streakBonus += POINT_VALUES.STREAK_BONUS_30_DAYS;

      const updateData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, profile.longestStreak || 0),
        lastLoginDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (streakBonus > 0) {
        updateData.totalPoints = increment(streakBonus);
        updateData.totalXP = increment(streakBonus);
      }

      await updateDoc(userRef, updateData);

      return { 
        success: true, 
        data: { 
          streakUpdated: true,
          newStreak,
          streakBonus,
          isFirstLogin: lastLogin === null
        }
      };
    }

    return { success: true, data: { streakUpdated: false, currentStreak: newStreak } };
  } catch (error) {
    console.error('Error updating learning streak:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check and unlock achievements
 */
export const checkAchievements = async (userEmail) => {
  try {
    const db = await getFirestore();
    const profileResult = await getUserGamificationProfile(userEmail);
    if (!profileResult.success) return profileResult;

    const profile = profileResult.data;
    const newAchievements = [];

    // Check each achievement
    for (const achievement of Object.values(ACHIEVEMENTS)) {
      if (profile.achievements.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.condition.type) {
        case 'quiz_completion':
          shouldUnlock = profile.statistics.quizzesCompleted >= achievement.condition.count;
          break;
        case 'perfect_quiz_score':
          shouldUnlock = profile.statistics.perfectScores >= achievement.condition.count;
          break;
        case 'course_completion':
          shouldUnlock = profile.statistics.coursesCompleted >= achievement.condition.count;
          break;
        case 'learning_streak':
          shouldUnlock = profile.currentStreak >= achievement.condition.count;
          break;
        case 'login_streak':
          shouldUnlock = profile.longestStreak >= achievement.condition.count;
          break;
        case 'level_reached':
          shouldUnlock = profile.level >= achievement.condition.count;
          break;
        case 'total_points':
          shouldUnlock = profile.totalPoints >= achievement.condition.count;
          break;
      }

      if (shouldUnlock) {
        newAchievements.push(achievement);
      }
    }

    // Unlock new achievements
    if (newAchievements.length > 0) {
      const achievementIds = newAchievements.map(a => a.id);
      const bonusPoints = newAchievements.length * POINT_VALUES.ACHIEVEMENT_UNLOCK;

      await updateDoc(doc(db, 'gamification', userEmail), {
        achievements: arrayUnion(...achievementIds),
        totalPoints: increment(bonusPoints),
        totalXP: increment(bonusPoints),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, data: newAchievements };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update quiz statistics
 */
export const updateQuizStats = async (userEmail, quizResult) => {
  try {
    const db = await getFirestore();
    const userRef = doc(db, 'gamification', userEmail);

    const updateData = {
      'statistics.quizzesCompleted': increment(1),
      updatedAt: serverTimestamp()
    };

    if (quizResult.score === 100) {
      updateData['statistics.perfectScores'] = increment(1);
    }

    await updateDoc(userRef, updateData);

    // Award points based on performance
    let pointType = 'QUIZ_COMPLETION';
    if (quizResult.score === 100) {
      pointType = 'QUIZ_PERFECT_SCORE';
    }

    const pointsResult = await awardPoints(userEmail, pointType);
    return pointsResult;
  } catch (error) {
    console.error('Error updating quiz stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update course statistics
 */
export const updateCourseStats = async (userEmail, courseId, progress) => {
  try {
    const db = await getFirestore();
    const userRef = doc(db, 'gamification', userEmail);

    let pointsAwarded = 0;
    const updateData = { updatedAt: serverTimestamp() };

    if (progress === 100) {
      // Course completed
      updateData['statistics.coursesCompleted'] = increment(1);
      pointsAwarded = POINT_VALUES.COURSE_COMPLETION;
    } else {
      // Lesson completed (estimate based on progress increase)
      pointsAwarded = POINT_VALUES.COURSE_LESSON_COMPLETE;
    }

    await updateDoc(userRef, updateData);

    // Award points
    const pointsResult = await awardPoints(userEmail, null, pointsAwarded);
    return pointsResult;
  } catch (error) {
    console.error('Error updating course stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get leaderboard data
 */
export const getLeaderboard = async (leaderboardType = 'points', limitCount = 10) => {
  try {
    const db = await getFirestore();
    let queryField = 'totalPoints';
    
    switch (leaderboardType) {
      case 'xp':
        queryField = 'totalXP';
        break;
      case 'level':
        queryField = 'level';
        break;
      case 'streak':
        queryField = 'longestStreak';
        break;
      case 'quizzes':
        queryField = 'statistics.quizzesCompleted';
        break;
    }

    const leaderboardQuery = query(
      collection(db, 'gamification'),
      orderBy(queryField, 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(leaderboardQuery);
    const leaderboard = [];

    snapshot.forEach((doc, index) => {
      const data = doc.data();
      leaderboard.push({
        rank: index + 1,
        userEmail: data.userEmail,
        displayName: data.userEmail.split('@')[0], // Use email prefix as display name
        totalPoints: data.totalPoints || 0,
        totalXP: data.totalXP || 0,
        level: data.level || 1,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        achievements: data.achievements || [],
        statistics: data.statistics || {}
      });
    });

    return { success: true, data: leaderboard };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user rank in leaderboard
 */
export const getUserRank = async (userEmail, leaderboardType = 'points') => {
  try {
    const leaderboardResult = await getLeaderboard(leaderboardType, 100);
    if (!leaderboardResult.success) return leaderboardResult;

    const userRank = leaderboardResult.data.findIndex(user => user.userEmail === userEmail) + 1;
    
    return { 
      success: true, 
      data: { 
        rank: userRank || null,
        total: leaderboardResult.data.length
      }
    };
  } catch (error) {
    console.error('Error getting user rank:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get comprehensive user stats for dashboard
 */
export const getUserStats = async (userEmail) => {
  try {
    const profileResult = await getUserGamificationProfile(userEmail);
    if (!profileResult.success) return profileResult;

    const profile = profileResult.data;
    const levelInfo = getLevelInfo(profile.totalXP);
    const rankResult = await getUserRank(userEmail);

    return {
      success: true,
      data: {
        ...profile,
        levelInfo,
        rank: rankResult.success ? rankResult.data.rank : null,
        totalUsers: rankResult.success ? rankResult.data.total : null
      }
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getUserGamificationProfile,
  awardPoints,
  calculateLevel,
  getLevelInfo,
  updateLearningStreak,
  checkAchievements,
  updateQuizStats,
  updateCourseStats,
  getLeaderboard,
  getUserRank,
  getUserStats,
  POINT_VALUES,
  XP_LEVELS,
  ACHIEVEMENTS,
  BADGES
};