const { createEnrollmentFromPayment } = require('./lib/enrollmentProcessor');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const payload = JSON.parse(event.body || '{}');
    const { payment, orderData, secret } = payload;

    // Optionally validate a shared secret to prevent public invocation
    if (process.env.ENROLLMENT_API_SECRET && process.env.ENROLLMENT_API_SECRET !== secret) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const res = await createEnrollmentFromPayment({ payment, orderData });
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    console.error('process-enrollment error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
