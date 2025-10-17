/**
 * Reconciliation script: compares orders collection with enrollments.
 * Run locally via `node scripts/reconcileOrders.js` after setting FIREBASE_SERVICE_ACCOUNT env var.
 */
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fetch = require('node-fetch');

async function init() {
  try {
    initializeApp({
      credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault(),
    });
  } catch (e) {}
  return getFirestore();
}

async function run() {
  const db = await init();
  const ordersSnap = await db.collection('orders').where('status', 'in', ['created', 'paid', 'captured']).get();
  console.log('Orders to check:', ordersSnap.size);
  for (const doc of ordersSnap.docs) {
    const order = doc.data();
    const orderId = order.orderId || doc.id;
    // look for enrollment with metadata.orderId or payment.reference
    const q1 = await db.collection('enrollments').where('metadata.orderId', '==', orderId).limit(1).get();
    const q2 = await db.collection('enrollments').where('payment.reference', '==', orderId).limit(1).get();
    if (!q1.empty || !q2.empty) {
      console.log('OK:', orderId);
      continue;
    }

    console.warn('Missing enrollment for order:', orderId);
    // Optionally call process-enrollment endpoint to create it
    if (process.env.CREATE_MISSING === '1') {
      try {
        const siteUrl = process.env.SITE_URL || process.env.URL || '';
        const endpoint = siteUrl ? `${siteUrl}/.netlify/functions/process-enrollment` : `/.netlify/functions/process-enrollment`;
        const secret = process.env.ENROLLMENT_API_SECRET || null;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment: order.payment || {}, orderData: order, secret })
        });
        const data = await resp.json();
        console.log('process result', data);
      } catch (e) {
        console.error('Failed to create enrollment via process-enrollment', e.message);
      }
    }
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
