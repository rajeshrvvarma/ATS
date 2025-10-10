# 🔧 Quick Development Reference

## 🚀 **Essential Commands**
```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build

# Firebase
firebase login          # Login to Firebase CLI
firebase deploy         # Deploy Firebase functions (if any)
```

## 📁 **Key File Locations**
```
src/
├── components/         # React components
│   ├── Header.jsx     # Main navigation (✅ Working)
│   ├── Quiz.jsx       # Quiz system (✅ Complete)
│   ├── Leaderboard.jsx # Gamification (✅ Complete)
│   └── *Analytics.jsx # Analytics dashboards (✅ Complete)
├── pages/             # Main pages
├── services/          # Backend services
│   ├── gamificationService.js  # Points/XP system (✅ Complete)
│   ├── analyticsService.js     # Analytics backend (✅ Complete)
│   └── quizService.js          # Quiz functionality (✅ Complete)
├── context/           # React contexts
└── data/              # Static data
```

## 🎯 **Current Status**
- ✅ **4 Features Complete**: Email, Quiz, Gamification, Analytics
- 🔧 **Header Fixed**: Navigation working properly
- 📊 **Analytics Active**: Real-time student tracking
- 🎮 **Gamification Live**: Points, levels, achievements working

## 🤖 **Next Priority: Feature 5 - AI Career Guidance**
**Estimated Time**: 3-4 days  
**Impact**: Premium revenue + competitive advantage  
**Technical**: Free AI APIs (Gemini, GPT-3.5)

## 🔍 **Troubleshooting**
- **Header not showing**: Check responsive classes (`hidden md:flex`)
- **Build fails**: Check console for missing imports
- **Firebase errors**: Verify environment variables in Netlify
- **Payment issues**: Check Razorpay configuration

## 📊 **Analytics Dashboard Access**
- **Admin**: Login → Admin Dashboard → Analytics Tab
- **Student**: Login → Student Dashboard → "My Analytics" button

## 🎮 **Gamification Features**
- **Points**: Automatic for quizzes, videos, logins
- **Levels**: 10 levels (Novice → Security Guru)  
- **Achievements**: 8 unlockable achievements
- **Leaderboard**: 5 categories with real-time updates

---
*Last Updated: October 10, 2025*