# Testing & Verification Checklist

This document lists all recommended tests, verification steps, and acceptance criteria for the enrollment/payment, uploads, admin workflows, and security rules in this repository. Follow the sections in order when performing verification locally or in a staging environment.

## Quick setup

1. Install dependencies:

```powershell
cd "d:\my website\AT-CS"
npm install
```

2. Environment variables (for serverless functions and integration tests):

- FIREBASE_SERVICE_ACCOUNT: JSON string of a service account with Firestore / Storage permissions (for function emulation or deployment).
- FIREBASE_STORAGE_BUCKET: your storage bucket name (e.g. `project-id.appspot.com`).
- ENROLLMENT_API_SECRET: a random shared secret used to authenticate internal reprocess calls.
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET: Razorpay credentials for order creation and HMAC verification.
- SITE_URL (optional): used by server functions to call internal endpoints during webhook dispatches.

For emulator-only runs, `FIREBASE_SERVICE_ACCOUNT` is not required when using the Firebase emulators.

## 1) Static checks (pre-flight)

- npm run lint (fix or inspect any warnings)
- npm run build (ensures front-end compiles)

Acceptance criteria: build completes without fatal errors.

## NOTE: Disabled / removed local test files

During the coding phase we added some local test harness and helper scripts (emulator-based storage/rules tests, enrollment idempotency test, and webhook simulation helpers). Per current project plan those files have been disabled/removed from the main branch and all verification steps are preserved in this document.

If you want to re-enable the test harness later:
- Restore the test files from Git history (they were committed earlier) or re-create them from the sections below.
- Install `@firebase/rules-unit-testing` as a devDependency and add the test script back into `package.json` as described in earlier drafts.
- Start the Firestore/Storage emulators and run the harness as described in the relevant sections.

This document is the single source of truth for what to run and when — run the tests only after all coding is complete and the environment variables listed in the Quick setup section are configured.

## 2) Storage rules verification (emulator)

Purpose: ensure recordings cannot be uploaded client-side, and students enrolled in a batch can read recordings. Also verify admin thumbnail writes.

Files involved:
- `storage.rules` (production rules)
- `tests/run-storage-tests.js` (local harness)
- `firebase.json` (emulator ports)

Steps:
1. Ensure `@firebase/rules-unit-testing` is installed (`npm install`).
2. Run the test harness:

```powershell
npm run test:rules
```

3. Expected outcomes:
- Unauthenticated upload to `recordings/batches/batch1/video.mp4` fails.
- Admin authenticated upload to `thumbnails/thumb1.png` succeeds.

Additional manual checks (optional/emulator):
- Create an enrollment document at `enrollments/alice_batch1` and assert that an authenticated `alice` can read `recordings/batches/batch1/video.mp4` if the file metadata `public != 'true'`.
- Set resource metadata `public = 'true'` and confirm read allowed by unauthenticated users.

Acceptance criteria: Storage rules block client uploads to recordings and allow reads only for enrolled users or public metadata.

## 3) Signed upload URL flow

Purpose: ensure server issues V4 signed PUT URLs and client can upload directly.

Server function: `netlify/functions/generate-upload-url.js`
Client code: `src/components/admin/SessionUpload.jsx`

Tests:
- Start Netlify functions locally or deploy to staging with valid `FIREBASE_SERVICE_ACCOUNT` and `FIREBASE_STORAGE_BUCKET`.
- Call `/.netlify/functions/generate-upload-url` with a valid Firebase ID token of an admin or instructor and `path` like `recordings/batches/{batchId}/file.mp4`.
- Use `curl` or a small script to PUT a file to the returned `uploadUrl` and then confirm the file exists in your storage bucket.
- Confirm that a session document is written to `batches/{batchId}/sessions` with a `recordingUrl` matching the expected download URL.

Acceptance criteria: signed URL returned, allowed to PUT, and session doc recorded.

## 4) Razorpay order creation & client checkout

