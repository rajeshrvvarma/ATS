export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency = 'INR', receipt } = JSON.parse(event.body || '{}');
    if (!amount) {
      return { statusCode: 400, body: 'amount is required' };
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return { statusCode: 500, body: 'Server payment keys are not configured' };
    }

    // Create order via Razorpay REST API
    const basic = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, currency, receipt: receipt || `rcpt_${Date.now()}` })
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
