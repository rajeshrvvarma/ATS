const { Storage } = require('@google-cloud/storage');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

if (!SERVICE_ACCOUNT) {
  console.warn('FIREBASE_SERVICE_ACCOUNT not set — cleanup-resumable-sessions will be limited.');
}

if (SERVICE_ACCOUNT) {
  initializeApp({ credential: cert(SERVICE_ACCOUNT), storageBucket: BUCKET });
}

const storage = new Storage({ credentials: SERVICE_ACCOUNT, projectId: SERVICE_ACCOUNT && SERVICE_ACCOUNT.project_id });
const db = getFirestore();

exports.handler = async function (event) {
  try {
    const now = Date.now();
    const expiryMs = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = new Date(now - expiryMs);

    const snapshot = await db.collection('upload_sessions').where('createdAt', '<', cutoff).get();
    const results = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      try {
        if (data.bucket && data.path) {
          const file = storage.bucket(data.bucket).file(data.path);
          await file.delete({ ignoreNotFound: true });
        }
        await doc.ref.update({ cleanedAt: new Date(), cleaned: true });
        results.push({ id: doc.id, cleaned: true });
      } catch (err) {
        await doc.ref.update({ cleanedAt: new Date(), cleaned: false, error: err.message });
        results.push({ id: doc.id, cleaned: false, error: err.message });
      }
    }

    await db.collection('upload_sessions_cleanup').add({ runAt: new Date(), results });

    return { statusCode: 200, body: JSON.stringify({ results }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