Files involved:
- `netlify/functions/razorpay-create-order.js`
- `src/pages/EnrollUsPage.jsx` and client code that hits the create-order endpoint and opens Razorpay checkout.

Tests (staging):
- With `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set on the server, hit the client enroll flow and create a test order.
- Confirm `orders/{orderId}` is created with the expected notes and metadata.
- Complete payment in Razorpay sandbox (or use test cards), and observe webhook behavior (see step 5).

Acceptance criteria: order created and stored; client checkout opens successfully.

## 5) Webhook handling & idempotent enrollment

Files involved:
- `netlify/functions/razorpay-webhook.js`
- `netlify/functions/process-enrollment.js` and `netlify/functions/lib/sharedEnrollmentLogic.js`

Manual tests (staging):
- Simulate Razorpay webhook to `/.netlify/functions/razorpay-webhook` with a correctly computed HMAC header.
  - The webhook should create/update `orders/{orderId}` and create a `webhook_logs/{autoId}` entry with `verification: 'success'`.
- Confirm `process-enrollment` is invoked and that `enrollments/{userId}_{batchId}` is created.
- Test idempotency:
  - Send the same webhook twice (or call `process-enrollment` with the same payment payload twice).
  - Confirm only a single enrollment document is created and `orders/{orderId}.processed` is set to true.

Acceptance criteria: webhook logs persisted; enrollment created once even if the same webhook is processed multiple times.

## 6) Admin reprocess endpoint

File: `netlify/functions/admin-reprocess-order.js`

Tests:
- Ensure `ENROLLMENT_API_SECRET` is set in staging.
- Post to `/.netlify/functions/admin-reprocess-order` with header `x-enrollment-secret: <secret>` and payload `{ "orderId": "..." }`.
- Confirm the function returns a successful result and writes a `reprocess_logs` entry.
- Try calling without the header — should return 401.

Acceptance criteria: only requests with correct header succeed; reprocess_logs recorded.

## 7) Session upload UI

Files: `src/components/admin/SessionUpload.jsx`, `src/components/admin/AdminBatchManager.jsx`

Tests:
- As an admin, open the batch manager and upload a large session file.
- Observe progress bar, and validate playback after upload.
- Validate file size and content-type limits (client enforces a 1GB soft limit). If a file exceeds the limit, UI should prevent upload.

Acceptance criteria: upload works, progress visible, session reference stored in Firestore.

## 8) End-to-end enrollments & student access

Flow: Student uses the enrollment UI -> completes payment -> webhook/process-enrollment creates enrollment -> Student can access course materials and recorded sessions.

Tests:
- Create a new course + batch using the Admin UI.
- As a test student, enroll (test payment) and confirm the student record appears under `enrollments/`.
- Confirm the student can access course pages and read recordings (if enrollment-based access is enforced in rules).

Acceptance criteria: complete E2E flow works and access controls behave as expected.

## 9) Automated tests to add (future work)

- Unit tests for `persistEnrollment` transaction (cover race conditions where multiple processors attempt the same order).
- Integration test: simulate a webhook POST to `razorpay-webhook` that computes a proper HMAC, assert `webhook_logs` and `orders` update, and that `enrollments` created.
- Storage rules expansion: test instructor role, public metadata, and invalid paths.

## 10) Deployment checklist

- Ensure env vars are set in the deployment environment:
  - FIREBASE_SERVICE_ACCOUNT (JSON), FIREBASE_STORAGE_BUCKET
  - ENROLLMENT_API_SECRET
  - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
  - SITE_URL (used by the webhook dispatch)
- Deploy Netlify functions and test webhooks from Razorpay's dashboard (sandbox first).
- Monitor `webhook_logs` and `reprocess_logs` for early issues.

---

If you want, I can now:
- Expand the emulator tests to cover enrollment read access and public metadata cases, and add the enrollment idempotency unit test, or
- Draft the exact curl / node snippets to simulate Razorpay webhooks (including HMAC computation) so you can run them in staging.

Tell me which one to do next, or run the checks yourself and report results and I'll help iterate.