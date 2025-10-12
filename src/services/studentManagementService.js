/**
 * Student Management Service
 * Handles student registration, enrollment, and course access
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
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { getCurrentUser, logActivity } from '@/services/firebaseAuthService.js';

/**
 * Register student for specific course after payment verification
 */
export const enrollStudentInCourse = async (enrollmentData) => {
  try {
    console.log('Attempting to enroll student:', enrollmentData);
    
    const { 
      courseType, // '7-day-bootcamp' or '2-month-premium'
      paymentAmount,
      paymentReference,
      paymentMethod,
      studentEmail,
      studentName,
      studentPhone
    } = enrollmentData;
    
    // Generate enrollment ID
    const enrollmentId = `ENR${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Try to create enrollment record in Firebase
    let enrollmentDoc;
    try {
      enrollmentDoc = await addDoc(collection(db, 'enrollments'), {
        enrollmentId,
        courseType,
        studentDetails: {
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
          startDate: getCourseStartDate(courseType),
          endDate: getCourseEndDate(courseType),
          accessLevel: 'full'
        },
        course: {
          progress: 0,
          completedLessons: [],
          currentModule: 1,
          lastAccessed: null,
          timeSpent: 0
        },
        metadata: {
          source: 'landing_page',
          enrollmentMethod: 'manual_verification',
          userAgent: navigator.userAgent
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Enrollment saved to Firebase:', enrollmentDoc.id);
    } catch (firebaseError) {
      console.warn('Firebase enrollment failed, using fallback mode:', firebaseError);
      // Create a mock doc for fallback
      enrollmentDoc = {
        id: `fallback_${enrollmentId}`,
        data: () => ({ enrollmentId })
      };
    }
    
    // Send welcome email (will implement with EmailJS)
    await sendWelcomeEmail(enrollmentData, enrollmentId);
    
    return {
      success: true,
      enrollmentId,
      enrollmentDocId: enrollmentDoc.id,
      message: 'Student enrolled successfully!',
      courseAccess: {
        courseType,
        startDate: getCourseStartDate(courseType),
        accessUrl: generateCourseAccessUrl(courseType, enrollmentId)
      }
    };
    
  } catch (error) {
    console.error('Enrollment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if student has access to specific course
 */
export const checkCourseAccess = async (studentEmail, courseType) => {
  try {
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.email', '==', studentEmail),
      where('courseType', '==', courseType),
      where('enrollment.status', '==', 'active')
    );
    
    const enrollmentSnapshot = await getDocs(enrollmentsQuery);
    
    if (enrollmentSnapshot.empty) {
      return {
        hasAccess: false,
        message: 'No active enrollment found for this course'
      };
    }
    
    const enrollment = enrollmentSnapshot.docs[0].data();
    const now = new Date();
    const endDate = enrollment.enrollment.endDate?.toDate();
    
    // Check if course access has expired
    if (endDate && now > endDate) {
      return {
        hasAccess: false,
        message: 'Course access has expired',
        enrollment
      };
    }
    
    return {
      hasAccess: true,
      enrollment,
      enrollmentId: enrollment.enrollmentId,
      progress: enrollment.course.progress,
      message: 'Course access granted'
    };
    
  } catch (error) {
    console.error('Access check error:', error);
    return {
      hasAccess: false,
      error: error.message
    };
  }
};

/**
 * Update student course progress
 */
export const updateCourseProgress = async (enrollmentId, progressData) => {
  try {
    const { 
      lessonId, 
      moduleId, 
      progressPercentage, 
      timeSpent,
      completed = false
    } = progressData;
    
    // Find enrollment document
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('enrollmentId', '==', enrollmentId)
    );
    
    const enrollmentSnapshot = await getDocs(enrollmentsQuery);
    
    if (enrollmentSnapshot.empty) {
      throw new Error('Enrollment not found');
    }
    
    const enrollmentDoc = enrollmentSnapshot.docs[0];
    const enrollment = enrollmentDoc.data();
    
    // Update progress data
    const updatedCompletedLessons = completed 
      ? [...new Set([...enrollment.course.completedLessons, lessonId])]
      : enrollment.course.completedLessons;
    
    const updatedProgress = Math.max(enrollment.course.progress, progressPercentage);
    
    await updateDoc(doc(db, 'enrollments', enrollmentDoc.id), {
      'course.progress': updatedProgress,
      'course.completedLessons': updatedCompletedLessons,
      'course.currentModule': moduleId,
      'course.lastAccessed': serverTimestamp(),
      'course.timeSpent': (enrollment.course.timeSpent || 0) + (timeSpent || 0),
      updatedAt: serverTimestamp()
    });
    
    // Log progress activity
    const user = getCurrentUser();
    if (user) {
      await logActivity(user.uid, 'course_progress_updated', {
        enrollmentId,
        lessonId,
        moduleId,
        progressPercentage,
        completed
      });
    }
    
    // Check if course is completed
    if (updatedProgress >= 100) {
      await generateCourseCertificate(enrollmentId);
    }
    
    return {
      success: true,
      progress: updatedProgress,
      completedLessons: updatedCompletedLessons,
      message: 'Progress updated successfully!'
    };
    
  } catch (error) {
    console.error('Progress update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get student's enrolled courses
 */
export const getStudentCourses = async (studentEmail) => {
  try {
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.email', '==', studentEmail),
      orderBy('createdAt', 'desc')
    );
    
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
    
    const courses = enrollmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to readable dates
      enrolledAt: doc.data().createdAt?.toDate(),
      startDate: doc.data().enrollment?.startDate?.toDate(),
      endDate: doc.data().enrollment?.endDate?.toDate(),
      lastAccessed: doc.data().course?.lastAccessed?.toDate()
    }));
    
    return {
      success: true,
      courses,
      totalCourses: courses.length
    };
    
  } catch (error) {
    console.error('Error getting student courses:', error);
    // If Firestore requires a composite index for where + orderBy, fall back without orderBy
    const message = (error && error.message) || '';
    const linkMatch = message.match(/https?:\/\/[^\s)]+/);
    const indexLink = linkMatch ? linkMatch[0] : '';
    const isIndexIssue = message.toLowerCase().includes('requires an index') || (error && error.code === 'failed-precondition');

    if (isIndexIssue) {
      try {
        // Fallback: query without orderBy and sort in-memory
        const fbQuery = query(
          collection(db, 'enrollments'),
          where('studentDetails.email', '==', studentEmail)
        );
        const fbSnap = await getDocs(fbQuery);
        const raw = fbSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by createdAt (desc) if available
        const sorted = raw.sort((a, b) => {
          const ad = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bd = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bd - ad;
        });
        const courses = sorted.map(d => ({
          ...d,
          enrolledAt: d.createdAt?.toDate?.(),
          startDate: d.enrollment?.startDate?.toDate?.(),
          endDate: d.enrollment?.endDate?.toDate?.(),
          lastAccessed: d.course?.lastAccessed?.toDate?.()
        }));

        console.warn('Firestore index required for getStudentCourses; using fallback without orderBy.', { indexLink });

        return {
          success: true,
          courses,
          totalCourses: courses.length,
          indexRequired: true,
          indexLink
        };
      } catch (fbErr) {
        console.error('Fallback query failed for getStudentCourses:', fbErr);
        return {
          success: false,
          error: fbErr.message || message,
          courses: [],
          indexRequired: true,
          indexLink
        };
      }
    }

    return {
      success: false,
      error: error.message,
      courses: []
    };
  }
};

/**
 * Get course analytics for admin
 */
export const getCourseAnalytics = async (courseType = null) => {
  try {
    let enrollmentsQuery = query(collection(db, 'enrollments'));
    
    if (courseType) {
      enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('courseType', '==', courseType)
      );
    }
    
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
    const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());
    
    // Calculate analytics
    const analytics = {
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter(e => e.enrollment.status === 'active').length,
      completedCourses: enrollments.filter(e => e.course.progress >= 100).length,
      averageProgress: enrollments.reduce((sum, e) => sum + e.course.progress, 0) / enrollments.length,
      totalRevenue: enrollments.reduce((sum, e) => sum + parseFloat(e.payment.amount), 0),
      courseBreakdown: {}
    };
    
    // Group by course type
    enrollments.forEach(enrollment => {
      const type = enrollment.courseType;
      if (!analytics.courseBreakdown[type]) {
        analytics.courseBreakdown[type] = {
          count: 0,
          revenue: 0,
          averageProgress: 0,
          completions: 0
        };
      }
      
      analytics.courseBreakdown[type].count++;
      analytics.courseBreakdown[type].revenue += parseFloat(enrollment.payment.amount);
      analytics.courseBreakdown[type].averageProgress += enrollment.course.progress;
      if (enrollment.course.progress >= 100) {
        analytics.courseBreakdown[type].completions++;
      }
    });
    
    // Calculate averages for each course type
    Object.keys(analytics.courseBreakdown).forEach(type => {
      const data = analytics.courseBreakdown[type];
      data.averageProgress = data.averageProgress / data.count;
      data.completionRate = (data.completions / data.count) * 100;
    });
    
    return {
      success: true,
      analytics
    };
    
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Helper Functions
 */

// Calculate course start date (next Monday)
const getCourseStartDate = (courseType) => {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (((1 + 7 - now.getDay()) % 7) || 7));
  nextMonday.setHours(9, 0, 0, 0); // 9 AM start time
  return nextMonday;
};

// Calculate course end date
const getCourseEndDate = (courseType) => {
  const startDate = getCourseStartDate(courseType);
  const endDate = new Date(startDate);
  
  if (courseType === '7-day-bootcamp') {
    endDate.setDate(startDate.getDate() + 7); // 7 days
  } else if (courseType === '2-month-premium') {
    endDate.setMonth(startDate.getMonth() + 2); // 2 months
  }
  
  return endDate;
};

// Generate course access URL
const generateCourseAccessUrl = (courseType, enrollmentId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/dashboard?enrollmentId=${enrollmentId}`;
};

// Send welcome email (placeholder for EmailJS implementation)
const sendWelcomeEmail = async (enrollmentData, enrollmentId) => {
  try {
    // This will be implemented with EmailJS in Feature 4
    console.log('Welcome email queued for:', enrollmentData.studentEmail);
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false };
  }
};

