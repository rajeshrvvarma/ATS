/**
 * Course Recommendation Engine
 * Intelligent course recommendations based on user progress, quiz performance, and learning patterns
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';

// Lazy-loaded courses cache (loaded from Firestore)
let _coursesCache = null;
const loadCoursesOnce = async () => {
  if (_coursesCache) return _coursesCache;
  try {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
    const q = query(collection(db, 'courses'), orderBy('title'));
    const snap = await getDocs(q);
    _coursesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return _coursesCache;
  } catch (err) {
    console.warn('Failed to load courses for recommendationService, falling back to empty list:', err);
    _coursesCache = [];
    return _coursesCache;
  }
};

const getCourseById = async (courseId) => {
  const courses = await loadCoursesOnce();
  return courses.find(c => c.id === courseId);
};
import { getDocsWithIndexFallback } from './firestoreIndexGuard.js';

// Recommendation algorithms
export const RECOMMENDATION_TYPES = {
  SKILL_BASED: 'skill-based',
  PERFORMANCE_BASED: 'performance-based',
  DIFFICULTY_PROGRESSION: 'difficulty-progression',
  CATEGORY_AFFINITY: 'category-affinity',
  PEER_COLLABORATIVE: 'peer-collaborative',
  AI_PERSONALIZED: 'ai-personalized'
};

// Course difficulty weights for progression
const DIFFICULTY_WEIGHTS = {
  'Beginner': 1,
  'Beginner to Intermediate': 2,
  'Intermediate': 3,
  'Intermediate to Advanced': 4,
  'Advanced': 5
};

// Category relationships and prerequisites
const CATEGORY_RELATIONSHIPS = {
  'workshop': { nextCategories: ['defensive', 'offensive'], difficulty: 1 },
  'defensive': { nextCategories: ['offensive', 'advanced-defensive'], difficulty: 2 },
  'offensive': { nextCategories: ['advanced-offensive', 'specialized'], difficulty: 3 },
  'specialized': { nextCategories: ['expert'], difficulty: 4 }
};

// Weighting for different recommendation algorithms
const algorithmWeights = {
  skillBased: 1.0,
  performanceBased: 1.0,
  difficultyProgression: 0.9,
  categoryAffinity: 0.8,
  peerCollaborative: 0.7,
  aiPersonalized: 1.1
};

/**
 * Get comprehensive course recommendations for a user
 */
