const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const PaytmChecksum = require('paytmchecksum');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (SERVICE_ACCOUNT) initializeApp({ credential: cert(SERVICE_ACCOUNT) });
const db = getFirestore();

// Expects env: PAYTM_MERCHANT_ID, PAYTM_MERCHANT_KEY, PAYTM_WEBSITE, PAYTM_CHANNEL_ID
exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { amount, uid, courseId, paymentMethod } = body;

    if (!amount || !uid || !courseId) return { statusCode: 400, body: 'missing fields' };

    const orderId = `ORDER_${Date.now()}`;

    const paytmParams = {
      MID: process.env.PAYTM_MERCHANT_ID,
      WEBSITE: process.env.PAYTM_WEBSITE || 'DEFAULT',
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY || 'Retail',
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID || 'WEB',
      ORDER_ID: orderId,
      CUST_ID: uid,
      TXN_AMOUNT: String(amount),
      CALLBACK_URL: process.env.PAYTM_CALLBACK_URL || ''
    };

    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams), process.env.PAYTM_MERCHANT_KEY || '');

    await db.collection('paytm_orders').doc(orderId).set({ orderId, uid, amount, courseId, createdAt: new Date() });

    return { statusCode: 200, body: JSON.stringify({ paytmParams, checksum }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
