/**
 * YouTube Transcript Service
 * Automatically fetches and processes YouTube video transcripts/captions
 * Supports auto-generated captions and manual captions
 */

// YouTube Transcript API endpoint (using cors-anywhere proxy for client-side access)
const YOUTUBE_TRANSCRIPT_API = 'https://api.allorigins.win/raw?url=';

/**
 * Extract video ID from various YouTube URL formats
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

/**
 * Fetch YouTube video transcript using multiple methods
 */
export const fetchYouTubeTranscript = async (videoId) => {
  try {
    console.log(`🎥 Fetching transcript for video: ${videoId}`);
    
    // Method 1: Try to get transcript from YouTube's timedtext API
    const transcript = await fetchFromTimedTextAPI(videoId);
    if (transcript) {
      console.log('✅ Transcript fetched successfully from timedtext API');
      return transcript;
    }
    
    // Method 2: Try alternative transcript service
    const altTranscript = await fetchFromAlternativeService(videoId);
    if (altTranscript) {
      console.log('✅ Transcript fetched successfully from alternative service');
      return altTranscript;
    }
    
    throw new Error('No transcript available for this video');
    
  } catch (error) {
    console.error(`❌ Failed to fetch transcript for ${videoId}:`, error);
    return null;
  }
};

/**
 * Method 1: Fetch from YouTube's timedtext API
 */
const fetchFromTimedTextAPI = async (videoId) => {
  try {
    // First, get the video page to find available caption tracks
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const proxyUrl = `${YOUTUBE_TRANSCRIPT_API}${encodeURIComponent(videoPageUrl)}`;
    
    const response = await fetch(proxyUrl);
    const html = await response.text();
    
    // Extract caption track URLs from the page
    const captionTracks = extractCaptionTracks(html);
    
    if (captionTracks.length === 0) {
      throw new Error('No caption tracks found');
    }
    
    // Try to fetch transcript from the first available track (usually auto-generated)
    const captionUrl = captionTracks[0].baseUrl;
    const captionResponse = await fetch(`${YOUTUBE_TRANSCRIPT_API}${encodeURIComponent(captionUrl)}`);
    const captionXml = await captionResponse.text();
    
    // Parse XML and extract text
    const transcript = parseTranscriptXML(captionXml);
    return transcript;
    
  } catch (error) {
    console.warn('Failed to fetch from timedtext API:', error);
    return null;
  }
};

/**
 * Method 2: Fetch from alternative transcript service
 */
