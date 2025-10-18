// Skeleton Paytm/UPI webhook receiver — validate platform signature and persist events to 'paytm_webhooks'
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (SERVICE_ACCOUNT) initializeApp({ credential: cert(SERVICE_ACCOUNT) });
const db = getFirestore();

exports.handler = async function (event) {
  try {
    const headers = event.headers || {};
    const body = event.body || '';

    // TODO: verify Paytm signature using merchant keys

    await db.collection('paytm_webhooks').add({ headers, body: body, receivedAt: new Date() });

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