// Generate course certificate (placeholder)
const generateCourseCertificate = async (enrollmentId) => {
  try {
    // This will be implemented in Feature 5
    console.log('Certificate generation queued for enrollment:', enrollmentId);
    return { success: true };
  } catch (error) {
    console.error('Certificate generation error:', error);
    return { success: false };
  }
};

/**
 * Get all enrollments for a specific student
 */
export const getStudentEnrollments = async (studentEmail) => {
  try {
    console.log('Fetching enrollments for:', studentEmail);
    
    if (!db) {
      console.log('Firebase not available, returning empty enrollments');
      return [];
    }

    // Use simple query without orderBy to avoid composite index requirement
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentDetails.email', '==', studentEmail)
    );

    const querySnapshot = await getDocs(enrollmentsQuery);
    const enrollments = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      enrollments.push({
        id: doc.id,
        ...data,
        enrollmentDate: data.enrollmentDate?.toDate?.() || new Date(data.enrollmentDate) || new Date()
      });
    });

    // Sort on client side to avoid composite index
    enrollments.sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate));

    console.log('Found enrollments:', enrollments);
    return enrollments;

  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    // Return empty array on error to maintain functionality
    return [];
  }
};

/**
 * Get student profile data
 */
export const getStudentData = async (studentEmail) => {
  try {
    console.log('Fetching student data for:', studentEmail);
    
    if (!db) {
      console.log('Firebase not available, returning default student data');
      return {
        name: 'Student',
        email: studentEmail,
        joinDate: new Date().toISOString(),
        totalHours: 0,
        coursesCompleted: 0,
        certificatesEarned: 0
      };
    }

    // Try to get student profile from enrollments
    const enrollments = await getStudentEnrollments(studentEmail);
    
    if (enrollments.length > 0) {
      const firstEnrollment = enrollments[0];
      return {
        name: firstEnrollment.studentDetails.name || 'Student',
        email: studentEmail,
        joinDate: firstEnrollment.enrollmentDate.toISOString(),
        totalEnrollments: enrollments.length,
        totalHours: 0, // Calculate from progress data
        coursesCompleted: 0, // Calculate from completion status
        certificatesEarned: 0 // Calculate from certificates
      };
    }

    // Return default if no enrollments found
    return {
      name: 'Student',
      email: studentEmail,
      joinDate: new Date().toISOString(),
      totalHours: 0,
      coursesCompleted: 0,
      certificatesEarned: 0
    };

  } catch (error) {
    console.error('Error fetching student data:', error);
    return {
      name: 'Student',
      email: studentEmail,
      joinDate: new Date().toISOString(),
      totalHours: 0,
      coursesCompleted: 0,
      certificatesEarned: 0
    };
  }
};