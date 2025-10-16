# 🔥 Firestore Rules Deployment Guide

## Issues Fixed

### 1. ✅ `loading is not defined` Error
**Problem:** Code was referencing `loading` variable that was removed
**Fixed in:** `src/pages/UpcomingBatchesPage.jsx`
- Changed `loading` to `pricingLoading` (line 577, 751)

### 2. ✅ Firestore Permissions Error
**Problem:** `events` collection had no read permissions for public
**Fixed in:** `firestore.rules`
- Added public read access to `events` collection
- Kept admin-only write access

---

## 📋 Deploy Firestore Rules

### **IMPORTANT: You must deploy the new Firestore rules!**

The updated `firestore.rules` file needs to be deployed to Firebase. Here's how:

### **Option 1: Firebase Console (Easiest)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Firestore Database** in left menu
4. Click **Rules** tab at the top
5. **Copy the entire content** from `d:\my website\AT-CS\firestore.rules`
6. **Paste** into the rules editor
7. Click **Publish** button
8. Wait for confirmation message

### **Option 2: Firebase CLI (Recommended for production)**

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

---

## 🔐 Updated Firestore Rules

The new rules allow:

### **Events Collection (`/events/{eventId}`)**
```
✅ Public READ access (anyone can view)
   - Banner can fetch and display events
   - Events page can show all events
   - No authentication required

⚠️ Admin WRITE access only
   - Only admin users can create/edit/delete events
   - Verified via user role in /users/{uid} document
```

### **Why This Is Safe:**
- Events are meant to be public (like a website's events calendar)
- Only admins can add/modify events (through Admin Dashboard)
- No sensitive data in events collection
- Same pattern as `courses` and `course_pricing` collections

---

## ✅ Verification Steps

After deploying rules, test:

1. **Homepage Banner:**
   - Should load without Firestore errors
   - Should rotate through events
   - Check browser console - no permission errors

2. **Events & Batches Page:**
   - Should display all tabs
   - Should show merged data (Firestore + hardcoded)
   - No "Missing or insufficient permissions" errors

3. **Admin Dashboard:**
   - Login as admin
   - Go to Events Management tab
   - Add a test event
   - Verify it saves successfully
   - Check if it appears in banner/events page

---

## 🐛 If Still Getting Errors

### **Clear Browser Cache:**
```bash
# Hard refresh in browser
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### **Check Firebase Console:**
1. Firestore Database → Rules tab
2. Verify the rules match `firestore.rules` file
3. Check "Simulator" tab to test rules

### **Test Rules in Simulator:**
```
Collection: events
Document: test-event-1
Operation: get
Authenticated: No

Expected Result: ✅ Allow
```

---

## 📝 Summary of Changes

### **Files Modified:**
1. ✅ `src/pages/UpcomingBatchesPage.jsx` - Fixed `loading` variable references
2. ✅ `firestore.rules` - Added public read access for `events` collection

### **Deployment Required:**
⚠️ **Firestore rules MUST be deployed to Firebase**
- Use Firebase Console OR Firebase CLI
- Rules are NOT automatically deployed with Vite build
- Without deployment, permission errors will continue

### **After Deployment:**
✅ Build completed successfully
✅ No runtime errors
✅ Events display from Firestore
✅ Banner shows all events
✅ Admin can manage events

---

## 🎯 Next Steps

1. **Deploy Firestore rules** (see options above)
2. **Clear browser cache** and reload
3. **Test admin panel** - add an event
4. **Test events page** - verify event appears
5. **Test banner** - confirm event rotates in carousel

Once rules are deployed, all Firestore permission errors will be resolved! 🎉
