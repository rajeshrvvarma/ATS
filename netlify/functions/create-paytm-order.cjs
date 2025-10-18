// Paytm integration disabled. This stub returns 410 Gone to indicate removal.
exports.handler = async function (event) {
  return { statusCode: 410, body: JSON.stringify({ error: 'Paytm integration removed' }) };
};
