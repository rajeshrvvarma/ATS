# Deployment & Reconciliation TODO (run this checklist tomorrow)

Follow these steps to configure environment variables, deploy the site, configure Razorpay webhooks, and verify the end-to-end enrollment/reconciliation flows.

## 1) Environment variables (Netlify / GitHub Secrets)
Set these in Netlify Site settings -> Build & deploy -> Environment, and in GitHub repo Secrets for the scheduled workflow:

- `FIREBASE_SERVICE_ACCOUNT` (REQUIRED): JSON string for Firebase Admin SDK service account. Use the full JSON content (stringified).
- `RAZORPAY_KEY_ID` (REQUIRED): Razorpay Key ID for server use.
- `RAZORPAY_KEY_SECRET` (REQUIRED): Razorpay Key Secret (used for creating orders and webhook signature verification).
- `ENROLLMENT_API_SECRET` (RECOMMENDED): A strong random secret used to protect internal endpoints (`process-enrollment`, admin endpoints). Keep secret.
- `SITE_URL` (RECOMMENDED): Full site URL (e.g., `https://your-site.netlify.app`) — used by server functions when posting Netlify Forms and calling internal endpoints.
- `SENTRY_DSN` (OPTIONAL): If you want Sentry error reporting for server functions.

Optional for local testing / scripts:
- `CREATE_MISSING=1` (local only): when running the reconciliation script locally to auto-create missing enrollments.

Notes:
- Do NOT commit these values into the repository. Use the Netlify dashboard and GitHub Secrets only.
- For `FIREBASE_SERVICE_ACCOUNT` paste the JSON object (string). On Netlify/GitHub, store it as a single-line JSON string.

## 2) Deploy the site (Netlify)

1. Ensure you pushed your changes to `main` (or the branch Netlify is configured to deploy).
2. In your repo root (optional local verification), run:

```powershell
cd "d:\my website\AT-CS"
npm ci
npm run build
```

3. Push to Git (if not already), then monitor the Netlify deploy. Wait for functions to appear in the Netlify Functions dashboard.

## 3) Configure Razorpay webhook

1. Open Razorpay Dashboard → Settings → Webhooks → Add webhook.
2. Use the URL:

```
https://your-site.netlify.app/.netlify/functions/razorpay-webhook
```

3. Set the webhook secret to the same value you put into `RAZORPAY_KEY_SECRET`.
4. Select events: at minimum enable `payment.captured` (and optionally `order.paid`).

## 4) Quick local webhook test (optional)
You can simulate a signed webhook request locally or to the deployed function. Create a small Node script to POST a signed payload and run it against the deployed webhook URL.

Expect HTTP 200 and a JSON response { ok: true } and check Firestore `orders` and `webhook_logs` collections.

## 5) Verify enrollment creation

After a test webhook or a real test payment via Razorpay checkout:

1. Open Firestore and check `orders` collection — the order document should exist and include `raw` or `payment` data.
2. Check `enrollments` collection — an enrollment doc should be created with `payment.reference` matching the Razorpay payment id.
3. Check `webhook_logs` collection for a corresponding entry.
4. If you use Netlify Forms for notifications, check Netlify form inbox for `enrollment-notification` submissions.

## 6) Admin UI verification

1. Login to the site as an admin user (the app reads `user.role` from the profile).
2. Visit the Payments Reconciliation page (Admin -> Payments Reconcile). The page requires `user.role === 'admin'.`
3. You should see a paginated list of missing orders (if any). Use "Reprocess" to trigger reprocessing.
4. Confirm that reprocessing creates the enrollment and the UI updates.

## 7) Manual reconciliation (local / immediate)

1. Locally run the reconciliation script (requires `FIREBASE_SERVICE_ACCOUNT` env var set locally):

```powershell
# Example: set FIREBASE_SERVICE_ACCOUNT from a file and run the script
$env:FIREBASE_SERVICE_ACCOUNT = Get-Content -Raw .\service-account.json
node scripts/reconcileOrders.js
```

2. To auto-create missing enrollments via the script, set `CREATE_MISSING=1` and ensure `ENROLLMENT_API_SECRET` is set and matches Netlify value:

```powershell
# Example: set env vars and run the script locally
$env:FIREBASE_SERVICE_ACCOUNT = Get-Content -Raw .\service-account.json
$env:CREATE_MISSING = '1'
$env:ENROLLMENT_API_SECRET = 'your_secret_here'
node scripts/reconcileOrders.js
```

## 8) GitHub Actions scheduled reconciliation

- I added `.github/workflows/reconcile.yml` which runs the reconciliation daily at 02:00 UTC. Ensure the repository secrets are set:
  - `FIREBASE_SERVICE_ACCOUNT`
  - `ENROLLMENT_API_SECRET`
  - `SITE_URL` (optional)

## 9) Troubleshooting checklist

- If webhook signature verification fails:
  - Confirm the webhook secret in Razorpay matches `RAZORPAY_KEY_SECRET` in Netlify.
  - Confirm Netlify function receives the raw body unchanged. If mismatched, capture the raw body and compute HMAC to debug.
