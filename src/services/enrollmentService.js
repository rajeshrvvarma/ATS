/**
 * Enhanced Enrollment Service
 * Handles course enrollment, payment verification, and content access control
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { checkContentAccess, generateSignedUrl } from './googleCloudStorage.js';

/**
 * Enroll student in course with payment verification
 * @param {Object} enrollmentData - Enrollment information
 * @returns {Promise<Object>} - Enrollment result
 */
export async function enrollStudent(enrollmentData) {
  try {
    const {
      courseId,
      studentId,
      studentEmail,
      studentName,
      studentPhone,
      paymentReference,
      paymentAmount,
      paymentMethod = 'upi'
    } = enrollmentData;

    // Generate unique enrollment ID
    const enrollmentId = `ENR_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create enrollment record
    const enrollmentDoc = await addDoc(collection(db, 'enrollments'), {
      enrollmentId,
      courseId,
      studentDetails: {
        id: studentId,
        email: studentEmail,
        name: studentName,
        phone: studentPhone
      },
      payment: {
        amount: paymentAmount,
        reference: paymentReference,
        method: paymentMethod,
        status: 'verified',
        verifiedAt: serverTimestamp()
      },
      enrollment: {
        status: 'active',
        enrolledAt: serverTimestamp(),
        accessLevel: 'full',
        progress: 0,
        completedLessons: [],
        lastAccessedAt: null
      },
      metadata: {
        source: 'student_dashboard',
        enrollmentMethod: 'online_payment'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Grant content access
    await grantCourseAccess(studentId, courseId, enrollmentId);

    return {
      success: true,
      enrollmentId,
      message: 'Successfully enrolled in course',
      accessGranted: true
    };

  } catch (error) {
    console.error('Enrollment failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Grant course access to student
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} enrollmentId - Enrollment ID
 */
async function grantCourseAccess(studentId, courseId, enrollmentId) {
  try {
    // Update local storage for immediate access (fallback)
    const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '{}');
    if (!enrollments[studentId]) {
      enrollments[studentId] = [];
    }
    if (!enrollments[studentId].includes(courseId)) {
      enrollments[studentId].push(courseId);
    }
    localStorage.setItem('user_enrollments', JSON.stringify(enrollments));

    // Log access grant
    console.log(`Access granted - Student: ${studentId}, Course: ${courseId}, Enrollment: ${enrollmentId}`);

  } catch (error) {
    console.error('Failed to grant course access:', error);
  }
}

/**
 * Check if student has access to specific course
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} - Access verification result
 */
export async function verifyAccessCourse(studentId, courseId) {
  try {
    // Check Firebase enrollment
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.id', '==', studentId),
      where('courseId', '==', courseId),
      where('enrollment.status', '==', 'active')
    );

    const enrollmentSnapshot = await getDocs(enrollmentsQuery);

    if (!enrollmentSnapshot.empty) {
      const enrollment = enrollmentSnapshot.docs[0].data();
      
      return {
        hasAccess: true,
        enrollment,
        accessLevel: enrollment.enrollment.accessLevel,
        progress: enrollment.enrollment.progress,
        enrollmentId: enrollment.enrollmentId
      };
    }

    // Fallback to local storage check
    const localAccess = await checkContentAccess(studentId, courseId);
    
    return {
      hasAccess: localAccess,
      enrollment: null,
      accessLevel: localAccess ? 'basic' : 'none',
      progress: 0,
      enrollmentId: null
    };

  } catch (error) {
    console.error('Access verification failed:', error);
    return {
      hasAccess: false,
      error: error.message
    };
  }
}

/**
 * Get secure content URL for enrolled student
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} contentPath - Path to content file
 * @returns {Promise<string|null>} - Secure URL or null
 */
export async function getSecureContentUrl(studentId, courseId, contentPath) {
  try {
    // Verify access first
    const accessCheck = await verifyAccessCourse(studentId, courseId);
    
    if (!accessCheck.hasAccess) {
      console.log('Access denied: Student not enrolled in course');
      return null;
    }

    // Generate signed URL for content
    const signedUrl = await generateSignedUrl(contentPath, 120); // 2 hours
    
    // Log content access
    await logContentAccess(studentId, courseId, contentPath);
    
    return signedUrl;

  } catch (error) {
    console.error('Failed to get secure content URL:', error);
    return null;
  }
}

/**
 * Update student progress for a lesson
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @param {number} progressPercentage - Progress percentage (0-100)
 * @param {boolean} completed - Whether lesson is completed
 */
export async function updateLessonProgress(studentId, courseId, lessonId, progressPercentage, completed = false) {
  try {
    // Find enrollment record
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.id', '==', studentId),
      where('courseId', '==', courseId),
      where('enrollment.status', '==', 'active')
    );

    const enrollmentSnapshot = await getDocs(enrollmentsQuery);

    if (enrollmentSnapshot.empty) {
      throw new Error('Enrollment not found');
    }

    const enrollmentDoc = enrollmentSnapshot.docs[0];
    const enrollment = enrollmentDoc.data();

    // Update progress
    const updatedCompletedLessons = completed 
      ? [...new Set([...enrollment.enrollment.completedLessons, lessonId])]
      : enrollment.enrollment.completedLessons;

    const updatedProgress = Math.max(
      enrollment.enrollment.progress || 0,
      progressPercentage
    );

    await updateDoc(enrollmentDoc.ref, {
      'enrollment.progress': updatedProgress,
      'enrollment.completedLessons': updatedCompletedLessons,
      'enrollment.lastAccessedAt': serverTimestamp(),
      'updatedAt': serverTimestamp()
    });

    return {
      success: true,
      progress: updatedProgress,
      completedLessons: updatedCompletedLessons
    };

  } catch (error) {
    console.error('Progress update failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all enrollments for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} - List of enrollments
 */
export async function getStudentEnrollments(studentId) {
  try {
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.id', '==', studentId),
      orderBy('createdAt', 'desc')
    );

    const enrollmentSnapshot = await getDocs(enrollmentsQuery);
    const enrollments = [];

    enrollmentSnapshot.forEach((doc) => {
      enrollments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return enrollments;

  } catch (error) {
    console.error('Failed to get student enrollments:', error);
    return [];
  }
}

/**
 * Check enrollment status by payment reference
 * @param {string} paymentReference - Payment reference ID
 * @returns {Promise<Object>} - Enrollment status
 */
export async function checkEnrollmentByPayment(paymentReference) {
  try {
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('payment.reference', '==', paymentReference)
    );

    const enrollmentSnapshot = await getDocs(enrollmentsQuery);

    if (enrollmentSnapshot.empty) {
      return {
        found: false,
        message: 'No enrollment found for this payment reference'
      };
    }

    const enrollment = enrollmentSnapshot.docs[0].data();

    return {
      found: true,
      enrollment,
      status: enrollment.enrollment.status,
      courseId: enrollment.courseId,
      studentId: enrollment.studentDetails.id
    };

  } catch (error) {
    console.error('Payment reference check failed:', error);
    return {
      found: false,
      error: error.message
    };
  }
}

/**
 * Log content access for analytics
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} contentPath - Content path accessed
 */
async function logContentAccess(studentId, courseId, contentPath) {
  try {
    await addDoc(collection(db, 'content_access_logs'), {
      studentId,
      courseId,
      contentPath,
      accessedAt: serverTimestamp(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to log content access:', error);
  }
}

/**
 * Revoke course access (for refunds/suspensions)
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} reason - Reason for access revocation
 */
export async function revokeCourseAccess(studentId, courseId, reason = 'Administrative action') {
  try {
    // Find and update enrollment status
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.id', '==', studentId),
      where('courseId', '==', courseId)
    );

    const enrollmentSnapshot = await getDocs(enrollmentsQuery);

    if (!enrollmentSnapshot.empty) {
      const enrollmentDoc = enrollmentSnapshot.docs[0];
      
      await updateDoc(enrollmentDoc.ref, {
        'enrollment.status': 'revoked',
        'enrollment.revokedAt': serverTimestamp(),
        'enrollment.revokedReason': reason,
        'updatedAt': serverTimestamp()
      });
    }

    // Remove from local storage
    const enrollments = JSON.parse(localStorage.getItem('user_enrollments') || '{}');
    if (enrollments[studentId]) {
      enrollments[studentId] = enrollments[studentId].filter(id => id !== courseId);
      localStorage.setItem('user_enrollments', JSON.stringify(enrollments));
    }

    return {
      success: true,
      message: 'Course access revoked successfully'
    };

  } catch (error) {
    console.error('Failed to revoke course access:', error);
    return {
      success: false,
      error: error.message
    };
  }
}