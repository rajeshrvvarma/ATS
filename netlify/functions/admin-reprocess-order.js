const fetch = require('node-fetch');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

try { initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() }); } catch(e) {}
const db = getFirestore();

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const payload = JSON.parse(event.body || '{}');
  const secret = event.headers['x-enrollment-secret'] || payload.secret;
  if (process.env.ENROLLMENT_API_SECRET && process.env.ENROLLMENT_API_SECRET !== secret) return { statusCode: 401, body: 'Unauthorized' };

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
    return { statusCode: 200, body: JSON.stringify({ result }) };
  } catch (err) {
    console.error('admin-reprocess-order', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
