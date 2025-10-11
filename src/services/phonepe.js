/** PhonePe Client Service */

export const initiatePayment = async ({ amount, customer, notes }) => {
  const res = await fetch('/.netlify/functions/phonepe-initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, customer, notes })
  });
  if (!res.ok) throw new Error('Failed to initiate PhonePe payment');
  const data = await res.json();
  return data; // { merchantTransactionId, redirectUrl }
};

export const verifyPayment = async (merchantTransactionId) => {
  const res = await fetch('/.netlify/functions/phonepe-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchantTransactionId })
  });
  if (!res.ok) return { success: false };
  return await res.json();
};

export const getPaymentStatus = async (merchantTransactionId) => {
  const url = `/.netlify/functions/payment-status?merchantTransactionId=${encodeURIComponent(merchantTransactionId)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
};
