const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');

try { initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() }); } catch(e) {}
const db = getFirestore();

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  // simple auth via header
  const secret = event.headers['x-enrollment-secret'];
  if (process.env.ENROLLMENT_API_SECRET && process.env.ENROLLMENT_API_SECRET !== secret) return { statusCode: 401, body: 'Unauthorized' };

  const limit = parseInt(event.queryStringParameters?.limit || '50', 10);
  const page = parseInt(event.queryStringParameters?.page || '1', 10);

  try {
    const ordersSnap = await db.collection('orders').get();
    const missing = [];
    let i = 0;
    for (const doc of ordersSnap.docs) {
      if (i++ < (page-1)*limit) continue;
      if (missing.length >= limit) break;
      const order = doc.data();
      const orderId = order.orderId || doc.id;
      const q1 = await db.collection('enrollments').where('metadata.orderId','==', orderId).limit(1).get();
      const q2 = await db.collection('enrollments').where('payment.reference','==', order.payment?.id || order.payment?.reference || '').limit(1).get();
      if (q1.empty && q2.empty) missing.push({ orderId, order });
    }
    return { statusCode: 200, body: JSON.stringify({ missing }) };
  } catch (err) {
    console.error('admin-list-missing-orders', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
