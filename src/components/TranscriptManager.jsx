/**
 * TranscriptManager - Component for testing and managing video transcripts
 * Allows bulk processing, testing, and management of YouTube video transcripts
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play,
  Search,
  Zap,
  BarChart3
} from 'lucide-react';
import { TranscriptManagementService } from '@/services/transcriptManagementService.js';
import { loadCourses } from '@/services/courseService.js';
import { useToast } from '@/context/ToastContext.jsx';

const TranscriptManager = ({ onClose }) => {
  const [courses, setCourses] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const coursesData = loadCourses();
    setCourses(coursesData);
    
    const transcriptStats = TranscriptManagementService.getStats();
    setStats(transcriptStats);
  };

  const handleProcessAllTranscripts = async () => {
    if (processing) return;
    
    setProcessing(true);
    setProgress({ current: 0, total: 0 });
    
    try {
      const results = await TranscriptManagementService.processAll((current, total, lessonResult) => {
        setProgress({ current, total });
        
        if (lessonResult.success) {
          addToast(`✅ Transcript processed: ${lessonResult.lesson.title}`, 'success');
        }
      });
      
      addToast(`🎉 Processing complete! ${results.successful}/${results.processed} transcripts processed successfully`, 'success');
      loadData(); // Refresh data
      
    } catch (error) {
      console.error('Transcript processing failed:', error);
      addToast('❌ Transcript processing failed', 'error');
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleSearchTranscripts = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = TranscriptManagementService.searchAll(searchQuery);
    setSearchResults(results);
  };

  const handleRefreshLesson = async (courseId, lessonId, lessonTitle) => {
    try {
      await TranscriptManagementService.refreshLesson(courseId, lessonId);
      addToast(`✅ Refreshed transcript for: ${lessonTitle}`, 'success');
      loadData();
    } catch (error) {
      addToast(`❌ Failed to refresh transcript: ${error.message}`, 'error');
    }
  };

  const exportAllTranscripts = () => {
    const lessonsWithTranscripts = TranscriptManagementService.getLessonsWithTranscripts();
    
    const exportData = lessonsWithTranscripts.map(lesson => ({
      course: lesson.courseTitle,
      lesson: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      transcript: lesson.transcript.text,
      processedAt: lesson.transcript.processedAt
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-transcripts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToast('📁 Transcripts exported successfully', 'success');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loaded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'loaded':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'loading':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Transcript Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'courses', label: 'Courses', icon: Play },
            { id: 'search', label: 'Search', icon: Search }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
                    <div className="text-sm text-gray-400">Total Lessons</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{stats.youtubeLessons}</div>
                    <div className="text-sm text-gray-400">YouTube Videos</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{stats.transcriptsLoaded}</div>
                    <div className="text-sm text-gray-400">Transcripts Ready</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{stats.completionRate}%</div>
                    <div className="text-sm text-gray-400">Completion Rate</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Transcript Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleProcessAllTranscripts}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing... ({progress.current}/{progress.total})
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Process All Transcripts
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={exportAllTranscripts}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export All Transcripts
                  </button>
                </div>

                {processing && (
                  <div className="mt-4">
                    <div className="bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                    <span className="text-sm text-gray-400">
                      {course.lessons.filter(l => l.type === 'youtube').length} YouTube videos
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {course.lessons.filter(l => l.type === 'youtube').map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between bg-slate-600 rounded p-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(lesson.transcriptStatus)}
                          <div>
                            <div className="text-white text-sm font-medium">{lesson.title}</div>
                            <div className={`text-xs ${getStatusColor(lesson.transcriptStatus)}`}>
                              {lesson.transcriptStatus === 'loaded' && lesson.transcript ? 
                                `${lesson.transcript.text.split(' ').length} words` :
                                lesson.transcriptStatus || 'pending'
                              }
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRefreshLesson(course.id, lesson.id, lesson.title)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Refresh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search across all video transcripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchTranscripts()}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearchTranscripts}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    Search Results ({searchResults.length})
                  </h3>
                  
                  {searchResults.map((result, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-white font-medium">{result.lessonTitle}</div>
                          <div className="text-sm text-gray-400">{result.courseTitle}</div>
                        </div>
                        <div className="text-xs text-blue-400">
                          Relevance: {Math.round(result.relevance)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-300 bg-slate-600 rounded p-2">
                        "...{result.match}..."
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptManager;