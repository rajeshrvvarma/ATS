/** Simple helper used on success page to poll order status */
export const pollPaymentStatus = async (merchantTransactionId, { intervalMs = 1500, timeoutMs = 20000 } = {}) => {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`/.netlify/functions/payment-status?merchantTransactionId=${encodeURIComponent(merchantTransactionId)}`);
    if (res.ok) {
      last = await res.json();
      const status = (last.status || '').toUpperCase();
      if (['COMPLETED', 'SUCCESS', 'CAPTURED', 'PAID'].includes(status)) return { success: true, data: last };
      if (['FAILED', 'DECLINED', 'CANCELLED'].includes(status)) return { success: false, data: last };
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return { success: false, data: last, timeout: true };
};
