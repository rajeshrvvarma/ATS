/**
 * Peer Mentoring Service - AI-Powered Student Matching System
 * Connects students for mentorship based on skills, experience, and learning goals
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
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { generateGeminiResponse } from '@/api/gemini.js';

// Mentoring status types
export const MENTORING_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  UNAVAILABLE: 'unavailable'
};

// Request status types
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Mentoring categories
export const MENTORING_CATEGORIES = {
  DEFENSIVE_SECURITY: 'defensive-security',
  ETHICAL_HACKING: 'ethical-hacking',
  NETWORK_SECURITY: 'network-security',
  INCIDENT_RESPONSE: 'incident-response',
  COMPLIANCE: 'compliance',
  CAREER_GUIDANCE: 'career-guidance',
  CERTIFICATION_PREP: 'certification-prep',
  TECHNICAL_SKILLS: 'technical-skills',
  SOFT_SKILLS: 'soft-skills',
  INTERVIEW_PREP: 'interview-prep'
};

// Experience levels
export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

/**
 * Create or update mentor profile
 */
export const createMentorProfile = async (userId, userName, profileData) => {
  try {
    const mentorProfile = {
      userId,
      userName,
      bio: profileData.bio || '',
      expertise: profileData.expertise || [],
      experience: profileData.experience || EXPERIENCE_LEVELS.INTERMEDIATE,
      categories: profileData.categories || [],
      availableHours: profileData.availableHours || [],
      timezone: profileData.timezone || 'Asia/Kolkata',
      preferredMeetingType: profileData.preferredMeetingType || 'virtual',
      maxMentees: profileData.maxMentees || 3,
      currentMentees: 0,
      status: MENTORING_STATUS.AVAILABLE,
      languages: profileData.languages || ['English'],
      achievements: profileData.achievements || [],
      linkedIn: profileData.linkedIn || '',
      github: profileData.github || '',
      rating: 0,
      totalReviews: 0,
      totalSessions: 0,
      successfulMatches: 0,
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      isVerified: false
    };

    const mentorRef = doc(db, 'mentors', userId);
    await setDoc(mentorRef, mentorProfile, { merge: true });

    return { success: true, data: mentorProfile };
  } catch (error) {
    console.error('Error creating mentor profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create mentee profile
 */
export const createMenteeProfile = async (userId, userName, profileData) => {
  try {
    const menteeProfile = {
      userId,
      userName,
      bio: profileData.bio || '',
      currentLevel: profileData.currentLevel || EXPERIENCE_LEVELS.BEGINNER,
      learningGoals: profileData.learningGoals || [],
      interestedCategories: profileData.interestedCategories || [],
      availableHours: profileData.availableHours || [],
      timezone: profileData.timezone || 'Asia/Kolkata',
      preferredMeetingType: profileData.preferredMeetingType || 'virtual',
      languages: profileData.languages || ['English'],
      currentCourses: profileData.currentCourses || [],
      careerGoals: profileData.careerGoals || '',
      hasActiveMentor: false,
      currentMentorId: null,
      completedSessions: 0,
      totalHoursLearned: 0,
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp()
    };

    const menteeRef = doc(db, 'mentees', userId);
    await setDoc(menteeRef, menteeProfile, { merge: true });

    return { success: true, data: menteeProfile };
  } catch (error) {
    console.error('Error creating mentee profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * AI-powered mentor matching algorithm
 */
export const findBestMentors = async (menteeId, preferences = {}) => {
  try {
    // Get mentee profile
    const menteeRef = doc(db, 'mentees', menteeId);
    const menteeDoc = await getDoc(menteeRef);
    
    if (!menteeDoc.exists()) {
      throw new Error('Mentee profile not found');
    }

    const menteeData = menteeDoc.data();

    // Get available mentors
    const mentorsRef = collection(db, 'mentors');
    const availableMentorsQuery = query(
      mentorsRef,
      where('status', '==', MENTORING_STATUS.AVAILABLE),
      where('currentMentees', '<', 999), // Will filter properly in code
      orderBy('rating', 'desc'),
      limit(20)
    );

    const mentorsSnapshot = await getDocs(availableMentorsQuery);
    const availableMentors = [];

    mentorsSnapshot.forEach(doc => {
      const mentorData = doc.data();
      if (mentorData.currentMentees < mentorData.maxMentees) {
        availableMentors.push({
          id: doc.id,
          ...mentorData
        });
      }
    });

    if (availableMentors.length === 0) {
      return { success: true, data: [] };
    }

    // Use AI to analyze and rank mentors
    const matchingPrompt = `
    Analyze this mentee profile and rank the following mentors based on compatibility:

    MENTEE PROFILE:
    - Current Level: ${menteeData.currentLevel}
    - Learning Goals: ${menteeData.learningGoals.join(', ')}
    - Interested Categories: ${menteeData.interestedCategories.join(', ')}
    - Career Goals: ${menteeData.careerGoals}
    - Available Hours: ${menteeData.availableHours.join(', ')}
    - Timezone: ${menteeData.timezone}
    - Languages: ${menteeData.languages.join(', ')}

    AVAILABLE MENTORS:
    ${availableMentors.map((mentor, index) => `
    ${index + 1}. ${mentor.userName}
       - Experience: ${mentor.experience}
       - Expertise: ${mentor.expertise.join(', ')}
       - Categories: ${mentor.categories.join(', ')}
       - Available Hours: ${mentor.availableHours.join(', ')}
       - Timezone: ${mentor.timezone}
       - Languages: ${mentor.languages.join(', ')}
       - Rating: ${mentor.rating}/5 (${mentor.totalReviews} reviews)
       - Successful Matches: ${mentor.successfulMatches}
    `).join('')}

    Analyze each mentor and provide:
    1. Compatibility score (0-100)
    2. Matching reasons (2-3 key points)
    3. Potential challenges (if any)

    Return as JSON array with this format:
    [
      {
        "mentorIndex": 0,
        "compatibilityScore": 95,
        "matchingReasons": ["Expertise aligns with learning goals", "Same timezone", "Excellent rating"],
        "challenges": ["High demand mentor"],
        "confidence": "high"
      }
    ]

    Rank by compatibility score (highest first). Include all mentors.
    `;

    const aiResponse = await generateGeminiResponse(matchingPrompt);
    let aiRankings = [];

    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        aiRankings = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('AI response parsing failed, using fallback ranking');
      // Fallback: simple compatibility scoring
      aiRankings = availableMentors.map((mentor, index) => ({
        mentorIndex: index,
        compatibilityScore: calculateSimpleCompatibility(menteeData, mentor),
        matchingReasons: ["Experience match", "Category overlap"],
        challenges: [],
        confidence: "medium"
      }));
    }

    // Combine AI rankings with mentor data
    const rankedMentors = aiRankings
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10) // Top 10 matches
      .map(ranking => ({
        ...availableMentors[ranking.mentorIndex],
        compatibilityScore: ranking.compatibilityScore,
        matchingReasons: ranking.matchingReasons,
        challenges: ranking.challenges,
        confidence: ranking.confidence
      }));

    return { success: true, data: rankedMentors };
  } catch (error) {
    console.error('Error finding mentors:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Simple fallback compatibility calculation
 */
const calculateSimpleCompatibility = (mentee, mentor) => {
  let score = 0;

  // Experience level compatibility
  const experienceLevels = [
    EXPERIENCE_LEVELS.BEGINNER,
    EXPERIENCE_LEVELS.INTERMEDIATE,
    EXPERIENCE_LEVELS.ADVANCED,
    EXPERIENCE_LEVELS.EXPERT
  ];
  
  const menteeLevel = experienceLevels.indexOf(mentee.currentLevel);
  const mentorLevel = experienceLevels.indexOf(mentor.experience);
  
  if (mentorLevel > menteeLevel) score += 30;
  
  // Category overlap
  const categoryOverlap = mentee.interestedCategories.filter(cat => 
    mentor.categories.includes(cat)
  ).length;
  score += categoryOverlap * 15;
  
  // Language compatibility
  const languageMatch = mentee.languages.some(lang => 
    mentor.languages.includes(lang)
  );
  if (languageMatch) score += 20;
  
  // Rating bonus
  score += mentor.rating * 5;
  
  // Availability bonus
  if (mentor.currentMentees < mentor.maxMentees) score += 10;
  
  return Math.min(score, 100);
};

/**
 * Send mentorship request
 */
export const sendMentorshipRequest = async (menteeId, mentorId, requestData) => {
  try {
    const request = {
      menteeId,
      mentorId,
      message: requestData.message || '',
      requestedCategories: requestData.categories || [],
      preferredSchedule: requestData.schedule || [],
      goals: requestData.goals || '',
      duration: requestData.duration || '1-month',
      status: REQUEST_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const requestsRef = collection(db, 'mentorshipRequests');
    const docRef = await addDoc(requestsRef, request);

    // Notify mentor (in real app, you'd send actual notification)
    await updateMentorNotifications(mentorId, {
      type: 'mentorship_request',
      requestId: docRef.id,
      message: `New mentorship request received`
    });

    return { success: true, data: { id: docRef.id, ...request } };
  } catch (error) {
    console.error('Error sending mentorship request:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Respond to mentorship request
 */
export const respondToMentorshipRequest = async (requestId, mentorId, response, message = '') => {
  try {
    const requestRef = doc(db, 'mentorshipRequests', requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      throw new Error('Request not found');
    }

    const requestData = requestDoc.data();

    if (requestData.mentorId !== mentorId) {
      throw new Error('Unauthorized to respond to this request');
    }

    // Update request status
    await updateDoc(requestRef, {
      status: response,
      responseMessage: message,
      respondedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    if (response === REQUEST_STATUS.ACCEPTED) {
      // Create mentorship relationship
      const mentorshipRef = collection(db, 'mentorships');
      const mentorship = {
        mentorId,
        menteeId: requestData.menteeId,
        categories: requestData.requestedCategories,
        goals: requestData.goals,
        startDate: serverTimestamp(),
        status: 'active',
        sessionsCompleted: 0,
        totalHours: 0,
        nextSessionDate: null,
        notes: [],
        milestones: [],
        createdAt: serverTimestamp()
      };

      const mentorshipDoc = await addDoc(mentorshipRef, mentorship);

      // Update mentor and mentee profiles
      const mentorRef = doc(db, 'mentors', mentorId);
      const menteeRef = doc(db, 'mentees', requestData.menteeId);

      await updateDoc(mentorRef, {
        currentMentees: increment(1),
        successfulMatches: increment(1)
      });

      await updateDoc(menteeRef, {
        hasActiveMentor: true,
        currentMentorId: mentorId
      });

      return { success: true, data: { mentorshipId: mentorshipDoc.id } };
    }

    return { success: true, data: { status: response } };
  } catch (error) {
    console.error('Error responding to mentorship request:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get mentorship requests for a mentor
 */
export const getMentorRequests = async (mentorId) => {
  try {
    const requestsRef = collection(db, 'mentorshipRequests');
    const q = query(
      requestsRef,
      where('mentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const requests = [];

    for (const doc of snapshot.docs) {
      const requestData = doc.data();
      
      // Get mentee details
      const menteeRef = doc(db, 'mentees', requestData.menteeId);
      const menteeDoc = await getDoc(menteeRef);
      
      requests.push({
        id: doc.id,
        ...requestData,
        createdAt: requestData.createdAt?.toDate(),
        updatedAt: requestData.updatedAt?.toDate(),
        respondedAt: requestData.respondedAt?.toDate(),
        menteeDetails: menteeDoc.exists() ? menteeDoc.data() : null
      });
    }

    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching mentor requests:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get active mentorships for a user
 */
export const getActiveMentorships = async (userId, userType = 'mentee') => {
  try {
    const mentorshipsRef = collection(db, 'mentorships');
    const fieldName = userType === 'mentor' ? 'mentorId' : 'menteeId';
    
    const q = query(
      mentorshipsRef,
      where(fieldName, '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const mentorships = [];

    for (const doc of snapshot.docs) {
      const mentorshipData = doc.data();
      
      // Get the other party's details
      const otherPartyId = userType === 'mentor' ? mentorshipData.menteeId : mentorshipData.mentorId;
      const otherPartyCollection = userType === 'mentor' ? 'mentees' : 'mentors';
      
      const otherPartyRef = doc(db, otherPartyCollection, otherPartyId);
      const otherPartyDoc = await getDoc(otherPartyRef);
      
      mentorships.push({
        id: doc.id,
        ...mentorshipData,
        startDate: mentorshipData.startDate?.toDate(),
        createdAt: mentorshipData.createdAt?.toDate(),
        nextSessionDate: mentorshipData.nextSessionDate?.toDate(),
        [userType === 'mentor' ? 'menteeDetails' : 'mentorDetails']: 
          otherPartyDoc.exists() ? otherPartyDoc.data() : null
      });
    }

    return { success: true, data: mentorships };
  } catch (error) {
    console.error('Error fetching active mentorships:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Schedule mentoring session
 */
export const scheduleMentoringSession = async (mentorshipId, sessionData) => {
  try {
    const session = {
      mentorshipId,
      title: sessionData.title || 'Mentoring Session',
      description: sessionData.description || '',
      scheduledDate: sessionData.scheduledDate,
      duration: sessionData.duration || 60, // minutes
      meetingLink: sessionData.meetingLink || '',
      agenda: sessionData.agenda || [],
      status: 'scheduled',
      createdAt: serverTimestamp()
    };

    const sessionsRef = collection(db, 'mentoringSessions');
    const docRef = await addDoc(sessionsRef, session);

    // Update mentorship with next session date
    const mentorshipRef = doc(db, 'mentorships', mentorshipId);
    await updateDoc(mentorshipRef, {
      nextSessionDate: sessionData.scheduledDate
    });

    return { success: true, data: { id: docRef.id, ...session } };
  } catch (error) {
    console.error('Error scheduling mentoring session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get mentoring statistics
 */
export const getMentoringStats = async () => {
  try {
    // Get total mentors
    const mentorsRef = collection(db, 'mentors');
    const mentorsSnapshot = await getDocs(mentorsRef);
    
    // Get total mentees
    const menteesRef = collection(db, 'mentees');
    const menteesSnapshot = await getDocs(menteesRef);
    
    // Get active mentorships
    const mentorshipsRef = collection(db, 'mentorships');
    const activeMentorshipsQuery = query(
      mentorshipsRef,
      where('status', '==', 'active')
    );
    const activeMentorshipsSnapshot = await getDocs(activeMentorshipsQuery);
    
    // Get completed sessions
    const sessionsRef = collection(db, 'mentoringSession');
    const completedSessionsQuery = query(
      sessionsRef,
      where('status', '==', 'completed')
    );
    const completedSessionsSnapshot = await getDocs(completedSessionsQuery);

    // Calculate category distribution
    const categoryStats = {};
    mentorsSnapshot.forEach(doc => {
      const mentor = doc.data();
      mentor.categories?.forEach(category => {
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });
    });

    return {
      success: true,
      data: {
        totalMentors: mentorsSnapshot.size,
        totalMentees: menteesSnapshot.size,
        activeMentorships: activeMentorshipsSnapshot.size,
        completedSessions: completedSessionsSnapshot.size,
        categoryStats,
        matchSuccessRate: activeMentorshipsSnapshot.size > 0 ? 
          Math.round((activeMentorshipsSnapshot.size / Math.max(mentorsSnapshot.size, 1)) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching mentoring stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update mentor notifications (placeholder for real notification system)
 */
const updateMentorNotifications = async (mentorId, notification) => {
  try {
    const notificationRef = collection(db, 'notifications');
    await addDoc(notificationRef, {
      userId: mentorId,
      ...notification,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
  }
};

/**
 * Get category display name
 */
export const getCategoryName = (category) => {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Get experience level display name
 */
export const getExperienceName = (level) => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};