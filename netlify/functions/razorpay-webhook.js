const crypto = require('crypto');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let app;
try {
  app = initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault(),
  });
} catch (e) {}
const db = getFirestore();

exports.handler = async function (event) {
  // Razorpay webhooks are POST requests with raw body and signature header
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  // Accept multiple possible env var names used in this repo/deployments
  const secret = process.env.VITE_RAZORPAY_SECRET || process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return { statusCode: 500, body: 'Razorpay secret not configured' };

  const signature = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
  const body = event.body || '';

  try {
    // Verify signature
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (!signature || signature !== expected) {
      console.warn('Invalid razorpay signature', { signature, expected });
      return { statusCode: 400, body: 'Invalid signature' };
    }

    const payload = JSON.parse(body);
    const eventType = payload.event;

    // Extract payment and order identifiers from payload
    let payment = null;
    let orderId = null;
    try {
      if (payload.payload && payload.payload.payment && payload.payload.payment.entity) {
        payment = payload.payload.payment.entity;
        orderId = payment.order_id;
      } else if (payload.payload && payload.payload.order && payload.payload.order.entity) {
        orderId = payload.payload.order.entity.id;
      }
    } catch (e) {
      console.warn('Failed to parse payload for order/payment', e.message);
    }

    if (!orderId) {
      console.warn('No order id found in webhook payload');
      // Still respond 200 to prevent retries, but log the event
      return { statusCode: 200, body: 'No order id' };
    }

    // Update the order document in Firestore
    try {
      const orderRef = db.collection('orders').doc(orderId);
      await orderRef.set({
        status: eventType || 'payment_event',
        payment: payment || null,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Read stored order to get notes/customer info we saved during order creation
      const orderSnap = await orderRef.get();
      const orderData = orderSnap.exists ? orderSnap.data() : null;

      // If payment captured, create enrollment record (idempotency handled below)
      if (payment && (payment.status === 'captured' || eventType === 'payment.captured' || eventType === 'order.paid')) {
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
            orderId
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        try {
          // Idempotency check: skip if an enrollment already exists for this payment reference
          if (payment && payment.id) {
            const existing = await db.collection('enrollments')
              .where('payment.reference', '==', payment.id)
              .limit(1)
              .get();
            if (!existing.empty) {
              console.log('Enrollment already exists for payment', payment.id);
            } else {
              await db.collection('enrollments').add(enrollmentDoc);
            }
          } else {
            // No payment id available; still try to create but this is less safe
            await db.collection('enrollments').add(enrollmentDoc);
          }
        } catch (e) {
          console.error('Failed to persist enrollment from webhook', e.message);
        }
      }
    } catch (e) {
      console.error('Failed updating order or creating enrollment', e.message);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('razorpay-webhook error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
