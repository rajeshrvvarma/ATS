// Paytm webhook receiver disabled. Returning 410 Gone.
exports.handler = async function (event) {
  return { statusCode: 410, body: JSON.stringify({ error: 'Paytm webhook disabled' }) };
};
