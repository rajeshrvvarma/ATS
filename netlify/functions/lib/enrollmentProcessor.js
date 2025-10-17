const { db } = require('./admin');
const fetch = require('node-fetch');

async function findEnrollmentByPayment(paymentId, orderId) {
  if (!paymentId && !orderId) return null;
  const q1 = paymentId ? db.collection('enrollments').where('payment.reference', '==', paymentId).limit(1).get() : Promise.resolve({ empty: true });
  const q2 = orderId ? db.collection('enrollments').where('metadata.orderId', '==', orderId).limit(1).get() : Promise.resolve({ empty: true });

  const [r1, r2] = await Promise.all([q1, q2]);
  if (!r1.empty) return r1.docs[0];
  if (!r2.empty) return r2.docs[0];
  return null;
}

async function createEnrollmentFromPayment({ payment, orderData }) {
  const paymentId = payment?.id || null;
  const orderId = payment?.order_id || orderData?.id || null;

  // check existing
  const existing = await findEnrollmentByPayment(paymentId, orderId);
  if (existing) {
    return { ok: false, message: 'Enrollment exists', id: existing.id };
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
      orderId: orderId
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Prefer to use the server-side enrollment routine which centralizes business rules
  try {
    const { createEnrollmentServer } = require('./serverEnrollment');
    return await createEnrollmentServer({ payment, orderData });
  } catch (err) {
    console.warn('serverEnrollment not available or failed, falling back to direct write', err.message);
    const docRef = await db.collection('enrollments').add(enrollmentDoc);
    return { ok: true, id: docRef.id };
  }
}

module.exports = { createEnrollmentFromPayment, findEnrollmentByPayment };
