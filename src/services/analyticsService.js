/**
 * Analytics Service - Comprehensive learning data analytics
 * Handles data collection, processing, aggregation, and insights generation
 * Integrates with Firebase Firestore for real-time analytics
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  arrayUnion,
  increment,
  writeBatch,
  startAfter,
  endBefore
} from 'firebase/firestore';

// Analytics event types
export const ANALYTICS_EVENTS = {
  COURSE_ENROLLMENT: 'course_enrollment',
  COURSE_COMPLETION: 'course_completion',
  LESSON_START: 'lesson_start',
  LESSON_COMPLETE: 'lesson_complete',
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  LEVEL_UP: 'level_up',
  STREAK_MILESTONE: 'streak_milestone',
  CERTIFICATE_DOWNLOAD: 'certificate_download',
  VIDEO_WATCH: 'video_watch',
  PAGE_VIEW: 'page_view',
  SEARCH_QUERY: 'search_query',
  FEATURE_USE: 'feature_use'
};

// Time periods for analytics
export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  ALL_TIME: 'all_time'
};

// Course categories for analytics
export const COURSE_CATEGORIES = {
  DEFENSIVE_SECURITY: 'defensive-security',
  ETHICAL_HACKING: 'ethical-hacking',
  SOC_FUNDAMENTALS: 'soc-fundamentals',
  NETWORK_SECURITY: 'network-security',
  MALWARE_ANALYSIS: 'malware-analysis',
  INCIDENT_RESPONSE: 'incident-response',
  PENETRATION_TESTING: 'penetration-testing',
  GENERAL_SECURITY: 'general-security'
};

/**
 * Initialize Firebase connection
 */
const getFirestore = async () => {
  const { db } = await import('@/config/firebase.js');
  return db;
};

/**
 * Track analytics event
 */
export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const db = await getFirestore();
    const timestamp = new Date();
    
    const eventDoc = {
      eventType,
      eventData,
      timestamp: serverTimestamp(),
      date: timestamp.toISOString().split('T')[0], // YYYY-MM-DD format
      hour: timestamp.getHours(),
      dayOfWeek: timestamp.getDay(),
      month: timestamp.getMonth(),
      year: timestamp.getFullYear()
    };

    // Add to events collection
    await setDoc(doc(db, 'analytics_events', `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`), eventDoc);

    // Update daily aggregates
    await updateDailyAggregates(eventType, eventData, timestamp);

    return { success: true };
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update daily aggregates for faster queries
 */
