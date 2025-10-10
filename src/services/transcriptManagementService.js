/**
 * Transcript Management Service
 * Manages video transcripts and AI-generated content for the course system
 * Integrates with YouTube Transcript Service and course data
 */

import { YouTubeTranscriptService } from './youtubeTranscriptService.js';
import { loadCourses, saveCourses, updateLesson } from './courseService.js';

// Storage keys for AI-generated content
const AI_CONTENT_STORAGE_KEY = 'ai_generated_content';

/**
 * Process transcripts for all YouTube videos in the course system
 */
export const processAllTranscripts = async (onProgress) => {
  const courses = loadCourses();
  const allLessons = [];
  
  // Collect all YouTube lessons that need transcripts
  courses.forEach(course => {
    course.lessons.forEach(lesson => {
      if (lesson.type === 'youtube' && !lesson.transcript) {
        allLessons.push({
          ...lesson,
          courseId: course.id,
          videoUrl: lesson.videoUrl || `https://www.youtube.com/watch?v=${lesson.videoId}`
        });
      }
    });
  });
  
  console.log(`🎥 Found ${allLessons.length} YouTube videos to process for transcripts`);
  
  const results = {
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    
    try {
      console.log(`📝 Processing transcript ${i + 1}/${allLessons.length}: ${lesson.title}`);
      
      // Update status to loading
      updateLessonTranscriptStatus(lesson.courseId, lesson.id, 'loading');
      
      // Get transcript
      const transcript = await YouTubeTranscriptService.getTranscript(lesson.videoUrl);
      
      if (transcript && transcript.text) {
        // Clean transcript for AI processing
        const cleanText = YouTubeTranscriptService.cleanForAI(transcript);
        
        // Update lesson with transcript
        updateLesson(lesson.courseId, lesson.id, {
          transcript: {
            text: cleanText,
            segments: transcript.segments,
            processedAt: new Date().toISOString(),
            source: 'youtube-auto'
          },
          transcriptStatus: 'loaded'
        });
        
        results.successful++;
        console.log(`✅ Successfully processed transcript for: ${lesson.title}`);
        
      } else {
        throw new Error('No transcript data returned');
      }
      
    } catch (error) {
      console.error(`❌ Failed to process transcript for ${lesson.title}:`, error);
      
      // Update status to failed
      updateLessonTranscriptStatus(lesson.courseId, lesson.id, 'failed');
      
      results.failed++;
      results.errors.push({
        lesson: lesson.title,
        error: error.message
      });
    }
    
    results.processed++;
    
    // Call progress callback
    if (onProgress) {
      onProgress(results.processed, allLessons.length, {
        lesson,
        success: results.successful,
        failed: results.failed
      });
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎯 Transcript processing complete:`, results);
  return results;
};

/**
 * Update transcript status for a specific lesson
 */
const updateLessonTranscriptStatus = (courseId, lessonId, status) => {
  updateLesson(courseId, lessonId, { transcriptStatus: status });
};

/**
 * Get all lessons with loaded transcripts
 */
export const getLessonsWithTranscripts = () => {
  const courses = loadCourses();
  const lessonsWithTranscripts = [];
  
  courses.forEach(course => {
    course.lessons.forEach(lesson => {
      if (lesson.transcript && lesson.transcript.text) {
        lessonsWithTranscripts.push({
          ...lesson,
          courseId: course.id,
          courseTitle: course.title
        });
      }
    });
  });
  
  return lessonsWithTranscripts;
};

/**
 * Search across all transcripts
 */
export const searchAllTranscripts = (query) => {
  const lessonsWithTranscripts = getLessonsWithTranscripts();
  const results = [];
  
  lessonsWithTranscripts.forEach(lesson => {
    if (lesson.transcript && lesson.transcript.text) {
      const text = lesson.transcript.text.toLowerCase();
      const queryLower = query.toLowerCase();
      
      if (text.includes(queryLower)) {
        // Find the context around the match
        const index = text.indexOf(queryLower);
        const start = Math.max(0, index - 100);
        const end = Math.min(text.length, index + query.length + 100);
        const context = text.substring(start, end);
        
        results.push({
          courseId: lesson.courseId,
          courseTitle: lesson.courseTitle,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          match: context,
          relevance: calculateRelevance(text, queryLower)
        });
      }
    }
  });
  
  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
};

/**
 * Calculate relevance score for search results
 */
const calculateRelevance = (text, query) => {
  const matches = (text.match(new RegExp(query, 'gi')) || []).length;
  const wordCount = text.split(' ').length;
  return (matches / wordCount) * 1000; // Normalize to 0-1000 scale
};

/**
 * Get transcript content for AI processing
 */
export const getTranscriptContentForAI = (courseId, lessonId) => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;
  
  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson || !lesson.transcript) return null;
  
  return {
    courseTitle: course.title,
    lessonTitle: lesson.title,
    lessonDescription: lesson.description,
    transcriptText: lesson.transcript.text,
    duration: lesson.duration,
    difficulty: lesson.difficulty,
    topics: extractTopics(lesson.transcript.text)
  };
};

/**
 * Extract key topics from transcript text
 */
const extractTopics = (text) => {
  if (!text) return [];
  
  // Simple keyword extraction for cybersecurity topics
  const cybersecurityKeywords = [
    'firewall', 'malware', 'phishing', 'encryption', 'vulnerability',
    'incident response', 'threat hunting', 'SIEM', 'SOC', 'penetration testing',
    'social engineering', 'zero day', 'ransomware', 'authentication',
    'authorization', 'network security', 'endpoint protection'
  ];
  
  const foundTopics = [];
  const textLower = text.toLowerCase();
  
  cybersecurityKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      foundTopics.push(keyword);
    }
  });
  
  return foundTopics;
};

/**
 * Get course content summary for AI
 */
export const getCourseContentSummary = (courseId) => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;
  
  const lessonsWithTranscripts = course.lessons.filter(l => l.transcript && l.transcript.text);
  
  return {
    courseId: course.id,
    courseTitle: course.title,
    courseDescription: course.description,
    totalLessons: course.lessons.length,
    lessonsWithTranscripts: lessonsWithTranscripts.length,
    combinedTranscript: lessonsWithTranscripts.map(l => `
[${l.title}]
${l.transcript.text}
`).join('\n\n'),
    topics: extractTopicsFromCourse(lessonsWithTranscripts),
    estimatedDuration: course.duration
  };
};

/**
 * Extract topics from entire course
 */
const extractTopicsFromCourse = (lessons) => {
  const allText = lessons.map(l => l.transcript.text).join(' ');
  return extractTopics(allText);
};

/**
 * Refresh transcript for a specific lesson
 */
export const refreshLessonTranscript = async (courseId, lessonId) => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === courseId);
  if (!course) throw new Error('Course not found');
  
  const lesson = course.lessons.find(l => l.id === lessonId);
  if (!lesson) throw new Error('Lesson not found');
  
  if (lesson.type !== 'youtube') {
    throw new Error('Only YouTube videos support auto-transcript');
  }
  
  console.log(`🔄 Refreshing transcript for: ${lesson.title}`);
  
  try {
    updateLessonTranscriptStatus(courseId, lessonId, 'loading');
    
    const videoUrl = lesson.videoUrl || `https://www.youtube.com/watch?v=${lesson.videoId}`;
    const transcript = await YouTubeTranscriptService.getTranscript(videoUrl);
    
    if (transcript && transcript.text) {
      const cleanText = YouTubeTranscriptService.cleanForAI(transcript);
      
      updateLesson(courseId, lessonId, {
        transcript: {
          text: cleanText,
          segments: transcript.segments,
          processedAt: new Date().toISOString(),
          source: 'youtube-auto'
        },
        transcriptStatus: 'loaded'
      });
      
      console.log(`✅ Successfully refreshed transcript for: ${lesson.title}`);
      return true;
      
    } else {
      throw new Error('No transcript data available');
    }
    
  } catch (error) {
    console.error(`❌ Failed to refresh transcript:`, error);
    updateLessonTranscriptStatus(courseId, lessonId, 'failed');
    throw error;
  }
};

/**
 * Get transcript statistics
 */
export const getTranscriptStats = () => {
  const courses = loadCourses();
  let totalLessons = 0;
  let youtubeLessons = 0;
  let transcriptsLoaded = 0;
  let transcriptsFailed = 0;
  let transcriptsPending = 0;
  
  courses.forEach(course => {
    course.lessons.forEach(lesson => {
      totalLessons++;
      
      if (lesson.type === 'youtube') {
        youtubeLessons++;
        
        switch (lesson.transcriptStatus) {
          case 'loaded':
            transcriptsLoaded++;
            break;
          case 'failed':
            transcriptsFailed++;
            break;
          default:
            transcriptsPending++;
        }
      }
    });
  });
  
  return {
    totalLessons,
    youtubeLessons,
    transcriptsLoaded,
    transcriptsFailed,
    transcriptsPending,
    completionRate: youtubeLessons > 0 ? Math.round((transcriptsLoaded / youtubeLessons) * 100) : 0
  };
};

/**
 * AI Content Management Functions
 */

// Get AI content storage
const getAIContentStorage = () => {
  try {
    const stored = localStorage.getItem(AI_CONTENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load AI content storage:', error);
    return {};
  }
};

// Save AI content storage
const saveAIContentStorage = (data) => {
  try {
    localStorage.setItem(AI_CONTENT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save AI content storage:', error);
  }
};

// Get all video data (including AI content)
export const getAllVideoData = async () => {
  return getAIContentStorage();
};

// Save video quiz
export const saveVideoQuiz = async (videoId, quiz) => {
  const storage = getAIContentStorage();
  if (!storage[videoId]) storage[videoId] = {};
  if (!storage[videoId].quizzes) storage[videoId].quizzes = [];
  
  // Update existing or add new
  const existingIndex = storage[videoId].quizzes.findIndex(q => q.id === quiz.id);
  if (existingIndex >= 0) {
    storage[videoId].quizzes[existingIndex] = quiz;
  } else {
    storage[videoId].quizzes.push(quiz);
  }
  
  saveAIContentStorage(storage);
  return quiz;
};

// Get video quizzes
export const getVideoQuizzes = async (videoId) => {
  const storage = getAIContentStorage();
  return storage[videoId]?.quizzes || [];
};

// Delete video quiz
export const deleteVideoQuiz = async (videoId, quizId) => {
  const storage = getAIContentStorage();
  if (storage[videoId]?.quizzes) {
    storage[videoId].quizzes = storage[videoId].quizzes.filter(q => q.id !== quizId);
    saveAIContentStorage(storage);
  }
};

// Save video discussions
export const saveVideoDiscussions = async (videoId, discussions) => {
  const storage = getAIContentStorage();
  if (!storage[videoId]) storage[videoId] = {};
  if (!storage[videoId].discussions) storage[videoId].discussions = [];
  
  const existingIndex = storage[videoId].discussions.findIndex(d => d.id === discussions.id);
  if (existingIndex >= 0) {
    storage[videoId].discussions[existingIndex] = discussions;
  } else {
    storage[videoId].discussions.push(discussions);
  }
  
  saveAIContentStorage(storage);
  return discussions;
};

// Get video discussions
export const getVideoDiscussions = async (videoId) => {
  const storage = getAIContentStorage();
  return storage[videoId]?.discussions || [];
};

// Delete video discussions
export const deleteVideoDiscussions = async (videoId, discussionId) => {
  const storage = getAIContentStorage();
  if (storage[videoId]?.discussions) {
    storage[videoId].discussions = storage[videoId].discussions.filter(d => d.id !== discussionId);
    saveAIContentStorage(storage);
  }
};

// Save video description
export const saveVideoDescription = async (videoId, description) => {
  const storage = getAIContentStorage();
  if (!storage[videoId]) storage[videoId] = {};
  if (!storage[videoId].descriptions) storage[videoId].descriptions = [];
  
  const existingIndex = storage[videoId].descriptions.findIndex(d => d.id === description.id);
  if (existingIndex >= 0) {
    storage[videoId].descriptions[existingIndex] = description;
  } else {
    storage[videoId].descriptions.push(description);
  }
  
  saveAIContentStorage(storage);
  return description;
};

// Get video descriptions
export const getVideoDescriptions = async (videoId) => {
  const storage = getAIContentStorage();
  return storage[videoId]?.descriptions || [];
};

// Delete video description
export const deleteVideoDescription = async (videoId, descriptionId) => {
  const storage = getAIContentStorage();
  if (storage[videoId]?.descriptions) {
    storage[videoId].descriptions = storage[videoId].descriptions.filter(d => d.id !== descriptionId);
    saveAIContentStorage(storage);
  }
};

// Export the service
export const TranscriptManagementService = {
  processAll: processAllTranscripts,
  getLessonsWithTranscripts,
  searchAll: searchAllTranscripts,
  getContentForAI: getTranscriptContentForAI,
  getCourseSummary: getCourseContentSummary,
  refreshLesson: refreshLessonTranscript,
  getStats: getTranscriptStats
};

// Create default export for AI content functions
const transcriptManagementService = {
  // Original functions
  ...TranscriptManagementService,
  
  // AI content functions
  getAllVideoData,
  saveVideoQuiz,
  getVideoQuizzes,
  deleteVideoQuiz,
  saveVideoDiscussions,
  getVideoDiscussions,
  deleteVideoDiscussions,
  saveVideoDescription,
  getVideoDescriptions,
  deleteVideoDescription
};

export default transcriptManagementService;