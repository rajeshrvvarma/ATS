// netlify/functions/razorpay-webhook.js
import crypto from 'crypto';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  const signature = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
  const body = event.body || '';

  const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
  const valid = signature === expected;

  if (!valid) {
    return { statusCode: 400, body: 'Invalid signature' };
  }

  // In production, persist event for idempotency and process accordingly
  // For now, just echo back
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
}


