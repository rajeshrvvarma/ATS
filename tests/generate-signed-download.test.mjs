import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';

const projectId = 'ats-emulator-signed-download-test';

async function mintIdTokenForUid(uid) {
  // Use Auth emulator REST API to create a user and sign in to get an ID token
  const authHost = 'http://localhost:9099';
  // create user
  await fetch(`${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localId: uid })
  });
  // create custom token via emulator admin endpoint
  const resp = await fetch(`${authHost}/emulator/v1/projects/${projectId}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localId: uid })
  });
  // Now request a session (emulator: create custom token then exchange)
  const createCustom = await fetch(`${authHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'owner', returnSecureToken: true })
  });
  // The emulator accepts some relaxed flows; to keep this test simple we'll use admin SDK to create a custom token
  // Instead, the tests will bypass full token mint and instead patch the handler to accept a fake token 'FAKE_ID_TOKEN'
  return 'FAKE_ID_TOKEN';
}

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.resolve('firestore.rules'), 'utf8'), host: 'localhost', port: 8080 },
    storage: { rules: fs.readFileSync(path.resolve('storage.rules'), 'utf8'), host: 'localhost', port: 9199 }
  });

  try {
    process.env.STORAGE_EMULATOR_HOST = 'http://localhost:9199';
    const storage = new Storage({ apiEndpoint: 'http://localhost:9199', projectId });
    const bucketName = 'test-bucket';
    const bucket = storage.bucket(bucketName);
    await bucket.create().catch(() => {});

    const filePath = 'recordings/batches/batch-1/test.mp4';
    const file = bucket.file(filePath);
    await file.save(Buffer.from('video-data'), { contentType: 'video/mp4' });

    const adminCtx = testEnv.authenticatedContext('admin-uid', { admin: true });
    const adminDb = adminCtx.firestore();
    await adminDb.collection('enrollments').doc('student1_batch-1').set({ studentId: 'student1', createdAt: Date.now() });

  // Configure emulator env vars so the function uses emulator download URLs
  process.env.STORAGE_EMULATOR_HOST = 'http://localhost:9199';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'http://localhost:9199';
  // Monkeypatch service account and bucket for the function
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({ project_id: projectId, client_email: 'test@dev.local', private_key: 'MIIBFAKE' });
    process.env.FIREBASE_STORAGE_BUCKET = bucketName;

    // require the CJS function
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const fn = require(path.resolve('netlify/functions/generate-signed-download.cjs'));

    // patch verifyIdToken to accept 'FAKE_ID_TOKEN' and return uid 'student1'
    const originalVerify = fn.__verifyIdToken;
    fn.__verifyIdToken = async (token) => {
      if (token === 'FAKE_ID_TOKEN') return { uid: 'student1' };
      if (originalVerify) return originalVerify(token);
      throw new Error('invalid token');
    };

    // invoke function
    const event = { queryStringParameters: { path: filePath }, headers: { authorization: 'Bearer FAKE_ID_TOKEN' } };
    const res = await fn.handler(event);
    if (res.statusCode !== 200) throw new Error('expected 200 from handler: ' + JSON.stringify(res));
    const body = JSON.parse(res.body || '{}');
    if (!body.url) throw new Error('missing url in response');

    console.log('generate-signed-download test passed, url:', body.url);
  } finally {
    await testEnv.cleanup();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
