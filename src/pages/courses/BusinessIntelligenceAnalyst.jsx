import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { BarChart, Database, TrendingUp, Eye, PieChart, Filter, Globe, Target } from 'lucide-react';

const BusinessIntelligenceAnalyst = () => {
  const courseData = {
    title: "Business Intelligence Analyst",
    subtitle: "Business Analytics with Power BI, Tableau & Advanced SQL",
    description: "Become a skilled Business Intelligence Analyst with comprehensive training in data analytics, visualization, and business intelligence tools. Learn to transform raw data into actionable business insights using industry-standard BI platforms.",
    category: "technology",
    courseId: "business-intelligence-analyst",

    keyBenefits: [
      "Master business intelligence tools",
      "Learn advanced data visualization",
      "Build interactive dashboards",
      "Develop data-driven insights",
      "High-demand BI analyst career"
    ],

    duration: "3 Months",
    level: "Beginner to Intermediate",
    price: "₹18,000",
    originalPrice: "₹25,000",

    batchInfo: {
      date: "15th January 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Database,
        title: "Advanced SQL",
        description: "Master complex queries, database design, and data modeling"
      },
      {
        icon: BarChart,
        title: "Power BI Mastery",
        description: "Create interactive dashboards and business reports"
      },
      {
        icon: Eye,
        title: "Tableau Visualization",
        description: "Build compelling data visualizations and stories"
      },
      {
        icon: TrendingUp,
        title: "Business Strategy",
        description: "Translate data insights into business recommendations"
      }
    ],

    features: [
      {
        title: "Advanced SQL & Database Design",
        description: "Master complex SQL queries, stored procedures, and database optimization techniques"
      },
      {
        title: "Power BI Development",
        description: "Create interactive dashboards, reports, and automated data refresh systems"
      },
      {
        title: "Tableau Data Visualization",
        description: "Build compelling visualizations, stories, and interactive analytics"
      },
      {
        title: "Excel Advanced Analytics",
        description: "Advanced Excel functions, pivot tables, and data analysis techniques"
      },
      {
        title: "Data Warehousing",
        description: "Understand data warehouse concepts, ETL processes, and OLAP systems"
      },
      {
        title: "Business Strategy",
        description: "Learn to translate data insights into actionable business recommendations"
      }
    ],

    skills: [
      "Advanced SQL",
      "Power BI",
      "Tableau",
      "Excel Advanced",
      "Data Modeling",
      "ETL Processes",
      "Dashboard Design",
      "Business Analysis",
      "Data Visualization",
      "KPI Development",
      "Report Automation",
      "Statistical Analysis"
    ],

    curriculum: [
      {
        title: "Data Fundamentals",
        topics: [
          "Data Types & Structures",
          "Database Concepts",
          "Business Intelligence Overview",
          "Analytics Lifecycle"
        ]
      },
      {
        title: "Advanced SQL",
        topics: [
          "Complex Query Writing",
          "Joins & Subqueries",
          "Stored Procedures",
          "Performance Optimization"
        ]
      },
      {
        title: "Data Modeling",
        topics: [
          "Dimensional Modeling",
          "Star & Snowflake Schema",
          "Data Relationships",
          "Normalization"
        ]
      },
      {
        title: "Power BI Development",
        topics: [
          "Power BI Desktop",
          "Data Connections",
          "DAX Functions",
          "Interactive Dashboards"
        ]
      },
      {
        title: "Tableau Mastery",
        topics: [
          "Tableau Desktop",
          "Calculated Fields",
          "Advanced Charts",
          "Story Creation"
        ]
      },
      {
        title: "Excel Advanced Analytics",
        topics: [
          "Advanced Functions",
          "Pivot Tables",
          "Power Query",
          "Statistical Analysis"
        ]
      },
      {
        title: "Data Warehousing",
        topics: [
          "ETL Processes",
          "Data Integration",
          "OLAP Concepts",
          "Performance Tuning"
        ]
      },
      {
        title: "Business Intelligence Strategy",
        topics: [
          "KPI Development",
          "Business Metrics",
          "Stakeholder Communication",
          "Project Management"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹18,000",
        type: "standard",
        popular: true,
        features: [
          "3 Months Comprehensive Training",
          "5+ Business Projects",
          "Power BI & Tableau Certification",
          "Industry Dataset Practice",
          "Job Placement Assistance",
          "Business-focused Approach",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "Senior BI Analyst",
        price: "₹32,000",
        type: "advanced",
        features: [
          "5 Months Extended Program",
          "Advanced Analytics Techniques",
          "Data Science Integration",
          "Leadership Training",
          "1-on-1 BI Expert Mentoring",
          "Guaranteed Senior Position",
          "Multiple BI Certifications"
        ]
      }
    ],

    prerequisites: "Basic database knowledge and Excel proficiency are required. Understanding of business processes is helpful. No prior BI experience needed as we cover everything from fundamentals. Strong analytical thinking and attention to detail are essential.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "Business and Finance Professionals",
      "Data analysts and researchers",
      "Fresh graduates interested in analytics",
      "Working professionals seeking BI skills"
    ],

    testimonials: [
      {
        name: "Ramesh Patel",
        role: "BI Analyst at Flipkart",
        content: "The BI course was perfect for transitioning from finance to analytics. The Power BI and Tableau training was comprehensive with real business scenarios. Now working as BI analyst at Flipkart with excellent growth prospects!"
      },
      {
        name: "Priyanka Joshi",
        role: "Data Analyst at Uber",
        content: "Excellent course covering the entire BI landscape. The business-focused approach and industry projects helped me understand how to translate data into business value. Got promoted to senior analyst role after this course."
      },
      {
        name: "Anil Kumar",
        role: "BI Manager at Zomato",
        content: "The hands-on training with real datasets and industry tools made all the difference. I learned to build enterprise dashboards and now manage the BI team at Zomato with significant responsibility and growth."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available for BI analysts?",
        answer: "BI offers roles like Business Intelligence Analyst, Data Analyst, Reporting Specialist, and BI Consultant. Starting salaries range from ₹3-8 LPA with good growth in business-focused environments."
      },
      {
        question: "Do I need technical programming skills for BI?",
        answer: "Basic SQL and understanding of data is important, but advanced programming is not required. We focus on BI tools like Power BI and Tableau which are user-friendly for business professionals."
      },
      {
        question: "How is BI different from data science?",
        answer: "BI focuses on business reporting, dashboards, and operational analytics using structured data. Data science involves predictive modeling and advanced analytics. BI is more business-focused and accessible."
      },
      {
        question: "Which industries hire BI analysts?",
        answer: "Almost all industries need BI analysts - retail, banking, healthcare, e-commerce, manufacturing, and consulting. It's a versatile field with opportunities across sectors."
      },
      {
        question: "What kind of projects will I work on?",
        answer: "You'll work on sales dashboards, financial reporting, customer analytics, operational metrics, and executive reporting using real business datasets and scenarios."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default BusinessIntelligenceAnalyst;