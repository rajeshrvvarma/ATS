/**
 * Forum Service - Social Learning Discussion System
 * Handles discussion forums, threads, replies, and peer interactions using Firebase
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
import { getDocsWithIndexFallback } from './firestoreIndexGuard.js';

// Forum categories for different discussion topics
export const FORUM_CATEGORIES = {
  GENERAL: 'general-discussion',
  DEFENSIVE_SECURITY: 'defensive-security',
  ETHICAL_HACKING: 'ethical-hacking',
  CAREER_ADVICE: 'career-advice',
  STUDY_GROUPS: 'study-groups',
  COURSE_HELP: 'course-help',
  CERTIFICATION: 'certification',
  JOB_OPPORTUNITIES: 'job-opportunities',
  TECH_NEWS: 'tech-news',
  PEER_HELP: 'peer-help'
};

// Thread/Post types
export const POST_TYPES = {
  QUESTION: 'question',
  DISCUSSION: 'discussion',
  ANNOUNCEMENT: 'announcement',
  RESOURCE_SHARE: 'resource-share',
  STUDY_GROUP: 'study-group',
  JOB_POST: 'job-post'
};

/**
 * Create a new forum thread
 */
export const createForumThread = async (userId, userName, threadData) => {
  try {
    const thread = {
      title: threadData.title,
      content: threadData.content,
      category: threadData.category,
      type: threadData.type || POST_TYPES.DISCUSSION,
      authorId: userId,
      authorName: userName,
      authorLevel: threadData.authorLevel || 'Student',
      tags: threadData.tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      replyCount: 0,
      viewCount: 0,
      likeCount: 0,
      isSticky: false,
      isClosed: false,
      lastReplyAt: serverTimestamp(),
      lastReplyBy: userName
    };

    const threadsRef = collection(db, 'forumThreads');
    const docRef = await addDoc(threadsRef, thread);

    // Update user's thread count
    await updateUserForumStats(userId, 'threadsCreated');

    return { success: true, data: { id: docRef.id, ...thread } };
  } catch (error) {
    console.error('Error creating forum thread:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get forum threads with filtering and pagination
 */
export const getForumThreads = async (options = {}) => {
  try {
    const {
      category = null,
      type = null,
      limit: limitCount = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = options;

  let threadsRef = collection(db, 'forumThreads');
  let base = query(threadsRef);

    // Apply filters
    if (category) base = query(base, where('category', '==', category));
    if (type) base = query(base, where('type', '==', type));

    const primary = () => getDocs(query(base, orderBy(sortBy, sortOrder), limit(limitCount)));
    const fallback = () => getDocs(base);
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy, sortDir: sortOrder, alertSource: 'forum.getForumThreads', alertPath: 'forumThreads' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    const threads = rows.map((data) => ({
      id: data.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      lastReplyAt: data.lastReplyAt?.toDate?.() || data.lastReplyAt
    }));
    if (indexRequired) console.warn('Index required for getForumThreads; using fallback sorting.');

    return { success: true, data: threads };
  } catch (error) {
    console.error('Error fetching forum threads:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a specific thread with its replies
 */
export const getForumThread = async (threadId) => {
  try {
    // Get thread
    const threadRef = doc(db, 'forumThreads', threadId);
    const threadDoc = await getDoc(threadRef);

    if (!threadDoc.exists()) {
      throw new Error('Thread not found');
    }

    const threadData = {
      id: threadDoc.id,
      ...threadDoc.data(),
      createdAt: threadDoc.data().createdAt?.toDate(),
      updatedAt: threadDoc.data().updatedAt?.toDate(),
      lastReplyAt: threadDoc.data().lastReplyAt?.toDate()
    };

    // Get replies
    const repliesRef = collection(db, 'forumThreads', threadId, 'replies');
    const repliesQuery = query(repliesRef, orderBy('createdAt', 'asc'));
    const repliesSnapshot = await getDocs(repliesQuery);

    const replies = [];
    repliesSnapshot.forEach((doc) => {
      replies.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    // Increment view count
    await updateDoc(threadRef, {
      viewCount: increment(1)
    });

    return { 
      success: true, 
      data: { 
        thread: threadData, 
        replies 
      } 
    };
  } catch (error) {
    console.error('Error fetching forum thread:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add a reply to a forum thread
 */
export const addForumReply = async (threadId, userId, userName, replyData) => {
  try {
    const reply = {
      content: replyData.content,
      authorId: userId,
      authorName: userName,
      authorLevel: replyData.authorLevel || 'Student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likeCount: 0,
      isAcceptedAnswer: false
    };

    // Add reply to subcollection
    const repliesRef = collection(db, 'forumThreads', threadId, 'replies');
    const docRef = await addDoc(repliesRef, reply);

    // Update thread statistics
    const threadRef = doc(db, 'forumThreads', threadId);
    await updateDoc(threadRef, {
      replyCount: increment(1),
      lastReplyAt: serverTimestamp(),
      lastReplyBy: userName,
      updatedAt: serverTimestamp()
    });

    // Update user's reply count
    await updateUserForumStats(userId, 'repliesPosted');

    return { success: true, data: { id: docRef.id, ...reply } };
  } catch (error) {
    console.error('Error adding forum reply:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Like/Unlike a thread or reply
 */
export const toggleForumLike = async (userId, itemType, itemId, threadId = null) => {
  try {
    const likeRef = itemType === 'thread' 
      ? doc(db, 'forumLikes', `${userId}_thread_${itemId}`)
      : doc(db, 'forumLikes', `${userId}_reply_${itemId}`);

    const likeDoc = await getDoc(likeRef);
    const isLiked = likeDoc.exists();

    if (isLiked) {
      // Remove like
      await deleteDoc(likeRef);
      
      // Decrement like count
      const targetRef = itemType === 'thread'
        ? doc(db, 'forumThreads', itemId)
        : doc(db, 'forumThreads', threadId, 'replies', itemId);
      
      await updateDoc(targetRef, {
        likeCount: increment(-1)
      });

      return { success: true, data: { isLiked: false } };
    } else {
      // Add like
      await setDoc(likeRef, {
        userId,
        itemType,
        itemId,
        threadId,
        createdAt: serverTimestamp()
      });

      // Increment like count
      const targetRef = itemType === 'thread'
        ? doc(db, 'forumThreads', itemId)
        : doc(db, 'forumThreads', threadId, 'replies', itemId);
      
      await updateDoc(targetRef, {
        likeCount: increment(1)
      });

      return { success: true, data: { isLiked: true } };
    }
  } catch (error) {
    console.error('Error toggling forum like:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search forum threads and replies
 */
export const searchForum = async (searchTerm, options = {}) => {
  try {
    const {
      category = null,
      limit: limitCount = 10
    } = options;

    // Note: This is a simple search. For production, consider using Algolia or similar
  let threadsRef = collection(db, 'forumThreads');
  let base = query(threadsRef);

    if (category) base = query(base, where('category', '==', category));

    const primary = () => getDocs(query(base, orderBy('updatedAt', 'desc'), limit(limitCount)));
    const fallback = () => getDocs(base);
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'updatedAt', sortDir: 'desc', alertSource: 'forum.searchForum', alertPath: 'forumThreads' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    const results = [];
    rows.forEach((data) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Simple text matching
      if (
        data.title?.toLowerCase().includes(searchLower) ||
        data.content?.toLowerCase().includes(searchLower) ||
        data.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        results.push({
          id: data.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          lastReplyAt: data.lastReplyAt?.toDate?.() || data.lastReplyAt
        });
      }
    });
    if (indexRequired) console.warn('Index required for searchForum; using fallback sorting.');

    return { success: true, data: results };
  } catch (error) {
    console.error('Error searching forum:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get forum statistics
 */
export const getForumStats = async () => {
  try {
    const threadsRef = collection(db, 'forumThreads');
    const threadsSnapshot = await getDocs(threadsRef);
    
    let totalThreads = 0;
    let totalReplies = 0;
    let categoryStats = {};
    
    for (const doc of threadsSnapshot.docs) {
      const data = doc.data();
      totalThreads++;
      totalReplies += data.replyCount || 0;
      
      // Category statistics
      const category = data.category || 'uncategorized';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    }

    // Get active users (users who posted in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentThreadsQuery = query(
      threadsRef,
      where('createdAt', '>=', thirtyDaysAgo)
    );
    const recentSnapshot = await getDocs(recentThreadsQuery);
    
    const activeUsers = new Set();
    recentSnapshot.forEach(doc => {
      activeUsers.add(doc.data().authorId);
    });

    return {
      success: true,
      data: {
        totalThreads,
        totalReplies,
        activeUsers: activeUsers.size,
        categoryStats,
        avgRepliesPerThread: totalThreads > 0 ? Math.round(totalReplies / totalThreads) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching forum stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user forum statistics
 */
const updateUserForumStats = async (userId, statType) => {
  try {
    const userStatsRef = doc(db, 'userForumStats', userId);
    const statsDoc = await getDoc(userStatsRef);

    if (statsDoc.exists()) {
      await updateDoc(userStatsRef, {
        [statType]: increment(1),
        lastActivity: serverTimestamp()
      });
    } else {
      await setDoc(userStatsRef, {
        userId,
        threadsCreated: statType === 'threadsCreated' ? 1 : 0,
        repliesPosted: statType === 'repliesPosted' ? 1 : 0,
        likesReceived: 0,
        reputation: 1, // Start with base reputation
        lastActivity: serverTimestamp(),
        joinedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating user forum stats:', error);
  }
};

/**
 * Get user forum statistics
 */
export const getUserForumStats = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userForumStats', userId);
    const statsDoc = await getDoc(userStatsRef);

    if (statsDoc.exists()) {
      return {
        success: true,
        data: {
          ...statsDoc.data(),
          lastActivity: statsDoc.data().lastActivity?.toDate(),
          joinedAt: statsDoc.data().joinedAt?.toDate()
        }
      };
    } else {
      return {
        success: true,
        data: {
          userId,
          threadsCreated: 0,
          repliesPosted: 0,
          likesReceived: 0,
          reputation: 0,
          lastActivity: null,
          joinedAt: null
        }
      };
    }
  } catch (error) {
    console.error('Error fetching user forum stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get trending topics (most active threads in last 7 days)
 */
export const getTrendingTopics = async (limitCount = 5) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const threadsRef = collection(db, 'forumThreads');
    const base = query(threadsRef, where('lastReplyAt', '>=', sevenDaysAgo));
    const primary = () => getDocs(query(base, orderBy('lastReplyAt', 'desc'), orderBy('replyCount', 'desc'), limit(limitCount)));
    const fallback = () => getDocs(base);
  const { docs, indexRequired } = await getDocsWithIndexFallback(primary, fallback, { sortBy: 'lastReplyAt', sortDir: 'desc', alertSource: 'forum.getTrendingTopics', alertPath: 'forumThreads' });
    const rows = Array.isArray(docs) && docs.length && typeof docs[0].data === 'function'
      ? docs.map(d => ({ id: d.id, ...d.data() }))
      : docs;
    const trending = rows.map((data) => ({
      id: data.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      lastReplyAt: data.lastReplyAt?.toDate?.() || data.lastReplyAt
    }));
    if (indexRequired) console.warn('Index required for getTrendingTopics; using fallback sorting.');

    return { success: true, data: trending };
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return { success: false, error: error.message };
  }
};