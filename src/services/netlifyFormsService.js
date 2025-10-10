/**
 * Netlify Forms Service
 * Replaces EmailJS with Netlify Forms for unlimited submissions
 */

// Netlify Forms submission handler
export const submitNetlifyForm = async (formName, formData) => {
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': formName,
        ...formData
      }).toString()
    });

    if (response.ok) {
      console.log('✅ Netlify form submitted successfully:', formName);
      return { success: true, message: 'Form submitted successfully' };
    } else {
      throw new Error(`Form submission failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Netlify form submission error:', error);
    return { success: false, error: error.message };
  }
};

// Welcome email via Netlify Forms
export const sendWelcomeEmail = async (studentData, courseData) => {
  console.log('📧 Sending welcome email via Netlify Forms...');
  
  const formData = {
    type: 'welcome-email',
    studentName: studentData.name,
    studentEmail: studentData.email,
    studentPhone: studentData.phone || '',
    enrollmentId: courseData.enrollmentId,
    courseType: courseData.courseType,
    startDate: courseData.startDate,
    accessUrl: courseData.accessUrl,
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('enrollment-notification', formData);
};

// Payment confirmation email via Netlify Forms
export const sendPaymentConfirmationEmail = async (studentData, paymentData) => {
  console.log('💳 Sending payment confirmation via Netlify Forms...');
  
  const formData = {
    type: 'payment-confirmation',
    studentName: studentData.name,
    studentEmail: studentData.email,
    courseName: paymentData.courseName,
    amount: paymentData.amount,
    paymentId: paymentData.paymentId,
    transactionId: paymentData.transactionId,
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('enrollment-notification', formData);
};

// Contact form submission via Netlify Forms
export const sendContactForm = async (contactData) => {
  console.log('📞 Sending contact form via Netlify Forms...');
  
  const formData = {
    type: 'contact-inquiry',
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone || '',
    subject: contactData.subject,
    message: contactData.message,
    source: contactData.source || 'website',
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('contact-form', formData);
};

// General inquiry form via Netlify Forms
export const sendEnrollmentInquiry = async (inquiryData) => {
  console.log('📝 Sending enrollment inquiry via Netlify Forms...');
  
  const formData = {
    type: 'enrollment-inquiry',
    name: inquiryData.name,
    email: inquiryData.email,
    phone: inquiryData.phone || '',
    course: inquiryData.course,
    experience: inquiryData.experience || '',
    message: inquiryData.message || '',
    source: inquiryData.source || 'website',
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('enrollment-inquiry', formData);
};

// Progress update notification via Netlify Forms
export const sendProgressUpdateEmail = async (studentData, progressData) => {
  console.log('📊 Sending progress update via Netlify Forms...');
  
  const formData = {
    type: 'progress-update',
    studentName: studentData.name,
    studentEmail: studentData.email,
    courseName: progressData.courseName,
    completionPercentage: progressData.completionPercentage,
    achievementsUnlocked: progressData.achievementsUnlocked?.join(', ') || '',
    nextMilestone: progressData.nextMilestone || '',
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('student-notifications', formData);
};

// Certificate email via Netlify Forms
export const sendCertificateEmail = async (studentData, certificateData) => {
  console.log('🎓 Sending certificate via Netlify Forms...');
  
  const formData = {
    type: 'certificate-delivery',
    studentName: studentData.name,
    studentEmail: studentData.email,
    courseName: certificateData.courseName,
    certificateId: certificateData.certificateId,
    completionDate: certificateData.completionDate,
    finalScore: certificateData.finalScore,
    certificateUrl: certificateData.certificateUrl,
    timestamp: new Date().toISOString()
  };

  return await submitNetlifyForm('student-notifications', formData);
};

// Test Netlify Forms service
export const testNetlifyService = async () => {
  console.log('🧪 Testing Netlify Forms service...');
  
  const testData = {
    type: 'test-submission',
    timestamp: new Date().toISOString(),
    message: 'Netlify Forms service test'
  };

  return await submitNetlifyForm('test-form', testData);
};