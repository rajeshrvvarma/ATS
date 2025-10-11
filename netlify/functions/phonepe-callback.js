import crypto from 'crypto';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
try {
  app = initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT
      ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      : applicationDefault(),
  });
} catch {}
const db = getFirestore();

const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

function sha256Hex(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = event.body || '';
    const json = JSON.parse(body || '{}');

    const xVerify = event.headers['x-verify'] || event.headers['X-Verify'];
    // For callbacks, PhonePe may send base64 payload in 'response' field
    const base64 = json?.response || '';
    const expected = sha256Hex(base64 + '/pg/v1/pay' + SALT_KEY) + '###' + SALT_INDEX;

    const signatureValid = !xVerify || (xVerify === expected); // if header absent, tolerate in sandbox

    let txInfo = {};
    try { txInfo = JSON.parse(Buffer.from(base64, 'base64').toString('utf8')); } catch {}

    const merchantTransactionId = txInfo?.merchantTransactionId || json?.data?.merchantTransactionId || 'unknown';

    // idempotent write
    const ref = db.collection('webhooks_phonepe').doc(json?.data?.transactionId || merchantTransactionId);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({
        receivedAt: new Date().toISOString(),
        signatureValid,
        raw: json,
      });
    }

    if (merchantTransactionId && txInfo?.code) {
      await db.collection('orders').doc(merchantTransactionId).set({
        status: txInfo.code,
        phonepe: txInfo,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
