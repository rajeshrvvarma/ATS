/**
 * Email Digest Service
 * Generates AI-personalized weekly activity summaries
 * Phase 4: Week 1-2 - Advanced Notification System
 */

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { generateGeminiResponse } from '../api/gemini.js';

export class EmailDigestService {
  constructor() {
    this.digestTemplates = {
      weekly: {
        subject: '📊 Your Weekly Learning Summary - Agnidhra LMS',
        greeting: 'weekly learning journey',
        timeframe: 'week'
      },
      monthly: {
        subject: '🎯 Your Monthly Progress Report - Agnidhra LMS',
        greeting: 'monthly achievements',
        timeframe: 'month'
      }
    };
  }

  /**
   * Generate personalized email digest for a user
   */
  async generateDigest(userId, type = 'weekly') {
    try {
      console.log(`📧 Generating ${type} digest for user:`, userId);

      // Get user profile and preferences
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Get time range for digest
      const timeRange = this.getTimeRange(type);
      
      // Collect user activity data
      const activityData = await this.collectUserActivity(userId, timeRange);
      
      // Generate AI-personalized content
      const personalizedContent = await this.generatePersonalizedContent(
        userProfile, 
        activityData, 
        type
      );

      // Create email digest object
      const digest = {
        userId,
        type,
        subject: this.digestTemplates[type].subject,
        content: personalizedContent,
        activitySummary: activityData,
        generatedAt: new Date(),
        timeRange
      };

      console.log('✅ Email digest generated successfully');
      return { success: true, data: digest };
    } catch (error) {
      console.error('Error generating email digest:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      
      // Get additional profile data from students collection if available
      try {
        const studentRef = doc(db, 'students', userId);
        const studentDoc = await getDoc(studentRef);
        
        if (studentDoc.exists()) {
          return { ...userData, ...studentDoc.data() };
        }
      } catch (error) {
        console.warn('No student profile found, using user data only');
      }

      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Get time range for digest based on type
   */
  getTimeRange(type) {
    const now = new Date();
    const ranges = {
      weekly: {
        start: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)),
        end: now
      },
      monthly: {
        start: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
        end: now
      }
    };

    return ranges[type] || ranges.weekly;
  }

  /**
   * Collect comprehensive user activity data
   */
  async collectUserActivity(userId, timeRange) {
    try {
      const activity = {
        courses: await this.getCourseActivity(userId, timeRange),
        quizzes: await this.getQuizActivity(userId, timeRange),
        forum: await this.getForumActivity(userId, timeRange),
        achievements: await this.getAchievements(userId, timeRange),
        studyGroups: await this.getStudyGroupActivity(userId, timeRange),
        mentoring: await this.getMentoringActivity(userId, timeRange),
        collaboration: await this.getCollaborationActivity(userId, timeRange),
        notifications: await this.getNotificationActivity(userId, timeRange)
      };

      // Calculate summary statistics
      activity.summary = this.calculateActivitySummary(activity);

      return activity;
    } catch (error) {
      console.error('Error collecting user activity:', error);
      return { summary: { totalActivities: 0, engagementScore: 0 } };
    }
  }

  /**
   * Get course-related activity
   */
  async getCourseActivity(userId, timeRange) {
    try {
      // Get video progress
      const videoProgressRef = collection(db, 'videoProgress');
      const videoQuery = query(
        videoProgressRef,
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(timeRange.start)),
        where('timestamp', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const videoSnapshot = await getDocs(videoQuery);
      const videoProgress = [];
      videoSnapshot.forEach(doc => {
        videoProgress.push({ id: doc.id, ...doc.data() });
      });

      // Get lesson completions
      const lessonProgressRef = collection(db, 'lessonProgress');
      const lessonQuery = query(
        lessonProgressRef,
        where('userId', '==', userId),
        where('completedAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('completedAt', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('completedAt', 'desc'),
        limit(20)
      );

      const lessonSnapshot = await getDocs(lessonQuery);
      const lessonCompletions = [];
      lessonSnapshot.forEach(doc => {
        lessonCompletions.push({ id: doc.id, ...doc.data() });
      });

      return {
        videosWatched: videoProgress.length,
        totalWatchTime: videoProgress.reduce((sum, video) => sum + (video.watchTime || 0), 0),
        lessonsCompleted: lessonCompletions.length,
        coursesActive: [...new Set(lessonCompletions.map(lesson => lesson.courseId))].length
      };
    } catch (error) {
      console.error('Error getting course activity:', error);
      return { videosWatched: 0, totalWatchTime: 0, lessonsCompleted: 0, coursesActive: 0 };
    }
  }

  /**
   * Get quiz activity
   */
  async getQuizActivity(userId, timeRange) {
    try {
      const quizAttemptsRef = collection(db, 'quizAttempts');
      const quizQuery = query(
        quizAttemptsRef,
        where('userId', '==', userId),
        where('completedAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('completedAt', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('completedAt', 'desc'),
        limit(30)
      );

      const snapshot = await getDocs(quizQuery);
      const attempts = [];
      snapshot.forEach(doc => {
        attempts.push({ id: doc.id, ...doc.data() });
      });

      return {
        quizzesAttempted: attempts.length,
        averageScore: attempts.length > 0 
          ? Math.round(attempts.reduce((sum, quiz) => sum + (quiz.percentage || 0), 0) / attempts.length)
          : 0,
        bestScore: Math.max(...attempts.map(quiz => quiz.percentage || 0), 0),
        improvementTrend: this.calculateScoreTrend(attempts)
      };
    } catch (error) {
      console.error('Error getting quiz activity:', error);
      return { quizzesAttempted: 0, averageScore: 0, bestScore: 0, improvementTrend: 'stable' };
    }
  }

  /**
   * Get forum activity
   */
  async getForumActivity(userId, timeRange) {
    try {
      // Get forum posts
      const postsRef = collection(db, 'forumPosts');
      const postsQuery = query(
        postsRef,
        where('authorId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('createdAt', 'desc')
      );

      const postsSnapshot = await getDocs(postsQuery);
      const posts = [];
      postsSnapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      // Get forum replies
      const repliesRef = collection(db, 'forumReplies');
      const repliesQuery = query(
        repliesRef,
        where('authorId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('createdAt', 'desc')
      );

      const repliesSnapshot = await getDocs(repliesQuery);
      const replies = [];
      repliesSnapshot.forEach(doc => {
        replies.push({ id: doc.id, ...doc.data() });
      });

      return {
        postsCreated: posts.length,
        repliesPosted: replies.length,
        totalEngagement: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
        helpfulReplies: replies.filter(reply => reply.helpful).length
      };
    } catch (error) {
      console.error('Error getting forum activity:', error);
      return { postsCreated: 0, repliesPosted: 0, totalEngagement: 0, helpfulReplies: 0 };
    }
  }

  /**
   * Get achievements earned in time range
   */
  async getAchievements(userId, timeRange) {
    try {
      const achievementsRef = collection(db, 'userAchievements');
      const achievementsQuery = query(
        achievementsRef,
        where('userId', '==', userId),
        where('unlockedAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('unlockedAt', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('unlockedAt', 'desc')
      );

      const snapshot = await getDocs(achievementsQuery);
      const achievements = [];
      snapshot.forEach(doc => {
        achievements.push({ id: doc.id, ...doc.data() });
      });

      return {
        newAchievements: achievements.length,
        achievements: achievements.map(achievement => ({
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          points: achievement.points
        }))
      };
    } catch (error) {
      console.error('Error getting achievements:', error);
      return { newAchievements: 0, achievements: [] };
    }
  }

  /**
   * Get study group activity
   */
  async getStudyGroupActivity(userId, timeRange) {
    try {
      // Get study group participations
      const participationsRef = collection(db, 'studyGroupParticipations');
      const participationsQuery = query(
        participationsRef,
        where('userId', '==', userId),
        where('joinedAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('joinedAt', '<=', Timestamp.fromDate(timeRange.end))
      );

      const snapshot = await getDocs(participationsQuery);
      const participations = [];
      snapshot.forEach(doc => {
        participations.push({ id: doc.id, ...doc.data() });
      });

      return {
        groupsJoined: participations.length,
        activeGroups: participations.filter(p => p.status === 'active').length
      };
    } catch (error) {
      console.error('Error getting study group activity:', error);
      return { groupsJoined: 0, activeGroups: 0 };
    }
  }

  /**
   * Get mentoring activity
   */
  async getMentoringActivity(userId, timeRange) {
    try {
      // Check if user is a mentor or mentee
      const mentorshipsRef = collection(db, 'mentorships');
      const mentorQuery = query(
        mentorshipsRef,
        where('mentorId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start))
      );

      const menteeQuery = query(
        mentorshipsRef,
        where('menteeId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start))
      );

      const [mentorSnapshot, menteeSnapshot] = await Promise.all([
        getDocs(mentorQuery),
        getDocs(menteeQuery)
      ]);

      return {
        asMentor: mentorSnapshot.size,
        asMentee: menteeSnapshot.size,
        totalMentoring: mentorSnapshot.size + menteeSnapshot.size
      };
    } catch (error) {
      console.error('Error getting mentoring activity:', error);
      return { asMentor: 0, asMentee: 0, totalMentoring: 0 };
    }
  }

  /**
   * Get collaboration activity
   */
  async getCollaborationActivity(userId, timeRange) {
    try {
      const collaborationsRef = collection(db, 'collaborationSessions');
      const collaborationsQuery = query(
        collaborationsRef,
        where('participants', 'array-contains', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end))
      );

      const snapshot = await getDocs(collaborationsQuery);
      
      return {
        sessionsParticipated: snapshot.size,
        collaborativeHours: snapshot.size * 1.5 // Estimated average session length
      };
    } catch (error) {
      console.error('Error getting collaboration activity:', error);
      return { sessionsParticipated: 0, collaborativeHours: 0 };
    }
  }

  /**
   * Get notification engagement activity
   */
  async getNotificationActivity(userId, timeRange) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const notificationsQuery = query(
        notificationsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end))
      );

      const snapshot = await getDocs(notificationsQuery);
      let totalNotifications = 0;
      let readNotifications = 0;
      let clickedNotifications = 0;

      snapshot.forEach(doc => {
        const notification = doc.data();
        totalNotifications++;
        if (notification.read) readNotifications++;
        if (notification.clicked) clickedNotifications++;
      });

      return {
        totalReceived: totalNotifications,
        readRate: totalNotifications > 0 ? Math.round((readNotifications / totalNotifications) * 100) : 0,
        clickRate: totalNotifications > 0 ? Math.round((clickedNotifications / totalNotifications) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting notification activity:', error);
      return { totalReceived: 0, readRate: 0, clickRate: 0 };
    }
  }

  /**
   * Calculate activity summary statistics
   */
  calculateActivitySummary(activity) {
    const totalActivities = 
      activity.courses.lessonsCompleted +
      activity.quizzes.quizzesAttempted +
      activity.forum.postsCreated +
      activity.forum.repliesPosted +
      activity.achievements.newAchievements +
      activity.studyGroups.groupsJoined +
      activity.mentoring.totalMentoring +
      activity.collaboration.sessionsParticipated;

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(100, Math.round(
      (activity.courses.lessonsCompleted * 5) +
      (activity.quizzes.quizzesAttempted * 3) +
      (activity.forum.postsCreated * 4) +
      (activity.forum.repliesPosted * 2) +
      (activity.achievements.newAchievements * 10) +
      (activity.studyGroups.groupsJoined * 8) +
      (activity.mentoring.totalMentoring * 15) +
      (activity.collaboration.sessionsParticipated * 6)
    ));

    return {
      totalActivities,
      engagementScore,
      learningStreak: this.calculateLearningStreak(activity),
      topCategory: this.getTopActivityCategory(activity)
    };
  }

  /**
   * Calculate score improvement trend
   */
  calculateScoreTrend(attempts) {
    if (attempts.length < 2) return 'insufficient-data';
    
    const recentAvg = attempts.slice(0, Math.ceil(attempts.length / 2))
      .reduce((sum, quiz) => sum + (quiz.percentage || 0), 0) / Math.ceil(attempts.length / 2);
    
    const olderAvg = attempts.slice(Math.ceil(attempts.length / 2))
      .reduce((sum, quiz) => sum + (quiz.percentage || 0), 0) / Math.floor(attempts.length / 2);
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  /**
   * Calculate learning streak
   */
  calculateLearningStreak(activity) {
    // Simple calculation based on daily activity
    const dailyActivity = activity.courses.lessonsCompleted + activity.quizzes.quizzesAttempted;
    return Math.min(7, Math.floor(dailyActivity / 2)); // Max 7-day streak shown
  }

  /**
   * Get top activity category
   */
  getTopActivityCategory(activity) {
    const categories = {
      'Course Learning': activity.courses.lessonsCompleted + activity.courses.videosWatched,
      'Quiz Practice': activity.quizzes.quizzesAttempted,
      'Community Engagement': activity.forum.postsCreated + activity.forum.repliesPosted,
      'Collaborative Learning': activity.studyGroups.groupsJoined + activity.collaboration.sessionsParticipated,
      'Mentorship': activity.mentoring.totalMentoring
    };

    return Object.entries(categories).reduce((a, b) => categories[a[0]] > categories[b[0]] ? a : b)[0];
  }

  /**
   * Generate AI-personalized content using Gemini
   */
  async generatePersonalizedContent(userProfile, activityData, digestType) {
    try {
      const prompt = this.createDigestPrompt(userProfile, activityData, digestType);
      
      const aiResponse = await generateGeminiResponse(prompt);
      
      // Parse and structure the AI response
      return this.parseDigestContent(aiResponse, activityData);
    } catch (error) {
      console.error('Error generating personalized content:', error);
      // Fallback to template-based content
      return this.generateFallbackContent(userProfile, activityData, digestType);
    }
  }

  /**
   * Create prompt for AI digest generation
   */
  createDigestPrompt(userProfile, activityData, digestType) {
    return `
Create a personalized ${digestType} learning digest email for a cybersecurity student.

STUDENT PROFILE:
- Name: ${userProfile.name || userProfile.displayName || 'Student'}
- Level: ${userProfile.currentLevel || 'Beginner'}
- Interests: ${userProfile.interests?.join(', ') || 'General Cybersecurity'}
- Goals: ${userProfile.learningGoals?.join(', ') || 'Skill Development'}

ACTIVITY SUMMARY:
- Lessons Completed: ${activityData.courses.lessonsCompleted}
- Videos Watched: ${activityData.courses.videosWatched}
- Watch Time: ${Math.round(activityData.courses.totalWatchTime / 60)} minutes
- Quizzes Attempted: ${activityData.quizzes.quizzesAttempted}
- Average Quiz Score: ${activityData.quizzes.averageScore}%
- Score Trend: ${activityData.quizzes.improvementTrend}
- Forum Posts: ${activityData.forum.postsCreated}
- Forum Replies: ${activityData.forum.repliesPosted}
- New Achievements: ${activityData.achievements.newAchievements}
- Study Groups Joined: ${activityData.studyGroups.groupsJoined}
- Mentoring Sessions: ${activityData.mentoring.totalMentoring}
- Collaboration Sessions: ${activityData.collaboration.sessionsParticipated}
- Engagement Score: ${activityData.summary.engagementScore}/100
- Top Activity: ${activityData.summary.topCategory}

Generate a comprehensive, encouraging, and personalized email digest that includes:

1. **Personal Greeting** - Warm, personalized opening
2. **Week/Month Highlights** - Top 3-4 achievements and progress
3. **Progress Analysis** - Insights into learning patterns and improvements
4. **Achievement Celebrations** - Specific recognition of accomplishments
5. **Learning Insights** - AI-driven observations about their learning style
6. **Recommendations** - 2-3 specific next steps or suggested content
7. **Community Spotlight** - Recognition of social learning participation
8. **Motivational Closing** - Encouraging message aligned with their goals

Make the tone:
- Professional yet friendly
- Encouraging and motivating
- Data-driven but human
- Specific to cybersecurity learning
- Appropriate for their skill level

Include relevant cybersecurity industry insights and learning tips.
Use emojis sparingly but effectively.
Keep sections concise but meaningful.

Format as clean HTML email content ready for sending.
`;
  }

  /**
   * Parse AI-generated digest content
   */
  parseDigestContent(aiResponse, activityData) {
    // Basic parsing - in production, you'd want more sophisticated parsing
    return {
      htmlContent: aiResponse,
      textContent: aiResponse.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      personalizedInsights: this.extractInsights(aiResponse),
      recommendations: this.extractRecommendations(aiResponse),
      activityHighlights: this.generateActivityHighlights(activityData)
    };
  }

  /**
   * Extract insights from AI response (simplified)
   */
  extractInsights(content) {
    // This would use more sophisticated NLP in production
    const insights = [];
    
    if (content.includes('improvement') || content.includes('progress')) {
      insights.push('showing-improvement');
    }
    
    if (content.includes('consistent') || content.includes('regular')) {
      insights.push('consistent-learner');
    }
    
    if (content.includes('community') || content.includes('collaboration')) {
      insights.push('community-engaged');
    }
    
    return insights;
  }

  /**
   * Extract recommendations from AI response
   */
  extractRecommendations(content) {
    // Simplified extraction - would be more sophisticated in production
    const recommendations = [];
    
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('try')) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations.slice(0, 3); // Top 3 recommendations
  }

  /**
   * Generate activity highlights summary
   */
  generateActivityHighlights(activityData) {
    const highlights = [];
    
    if (activityData.courses.lessonsCompleted > 0) {
      highlights.push(`Completed ${activityData.courses.lessonsCompleted} lessons`);
    }
    
    if (activityData.quizzes.averageScore > 80) {
      highlights.push(`Excellent quiz performance: ${activityData.quizzes.averageScore}% average`);
    }
    
    if (activityData.achievements.newAchievements > 0) {
      highlights.push(`Unlocked ${activityData.achievements.newAchievements} new achievements`);
    }
    
    if (activityData.forum.postsCreated + activityData.forum.repliesPosted > 0) {
      highlights.push(`Active community participant`);
    }
    
    return highlights;
  }

  /**
   * Generate fallback content when AI fails
   */
  generateFallbackContent(userProfile, activityData, digestType) {
    const userName = userProfile.name || userProfile.displayName || 'Student';
    
    return {
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🎯 Your ${digestType.charAt(0).toUpperCase() + digestType.slice(1)} Learning Summary</h2>
          
          <p>Hi ${userName},</p>
          
          <p>Here's your personalized learning summary:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Activity Highlights</h3>
            <ul>
              <li>Lessons completed: ${activityData.courses.lessonsCompleted}</li>
              <li>Quizzes attempted: ${activityData.quizzes.quizzesAttempted}</li>
              <li>Average score: ${activityData.quizzes.averageScore}%</li>
              <li>New achievements: ${activityData.achievements.newAchievements}</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🚀 Keep it up!</h3>
            <p>Your engagement score is ${activityData.summary.engagementScore}/100. 
               You're most active in ${activityData.summary.topCategory}.</p>
          </div>
          
          <p>Keep up the excellent work in your cybersecurity learning journey!</p>
          
          <p>Best regards,<br>The Agnidhra Team</p>
        </div>
      `,
      textContent: `Your ${digestType} Learning Summary\n\nHi ${userName},\n\nActivity Highlights:\n- Lessons completed: ${activityData.courses.lessonsCompleted}\n- Quizzes attempted: ${activityData.quizzes.quizzesAttempted}\n- Average score: ${activityData.quizzes.averageScore}%\n\nKeep up the excellent work!\n\nBest regards,\nThe Agnidhra Team`,
      personalizedInsights: ['consistent-learner'],
      recommendations: ['Continue your current learning path', 'Try participating more in community discussions'],
      activityHighlights: this.generateActivityHighlights(activityData)
    };
  }

  /**
   * Schedule digest generation for all eligible users
   */
  async scheduleDigestGeneration(digestType = 'weekly') {
    try {
      console.log(`📅 Scheduling ${digestType} digest generation...`);
      
      // Get all users with email notifications enabled
      const usersRef = collection(db, 'users');
      const usersQuery = query(
        usersRef,
        where('notificationPreferences.emailEnabled', '==', true),
        where(`notificationPreferences.digestFrequency`, '==', digestType)
      );

      const snapshot = await getDocs(usersQuery);
      const eligibleUsers = [];
      
      snapshot.forEach(doc => {
        eligibleUsers.push({ id: doc.id, ...doc.data() });
      });

      console.log(`📧 Found ${eligibleUsers.length} users eligible for ${digestType} digest`);

      // Generate digests for all eligible users
      const digestPromises = eligibleUsers.map(user => 
        this.generateDigest(user.id, digestType)
      );

      const results = await Promise.allSettled(digestPromises);
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;

      console.log(`✅ Successfully generated ${successful}/${eligibleUsers.length} digests`);
      
      return { 
        success: true, 
        data: { 
          eligible: eligibleUsers.length, 
          successful, 
          failed: eligibleUsers.length - successful 
        } 
      };
    } catch (error) {
      console.error('Error scheduling digest generation:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const emailDigestService = new EmailDigestService();

// Export convenience functions
export const generateWeeklyDigest = (userId) => emailDigestService.generateDigest(userId, 'weekly');
export const generateMonthlyDigest = (userId) => emailDigestService.generateDigest(userId, 'monthly');
export const scheduleWeeklyDigests = () => emailDigestService.scheduleDigestGeneration('weekly');
export const scheduleMonthlyDigests = () => emailDigestService.scheduleDigestGeneration('monthly');

export default emailDigestService;