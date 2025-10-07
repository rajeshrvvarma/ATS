import React, { useState, useEffect } from 'react';
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

  // Render different video types
  const renderVideoPlayer = () => {
    switch (lesson.type) {
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${lesson.videoId}?enablejsapi=1&origin=${window.location.origin}`}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
            title={lesson.title}
          />
        );
      
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${lesson.videoId}?title=0&byline=0&portrait=0`}
            className="w-full aspect-video rounded-lg"
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
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            <source src={lesson.videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        );
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Video Player */}
      <div className="relative">
        {renderVideoPlayer()}
        
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