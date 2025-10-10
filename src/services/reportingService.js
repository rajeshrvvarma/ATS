/**
 * Reporting System - Generate comprehensive reports and exports
 * Provides exportable insights, trend analysis, and performance comparisons
 */

import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class ReportingService {
  /**
   * Generate and export CSV report
   */
  static exportToCSV(data, filename = 'report.csv') {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      // Get headers from first row
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle commas and quotes in data
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
      
      return { success: true, message: 'CSV exported successfully' };
    } catch (error) {
      console.error('CSV export error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate comprehensive PDF report
   */
  static async exportToPDF(reportData, reportType = 'comprehensive') {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text('Agnidhra Cybersecurity - Analytics Report', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(127, 140, 141);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 20;

      // Report sections based on type
      switch (reportType) {
        case 'overview':
          yPos = this.addOverviewSection(doc, reportData, yPos, pageWidth);
          break;
        
        case 'users':
          yPos = this.addUsersSection(doc, reportData, yPos, pageWidth);
          break;
        
        case 'engagement':
          yPos = this.addEngagementSection(doc, reportData, yPos, pageWidth);
          break;
        
        case 'comprehensive':
        default:
          yPos = this.addOverviewSection(doc, reportData, yPos, pageWidth);
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }
          yPos = this.addUsersSection(doc, reportData, yPos, pageWidth);
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }
          yPos = this.addEngagementSection(doc, reportData, yPos, pageWidth);
          break;
      }

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(149, 165, 166);
        doc.text(
          `Page ${i} of ${totalPages} - Agnidhra Cybersecurity Analytics`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const filename = `agnidhra-analytics-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      return { success: true, message: 'PDF report generated successfully' };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add overview section to PDF
   */
  static addOverviewSection(doc, data, yPos, pageWidth) {
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Overview Analytics', 20, yPos);
    yPos += 15;

    if (data.overview) {
      const overviewData = [
        ['Total Users', data.overview.totalUsers?.toLocaleString() || '0'],
        ['Active Users (Last 30 Days)', data.overview.activeUsers?.toLocaleString() || '0'],
        ['Total Courses', data.overview.totalCourses?.toLocaleString() || '0'],
        ['Total Quizzes Completed', data.overview.totalQuizzes?.toLocaleString() || '0'],
        ['Average Session Duration', `${data.overview.avgSessionDuration || 0} minutes`],
        ['User Retention Rate', `${data.overview.retentionRate || 0}%`]
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: overviewData,
        theme: 'grid',
        headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [236, 240, 241] },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 20;
    }

    return yPos;
  }

  /**
   * Add users section to PDF
   */
  static addUsersSection(doc, data, yPos, pageWidth) {
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('User Analytics', 20, yPos);
    yPos += 15;

    if (data.users?.topUsers) {
      doc.setFontSize(12);
      doc.text('Top Performing Users', 20, yPos);
      yPos += 10;

      const userData = data.users.topUsers.slice(0, 10).map((user, index) => [
        `${index + 1}`,
        user.email || 'Unknown',
        user.totalPoints?.toLocaleString() || '0',
        user.level || '1',
        user.quizzesCompleted || '0',
        user.currentStreak || '0'
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Rank', 'User', 'Points', 'Level', 'Quizzes', 'Streak']],
        body: userData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [235, 245, 251] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 }
      });

      yPos = doc.lastAutoTable.finalY + 20;
    }

    return yPos;
  }

  /**
   * Add engagement section to PDF
   */
  static addEngagementSection(doc, data, yPos, pageWidth) {
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Engagement Analytics', 20, yPos);
    yPos += 15;

    if (data.engagement) {
      const engagementData = [
        ['Daily Active Users (Avg)', data.engagement.dailyActiveUsers?.toLocaleString() || '0'],
        ['Weekly Active Users (Avg)', data.engagement.weeklyActiveUsers?.toLocaleString() || '0'],
        ['Average Study Time per User', `${data.engagement.avgStudyTime || 0} minutes`],
        ['Quiz Completion Rate', `${data.engagement.quizCompletionRate || 0}%`],
        ['Course Completion Rate', `${data.engagement.courseCompletionRate || 0}%`],
        ['User Engagement Score', `${data.engagement.engagementScore || 0}/100`]
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: engagementData,
        theme: 'grid',
        headStyles: { fillColor: [46, 204, 113], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [232, 249, 233] },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 20;
    }

    return yPos;
  }

  /**
   * Generate trend analysis report
   */
  static generateTrendAnalysis(historicalData, timeframe = '30d') {
    try {
      if (!historicalData || historicalData.length < 2) {
        return { success: false, message: 'Insufficient data for trend analysis' };
      }

      const analysis = {
        timeframe,
        trends: {},
        insights: [],
        recommendations: []
      };

      // Analyze different metrics
      const metrics = ['totalUsers', 'activeUsers', 'totalQuizzes', 'avgSessionDuration'];
      
      metrics.forEach(metric => {
        const values = historicalData.map(data => data[metric] || 0);
        const trend = this.calculateTrend(values);
        
        analysis.trends[metric] = {
          direction: trend.direction,
          percentage: trend.percentage,
          current: values[values.length - 1],
          previous: values[values.length - 2] || 0
        };

        // Generate insights
        if (Math.abs(trend.percentage) > 10) {
          const direction = trend.direction === 'up' ? 'increased' : 'decreased';
          analysis.insights.push(
            `${metric.replace(/([A-Z])/g, ' $1').toLowerCase()} has ${direction} by ${Math.abs(trend.percentage).toFixed(1)}% over the ${timeframe}`
          );
        }
      });

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis.trends);

      return { success: true, data: analysis };
    } catch (error) {
      console.error('Trend analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate trend direction and percentage
   */
  static calculateTrend(values) {
    if (values.length < 2) return { direction: 'neutral', percentage: 0 };

    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    
    if (previous === 0) return { direction: 'neutral', percentage: 0 };

    const percentage = ((current - previous) / previous) * 100;
    const direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';

    return { direction, percentage };
  }

  /**
   * Generate recommendations based on trends
   */
  static generateRecommendations(trends) {
    const recommendations = [];

    // User growth recommendations
    if (trends.totalUsers?.direction === 'down') {
      recommendations.push('Consider implementing user acquisition campaigns to reverse declining user growth');
    } else if (trends.totalUsers?.percentage > 20) {
      recommendations.push('Excellent user growth! Ensure infrastructure can handle increased load');
    }

    // Engagement recommendations
    if (trends.activeUsers?.direction === 'down') {
      recommendations.push('Implement engagement initiatives like gamification or personalized content');
    }

    if (trends.avgSessionDuration?.direction === 'down') {
      recommendations.push('Review content quality and user experience to improve session duration');
    }

    // Quiz performance recommendations
    if (trends.totalQuizzes?.direction === 'down') {
      recommendations.push('Consider adding incentives for quiz completion or reviewing quiz difficulty');
    }

    return recommendations;
  }

  /**
   * Generate performance comparison report
   */
  static generatePerformanceComparison(currentData, previousData, comparisonType = 'period') {
    try {
      const comparison = {
        type: comparisonType,
        current: currentData,
        previous: previousData,
        changes: {},
        summary: {
          improved: 0,
          declined: 0,
          unchanged: 0
        }
      };

      // Compare key metrics
      const metrics = Object.keys(currentData).filter(key => 
        typeof currentData[key] === 'number' && typeof previousData[key] === 'number'
      );

      metrics.forEach(metric => {
        const current = currentData[metric];
        const previous = previousData[metric];
        const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

        comparison.changes[metric] = {
          current,
          previous,
          absolute: current - previous,
          percentage: change,
          status: change > 0 ? 'improved' : change < 0 ? 'declined' : 'unchanged'
        };

        // Update summary
        if (change > 0) comparison.summary.improved++;
        else if (change < 0) comparison.summary.declined++;
        else comparison.summary.unchanged++;
      });

      return { success: true, data: comparison };
    } catch (error) {
      console.error('Performance comparison error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export gamification leaderboard
   */
  static async exportLeaderboard(leaderboardData, category = 'points') {
    try {
      const filename = `leaderboard-${category}-${new Date().toISOString().split('T')[0]}.csv`;
      
      const csvData = leaderboardData.map((user, index) => ({
        rank: index + 1,
        email: user.email,
        points: user.totalPoints || 0,
        level: user.level || 1,
        xp: user.totalXP || 0,
        streak: user.currentStreak || 0,
        quizzes: user.statistics?.quizzesCompleted || 0,
        achievements: user.achievements?.length || 0
      }));

      return this.exportToCSV(csvData, filename);
    } catch (error) {
      console.error('Leaderboard export error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate automated insights from analytics data
   */
  static generateAutomatedInsights(analyticsData) {
    const insights = [];

    try {
      // User engagement insights
      if (analyticsData.overview?.activeUsers && analyticsData.overview?.totalUsers) {
        const engagementRate = (analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100;
        
        if (engagementRate > 70) {
          insights.push({
            type: 'positive',
            category: 'engagement',
            message: `Excellent user engagement! ${engagementRate.toFixed(1)}% of users are active.`,
            priority: 'high'
          });
        } else if (engagementRate < 30) {
          insights.push({
            type: 'warning',
            category: 'engagement',
            message: `Low user engagement at ${engagementRate.toFixed(1)}%. Consider implementing retention strategies.`,
            priority: 'high'
          });
        }
      }

      // Quiz performance insights
      if (analyticsData.quizzes?.averageScore) {
        const avgScore = analyticsData.quizzes.averageScore;
        
        if (avgScore > 80) {
          insights.push({
            type: 'positive',
            category: 'learning',
            message: `Students are performing well with an average quiz score of ${avgScore.toFixed(1)}%.`,
            priority: 'medium'
          });
        } else if (avgScore < 60) {
          insights.push({
            type: 'warning',
            category: 'learning',
            message: `Average quiz score is ${avgScore.toFixed(1)}%. Consider reviewing content difficulty or providing additional support.`,
            priority: 'high'
          });
        }
      }

      // Growth insights
      if (analyticsData.growth?.userGrowthRate) {
        const growthRate = analyticsData.growth.userGrowthRate;
        
        if (growthRate > 10) {
          insights.push({
            type: 'positive',
            category: 'growth',
            message: `Strong user growth at ${growthRate.toFixed(1)}% this period.`,
            priority: 'medium'
          });
        } else if (growthRate < 0) {
          insights.push({
            type: 'warning',
            category: 'growth',
            message: `User growth is negative at ${growthRate.toFixed(1)}%. Immediate action required.`,
            priority: 'critical'
          });
        }
      }

      return { success: true, insights };
    } catch (error) {
      console.error('Automated insights error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ReportingService;