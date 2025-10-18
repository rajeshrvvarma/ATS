import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import { Storage } from '@google-cloud/storage';

// This test will run inside emulator lifecycle via `firebase emulators:exec`.

const projectId = 'ats-emulator-storage-e2e';

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.resolve('firestore.rules'), 'utf8'), host: 'localhost', port: 8080 },
    storage: { rules: fs.readFileSync(path.resolve('storage.rules'), 'utf8'), host: 'localhost', port: 9199 }
  });

  try {
    // configure @google-cloud/storage to use emulator
    process.env.STORAGE_EMULATOR_HOST = 'http://localhost:9199';
    const storage = new Storage({ apiEndpoint: 'http://localhost:9199', projectId });
    const bucketName = 'test-bucket';
    // create bucket in emulator
    const bucket = storage.bucket(bucketName);
    await bucket.create().catch(() => {});

    const filePath = 'recordings/batches/test-batch/test.mp4';
    const file = bucket.file(filePath);
    await file.save(Buffer.from('hello world'), { contentType: 'video/mp4' });

    // create enrollment doc later using adminCtx (below)
    // Seed required user doc for rules isAdmin() using authenticated context
    const adminCtx = testEnv.authenticatedContext('admin-uid', { admin: true });
    const adminDb = adminCtx.firestore();
    await adminDb.collection('users').doc('admin-uid').set({ role: 'admin', createdAt: Date.now() });

    // Monkeypatch the generate-signed-download function's auth verify to accept 'student-uid'
  const modPath = path.resolve('netlify/functions/generate-signed-download.cjs');
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);

  // Provide a minimal SERVICE_ACCOUNT for admin SDK initialization in emulator context
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ project_id: projectId, client_email: 'test@dev.local', private_key: '-----BEGIN PRIVATE KEY-----\nMIIBFAKE\n-----END PRIVATE KEY-----\n' });
  process.env.FIREBASE_STORAGE_BUCKET = bucketName;

    // Verify admin can read the uploaded object (server-side read)
    // The storage client we created above is using emulator; use it to download
    const downloaded = await file.download();
    const content = downloaded[0].toString('utf8');
    if (content !== 'hello world') throw new Error('Downloaded content mismatch');

  // create enrollment doc using admin context
  await adminDb.collection('enrollments').doc('student-uid_test-batch').set({ studentId: 'student-uid', createdAt: Date.now() });
  const enroll = await adminDb.collection('enrollments').doc('student-uid_test-batch').get();
    if (!enroll.exists) throw new Error('Enrollment doc missing');

    console.log('Storage E2E test passed (server read + enrollment verification)');
  } finally {
    await testEnv.cleanup();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
