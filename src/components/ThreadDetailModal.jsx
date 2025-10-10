/**
 * ThreadDetailModal Component - Thread Viewing and Reply Interface
 * Displays thread content with replies and allows users to participate in discussions
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Share2, 
  Flag, 
  Clock, 
  Eye, 
  Tag, 
  User,
  Send,
  Heart,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import { 
  getForumThread, 
  addForumReply, 
  toggleForumLike,
  POST_TYPES 
} from '@/services/forumService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';

// Post type colors
const POST_TYPE_COLORS = {
  [POST_TYPES.QUESTION]: 'bg-blue-100 text-blue-800',
  [POST_TYPES.DISCUSSION]: 'bg-green-100 text-green-800',
  [POST_TYPES.ANNOUNCEMENT]: 'bg-purple-100 text-purple-800',
  [POST_TYPES.RESOURCE_SHARE]: 'bg-orange-100 text-orange-800',
  [POST_TYPES.STUDY_GROUP]: 'bg-cyan-100 text-cyan-800',
  [POST_TYPES.JOB_POST]: 'bg-yellow-100 text-yellow-800'
};

const ThreadDetailModal = ({ isOpen, threadId, onClose }) => {
  // State management
  const [threadData, setThreadData] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());

  // Context hooks
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load thread data when modal opens
  useEffect(() => {
    if (isOpen && threadId) {
      loadThreadData();
    }
  }, [isOpen, threadId]);

  /**
   * Load thread and replies data
   */
  const loadThreadData = async () => {
    try {
      setLoading(true);
      const result = await getForumThread(threadId);

      if (result.success) {
        setThreadData(result.data.thread);
        setReplies(result.data.replies);
      } else {
        addToast('Failed to load thread', 'error');
        onClose();
      }
    } catch (error) {
      console.error('Error loading thread:', error);
      addToast('Failed to load thread', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle reply submission
   */
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);

    try {
      const result = await addForumReply(
        threadId,
        user.uid,
        user.displayName || 'Anonymous',
        {
          content: replyContent,
          authorLevel: user.courseAccess?.level || 'Student'
        }
      );

      if (result.success) {
        setReplies(prev => [...prev, {
          ...result.data,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
        setReplyContent('');
        addToast('Reply posted successfully!', 'success');
        
        // Update thread reply count
        setThreadData(prev => ({
          ...prev,
          replyCount: (prev.replyCount || 0) + 1
        }));
      } else {
        throw new Error(result.error || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      addToast('Failed to post reply. Please try again.', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  /**
   * Handle like/unlike toggle
   */
  const handleLikeToggle = async (itemType, itemId) => {
    try {
      const result = await toggleForumLike(
        user.uid,
        itemType,
        itemId,
        itemType === 'reply' ? threadId : null
      );

      if (result.success) {
        const likeKey = `${itemType}_${itemId}`;
        
        if (result.data.isLiked) {
          setLikedItems(prev => new Set([...prev, likeKey]));
        } else {
          setLikedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(likeKey);
            return newSet;
          });
        }

        // Update like count in UI
        if (itemType === 'thread') {
          setThreadData(prev => ({
            ...prev,
            likeCount: result.data.isLiked 
              ? (prev.likeCount || 0) + 1 
              : Math.max((prev.likeCount || 0) - 1, 0)
          }));
        } else {
          setReplies(prev => prev.map(reply => 
            reply.id === itemId
              ? {
                  ...reply,
                  likeCount: result.data.isLiked 
                    ? (reply.likeCount || 0) + 1 
                    : Math.max((reply.likeCount || 0) - 1, 0)
                }
              : reply
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      addToast('Failed to update like', 'error');
    }
  };

  /**
   * Format time ago
   */
  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  /**
   * Get category display name
   */
  const getCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  /**
   * Get post type display name
   */
  const getPostTypeName = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading thread...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!threadData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {threadData.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${POST_TYPE_COLORS[threadData.type] || 'bg-gray-100 text-gray-800'}`}>
                  {getPostTypeName(threadData.type)}
                </span>
                <span className="text-sm text-gray-500">
                  {getCategoryName(threadData.category)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Thread Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Main Thread Post */}
          <div className="p-6 border-b border-gray-200">
            {/* Thread Stats */}
            <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {threadData.viewCount || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Reply className="h-4 w-4" />
                {threadData.replyCount || 0} replies
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {threadData.likeCount || 0} likes
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimeAgo(threadData.createdAt)}
              </span>
            </div>

            {/* Thread Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {threadData.content}
              </p>
            </div>

            {/* Tags */}
            {threadData.tags && threadData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {threadData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Thread Actions */}
            <div className="flex items-center justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{threadData.authorName}</p>
                  <p className="text-sm text-gray-500">{threadData.authorLevel}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeToggle('thread', threadData.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    likedItems.has(`thread_${threadData.id}`)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {threadData.likeCount || 0}
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            </div>
          </div>

          {/* Replies Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Reply className="h-5 w-5" />
              Replies ({replies.length})
            </h3>

            {/* Reply Form */}
            {user && (
              <div className="mb-6">
                <form onSubmit={handleReplySubmit}>
                  <div className="border border-gray-300 rounded-lg">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Share your thoughts and contribute to the discussion..."
                      className="w-full px-4 py-3 border-0 rounded-t-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      maxLength={2000}
                    />
                    
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                      <span className="text-sm text-gray-500">
                        {replyContent.length}/2000 characters
                      </span>
                      
                      <button
                        type="submit"
                        disabled={!replyContent.trim() || isSubmittingReply}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        {isSubmittingReply ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Post Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Replies List */}
            <div className="space-y-4">
              {replies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Reply className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-1">No replies yet</p>
                  <p>Be the first to contribute to this discussion!</p>
                </div>
              ) : (
                replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                    {/* Reply Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reply.authorName}</p>
                          <p className="text-sm text-gray-500">{reply.authorLevel}</p>
                        </div>
                        {reply.isAcceptedAnswer && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Accepted Answer
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatTimeAgo(reply.createdAt)}</span>
                      </div>
                    </div>

                    {/* Reply Content */}
                    <div className="prose max-w-none mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                    </div>

                    {/* Reply Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLikeToggle('reply', reply.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                          likedItems.has(`reply_${reply.id}`)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className="h-3 w-3" />
                        {reply.likeCount || 0}
                      </button>

                      {threadData.type === POST_TYPES.QUESTION && threadData.authorId === user?.uid && (
                        <button className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-100 rounded transition-colors">
                          <CheckCircle className="h-3 w-3" />
                          Accept Answer
                        </button>
                      )}

                      <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:bg-gray-200 rounded transition-colors">
                        <Flag className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailModal;