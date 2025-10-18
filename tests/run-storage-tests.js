// Basic storage rules tests using @firebase/rules-unit-testing
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');

(async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: 'ats-test',
    firestore: { rules: fs.readFileSync(path.resolve(__dirname, '..', 'firestore.rules'), 'utf8') },
    storage: { rules: fs.readFileSync(path.resolve(__dirname, '..', 'storage.rules'), 'utf8') }
  });

  console.log('Test environment ready');

  const unauth = testEnv.unauthenticatedContext().storage();
  const alice = testEnv.authenticatedContext('alice', { uid: 'alice', admin: false }).storage();
  const admin = testEnv.authenticatedContext('admin', { uid: 'admin', admin: true }).storage();

  const bucket = alice.bucket();

  // Scenario: unauthenticated user cannot write to recordings
  try {
    await assertFails(unauth.upload(bucket.file('recordings/batches/batch1/video.mp4'), Buffer.from('x')));
    console.log('PASS: unauth cannot write recordings');
  } catch (e) { console.error('FAIL: unauth write test', e); }

  // Admin should be able to write thumbnails
  try {
    await assertSucceeds(admin.upload(bucket.file('thumbnails/thumb1.png'), Buffer.from('x')));
    console.log('PASS: admin can write thumbnails');
  } catch (e) { console.error('FAIL: admin thumbnail test', e); }

  await testEnv.cleanup();
  process.exit(0);
})();
