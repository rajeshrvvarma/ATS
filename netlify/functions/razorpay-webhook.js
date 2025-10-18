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

  // Create an initial webhook log entry to aid debugging and reconciliation
  let webhookLogRef;
  try {
    webhookLogRef = db.collection('webhook_logs').doc();
    await webhookLogRef.set({
      provider: 'razorpay',
      receivedAt: new Date().toISOString(),
      rawBody: body,
      headers: event.headers || {},
      signature: signature || null,
      verification: 'pending'
    });
  } catch (logErr) {
    console.warn('Failed to create initial webhook log', logErr && logErr.message);
  }

    try {
      // Verify signature
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (!signature || signature !== expected) {
        console.warn('Invalid razorpay signature', { signature, expected });
        try {
          if (webhookLogRef) await webhookLogRef.set({ verification: 'failed', expected, note: 'Invalid signature' }, { merge: true });
        } catch (e) {
          console.warn('Failed updating webhook log for invalid signature', e && e.message);
        }
        return { statusCode: 400, body: 'Invalid signature' };
      }

      // mark verification success in log
      try {
        if (webhookLogRef) await webhookLogRef.set({ verification: 'success' }, { merge: true });
      } catch (e) {
        console.warn('Failed updating webhook log verification', e && e.message);
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
      try {
        if (webhookLogRef) await webhookLogRef.set({ eventType: eventType || null, orderId: null, note: 'No order id found' }, { merge: true });
      } catch (e) {
        console.warn('Failed updating webhook log for missing order id', e && e.message);
      }
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

        // update webhook log with event and orderId for easier tracing
        try {
          if (webhookLogRef) await webhookLogRef.set({ eventType: eventType || null, orderId }, { merge: true });
        } catch (e) {
          console.warn('Failed updating webhook log with order id', e && e.message);
        }

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
          try {
            if (webhookLogRef) await webhookLogRef.set({ processed: true, processResult: procData }, { merge: true });
          } catch (e) {
            console.warn('Failed updating webhook log with process result', e && e.message);
          }
        } catch (e) {
          console.error('Failed to call process-enrollment', e.message);
          try {
            if (webhookLogRef) await webhookLogRef.set({ processed: false, processError: e && e.message }, { merge: true });
          } catch (ee) {
            console.warn('Failed updating webhook log with process error', ee && ee.message);
          }
        }
      }
    } catch (e) {
      console.error('Failed updating order or dispatching enrollment', e.message);
      try {
        if (webhookLogRef) await webhookLogRef.set({ error: e && e.message }, { merge: true });
      } catch (ee) {
        console.warn('Failed updating webhook log with error', ee && ee.message);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('razorpay-webhook error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
