import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
try {
  app = initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT
      ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      : applicationDefault(),
  });
} catch {}
const db = getFirestore();

export async function handler(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  const id = event.queryStringParameters?.merchantTransactionId || event.queryStringParameters?.mtid;
  if (!id) return { statusCode: 400, body: 'merchantTransactionId is required' };
  const snap = await db.collection('orders').doc(id).get();
  if (!snap.exists) return { statusCode: 404, body: 'not found' };
  return { statusCode: 200, body: JSON.stringify(snap.data()) };
}