const updateDailyAggregates = async (eventType, eventData, timestamp) => {
  try {
    const db = await getFirestore();
    const dateKey = timestamp.toISOString().split('T')[0];
    const aggregateRef = doc(db, 'analytics_daily', dateKey);

    const updateData = {
      date: dateKey,
      lastUpdated: serverTimestamp(),
      [`events.${eventType}`]: increment(1)
    };

    // Add specific aggregations based on event type
    switch (eventType) {
      case ANALYTICS_EVENTS.COURSE_ENROLLMENT:
        updateData[`enrollments.${eventData.courseId || 'unknown'}`] = increment(1);
        updateData['totalEnrollments'] = increment(1);
        break;
      case ANALYTICS_EVENTS.QUIZ_COMPLETE:
        updateData['quizCompletions'] = increment(1);
        updateData[`quizScores.${Math.floor(eventData.score / 10) * 10}`] = increment(1);
        break;
      case ANALYTICS_EVENTS.LOGIN:
        updateData['uniqueLogins'] = increment(1);
        break;
      case ANALYTICS_EVENTS.ACHIEVEMENT_UNLOCK:
        updateData['achievementsUnlocked'] = increment(1);
        break;
    }

    await setDoc(aggregateRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating daily aggregates:', error);
  }
};

/**
 * Get overview analytics for dashboard
 */
export const getOverviewAnalytics = async (timePeriod = TIME_PERIODS.LAST_30_DAYS) => {
  try {
    const db = await getFirestore();
    const dateRange = getDateRange(timePeriod);
    
    // Get daily aggregates for the period
    const dailyQuery = query(
      collection(db, 'analytics_daily'),
      where('date', '>=', dateRange.start),
      where('date', '<=', dateRange.end),
      orderBy('date', 'desc')
    );

    const dailySnapshot = await getDocs(dailyQuery);
    const dailyData = [];
    let totals = {
      totalUsers: 0,
      totalEnrollments: 0,
      totalQuizzes: 0,
      totalAchievements: 0,
      avgQuizScore: 0,
      completionRate: 0
    };

    dailySnapshot.forEach(doc => {
      const data = doc.data();
      dailyData.push(data);
      
      totals.totalEnrollments += data.totalEnrollments || 0;
      totals.totalQuizzes += data.quizCompletions || 0;
      totals.totalAchievements += data.achievementsUnlocked || 0;
    });

    // Get user analytics
    const userAnalytics = await getUserAnalytics(timePeriod);
    
    // Calculate additional metrics
    const engagementMetrics = await getEngagementMetrics(timePeriod);
    const courseMetrics = await getCourseMetrics(timePeriod);

    return {
      success: true,
      data: {
        overview: {
          ...totals,
          ...userAnalytics.data,
          timePeriod,
          dateRange
        },
        dailyData,
        engagement: engagementMetrics.data,
        courses: courseMetrics.data
      }
    };
  } catch (error) {
    console.error('Error getting overview analytics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user analytics
 */
export const getUserAnalytics = async (timePeriod = TIME_PERIODS.LAST_30_DAYS) => {
  try {
    const db = await getFirestore();
    
    // Get gamification profiles for user stats
    const profilesQuery = query(collection(db, 'gamification'), limit(1000));
    const profilesSnapshot = await getDocs(profilesQuery);
    
    let activeUsers = 0;
    let newUsers = 0;
    let totalXP = 0;
    let averageLevel = 0;
    const levelDistribution = {};
    
    const dateRange = getDateRange(timePeriod);
    const startDate = new Date(dateRange.start);

    profilesSnapshot.forEach(doc => {
      const profile = doc.data();
      
      // Count active users (users with recent activity)
      if (profile.lastLoginDate && new Date(profile.lastLoginDate.toDate()) >= startDate) {
        activeUsers++;
      }
      
      // Count new users
      if (profile.createdAt && new Date(profile.createdAt.toDate()) >= startDate) {
        newUsers++;
      }
      
      totalXP += profile.totalXP || 0;
      averageLevel += profile.level || 1;
      
      const level = profile.level || 1;
      levelDistribution[level] = (levelDistribution[level] || 0) + 1;
    });

    const totalUsers = profilesSnapshot.size;
    averageLevel = totalUsers > 0 ? averageLevel / totalUsers : 0;

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsers,
        averageLevel: Math.round(averageLevel * 10) / 10,
        totalXP,
        levelDistribution,
        retentionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
      }
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get engagement metrics
 */
export const getEngagementMetrics = async (timePeriod = TIME_PERIODS.LAST_30_DAYS) => {
  try {
    const db = await getFirestore();
    const dateRange = getDateRange(timePeriod);
    
    const eventsQuery = query(
      collection(db, 'analytics_events'),
      where('date', '>=', dateRange.start),
      where('date', '<=', dateRange.end),
      orderBy('date', 'desc'),
      limit(10000)
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const eventsByType = {};
    const eventsByDay = {};
    const eventsByHour = Array(24).fill(0);
    const userSessions = {};

    eventsSnapshot.forEach(doc => {
      const event = doc.data();
      
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      
      // Count by day
      eventsByDay[event.date] = (eventsByDay[event.date] || 0) + 1;
      
      // Count by hour
      if (typeof event.hour === 'number') {
        eventsByHour[event.hour]++;
      }
      
      // Track user sessions
      if (event.eventData?.userEmail) {
        const user = event.eventData.userEmail;
        if (!userSessions[user]) {
          userSessions[user] = [];
        }
        userSessions[user].push(event);
      }
    });

    // Calculate session metrics
    let totalSessions = 0;
    let totalSessionTime = 0;
    Object.values(userSessions).forEach(sessions => {
      totalSessions += sessions.length;
      // Estimate session time based on event frequency
      if (sessions.length > 1) {
        const firstEvent = new Date(sessions[0].timestamp?.toDate() || sessions[0].date);
        const lastEvent = new Date(sessions[sessions.length - 1].timestamp?.toDate() || sessions[sessions.length - 1].date);
        totalSessionTime += Math.max(0, (lastEvent - firstEvent) / (1000 * 60)); // minutes
      }
    });

    const averageSessionTime = totalSessions > 0 ? totalSessionTime / totalSessions : 0;

    return {
      success: true,
      data: {
        eventsByType,
        eventsByDay,
        eventsByHour,
        totalEvents: eventsSnapshot.size,
        uniqueUsers: Object.keys(userSessions).length,
        totalSessions,
        averageSessionTime: Math.round(averageSessionTime),
        mostActiveHour: eventsByHour.indexOf(Math.max(...eventsByHour)),
        peakDay: Object.keys(eventsByDay).reduce((a, b) => eventsByDay[a] > eventsByDay[b] ? a : b, Object.keys(eventsByDay)[0])
      }
    };
  } catch (error) {
    console.error('Error getting engagement metrics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get course performance metrics
 */
export const getCourseMetrics = async (timePeriod = TIME_PERIODS.LAST_30_DAYS) => {
  try {
    const db = await getFirestore();
    const dateRange = getDateRange(timePeriod);
    
    // Get course-related events
    const eventsQuery = query(
      collection(db, 'analytics_events'),
      where('date', '>=', dateRange.start),
      where('date', '<=', dateRange.end),
      orderBy('date', 'desc'),
      limit(10000)
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const courseData = {};
    
    eventsSnapshot.forEach(doc => {
      const event = doc.data();
      const courseId = event.eventData?.courseId;
      
      if (courseId) {
        if (!courseData[courseId]) {
          courseData[courseId] = {
            enrollments: 0,
            completions: 0,
            quizAttempts: 0,
            averageScore: 0,
            totalScore: 0,
            scoreCount: 0
          };
        }
        
        switch (event.eventType) {
          case ANALYTICS_EVENTS.COURSE_ENROLLMENT:
            courseData[courseId].enrollments++;
            break;
          case ANALYTICS_EVENTS.COURSE_COMPLETION:
            courseData[courseId].completions++;
            break;
          case ANALYTICS_EVENTS.QUIZ_COMPLETE:
            courseData[courseId].quizAttempts++;
            if (event.eventData.score !== undefined) {
              courseData[courseId].totalScore += event.eventData.score;
              courseData[courseId].scoreCount++;
            }
            break;
        }
      }
    });

    // Calculate averages and completion rates
    Object.keys(courseData).forEach(courseId => {
      const course = courseData[courseId];
      course.averageScore = course.scoreCount > 0 ? course.totalScore / course.scoreCount : 0;
      course.completionRate = course.enrollments > 0 ? (course.completions / course.enrollments) * 100 : 0;
    });

    // Get quiz-specific metrics
    const quizMetrics = await getQuizMetrics(timePeriod);

    return {
      success: true,
      data: {
        coursePerformance: courseData,
        quizMetrics: quizMetrics.data,
        topCourses: Object.entries(courseData)
          .sort(([,a], [,b]) => b.enrollments - a.enrollments)
          .slice(0, 10)
          .map(([courseId, data]) => ({ courseId, ...data }))
      }
    };
  } catch (error) {
    console.error('Error getting course metrics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get quiz-specific analytics
 */
export const getQuizMetrics = async (timePeriod = TIME_PERIODS.LAST_30_DAYS) => {
  try {
    const db = await getFirestore();
    
    // Get quiz attempts from quiz service
    const quizAttemptsQuery = query(collection(db, 'quizAttempts'), limit(5000));
    const quizAttemptsSnapshot = await getDocs(quizAttemptsQuery);
    
    const quizData = {};
    const scoreDistribution = {};
    let totalAttempts = 0;
    let totalScore = 0;
    let perfectScores = 0;
    
    const dateRange = getDateRange(timePeriod);
    const startDate = new Date(dateRange.start);

    quizAttemptsSnapshot.forEach(doc => {
      const attempt = doc.data();
      const attemptDate = new Date(attempt.completedAt);
      
      if (attemptDate >= startDate) {
        totalAttempts++;
        totalScore += attempt.score || 0;
        
        if (attempt.score === 100) {
          perfectScores++;
        }
        
        // Score distribution
        const scoreRange = Math.floor((attempt.score || 0) / 10) * 10;
        scoreDistribution[scoreRange] = (scoreDistribution[scoreRange] || 0) + 1;
        
        // Quiz-specific data
        if (!quizData[attempt.quizId]) {
          quizData[attempt.quizId] = {
            attempts: 0,
            totalScore: 0,
            perfectScores: 0,
            averageScore: 0
          };
        }
        
        quizData[attempt.quizId].attempts++;
        quizData[attempt.quizId].totalScore += attempt.score || 0;
        if (attempt.score === 100) {
          quizData[attempt.quizId].perfectScores++;
        }
      }
    });

    // Calculate averages
    Object.keys(quizData).forEach(quizId => {
      const quiz = quizData[quizId];
      quiz.averageScore = quiz.attempts > 0 ? quiz.totalScore / quiz.attempts : 0;
      quiz.perfectScoreRate = quiz.attempts > 0 ? (quiz.perfectScores / quiz.attempts) * 100 : 0;
    });

    const averageScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
    const perfectScoreRate = totalAttempts > 0 ? (perfectScores / totalAttempts) * 100 : 0;

    return {
      success: true,
      data: {
        totalAttempts,
        averageScore: Math.round(averageScore * 10) / 10,
        perfectScoreRate: Math.round(perfectScoreRate * 10) / 10,
        scoreDistribution,
        quizPerformance: quizData,
        topPerformingQuizzes: Object.entries(quizData)
          .sort(([,a], [,b]) => b.averageScore - a.averageScore)
          .slice(0, 10)
          .map(([quizId, data]) => ({ quizId, ...data }))
      }
    };
  } catch (error) {
    console.error('Error getting quiz metrics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get learning path analytics
 */
export const getLearningPathAnalytics = async (userEmail) => {
  try {
    const db = await getFirestore();
    
    // Get user's learning events
    const eventsQuery = query(
      collection(db, 'analytics_events'),
      where('eventData.userEmail', '==', userEmail),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const learningPath = [];
    const skillProgress = {};
    const timeSpent = {};
    
    eventsSnapshot.forEach(doc => {
      const event = doc.data();
      learningPath.push({
        eventType: event.eventType,
        timestamp: event.timestamp,
        data: event.eventData
      });
      
      // Track skill progress
      if (event.eventData?.category) {
        const category = event.eventData.category;
        if (!skillProgress[category]) {
          skillProgress[category] = { events: 0, lastActivity: null };
        }
        skillProgress[category].events++;
        skillProgress[category].lastActivity = event.timestamp;
      }
      
      // Track time spent per activity
      if (event.eventData?.timeSpent) {
        const activity = event.eventType;
        timeSpent[activity] = (timeSpent[activity] || 0) + event.eventData.timeSpent;
      }
    });

    return {
      success: true,
      data: {
        learningPath: learningPath.slice(0, 50), // Most recent 50 events
        skillProgress,
        timeSpent,
        totalEvents: learningPath.length,
        learningStreak: calculateLearningStreak(learningPath)
      }
    };
  } catch (error) {
    console.error('Error getting learning path analytics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate learning streak from events
 */
const calculateLearningStreak = (events) => {
  if (!events.length) return 0;
  
  const dates = [...new Set(events.map(e => 
    new Date(e.timestamp?.toDate() || e.timestamp).toDateString()
  ))].sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const dateStr of dates) {
    const eventDate = new Date(dateStr);
    const daysDiff = Math.floor((currentDate - eventDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak + 1) {
      break;
    }
  }
  
  return streak;
};

/**
 * Get date range for time period
 */
const getDateRange = (timePeriod) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (timePeriod) {
    case TIME_PERIODS.TODAY:
      return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    case TIME_PERIODS.YESTERDAY:
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: yesterday.toISOString().split('T')[0],
        end: yesterday.toISOString().split('T')[0]
      };
    case TIME_PERIODS.LAST_7_DAYS:
      const week = new Date(today);
      week.setDate(week.getDate() - 7);
      return {
        start: week.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    case TIME_PERIODS.LAST_30_DAYS:
      const month = new Date(today);
      month.setDate(month.getDate() - 30);
      return {
        start: month.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    case TIME_PERIODS.LAST_90_DAYS:
      const quarter = new Date(today);
      quarter.setDate(quarter.getDate() - 90);
      return {
        start: quarter.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    default:
      const defaultRange = new Date(today);
      defaultRange.setDate(defaultRange.getDate() - 30);
      return {
        start: defaultRange.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
  }
};

/**
 * Export analytics data
 */
export const exportAnalyticsData = async (timePeriod = TIME_PERIODS.LAST_30_DAYS, format = 'json') => {
  try {
    const overview = await getOverviewAnalytics(timePeriod);
    const engagement = await getEngagementMetrics(timePeriod);
    const courses = await getCourseMetrics(timePeriod);
    const users = await getUserAnalytics(timePeriod);

    const exportData = {
      exportedAt: new Date().toISOString(),
      timePeriod,
      overview: overview.data,
      engagement: engagement.data,
      courses: courses.data,
      users: users.data
    };

    if (format === 'csv') {
      return { success: true, data: convertToCSV(exportData), format: 'csv' };
    }

    return { success: true, data: exportData, format: 'json' };
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Convert data to CSV format
 */
const convertToCSV = (data) => {
  // Simple CSV conversion for key metrics
  const rows = [
    ['Metric', 'Value'],
    ['Total Users', data.users.totalUsers],
    ['Active Users', data.users.activeUsers],
    ['New Users', data.users.newUsers],
    ['Total Events', data.engagement.totalEvents],
    ['Average Session Time', data.engagement.averageSessionTime],
    ['Quiz Average Score', data.courses.quizMetrics?.averageScore || 0],
    ['Perfect Score Rate', data.courses.quizMetrics?.perfectScoreRate || 0]
  ];

  return rows.map(row => row.join(',')).join('\n');
};

export default {
  trackEvent,
  getOverviewAnalytics,
  getUserAnalytics,
  getEngagementMetrics,
  getCourseMetrics,
  getQuizMetrics,
  getLearningPathAnalytics,
  exportAnalyticsData,
  ANALYTICS_EVENTS,
  TIME_PERIODS,
  COURSE_CATEGORIES
};