export const getCourseRecommendations = async (userId, options = {}) => {
  try {
    const { focusArea = null, includeCompleted = false, maxRecommendations = 5 } = options;
    const [userProgress, userQuizData, userProfile] = await Promise.all([
      getUserCourseProgress(userId),
      getUserQuizPerformance(userId),
      getUserProfile(userId)
    ]);

    // Run different recommendation algorithms
    const recommendations = [];

    // 1. Skill-based recommendations
    const skillBasedRecs = await getSkillBasedRecommendations(userProgress, userQuizData);
    recommendations.push(...skillBasedRecs.map(rec => ({ ...rec, algorithm: 'skill-based', weight: algorithmWeights.skillBased })));

    // 2. Performance-based recommendations
    const performanceBasedRecs = await getPerformanceBasedRecommendations(userQuizData, userProgress);
    recommendations.push(...performanceBasedRecs.map(rec => ({ ...rec, algorithm: 'performance-based', weight: algorithmWeights.performanceBased })));

  // 3. Difficulty progression recommendations
  const difficultyProgressionRecs = await getDifficultyProgressionRecommendations(userProgress);
  recommendations.push(...difficultyProgressionRecs.map(rec => ({ ...rec, algorithm: 'difficulty-progression', weight: algorithmWeights.difficultyProgression })));

  // 4. Category affinity recommendations
  const categoryAffinityRecs = await getCategoryAffinityRecommendations(userProgress, userQuizData);
  recommendations.push(...categoryAffinityRecs.map(rec => ({ ...rec, algorithm: 'category-affinity', weight: algorithmWeights.categoryAffinity })));

    // 5. Peer collaborative recommendations
    const peerCollaborativeRecs = await getPeerCollaborativeRecommendations(userId, userProfile);
    recommendations.push(...peerCollaborativeRecs.map(rec => ({ ...rec, algorithm: 'peer-collaborative', weight: algorithmWeights.peerCollaborative })));

    // 6. AI personalized recommendations
    const aiPersonalizedRecs = await getAIPersonalizedRecommendations(userId, userProfile, userProgress, userQuizData);
    recommendations.push(...aiPersonalizedRecs.map(rec => ({ ...rec, algorithm: 'ai-personalized', weight: algorithmWeights.aiPersonalized })));

    // Score and rank recommendations
    const scoredRecommendations = scoreRecommendations(recommendations, userProgress, includeCompleted);

    // Filter by focus area if specified
    let filteredRecommendations = scoredRecommendations;
    if (focusArea) {
      filteredRecommendations = scoredRecommendations.filter(rec =>
        rec.course.category === focusArea ||
        rec.reasons.some(reason => reason.toLowerCase().includes(focusArea.toLowerCase()))
      );
    }

    // Return top recommendations with detailed reasoning
    const topRecommendations = filteredRecommendations
      .slice(0, maxRecommendations)
      .map(rec => ({
        ...rec,
        confidence: Math.min(rec.score * 100, 99), // Convert to percentage confidence
        reasons: [...new Set(rec.reasons)], // Remove duplicate reasons
        metadata: {
          userLevel: getUserLevel(userProgress),
          recommendationStrength: getRecommendationStrength(rec.score),
          estimatedCompletionTime: estimateCompletionTime(rec.course, userProgress)
        }
      }));

    return {
      success: true,
      data: {
        recommendations: topRecommendations,
        summary: {
          totalAnalyzed: recommendations.length,
          userLevel: getUserLevel(userProgress),
          strongestCategory: getStrongestCategory(userQuizData),
          nextMilestone: getNextMilestone(userProgress)
        }
      }
    };
  } catch (error) {
    console.error('Error generating course recommendations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Skill-based recommendations based on quiz performance and knowledge gaps
 */
const getSkillBasedRecommendations = async (userProgress, userQuizData) => {
  const recommendations = [];
  const skillGaps = identifySkillGaps(userQuizData);
  const courses = await loadCoursesOnce();

  skillGaps.forEach(gap => {
    const relevantCourses = courses.filter(course =>
      course.category === gap.category ||
      (course.description || '').toLowerCase().includes(gap.skill.toLowerCase())
    );

    relevantCourses.forEach(course => {
      recommendations.push({
        course,
        score: gap.urgency,
        reasons: [`Improve ${gap.skill} skills (current score: ${gap.currentScore}%)`],
        urgency: gap.urgency
      });
    });
  });

  return recommendations;
};

/**
 * Performance-based recommendations using quiz analytics
 */
const getPerformanceBasedRecommendations = async (userQuizData, userProgress) => {
  const recommendations = [];
  const courses = await loadCoursesOnce();

  if (!userQuizData || userQuizData.length === 0) {
    // New user - recommend beginner courses
    const beginnerCourses = courses.filter(course =>
      course.difficulty === 'Beginner' || course.difficulty === 'Beginner to Intermediate'
    );

    beginnerCourses.forEach(course => {
      recommendations.push({
        course,
        score: 0.8,
        reasons: ['Perfect for beginners - start your cybersecurity journey'],
        urgency: 'high'
      });
    });
  } else {
    // Analyze performance patterns
    const avgScore = userQuizData.reduce((sum, quiz) => sum + quiz.percentage, 0) / userQuizData.length;

    if (avgScore >= 85) {
      // High performer - recommend advanced courses
      const advancedCourses = courses.filter(course =>
        course.difficulty === 'Advanced' || course.difficulty === 'Intermediate to Advanced'
      );

      advancedCourses.forEach(course => {
        recommendations.push({
          course,
          score: 0.9,
          reasons: [`Excellent performance (${Math.round(avgScore)}% avg) - ready for advanced topics`],
          urgency: 'medium'
        });
      });
    } else if (avgScore >= 70) {
      // Average performer - recommend intermediate courses
      const intermediateCourses = courses.filter(course =>
        course.difficulty === 'Intermediate' || course.difficulty === 'Beginner to Intermediate'
      );

      intermediateCourses.forEach(course => {
        recommendations.push({
          course,
          score: 0.7,
          reasons: [`Good progress (${Math.round(avgScore)}% avg) - ready for intermediate challenges`],
          urgency: 'medium'
        });
      });
    } else {
      // Struggling performer - recommend review and foundation courses
      const foundationCourses = courses.filter(course =>
        course.difficulty === 'Beginner' && course.category === 'workshop'
      );

      foundationCourses.forEach(course => {
        recommendations.push({
          course,
          score: 0.6,
          reasons: [`Strengthen foundations (${Math.round(avgScore)}% avg) - focus on core concepts`],
          urgency: 'high'
        });
      });
    }
  }

  return recommendations;
};

/**
 * Difficulty progression recommendations
 */
const getDifficultyProgressionRecommendations = async (userProgress) => {
  const recommendations = [];
  const courses = await loadCoursesOnce();

  if (!userProgress || userProgress.length === 0) {
    // Start with workshop/beginner courses
    const starterCourses = courses.filter(course =>
      course.category === 'workshop' || course.difficulty === 'Beginner'
    );

    starterCourses.forEach(course => {
      recommendations.push({
        course,
        score: 0.8,
        reasons: ['Perfect starting point for your cybersecurity journey'],
        urgency: 'high'
      });
    });
  } else {
    // Find current difficulty level and recommend next level
    const completedCourses = userProgress.filter(p => p.completed);

    // Load course documents for completed courses in parallel and compute difficulty
    let currentMaxDifficulty = 1;
    if (completedCourses.length > 0) {
      const courseIds = completedCourses.map(p => p.courseId);
      const courseLookups = await Promise.all(courseIds.map(id => getCourseById(id)));
      const weights = courseLookups.map(c => DIFFICULTY_WEIGHTS[c?.difficulty] || 1);
      currentMaxDifficulty = Math.max(...weights);
    }

    const nextLevelCourses = courses.filter(course => {
      const courseWeight = DIFFICULTY_WEIGHTS[course.difficulty] || 1;
      return courseWeight === currentMaxDifficulty + 1 || courseWeight === currentMaxDifficulty;
    });

    nextLevelCourses.forEach(course => {
      recommendations.push({
        course,
        score: 0.75,
        reasons: ['Natural next step in your learning progression'],
        urgency: 'medium'
      });
    });
  }

  return recommendations;
};

/**
 * Category affinity recommendations based on user preferences
 */
const getCategoryAffinityRecommendations = async (userProgress, userQuizData) => {
  const recommendations = [];
  const courses = await loadCoursesOnce();

  const categoryScores = {};

  // From course progress
  for (const progress of userProgress) {
    const course = await getCourseById(progress.courseId);
    if (course) {
      categoryScores[course.category] = (categoryScores[course.category] || 0) +
        (progress.completed ? 1 : progress.progress / 100);
    }
  }

  // From quiz performance
  userQuizData.forEach(quiz => {
    if (quiz.category) {
      categoryScores[quiz.category] = (categoryScores[quiz.category] || 0) +
        (quiz.percentage / 100);
    }
  });

  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  sortedCategories.forEach(([category, score]) => {
    const categoryCourses = courses.filter(course =>
      course.category === category
    );

    categoryCourses.forEach(course => {
      recommendations.push({
        course,
        score: Math.min(score / 3, 1),
        reasons: [`Matches your strong interest in ${category} cybersecurity`],
        urgency: 'low'
      });
    });
  });

  return recommendations;
};

/**
 * Peer collaborative recommendations based on similar users
 */
const getPeerCollaborativeRecommendations = async (userId, userProfile) => {
  try {
    // Find similar users based on level, interests, and progress
    const similarsRef = collection(db, 'userProgress');
    const similarsSnapshot = await getDocs(similarsRef);

    const similarUsers = [];
    similarsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.userId !== userId && data.level === userProfile?.level) {
        similarUsers.push(data);
      }
    });

    // Get popular courses among similar users
    const popularCourses = {};
    similarUsers.forEach(user => {
      user.coursesCompleted?.forEach(courseId => {
        popularCourses[courseId] = (popularCourses[courseId] || 0) + 1;
      });
    });

    const recommendations = [];
    Object.entries(popularCourses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([courseId, popularity]) => {
        const course = getCourseById(courseId);
        if (course) {
          recommendations.push({
            course,
            score: Math.min(popularity / similarUsers.length, 1),
            reasons: [`Popular among students at your level (${popularity}/${similarUsers.length} completed)`],
            urgency: 'low'
          });
        }
      });

    return recommendations;
  } catch (error) {
    console.error('Error getting peer recommendations:', error);
    return [];
  }
};

