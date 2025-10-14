# Firebase Firestore Rules Deployment Guide

## Step 1: Copy the Rules

Copy the content from `firestore.rules` file and paste it into your Firebase Console.

## Step 2: Deploy Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `agnidhra-website-auth` 
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

## Step 3: Verify Rules

After deployment, the rules should allow:
- ✅ Public read access to `course_pricing` collection
- ✅ Authenticated users to read/write their own data
- ✅ Admin users to access everything
- ✅ Course pricing fetching without authentication errors

## Current Rules Summary

The rules in `firestore.rules` provide:

```javascript
// Course pricing - public read access
match /course_pricing/{courseId} {
  allow read: if true;  // This fixes the permission error
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

This will resolve the "Failed to fetch course pricing: FirebaseError: Missing or insufficient permissions" error.

## Verification

After deploying, test by:
1. Refreshing your website
2. Check browser console - the course pricing error should be gone
3. Admin dashboard should load course pricing properly