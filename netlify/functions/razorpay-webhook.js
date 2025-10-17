const crypto = require('crypto');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const fetch = require('node-fetch');
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

    // Update the order document in Firestore and dispatch to central processor
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

      // If payment captured, dispatch to central enrollment processor
      if (payment && (payment.status === 'captured' || eventType === 'payment.captured' || eventType === 'order.paid')) {
        try {
          // Call internal process-enrollment function via HTTP to centralize business logic.
          // Use ENROLLMENT_API_SECRET for internal auth if set.
          const secret = process.env.ENROLLMENT_API_SECRET || null;
          const siteUrl = process.env.SITE_URL || process.env.URL || '';
          const endpoint = siteUrl ? `${siteUrl}/.netlify/functions/process-enrollment` : `/.netlify/functions/process-enrollment`;
          const procResp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment, orderData, secret })
          });
          const procData = await procResp.json();
          console.log('process-enrollment result', procData);
        } catch (e) {
          console.error('Failed to call process-enrollment', e.message);
        }
      }
    } catch (e) {
      console.error('Failed updating order or dispatching enrollment', e.message);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('razorpay-webhook error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
