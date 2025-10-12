/**
 * Google Cloud Storage Service
 * Handles file uploads, secure URLs, and CDN delivery for course content
 */

// Google Cloud Storage configuration
const GOOGLE_CLOUD_CONFIG = {
  projectId: 'your-project-id', // Replace with your actual project ID
  bucketName: 'agnidhra-course-content', // Replace with your bucket name
  cdnDomain: 'https://cdn.agnidhra.com', // Replace with your CDN domain
  region: 'asia-south1' // Mumbai region for Indian users
};

/**
 * Upload file to Google Cloud Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (e.g., 'courses/course-id/videos/')
 * @param {string} fileName - Custom filename (optional)
 * @returns {Promise<string>} - Returns the file URL
 */
export async function uploadToGoogleCloud(file, folder = '', fileName = null) {
  try {
    // This is a placeholder for actual Google Cloud Storage upload
    // In real implementation, you would use:
    // 1. Google Cloud Storage SDK
    // 2. Server-side upload endpoint
    // 3. Direct browser upload with signed URLs
    
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;
    
    // Simulate upload progress
    console.log(`Uploading ${file.name} to Google Cloud Storage...`);
    console.log(`Path: gs://${GOOGLE_CLOUD_CONFIG.bucketName}/${filePath}`);
    
    // Placeholder: Return simulated URL
    // In real implementation, this would be the actual GCS URL
    const fileUrl = `${GOOGLE_CLOUD_CONFIG.cdnDomain}/${filePath}`;
    
    // Store file metadata in localStorage for now
    const fileMetadata = {
      originalName: file.name,
      fileName: finalFileName,
      filePath,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: fileUrl,
      bucket: GOOGLE_CLOUD_CONFIG.bucketName
    };
    
    // In real app, this would be stored in your database
    const uploads = JSON.parse(localStorage.getItem('gcs_uploads') || '[]');
    uploads.push(fileMetadata);
    localStorage.setItem('gcs_uploads', JSON.stringify(uploads));
    
    return {
      success: true,
      url: fileUrl,
      metadata: fileMetadata
    };
    
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate signed URL for secure content access
 * @param {string} filePath - Path to file in GCS
 * @param {number} expirationMinutes - URL expiration time in minutes
 * @returns {Promise<string>} - Signed URL
 */
export async function generateSignedUrl(filePath, expirationMinutes = 60) {
  try {
    // This is a placeholder for actual signed URL generation
    // In real implementation, this would call your backend API
    // which would generate signed URLs using Google Cloud SDK
    
    const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
    const signedUrl = `${GOOGLE_CLOUD_CONFIG.cdnDomain}/${filePath}?expires=${expirationTime}&signature=placeholder`;
    
    console.log(`Generated signed URL for: ${filePath}`);
    console.log(`Expires in: ${expirationMinutes} minutes`);
    
    return signedUrl;
    
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    throw error;
  }
}

/**
 * Check if user has access to content
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Promise<boolean>} - Access permission
 */
export async function checkContentAccess(userId, courseId) {
  try {
    // This would check enrollment status from your database
    // For now, simulating with localStorage
    
    const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '{}');
    const userEnrollments = enrollments[userId] || [];
    
    const hasAccess = userEnrollments.includes(courseId);
    
    console.log(`Access check - User: ${userId}, Course: ${courseId}, Access: ${hasAccess}`);
    
    return hasAccess;
    
  } catch (error) {
    console.error('Access check failed:', error);
    return false;
  }
}

/**
 * Get secure content URL for enrolled students
 * @param {string} filePath - File path in GCS
 * @param {string} userId - User ID requesting access
 * @param {string} courseId - Course ID
 * @returns {Promise<string|null>} - Secure URL or null if no access
 */
export async function getSecureContentUrl(filePath, userId, courseId) {
  try {
    // Check if user has access to this content
    const hasAccess = await checkContentAccess(userId, courseId);
    
    if (!hasAccess) {
      console.log('Access denied: User not enrolled in course');
      return null;
    }
    
    // Generate signed URL for secure access
    const signedUrl = await generateSignedUrl(filePath, 120); // 2 hour expiration
    
    return signedUrl;
    
  } catch (error) {
    console.error('Failed to get secure content URL:', error);
    return null;
  }
}

/**
 * Upload course video with progress tracking
 * @param {File} videoFile - Video file to upload
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} - Upload result
 */
export async function uploadCourseVideo(videoFile, courseId, lessonId, onProgress = null) {
  try {
    const folder = `courses/${courseId}/videos`;
    const fileName = `lesson_${lessonId}_${videoFile.name}`;
    
    // Simulate upload progress
    if (onProgress) {
      const progressInterval = setInterval(() => {
        const progress = Math.min(100, Math.random() * 100);
        onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 500);
    }
    
    const result = await uploadToGoogleCloud(videoFile, folder, fileName);
    
    if (result.success) {
      // Update lesson with video URL
      console.log(`Video uploaded successfully for lesson ${lessonId}`);
      return {
        success: true,
        videoUrl: result.url,
        metadata: result.metadata
      };
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('Video upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload course document/PDF
 * @param {File} documentFile - Document file to upload
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID (optional)
 * @returns {Promise<object>} - Upload result
 */
export async function uploadCourseDocument(documentFile, courseId, lessonId = null) {
  try {
    const folder = lessonId 
      ? `courses/${courseId}/lessons/${lessonId}/documents`
      : `courses/${courseId}/documents`;
    
    const result = await uploadToGoogleCloud(documentFile, folder);
    
    if (result.success) {
      console.log('Document uploaded successfully');
      return {
        success: true,
        documentUrl: result.url,
        metadata: result.metadata
      };
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('Document upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete file from Google Cloud Storage
 * @param {string} filePath - Path to file in GCS
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteFromGoogleCloud(filePath) {
  try {
    // This would call Google Cloud Storage API to delete the file
    console.log(`Deleting file from GCS: ${filePath}`);
    
    // Remove from local storage simulation
    const uploads = JSON.parse(localStorage.getItem('gcs_uploads') || '[]');
    const updatedUploads = uploads.filter(upload => upload.filePath !== filePath);
    localStorage.setItem('gcs_uploads', JSON.stringify(updatedUploads));
    
    return true;
    
  } catch (error) {
    console.error('File deletion failed:', error);
    return false;
  }
}

/**
 * Get file metadata from Google Cloud Storage
 * @param {string} filePath - Path to file in GCS
 * @returns {Promise<object|null>} - File metadata or null
 */
export async function getFileMetadata(filePath) {
  try {
    // In real implementation, this would call GCS API
    const uploads = JSON.parse(localStorage.getItem('gcs_uploads') || '[]');
    const fileMetadata = uploads.find(upload => upload.filePath === filePath);
    
    return fileMetadata || null;
    
  } catch (error) {
    console.error('Failed to get file metadata:', error);
    return null;
  }
}

// Export configuration for use in components
export const cloudConfig = GOOGLE_CLOUD_CONFIG;

// Helper function to format file sizes
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get file type icon
export function getFileTypeIcon(fileType) {
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('image/')) return 'Image';
  if (fileType.includes('pdf')) return 'FileText';
  if (fileType.includes('document') || fileType.includes('word')) return 'FileText';
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Table';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation';
  return 'File';
}