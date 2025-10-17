# Firebase rules & Admin SDK guidance

This file explains how to deploy `firestore.rules` and why the preferred method for server writes is the Firebase Admin SDK.

## Deploy rules using Firebase CLI

1. Install firebase-tools if you don't have it:

```powershell
npm install -g firebase-tools
```

2. Login and deploy rules:

```powershell
firebase login
firebase deploy --only firestore:rules
```

Make sure your Firebase project is set in `.firebaserc` or pass `--project your-project-id`.

## Use Firebase Admin SDK for server writes (preferred)

Server-side functions (webhooks, reconciliation) should use the Admin SDK. Admin SDK calls bypass Firestore security rules and are therefore the recommended way for trusted server operations.

Example Node initialization in a Netlify function or Cloud Function:

```js
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// then use db.collection('orders').doc(orderId).set(...)
```

Store the full service account JSON in Netlify / GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT` (single-line JSON string). Use the helper script `scripts/format-service-account.js` to format it.

## If you must use a client-authenticated service user

- Use this only when Admin SDK can't be used.
- Use a dedicated service account user with minimal privileges.
- Keep credentials in secrets and rotate them.
- Consider using custom claims (`admin: true`) instead of UID checks in rules.

If you want, I can update your webhook and reconciliation functions to use Admin SDK — tell me and I'll patch them now.
