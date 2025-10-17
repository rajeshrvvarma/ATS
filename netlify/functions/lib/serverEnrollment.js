const { db } = require('./admin');

async function createEnrollmentServer({ payment, orderData }) {
  // Build enrollment payload based on payment and order data
  const paymentId = payment?.id || null;
  const orderId = payment?.order_id || orderData?.id || null;

  // Dedupe: check existing
  const existingQ = paymentId ? await db.collection('enrollments').where('payment.reference', '==', paymentId).limit(1).get() : { empty: true };
  if (!existingQ.empty) {
    return { ok: false, message: 'Enrollment exists', id: existingQ.docs[0].id };
  }

  const notes = (orderData && (orderData.raw && orderData.raw.notes)) || orderData?.notes || {};
  const customer = orderData?.customer || {};

  const enrollmentId = `ENR_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const courseId = notes.courseId || notes.course_id || null;
  const courseName = notes.courseName || notes.course_name || null;

  const studentEmail = (customer && customer.email) || payment.email || notes.email || null;
  const studentPhone = (customer && customer.phone) || payment.contact || notes.phone || null;
  const studentName = (customer && customer.name) || notes.name || null;

  const enrollmentDoc = {
    enrollmentId,
    courseId,
    courseName,
    studentDetails: {
      id: null,
      email: studentEmail,
      name: studentName,
      phone: studentPhone
    },
    payment: {
      amount: payment.amount || orderData?.amount || null,
      reference: payment.id || null,
      method: payment.method || 'razorpay',
      status: 'verified',
      raw: payment
    },
    enrollment: {
      status: 'active',
      enrolledAt: new Date().toISOString(),
      accessLevel: 'full',
      progress: 0,
      completedLessons: [],
      lastAccessedAt: null
    },
    metadata: {
      source: 'razorpay-webhook-server',
      orderId
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docRef = await db.collection('enrollments').add(enrollmentDoc);

  // Trigger Netlify Forms notification (best-effort)
  try {
    const fetch = require('node-fetch');
    const siteUrl = process.env.SITE_URL || process.env.URL || '';
    const endpoint = siteUrl ? `${siteUrl}/` : '/';
    const formData = new URLSearchParams();
    formData.append('form-name', 'enrollment-notification');
    formData.append('type', 'welcome-email');
    formData.append('studentName', enrollmentDoc.studentDetails.name || '');
    formData.append('studentEmail', enrollmentDoc.studentDetails.email || '');
    formData.append('studentPhone', enrollmentDoc.studentDetails.phone || '');
    formData.append('enrollmentId', enrollmentDoc.enrollmentId || '');
    formData.append('courseType', enrollmentDoc.courseName || enrollmentDoc.courseId || '');
    formData.append('startDate', enrollmentDoc.enrollment.enrolledAt || new Date().toISOString());
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
  } catch (err) {
    console.warn('Failed to trigger Netlify form from serverEnrollment', err.message);
  }

  return { ok: true, id: docRef.id, enrollmentId };
}

module.exports = { createEnrollmentServer };
