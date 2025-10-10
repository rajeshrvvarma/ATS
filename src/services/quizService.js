/**
 * Quiz Service - Manages quiz data and operations using Firebase
 * Uses Firestore free tier for quiz storage and scoring
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';

// Quiz categories for different cybersecurity domains
export const QUIZ_CATEGORIES = {
  DEFENSIVE_SECURITY: 'defensive-security',
  ETHICAL_HACKING: 'ethical-hacking',
  SOC_FUNDAMENTALS: 'soc-fundamentals',
  NETWORK_SECURITY: 'network-security',
  MALWARE_ANALYSIS: 'malware-analysis',
  INCIDENT_RESPONSE: 'incident-response',
  PENETRATION_TESTING: 'penetration-testing',
  GENERAL_SECURITY: 'general-security'
};

// Quiz difficulty levels
export const QUIZ_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Question types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  FILL_BLANK: 'fill-blank',
  CODE_SNIPPET: 'code-snippet'
};

/**
 * Get all available quizzes
 */
export const getAvailableQuizzes = async () => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const querySnapshot = await getDocs(quizzesRef);
    
    const quizzes = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get quiz by ID with questions
 */
export const getQuizById = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);
    
    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }
    
    const quizData = { id: quizDoc.id, ...quizDoc.data() };
    
    // Get questions for this quiz
    const questionsRef = collection(db, 'quizzes', quizId, 'questions');
    const questionsSnapshot = await getDocs(questionsRef);
    
    const questions = [];
    questionsSnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    quizData.questions = questions.sort((a, b) => a.order - b.order);
    
    return { success: true, data: quizData };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get quizzes by category
 */
export const getQuizzesByCategory = async (category) => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
    const quizzes = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error fetching quizzes by category:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit quiz attempt and calculate score
 */
export const submitQuizAttempt = async (quizId, userId, answers, userEmail) => {
  try {
    // Get quiz with correct answers
    const quizResult = await getQuizById(quizId);
    if (!quizResult.success) {
      throw new Error('Quiz not found');
    }
    
    const quiz = quizResult.data;
    let score = 0;
    let totalQuestions = quiz.questions.length;
    const results = [];
    
    // Calculate score
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) {
        score++;
      }
      
      results.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.explanation || ''
      });
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= (quiz.passingScore || 70);
    
    // Save attempt to Firestore
    const attemptData = {
      quizId,
      userId,
      userEmail,
      score,
      totalQuestions,
      percentage,
      passed,
      results,
      completedAt: serverTimestamp(),
      timeSpent: Date.now() // This would be calculated from start time
    };
    
    const attemptsRef = collection(db, 'quizAttempts');
    const attemptDoc = await addDoc(attemptsRef, attemptData);
    
    // Update user quiz progress
    await updateUserQuizProgress(userId, quizId, {
      lastAttemptId: attemptDoc.id,
      bestScore: percentage,
      attempts: 1, // This should increment existing attempts
      completed: passed
    });
    
    return {
      success: true,
      data: {
        attemptId: attemptDoc.id,
        score,
        totalQuestions,
        percentage,
        passed,
        results
      }
    };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user quiz progress
 */
