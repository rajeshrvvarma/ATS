const fetch = require('node-fetch');
const crypto = require('crypto');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let app;
try {
  app = initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault(),
  });
} catch (e) {}
const db = getFirestore();

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { amount, currency = 'INR', receipt, notes, customer } = JSON.parse(event.body || '{}');
    const key = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const secret = process.env.VITE_RAZORPAY_SECRET || process.env.RAZORPAY_SECRET;
    if (!key || !secret) return { statusCode: 500, body: 'Razorpay not configured' };
    if (!amount || amount <= 0) return { statusCode: 400, body: 'Invalid amount' };

    const payload = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    };

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify(data) };
    }

    // store order in firestore
    try {
      await db.collection('orders').doc(data.id).set({
        gateway: 'razorpay',
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status || 'created',
        createdAt: new Date().toISOString(),
        customer: customer || null,
        raw: data
      }, { merge: true });
    } catch (e) {
      console.warn('Failed to persist razorpay order', e.message);
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error('razorpay-create-order error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
