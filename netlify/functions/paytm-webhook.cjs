const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const PaytmChecksum = require('paytmchecksum');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (SERVICE_ACCOUNT) initializeApp({ credential: cert(SERVICE_ACCOUNT) });
const db = getFirestore();

exports.handler = async function (event) {
  try {
    const params = event.body || '';
    // TODO: parse form-encoded POST and verify checksum
    await db.collection('paytm_webhooks').add({ body: params, receivedAt: new Date() });
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
