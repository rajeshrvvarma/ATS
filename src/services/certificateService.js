/**
 * Certificate Generation Service
 * Handles PDF certificate creation and management
 */

// Mock certificate data - in a real app, this would come from a database
const certificateTemplates = {
  courseCompletion: {
    title: 'Course Completion Certificate',
    template: 'course-completion',
    fields: ['studentName', 'courseName', 'completionDate', 'instructorName', 'certificateId']
  },
  achievement: {
    title: 'Achievement Certificate',
    template: 'achievement',
    fields: ['studentName', 'achievementName', 'earnedDate', 'instructorName', 'certificateId']
  }
};

/**
 * Generate a PDF certificate
 * @param {Object} certificateData - Certificate data
 * @returns {Promise<Object>} Certificate object with download URL
 */
export const generateCertificate = async (certificateData) => {
  try {
    const certificateId = generateCertificateId();
    const certificate = {
      id: certificateId,
      studentName: certificateData.studentName,
      courseName: certificateData.courseName,
      completionDate: new Date().toISOString().split('T')[0],
      instructorName: 'Agnidhra Technologies',
      certificateId: certificateId,
      downloadUrl: await createPDFCertificate(certificateData, certificateId),
      earnedDate: new Date().toISOString(),
      verified: true
    };

    // Save certificate to localStorage
    saveCertificate(certificate);
    
    return certificate;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('Failed to generate certificate');
  }
};

/**
 * Create PDF certificate (mock implementation)
 * In a real app, this would use a PDF library like jsPDF or Puppeteer
 */
const createPDFCertificate = async (data, certificateId) => {
  // Mock PDF creation - in reality, you'd use a PDF library
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate PDF creation
      const mockPDFUrl = `data:application/pdf;base64,${btoa('Mock PDF Certificate')}`;
      resolve(mockPDFUrl);
    }, 1000);
  });
};

/**
 * Generate unique certificate ID
 */
const generateCertificateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
};

/**
 * Save certificate to localStorage
 */
const saveCertificate = (certificate) => {
  const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  existingCertificates.push(certificate);
  localStorage.setItem('certificates', JSON.stringify(existingCertificates));
};

/**
 * Get all certificates for a student
 */
export const getStudentCertificates = () => {
  return JSON.parse(localStorage.getItem('certificates') || '[]');
};

/**
 * Verify certificate by ID
 */
export const verifyCertificate = (certificateId) => {
  const certificates = getStudentCertificates();
  return certificates.find(cert => cert.certificateId === certificateId);
};

/**
 * Download certificate as PDF
 */
export const downloadCertificate = (certificateId) => {
  const certificate = verifyCertificate(certificateId);
  if (!certificate) {
    throw new Error('Certificate not found');
  }

  // Create download link
  const link = document.createElement('a');
  link.href = certificate.downloadUrl;
  link.download = `${certificate.courseName}-Certificate-${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if student is eligible for certificate
 */
export const checkCertificateEligibility = (courseId) => {
  const courseProgress = localStorage.getItem(`course_progress_${courseId}`);
  if (!courseProgress) return false;
  
  const progress = JSON.parse(courseProgress);
  return progress.courseProgress >= 100;
};

/**
 * Award certificate for course completion
 */
export const awardCourseCertificate = async (courseId, studentName) => {
  const course = getCourseById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const isEligible = checkCertificateEligibility(courseId);
  if (!isEligible) {
    throw new Error('Course not completed');
  }

  const certificateData = {
    studentName: studentName,
    courseName: course.title,
    courseId: courseId
  };

  return await generateCertificate(certificateData);
};

/**
 * Get course by ID (helper function)
 */
const getCourseById = (courseId) => {
  // This would normally come from your course data
  const courses = [
    { id: 'defensive-bootcamp-video', title: 'Defensive Security Bootcamp' },
    { id: 'offensive-bootcamp-video', title: 'Ethical Hacking Bootcamp' },
    { id: 'free-workshop-video', title: 'Free Cybersecurity Workshop' }
  ];
  return courses.find(course => course.id === courseId);
};

/**
 * Certificate verification endpoint (for public verification)
 */
export const getPublicCertificateVerification = (certificateId) => {
  const certificate = verifyCertificate(certificateId);
  if (!certificate) {
    return {
      valid: false,
      message: 'Certificate not found'
    };
  }

  return {
    valid: true,
    certificate: {
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      completionDate: certificate.completionDate,
      instructorName: certificate.instructorName,
      verified: certificate.verified
    }
  };
};