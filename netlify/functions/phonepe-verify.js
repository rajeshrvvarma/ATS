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

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com';
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

function sha256Hex(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { merchantTransactionId } = JSON.parse(event.body || '{}');
    if (!merchantTransactionId) return { statusCode: 400, body: 'merchantTransactionId is required' };

    const path = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    const xVerify = sha256Hex(path + SALT_KEY) + '###' + SALT_INDEX;

    const res = await fetch((PHONEPE_BASE_URL + path), {
      method: 'GET',
      headers: { 'X-VERIFY': xVerify, 'X-MERCHANT-ID': MERCHANT_ID }
    });

    const data = await res.json().catch(() => ({}));

    // persist verification snapshot
    await db.collection('orders').doc(merchantTransactionId).set({
      lastVerification: data,
      updatedAt: new Date().toISOString(),
      status: data?.data?.state || data?.code || 'unknown',
    }, { merge: true });

    return { statusCode: 200, body: JSON.stringify({ success: data?.success !== false, data }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
