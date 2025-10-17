const { db } = require('./admin');
const { buildEnrollmentPayload, persistEnrollment } = require('./sharedEnrollmentLogic');

let Sentry;
if (process.env.SENTRY_DSN) {
  try { Sentry = require('@sentry/node'); Sentry.init({ dsn: process.env.SENTRY_DSN }); } catch (e) { console.warn('Sentry init failed'); }
}

async function createEnrollmentServer({ payment, orderData }) {
  try {
    const payload = await buildEnrollmentPayload({ payment, orderData });
    // Persist enrollment
    const res = await persistEnrollment(payload);

    // Write webhook log
    try {
      await db.collection('webhook_logs').add({
        orderId: payload.metadata.orderId,
        paymentReference: payload.payment.reference,
        status: 'enrolled',
        createdAt: new Date().toISOString()
      });
    } catch (logErr) {
      console.warn('Failed to write webhook log', logErr.message);
    }

    // Trigger Netlify Forms notification (best-effort)
    try {
      const fetch = require('node-fetch');
      const siteUrl = process.env.SITE_URL || process.env.URL || '';
      const endpoint = siteUrl ? `${siteUrl}/` : '/';
      const formData = new URLSearchParams();
      formData.append('form-name', 'enrollment-notification');
      formData.append('type', 'welcome-email');
      formData.append('studentName', payload.studentDetails.name || '');
      formData.append('studentEmail', payload.studentDetails.email || '');
      formData.append('studentPhone', payload.studentDetails.phone || '');
      formData.append('enrollmentId', payload.enrollmentId || '');
      formData.append('courseType', payload.courseName || payload.courseId || '');
      formData.append('startDate', payload.enrollment.enrolledAt || new Date().toISOString());
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
    } catch (err) {
      console.warn('Failed to trigger Netlify form from serverEnrollment', err.message);
    }

    return { ok: true, id: res.id, enrollmentId: payload.enrollmentId };
  } catch (err) {
    if (Sentry) Sentry.captureException(err);
    console.error('createEnrollmentServer error', err);
    throw err;
  }
}

module.exports = { createEnrollmentServer };
