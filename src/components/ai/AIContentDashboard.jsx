/**
 * AI Content Dashboard Component
 * Central management interface for all AI-generated content
 */

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  Award,
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Wand2,
  RefreshCw
} from 'lucide-react';
import aiContentService from '../../services/aiContentService';
import transcriptManagementService from '../../services/transcriptManagementService';
import AIConfig from '../admin/AIConfig';
import AutoQuizGenerator from './AutoQuizGenerator';
import DiscussionSeedGenerator from './DiscussionSeedGenerator';
import CourseDescriptionGenerator from './CourseDescriptionGenerator';

const AIContentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contentStats, setContentStats] = useState({
    totalQuizzes: 0,
    totalDiscussions: 0,
    totalDescriptions: 0,
    totalVideosProcessed: 0,
    recentActivity: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState([]);
  const [serviceStatus, setServiceStatus] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'config', label: 'AI Configuration', icon: Settings },
    { id: 'quiz', label: 'Quiz Generator', icon: FileText },
    { id: 'discussions', label: 'Discussion Seeds', icon: MessageSquare },
    { id: 'descriptions', label: 'Course Descriptions', icon: BookOpen },
    { id: 'content', label: 'All Content', icon: Award }
  ];

  const contentTypes = [
    { id: 'all', label: 'All Content', icon: Award },
    { id: 'quiz', label: 'Quizzes', icon: FileText },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'descriptions', label: 'Descriptions', icon: BookOpen }
  ];

  useEffect(() => {
    loadDashboardData();
    updateServiceStatus();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, content] = await Promise.all([
        loadContentStats(),
        loadAllContent()
      ]);
      setContentStats(stats);
      setAllContent(content);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContentStats = async () => {
    try {
      // This would typically come from your backend/service
      const allVideos = await transcriptManagementService.getAllVideoData();
      
      let totalQuizzes = 0;
      let totalDiscussions = 0;
      let totalDescriptions = 0;
      let totalVideosProcessed = 0;
      const recentActivity = [];

      Object.entries(allVideos).forEach(([videoId, videoData]) => {
        if (videoData.quizzes) {
          totalQuizzes += videoData.quizzes.length;
          videoData.quizzes.forEach(quiz => {
            recentActivity.push({
              type: 'quiz',
              title: quiz.name,
              videoId,
              timestamp: quiz.savedAt,
              id: quiz.id
            });
          });
        }
        
        if (videoData.discussions) {
          totalDiscussions += videoData.discussions.length;
          videoData.discussions.forEach(discussion => {
            recentActivity.push({
              type: 'discussions',
              title: discussion.name,
              videoId,
              timestamp: discussion.savedAt,
              id: discussion.id
            });
          });
        }
        
        if (videoData.descriptions) {
          totalDescriptions += videoData.descriptions.length;
          videoData.descriptions.forEach(description => {
            recentActivity.push({
              type: 'descriptions',
              title: description.name,
              videoId,
              timestamp: description.savedAt,
              id: description.id
            });
          });
        }
        
        if (videoData.transcript || videoData.quizzes || videoData.discussions || videoData.descriptions) {
          totalVideosProcessed++;
        }
      });

      // Sort recent activity by timestamp
      recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        totalQuizzes,
        totalDiscussions,
        totalDescriptions,
        totalVideosProcessed,
        recentActivity: recentActivity.slice(0, 10) // Latest 10 items
      };
    } catch (error) {
      console.error('Failed to load content stats:', error);
      return {
        totalQuizzes: 0,
        totalDiscussions: 0,
        totalDescriptions: 0,
        totalVideosProcessed: 0,
        recentActivity: []
      };
    }
  };

  const loadAllContent = async () => {
    try {
      const allVideos = await transcriptManagementService.getAllVideoData();
      const content = [];

      Object.entries(allVideos).forEach(([videoId, videoData]) => {
        // Add quizzes
        if (videoData.quizzes) {
          videoData.quizzes.forEach(quiz => {
            content.push({
              ...quiz,
              type: 'quiz',
              videoId,
              icon: FileText,
              color: 'blue'
            });
          });
        }
        
        // Add discussions
        if (videoData.discussions) {
          videoData.discussions.forEach(discussion => {
            content.push({
              ...discussion,
              type: 'discussions',
              videoId,
              icon: MessageSquare,
              color: 'green'
            });
          });
        }
        
        // Add descriptions
        if (videoData.descriptions) {
          videoData.descriptions.forEach(description => {
            content.push({
              ...description,
              type: 'descriptions',
              videoId,
              icon: BookOpen,
              color: 'purple'
            });
          });
        }
      });

      return content.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } catch (error) {
      console.error('Failed to load all content:', error);
      return [];
    }
  };

  const updateServiceStatus = () => {
    setServiceStatus(aiContentService.getStatus());
  };

  const handleConfigUpdate = (config) => {
    updateServiceStatus();
    // Optionally refresh dashboard data
  };

  const filteredContent = allContent.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">AI Service Status</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Configuration</span>
              <div className="flex items-center gap-2">
                {serviceStatus?.configured ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${serviceStatus?.configured ? 'text-green-600' : 'text-red-600'}`}>
                  {serviceStatus?.configured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Model</span>
              <span className="text-sm text-gray-900">{serviceStatus?.model || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Queue</span>
              <span className="text-sm text-gray-900">
                {serviceStatus?.queueLength || 0} pending
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <div className="flex items-center gap-2">
                {serviceStatus?.processing ? (
                  <Clock className="w-4 h-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm text-gray-900">
                  {serviceStatus?.processing ? 'Processing' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
          
          {!serviceStatus?.configured && (
            <button
              onClick={() => setActiveTab('config')}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Configure AI Service
            </button>
          )}
        </div>

        {/* Content Statistics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Content Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contentStats.totalQuizzes}</div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contentStats.totalDiscussions}</div>
              <div className="text-sm text-gray-600">Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{contentStats.totalDescriptions}</div>
              <div className="text-sm text-gray-600">Descriptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{contentStats.totalVideosProcessed}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <div className="space-y-3">
          {contentStats.recentActivity.length > 0 ? (
            contentStats.recentActivity.map((activity, index) => {
              const typeConfig = contentTypes.find(t => t.id === activity.type);
              const IconComponent = typeConfig?.icon || Award;
              
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-xs text-gray-500">
                      {typeConfig?.label} • Video {activity.videoId} • 
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No AI-generated content yet</p>
              <p className="text-sm">Generate some content to see activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AllContentTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">Loading content...</p>
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredContent.map((item, index) => {
              const IconComponent = item.icon;
              
              return (
                <div key={`${item.type}-${item.id}-${index}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 text-${item.color}-600`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name || item.title}</h4>
                        <div className="text-sm text-gray-500">
                          {contentTypes.find(t => t.id === item.type)?.label} • 
                          Video {item.videoId} • 
                          {new Date(item.savedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedContent(item)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No content found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">AI Content Dashboard</h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'config' && <AIConfig onConfigUpdate={handleConfigUpdate} />}
        {activeTab === 'quiz' && <AutoQuizGenerator />}
        {activeTab === 'discussions' && <DiscussionSeedGenerator />}
        {activeTab === 'descriptions' && <CourseDescriptionGenerator />}
        {activeTab === 'content' && <AllContentTab />}
      </div>

      {/* Content Preview Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedContent.name || selectedContent.title}
                </h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  {contentTypes.find(t => t.id === selectedContent.type)?.label} • 
                  Video {selectedContent.videoId} • 
                  Saved {new Date(selectedContent.savedAt).toLocaleDateString()}
                </div>
                
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(selectedContent, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentDashboard;