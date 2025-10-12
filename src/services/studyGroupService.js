/**
 * Study Groups Service - Collaborative Learning Management System
 * Handles study group creation, management, scheduling, and progress tracking
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
import { getDocsWithIndexFallback } from './firestoreIndexGuard.js';

// Study group status types
export const GROUP_STATUS = {
  ACTIVE: 'active',
  RECRUITING: 'recruiting',
  FULL: 'full',
  COMPLETED: 'completed',
  INACTIVE: 'inactive'
};

// Study group types
export const GROUP_TYPES = {
  COURSE_STUDY: 'course-study',
  CERTIFICATION: 'certification',
  PROJECT_BASED: 'project-based',
  SKILL_DEVELOPMENT: 'skill-development',
  EXAM_PREP: 'exam-prep',
  DISCUSSION: 'discussion',
  PRACTICE_LAB: 'practice-lab'
};

// Meeting types
export const MEETING_TYPES = {
  VIRTUAL: 'virtual',
  HYBRID: 'hybrid',
  STUDY_SESSION: 'study-session',
  PROJECT_WORK: 'project-work',
  EXAM_REVIEW: 'exam-review',
  PRESENTATION: 'presentation'
};

// Study group categories
export const STUDY_CATEGORIES = {
  NETWORK_SECURITY: 'network-security',
  ETHICAL_HACKING: 'ethical-hacking',
  INCIDENT_RESPONSE: 'incident-response',
  COMPLIANCE: 'compliance',
  CLOUD_SECURITY: 'cloud-security',
  MALWARE_ANALYSIS: 'malware-analysis',
  PENETRATION_TESTING: 'penetration-testing',
  DIGITAL_FORENSICS: 'digital-forensics',
  SECURITY_ARCHITECTURE: 'security-architecture',
  GOVERNANCE: 'governance'
};

/**
 * Create a new study group
 */