- If enrollment is not created:
  - Check `orders` doc in Firestore to ensure the webhook wrote it.
  - Check `webhook_logs` for any error messages.
  - Inspect function logs in Netlify to see any thrown errors.
- If admin UI shows Access Denied:
  - Confirm your user profile in Firestore has `role: 'admin'` (the AuthContext merges profile into `user` object).

## 10) After verification (optional improvements)

- Enable `SENTRY_DSN` to capture server function errors in Sentry.
- Add server-side enrollment business rules if you prefer more checks (coupons, seat limits).
- Add an admin reprocess queue instead of synchronous processing for large volumes.

---
If you want, I can also add a short helper that formats the `FIREBASE_SERVICE_ACCOUNT` JSON into a single-line string suitable for pasting into Netlify/GitHub secrets. Want that helper added?

## Appendix: Helpers to add (recommended)

1) Helper: `scripts/format-service-account.js`

Purpose: Convert a multi-line `service-account.json` to a single-line JSON string that you can copy-paste into Netlify/GitHub Secrets.

Usage (example):

```powershell
node scripts/format-service-account.js ./service-account.json
```

Output: Prints a single-line JSON string to stdout. You can copy that string into Netlify or GitHub Secrets.

2) Helper: `scripts/webhook-test.js`

Purpose: Send a signed Razorpay-style webhook POST to your deployed `/razorpay-webhook` endpoint to verify signature verification and write behavior.

Usage (example):

```powershell
`node scripts/webhook-test.js https://your-site.netlify.app/.netlify/functions/razorpay-webhook your_razorpay_secret`
```

Output: Logs response HTTP status and body; check Firestore for `orders` and `webhook_logs` entries.

## Local smoke test (what I ran)

I ran a quick local smoke test to validate the helpers and the local webhook receiver. Steps and results:

1. Start a simple local receiver:

```powershell
node scripts/dev-webhook-receiver.js
# listens on http://localhost:9000/webhook
```

2. Format the sample service account JSON:

```powershell
node scripts/format-service-account.js scripts/sample-service-account.json
# prints a single-line JSON string
```

3. Send a signed test webhook to the local receiver:

```powershell
node scripts/webhook-test.js http://127.0.0.1:9000/webhook fake_secret_for_test
# receiver logged headers and body; returned { ok: true }
```

Observed results:
- `dev-webhook-receiver` printed the incoming request URL, headers (including `x-razorpay-signature`) and the JSON body.
- `webhook-test.js` printed Status: 200 and Response body: { ok: true }.

How to stop the local receiver (PowerShell):

```powershell
# Find node processes and stop the receiver (careful if you have other node processes):
Get-Process node | Where-Object { $_.Path -like '*node*' } | ForEach-Object { Stop-Process -Id $_.Id -Force }
```

Notes:
- Local receiver is for convenience only. For real webhook verification, test against the deployed Netlify function and the Razorpay dashboard.

## Tomorrow checklist (exact steps to run)

Follow these steps in order tomorrow after you set the environment variables in Netlify/GitHub:

1) Verify env vars locally (optional quick check)

```powershell
# Replace path with where you keep your real service account JSON locally
$env:FIREBASE_SERVICE_ACCOUNT = Get-Content -Raw .\service-account.json
$env:RAZORPAY_KEY_ID = 'your_razorpay_key_id'
$env:RAZORPAY_KEY_SECRET = 'your_razorpay_key_secret'
$env:ENROLLMENT_API_SECRET = 'a_strong_random_secret'
$env:SITE_URL = 'https://your-site.netlify.app'
```

2) Build & deploy

```powershell
cd "d:\my website\AT-CS"
npm ci
npm run build
# push your branch and monitor Netlify deploy
git add .
git commit -m "deploy: enrollment + razorpay functions and recon helpers"
git push
```

3) Configure Razorpay webhook

Use the Razorpay dashboard and set:
- Webhook URL: `https://your-site.netlify.app/.netlify/functions/razorpay-webhook`
- Webhook secret: the same value as `RAZORPAY_KEY_SECRET`
- Events: at minimum `payment.captured`

4) Quick verification (deployed)

```powershell
# Run the formatter (optional):
node scripts/format-service-account.js ./service-account.json

# Test webhook against deployed endpoint (use your real secret):
`node scripts/webhook-test.js https://your-site.netlify.app/.netlify/functions/razorpay-webhook your_razorpay_key_secret`
```

5) Verify in Firestore & Admin UI

- Check `orders`, `enrollments`, and `webhook_logs` collections in Firestore.
- Login as admin and visit Admin -> Payments Reconcile. Reprocess any missing orders if needed.

6) If something fails

- Inspect Netlify Function logs for `razorpay-webhook` and `process-enrollment`.
- Check that `RAZORPAY_KEY_SECRET` in Netlify matches the webhook secret in Razorpay.

---
Mark tasks as done in this file as you complete them.



