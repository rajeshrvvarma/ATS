/**
 * PeerMentoring Component - AI-Powered Student Matching System
 * Connects students for mentorship based on skills, experience, and learning goals
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  Award,
  Brain,
  Target,
  TrendingUp,
  User,
  Send,
  CheckCircle,
  X,
  Plus,
  Filter,
  Globe,
  BookOpen,
  Sparkles,
  Heart,
  AlertCircle
} from 'lucide-react';
import { 
  findBestMentors, 
  createMentorProfile,
  createMenteeProfile,
  sendMentorshipRequest,
  getMentoringStats,
  MENTORING_CATEGORIES,
  EXPERIENCE_LEVELS,
  getCategoryName,
  getExperienceName
} from '@/services/peerMentoringService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';

const PeerMentoring = ({ onClose }) => {
  // State management
  const [view, setView] = useState('discover'); // discover, mentors, mentees, profile, requests
  const [mentors, setMentors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileType, setProfileType] = useState('mentee'); // mentor or mentee
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    experience: '',
    language: '',
    availability: ''
  });

  // Context hooks
  const { user } = useAuth();
  const { addToast } = useToast();

  // Load initial data
  useEffect(() => {
    loadMentoringData();
  }, []);

  /**
   * Load mentoring statistics and user profile
   */
  const loadMentoringData = async () => {
    try {
      setLoading(true);

      // Load mentoring statistics
      const statsResult = await getMentoringStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Check if user has mentoring profiles
      // In real implementation, you'd check Firebase for existing profiles
      // For now, we'll simulate this

    } catch (error) {
      console.error('Error loading mentoring data:', error);
      addToast('Failed to load mentoring data', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Find mentors for the current user
   */
  const handleFindMentors = async () => {
    if (!user) {
      addToast('Please login to find mentors', 'error');
      return;
    }

    try {
      setLoading(true);
      const result = await findBestMentors(user.uid);
      
      if (result.success) {
        setMentors(result.data);
        setView('mentors');
        if (result.data.length === 0) {
          addToast('No mentors found. Try adjusting your preferences.', 'info');
        } else {
          addToast(`Found ${result.data.length} potential mentors!`, 'success');
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error finding mentors:', error);
      addToast('Failed to find mentors. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle mentor request
   */
  const handleSendRequest = async (requestData) => {
    try {
      const result = await sendMentorshipRequest(
        user.uid,
        selectedMentor.id,
        requestData
      );

      if (result.success) {
        addToast('Mentorship request sent successfully!', 'success');
        setShowRequestModal(false);
        setSelectedMentor(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      addToast('Failed to send request. Please try again.', 'error');
    }
  };

  /**
   * Render discovery/home view
   */
  const renderDiscoveryView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Peer Mentoring
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Connect with experienced cybersecurity professionals and accelerate your learning journey
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleFindMentors}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
            >
              <Brain className="h-5 w-5" />
              Find My Mentors
            </button>
            
            <button
              onClick={() => {
                setProfileType('mentor');
                setShowProfileSetup(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
            >
              <Star className="h-5 w-5" />
              Become a Mentor
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMentors}</p>
                <p className="text-sm text-gray-600">Active Mentors</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMentees}</p>
                <p className="text-sm text-gray-600">Learning Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMentorships}</p>
                <p className="text-sm text-gray-600">Active Matches</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.matchSuccessRate}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Matching</h3>
            <p className="text-gray-600">
              Our AI analyzes your skills, goals, and preferences to find the perfect mentor match
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Learn</h3>
            <p className="text-gray-600">
              Start conversations, schedule sessions, and receive personalized guidance
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Achieve Goals</h3>
            <p className="text-gray-600">
              Track progress, complete milestones, and advance your cybersecurity career
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentoring Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(MENTORING_CATEGORIES).map(([key, value]) => (
            <div
              key={value}
              className="p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  {getCategoryName(value)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {stats?.categoryStats?.[value] || 0} mentors
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Render mentors list view
   */
  const renderMentorsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Matched Mentors</h2>
          <p className="text-gray-600">
            {mentors.length} mentors found based on your profile and goals
          </p>
        </div>
        
        <button
          onClick={() => setView('discover')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Back to Discovery
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {Object.entries(MENTORING_CATEGORIES).map(([key, value]) => (
              <option key={value} value={value}>
                {getCategoryName(value)}
              </option>
            ))}
          </select>

          <select
            value={filters.experience}
            onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience Levels</option>
            {Object.entries(EXPERIENCE_LEVELS).map(([key, value]) => (
              <option key={value} value={value}>
                {getExperienceName(value)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Mentor Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {mentor.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{mentor.userName}</h3>
                  <p className="text-gray-600">{getExperienceName(mentor.experience)} Level</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{mentor.totalReviews} reviews</span>
                  </div>
                </div>
              </div>
              
              {/* Compatibility Score */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  mentor.compatibilityScore >= 80 ? 'text-green-600' :
                  mentor.compatibilityScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {mentor.compatibilityScore}%
                </div>
                <p className="text-xs text-gray-500">Match</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 mb-4 line-clamp-2">{mentor.bio}</p>

            {/* Expertise */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{mentor.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Matching Reasons */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Why this match?
              </h4>
              <ul className="space-y-1">
                {mentor.matchingReasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {mentor.successfulMatches} successful matches
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mentor.timezone}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {mentor.languages.join(', ')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedMentor(mentor);
                  setShowRequestModal(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send Request
              </button>
              
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {mentors.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your preferences or check back later for new mentors.
          </p>
          <button
            onClick={() => setView('discover')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Discovery
          </button>
        </div>
      )}
    </div>
  );

  if (loading && view === 'discover') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading mentoring system...</span>
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
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Discover
          </button>
          
          <button
            onClick={() => setView('mentors')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'mentors'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find Mentors
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
      {view === 'mentors' && renderMentorsView()}

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <MentorshipRequestModal
          mentor={selectedMentor}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedMentor(null);
          }}
          onSendRequest={handleSendRequest}
        />
      )}
    </div>
  );
};

/**
 * Mentorship Request Modal Component
 */
const MentorshipRequestModal = ({ mentor, onClose, onSendRequest }) => {
  const [requestData, setRequestData] = useState({
    message: '',
    categories: [],
    goals: '',
    duration: '1-month',
    schedule: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSendRequest(requestData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Mentorship Request</h2>
            <p className="text-gray-600">To {mentor.userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message *
            </label>
            <textarea
              value={requestData.message}
              onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Introduce yourself and explain why you'd like this mentor's guidance..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Goals
            </label>
            <textarea
              value={requestData.goals}
              onChange={(e) => setRequestData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="What do you hope to achieve through this mentorship?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Duration
            </label>
            <select
              value={requestData.duration}
              onChange={(e) => setRequestData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1-month">1 Month</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !requestData.message.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeerMentoring;