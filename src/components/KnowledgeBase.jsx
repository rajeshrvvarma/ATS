import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  User, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2,
  Clock,
  Users,
  Star,
  TrendingUp,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getWikiArticles,
  getWikiArticle,
  createWikiArticle,
  updateWikiArticle,
  deleteWikiArticle,
  toggleArticleLike,
  searchWikiArticles,
  getArticleRecommendations,
  getWikiStatistics,
  submitForPeerReview
} from '../services/knowledgeBaseService';

const KnowledgeBase = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [activeView, setActiveView] = useState('browse'); // browse, create, article, stats
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('updated');
  
  // Article creation/editing states
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    categories: [],
    tags: [],
    collaborativeMode: false,
    peerReview: { required: false }
  });
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    'Network Security', 'Web Application Security', 'Cryptography',
    'Incident Response', 'Penetration Testing', 'Security Frameworks',
    'Compliance', 'Risk Management', 'Digital Forensics', 'Malware Analysis',
    'Security Tools', 'Best Practices', 'Case Studies', 'Tutorials'
  ];

  const popularTags = [
    'beginner', 'intermediate', 'advanced', 'hands-on', 'theory',
    'certification', 'CISSP', 'CEH', 'OSCP', 'vulnerability',
    'exploit', 'defense', 'monitoring', 'analysis', 'methodology'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [articlesData, recommendationsData, statsData] = await Promise.all([
        getWikiArticles({ status: 'published' }),
        getArticleRecommendations(currentUser?.uid),
        getWikiStatistics()
      ]);
      
      setArticles(articlesData);
      setRecommendations(recommendationsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error loading knowledge base data:', error);
      showToast('Failed to load knowledge base', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    try {
      setLoading(true);
      const results = await searchWikiArticles(searchQuery, {
        category: selectedCategory,
        tags: selectedTags,
        sortBy
      });
      setArticles(results);
    } catch (error) {
      console.error('Error searching articles:', error);
      showToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const newArticle = await createWikiArticle(articleForm, currentUser.uid);
      setArticles(prev => [newArticle, ...prev]);
      setArticleForm({
        title: '',
        content: '',
        categories: [],
        tags: [],
        collaborativeMode: false,
        peerReview: { required: false }
      });
      setActiveView('browse');
      showToast('Article created successfully!', 'success');
    } catch (error) {
      console.error('Error creating article:', error);
      showToast('Failed to create article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = async (articleId) => {
    try {
      setLoading(true);
      const article = await getWikiArticle(articleId);
      setSelectedArticle(article);
      setActiveView('article');
    } catch (error) {
      console.error('Error loading article:', error);
      showToast('Failed to load article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeArticle = async (articleId) => {
    try {
      const result = await toggleArticleLike(articleId, currentUser.uid);
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, likes: article.likes + (result.liked ? 1 : -1) }
          : article
      ));
      
      if (selectedArticle?.id === articleId) {
        setSelectedArticle(prev => ({
          ...prev,
          likes: prev.likes + (result.liked ? 1 : -1)
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      showToast('Failed to update like', 'error');
    }
  };

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    if (selectedCategory) {
      filtered = filtered.filter(article => 
        article.categories?.includes(selectedCategory)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(article =>
        selectedTags.some(tag => article.tags?.includes(tag))
      );
    }

    // Sort articles
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default: // 'updated'
          return new Date(b.updatedAt?.toDate() || 0) - new Date(a.updatedAt?.toDate() || 0);
      }
    });
  }, [articles, selectedCategory, selectedTags, sortBy]);

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveView('browse')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'browse'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Articles</span>
            </button>
            
            <button
              onClick={() => setActiveView('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'create'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
            
            <button
              onClick={() => setActiveView('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'stats'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Statistics</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {articles.length} articles • {statistics?.totalViews || 0} total views
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'browse' && (
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="views">Most Viewed</option>
                    <option value="likes">Most Liked</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(prev => prev.filter(t => t !== tag));
                        } else {
                          setSelectedTags(prev => [...prev, tag]);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {recommendations.slice(0, 5).map(article => (
                      <button
                        key={article.id}
                        onClick={() => handleViewArticle(article.id)}
                        className="w-full text-left p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center space-x-2">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views || 0}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {article.likes || 0}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Articles List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {filteredAndSortedArticles.map(article => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewArticle(article.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {article.content?.substring(0, 200)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.categories?.slice(0, 2).map(category => (
                            <span
                              key={category}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                          {article.tags?.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Author
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views || 0}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.likes || 0}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {article.updatedAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredAndSortedArticles.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or create a new article.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Article</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter article title..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories
                      </label>
                      <select
                        multiple
                        value={articleForm.categories}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value);
                          setArticleForm(prev => ({ ...prev, categories: values }));
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <textarea
                        value={articleForm.tags.join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                          setArticleForm(prev => ({ ...prev, tags }));
                        }}
                        placeholder="beginner, tutorial, networking..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Content *
                    </label>
                    <textarea
                      value={articleForm.content}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      rows={20}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={articleForm.collaborativeMode}
                        onChange={(e) => setArticleForm(prev => ({ 
                          ...prev, 
                          collaborativeMode: e.target.checked 
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Allow collaborative editing
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={articleForm.peerReview.required}
                        onChange={(e) => setArticleForm(prev => ({ 
                          ...prev, 
                          peerReview: { ...prev.peerReview, required: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Require peer review before publishing
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setActiveView('browse')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateArticle}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Article'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'article' && selectedArticle && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200">
                {/* Article Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedArticle.title}
                      </h1>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Author
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {selectedArticle.updatedAt?.toDate().toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {selectedArticle.views || 0} views
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedArticle.categories?.map(category => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {selectedArticle.tags?.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col items-end space-y-2">
                      <button
                        onClick={() => handleLikeArticle(selectedArticle.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{selectedArticle.likes || 0}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Article Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {selectedArticle.content}
                    </div>
                  </div>
                </div>
                
                {/* Article Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedArticle.contributors?.length || 1} contributors
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Version {selectedArticle.version || 1}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setActiveView('browse')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Back to Articles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'stats' && statistics && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Base Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.totalArticles}
                      </p>
                      <p className="text-sm text-gray-600">Total Articles</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.publishedArticles}
                      </p>
                      <p className="text-sm text-gray-600">Published</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <Eye className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.totalViews.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Total Views</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center">
                    <Heart className="w-8 h-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.totalLikes}
                      </p>
                      <p className="text-sm text-gray-600">Total Likes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="space-y-3">
                    {statistics.popularTags.slice(0, 10).map(({ tag, count }) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-gray-700">#{tag}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(count / Math.max(...statistics.popularTags.map(t => t.count))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {statistics.categories.map(category => (
                      <div
                        key={category}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;