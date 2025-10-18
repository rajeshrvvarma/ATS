// Skeleton for Paytm/UPI order creation. Fill in Paytm SDK integration and merchant keys.
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (SERVICE_ACCOUNT) initializeApp({ credential: cert(SERVICE_ACCOUNT) });
const db = getFirestore();

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { amount, uid, courseId, paymentMethod } = body;

    if (!amount || !uid || !courseId) return { statusCode: 400, body: 'missing fields' };

    // TODO: integrate with Paytm/UPI SDK to create order and return checkout details
    const fakeOrder = {
      id: `paytm_${Date.now()}`,
      amount,
      uid,
      courseId,
      paymentMethod: paymentMethod || 'UPI',
      createdAt: new Date()
    };

    await db.collection('paytm_orders').doc(fakeOrder.id).set(fakeOrder);

    return { statusCode: 200, body: JSON.stringify({ order: fakeOrder }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
