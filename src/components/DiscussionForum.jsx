/**
 * DiscussionForum Component - Social Learning Discussion System
 * Provides a comprehensive forum interface for student discussions and peer learning
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Clock, 
  Eye, 
  ThumbsUp,
  Reply,
  Tag,
  Star,
  AlertCircle,
  BookOpen,
  User
} from 'lucide-react';
import { 
  getForumThreads, 
  getForumStats, 
  getTrendingTopics,
  searchForum,
  FORUM_CATEGORIES,
  POST_TYPES 
} from '@/services/forumService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';

// Category icons mapping
const CATEGORY_ICONS = {
  [FORUM_CATEGORIES.GENERAL]: MessageSquare,
  [FORUM_CATEGORIES.DEFENSIVE_SECURITY]: MessageSquare,
  [FORUM_CATEGORIES.ETHICAL_HACKING]: MessageSquare,
  [FORUM_CATEGORIES.CAREER_ADVICE]: TrendingUp,
  [FORUM_CATEGORIES.STUDY_GROUPS]: Users,
  [FORUM_CATEGORIES.COURSE_HELP]: BookOpen,
  [FORUM_CATEGORIES.CERTIFICATION]: Star,
  [FORUM_CATEGORIES.JOB_OPPORTUNITIES]: MessageSquare,
  [FORUM_CATEGORIES.TECH_NEWS]: MessageSquare,
  [FORUM_CATEGORIES.PEER_HELP]: User
};

// Post type colors
const POST_TYPE_COLORS = {
  [POST_TYPES.QUESTION]: 'bg-blue-100 text-blue-800',
  [POST_TYPES.DISCUSSION]: 'bg-green-100 text-green-800',
  [POST_TYPES.ANNOUNCEMENT]: 'bg-purple-100 text-purple-800',
  [POST_TYPES.RESOURCE_SHARE]: 'bg-orange-100 text-orange-800',
  [POST_TYPES.STUDY_GROUP]: 'bg-cyan-100 text-cyan-800',
  [POST_TYPES.JOB_POST]: 'bg-yellow-100 text-yellow-800'
};

const DiscussionForum = ({ onCreateThread, onViewThread }) => {
  // State management
  const [threads, setThreads] = useState([]);
  const [forumStats, setForumStats] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');

  // Context hooks
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load forum data on component mount
  useEffect(() => {
    loadForumData();
  }, [selectedCategory, selectedType, sortBy]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      loadForumData();
    }
  }, [searchTerm]);

  /**
   * Load all forum data
   */
  const loadForumData = async () => {
    try {
      setLoading(true);

      // Load threads with filters
      const threadsResult = await getForumThreads({
        category: selectedCategory || null,
        type: selectedType || null,
        sortBy,
        limit: 20
      });

      if (threadsResult.success) {
        setThreads(threadsResult.data);
      }

      // Load forum statistics
      const statsResult = await getForumStats();
      if (statsResult.success) {
        setForumStats(statsResult.data);
      }

      // Load trending topics
      const trendingResult = await getTrendingTopics(5);
      if (trendingResult.success) {
        setTrendingTopics(trendingResult.data);
      }

    } catch (error) {
      console.error('Error loading forum data:', error);
      addToast('Failed to load forum data', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle forum search
   */
  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchResult = await searchForum(searchTerm, {
        category: selectedCategory || null,
        limit: 20
      });

      if (searchResult.success) {
        setThreads(searchResult.data);
      }
    } catch (error) {
      console.error('Error searching forum:', error);
      addToast('Search failed', 'error');
    } finally {
      setLoading(false);
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

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading discussions...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Discussion Forum
          </h1>
          <p className="text-gray-600 mt-1">
            Connect, learn, and grow with your cybersecurity community
          </p>
        </div>
        
        <button
          onClick={onCreateThread}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Thread
        </button>
      </div>

      {/* Forum Statistics */}
      {forumStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{forumStats.totalThreads}</p>
                <p className="text-sm text-gray-600">Total Threads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Reply className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{forumStats.totalReplies}</p>
                <p className="text-sm text-gray-600">Total Replies</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{forumStats.activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{forumStats.avgRepliesPerThread}</p>
                <p className="text-sm text-gray-600">Avg Replies</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {Object.entries(FORUM_CATEGORIES).map(([key, value]) => (
              <option key={value} value={value}>
                {getCategoryName(value)}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {Object.entries(POST_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {getPostTypeName(value)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="updatedAt">Latest Activity</option>
            <option value="createdAt">Newest First</option>
            <option value="replyCount">Most Replies</option>
            <option value="viewCount">Most Views</option>
            <option value="likeCount">Most Liked</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Threads List */}
        <div className="lg:col-span-3 space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
              </p>
              <button
                onClick={onCreateThread}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Thread
              </button>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onViewThread(thread.id)}
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${POST_TYPE_COLORS[thread.type] || 'bg-gray-100 text-gray-800'}`}>
                      {getPostTypeName(thread.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getCategoryName(thread.category)}
                    </span>
                    {thread.isSticky && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {thread.viewCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {thread.likeCount || 0}
                    </span>
                  </div>
                </div>

                {/* Thread Title and Content Preview */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {thread.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {thread.content.length > 150 
                    ? thread.content.substring(0, 150) + '...'
                    : thread.content
                  }
                </p>

                {/* Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Thread Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{thread.authorName}</p>
                        <p className="text-xs text-gray-500">{thread.authorLevel}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Reply className="h-4 w-4" />
                      {thread.replyCount || 0} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTimeAgo(thread.lastReplyAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          {trendingTopics.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Trending Topics
              </h3>
              
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => onViewThread(topic.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-orange-600">#{index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${POST_TYPE_COLORS[topic.type] || 'bg-gray-100 text-gray-800'}`}>
                        {getPostTypeName(topic.type)}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {topic.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{topic.replyCount || 0} replies</span>
                      <span>{formatTimeAgo(topic.lastReplyAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={onCreateThread}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Discussion
              </button>
              
              <button
                onClick={() => onCreateThread(POST_TYPES.QUESTION)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <AlertCircle className="h-4 w-4" />
                Ask Question
              </button>
              
              <button
                onClick={() => onCreateThread(POST_TYPES.STUDY_GROUP)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="h-4 w-4" />
                Start Study Group
              </button>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Community Guidelines</h3>
            
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Be respectful and professional</li>
              <li>• Search before posting</li>
              <li>• Use descriptive thread titles</li>
              <li>• Choose appropriate categories</li>
              <li>• Help others learn and grow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;