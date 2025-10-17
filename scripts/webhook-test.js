#!/usr/bin/env node
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { URL } from 'url';

function usage() {
  console.log('Usage: node scripts/webhook-test.js <webhook_url> <razorpay_secret>');
  process.exit(1);
}

const [,, webhookUrl, secret] = process.argv;
if (!webhookUrl || !secret) usage();

const event = {
  entity: 'event',
  account_id: 'acct_test',
  event: 'payment.captured',
  contains: ['payment'],
  payload: {
    payment: {
      entity: {
        id: 'pay_test_' + Math.random().toString(36).slice(2, 10),
        amount: 49900,
        currency: 'INR',
        order_id: 'order_test_' + Math.random().toString(36).slice(2,8),
        status: 'captured',
        email: 'guest@example.com',
        contact: '9999999999'
      }
    }
  }
};

const body = JSON.stringify(event);
const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');

const parsed = new URL(webhookUrl);
const isHttps = parsed.protocol === 'https:';
const opts = {
  hostname: parsed.hostname,
  port: parsed.port || (isHttps ? 443 : 80),
  path: parsed.pathname + (parsed.search || ''),
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'X-Razorpay-Signature': hmac
  }
};

const req = (isHttps ? https : http).request(opts, (res) => {
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response body:', data);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.write(body);
req.end();
