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
    const { amount, currency = 'INR', customer, notes } = JSON.parse(event.body || '{}');
    if (!MERCHANT_ID || !SALT_KEY) return { statusCode: 500, body: 'PhonePe env not configured' };
    if (!amount || !customer?.email) return { statusCode: 400, body: 'missing required fields' };

    const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

    const redirectUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}/payment/success?mtid=${merchantTransactionId}`;
    const callbackUrl = `${(process.env.URL || '').replace(/\/$/, '')}/.netlify/functions/phonepe-callback`;

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      amount: Math.round(Number(amount) * 100),
      merchantUserId: customer.userId || customer.email,
      redirectUrl,
      callbackUrl,
      redirectMode: 'REDIRECT',
      paymentInstrument: { type: 'PAY_PAGE' },
      mobileNumber: customer.phone || undefined,
      message: notes?.description || undefined,
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const path = '/pg/v1/pay';
    const xVerify = sha256Hex(base64Payload + path + SALT_KEY) + '###' + SALT_INDEX;

    const res = await fetch(PHONEPE_BASE_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      return { statusCode: res.status, body: JSON.stringify(data) };
    }

    // persist order
    await db.collection('orders').doc(merchantTransactionId).set({
      gateway: 'phonepe',
      merchantTransactionId,
      amount: payload.amount,
      currency,
      status: 'created',
      customer,
      notes: notes || {},
      createdAt: new Date().toISOString(),
    }, { merge: true });

    return {
      statusCode: 200,
      body: JSON.stringify({
        merchantTransactionId,
        redirectUrl: data?.data?.instrumentResponse?.redirectInfo?.url || null,
        raw: data,
      })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
