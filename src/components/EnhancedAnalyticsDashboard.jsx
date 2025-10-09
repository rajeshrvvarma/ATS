import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  DollarSign,
  Calendar,
  Clock,
  Target,
  Zap,
  Eye,
  PlayCircle,
  CheckCircle,
  UserPlus,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Enhanced Analytics Dashboard Component
 * Provides comprehensive insights into student engagement, course performance, and business metrics
 */
export default function EnhancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const [activeMetric, setActiveMetric] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate comprehensive analytics from localStorage and mock data
      const data = await generateAnalyticsData(timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = async (range) => {
    // Load real data from localStorage
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const enrollments = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const studentActivity = JSON.parse(localStorage.getItem('student_activity') || '[]');
    
    // Calculate date range
    const now = new Date();
    const daysBack = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Filter data by time range
    const recentEnrollments = enrollments.filter(e => new Date(e.ts) >= startDate);
    const recentCertificates = certificates.filter(c => new Date(c.issuedDate) >= startDate);
    
    // Generate analytics
    return {
      // Overview metrics
      overview: {
        totalStudents: recentEnrollments.length,
        activeStudents: Math.floor(recentEnrollments.length * 0.8),
        totalRevenue: recentEnrollments.reduce((sum, e) => sum + (e.paymentAmount || 0), 0),
        coursesCompleted: recentCertificates.length,
        avgCompletionTime: 14, // days
        studentSatisfaction: 4.8, // out of 5
        conversionRate: 12.5, // percentage
        retentionRate: 87 // percentage
      },
      
      // Student engagement metrics
      engagement: {
        dailyActiveUsers: generateDailyData(daysBack, 15, 45),
        sessionDuration: generateDailyData(daysBack, 25, 65), // minutes
        videosWatched: generateDailyData(daysBack, 5, 25),
        quizAttempts: generateDailyData(daysBack, 2, 15),
        forumPosts: generateDailyData(daysBack, 1, 8),
        downloadCounts: generateDailyData(daysBack, 3, 12)
      },
      
      // Course performance
      coursePerformance: courses.map(course => ({
        id: course.id,
        name: course.title,
        enrollments: Math.floor(Math.random() * 50) + 10,
        completions: Math.floor(Math.random() * 30) + 5,
        avgRating: (Math.random() * 1.5 + 3.5).toFixed(1),
        revenue: Math.floor(Math.random() * 50000) + 10000,
        watchTime: Math.floor(Math.random() * 500) + 100, // hours
        completionRate: Math.floor(Math.random() * 40) + 60 // percentage
      })),
      
      // Revenue analytics
      revenue: {
        daily: generateDailyRevenueData(daysBack),
        bySource: {
          'Defensive Bootcamp': 45000,
          'Offensive Bootcamp': 38000,
          'Premium Programs': 42000,
          'Specialized Courses': 25000,
          'Corporate Training': 60000
        },
        monthlyRecurring: 15000,
        averageOrderValue: recentEnrollments.length > 0 ? 
          recentEnrollments.reduce((sum, e) => sum + (e.paymentAmount || 0), 0) / recentEnrollments.length : 0
      },
      
      // Learning paths analysis
      learningPaths: {
        popularPaths: [
          { name: 'SOC Analyst Career Path', students: 45, completion: 78 },
          { name: 'Ethical Hacker Track', students: 38, completion: 82 },
          { name: 'Security Consultant', students: 22, completion: 65 },
          { name: 'Penetration Tester', students: 31, completion: 71 }
        ],
        dropoffPoints: [
          { stage: 'Module 1', retention: 95 },
          { stage: 'Module 2', retention: 89 },
          { stage: 'Module 3', retention: 78 },
          { stage: 'Module 4', retention: 72 },
          { stage: 'Final Project', retention: 68 }
        ]
      },
      
      // Geographic data
      geographic: {
        topRegions: [
          { region: 'Hyderabad', students: 28, revenue: 45000 },
          { region: 'Bangalore', students: 22, revenue: 38000 },
          { region: 'Chennai', students: 18, revenue: 32000 },
          { region: 'Mumbai', students: 15, revenue: 28000 },
          { region: 'Delhi', students: 12, revenue: 22000 }
        ]
      },
      
      // Recent activity
      recentActivity: generateRecentActivity()
    };
  };

  // Helper function to generate daily data
  const generateDailyData = (days, min, max) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min
    }));
  };

  // Generate revenue data
  const generateDailyRevenueData = (days) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000) + 1000
    }));
  };

  // Generate recent activity
  const generateRecentActivity = () => {
    const activities = [
      'New student enrolled in SOC Bootcamp',
      'Certificate issued to John Doe',
      'Course "Advanced SIEM" completed by Jane Smith',
      'Payment received ₹2,999 for Ethical Hacking',
      'Student completed Module 3 of Defensive Security',
      'New review: 5 stars for SOC Analyst course',
      'Student downloaded lab materials',
      'Course progress: 78% completion in Bootcamp',
      'Certificate generated for completed course',
      'Student accessed video lesson: "Network Security"'
    ];
    
    return activities.slice(0, 8).map((activity, index) => ({
      id: index,
      activity,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString(),
      type: activity.includes('enrolled') ? 'enrollment' : 
            activity.includes('Certificate') ? 'certificate' : 
            activity.includes('Payment') ? 'payment' : 'activity'
    }));
  };

  // Export analytics data
  const exportAnalytics = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
          <p className="text-slate-400 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, engagement, coursePerformance, revenue, learningPaths, geographic, recentActivity } = analyticsData;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Enhanced Analytics Dashboard</h1>
            <p className="text-slate-400">Comprehensive insights into your cybersecurity training platform</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <button
              onClick={loadAnalyticsData}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={exportAnalytics}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Navigation */}
      <div className="bg-slate-800 px-6 py-3 border-b border-slate-700">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'engagement', label: 'Engagement', icon: Users },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'paths', label: 'Learning Paths', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveMetric(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeMetric === id 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Metrics */}
        {activeMetric === 'overview' && (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{overview?.totalStudents || 0}</span>
                </div>
                <h3 className="text-slate-400 text-sm">Total Students</h3>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+12% from last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    ₹{(overview?.totalRevenue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="text-slate-400 text-sm">Total Revenue</h3>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+24% from last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{overview?.coursesCompleted || 0}</span>
                </div>
                <h3 className="text-slate-400 text-sm">Courses Completed</h3>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+18% completion rate</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">{overview?.conversionRate || 0}%</span>
                </div>
                <h3 className="text-slate-400 text-sm">Conversion Rate</h3>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+3.2% improvement</span>
                </div>
              </motion.div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Student Satisfaction</h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-yellow-400">
                    {overview?.studentSatisfaction || 4.8}★
                  </div>
                  <div className="text-sm text-slate-400">
                    Based on course reviews<br/>
                    <span className="text-green-400">+0.3 from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Avg. Completion Time</h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-blue-400">
                    {overview?.avgCompletionTime || 14} days
                  </div>
                  <div className="text-sm text-slate-400">
                    Per course average<br/>
                    <span className="text-green-400">2 days faster</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Student Retention</h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-green-400">
                    {overview?.retentionRate || 87}%
                  </div>
                  <div className="text-sm text-slate-400">
                    90-day retention<br/>
                    <span className="text-green-400">+5% improvement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Analytics */}
        {activeMetric === 'engagement' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Student Engagement Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Active Users</h3>
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {engagement?.dailyActiveUsers?.slice(-1)[0]?.value || 0}
                </div>
                <p className="text-sm text-slate-400 mb-4">Users active today</p>
                {/* Simple chart representation */}
                <div className="flex items-end space-x-1 h-20">
                  {engagement?.dailyActiveUsers?.slice(-7).map((day, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t flex-1"
                      style={{ height: `${(day.value / 50) * 100}%` }}
                      title={`${day.date}: ${day.value} users`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Session Duration</h3>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {engagement?.sessionDuration?.slice(-1)[0]?.value || 0} min
                </div>
                <p className="text-sm text-slate-400 mb-4">Average session today</p>
                <div className="flex items-end space-x-1 h-20">
                  {engagement?.sessionDuration?.slice(-7).map((day, index) => (
                    <div
                      key={index}
                      className="bg-green-500 rounded-t flex-1"
                      style={{ height: `${(day.value / 70) * 100}%` }}
                      title={`${day.date}: ${day.value} minutes`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <PlayCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {engagement?.videosWatched?.slice(-1)[0]?.value || 0}
                </div>
                <p className="text-xs text-slate-400">Videos Watched Today</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {engagement?.quizAttempts?.slice(-1)[0]?.value || 0}
                </div>
                <p className="text-xs text-slate-400">Quiz Attempts Today</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {engagement?.forumPosts?.slice(-1)[0]?.value || 0}
                </div>
                <p className="text-xs text-slate-400">Forum Posts Today</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <Download className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {engagement?.downloadCounts?.slice(-1)[0]?.value || 0}
                </div>
                <p className="text-xs text-slate-400">Downloads Today</p>
              </div>
            </div>
          </div>
        )}

        {/* Course Performance */}
        {activeMetric === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Course Performance Analytics</h2>
            
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Enrollments</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Completions</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Revenue</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {coursePerformance?.map((course, index) => (
                      <tr key={course.id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{course.name}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{course.enrollments}</td>
                        <td className="px-6 py-4 text-slate-300">{course.completions}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400">{course.avgRating}★</span>
                        </td>
                        <td className="px-6 py-4 text-green-400">₹{course.revenue.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${course.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-300">{course.completionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Analytics */}
        {activeMetric === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Revenue Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue by Source</h3>
                <div className="space-y-3">
                  {revenue?.bySource && Object.entries(revenue.bySource).map(([source, amount]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-slate-300">{source}</span>
                      <span className="text-white font-medium">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Revenue Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      ₹{(revenue?.monthlyRecurring || 0).toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-slate-400">Monthly Recurring Revenue</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      ₹{Math.round(revenue?.averageOrderValue || 0).toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-slate-400">Average Order Value</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Paths */}
        {activeMetric === 'paths' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Learning Paths Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Learning Paths</h3>
                <div className="space-y-4">
                  {learningPaths?.popularPaths?.map((path, index) => (
                    <div key={index} className="border-b border-slate-700 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{path.name}</h4>
                        <span className="text-sm text-slate-400">{path.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${path.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-blue-400">{path.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Drop-off Analysis</h3>
                <div className="space-y-3">
                  {learningPaths?.dropoffPoints?.map((point, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-300">{point.stage}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${point.retention}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-300 w-10">{point.retention}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'enrollment' ? 'bg-blue-400' :
                    activity.type === 'certificate' ? 'bg-yellow-400' :
                    activity.type === 'payment' ? 'bg-green-400' : 'bg-slate-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.activity}</p>
                    <p className="text-slate-400 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}