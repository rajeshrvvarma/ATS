import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Star,
  Brain,
  Trophy,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

/**
 * StudentProfile - Comprehensive student profile management
 * Handles profile editing, progress tracking, achievements, and settings
 */
export default function StudentProfile({ onNavigate, onClose }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    learningGoals: '',
    specializations: [],
    joinDate: user?.joinDate || new Date().toISOString(),
    profileImage: null
  });
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    currentStreak: 0,
    longestStreak: 0,
    skillLevel: 'Beginner',
    achievements: [],
    quizzes: {
      totalAttempted: 0,
      totalCompleted: 0,
      bestScore: 0,
      averageScore: 0,
      totalTime: 0
    },
    gamification: {
      totalPoints: 0,
      totalXP: 0,
      level: 1,
      levelTitle: 'Novice Explorer',
      progressToNext: 0,
      xpToNext: 0,
      rank: null,
      unlockedAchievements: []
    }
  });

  const [achievements] = useState([
    {
      id: 'first_course',
      title: 'First Steps',
      description: 'Enrolled in your first course',
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 'streak_7',
      title: '7-Day Streak',
      description: 'Maintained a 7-day learning streak',
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      earned: false
    },
    {
      id: 'first_cert',
      title: 'Certified',
      description: 'Earned your first certificate',
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      earned: false
    },
    {
      id: 'expert_level',
      title: 'Expert',
      description: 'Reached expert skill level',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      earned: false
    }
  ]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    // Load from localStorage or user data
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      setProfileData({ ...profileData, ...JSON.parse(savedProfile) });
    }

    // Load stats from enrollments and progress
    const enrollments = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    // Calculate total learning time from course progress
    let totalHours = 0;
    let completedCourses = 0;
    
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.forEach(course => {
      const progress = localStorage.getItem(`course_progress_${course.id}`);
      if (progress) {
        const progressData = JSON.parse(progress);
        const courseHours = course.lessons?.reduce((sum, lesson) => {
          const [minutes] = (lesson.duration || '10:00').split(':').map(Number);
          return sum + minutes / 60;
        }, 0) || 1;
        
        totalHours += courseHours * (progressData.courseProgress / 100);
        if (progressData.courseProgress >= 100) completedCourses++;
      }
    });

    // Load quiz statistics
    const quizStats = await loadQuizStats();
    
    // Load gamification data
    const gamificationStats = await loadGamificationStats();

    setStats({
      totalCourses: enrollments.length,
      completedCourses,
      totalHours,
      certificates: certificates.length,
      currentStreak: gamificationStats.currentStreak || 0,
      longestStreak: gamificationStats.longestStreak || 0,
      skillLevel: getSkillLevel(totalHours, completedCourses),
      achievements: achievements.filter(a => a.earned),
      quizzes: quizStats,
      gamification: gamificationStats
    });
  };

  const loadQuizStats = async () => {
    try {
      if (!user?.email) return {
        totalAttempted: 0,
        totalCompleted: 0,
        bestScore: 0,
        averageScore: 0,
        totalTime: 0
      };

      const { getUserQuizProgress } = await import('@/services/quizService.js');
      const result = await getUserQuizProgress(user.email);
      
      if (result.success && result.data) {
        const progress = result.data;
        return {
          totalAttempted: progress.length,
          totalCompleted: progress.filter(p => p.completed).length,
          bestScore: progress.length > 0 ? Math.max(...progress.map(p => p.bestScore || 0)) : 0,
          averageScore: progress.length > 0 ? 
            Math.round(progress.reduce((sum, p) => sum + (p.bestScore || 0), 0) / progress.length) : 0,
          totalTime: Math.round(progress.reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0) / 60) // Convert to minutes
        };
      }
    } catch (error) {
      console.error('Error loading quiz stats:', error);
    }
    
    return {
      totalAttempted: 0,
      totalCompleted: 0,
      bestScore: 0,
      averageScore: 0,
      totalTime: 0
    };
  };

  const loadGamificationStats = async () => {
    try {
      if (!user?.email) return {
        totalPoints: 0,
        totalXP: 0,
        level: 1,
        levelTitle: 'Novice Explorer',
        progressToNext: 0,
        xpToNext: 0,
        currentStreak: 0,
        longestStreak: 0,
        rank: null,
        unlockedAchievements: []
      };

      const { getUserStats, getLevelInfo } = await import('@/services/gamificationService.js');
      const result = await getUserStats(user.email);
      
      if (result.success && result.data) {
        const data = result.data;
        const levelInfo = getLevelInfo(data.totalXP);
        
        return {
          totalPoints: data.totalPoints || 0,
          totalXP: data.totalXP || 0,
          level: data.level || 1,
          levelTitle: levelInfo.currentLevel?.title || 'Novice Explorer',
          progressToNext: levelInfo.progressToNext || 0,
          xpToNext: levelInfo.xpToNext || 0,
          currentStreak: data.currentStreak || 0,
          longestStreak: data.longestStreak || 0,
          rank: data.rank,
          unlockedAchievements: data.achievements || []
        };
      }
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    }
    
    return {
      totalPoints: 0,
      totalXP: 0,
      level: 1,
      levelTitle: 'Novice Explorer',
      progressToNext: 0,
      xpToNext: 0,
      currentStreak: 0,
      longestStreak: 0,
      rank: null,
      unlockedAchievements: []
    };
  };

  const getSkillLevel = (hours, completed) => {
    if (completed >= 5 && hours >= 50) return 'Expert';
    if (completed >= 3 && hours >= 25) return 'Advanced';
    if (completed >= 1 && hours >= 10) return 'Intermediate';
    return 'Beginner';
  };

  const handleSave = () => {
    localStorage.setItem('studentProfile', JSON.stringify(profileData));
    setIsEditing(false);
    // In a real app, this would sync with the backend
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
              <p className="text-sky-100">{stats.skillLevel} Level Student</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Profile Information */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white mt-1">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm">Email</label>
                    <p className="text-white mt-1">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm">Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="text-white mt-1">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        placeholder="City, Country"
                      />
                    ) : (
                      <p className="text-white mt-1">{profileData.location || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-white mt-1">{profileData.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Learning Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-sky-400">{stats.totalCourses}</div>
                    <div className="text-slate-400 text-sm">Enrolled Courses</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.completedCourses}</div>
                    <div className="text-slate-400 text-sm">Completed</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{Math.round(stats.totalHours)}h</div>
                    <div className="text-slate-400 text-sm">Learning Time</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.certificates}</div>
                    <div className="text-slate-400 text-sm">Certificates</div>
                  </div>
                </div>
              </div>

              {/* Quiz Statistics */}
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Quiz Performance</h3>
                  <button
                    onClick={() => onNavigate && onNavigate('quiz-library')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Brain className="w-4 h-4" />
                    Take Quiz
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-400">{stats.quizzes.totalAttempted}</div>
                    <div className="text-slate-400 text-sm">Quizzes Attempted</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.quizzes.totalCompleted}</div>
                    <div className="text-slate-400 text-sm">Completed</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.quizzes.bestScore}%</div>
                    <div className="text-slate-400 text-sm">Best Score</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{stats.quizzes.averageScore}%</div>
                    <div className="text-slate-400 text-sm">Average Score</div>
                  </div>
                </div>
                {stats.quizzes.totalTime > 0 && (
                  <div className="mt-4 p-3 bg-slate-700 rounded-lg text-center">
                    <div className="text-lg font-bold text-cyan-400">{stats.quizzes.totalTime}m</div>
                    <div className="text-slate-400 text-sm">Total Quiz Time</div>
                  </div>
                )}
              </div>

              {/* Gamification Stats */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Level & Progress</h3>
                
                {/* Level Display */}
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">Level {stats.gamification.level}</div>
                        <div className="text-purple-300 text-sm">{stats.gamification.levelTitle}</div>
                      </div>
                    </div>
                    {stats.gamification.rank && (
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Rank</div>
                        <div className="text-lg font-bold text-purple-400">#{stats.gamification.rank}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* XP Progress Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                      <span>Progress to Next Level</span>
                      <span>{stats.gamification.totalXP.toLocaleString()} XP</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(stats.gamification.progressToNext, 5)}%` }}
                      />
                    </div>
                    {stats.gamification.xpToNext > 0 && (
                      <div className="text-xs text-slate-500 mt-1 text-center">
                        {stats.gamification.xpToNext} XP to next level
                      </div>
                    )}
                  </div>
                </div>

                {/* Points Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.gamification.totalPoints.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">Total Points</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{stats.gamification.longestStreak}</div>
                    <div className="text-slate-400 text-sm">Longest Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements and Progress */}
            <div className="space-y-6">
              
              {/* Achievements */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          achievement.earned 
                            ? 'bg-slate-700 border border-slate-600' 
                            : 'bg-slate-900 border border-slate-700 opacity-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                          <Icon className={`w-6 h-6 ${achievement.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{achievement.title}</h4>
                          <p className="text-slate-400 text-sm">{achievement.description}</p>
                          {achievement.earned && achievement.earnedDate && (
                            <p className="text-slate-500 text-xs mt-1">
                              Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {achievement.earned && (
                          <Award className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skill Level Progress */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Skill Progression</h3>
                <div className="space-y-4">
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level, index) => (
                    <div key={level} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        ['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(stats.skillLevel) >= index
                          ? 'bg-sky-500' : 'bg-slate-600'
                      }`} />
                      <span className={`${
                        stats.skillLevel === level ? 'text-sky-400 font-semibold' : 'text-slate-400'
                      }`}>
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Progress to Next Level</span>
                    <span className="text-sky-400">75%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}