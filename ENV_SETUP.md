# Environment Variables Setup Guide

Quick reference for setting up all required environment variables in Netlify.

Note: For the default UPI-only flow, you don’t need any payment gateway API keys. Students pay to your UPI ID and provide the UTR in the form. The PhonePe variables below are optional and only required if/when you enable gateway checkout later.

## Netlify Dashboard Setup

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

## Required Variables

### PhonePe Configuration

```bash
# Get these from PhonePe merchant dashboard after registration
PHONEPE_MERCHANT_ID=M22XXXXXXXXXX
PHONEPE_SALT_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PHONEPE_SALT_INDEX=1

# Environment URL (use sandbox for testing)
PHONEPE_BASE_URL=https://api-preprod.phonepe.com
```

### Firebase Admin SDK

```bash
# Service account JSON (paste as single line, no line breaks)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40your-project.iam.gserviceaccount.com"}
```

## How to Get Each Variable

### PhonePe Variables

1. **PHONEPE_MERCHANT_ID**:
   - Register at [PhonePe for Business](https://business.phonepe.com/)
   - Complete KYC verification
   - Find in merchant dashboard under API section

2. **PHONEPE_SALT_KEY**:
   - Generated in PhonePe merchant dashboard
   - Found in API credentials section
   - Keep this secret and secure

3. **PHONEPE_SALT_INDEX**:
   - Usually "1" for most merchants
   - Check your PhonePe API documentation

4. **PHONEPE_BASE_URL**:
   - Sandbox: `https://api-preprod.phonepe.com`
   - Production: `https://api.phonepe.com`

### Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project settings** (gear icon)
4. Click **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. Copy the entire JSON content as a single line (remove line breaks)

## Validation

After setting variables, test with:

```bash
# Check if functions can access variables
curl -X POST https://your-site.netlify.app/.netlify/functions/phonepe-initiate \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"customer":{"name":"Test","email":"test@example.com","phone":"9999999999"}}'
```

Should return a redirect URL if configured correctly.

## Security Notes

- Never commit these values to your repository
- Use different credentials for staging/production
- Rotate keys periodically
- Monitor usage in respective dashboards

## Troubleshooting

### Common Issues

1. **JSON formatting errors**: Ensure Firebase service account is single-line JSON
2. **PhonePe signature errors**: Check SALT_KEY and SALT_INDEX match dashboard
3. **Function errors**: Check Netlify Functions logs for specific error messages

### Testing Variables

You can test if variables are properly set by checking function logs in Netlify dashboard.

---

*Setup guide updated: October 11, 2025*