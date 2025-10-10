/**
 * Admin Analytics Dashboard - Comprehensive analytics interface for administrators
 * Displays student performance, engagement metrics, course analytics, and trends
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart, DoughnutChart, MetricCard } from '@/components/DataVisualization.jsx';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Star,
  Brain,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Award,
  Zap,
  Activity,
  X
} from 'lucide-react';

const AdminAnalytics = ({ onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Time period options
  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last_7_days', label: 'Last 7 Days' },
    { id: 'last_30_days', label: 'Last 30 Days' },
    { id: 'last_90_days', label: 'Last 90 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'this_year', label: 'This Year' }
  ];

  // Tab options
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'engagement', label: 'Engagement', icon: Activity },
    { id: 'quizzes', label: 'Quizzes', icon: Brain }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { getOverviewAnalytics } = await import('@/services/analyticsService.js');
      const result = await getOverviewAnalytics(selectedPeriod);
      
      if (result.success) {
        setAnalytics(result.data);
      } else {
        console.error('Failed to load analytics:', result.error);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const handleExport = async () => {
    try {
      const { exportAnalyticsData } = await import('@/services/analyticsService.js');
      const result = await exportAnalyticsData(selectedPeriod, 'json');
      
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">Loading Analytics</h3>
            <p className="text-slate-400">Gathering insights from your LMS data...</p>
          </div>
        </div>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue', trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-slate-400 text-sm">{title}</div>
      </div>
      
      {change && (
        <div className="text-xs text-slate-500">
          {change}
        </div>
      )}
    </motion.div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={analytics?.overview?.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          color="blue"
          trend={12}
          change="vs previous period"
        />
        <MetricCard
          title="Active Students"
          value={analytics?.overview?.activeUsers?.toLocaleString() || '0'}
          icon={Activity}
          color="green"
          trend={8}
          change={`${Math.round(analytics?.overview?.retentionRate || 0)}% retention rate`}
        />
        <MetricCard
          title="Course Enrollments"
          value={analytics?.overview?.totalEnrollments?.toLocaleString() || '0'}
          icon={BookOpen}
          color="purple"
          trend={15}
          change="new enrollments"
        />
        <MetricCard
          title="Quiz Completions"
          value={analytics?.overview?.totalQuizzes?.toLocaleString() || '0'}
          icon={Brain}
          color="yellow"
          trend={-3}
          change="completion rate"
        />
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Daily Activity</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {analytics?.dailyData?.slice(0, 14).reverse().map((day, index) => {
            const height = Math.max(((day.totalEnrollments || 0) / 10) * 100, 5);
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t w-full min-h-[8px]"
                />
                <div className="text-xs text-slate-400 mt-2 transform rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Average Level</span>
              <span className="text-white font-semibold">
                {analytics?.overview?.averageLevel?.toFixed(1) || '1.0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total XP Earned</span>
              <span className="text-white font-semibold">
                {analytics?.overview?.totalXP?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Achievements Unlocked</span>
              <span className="text-white font-semibold">
                {analytics?.overview?.totalAchievements?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Avg Session Time</span>
              <span className="text-white font-semibold">
                {analytics?.engagement?.averageSessionTime || 0}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Peak Activity Hour</span>
              <span className="text-white font-semibold">
                {analytics?.engagement?.mostActiveHour || 0}:00
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Events</span>
              <span className="text-white font-semibold">
                {analytics?.engagement?.totalEvents?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="New Users"
          value={analytics?.overview?.newUsers?.toLocaleString() || '0'}
          icon={Users}
          color="green"
          change="this period"
        />
        <MetricCard
          title="Retention Rate"
          value={`${Math.round(analytics?.overview?.retentionRate || 0)}%`}
          icon={Target}
          color="blue"
          change="active vs total"
        />
        <MetricCard
          title="Average Level"
          value={analytics?.overview?.averageLevel?.toFixed(1) || '1.0'}
          icon={Star}
          color="yellow"
          change="user progression"
        />
      </div>

      {/* Level Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Level Distribution</h3>
        <div className="space-y-3">
          {Object.entries(analytics?.overview?.levelDistribution || {})
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, count]) => {
              const percentage = analytics?.overview?.totalUsers > 0 
                ? (count / analytics.overview.totalUsers) * 100 
                : 0;
              
              return (
                <div key={level} className="flex items-center gap-4">
                  <div className="w-16 text-slate-300 text-sm">Level {level}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: parseInt(level) * 0.1 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                    />
                  </div>
                  <div className="w-12 text-white text-sm font-semibold">{count}</div>
                  <div className="w-12 text-slate-400 text-xs">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderCoursesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Total Enrollments"
          value={analytics?.overview?.totalEnrollments?.toLocaleString() || '0'}
          icon={BookOpen}
          color="purple"
          change="all time"
        />
        <MetricCard
          title="Completion Rate"
          value={`${Math.round(analytics?.courses?.completionRate || 0)}%`}
          icon={Trophy}
          color="green"
          change="average across all courses"
        />
      </div>

      {/* Top Performing Courses */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Top Performing Courses</h3>
        <div className="space-y-3">
          {analytics?.courses?.topCourses?.slice(0, 8).map((course, index) => (
            <div key={course.courseId} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-semibold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{course.courseId}</div>
                  <div className="text-slate-400 text-sm">{course.enrollments} enrollments</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-semibold">
                  {Math.round(course.completionRate)}%
                </div>
                <div className="text-slate-400 text-sm">completion</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuizzesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Attempts"
          value={analytics?.courses?.quizMetrics?.totalAttempts?.toLocaleString() || '0'}
          icon={Brain}
          color="blue"
          change="all quizzes"
        />
        <MetricCard
          title="Average Score"
          value={`${analytics?.courses?.quizMetrics?.averageScore?.toFixed(1) || '0'}%`}
          icon={Target}
          color="green"
          change="across all attempts"
        />
        <MetricCard
          title="Perfect Scores"
          value={`${analytics?.courses?.quizMetrics?.perfectScoreRate?.toFixed(1) || '0'}%`}
          icon={Award}
          color="yellow"
          change="100% completion rate"
        />
      </div>

      {/* Score Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Score Distribution</h3>
        <div className="space-y-3">
          {Object.entries(analytics?.courses?.quizMetrics?.scoreDistribution || {})
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([scoreRange, count]) => {
              const total = Object.values(analytics?.courses?.quizMetrics?.scoreDistribution || {})
                .reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={scoreRange} className="flex items-center gap-4">
                  <div className="w-20 text-slate-300 text-sm">{scoreRange}-{parseInt(scoreRange) + 9}%</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                    />
                  </div>
                  <div className="w-12 text-white text-sm font-semibold">{count}</div>
                  <div className="w-16 text-slate-400 text-xs">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Events"
          value={analytics?.engagement?.totalEvents?.toLocaleString() || '0'}
          icon={Activity}
          color="purple"
          change="tracked interactions"
        />
        <MetricCard
          title="Unique Users"
          value={analytics?.engagement?.uniqueUsers?.toLocaleString() || '0'}
          icon={Users}
          color="blue"
          change="active participants"
        />
        <MetricCard
          title="Avg Session Time"
          value={`${analytics?.engagement?.averageSessionTime || '0'}m`}
          icon={Clock}
          color="green"
          change="per session"
        />
      </div>

      {/* Hourly Activity */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Activity by Hour</h3>
        <div className="flex items-end justify-between gap-1 h-32">
          {analytics?.engagement?.eventsByHour?.map((count, hour) => {
            const maxCount = Math.max(...(analytics?.engagement?.eventsByHour || [1]));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={hour} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: hour * 0.02 }}
                  className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t w-full min-h-[2px]"
                  title={`${hour}:00 - ${count} events`}
                />
                <div className="text-xs text-slate-400 mt-1">
                  {hour % 4 === 0 ? hour : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <p className="text-indigo-100">Comprehensive learning insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {timePeriods.map(period => (
                <option key={period.id} value={period.id} className="bg-slate-800 text-white">
                  {period.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExport}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 border-b border-slate-700 px-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-slate-400">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'users' && renderUsersTab()}
              {activeTab === 'courses' && renderCoursesTab()}
              {activeTab === 'engagement' && renderEngagementTab()}
              {activeTab === 'quizzes' && renderQuizzesTab()}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;