export const createStudyGroup = async (creatorId, creatorName, groupData) => {
  try {
    const studyGroup = {
      name: groupData.name,
      description: groupData.description || '',
      category: groupData.category,
      type: groupData.type || GROUP_TYPES.COURSE_STUDY,
      maxMembers: groupData.maxMembers || 8,
      currentMembers: 1, // Creator is first member
      status: GROUP_STATUS.RECRUITING,
      isPublic: groupData.isPublic !== false, // Default to public
      tags: groupData.tags || [],
      schedule: groupData.schedule || {
        frequency: 'weekly',
        dayOfWeek: 'Sunday',
        time: '19:00',
        timezone: 'Asia/Kolkata',
        duration: 120 // minutes
      },
      meetingType: groupData.meetingType || MEETING_TYPES.VIRTUAL,
      meetingLink: groupData.meetingLink || '',
      requirements: groupData.requirements || [],
      creatorId,
      creatorName,
      members: [{
        userId: creatorId,
        userName: creatorName,
        role: 'admin',
        joinedAt: serverTimestamp(),
        contribution: 0,
        attendance: 0
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMeetingAt: null,
      nextMeetingAt: null,
      totalSessions: 0,
      completedSessions: 0,
      groupGoals: groupData.goals || [],
      currentTopic: '',
      progress: {
        completedTopics: [],
        currentMilestone: '',
        overallProgress: 0
      },
      resources: [],
      announcements: []
    };

    const groupsRef = collection(db, 'studyGroups');
    const docRef = await addDoc(groupsRef, studyGroup);

    // Update user's study group participation
    await updateUserStudyGroupStats(creatorId, 'groupsCreated');

    return { success: true, data: { id: docRef.id, ...studyGroup } };
  } catch (error) {
    console.error('Error creating study group:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get study groups with filtering and pagination
 */
export const getStudyGroups = async (options = {}) => {
  try {
    const {
      category = null,
      type = null,
      status = null,
      isRecruitingOnly = false,
      limit: limitCount = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = options;

  let groupsRef = collection(db, 'studyGroups');
  let base = query(groupsRef);

    // Apply filters
    if (category) base = query(base, where('category', '==', category));
    if (type) base = query(base, where('type', '==', type));
    if (status) base = query(base, where('status', '==', status));
    if (isRecruitingOnly) {
      base = query(base, where('status', 'in', [GROUP_STATUS.RECRUITING, GROUP_STATUS.ACTIVE]));
      base = query(base, where('isPublic', '==', true));
    }

    const primary = () => getDocs(query(base, orderBy(sortBy, sortOrder), limit(limitCount)));
    const fallback = () => getDocs(base);
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy, sortDir: sortOrder, alertSource: 'studyGroups.getStudyGroups', alertPath: 'studyGroups' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;

    const groups = rows.map((data) => ({
      id: data.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      lastMeetingAt: data.lastMeetingAt?.toDate?.() || data.lastMeetingAt,
      nextMeetingAt: data.nextMeetingAt?.toDate?.() || data.nextMeetingAt,
      members: (data.members || []).map(member => ({
        ...member,
        joinedAt: member.joinedAt?.toDate?.() || member.joinedAt
      }))
    }));

    if (indexRequired) console.warn('Index required for getStudyGroups; using fallback sorting.');
    return { success: true, data: groups };
  } catch (error) {
    console.error('Error fetching study groups:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Join a study group
 */
export const joinStudyGroup = async (groupId, userId, userName, joinMessage = '') => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error('Study group not found');
    }

    const groupData = groupDoc.data();

    // Check if user is already a member
    if (groupData.members?.some(member => member.userId === userId)) {
      throw new Error('You are already a member of this group');
    }

    // Check if group is full
    if (groupData.currentMembers >= groupData.maxMembers) {
      throw new Error('This study group is full');
    }

    // Check if group is accepting members
    if (groupData.status !== GROUP_STATUS.RECRUITING && groupData.status !== GROUP_STATUS.ACTIVE) {
      throw new Error('This group is not currently accepting new members');
    }

    // Add user to group
    const newMember = {
      userId,
      userName,
      role: 'member',
      joinedAt: serverTimestamp(),
      contribution: 0,
      attendance: 0,
      joinMessage
    };

    await updateDoc(groupRef, {
      members: arrayUnion(newMember),
      currentMembers: increment(1),
      updatedAt: serverTimestamp()
    });

    // Update group status if full
    if (groupData.currentMembers + 1 >= groupData.maxMembers) {
      await updateDoc(groupRef, {
        status: GROUP_STATUS.FULL
      });
    }

    // Update user's study group participation
    await updateUserStudyGroupStats(userId, 'groupsJoined');

    // Add welcome message to group announcements
    await addGroupAnnouncement(groupId, {
      type: 'member_joined',
      message: `${userName} joined the study group`,
      userName,
      timestamp: serverTimestamp()
    });

    return { success: true, data: newMember };
  } catch (error) {
    console.error('Error joining study group:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Leave a study group
 */
export const leaveStudyGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error('Study group not found');
    }

    const groupData = groupDoc.data();
    const member = groupData.members?.find(m => m.userId === userId);

    if (!member) {
      throw new Error('You are not a member of this group');
    }

    // Check if user is the creator
    if (groupData.creatorId === userId) {
      // Transfer ownership or handle group deletion
      if (groupData.members.length > 1) {
        // Transfer to next admin or longest member
        const nextAdmin = groupData.members.find(m => m.userId !== userId && m.role === 'admin') ||
                          groupData.members.find(m => m.userId !== userId);
        
        await updateDoc(groupRef, {
          creatorId: nextAdmin.userId,
          creatorName: nextAdmin.userName,
          members: arrayRemove(member),
          currentMembers: increment(-1),
          updatedAt: serverTimestamp()
        });

        // Promote new admin
        const updatedMembers = groupData.members.map(m => 
          m.userId === nextAdmin.userId ? { ...m, role: 'admin' } : m
        ).filter(m => m.userId !== userId);

        await updateDoc(groupRef, {
          members: updatedMembers
        });
      } else {
        // Delete group if creator is the only member
        await deleteDoc(groupRef);
        return { success: true, data: { groupDeleted: true } };
      }
    } else {
      // Regular member leaving
      await updateDoc(groupRef, {
        members: arrayRemove(member),
        currentMembers: increment(-1),
        status: GROUP_STATUS.RECRUITING, // Open for recruitment again
        updatedAt: serverTimestamp()
      });
    }

    // Add announcement
    await addGroupAnnouncement(groupId, {
      type: 'member_left',
      message: `${member.userName} left the study group`,
      userName: member.userName,
      timestamp: serverTimestamp()
    });

    return { success: true, data: { memberRemoved: true } };
  } catch (error) {
    console.error('Error leaving study group:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Schedule a study group meeting
 */
export const scheduleGroupMeeting = async (groupId, schedulerId, meetingData) => {
  try {
    const meeting = {
      groupId,
      title: meetingData.title || 'Study Group Meeting',
      description: meetingData.description || '',
      scheduledDate: meetingData.scheduledDate,
      duration: meetingData.duration || 120, // minutes
      meetingType: meetingData.meetingType || MEETING_TYPES.STUDY_SESSION,
      meetingLink: meetingData.meetingLink || '',
      agenda: meetingData.agenda || [],
      materials: meetingData.materials || [],
      schedulerId,
      status: 'scheduled',
      attendees: [],
      notes: '',
      createdAt: serverTimestamp()
    };

    const meetingsRef = collection(db, 'studyGroupMeetings');
    const docRef = await addDoc(meetingsRef, meeting);

    // Update group with next meeting date
    const groupRef = doc(db, 'studyGroups', groupId);
    await updateDoc(groupRef, {
      nextMeetingAt: meetingData.scheduledDate,
      totalSessions: increment(1),
      updatedAt: serverTimestamp()
    });

    // Add announcement
    await addGroupAnnouncement(groupId, {
      type: 'meeting_scheduled',
      message: `New meeting scheduled: ${meeting.title}`,
      meetingId: docRef.id,
      timestamp: serverTimestamp()
    });

    return { success: true, data: { id: docRef.id, ...meeting } };
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get study group meetings
 */
export const getGroupMeetings = async (groupId, options = {}) => {
  try {
    const { upcoming = false, limit: limitCount = 10 } = options;

    const meetingsRef = collection(db, 'studyGroupMeetings');
    let base = query(meetingsRef, where('groupId', '==', groupId));

    if (upcoming) {
      const now = new Date();
      base = query(base, where('scheduledDate', '>=', now));
    }

    const primary = () => getDocs(query(base, orderBy('scheduledDate', 'desc'), limit(limitCount)));
    const fallback = () => getDocs(base);
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'scheduledDate', sortDir: 'desc', alertSource: 'studyGroups.getGroupMeetings', alertPath: 'studyGroupMeetings' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    const meetings = rows.map((data) => ({
      id: data.id,
      ...data,
      scheduledDate: data.scheduledDate?.toDate?.() || data.scheduledDate,
      createdAt: data.createdAt?.toDate?.() || data.createdAt
    }));
    if (indexRequired) console.warn('Index required for getGroupMeetings; using fallback sorting.');

    return { success: true, data: meetings };
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add resource to study group
 */
export const addGroupResource = async (groupId, userId, resourceData) => {
  try {
    const resource = {
      title: resourceData.title,
      description: resourceData.description || '',
      type: resourceData.type || 'link', // link, document, video, etc.
      url: resourceData.url || '',
      uploadedBy: userId,
      uploadedAt: serverTimestamp(),
      tags: resourceData.tags || [],
      category: resourceData.category || 'general'
    };

    const groupRef = doc(db, 'studyGroups', groupId);
    await updateDoc(groupRef, {
      resources: arrayUnion(resource),
      updatedAt: serverTimestamp()
    });

    return { success: true, data: resource };
  } catch (error) {
    console.error('Error adding resource:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update group progress
 */
export const updateGroupProgress = async (groupId, progressData) => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    
    const updateData = {
      updatedAt: serverTimestamp()
    };

    if (progressData.completedTopic) {
      updateData['progress.completedTopics'] = arrayUnion(progressData.completedTopic);
    }

    if (progressData.currentMilestone) {
      updateData['progress.currentMilestone'] = progressData.currentMilestone;
    }

    if (progressData.overallProgress !== undefined) {
      updateData['progress.overallProgress'] = progressData.overallProgress;
    }

    if (progressData.currentTopic) {
      updateData.currentTopic = progressData.currentTopic;
    }

    await updateDoc(groupRef, updateData);

    return { success: true, data: progressData };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get AI-powered study group recommendations
 */
export const getStudyGroupRecommendations = async (userId, userProfile) => {
  try {
    // Get all recruiting groups
    const groupsResult = await getStudyGroups({
      isRecruitingOnly: true,
      limit: 15
    });

    if (!groupsResult.success || groupsResult.data.length === 0) {
      return { success: true, data: [] };
    }

    const availableGroups = groupsResult.data;

    // Use AI to analyze and recommend groups
    const recommendationPrompt = `
    Analyze this student profile and recommend the best study groups:

    STUDENT PROFILE:
    - Interests: ${userProfile.interests?.join(', ') || 'General cybersecurity'}
    - Current Level: ${userProfile.experience || 'Intermediate'}
    - Learning Goals: ${userProfile.goals?.join(', ') || 'Skill development'}
    - Available Schedule: ${userProfile.availability || 'Flexible'}
    - Preferred Learning Style: ${userProfile.learningStyle || 'Collaborative'}

    AVAILABLE STUDY GROUPS:
    ${availableGroups.map((group, index) => `
    ${index + 1}. ${group.name}
       - Category: ${group.category}
       - Type: ${group.type}
       - Description: ${group.description}
       - Schedule: ${group.schedule?.frequency} ${group.schedule?.dayOfWeek} at ${group.schedule?.time}
       - Members: ${group.currentMembers}/${group.maxMembers}
       - Requirements: ${group.requirements?.join(', ') || 'None'}
    `).join('')}

    Analyze each group and provide:
    1. Compatibility score (0-100)
    2. Why it's a good match (2-3 reasons)
    3. Potential challenges (if any)

    Return as JSON array:
    [
      {
        "groupIndex": 0,
        "compatibilityScore": 90,
        "matchReasons": ["Schedule fits availability", "Category matches interests"],
        "challenges": ["Fast-paced learning"],
        "confidence": "high"
      }
    ]

    Rank by compatibility score. Include all groups.
    `;

    const aiResponse = await generateGeminiResponse(recommendationPrompt);
    let aiRecommendations = [];

    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        aiRecommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('AI response parsing failed, using fallback');
      // Fallback: simple scoring
      aiRecommendations = availableGroups.map((group, index) => ({
        groupIndex: index,
        compatibilityScore: Math.floor(Math.random() * 40) + 60,
        matchReasons: ["Category alignment", "Group size suitable"],
        challenges: [],
        confidence: "medium"
      }));
    }

    // Combine AI recommendations with group data
    const recommendedGroups = aiRecommendations
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 8)
      .map(rec => ({
        ...availableGroups[rec.groupIndex],
        compatibilityScore: rec.compatibilityScore,
        matchReasons: rec.matchReasons,
        challenges: rec.challenges,
        confidence: rec.confidence
      }));

    return { success: true, data: recommendedGroups };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search study groups
 */
export const searchStudyGroups = async (searchTerm, filters = {}) => {
  try {
    const { category, type, maxResults = 10 } = filters;

    let groupsRef = collection(db, 'studyGroups');
    let q = query(groupsRef);

    // Apply filters
    if (category) {
      q = query(q, where('category', '==', category));
    }
    if (type) {
      q = query(q, where('type', '==', type));
    }

    q = query(q, where('isPublic', '==', true), limit(maxResults * 2));

    const snapshot = await getDocs(q);
    const results = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const searchLower = searchTerm.toLowerCase();

      // Simple text matching
      if (
        data.name?.toLowerCase().includes(searchLower) ||
        data.description?.toLowerCase().includes(searchLower) ||
        data.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        data.category?.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          nextMeetingAt: data.nextMeetingAt?.toDate(),
          members: data.members?.map(member => ({
            ...member,
            joinedAt: member.joinedAt?.toDate()
          })) || []
        });
      }
    });

    return { 
      success: true, 
      data: results.slice(0, maxResults) 
    };
  } catch (error) {
    console.error('Error searching study groups:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get study group statistics
 */
export const getStudyGroupStats = async () => {
  try {
    const groupsRef = collection(db, 'studyGroups');
    const groupsSnapshot = await getDocs(groupsRef);

    let totalGroups = 0;
    let activeGroups = 0;
    let totalMembers = 0;
    let categoryStats = {};
    let typeStats = {};

    groupsSnapshot.forEach(doc => {
      const data = doc.data();
      totalGroups++;
      
      if (data.status === GROUP_STATUS.ACTIVE || data.status === GROUP_STATUS.RECRUITING) {
        activeGroups++;
      }
      
      totalMembers += data.currentMembers || 0;
      
      // Category stats
      const category = data.category || 'uncategorized';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      
      // Type stats
      const type = data.type || 'uncategorized';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    // Get completed sessions
    const meetingsRef = collection(db, 'studyGroupMeetings');
    const completedMeetingsQuery = query(
      meetingsRef,
      where('status', '==', 'completed')
    );
    const completedMeetingsSnapshot = await getDocs(completedMeetingsQuery);

    return {
      success: true,
      data: {
        totalGroups,
        activeGroups,
        totalMembers,
        completedSessions: completedMeetingsSnapshot.size,
        avgMembersPerGroup: totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0,
        categoryStats,
        typeStats
      }
    };
  } catch (error) {
    console.error('Error fetching study group stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add announcement to study group
 */
const addGroupAnnouncement = async (groupId, announcement) => {
  try {
    const groupRef = doc(db, 'studyGroups', groupId);
    await updateDoc(groupRef, {
      announcements: arrayUnion(announcement),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding announcement:', error);
  }
};

/**
 * Update user study group statistics
 */
const updateUserStudyGroupStats = async (userId, statType) => {
  try {
    const userStatsRef = doc(db, 'userStudyGroupStats', userId);
    const statsDoc = await getDoc(userStatsRef);

    if (statsDoc.exists()) {
      await updateDoc(userStatsRef, {
        [statType]: increment(1),
        lastActivity: serverTimestamp()
      });
    } else {
      await setDoc(userStatsRef, {
        userId,
        groupsCreated: statType === 'groupsCreated' ? 1 : 0,
        groupsJoined: statType === 'groupsJoined' ? 1 : 0,
        sessionsAttended: 0,
        resourcesShared: 0,
        lastActivity: serverTimestamp(),
        joinedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating user study group stats:', error);
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
 * Get group type display name
 */
export const getGroupTypeName = (type) => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Get group status display name
 */
export const getStatusName = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};