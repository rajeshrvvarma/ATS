/**
 * StudyGroups Component - Collaborative Learning Group Management
 * Allows students to create, join, and manage study groups with scheduling and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Filter,
  User,
  MessageSquare,
  Video,
  FileText,
  CheckCircle,
  X,
  Send,
  Settings,
  Globe,
  Lock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  getStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  getStudyGroupRecommendations,
  searchStudyGroups,
  getStudyGroupStats,
  STUDY_CATEGORIES,
  GROUP_TYPES,
  GROUP_STATUS,
  MEETING_TYPES,
  getCategoryName,
  getGroupTypeName,
  getStatusName
} from '@/services/studyGroupService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';

const StudyGroups = ({ onClose }) => {
  // State management
  const [view, setView] = useState('discover'); // discover, browse, my-groups, create
  const [groups, setGroups] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    status: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Context hooks
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadStudyGroupsData();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else if (view === 'browse') {
      loadGroups();
    }
  }, [searchTerm, filters]);

  /**
   * Load all study groups data
   */
  const loadStudyGroupsData = async () => {
    try {
      setLoading(true);

      // Load statistics
      const statsResult = await getStudyGroupStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Load recommendations if user is logged in
      if (user) {
        const userProfile = {
          interests: ['cybersecurity', 'ethical-hacking'],
          experience: 'intermediate',
          goals: ['skill-development', 'certification'],
          availability: 'evenings',
          learningStyle: 'collaborative'
        };

        const recResult = await getStudyGroupRecommendations(user.uid, userProfile);
        if (recResult.success) {
          setRecommendations(recResult.data);
        }
      }

      // Load recent active groups
      await loadGroups();

    } catch (error) {
      console.error('Error loading study groups data:', error);
      addToast('Failed to load study groups data', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load study groups with current filters
   */
  const loadGroups = async () => {
    try {
      const result = await getStudyGroups({
        category: filters.category || null,
        type: filters.type || null,
        status: filters.status || null,
        isRecruitingOnly: view === 'browse',
        limit: 20
      });

      if (result.success) {
        setGroups(result.data);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      addToast('Failed to load groups', 'error');
    }
  };

  /**
   * Handle search
   */
  const handleSearch = async () => {
    try {
      setLoading(true);
      const result = await searchStudyGroups(searchTerm, {
        category: filters.category || null,
        type: filters.type || null,
        maxResults: 15
      });

      if (result.success) {
        setGroups(result.data);
      }
    } catch (error) {
      console.error('Error searching groups:', error);
      addToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle join group
   */
  const handleJoinGroup = async (group, joinMessage = '') => {
    if (!user) {
      addToast('Please login to join study groups', 'error');
      return;
    }

    try {
      const result = await joinStudyGroup(
        group.id,
        user.uid,
        user.displayName || 'Anonymous',
        joinMessage
      );

      if (result.success) {
        addToast('Successfully joined the study group!', 'success');
        setShowJoinModal(false);
        setSelectedGroup(null);
        // Refresh groups
        await loadGroups();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      addToast(error.message || 'Failed to join group', 'error');
    }
  };

  /**
   * Format schedule display
   */
  const formatSchedule = (schedule) => {
    if (!schedule) return 'Flexible';
    return `${schedule.frequency} on ${schedule.dayOfWeek}s at ${schedule.time}`;
  };

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case GROUP_STATUS.RECRUITING: return 'bg-green-100 text-green-800';
      case GROUP_STATUS.ACTIVE: return 'bg-blue-100 text-blue-800';
      case GROUP_STATUS.FULL: return 'bg-yellow-100 text-yellow-800';
      case GROUP_STATUS.COMPLETED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Render discovery view
   */
  const renderDiscoveryView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full">
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study Groups & Collaborative Learning
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Join study groups, collaborate with peers, and accelerate your cybersecurity learning journey
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView('browse')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
            >
              <Search className="h-5 w-5" />
              Browse Groups
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Group
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGroups}</p>
                <p className="text-sm text-gray-600">Total Groups</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeGroups}</p>
                <p className="text-sm text-gray-600">Active Groups</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                <p className="text-sm text-gray-600">Sessions Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Recommended Groups</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.slice(0, 4).map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                    <p className="text-gray-600 text-sm">{getCategoryName(group.category)}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{group.compatibilityScore}%</div>
                    <p className="text-xs text-gray-500">Match</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{group.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.currentMembers}/{group.maxMembers}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatSchedule(group.schedule)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Why this match?</p>
                  <ul className="space-y-1">
                    {group.matchReasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowJoinModal(true);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(STUDY_CATEGORIES).map(([key, value]) => (
            <div
              key={value}
              className="p-4 bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: value }));
                setView('browse');
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  {getCategoryName(value)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {stats?.categoryStats?.[value] || 0} groups
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Render browse groups view
   */
  const renderBrowseView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse Study Groups</h2>
          <p className="text-gray-600">
            {groups.length} groups available to join
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search study groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {Object.entries(STUDY_CATEGORIES).map(([key, value]) => (
              <option key={value} value={value}>
                {getCategoryName(value)}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            {Object.entries(GROUP_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {getGroupTypeName(value)}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value={GROUP_STATUS.RECRUITING}>Recruiting</option>
            <option value={GROUP_STATUS.ACTIVE}>Active</option>
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{group.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{getCategoryName(group.category)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{getGroupTypeName(group.type)}</span>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group.status)}`}>
                {getStatusName(group.status)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4 line-clamp-2">{group.description}</p>

            {/* Group Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {group.currentMembers}/{group.maxMembers} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatSchedule(group.schedule)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  {group.meetingType === MEETING_TYPES.VIRTUAL ? 'Virtual' : 'Hybrid'}
                </span>
                <span className="flex items-center gap-1">
                  {group.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {group.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Tags */}
            {group.tags && group.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {group.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{group.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedGroup(group);
                  setShowJoinModal(true);
                }}
                disabled={group.currentMembers >= group.maxMembers}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="h-4 w-4" />
                {group.currentMembers >= group.maxMembers ? 'Full' : 'Join Group'}
              </button>
              
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No study groups found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a study group!'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Study Group
          </button>
        </div>
      )}
    </div>
  );

  if (loading && view === 'discover') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading study groups...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setView('discover')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'discover'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Discover
          </button>
          
          <button
            onClick={() => setView('browse')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'browse'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse Groups
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      {view === 'discover' && renderDiscoveryView()}
      {view === 'browse' && renderBrowseView()}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={(groupData) => {
            setShowCreateModal(false);
            addToast('Study group created successfully!', 'success');
            loadGroups();
          }}
        />
      )}

      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <JoinGroupModal
          group={selectedGroup}
          onClose={() => {
            setShowJoinModal(false);
            setSelectedGroup(null);
          }}
          onJoinGroup={handleJoinGroup}
        />
      )}
    </div>
  );
};

/**
 * Create Group Modal Component
 */
const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    category: '',
    type: GROUP_TYPES.COURSE_STUDY,
    maxMembers: 8,
    isPublic: true,
    tags: [],
    goals: [],
    requirements: [],
    schedule: {
      frequency: 'weekly',
      dayOfWeek: 'Sunday',
      time: '19:00',
      timezone: 'Asia/Kolkata',
      duration: 120
    },
    meetingType: MEETING_TYPES.VIRTUAL,
    meetingLink: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await createStudyGroup(
        user.uid,
        user.displayName || 'Anonymous',
        groupData
      );

      if (result.success) {
        onGroupCreated(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      addToast('Failed to create study group', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!groupData.name.trim()) newErrors.name = 'Group name is required';
    if (!groupData.category) newErrors.category = 'Category is required';
    if (!groupData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !groupData.tags.includes(tag) && groupData.tags.length < 5) {
      setGroupData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Study Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupData.name}
              onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive name for your study group"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={groupData.category}
                onChange={(e) => setGroupData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {Object.entries(STUDY_CATEGORIES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {getCategoryName(value)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Type
              </label>
              <select
                value={groupData.type}
                onChange={(e) => setGroupData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(GROUP_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {getGroupTypeName(value)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={groupData.description}
              onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Describe your study group goals, topics, and what members can expect"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Members
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={groupData.maxMembers}
                onChange={(e) => setGroupData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy
              </label>
              <select
                value={groupData.isPublic.toString()}
                onChange={(e) => setGroupData(prev => ({ ...prev, isPublic: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="true">Public - Anyone can join</option>
                <option value="false">Private - Invitation only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Add tags to help others find your group"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            {groupData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {groupData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setGroupData(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      }))}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Join Group Modal Component
 */
const JoinGroupModal = ({ group, onClose, onJoinGroup }) => {
  const [joinMessage, setJoinMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoinGroup(group, joinMessage);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Join Study Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
            <p className="text-gray-600 text-sm">{group.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction Message (Optional)
            </label>
            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Introduce yourself to the group..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg flex items-center gap-2"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Joining...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Join Group
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;