import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/context/SettingsContext.jsx';
import { Play, Pause, Volume2, VolumeX, Maximize, Bookmark, Clock, CheckCircle } from 'lucide-react';

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
      </div>
    </div>
  );
}