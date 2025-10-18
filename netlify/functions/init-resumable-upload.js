const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { Storage } = require('@google-cloud/storage');

let app;
try {
  app = initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() });
} catch (e) {}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const body = JSON.parse(event.body || '{}');
    const { path, contentType } = body;
    if (!path || !contentType) return { statusCode: 400, body: 'path and contentType required' };

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) return { statusCode: 500, body: 'FIREBASE_STORAGE_BUCKET not configured' };

    // Initialize Google Cloud Storage client using default credentials or service account
    const storage = new Storage({ credentials: process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : undefined });
    const bucket = storage.bucket(bucketName);

    // Create a resumable upload URL
    const file = bucket.file(path);
    const [resumableUrl] = await file.createResumableUpload({ origin: '*' });

    // Public download URL (not signed) — you may prefer to compute signed download URLs separately
    const downloadUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(path)}`;

    return { statusCode: 200, body: JSON.stringify({ uploadUrl: resumableUrl, downloadUrl }) };
  } catch (err) {
    console.error('init-resumable-upload error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