/**
 * AI-powered personalized recommendations
 */
const getAIPersonalizedRecommendations = async (userId, userProfile, userProgress, userQuizData) => {
  try {
    // Generate AI recommendations based on comprehensive user analysis
    const { callGeminiAPI } = await import('@/api/gemini.js');

    const userContext = {
      level: getUserLevel(userProgress),
      completedCourses: userProgress.filter(p => p.completed).length,
      averageQuizScore: userQuizData.length > 0 ?
        userQuizData.reduce((sum, q) => sum + q.percentage, 0) / userQuizData.length : 0,
      strongestCategory: getStrongestCategory(userQuizData),
      weakestCategory: getWeakestCategory(userQuizData),
      learningPattern: analyzeLearningPattern(userProgress, userQuizData)
    };

    const prompt = `Based on this cybersecurity student profile: ${JSON.stringify(userContext)},
    recommend 2-3 specific courses from these available options: ${courses.map(c => c.title).join(', ')}.
    Consider their learning pattern, strengths, and areas for improvement.
    Provide brief reasoning for each recommendation.`;

    const systemPrompt = "You are an AI learning advisor specializing in cybersecurity education. Provide personalized course recommendations with clear reasoning.";

    const aiResponse = await callGeminiAPI(prompt, systemPrompt);

    // Parse AI response and match to actual courses
    const recommendations = [];
    courses.forEach(course => {
      if (aiResponse.toLowerCase().includes(course.title.toLowerCase())) {
        recommendations.push({
          course,
          score: 0.85,
          reasons: ['AI-recommended based on your learning profile and goals'],
          urgency: 'medium'
        });
      }
    });

    return recommendations.slice(0, 3); // Limit to top 3 AI recommendations
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
};

/**
 * Helper functions
 */
const getUserCourseProgress = async (userId) => {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const progress = [];
    snapshot.forEach(doc => {
      progress.push({ id: doc.id, ...doc.data() });
    });

    return progress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};

const getUserQuizPerformance = async (userId) => {
  try {
    const attemptsRef = collection(db, 'quizAttempts');
    const primary = () => getDocs(query(attemptsRef, where('userId', '==', userId), orderBy('completedAt', 'desc')));
    const fallback = () => getDocs(query(attemptsRef, where('userId', '==', userId)));
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'completedAt', sortDir: 'desc', alertSource: 'recommendations.getUserQuizPerformance', alertPath: 'quizAttempts' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    if (indexRequired) console.warn('Index required for getUserQuizPerformance; using fallback.');
    return rows;
  } catch (error) {
    console.error('Error fetching quiz performance:', error);
    return [];
  }
};

const getUserProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'userProfiles', userId);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      return { id: profileDoc.id, ...profileDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

const identifySkillGaps = (userQuizData) => {
  const categoryPerformance = {};

  userQuizData.forEach(quiz => {
    const category = quiz.category || 'general';
    if (!categoryPerformance[category]) {
      categoryPerformance[category] = { scores: [], total: 0 };
    }
    categoryPerformance[category].scores.push(quiz.percentage);
    categoryPerformance[category].total++;
  });

  const skillGaps = [];
  Object.entries(categoryPerformance).forEach(([category, data]) => {
    const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    if (avgScore < 75) {
      skillGaps.push({
        category,
        skill: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        currentScore: Math.round(avgScore),
        urgency: avgScore < 60 ? 0.9 : 0.7
      });
    }
  });

  return skillGaps.sort((a, b) => b.urgency - a.urgency);
};

const scoreRecommendations = (recommendations, userProgress, includeCompleted) => {
  const completedCourseIds = userProgress
    .filter(p => p.completed)
    .map(p => p.courseId);

  return recommendations
    .filter(rec => includeCompleted || !completedCourseIds.includes(rec.course.id))
    .reduce((acc, rec) => {
      const existingIndex = acc.findIndex(existing => existing.course.id === rec.course.id);

      if (existingIndex >= 0) {
        // Combine scores and reasons for duplicate courses
        acc[existingIndex].score = Math.max(acc[existingIndex].score, rec.score);
        acc[existingIndex].reasons.push(...rec.reasons);
      } else {
        acc.push({
          ...rec,
          reasons: Array.isArray(rec.reasons) ? rec.reasons : [rec.reasons]
        });
      }

      return acc;
    }, [])
    .sort((a, b) => b.score - a.score);
};

const getUserLevel = (userProgress) => {
  const completedCourses = userProgress.filter(p => p.completed).length;
  if (completedCourses === 0) return 'Beginner';
  if (completedCourses <= 2) return 'Intermediate';
  return 'Advanced';
};

const getStrongestCategory = (userQuizData) => {
  const categoryScores = {};
  userQuizData.forEach(quiz => {
    const category = quiz.category || 'general';
    if (!categoryScores[category]) categoryScores[category] = [];
    categoryScores[category].push(quiz.percentage);
  });

  let bestCategory = 'general';
  let bestScore = 0;

  Object.entries(categoryScores).forEach(([category, scores]) => {
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestCategory = category;
    }
  });

  return bestCategory;
};

