const { db } = require('./admin');

async function buildEnrollmentPayload({ payment, orderData }) {
  const notes = (orderData && (orderData.raw && orderData.raw.notes)) || orderData?.notes || {};
  const customer = orderData?.customer || {};

  const enrollmentId = `ENR_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const courseId = notes.courseId || notes.course_id || null;
  const courseName = notes.courseName || notes.course_name || null;

  const studentEmail = (customer && customer.email) || payment.email || notes.email || null;
  const studentPhone = (customer && customer.phone) || payment.contact || notes.phone || null;
  const studentName = (customer && customer.name) || notes.name || null;

  const payload = {
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
      status: 'captured',
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
      source: 'razorpay-webhook',
      orderId: payment?.order_id || orderData?.id || null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return payload;
}

async function persistEnrollment(payload) {
  const docRef = await db.collection('enrollments').add(payload);
  return { ok: true, id: docRef.id };
}

module.exports = { buildEnrollmentPayload, persistEnrollment };
