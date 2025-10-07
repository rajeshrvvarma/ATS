import crypto from 'crypto';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderId, paymentId, signature } = JSON.parse(event.body || '{}');
    if (!orderId || !paymentId || !signature) {
      return { statusCode: 400, body: 'missing fields' };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return { statusCode: 500, body: 'Server payment secret not configured' };
    }

    const body = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
    const valid = expected === signature;

    return { statusCode: 200, body: JSON.stringify({ valid }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