const getWeakestCategory = (userQuizData) => {
  const categoryScores = {};
  userQuizData.forEach(quiz => {
    const category = quiz.category || 'general';
    if (!categoryScores[category]) categoryScores[category] = [];
    categoryScores[category].push(quiz.percentage);
  });

  let worstCategory = 'general';
  let worstScore = 100;

  Object.entries(categoryScores).forEach(([category, scores]) => {
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (avgScore < worstScore) {
      worstScore = avgScore;
      worstCategory = category;
    }
  });

  return worstCategory;
};

const analyzeLearningPattern = (userProgress, userQuizData) => {
  const patterns = [];

  if (userProgress.length > 0) {
    const completionRate = userProgress.filter(p => p.completed).length / userProgress.length;
    if (completionRate > 0.8) patterns.push('high-completion');
    else if (completionRate > 0.5) patterns.push('moderate-completion');
    else patterns.push('low-completion');
  }

  if (userQuizData.length > 0) {
    const avgScore = userQuizData.reduce((sum, q) => sum + q.percentage, 0) / userQuizData.length;
    if (avgScore > 85) patterns.push('high-performer');
    else if (avgScore > 70) patterns.push('average-performer');
    else patterns.push('struggling-performer');
  }

  return patterns.join(', ') || 'new-learner';
};

const getRecommendationStrength = (score) => {
  if (score >= 0.8) return 'Strong';
  if (score >= 0.6) return 'Moderate';
  return 'Weak';
};

const estimateCompletionTime = (course, userProgress) => {
  // Simple estimation based on course duration and user's average completion time
  const courseDuration = course.lessons?.length || 5; // Default to 5 lessons
  const avgUserSpeed = userProgress.length > 0 ? 1.2 : 1.0; // Experienced users are 20% faster

  return Math.round(courseDuration * avgUserSpeed);
};

const getNextMilestone = (userProgress) => {
  const completed = userProgress.filter(p => p.completed).length;
  const milestones = [1, 3, 5, 10, 15];

  for (const milestone of milestones) {
    if (completed < milestone) {
      return `Complete ${milestone - completed} more course${milestone - completed > 1 ? 's' : ''} to reach ${milestone} courses milestone`;
    }
  }

  return 'Continue your excellent learning journey!';
};