# Google Authentication Setup Guide

## Firebase Console Setup (Required)

You need to enable Google authentication in your Firebase project:

### 1. Enable Google Sign-In in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `agnidhra-website-auth`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** in the providers list
5. Toggle **Enable** to ON
6. Set the project support email (required)
7. Click **Save**

### 2. Configure OAuth Consent Screen (Google Cloud Console)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in required fields:
   - App name: "AT-CS Learning Platform"
   - User support email: your email
   - Developer contact information: your email
5. Add authorized domains if needed
6. Save configuration

### 3. OAuth Client Configuration
Firebase automatically creates OAuth credentials, but you can customize:
1. In Google Cloud Console → **APIs & Services** → **Credentials**
2. Find the OAuth 2.0 client created by Firebase
3. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-domain.com` (for production)
4. Add authorized redirect URIs:
   - `https://agnidhra-website-auth.firebaseapp.com/__/auth/handler`

## Testing Google Login

### For Development:
1. Start your dev server: `npm run dev`
2. Navigate to login page
3. Click "Continue with Google"
4. Complete Google sign-in flow
5. Check Firestore `users` collection for new user

### For Production:
1. Deploy to your hosting platform
2. Update authorized domains in OAuth consent screen
3. Test the flow end-to-end

## User Data Structure

When users sign in with Google, they'll be created in Firestore with:

```javascript
{
  studentId: "ST1728123456ABCD",
  email: "user@gmail.com",
  name: "User Name",
  role: "student", // Default role
  provider: "google",
  status: "active",
  profile: {
    avatar: "https://google-photo-url",
    bio: "",
    location: "",
    socialLinks: {}
  },
  courseProgress: { /* ... */ },
  certificates: [],
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

## Admin Role Assignment

To make a Google user an admin:
1. User signs in with Google (creates Firestore record)
2. Go to Firestore console
3. Find the user in `users` collection
4. Edit the document
5. Change `role` field from `"student"` to `"admin"`
6. User will have admin access on next login

## Troubleshooting

### Common Issues:
- **Popup blocked**: Browser blocking popup windows
- **Domain not authorized**: Add domain to OAuth settings
- **Consent screen not configured**: Complete OAuth consent setup
- **Wrong project**: Ensure Firebase project matches Google Cloud project

### Error Messages:
- `auth/popup-blocked`: Enable popups or use redirect method
- `auth/unauthorized-domain`: Add domain to authorized origins
- `auth/configuration-not-found`: Complete Firebase Authentication setup