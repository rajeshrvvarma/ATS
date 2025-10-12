import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Settings,
  Download,
  BookOpen,
  Clock,
  CheckCircle,
  Eye,
  Lock,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  List,
  X,
  AlertCircle,
  Shield
} from 'lucide-react';
import { getSecureContentUrl, checkContentAccess } from '@/services/googleCloudStorage.js';

/**
 * SecureContentViewer - Protected content viewer for enrolled students
 * Features: Video player, document viewer, progress tracking, access control
 */
const SecureContentViewer = ({ 
  course, 
  currentLesson, 
  user, 
  onLessonComplete, 
  onClose,
  onNextLesson,
  onPreviousLesson,
  enrollmentStatus = null
}) => {
  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Content access states
  const [hasAccess, setHasAccess] = useState(false);
  const [secureContentUrl, setSecureContentUrl] = useState(null);
  const [accessChecking, setAccessChecking] = useState(true);

  // UI states
  const [showControls, setShowControls] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [watchTime, setWatchTime] = useState(0);

  // Refs
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const viewerRef = useRef(null);

  // Check content access and load secure URL
  useEffect(() => {
    checkLessonAccess();
  }, [currentLesson, user]);

  // Update watch time for progress tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && videoRef.current) {
        setWatchTime(prev => prev + 1);
        // Save progress every 30 seconds
        if (watchTime % 30 === 0) {
          saveProgress();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, watchTime]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const checkLessonAccess = async () => {
    setAccessChecking(true);
    setError(null);

    try {
      // Check if user has access to this course/lesson
      const accessGranted = await checkContentAccess(user.uid, course.id);
      
      if (!accessGranted && !currentLesson.isPreview) {
        setHasAccess(false);
        setAccessChecking(false);
        return;
      }

      setHasAccess(true);

      // Get secure content URL
      if (currentLesson.content) {
        const secureUrl = await getSecureContentUrl(
          currentLesson.content, 
          user.uid, 
          course.id
        );
        
        if (secureUrl) {
          setSecureContentUrl(secureUrl);
        } else if (currentLesson.isPreview) {
          // For preview lessons, use direct URL
          setSecureContentUrl(currentLesson.content);
        }
      }
    } catch (error) {
      console.error('Access check failed:', error);
      setError('Failed to verify content access');
    } finally {
      setAccessChecking(false);
      setIsLoading(false);
    }
  };

  const saveProgress = () => {
    if (!videoRef.current) return;

    const progress = {
      courseId: course.id,
      lessonId: currentLesson.id,
      watchTime: watchTime,
      currentTime: videoRef.current.currentTime,
      duration: videoRef.current.duration,
      completed: videoRef.current.currentTime / videoRef.current.duration > 0.8,
      lastAccessed: new Date().toISOString()
    };

    // Save to localStorage for now (in real app, save to database)
    const userProgress = JSON.parse(localStorage.getItem(`progress_${user.uid}`) || '{}');
    if (!userProgress[course.id]) {
      userProgress[course.id] = {};
    }
    userProgress[course.id][currentLesson.id] = progress;
    localStorage.setItem(`progress_${user.uid}`, JSON.stringify(userProgress));

    // Mark lesson as complete if watch time > 80%
    if (progress.completed && onLessonComplete) {
      onLessonComplete(currentLesson.id);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (seekTime) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (newVolume) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;

    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render access denied state
  if (accessChecking) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Verifying access...</p>
      </div>
    );
  }

  if (!hasAccess && !currentLesson.isPreview) {
    return (
      <div className="bg-slate-900 rounded-xl p-8">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
          <p className="text-slate-400 mb-6">
            You need to be enrolled in this course to access this content.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Content Protection Active</span>
            </div>
            <p className="text-red-300 text-sm mt-1">
              This lesson requires course enrollment for access.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Content Error</h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => checkLessonAccess()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={viewerRef}
      className="bg-slate-900 rounded-xl overflow-hidden relative"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-semibold">{currentLesson.title}</h2>
              <p className="text-slate-400 text-sm">{course.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentLesson.isPreview && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                Preview
              </span>
            )}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-slate-400 hover:text-white p-2"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-slate-400 hover:text-white p-2"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Video Player */}
          {currentLesson.type === 'video' && secureContentUrl && (
            <div className="relative bg-black">
              <video
                ref={videoRef}
                src={secureContentUrl}
                className="w-full h-96 object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  setDuration(videoRef.current.duration);
                  setIsLoading(false);
                }}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  saveProgress();
                  if (onNextLesson) {
                    onNextLesson();
                  }
                }}
              />

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              {/* Video Controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                  >
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="bg-slate-600 h-1 rounded-full cursor-pointer"
                           onClick={(e) => {
                             const rect = e.currentTarget.getBoundingClientRect();
                             const clickX = e.clientX - rect.left;
                             const newTime = (clickX / rect.width) * duration;
                             handleSeek(newTime);
                           }}>
                        <div 
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePlayPause}
                          className="text-white hover:text-blue-400 p-2"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        
                        <button
                          onClick={onPreviousLesson}
                          disabled={!onPreviousLesson}
                          className="text-white hover:text-blue-400 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={onNextLesson}
                          disabled={!onNextLesson}
                          className="text-white hover:text-blue-400 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-blue-400"
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </div>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={playbackRate}
                          onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                          className="bg-slate-700 text-white text-sm px-2 py-1 rounded"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>

                        <button
                          onClick={toggleFullscreen}
                          className="text-white hover:text-blue-400 p-2"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Document Viewer */}
          {currentLesson.type === 'document' && secureContentUrl && (
            <div className="bg-white h-96">
              <iframe
                src={secureContentUrl}
                className="w-full h-full"
                title={currentLesson.title}
              />
            </div>
          )}

          {/* Lesson Description */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">{currentLesson.title}</h3>
            <p className="text-slate-400 mb-4">{currentLesson.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentLesson.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Watch time: {Math.floor(watchTime / 60)}m {watchTime % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {(showPlaylist || showNotes) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-800 border-l border-slate-700 overflow-hidden"
            >
              {showPlaylist && (
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-4">Course Lessons</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {course.lessons?.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          lesson.id === currentLesson.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{index + 1}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{lesson.title}</p>
                            <p className="text-xs opacity-75">{lesson.duration}</p>
                          </div>
                          {lesson.isPreview && (
                            <Eye className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showNotes && (
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-4">My Notes</h4>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Take notes while watching..."
                    className="w-full h-64 bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => {
                      // Save notes to localStorage
                      const notes = JSON.parse(localStorage.getItem(`notes_${user.uid}`) || '{}');
                      if (!notes[course.id]) notes[course.id] = {};
                      notes[course.id][currentLesson.id] = userNotes;
                      localStorage.setItem(`notes_${user.uid}`, JSON.stringify(notes));
                    }}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security Watermark */}
      <div className="absolute top-20 right-4 opacity-20 pointer-events-none">
        <div className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-400">
          {user.email} | {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default SecureContentViewer;