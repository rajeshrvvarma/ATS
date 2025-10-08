/**
 * Course Progress Tracking Service
 * Handles real-time progress tracking, completion analytics, and learning metrics
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { getCurrentUser, logActivity } from '@/services/firebaseAuthService.js';
import { sendProgressUpdateEmail, sendCertificateEmail } from '@/services/emailService.js';

/**
 * Track lesson completion and progress
 */
export const trackLessonProgress = async (progressData) => {
  try {
    const {
      enrollmentId,
      courseType,
      moduleId,
      lessonId,
      lessonTitle,
      progressPercentage = 0,
      timeSpent = 0, // in minutes
      completed = false,
      quizScore = null,
      videoWatchTime = 0,
      interactionData = {}
    } = progressData;
    
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create progress entry
    const progressEntry = {
      userId: user.uid,
      enrollmentId,
      courseType,
      moduleId,
      lessonId,
      lessonTitle,
      progressPercentage,
      timeSpent,
      completed,
      quizScore,
      videoWatchTime,
      interactionData,
      timestamp: serverTimestamp(),
      sessionId: generateSessionId(),
      userAgent: navigator.userAgent
    };
    
    // Add progress record
    const progressDoc = await addDoc(collection(db, 'lessonProgress'), progressEntry);
    
    // Update enrollment progress
    await updateEnrollmentProgress(enrollmentId, {
      lessonId,
      moduleId,
      progressPercentage,
      timeSpent,
      completed
    });
    
    // Log activity
    await logActivity(user.uid, 'lesson_progress_updated', {
      enrollmentId,
      lessonId,
      progressPercentage,
      completed,
      timeSpent
    });
    
    // Check for milestones and achievements
    await checkProgressMilestones(enrollmentId, progressPercentage);
    
    return {
      success: true,
      progressId: progressDoc.id,
      message: 'Progress tracked successfully!'
    };
    
  } catch (error) {
    console.error('Progress tracking error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update overall enrollment progress
 */
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
  try {
    const { lessonId, moduleId, progressPercentage, timeSpent, completed } = progressData;
    
    // Find enrollment document
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('enrollmentId', '==', enrollmentId)
    );
    
    const enrollmentSnapshot = await getDocs(enrollmentsQuery);
    
    if (enrollmentSnapshot.empty) {
      throw new Error('Enrollment not found');
    }
    
    const enrollmentDoc = enrollmentSnapshot.docs[0];
    const enrollment = enrollmentDoc.data();
    
    // Update completed lessons array
    const completedLessons = completed 
      ? [...new Set([...enrollment.course.completedLessons, lessonId])]
      : enrollment.course.completedLessons;
    
    // Calculate overall progress
    const overallProgress = Math.max(enrollment.course.progress, progressPercentage);
    
    // Update enrollment document
    await updateDoc(doc(db, 'enrollments', enrollmentDoc.id), {
      'course.progress': overallProgress,
      'course.completedLessons': completedLessons,
      'course.currentModule': moduleId,
      'course.lastAccessed': serverTimestamp(),
      'course.timeSpent': increment(timeSpent),
      updatedAt: serverTimestamp()
    });
    
    // Check if course is completed (100% progress)
    if (overallProgress >= 100) {
      await handleCourseCompletion(enrollmentId, enrollmentDoc.id);
    }
    
    return {
      success: true,
      overallProgress,
      completedLessons
    };
    
  } catch (error) {
    console.error('Enrollment progress update error:', error);
    throw error;
  }
};

/**
 * Get detailed progress analytics for a student
 */
export const getStudentProgressAnalytics = async (enrollmentId) => {
  try {
    // Get enrollment data
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('enrollmentId', '==', enrollmentId)
    );
    
    const enrollmentSnapshot = await getDocs(enrollmentsQuery);
    
    if (enrollmentSnapshot.empty) {
      throw new Error('Enrollment not found');
    }
    
    const enrollment = enrollmentSnapshot.docs[0].data();
    
    // Get detailed lesson progress
    const progressQuery = query(
      collection(db, 'lessonProgress'),
      where('enrollmentId', '==', enrollmentId),
      orderBy('timestamp', 'asc')
    );
    
    const progressSnapshot = await getDocs(progressQuery);
    const progressRecords = progressSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    
    // Calculate analytics
    const analytics = calculateProgressAnalytics(enrollment, progressRecords);
    
    return {
      success: true,
      analytics,
      enrollment,
      progressHistory: progressRecords
    };
    
  } catch (error) {
    console.error('Progress analytics error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate comprehensive progress analytics
 */
const calculateProgressAnalytics = (enrollment, progressRecords) => {
  const courseConfig = getCourseConfiguration(enrollment.courseType);
  
  // Basic metrics
  const totalLessons = courseConfig.totalLessons;
  const completedLessons = enrollment.course.completedLessons.length;
  const overallProgress = enrollment.course.progress;
  const totalTimeSpent = enrollment.course.timeSpent;
  
  // Daily activity
  const dailyActivity = calculateDailyActivity(progressRecords);
  
  // Learning velocity (lessons per day)
  const enrollmentDays = Math.max(1, Math.ceil((new Date() - enrollment.createdAt.toDate()) / (1000 * 60 * 60 * 24)));
  const learningVelocity = completedLessons / enrollmentDays;
  
  // Engagement metrics
  const avgSessionTime = progressRecords.length > 0 
    ? progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / progressRecords.length
    : 0;
  
  const lastActivityDate = progressRecords.length > 0 
    ? progressRecords[progressRecords.length - 1].timestamp
    : null;
  
  const daysSinceLastActivity = lastActivityDate 
    ? Math.ceil((new Date() - lastActivityDate) / (1000 * 60 * 60 * 24))
    : null;
  
  // Quiz performance
  const quizScores = progressRecords
    .filter(p => p.quizScore !== null)
    .map(p => p.quizScore);
  
  const avgQuizScore = quizScores.length > 0 
    ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
    : null;
  
  // Video engagement
  const videoMetrics = calculateVideoEngagement(progressRecords);
  
  // Predicted completion
  const predictedCompletion = calculatePredictedCompletion(
    overallProgress, 
    learningVelocity, 
    courseConfig.estimatedDuration
  );
  
  return {
    overview: {
      totalLessons,
      completedLessons,
      overallProgress: Math.round(overallProgress),
      totalTimeSpent: Math.round(totalTimeSpent),
      completionRate: Math.round((completedLessons / totalLessons) * 100)
    },
    
    engagement: {
      learningVelocity: Math.round(learningVelocity * 100) / 100,
      avgSessionTime: Math.round(avgSessionTime),
      daysSinceLastActivity,
      totalSessions: progressRecords.length,
      isActive: daysSinceLastActivity <= 3
    },
    
    performance: {
      avgQuizScore: avgQuizScore ? Math.round(avgQuizScore * 100) / 100 : null,
      totalQuizzes: quizScores.length,
      videoEngagement: videoMetrics,
      strongestTopics: identifyStrongestTopics(progressRecords),
      needsImprovement: identifyWeakAreas(progressRecords)
    },
    
    prediction: {
      estimatedCompletionDate: predictedCompletion.date,
      estimatedDaysRemaining: predictedCompletion.daysRemaining,
      onTrackForCompletion: predictedCompletion.onTrack
    },
    
    milestones: {
      achievementsUnlocked: calculateAchievements(enrollment, progressRecords),
      nextMilestone: getNextMilestone(overallProgress),
      certificateEligible: overallProgress >= 80
    },
    
    dailyActivity,
    
    recommendations: generateLearningRecommendations(enrollment, progressRecords)
  };
};

/**
 * Track video watching behavior
 */
export const trackVideoProgress = async (videoData) => {
  try {
    const {
      enrollmentId,
      lessonId,
      videoId,
      totalDuration,
      watchedDuration,
      watchPercentage,
      playbackSpeed,
      pauseCount,
      seekEvents,
      completedWatching = false
    } = videoData;
    
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create video progress entry
    const videoProgress = {
      userId: user.uid,
      enrollmentId,
      lessonId,
      videoId,
      totalDuration,
      watchedDuration,
      watchPercentage: Math.round(watchPercentage),
      playbackSpeed,
      pauseCount,
      seekEvents: seekEvents || [],
      completedWatching,
      timestamp: serverTimestamp(),
      sessionId: generateSessionId()
    };
    
    await addDoc(collection(db, 'videoProgress'), videoProgress);
    
    // Update lesson progress if video is completed
    if (completedWatching || watchPercentage >= 90) {
      await trackLessonProgress({
        enrollmentId,
        lessonId,
        progressPercentage: watchPercentage,
        timeSpent: Math.round(watchedDuration / 60), // Convert to minutes
        completed: completedWatching,
        videoWatchTime: watchedDuration
      });
    }
    
    return {
      success: true,
      message: 'Video progress tracked successfully!'
    };
    
  } catch (error) {
    console.error('Video progress tracking error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Track quiz attempts and scores
 */
export const trackQuizProgress = async (quizData) => {
  try {
    const {
      enrollmentId,
      lessonId,
      quizId,
      questions,
      answers,
      score,
      maxScore,
      timeSpent,
      attempts,
      passed = false
    } = quizData;
    
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const percentage = Math.round((score / maxScore) * 100);
    
    // Create quiz progress entry
    const quizProgress = {
      userId: user.uid,
      enrollmentId,
      lessonId,
      quizId,
      questions,
      answers,
      score,
      maxScore,
      percentage,
      timeSpent,
      attempts,
      passed,
      timestamp: serverTimestamp(),
      sessionId: generateSessionId()
    };
    
    await addDoc(collection(db, 'quizProgress'), quizProgress);
    
    // Update lesson progress
    await trackLessonProgress({
      enrollmentId,
      lessonId,
      progressPercentage: percentage,
      timeSpent: Math.round(timeSpent / 60),
      completed: passed,
      quizScore: percentage
    });
    
    return {
      success: true,
      score: percentage,
      passed,
      message: 'Quiz progress tracked successfully!'
    };
    
  } catch (error) {
    console.error('Quiz progress tracking error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Handle course completion
 */
const handleCourseCompletion = async (enrollmentId, enrollmentDocId) => {
  try {
    // Update enrollment status
    await updateDoc(doc(db, 'enrollments', enrollmentDocId), {
      'enrollment.status': 'completed',
      'course.completedAt': serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Generate certificate
    const certificateResult = await generateCourseCertificate(enrollmentId);
    
    // Send completion email
    if (certificateResult.success) {
      const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentDocId));
      const enrollment = enrollmentDoc.data();
      
      await sendCertificateEmail(
        {
          name: enrollment.studentDetails.name,
          email: enrollment.studentDetails.email
        },
        {
          courseType: enrollment.courseType,
          certificateId: certificateResult.certificateId,
          certificateUrl: certificateResult.certificateUrl,
          completionDate: new Date(),
          finalScore: enrollment.course.progress
        }
      );
    }
    
    // Log completion activity
    const user = getCurrentUser();
    if (user) {
      await logActivity(user.uid, 'course_completed', {
        enrollmentId,
        courseType: 'unknown', // Would get from enrollment
        completionDate: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Course completion handling error:', error);
  }
};

/**
 * Check and award progress milestones
 */
const checkProgressMilestones = async (enrollmentId, currentProgress) => {
  try {
    const milestones = [
      { threshold: 25, name: 'First Quarter Complete', badge: 'quarter-master' },
      { threshold: 50, name: 'Halfway Hero', badge: 'halfway-hero' },
      { threshold: 75, name: 'Three Quarters Champion', badge: 'champion-75' },
      { threshold: 100, name: 'Course Complete', badge: 'course-complete' }
    ];
    
    // Check which milestones were just reached
    const reachedMilestones = milestones.filter(
      milestone => currentProgress >= milestone.threshold
    );
    
    // Award new achievements (this would check against previously awarded ones)
    for (const milestone of reachedMilestones) {
      await awardAchievement(enrollmentId, milestone);
    }
    
  } catch (error) {
    console.error('Milestone check error:', error);
  }
};

/**
 * Award achievement badge
 */
const awardAchievement = async (enrollmentId, milestone) => {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    const achievement = {
      userId: user.uid,
      enrollmentId,
      badgeId: milestone.badge,
      badgeName: milestone.name,
      awardedAt: serverTimestamp(),
      criteria: `Reached ${milestone.threshold}% course progress`
    };
    
    await addDoc(collection(db, 'achievements'), achievement);
    
    // Log achievement
    await logActivity(user.uid, 'achievement_earned', {
      enrollmentId,
      badgeId: milestone.badge,
      badgeName: milestone.name
    });
    
  } catch (error) {
    console.error('Achievement award error:', error);
  }
};

/**
 * Generate course certificate (placeholder)
 */
const generateCourseCertificate = async (enrollmentId) => {
  try {
    // This would integrate with certificate generation service
    const certificateId = `CERT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    return {
      success: true,
      certificateId,
      certificateUrl: `${window.location.origin}/certificate/${certificateId}`,
      message: 'Certificate generated successfully!'
    };
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Helper Functions
 */

// Generate unique session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Course configuration
const getCourseConfiguration = (courseType) => {
  const configs = {
    '7-day-bootcamp': {
      totalLessons: 35, // 5 lessons per day for 7 days
      estimatedDuration: 7, // days
      modules: 7
    },
    '2-month-premium': {
      totalLessons: 120, // More comprehensive 
      estimatedDuration: 60, // days
      modules: 12
    }
  };
  
  return configs[courseType] || configs['7-day-bootcamp'];
};

// Calculate daily activity pattern
const calculateDailyActivity = (progressRecords) => {
  const dailyStats = {};
  
  progressRecords.forEach(record => {
    if (!record.timestamp) return;
    
    const date = record.timestamp.toDateString();
    if (!dailyStats[date]) {
      dailyStats[date] = {
        date,
        lessonsCompleted: 0,
        timeSpent: 0,
        sessions: 0
      };
    }
    
    dailyStats[date].sessions++;
    dailyStats[date].timeSpent += record.timeSpent || 0;
    if (record.completed) {
      dailyStats[date].lessonsCompleted++;
    }
  });
  
  return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Calculate video engagement metrics
const calculateVideoEngagement = (progressRecords) => {
  const videoRecords = progressRecords.filter(p => p.videoWatchTime > 0);
  
  if (videoRecords.length === 0) {
    return { avgWatchTime: 0, completionRate: 0, engagementScore: 0 };
  }
  
  const totalWatchTime = videoRecords.reduce((sum, p) => sum + p.videoWatchTime, 0);
  const completedVideos = videoRecords.filter(p => p.progressPercentage >= 90).length;
  
  return {
    avgWatchTime: Math.round(totalWatchTime / videoRecords.length),
    completionRate: Math.round((completedVideos / videoRecords.length) * 100),
    engagementScore: Math.round(((totalWatchTime / videoRecords.length) / 300) * 100) // Assuming 5min avg video
  };
};

// Identify strongest topics
const identifyStrongestTopics = (progressRecords) => {
  // This would analyze quiz scores and completion rates by topic
  return ['Network Security', 'System Administration']; // Placeholder
};

// Identify weak areas
const identifyWeakAreas = (progressRecords) => {
  // This would analyze low quiz scores and incomplete lessons
  return ['Cryptography', 'Incident Response']; // Placeholder
};

// Calculate predicted completion
const calculatePredictedCompletion = (currentProgress, learningVelocity, estimatedDuration) => {
  const remainingProgress = 100 - currentProgress;
  const daysRemaining = Math.ceil(remainingProgress / (learningVelocity * 10)); // Rough calculation
  
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysRemaining);
  
  return {
    date: completionDate,
    daysRemaining,
    onTrack: daysRemaining <= estimatedDuration
  };
};

// Calculate achievements
const calculateAchievements = (enrollment, progressRecords) => {
  // This would check against actual achievement records
  return []; // Placeholder
};

// Get next milestone
const getNextMilestone = (currentProgress) => {
  const milestones = [25, 50, 75, 100];
  return milestones.find(m => m > currentProgress) || 100;
};

// Generate learning recommendations
const generateLearningRecommendations = (enrollment, progressRecords) => {
  const recommendations = [];
  
  // Check for inactivity
  const lastActivity = progressRecords[progressRecords.length - 1];
  if (lastActivity) {
    const daysSinceLastActivity = Math.ceil((new Date() - lastActivity.timestamp) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActivity > 3) {
      recommendations.push({
        type: 'engagement',
        message: 'Continue your learning streak! Complete your next lesson today.',
        action: 'Resume Learning'
      });
    }
  }
  
  // Check for quiz performance
  const quizScores = progressRecords.filter(p => p.quizScore !== null);
  if (quizScores.length > 0) {
    const avgScore = quizScores.reduce((sum, p) => sum + p.quizScore, 0) / quizScores.length;
    
    if (avgScore < 70) {
      recommendations.push({
        type: 'performance',
        message: 'Consider reviewing previous lessons to improve your quiz scores.',
        action: 'Review Content'
      });
    }
  }
  
  return recommendations;
};