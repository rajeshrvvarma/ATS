const fetch = require('node-fetch');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

try { initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() }); } catch(e) {}
const db = getFirestore();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const payload = JSON.parse(event.body || '{}');
  // Prefer explicit header for the enrollment secret to avoid accidental splicing from payloads
  const headerSecret = event.headers['x-enrollment-secret'] || event.headers['X-Enrollment-Secret'];
  const secret = headerSecret || payload.secret || null;
  if (process.env.ENROLLMENT_API_SECRET) {
    if (!headerSecret) {
      console.warn('admin-reprocess-order: missing x-enrollment-secret header');
      return { statusCode: 401, body: 'Missing enrollment secret header' };
    }
    if (process.env.ENROLLMENT_API_SECRET !== headerSecret) return { statusCode: 401, body: 'Unauthorized' };
  }

  const { orderId } = payload;
  if (!orderId) return { statusCode: 400, body: 'orderId required' };

  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) return { statusCode: 404, body: 'Order not found' };
    const orderData = orderDoc.data();
    const siteUrl = process.env.SITE_URL || process.env.URL || '';
    const endpoint = siteUrl ? `${siteUrl}/.netlify/functions/process-enrollment` : '/.netlify/functions/process-enrollment';
    const procResp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: orderData.payment || {}, orderData, secret: process.env.ENROLLMENT_API_SECRET || null })
    });
    const result = await procResp.json();
    try {
      const requester = (event.requestContext && event.requestContext.authorizer) || { headers: event.headers };
      await db.collection('reprocess_logs').add({
        orderId,
        requestedAt: new Date().toISOString(),
        requester,
        result,
      });
    } catch (logErr) {
      console.warn('Failed to write reprocess log', logErr && logErr.message);
    }
    return { statusCode: 200, body: JSON.stringify({ result }) };
  } catch (err) {
    console.error('admin-reprocess-order', err);
  try { await db.collection('reprocess_logs').add({ orderId, requestedAt: new Date().toISOString(), error: err && err.message, requester: { headers: event.headers } }); } catch(e) {}
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
