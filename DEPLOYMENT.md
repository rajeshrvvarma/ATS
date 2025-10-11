# Deployment Guide

This document covers the deployment setup for the AT-CS website with PhonePe payment integration and Firebase backend.

## Overview

The application now uses:
- **PhonePe** for payment processing (replaced Razorpay)
- **Firebase Auth & Firestore** for user management and data storage
- **Netlify Forms** for contact/enrollment inquiries
- **Netlify Functions** for serverless backend endpoints

## 1. PhonePe Setup

### 1.1 Register with PhonePe for Business

1. Visit [PhonePe for Business](https://business.phonepe.com/)
2. Sign up for a merchant account
3. Complete KYC verification with required documents:
   - PAN Card
   - Business registration documents
   - Bank account details
   - GST certificate (if applicable)

### 1.2 Get API Credentials

After approval, you'll receive:
- **Merchant ID**: Your unique merchant identifier
- **Salt Key**: Secret key for signature generation
- **Salt Index**: Usually "1" for production

### 1.3 Configure Webhook URL

In PhonePe merchant dashboard, set your webhook URL to:
```
https://your-site-name.netlify.app/.netlify/functions/phonepe-callback
```

## 2. Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and Firestore Database

### 2.2 Generate Service Account

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire JSON content (you'll need this for environment variables)

### 2.3 Configure Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading user notes for admin dashboard
      match /notes/{noteId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Orders collection (payment data)
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Webhooks collection (payment callbacks)
    match /webhooks_phonepe/{webhookId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin can access everything
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 3. Netlify Environment Variables

In your Netlify site dashboard, go to **Site settings → Environment variables** and add:

### 3.1 PhonePe Configuration

```bash
# PhonePe API Credentials
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1

# PhonePe Environment (use sandbox for testing)
PHONEPE_BASE_URL=https://api-preprod.phonepe.com  # Sandbox
# PHONEPE_BASE_URL=https://api.phonepe.com        # Production
```

### 3.2 Firebase Configuration

```bash
# Firebase Service Account (paste as single-line JSON)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 3.3 Other Variables

```bash
# Netlify Functions URL (auto-set by Netlify)
URL=https://your-site-name.netlify.app
```

## 4. Testing Procedures

### 4.1 Pre-Testing Checklist

- [ ] PhonePe sandbox credentials configured
- [ ] Firebase service account has Firestore permissions
- [ ] Netlify Functions deployed successfully
- [ ] Environment variables set correctly

### 4.2 Payment Flow Testing

#### Test 1: Enrollment Modal
1. Navigate to any course enrollment page
2. Fill out the enrollment form
3. Select "PhonePe (UPI/Card/Net Banking)" payment method
4. Click "Make Payment"
5. Verify redirect to PhonePe hosted page
6. Complete payment in sandbox
7. Verify redirect to `/payment/success?mtid=...`
8. Check that success page shows "Verifying your payment..."
9. Wait for status to update and receipt to display

#### Test 2: Account Activation
1. Go to `/activate` page
2. Fill out activation form
3. Click payment button
4. Follow same flow as Test 1

#### Test 3: Video Course Enrollment
1. Navigate to video learning section
2. Try enrolling in a paid course
3. Verify PhonePe redirect flow works

### 4.3 Backend Testing

#### Test Netlify Functions

```bash
# Test payment status endpoint
curl "https://your-site.netlify.app/.netlify/functions/payment-status?merchantTransactionId=test_id"

# Should return 404 for non-existent orders
```

#### Test Firestore Integration

1. Complete a payment flow
2. Check Firebase Console → Firestore
3. Verify these collections exist with data:
   - `orders/{merchantTransactionId}`
   - `webhooks_phonepe/{transactionId}` (after callback)

### 4.4 Forms Testing

#### Test Contact Forms
1. Fill out contact form on homepage
2. Submit and verify success message
3. Check Netlify Forms dashboard for submission

#### Test Enrollment Inquiries
1. Use workshop registration form
2. Submit with different course types
3. Verify submissions in Netlify dashboard

## 5. Production Deployment

### 5.1 Switch to Production

When ready for live payments:

1. Update environment variables:
   ```bash
   PHONEPE_BASE_URL=https://api.phonepe.com
   ```

2. Update PhonePe merchant dashboard:
   - Switch from sandbox to production mode
   - Update webhook URL if needed
   - Test with small amounts first

### 5.2 Monitoring

#### Payment Monitoring
- Monitor Firestore `orders` collection for payment status
- Check PhonePe merchant dashboard for transaction reports
- Set up alerts for failed payments

#### Function Monitoring
- Check Netlify Functions logs for errors
- Monitor function execution times
- Set up error alerting

## 6. Troubleshooting

### Common Issues

#### PhonePe Errors
- **Invalid signature**: Check SALT_KEY and SALT_INDEX
- **Merchant not found**: Verify MERCHANT_ID
- **Webhook failures**: Check callback URL and HTTPS

#### Firebase Errors
- **Permission denied**: Check Firestore security rules
- **Service account errors**: Verify JSON format and permissions

#### Function Errors
- **Environment variables**: Check all required vars are set
- **CORS issues**: Functions should handle CORS automatically

### Debug Steps

1. **Check Netlify Function logs**:
   - Go to Netlify dashboard → Functions
   - Click on function name to see logs

2. **Verify environment variables**:
   - Netlify dashboard → Site settings → Environment variables
   - Ensure no extra spaces or quotes

3. **Test functions directly**:
   ```bash
   # Test payment initiation
   curl -X POST https://your-site.netlify.app/.netlify/functions/phonepe-initiate \
     -H "Content-Type: application/json" \
     -d '{"amount":100,"customer":{"name":"Test","email":"test@example.com","phone":"9999999999"}}'
   ```

## 7. Security Considerations

### Production Security
- Never expose Salt Key in client-side code
- Use HTTPS for all endpoints
- Validate all webhook signatures
- Implement rate limiting if needed

### Data Protection
- Store minimal customer data
- Encrypt sensitive information
- Regular backup of Firestore data
- Comply with data protection regulations

## 8. Support and Documentation

### PhonePe Resources
- [PhonePe API Documentation](https://developer.phonepe.com/)
- [PhonePe Merchant Support](https://business.phonepe.com/support)

### Firebase Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Netlify Resources
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)

---

## Quick Start Checklist

For immediate setup after PhonePe registration:

1. [ ] Get PhonePe credentials (Merchant ID, Salt Key, Salt Index)
2. [ ] Set PhonePe environment variables in Netlify
3. [ ] Set Firebase service account in Netlify
4. [ ] Configure PhonePe webhook URL
5. [ ] Test with sandbox credentials
6. [ ] Verify payment flow end-to-end
7. [ ] Check Firestore data creation
8. [ ] Switch to production when ready

---

*Last updated: October 11, 2025*