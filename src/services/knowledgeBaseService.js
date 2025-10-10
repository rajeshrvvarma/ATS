import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { analyzeWithGemini } from '../api/gemini';

/**
 * Knowledge Base Wiki Service
 * Provides collaborative documentation and resource sharing
 */

// Create a new wiki article
export const createWikiArticle = async (articleData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'wikiArticles'), {
      ...articleData,
      authorId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 1,
      status: 'draft', // draft, published, review
      views: 0,
      likes: 0,
      contributors: [userId],
      tags: articleData.tags || [],
      categories: articleData.categories || [],
      collaborativeMode: articleData.collaborativeMode || false,
      peerReview: {
        required: articleData.peerReview?.required || false,
        reviewers: [],
        reviews: [],
        status: 'pending' // pending, in-review, approved, rejected
      }
    });

    // Create initial revision history
    await addDoc(collection(db, 'wikiRevisions'), {
      articleId: docRef.id,
      userId,
      content: articleData.content,
      summary: 'Initial article creation',
      timestamp: serverTimestamp(),
      version: 1
    });

    return { id: docRef.id, ...articleData };
  } catch (error) {
    console.error('Error creating wiki article:', error);
    throw error;
  }
};

// Get all wiki articles with filtering and sorting
export const getWikiArticles = async (filters = {}) => {
  try {
    let q = collection(db, 'wikiArticles');
    
    // Apply filters
    if (filters.category) {
      q = query(q, where('categories', 'array-contains', filters.category));
    }
    
    if (filters.tags && filters.tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', filters.tags));
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.authorId) {
      q = query(q, where('authorId', '==', filters.authorId));
    }
    
    // Apply sorting
    if (filters.sortBy === 'views') {
      q = query(q, orderBy('views', 'desc'));
    } else if (filters.sortBy === 'likes') {
      q = query(q, orderBy('likes', 'desc'));
    } else {
      q = query(q, orderBy('updatedAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting wiki articles:', error);
    throw error;
  }
};

// Get a specific wiki article
export const getWikiArticle = async (articleId) => {
  try {
    const docRef = doc(db, 'wikiArticles', articleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Increment view count
      await updateDoc(docRef, {
        views: increment(1)
      });
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Article not found');
    }
  } catch (error) {
    console.error('Error getting wiki article:', error);
    throw error;
  }
};

// Update wiki article (creates new revision)
export const updateWikiArticle = async (articleId, updates, userId, summary = '') => {
  try {
    // Get current article
    const articleRef = doc(db, 'wikiArticles', articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (!articleDoc.exists()) {
      throw new Error('Article not found');
    }
    
    const currentData = articleDoc.data();
    const newVersion = currentData.version + 1;
    
    // Update article
    await updateDoc(articleRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      version: newVersion,
      contributors: arrayUnion(userId)
    });
    
    // Create revision history
    await addDoc(collection(db, 'wikiRevisions'), {
      articleId,
      userId,
      content: updates.content || currentData.content,
      summary: summary || 'Article updated',
      timestamp: serverTimestamp(),
      version: newVersion,
      changes: updates
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating wiki article:', error);
    throw error;
  }
};

// Delete wiki article
export const deleteWikiArticle = async (articleId, userId) => {
  try {
    // Check if user is the author
    const articleRef = doc(db, 'wikiArticles', articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (!articleDoc.exists()) {
      throw new Error('Article not found');
    }
    
    const articleData = articleDoc.data();
    if (articleData.authorId !== userId) {
      throw new Error('Only the author can delete this article');
    }
    
    await deleteDoc(articleRef);
    
    // Delete revision history
    const revisionsQuery = query(
      collection(db, 'wikiRevisions'),
      where('articleId', '==', articleId)
    );
    const revisionsSnapshot = await getDocs(revisionsQuery);
    
    const deletePromises = revisionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting wiki article:', error);
    throw error;
  }
};

// Get article revision history
export const getArticleRevisions = async (articleId) => {
  try {
    const q = query(
      collection(db, 'wikiRevisions'),
      where('articleId', '==', articleId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting article revisions:', error);
    throw error;
  }
};

// Like/unlike article
export const toggleArticleLike = async (articleId, userId) => {
  try {
    const articleRef = doc(db, 'wikiArticles', articleId);
    const likeRef = doc(db, 'wikiLikes', `${articleId}_${userId}`);
    
    const likeDoc = await getDoc(likeRef);
    
    if (likeDoc.exists()) {
      // Unlike
      await deleteDoc(likeRef);
      await updateDoc(articleRef, {
        likes: increment(-1)
      });
      return { liked: false };
    } else {
      // Like
      await addDoc(collection(db, 'wikiLikes'), {
        articleId,
        userId,
        timestamp: serverTimestamp()
      });
      await updateDoc(articleRef, {
        likes: increment(1)
      });
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling article like:', error);
    throw error;
  }
};

// Submit article for peer review
export const submitForPeerReview = async (articleId, reviewerIds = []) => {
  try {
    const articleRef = doc(db, 'wikiArticles', articleId);
    
    // Update article status
    await updateDoc(articleRef, {
      'peerReview.status': 'in-review',
      'peerReview.reviewers': reviewerIds,
      updatedAt: serverTimestamp()
    });
    
    // Create review requests
    const reviewPromises = reviewerIds.map(reviewerId => 
      addDoc(collection(db, 'peerReviews'), {
        articleId,
        reviewerId,
        status: 'pending', // pending, completed, declined
        requestedAt: serverTimestamp(),
        review: null
      })
    );
    
    await Promise.all(reviewPromises);
    return { success: true };
  } catch (error) {
    console.error('Error submitting for peer review:', error);
    throw error;
  }
};

// Submit peer review
export const submitPeerReview = async (reviewId, reviewData, reviewerId) => {
  try {
    const reviewRef = doc(db, 'peerReviews', reviewId);
    
    await updateDoc(reviewRef, {
      status: 'completed',
      review: {
        ...reviewData,
        reviewerId,
        submittedAt: serverTimestamp()
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting peer review:', error);
    throw error;
  }
};

// Search wiki articles with AI-powered semantic search
export const searchWikiArticles = async (searchQuery, filters = {}) => {
  try {
    // First get articles based on filters
    const articles = await getWikiArticles(filters);
    
    if (!searchQuery.trim()) {
      return articles;
    }
    
    // Use AI for semantic search and ranking
    const searchPrompt = `
You are helping search through cybersecurity educational wiki articles. 
Search Query: "${searchQuery}"

Articles to search through:
${articles.map(article => `
Title: ${article.title}
Content Preview: ${article.content?.substring(0, 300)}...
Tags: ${article.tags?.join(', ')}
Categories: ${article.categories?.join(', ')}
ID: ${article.id}
`).join('\n---\n')}

Please analyze and return the most relevant articles based on the search query. Consider:
1. Title relevance
2. Content relevance  
3. Tag and category matches
4. Semantic similarity

Return only the article IDs in order of relevance (most relevant first), one per line.
If no articles are relevant, return "NO_MATCHES".
`;

    const aiResponse = await analyzeWithGemini(searchPrompt);
    const relevantIds = aiResponse.split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== 'NO_MATCHES');
    
    if (relevantIds.length === 0) {
      return [];
    }
    
    // Return articles in AI-determined order of relevance
    const sortedArticles = [];
    relevantIds.forEach(id => {
      const article = articles.find(a => a.id === id);
      if (article) {
        sortedArticles.push(article);
      }
    });
    
    return sortedArticles;
  } catch (error) {
    console.error('Error searching wiki articles:', error);
    // Fallback to simple text search
    return articles.filter(article =>
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
};

// Get AI-powered article recommendations
export const getArticleRecommendations = async (userId, currentArticleId = null) => {
  try {
    // Get user's reading history and preferences
    const articles = await getWikiArticles({ status: 'published' });
    
    if (articles.length === 0) {
      return [];
    }
    
    const recommendationPrompt = `
You are an AI learning assistant for a cybersecurity education platform. 
Please recommend the most relevant wiki articles for continued learning.

Current Context:
- User ID: ${userId}
- Current Article: ${currentArticleId || 'Homepage browsing'}

Available Articles:
${articles.slice(0, 20).map(article => `
ID: ${article.id}
Title: ${article.title}
Categories: ${article.categories?.join(', ')}
Tags: ${article.tags?.join(', ')}
Views: ${article.views}
Likes: ${article.likes}
Content Preview: ${article.content?.substring(0, 200)}...
`).join('\n---\n')}

Please recommend 5-8 articles that would be most beneficial for learning cybersecurity.
Consider:
1. Educational progression (beginner to advanced)
2. Topic diversity
3. Popular and well-liked content
4. Comprehensive coverage of cybersecurity domains

Return only article IDs, one per line, in order of recommendation priority.
`;

    const aiResponse = await analyzeWithGemini(recommendationPrompt);
    const recommendedIds = aiResponse.split('\n')
      .map(line => line.trim())
      .filter(line => line && line !== currentArticleId)
      .slice(0, 6);
    
    return recommendedIds
      .map(id => articles.find(article => article.id === id))
      .filter(article => article);
  } catch (error) {
    console.error('Error getting article recommendations:', error);
    // Fallback to popular articles
    return articles
      .filter(article => article.id !== currentArticleId)
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 6);
  }
};

// Get wiki statistics
export const getWikiStatistics = async () => {
  try {
    const articles = await getWikiArticles();
    
    const stats = {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      articlesInReview: articles.filter(a => a.status === 'review').length,
      totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
      totalLikes: articles.reduce((sum, a) => sum + (a.likes || 0), 0),
      categories: [...new Set(articles.flatMap(a => a.categories || []))],
      popularTags: getPopularTags(articles),
      topContributors: getTopContributors(articles)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting wiki statistics:', error);
    throw error;
  }
};

// Helper function to get popular tags
const getPopularTags = (articles) => {
  const tagCounts = {};
  articles.forEach(article => {
    (article.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};

// Helper function to get top contributors
const getTopContributors = (articles) => {
  const contributorCounts = {};
  articles.forEach(article => {
    (article.contributors || []).forEach(contributorId => {
      contributorCounts[contributorId] = (contributorCounts[contributorId] || 0) + 1;
    });
  });
  
  return Object.entries(contributorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([contributorId, count]) => ({ contributorId, count }));
};