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
    try {
      // only attempt to initialize with a service account that contains a valid-looking private_key
      if (SERVICE_ACCOUNT.private_key && SERVICE_ACCOUNT.private_key.includes('BEGIN')) {
        initializeApp({ credential: cert(SERVICE_ACCOUNT), storageBucket: BUCKET });
        storage = new Storage({ credentials: SERVICE_ACCOUNT, projectId: SERVICE_ACCOUNT && SERVICE_ACCOUNT.project_id });
        db = getFirestore();
        authAdmin = getAuth();
      } else {
        // service account provided but private key looks fake; attempt to initialize default app for emulator use
        console.warn('Service account present but missing valid private_key; attempting default initializeApp for emulator');
        try {
          try { initializeApp(); } catch (e) { /* ignore if already initialized */ }
          db = getFirestore();
          authAdmin = getAuth();
          storage = new Storage();
        } catch (e) {
          console.warn('Failed to initialize emulator clients', e && e.message);
        }
      }
    } catch (e) {
      console.warn('Failed to initialize admin SDK with provided service account, falling back to emulator mode', e && e.message);
    }
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

    // verify ID token (allow tests to override by setting module.exports.__verifyIdToken)
    lazyInit();
    let decoded;
    try {
      if (typeof module.exports.__verifyIdToken === 'function') {
        decoded = await module.exports.__verifyIdToken(idToken);
      } else if (authAdmin && typeof authAdmin.verifyIdToken === 'function') {
        decoded = await authAdmin.verifyIdToken(idToken);
      } else {
        console.warn('No auth verifier available - rejecting token');
        return { statusCode: 401, body: 'invalid token' };
      }
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

    // If running against storage emulator, prefer returning an emulator-style download URL
    if (process.env.STORAGE_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
      const host = process.env.STORAGE_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST;
      const base = host.replace(/https?:\/\//, 'http://');
      const emulatorUrl = `${base}/v0/b/${encodeURIComponent(process.env.FIREBASE_STORAGE_BUCKET || 'test-bucket')}/o/${encodeURIComponent(path)}?alt=media`;
      return { statusCode: 200, body: JSON.stringify({ url: emulatorUrl }) };
    }

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
