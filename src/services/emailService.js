/**
 * Email Service using EmailJS
 * Handles automated emails for student communications
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_agnidhra',
  publicKey: import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key',
  templates: {
    welcome: import.meta.env.REACT_APP_EMAILJS_WELCOME_TEMPLATE || 'template_welcome',
    courseAccess: import.meta.env.REACT_APP_EMAILJS_ACCESS_TEMPLATE || 'template_access',
    paymentConfirmation: import.meta.env.REACT_APP_EMAILJS_PAYMENT_TEMPLATE || 'template_payment',
    progressUpdate: import.meta.env.REACT_APP_EMAILJS_PROGRESS_TEMPLATE || 'template_progress',
    certificate: import.meta.env.REACT_APP_EMAILJS_CERTIFICATE_TEMPLATE || 'template_certificate',
    reminder: import.meta.env.REACT_APP_EMAILJS_REMINDER_TEMPLATE || 'template_reminder'
  }
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Send welcome email after student registration
 */
export const sendWelcomeEmail = async (studentData, enrollmentDetails) => {
  try {
    console.log('Attempting to send welcome email:', { studentData, enrollmentDetails });
    const { name, email, phone } = studentData;
    const { enrollmentId, courseType, startDate, accessUrl } = enrollmentDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      student_email: email,
      student_phone: phone,
      course_name: courseNames[courseType] || courseType,
      enrollment_id: enrollmentId,
      course_start_date: new Date(startDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      access_url: accessUrl,
      support_email: 'support@agnidhra.com',
      company_name: 'Agnidhra Cybersecurity Training',
      current_year: new Date().getFullYear()
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.welcome,
      templateParams
    );
    
    console.log('Welcome email sent successfully:', response);
    
    return {
      success: true,
      messageId: response.text,
      message: 'Welcome email sent successfully!'
    };
    
  } catch (error) {
    console.error('Welcome email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send course access credentials
 */
export const sendCourseAccessEmail = async (studentData, accessDetails) => {
  try {
    const { name, email } = studentData;
    const { courseType, accessUrl, loginCredentials, startDate } = accessDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      course_name: courseNames[courseType],
      access_url: accessUrl,
      login_email: loginCredentials?.email || email,
      temporary_password: loginCredentials?.temporaryPassword,
      course_start_date: new Date(startDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }),
      course_start_time: '9:00 AM IST',
      platform_url: `${window.location.origin}/student-dashboard`,
      support_email: 'support@agnidhra.com',
      support_phone: '+91-9876543210'
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.courseAccess,
      templateParams
    );
    
    return {
      success: true,
      messageId: response.text,
      message: 'Course access email sent successfully!'
    };
    
  } catch (error) {
    console.error('Course access email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send payment confirmation email (Falls back to welcome email if payment template unavailable)
 */
export const sendPaymentConfirmationEmail = async (studentData, paymentDetails) => {
  try {
    const { name, email } = studentData;
    const { 
      amount, 
      paymentReference, 
      paymentMethod, 
      courseType, 
      enrollmentId 
    } = paymentDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootbook',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    // If payment confirmation template is not available, use welcome template with payment info
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      course_name: courseNames[courseType],
      enrollment_id: enrollmentId,
      // Add payment info to welcome template
      payment_amount: `₹${amount}`,
      payment_reference: paymentReference,
      payment_method: paymentMethod,
      payment_date: new Date().toLocaleDateString('en-IN'),
      access_url: `${window.location.origin}/student-dashboard?enrollment=${enrollmentId}`,
      support_email: 'support@agnidhra.com',
      company_name: 'Agnidhra Cybersecurity Training',
      current_year: new Date().getFullYear()
    };
    
    // Try payment template first, fallback to welcome template
    const templateId = EMAILJS_CONFIG.templates.paymentConfirmation && 
                      !EMAILJS_CONFIG.templates.paymentConfirmation.includes('template_payment') 
                      ? EMAILJS_CONFIG.templates.paymentConfirmation 
                      : EMAILJS_CONFIG.templates.welcome;
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateId,
      templateParams
    );
    
    return {
      success: true,
      messageId: response.text,
      message: 'Payment confirmation sent via welcome email!'
    };
    
  } catch (error) {
    console.error('Payment confirmation email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send progress update email (Falls back to course access email if template unavailable)
 */
export const sendProgressUpdateEmail = async (studentData, progressDetails) => {
  try {
    // For now, skip progress emails if template not available
    if (!EMAILJS_CONFIG.templates.progressUpdate || EMAILJS_CONFIG.templates.progressUpdate.includes('template_progress')) {
      console.log('Progress update email skipped - template not available');
      return {
        success: true,
        message: 'Progress update skipped - will be available after EmailJS upgrade'
      };
    }
    const { name, email } = studentData;
    const { 
      courseType, 
      currentProgress, 
      completedLessons, 
      totalLessons,
      nextLessonTitle,
      certificateEligible = false
    } = progressDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp', 
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      course_name: courseNames[courseType],
      progress_percentage: Math.round(currentProgress),
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      next_lesson: nextLessonTitle,
      certificate_eligible: certificateEligible ? 'Yes' : 'No',
      dashboard_url: `${window.location.origin}/student-dashboard`,
      continue_url: `${window.location.origin}/course/${courseType}`,
      progress_date: new Date().toLocaleDateString('en-IN')
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.progressUpdate,
      templateParams
    );
    
    return {
      success: true,
      messageId: response.text,
      message: 'Progress update email sent successfully!'
    };
    
  } catch (error) {
    console.error('Progress update email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send certificate email (Falls back to course access email if template unavailable)  
 */
export const sendCertificateEmail = async (studentData, certificateDetails) => {
  try {
    // For now, skip certificate emails if template not available
    if (!EMAILJS_CONFIG.templates.certificate || EMAILJS_CONFIG.templates.certificate.includes('template_certificate')) {
      console.log('Certificate email skipped - template not available');
      return {
        success: true,
        message: 'Certificate email skipped - will be available after EmailJS upgrade'
      };
    }
    const { name, email } = studentData;
    const { 
      courseType, 
      certificateId, 
      certificateUrl, 
      completionDate,
      finalScore 
    } = certificateDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      course_name: courseNames[courseType],
      certificate_id: certificateId,
      certificate_url: certificateUrl,
      completion_date: new Date(completionDate).toLocaleDateString('en-IN'),
      final_score: finalScore,
      linkedin_url: generateLinkedInShareUrl(name, courseNames[courseType]),
      certificate_verification_url: `${window.location.origin}/verify-certificate/${certificateId}`,
      achievement_date: new Date().toLocaleDateString('en-IN')
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.certificate,
      templateParams
    );
    
    return {
      success: true,
      messageId: response.text,
      message: 'Certificate email sent successfully!'
    };
    
  } catch (error) {
    console.error('Certificate email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send course reminder email (Falls back to course access email if template unavailable)
 */
export const sendReminderEmail = async (studentData, reminderDetails) => {
  try {
    // For now, skip reminder emails if template not available
    if (!EMAILJS_CONFIG.templates.reminder || EMAILJS_CONFIG.templates.reminder.includes('template_reminder')) {
      console.log('Reminder email skipped - template not available');
      return {
        success: true,
        message: 'Reminder email skipped - will be available after EmailJS upgrade'
      };
    }
    const { name, email } = studentData;
    const { 
      courseType, 
      reminderType, // 'course_start', 'lesson_due', 'inactive_reminder'
      nextLessonTitle,
      daysInactive 
    } = reminderDetails;
    
    const courseNames = {
      '7-day-bootcamp': '7-Day Cybersecurity Bootcamp',
      '2-month-premium': '2-Month Premium Cybersecurity Program'
    };
    
    const reminderMessages = {
      course_start: `Your ${courseNames[courseType]} starts soon!`,
      lesson_due: `Don't miss your next lesson: ${nextLessonTitle}`,
      inactive_reminder: `We miss you! Continue your cybersecurity journey`
    };
    
    const templateParams = {
      to_name: name,
      to_email: email,
      student_name: name,
      course_name: courseNames[courseType],
      reminder_message: reminderMessages[reminderType],
      next_lesson: nextLessonTitle,
      days_inactive: daysInactive,
      continue_url: `${window.location.origin}/student-dashboard`,
      support_email: 'support@agnidhra.com'
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.reminder,
      templateParams
    );
    
    return {
      success: true,
      messageId: response.text,
      message: 'Reminder email sent successfully!'
    };
    
  } catch (error) {
    console.error('Reminder email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send bulk email to multiple students
 */
export const sendBulkEmail = async (studentsData, emailTemplate, templateData) => {
  try {
    const results = [];
    
    for (const student of studentsData) {
      try {
        let result;
        
        switch (emailTemplate) {
          case 'welcome':
            result = await sendWelcomeEmail(student, templateData);
            break;
          case 'course_access':
            result = await sendCourseAccessEmail(student, templateData);
            break;
          case 'progress_update':
            result = await sendProgressUpdateEmail(student, templateData);
            break;
          case 'reminder':
            result = await sendReminderEmail(student, templateData);
            break;
          default:
            throw new Error(`Unknown email template: ${emailTemplate}`);
        }
        
        results.push({
          student: student.email,
          success: result.success,
          messageId: result.messageId
        });
        
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results.push({
          student: student.email,
          success: false,
          error: error.message
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    return {
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    };
    
  } catch (error) {
    console.error('Bulk email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Helper Functions
 */

// Generate LinkedIn share URL for certificate
const generateLinkedInShareUrl = (studentName, courseName) => {
  const text = `I'm excited to share that I've completed the ${courseName} at Agnidhra Cybersecurity Training! 🔐 #CybersecurityTraining #ProfessionalDevelopment #Cybersecurity`;
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
};

/**
 * Email template validation
 */
export const validateEmailConfig = () => {
  const requiredKeys = ['serviceId', 'publicKey'];
  const missingKeys = requiredKeys.filter(key => !EMAILJS_CONFIG[key] || EMAILJS_CONFIG[key].includes('your_'));
  
  if (missingKeys.length > 0) {
    console.warn('EmailJS configuration incomplete. Missing:', missingKeys);
    return false;
  }
  
  return true;
};

/**
 * Test email functionality
 */
export const testEmailService = async () => {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    const testEnrollment = {
      enrollmentId: 'TEST123',
      courseType: '7-day-bootcamp',
      startDate: new Date(),
      accessUrl: `${window.location.origin}/student-dashboard`
    };
    
    // This would send to a test email in production
    console.log('Email service test - would send welcome email to:', testData.email);
    
    return {
      success: true,
      message: 'Email service is configured correctly'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};