const fetchFromAlternativeService = async (videoId) => {
  try {
    // Use youtube-transcript npm package endpoint (if available)
    const response = await fetch(`https://youtube-transcript-api.herokuapp.com/transcript?video_id=${videoId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.transcript) {
      return {
        text: data.transcript.map(item => item.text).join(' '),
        segments: data.transcript.map(item => ({
          start: item.start,
          duration: item.duration,
          text: item.text
        }))
      };
    }
    
    throw new Error('No transcript data in response');
    
  } catch (error) {
    console.warn('Failed to fetch from alternative service:', error);
    return null;
  }
};

/**
 * Extract caption tracks from YouTube video page HTML
 */
const extractCaptionTracks = (html) => {
  try {
    // Look for caption tracks in the page source
    const captionRegex = /"captionTracks":\s*(\[.*?\])/;
    const match = html.match(captionRegex);
    
    if (!match) return [];
    
    const captionTracks = JSON.parse(match[1]);
    
    // Filter for auto-generated captions in English
    return captionTracks.filter(track => 
      track.languageCode === 'en' || 
      track.languageCode === 'en-US' ||
      track.kind === 'asr' // Auto Speech Recognition
    );
    
  } catch (error) {
    console.warn('Failed to extract caption tracks:', error);
    return [];
  }
};

/**
 * Parse transcript XML and extract text with timestamps
 */
const parseTranscriptXML = (xml) => {
  try {
    // Create a simple XML parser for transcript data
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const textElements = doc.getElementsByTagName('text');
    
    const segments = [];
    let fullText = '';
    
    for (let i = 0; i < textElements.length; i++) {
      const element = textElements[i];
      const start = parseFloat(element.getAttribute('start') || 0);
      const duration = parseFloat(element.getAttribute('dur') || 0);
      const text = element.textContent?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') || '';
      
      if (text.trim()) {
        segments.push({
          start,
          duration,
          text: text.trim()
        });
        fullText += text.trim() + ' ';
      }
    }
    
    return {
      text: fullText.trim(),
      segments
    };
    
  } catch (error) {
    console.warn('Failed to parse transcript XML:', error);
    return null;
  }
};

/**
 * Clean and format transcript text for AI processing
 */
export const cleanTranscriptForAI = (transcript) => {
  if (!transcript || !transcript.text) return '';
  
  let cleanText = transcript.text
    // Remove common YouTube auto-caption artifacts
    .replace(/\[Music\]/gi, '')
    .replace(/\[Applause\]/gi, '')
    .replace(/\[Laughter\]/gi, '')
    .replace(/\[.*?\]/g, '') // Remove any other bracketed content
    
    // Fix common speech-to-text errors
    .replace(/\bum\b/gi, '')
    .replace(/\buh\b/gi, '')
    .replace(/\ber\b/gi, '')
    
    // Clean up punctuation and spacing
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Ensure space after sentence endings
    .trim();
  
  return cleanText;
};

/**
 * Search transcript for specific keywords or phrases
 */
export const searchTranscript = (transcript, query) => {
  if (!transcript || !transcript.segments || !query) return [];
  
  const queryLower = query.toLowerCase();
  const matches = [];
  
  transcript.segments.forEach((segment, index) => {
    if (segment.text.toLowerCase().includes(queryLower)) {
      matches.push({
        ...segment,
        index,
        context: getSegmentContext(transcript.segments, index, 2) // 2 segments before/after for context
      });
    }
  });
  
  return matches;
};

/**
 * Get context around a specific segment
 */
const getSegmentContext = (segments, targetIndex, contextSize) => {
  const start = Math.max(0, targetIndex - contextSize);
  const end = Math.min(segments.length, targetIndex + contextSize + 1);
  
  return segments.slice(start, end).map(seg => seg.text).join(' ');
};

/**
 * Cache transcript to localStorage to avoid repeated API calls
 */
export const cacheTranscript = (videoId, transcript) => {
  try {
    const cacheKey = `transcript_${videoId}`;
    const cacheData = {
      transcript,
      timestamp: Date.now(),
      expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`📝 Cached transcript for video: ${videoId}`);
  } catch (error) {
    console.warn('Failed to cache transcript:', error);
  }
};

/**
 * Get cached transcript if available and not expired
 */
export const getCachedTranscript = (videoId) => {
  try {
    const cacheKey = `transcript_${videoId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > cacheData.expiresIn;
    
    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    console.log(`📋 Using cached transcript for video: ${videoId}`);
    return cacheData.transcript;
    
  } catch (error) {
    console.warn('Failed to get cached transcript:', error);
    return null;
  }
};

/**
 * Main function to get transcript with caching
 */
export const getVideoTranscript = async (videoUrl) => {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    console.warn('Invalid YouTube URL:', videoUrl);
    return null;
  }
  
  // Try cache first
  let transcript = getCachedTranscript(videoId);
  if (transcript) return transcript;
  
  // Fetch from YouTube
  transcript = await fetchYouTubeTranscript(videoId);
  if (transcript) {
    cacheTranscript(videoId, transcript);
  }
  
  return transcript;
};

/**
 * Batch process multiple videos for transcript extraction
 */
export const batchProcessTranscripts = async (videos, onProgress) => {
  const results = [];
  const total = videos.length;
  
  for (let i = 0; i < total; i++) {
    const video = videos[i];
    console.log(`Processing ${i + 1}/${total}: ${video.title}`);
    
    try {
      const transcript = await getVideoTranscript(video.videoUrl || video.videoId);
      results.push({
        ...video,
        transcript,
        processed: true
      });
    } catch (error) {
      console.error(`Failed to process ${video.title}:`, error);
      results.push({
        ...video,
        transcript: null,
        processed: false,
        error: error.message
      });
    }
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress(i + 1, total, results[i]);
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};

// Export the service object
export const YouTubeTranscriptService = {
  extractVideoId: extractYouTubeVideoId,
  fetchTranscript: fetchYouTubeTranscript,
  getTranscript: getVideoTranscript,
  cleanForAI: cleanTranscriptForAI,
  search: searchTranscript,
  batchProcess: batchProcessTranscripts,
  cache: cacheTranscript,
  getCached: getCachedTranscript
};