export const updateUserQuizProgress = async (userId, quizId, progressData) => {
  try {
    const progressRef = doc(db, 'userQuizProgress', `${userId}_${quizId}`);
    const progressDoc = await getDoc(progressRef);
    
    let updateData = {
      userId,
      quizId,
      updatedAt: serverTimestamp(),
      ...progressData
    };
    
    if (progressDoc.exists()) {
      const existingData = progressDoc.data();
      updateData.attempts = (existingData.attempts || 0) + 1;
      updateData.bestScore = Math.max(existingData.bestScore || 0, progressData.bestScore || 0);
    } else {
      updateData.attempts = 1;
      updateData.firstAttemptAt = serverTimestamp();
    }
    
    await setDoc(progressRef, updateData, { merge: true });
    
    return { success: true, data: updateData };
  } catch (error) {
    console.error('Error updating user quiz progress:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user quiz progress
 */
export const getUserQuizProgress = async (userId, quizId = null) => {
  try {
    if (quizId) {
      // Get specific quiz progress
      const progressRef = doc(db, 'userQuizProgress', `${userId}_${quizId}`);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        return { success: true, data: { id: progressDoc.id, ...progressDoc.data() } };
      } else {
        return { success: true, data: null };
      }
    } else {
      // Get all quiz progress for user
      const progressRef = collection(db, 'userQuizProgress');
      const q = query(progressRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const progress = [];
      querySnapshot.forEach((doc) => {
        progress.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: progress };
    }
  } catch (error) {
    console.error('Error fetching user quiz progress:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get quiz leaderboard
 */
export const getQuizLeaderboard = async (quizId, limitCount = 10) => {
  try {
    const attemptsRef = collection(db, 'quizAttempts');
    const q = query(
      attemptsRef,
      where('quizId', '==', quizId),
      where('passed', '==', true),
      orderBy('percentage', 'desc'),
      orderBy('timeSpent', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: doc.id,
        userEmail: data.userEmail,
        percentage: data.percentage,
        timeSpent: data.timeSpent,
        completedAt: data.completedAt
      });
    });
    
    return { success: true, data: leaderboard };
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create sample quizzes (for initial setup)
 */
export const createSampleQuizzes = async () => {
  try {
    const sampleQuizzes = [
      {
        id: 'soc-fundamentals-quiz-1',
        title: 'SOC Fundamentals - Basic Concepts',
        description: 'Test your understanding of Security Operations Center fundamentals',
        category: QUIZ_CATEGORIES.SOC_FUNDAMENTALS,
        difficulty: QUIZ_DIFFICULTY.BEGINNER,
        passingScore: 70,
        timeLimit: 600, // 10 minutes
        questionsCount: 5,
        createdAt: serverTimestamp(),
        active: true
      },
      {
        id: 'ethical-hacking-basics',
        title: 'Ethical Hacking Basics',
        description: 'Fundamental concepts of ethical hacking and penetration testing',
        category: QUIZ_CATEGORIES.ETHICAL_HACKING,
        difficulty: QUIZ_DIFFICULTY.BEGINNER,
        passingScore: 70,
        timeLimit: 900, // 15 minutes
        questionsCount: 7,
        createdAt: serverTimestamp(),
        active: true
      }
    ];
    
    const createdQuizzes = [];
    
    for (const quizData of sampleQuizzes) {
      const quizRef = doc(db, 'quizzes', quizData.id);
      await setDoc(quizRef, quizData);
      createdQuizzes.push(quizData);
      
      // Add sample questions
      await createSampleQuestions(quizData.id, quizData.category);
    }
    
    return { success: true, data: createdQuizzes };
  } catch (error) {
    console.error('Error creating sample quizzes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create sample questions for a quiz
 */
export const createSampleQuestions = async (quizId, category) => {
  try {
    let sampleQuestions = [];
    
    if (category === QUIZ_CATEGORIES.SOC_FUNDAMENTALS) {
      sampleQuestions = [
        {
          order: 1,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "What does SOC stand for in cybersecurity?",
          options: [
            "Security Operations Center",
            "System Operations Control",
            "Software Operations Center",
            "Security Organizational Committee"
          ],
          correctAnswer: 0,
          explanation: "SOC stands for Security Operations Center, which is a centralized unit that deals with security issues on an organizational and technical level."
        },
        {
          order: 2,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "Which of the following is a primary function of a SOC?",
          options: [
            "Software development",
            "Network monitoring and incident response",
            "Human resources management",
            "Financial accounting"
          ],
          correctAnswer: 1,
          explanation: "Network monitoring and incident response are core functions of a SOC, along with threat detection and security analysis."
        },
        {
          order: 3,
          type: QUESTION_TYPES.TRUE_FALSE,
          question: "A SOC analyst typically works only during business hours.",
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. SOC operations typically run 24/7 to provide continuous security monitoring and incident response."
        },
        {
          order: 4,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "What is SIEM in the context of SOC operations?",
          options: [
            "Security Information and Event Management",
            "System Integration and Error Monitoring",
            "Software Installation and Equipment Maintenance",
            "Security Intelligence and Encryption Management"
          ],
          correctAnswer: 0,
          explanation: "SIEM stands for Security Information and Event Management, a key technology used in SOCs for log collection, analysis, and correlation."
        },
        {
          order: 5,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "Which tier of SOC analyst typically handles initial alert triage?",
          options: [
            "Tier 3 (Senior Analyst)",
            "Tier 1 (Junior Analyst)", 
            "Tier 2 (Incident Responder)",
            "All tiers equally"
          ],
          correctAnswer: 1,
          explanation: "Tier 1 analysts typically handle initial alert triage and basic incident classification before escalating to higher tiers."
        }
      ];
    } else if (category === QUIZ_CATEGORIES.ETHICAL_HACKING) {
      sampleQuestions = [
        {
          order: 1,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "What is the primary difference between ethical hacking and malicious hacking?",
          options: [
            "Technical skills used",
            "Authorization and intent",
            "Tools and techniques",
            "Time of day performed"
          ],
          correctAnswer: 1,
          explanation: "The key difference is authorization and intent - ethical hackers have explicit permission and aim to improve security."
        },
        {
          order: 2,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "Which phase comes first in the ethical hacking methodology?",
          options: [
            "Scanning",
            "Reconnaissance",
            "Gaining Access",
            "Maintaining Access"
          ],
          correctAnswer: 1,
          explanation: "Reconnaissance (information gathering) is typically the first phase in ethical hacking methodology."
        },
        {
          order: 3,
          type: QUESTION_TYPES.TRUE_FALSE,
          question: "Ethical hackers must always obtain written permission before testing.",
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "True. Written authorization is essential for ethical hacking to distinguish it from illegal activities."
        },
        {
          order: 4,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "What does CVE stand for in cybersecurity?",
          options: [
            "Computer Virus Encyclopedia",
            "Common Vulnerabilities and Exposures",
            "Certified Vulnerability Expert",
            "Critical Vector Evaluation"
          ],
          correctAnswer: 1,
          explanation: "CVE stands for Common Vulnerabilities and Exposures, a standardized system for identifying known security vulnerabilities."
        },
        {
          order: 5,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "Which tool is commonly used for network scanning in ethical hacking?",
          options: [
            "Microsoft Word",
            "Nmap",
            "Adobe Photoshop",
            "Google Chrome"
          ],
          correctAnswer: 1,
          explanation: "Nmap is a widely used network scanning tool for discovering hosts and services on a network."
        },
        {
          order: 6,
          type: QUESTION_TYPES.TRUE_FALSE,
          question: "Social engineering is not considered part of ethical hacking.",
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. Social engineering testing is often part of comprehensive ethical hacking assessments when authorized."
        },
        {
          order: 7,
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          question: "What should an ethical hacker do after completing a penetration test?",
          options: [
            "Delete all evidence",
            "Publish findings online",
            "Create a detailed report for the client",
            "Keep the vulnerabilities secret"
          ],
          correctAnswer: 2,
          explanation: "Creating a detailed report with findings, risks, and remediation recommendations is crucial for helping the client improve security."
        }
      ];
    }
    
    // Add questions to the quiz
    for (const questionData of sampleQuestions) {
      const questionRef = doc(db, 'quizzes', quizId, 'questions', `question_${questionData.order}`);
      await setDoc(questionRef, questionData);
    }
    
    return { success: true, data: sampleQuestions };
  } catch (error) {
    console.error('Error creating sample questions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get comprehensive user quiz analytics
 */
export const getUserQuizAnalytics = async (userId, timeRange = '30d') => {
  try {
    // Get user's quiz attempts
    const attemptsRef = collection(db, 'quizAttempts');
    let q = query(attemptsRef, where('userId', '==', userId));
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const days = parseInt(timeRange.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      q = query(q, where('completedAt', '>=', startDate));
    }
    
    const attemptsSnapshot = await getDocs(q);
    const attempts = [];
    attemptsSnapshot.forEach((doc) => {
      attempts.push({ id: doc.id, ...doc.data() });
    });

    if (attempts.length === 0) {
      return { success: true, data: null };
    }

    // Calculate analytics
    const totalQuizzes = attempts.length;
    const passedQuizzes = attempts.filter(a => a.passed).length;
    const totalScore = attempts.reduce((sum, a) => sum + a.percentage, 0);
    const averageScore = Math.round(totalScore / totalQuizzes);
    const totalTimeSpent = attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

    // Get recent attempts (last 5)
    const recentAttempts = attempts
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map(attempt => ({
        ...attempt,
        quizTitle: attempt.quizTitle || 'Unknown Quiz'
      }));

    // Calculate best scores
    const quizBestScores = {};
    attempts.forEach(attempt => {
      const quizId = attempt.quizId;
      if (!quizBestScores[quizId] || attempt.percentage > quizBestScores[quizId].percentage) {
        quizBestScores[quizId] = attempt;
      }
    });
    
    const bestScores = Object.values(quizBestScores)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
      .map(attempt => ({
        quizTitle: attempt.quizTitle || 'Unknown Quiz',
        percentage: attempt.percentage
      }));

    // Calculate category performance
    const categoryStats = {};
    attempts.forEach(attempt => {
      const category = attempt.category || 'general-security';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          scores: [],
          count: 0
        };
      }
      categoryStats[category].scores.push(attempt.percentage);
      categoryStats[category].count++;
    });

    const categoryPerformance = Object.values(categoryStats).map(cat => ({
      name: cat.name,
      averageScore: Math.round(cat.scores.reduce((sum, score) => sum + score, 0) / cat.scores.length),
      quizzesTaken: cat.count
    }));

    // Generate improvement areas (categories with scores below 75%)
    const improvementAreas = categoryPerformance
      .filter(cat => cat.averageScore < 75)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3)
      .map(cat => ({
        category: cat.name,
        averageScore: cat.averageScore
      }));

    // Generate personalized recommendations
    const recommendations = [];
    
    if (averageScore < 70) {
      recommendations.push({
        title: "Focus on Fundamentals",
        description: "Your overall average is below 70%. Consider reviewing basic cybersecurity concepts before attempting advanced quizzes.",
        priority: "high"
      });
    }

    if (improvementAreas.length > 0) {
      recommendations.push({
        title: `Improve ${improvementAreas[0].category} Knowledge`,
        description: `Your ${improvementAreas[0].category} score is ${improvementAreas[0].averageScore}%. Focus on this area for significant improvement.`,
        priority: "medium"
      });
    }

    if (passedQuizzes / totalQuizzes > 0.8) {
      recommendations.push({
        title: "Try Advanced Level Quizzes",
        description: "You're doing great! Challenge yourself with more advanced cybersecurity topics.",
        priority: "low"
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: "Keep Up the Great Work!",
        description: "Your performance is solid. Continue practicing regularly to maintain your skills.",
        priority: "low"
      });
    }

    const analytics = {
      totalQuizzes,
      passedQuizzes,
      averageScore,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      recentAttempts,
      bestScores,
      categoryPerformance,
      improvementAreas,
      recommendations
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error('Error fetching user quiz analytics:', error);
    return { success: false, error: error.message };
  }
};