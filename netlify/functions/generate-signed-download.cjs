const { Storage } = require('@google-cloud/storage');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && (() => { try { return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); } catch (e) { return null; } })();
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

let storage = null;
let db = null;
let authAdmin = null;
let _initialized = false;

function lazyInit() {
  if (_initialized) return;
  if (SERVICE_ACCOUNT) {
    initializeApp({ credential: cert(SERVICE_ACCOUNT), storageBucket: BUCKET });
    storage = new Storage({ credentials: SERVICE_ACCOUNT, projectId: SERVICE_ACCOUNT && SERVICE_ACCOUNT.project_id });
    db = getFirestore();
    authAdmin = getAuth();
  } else {
    // When running in emulator/test, initializeApp may be done externally or not needed.
    try {
      db = getFirestore();
      authAdmin = getAuth();
      storage = new Storage();
    } catch (e) {
      // leave null
    }
  }
  _initialized = true;
}

// Returns a short-lived signed URL for a recording object if the caller is authorized (enrolled or admin)

exports.handler = async function (event) {
  try {
    const params = event.queryStringParameters || {};
    const path = params.path; // e.g., recordings/batches/{batchId}/{filename}
    const authHeader = event.headers && (event.headers.authorization || event.headers.Authorization);

    if (!path) return { statusCode: 400, body: 'missing path' };
    if (!authHeader) return { statusCode: 401, body: 'missing authorization' };
    const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) return { statusCode: 401, body: 'invalid authorization format' };
    const idToken = tokenMatch[1];

    // verify ID token
    lazyInit();
    let decoded;
    try {
      decoded = await authAdmin.verifyIdToken(idToken);
    } catch (err) {
      console.error('Token verify failed', err);
      return { statusCode: 401, body: 'invalid token' };
    }

    const uid = decoded.uid;
    // Basic authorization: check enrollment document or admin lookup
    const parts = path.split('/');
    const batchId = parts.length >= 3 ? parts[2] : null;
    let authorized = false;

    if (uid && batchId) {
      const enrollId = `${uid}_${batchId}`;
      const enrollDoc = await db.collection('enrollments').doc(enrollId).get();
      if (enrollDoc.exists) authorized = true;
      const adminDoc = await db.collection('admins').doc(uid).get();
      if (adminDoc.exists) authorized = true;
    }

    if (!authorized) return { statusCode: 403, body: 'forbidden' };

    // Rate limiting: allow up to 30 downloads per minute per UID
    const windowMs = 60 * 1000;
    const limit = 30;
    const cutoff = new Date(Date.now() - windowMs);
    const logsSnap = await db.collection('signed_download_logs')
      .where('uid', '==', uid)
      .where('createdAt', '>', cutoff)
      .get();
    if (logsSnap.size >= limit) {
      // log the blocked attempt
      await db.collection('signed_download_logs').add({ uid, path, createdAt: new Date(), blocked: true });
      return { statusCode: 429, body: 'rate limit exceeded' };
    }

    // log the allowed request
    await db.collection('signed_download_logs').add({ uid, path, createdAt: new Date(), blocked: false });

    // If storage client isn't initialized, construct an emulator-style download URL
    if (!storage || !BUCKET) {
      const emulatorUrl = `http://localhost:9199/v0/b/${encodeURIComponent(process.env.FIREBASE_STORAGE_BUCKET || 'test-bucket')}/o/${encodeURIComponent(path)}?alt=media`;
      return { statusCode: 200, body: JSON.stringify({ url: emulatorUrl }) };
    }

    const file = storage.bucket(BUCKET).file(path);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    return { statusCode: 200, body: JSON.stringify({ url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
