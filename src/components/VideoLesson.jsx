import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/context/SettingsContext.jsx';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Bookmark, 
  Clock, 
  CheckCircle, 
  FileText, 
  Download, 
  Search,
  Brain,
  MessageSquare,
  BookOpen,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TranscriptManagementService } from '@/services/transcriptManagementService.js';
import transcriptManagementService from '@/services/transcriptManagementService.js';
import AutoQuizGenerator from './ai/AutoQuizGenerator.jsx';
import DiscussionSeedGenerator from './ai/DiscussionSeedGenerator.jsx';
import CourseDescriptionGenerator from './ai/CourseDescriptionGenerator.jsx';

export default function VideoLesson({ 
  lesson, 
  onProgress, 
  onComplete,
  showProgress = true 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  
  // AI Content states
  const [showAIContent, setShowAIContent] = useState(false);
  const [activeAITab, setActiveAITab] = useState('quiz');
  const [aiContent, setAIContent] = useState({
    quizzes: [],
    discussions: [],
    descriptions: []
  });
  
  const videoRef = useRef(null);
  const { enableShortcuts } = useSettings();

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`video_progress_${lesson.id}`);
    if (savedProgress) {
      const { currentTime: savedTime, completed } = JSON.parse(savedProgress);
      setCurrentTime(savedTime);
      setProgress((savedTime / duration) * 100);
      setIsCompleted(completed);
    }
  }, [lesson.id, duration]);

  // Load AI content for this video
  useEffect(() => {
    loadAIContent();
  }, [lesson.id]);

  const loadAIContent = async () => {
    try {
      const videoId = lesson.videoId || lesson.id;
      const [quizzes, discussions, descriptions] = await Promise.all([
        transcriptManagementService.getVideoQuizzes(videoId),
        transcriptManagementService.getVideoDiscussions(videoId),
        transcriptManagementService.getVideoDescriptions(videoId)
      ]);
      
      setAIContent({
        quizzes,
        discussions,
        descriptions
      });
    } catch (error) {
      console.error('Failed to load AI content:', error);
    }
  };

  const handleAIContentGenerated = (type, content) => {
    setAIContent(prev => ({
      ...prev,
      [type]: [...prev[type], content]
    }));
  };

  // Save progress to localStorage
  const saveProgress = (time, completed = false) => {
    const progressData = {
      currentTime: time,
      completed,
      timestamp: Date.now()
    };
    localStorage.setItem(`video_progress_${lesson.id}`, JSON.stringify(progressData));
  };

  // Handle video time update
  const handleTimeUpdate = (e) => {
    const time = e.target.currentTime;
    const dur = e.target.duration;
    
    setCurrentTime(time);
    setDuration(dur);
    
    const progressPercent = (time / dur) * 100;
    setProgress(progressPercent);
    
    // Save progress every 10 seconds
    if (Math.floor(time) % 10 === 0) {
      saveProgress(time, false);
    }
    
    // Mark as completed at 90% watched
    if (progressPercent >= 90 && !isCompleted) {
      setIsCompleted(true);
      saveProgress(time, true);
      onComplete?.(lesson);
    }
    
    onProgress?.(progressPercent);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsCompleted(true);
    saveProgress(duration, true);
    onComplete?.(lesson);
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts for direct video type
  useEffect(() => {
    if (lesson.type !== 'direct' || !enableShortcuts) return;
    const el = videoRef.current;
    if (!el) return;

    const onKey = (e) => {
      // avoid interfering with inputs
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

      if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (el.paused) { el.play(); } else { el.pause(); }
      } else if (e.key.toLowerCase() === 'j') {
        el.currentTime = Math.max(0, el.currentTime - 10);
      } else if (e.key.toLowerCase() === 'l') {
        el.currentTime = Math.min(el.duration || el.currentTime + 10, el.currentTime + 10);
      } else if (e.key.toLowerCase() === 'm') {
        el.muted = !el.muted;
        setIsMuted(el.muted);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lesson.type, enableShortcuts]);

  // Render different video types
  const renderVideoPlayer = () => {
    switch (lesson.type) {
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${lesson.videoId}?enablejsapi=1&origin=${window.location.origin}`}
            className="w-full aspect-video rounded-lg bg-slate-700"
            allowFullScreen
            title={lesson.title}
          />
        );
      
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${lesson.videoId}?title=0&byline=0&portrait=0`}
            className="w-full aspect-video rounded-lg bg-slate-700"
            allowFullScreen
            title={lesson.title}
          />
        );
      
      case 'direct':
      default:
        return (
          <video
            className="w-full aspect-video bg-black rounded-lg"
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            ref={videoRef}
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            <source src={lesson.videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        );
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden group">
      {/* Video Player */}
      <div className="relative">
        {renderVideoPlayer()}
        {/* Hover mini-controls for direct video */}
        {lesson.type === 'direct' && (
          <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="mx-auto max-w-[90%] bg-black/50 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-3 text-white">
              <button onClick={() => { const v = videoRef.current; if (!v) return; if (v.paused) v.play(); else v.pause(); }} className="hover:text-sky-300">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={() => { const v = videoRef.current; if (!v) return; v.currentTime = Math.max(0, v.currentTime - 10); }} className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">-10s</button>
              <button onClick={() => { const v = videoRef.current; if (!v) return; v.currentTime = Math.min(v.duration || v.currentTime + 10, v.currentTime + 10); }} className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">+10s</button>
              <div className="ml-auto text-xs text-slate-200">{formatTime(currentTime)} / {formatTime(duration)}</div>
            </div>
          </div>
        )}
        
        {/* Progress Overlay for YouTube/Vimeo */}
        {(lesson.type === 'youtube' || lesson.type === 'vimeo') && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between text-white text-sm">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <div className="flex items-center gap-2">
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
              <div 
                className="bg-sky-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
            <p className="text-slate-300 text-sm mb-2">{lesson.description}</p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration}</span>
              </div>
              {lesson.difficulty && (
                <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                  {lesson.difficulty}
                </span>
              )}
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        {/* Progress Bar (for direct videos) */}
        {lesson.type === 'direct' && showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Progress: {Math.round(progress)}%</span>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Lesson Controls */}
        <div className="flex items-center gap-3 mb-4">
          {lesson.type === 'youtube' && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showTranscript 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
          )}
          
          {lesson.transcript && lesson.transcript.text && (
            <button
              onClick={() => downloadTranscript()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Transcript
            </button>
          )}
        </div>

        {/* Transcript Section */}
        {showTranscript && lesson.transcript && (
          <div className="border-t border-slate-700 pt-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Video Transcript</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              {lesson.transcriptStatus === 'loading' && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-slate-400">Loading transcript...</p>
                </div>
              )}
              
              {lesson.transcriptStatus === 'failed' && (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-2">Failed to load transcript</p>
                  <p className="text-slate-500 text-sm">This video may not have auto-generated captions available.</p>
                </div>
              )}
              
              {lesson.transcript && lesson.transcript.text && (
                <div className="space-y-2">
                  {renderTranscriptContent()}
                </div>
              )}
              
              {lesson.type === 'youtube' && !lesson.transcript && lesson.transcriptStatus !== 'loading' && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400 mb-3">Transcript not available yet</p>
                  <button
                    onClick={handleGenerateTranscript}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Generate Transcript
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Resources:</h4>
            <div className="space-y-2">
              {lesson.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{resource.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* AI Content Generation Section */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              AI-Generated Content
            </h4>
            <button
              onClick={() => setShowAIContent(!showAIContent)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {showAIContent ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide AI Tools
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show AI Tools
                </>
              )}
            </button>
          </div>

          {/* AI Content Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-700/50 rounded p-3 text-center">
              <FileText className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Quizzes</div>
              <div className="text-lg font-semibold text-white">{aiContent.quizzes.length}</div>
            </div>
            <div className="bg-slate-700/50 rounded p-3 text-center">
              <MessageSquare className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Discussions</div>
              <div className="text-lg font-semibold text-white">{aiContent.discussions.length}</div>
            </div>
            <div className="bg-slate-700/50 rounded p-3 text-center">
              <BookOpen className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Descriptions</div>
              <div className="text-lg font-semibold text-white">{aiContent.descriptions.length}</div>
            </div>
          </div>

          {showAIContent && lesson.transcript && (
            <div className="space-y-4">
              {/* AI Content Tabs */}
              <div className="flex border-b border-slate-700">
                {[
                  { id: 'quiz', label: 'Quiz Generator', icon: FileText },
                  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                  { id: 'descriptions', label: 'Descriptions', icon: BookOpen }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAITab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeAITab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* AI Content Generators */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                {activeAITab === 'quiz' && (
                  <AutoQuizGenerator
                    videoId={lesson.videoId || lesson.id}
                    transcript={lesson.transcript.text}
                    onQuizGenerated={(quiz) => handleAIContentGenerated('quizzes', quiz)}
                  />
                )}
                
                {activeAITab === 'discussions' && (
                  <DiscussionSeedGenerator
                    videoId={lesson.videoId || lesson.id}
                    transcript={lesson.transcript.text}
                    onDiscussionGenerated={(discussion) => handleAIContentGenerated('discussions', discussion)}
                  />
                )}
                
                {activeAITab === 'descriptions' && (
                  <CourseDescriptionGenerator
                    videoId={lesson.videoId || lesson.id}
                    transcript={lesson.transcript.text}
                    existingCourseData={lesson.courseData}
                    onDescriptionGenerated={(description) => handleAIContentGenerated('descriptions', description)}
                  />
                )}
              </div>
            </div>
          )}

          {showAIContent && !lesson.transcript && (
            <div className="text-center py-8 text-slate-400">
              <Brain className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="mb-2">AI content generation requires video transcript</p>
              <p className="text-sm text-slate-500">Generate transcript first to use AI tools</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Helper functions for transcript functionality
  function renderTranscriptContent() {
    const text = lesson.transcript.text;
    
    if (transcriptSearch.trim()) {
      // Highlight search results
      const regex = new RegExp(`(${transcriptSearch.trim()})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <div className="text-slate-300 text-sm leading-relaxed">
          {parts.map((part, index) => (
            regex.test(part) ? (
              <span key={index} className="bg-yellow-500 bg-opacity-20 text-yellow-300 px-1 rounded">
                {part}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          ))}
        </div>
      );
    }
    
    // Regular transcript display
    return (
      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    );
  }

  function downloadTranscript() {
    if (!lesson.transcript || !lesson.transcript.text) return;
    
    const content = `${lesson.title}\n${'='.repeat(lesson.title.length)}\n\n${lesson.transcript.text}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title} - Transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleGenerateTranscript() {
    if (!lesson.courseId) {
      console.warn('Missing courseId for transcript generation');
      return;
    }
    
    try {
      await TranscriptManagementService.refreshLesson(lesson.courseId, lesson.id);
      // Component will re-render with updated transcript data
    } catch (error) {
      console.error('Failed to generate transcript:', error);
    }
  }
}