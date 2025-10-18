const { getStorage } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');
const { db } = require('./lib/admin');

// This function returns a signed URL for uploading directly to GCS.
// Expects JSON body: { path: 'recordings/batches/<batchId>/<filename>', contentType: 'video/mp4', ttlSeconds: 900 }
// Requires Authorization: Bearer <idToken>
// Returns: { uploadUrl, downloadUrl, path }

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const { path, contentType, ttlSeconds } = body;
    if (!path || !contentType) return { statusCode: 400, body: JSON.stringify({ error: 'path and contentType required' }) };

    // verify Firebase ID token
    const authHeader = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
    if (!authHeader.startsWith('Bearer ')) return { statusCode: 401, body: JSON.stringify({ error: 'Missing Authorization token' }) };
    const idToken = authHeader.split(' ')[1];

    let token;
    try {
      token = await getAuth().verifyIdToken(idToken);
    } catch (e) {
      console.warn('Invalid ID token', e.message);
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }

    // allow only admins or instructors to request signed urls
    const isAdmin = !!token.admin || !!token.role && token.role === 'admin';
    const isInstructor = !!token.instructor || !!token.role && token.role === 'instructor';
    if (!isAdmin && !isInstructor) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Not authorized to request upload URLs' }) };
    }

    const storage = getStorage();
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(path);

    const expires = Date.now() + ((ttlSeconds || 900) * 1000);
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires,
      contentType
    });

    const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(path)}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, downloadUrl, path })
    };
  } catch (err) {
    console.error('generate-upload-url error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
