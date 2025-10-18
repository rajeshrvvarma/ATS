import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';

const projectId = 'ats-emulator-test';

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.resolve('firestore.rules'), 'utf8'), host: 'localhost', port: 8080 },
    storage: { rules: fs.readFileSync(path.resolve('storage.rules'), 'utf8'), host: 'localhost', port: 9199 }
  });

  // Unauthenticated client should not write session recordings
  const unauth = testEnv.unauthenticatedContext();
  const admin = testEnv.authenticatedContext('admin-uid', { admin: true });

  // Basic smoke checks — assert Firestore rules for enrollments.
  try {
    const dbUnauth = unauth.firestore();
    const dbAdmin = admin.firestore();

    // unauth should fail to write an enrollment doc
    await assertFails(dbUnauth.collection('enrollments').doc('u_test-batch').set({ createdAt: Date.now() }));
    // admin (via custom claim) should succeed
    await assertSucceeds(dbAdmin.collection('enrollments').doc('u_test-batch').set({ createdAt: Date.now(), studentId: 'admin-uid' }));

    console.log('Firestore rules smoke tests passed.');
  } finally {
    await testEnv.cleanup();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
