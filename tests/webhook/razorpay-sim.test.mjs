import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const projectId = 'ats-emulator-webhook';

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.resolve('firestore.rules'), 'utf8'), host: 'localhost', port: 8080 }
  });

  try {
    // Seed an order that the webhook will reference
    const adminCtx = testEnv.authenticatedContext('system', { admin: true });
    const db = adminCtx.firestore();
    const orderId = 'order_test_1';
    await db.collection('orders').doc(orderId).set({ status: 'created', createdAt: Date.now() });

    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_123',
            order_id: orderId,
            status: 'captured',
            amount: 1000
          }
        }
      }
    };

    const body = JSON.stringify(payload);
    const secret = 'test_secret_for_emulator';
    // set env for handler to read
    process.env.RAZORPAY_KEY_SECRET = secret;

    // compute HMAC sha256 hex
    const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    // require the handler module and invoke directly
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const handler = require('../../netlify/functions/razorpay-webhook.cjs').handler;

    const event = { httpMethod: 'POST', headers: { 'x-razorpay-signature': signature }, body };
    const res = await handler(event);
    if (res.statusCode !== 200) throw new Error('Webhook handler returned ' + res.statusCode + ': ' + res.body);

    // confirm webhook_logs entry created and order updated
    const logs = await db.collection('webhook_logs').orderBy('receivedAt', 'desc').limit(1).get();
    if (logs.empty) throw new Error('No webhook_logs written');

    const orderSnap = await db.collection('orders').doc(orderId).get();
    if (!orderSnap.exists) throw new Error('Order missing after webhook');
    const orderData = orderSnap.data();
    if (!orderData || !orderData.status) throw new Error('Order status not set');

    console.log('Razorpay webhook simulation test passed.');
  } finally {
    await testEnv.cleanup();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
