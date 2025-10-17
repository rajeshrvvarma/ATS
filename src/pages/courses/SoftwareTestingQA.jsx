import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Bug, Target, Shield, CheckCircle, Code, Zap, Search, AlertTriangle } from 'lucide-react';

const SoftwareTestingQA = () => {
  const courseData = {
    title: "Software Testing & QA Engineer",
    subtitle: "Master Manual & Automation Testing with DevOps Integration",
    description: "Become a skilled software testing and quality assurance engineer with comprehensive training in manual testing, automation frameworks, and modern QA practices. Learn industry-standard testing methodologies, tools, and techniques to ensure software quality and reliability in agile development environments.",
    category: "technology",
    courseId: "software-testing-qa",

    keyBenefits: [
      "Master manual and automation testing",
      "Learn industry-standard QA practices",
      "Build expertise in testing frameworks and tools",
      "Understand DevOps and CI/CD integration",
      "High-demand QA engineer career opportunities"
    ],

    duration: "5 Months",
    level: "Beginner to Advanced",
    price: "₹25,000",
    originalPrice: "₹40,000",

    batchInfo: {
      date: "20th December 2025",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Bug,
        title: "Manual Testing",
        description: "Master test case design, execution, and defect lifecycle management"
      },
      {
        icon: Zap,
        title: "Automation Testing",
        description: "Learn Selenium, API testing, and modern automation frameworks"
      },
      {
        icon: Target,
        title: "Performance Testing",
        description: "Load testing, stress testing, and performance optimization techniques"
      },
      {
        icon: Shield,
        title: "Security Testing",
        description: "Vulnerability assessment and security testing methodologies"
      }
    ],

    features: [
      {
        title: "Manual Testing Fundamentals",
        description: "Comprehensive training in test planning, design, execution, and bug reporting"
      },
      {
        title: "Test Automation",
        description: "Master Selenium WebDriver, TestNG, and modern automation frameworks"
      },
      {
        title: "API Testing",
        description: "Learn REST API testing using Postman, RestAssured, and automation tools"
      },
      {
        title: "Performance Testing",
        description: "Load and performance testing using JMeter and cloud-based tools"
      },
      {
        title: "Mobile Testing",
        description: "Android and iOS app testing using Appium and mobile testing strategies"
      },
      {
        title: "DevOps Integration",
        description: "CI/CD pipeline integration and continuous testing practices"
      }
    ],

    skills: [
      "Manual Testing",
      "Selenium WebDriver",
      "API Testing",
      "Performance Testing",
      "Mobile Testing",
      "Test Management Tools",
      "Bug Tracking",
      "Agile Testing",
      "TestNG/JUnit",
      "Continuous Testing",
      "SQL for Testers",
      "DevOps Integration"
    ],

    curriculum: [
      {
        title: "Software Testing Fundamentals",
        topics: [
          "Introduction to Software Testing",
          "Testing Principles & Concepts",
          "SDLC & STLC Models",
          "Testing Types & Levels"
        ]
      },
      {
        title: "Manual Testing",
        topics: [
          "Test Planning & Strategy",
          "Test Case Design Techniques",
          "Test Execution & Reporting",
          "Defect Lifecycle Management"
        ]
      },
      {
        title: "Test Management Tools",
        topics: [
          "JIRA for Bug Tracking",
          "TestRail/Zephyr for Test Management",
          "Requirements Traceability",
          "Test Metrics & Reporting"
        ]
      },
      {
        title: "Automation Testing Basics",
        topics: [
          "Introduction to Automation",
          "Selenium WebDriver",
          "Locators & Web Elements",
          "Test Script Development"
        ]
      },
      {
        title: "Advanced Automation",
        topics: [
          "TestNG Framework",
          "Page Object Model",
          "Data-Driven Testing",
          "Cross-Browser Testing"
        ]
      },
      {
        title: "API Testing",
        topics: [
          "REST API Fundamentals",
          "Postman for API Testing",
          "RestAssured Framework",
          "API Automation"
        ]
      },
      {
        title: "Performance & Mobile Testing",
        topics: [
          "JMeter for Performance Testing",
          "Load & Stress Testing",
          "Mobile Testing with Appium",
          "Cross-Platform Testing"
        ]
      },
      {
        title: "DevOps & Continuous Testing",
        topics: [
          "CI/CD Pipeline Integration",
          "Jenkins for Continuous Testing",
          "Docker for Test Environments",
          "Cloud Testing Strategies"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹25,000",
        type: "standard",
        popular: true,
        features: [
          "5 Months Comprehensive Training",
          "6+ Real Testing Projects",
          "Manual & Automation Testing",
          "Industry Tools Training",
          "Job Placement Assistance",
          "ISTQB Certification Prep",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "Advanced QA Specialist",
        price: "₹40,000",
        type: "advanced",
        features: [
          "7 Months Extended Program",
          "Advanced Automation Frameworks",
          "Performance Testing Mastery",
          "Security Testing Training",
          "Team Lead Preparation",
          "Guaranteed High-Paying Job",
          "Industry Mentorship Program"
        ]
      }
    ],

    prerequisites: "Basic understanding of software applications and web browsers. No programming experience required as we teach scripting from basics. Logical thinking and attention to detail are essential. Familiarity with computers and internet usage is expected.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All Branches - CSE, IT, ECE, Mech, Civil, etc.",
      "Fresh graduates seeking QA careers",
      "Working professionals in software industry",
      "Career changers interested in testing"
    ],

    testimonials: [
      {
        name: "Sneha Gupta",
        role: "QA Engineer at Microsoft",
        content: "The testing course at Agnidhra was comprehensive and practical. I learned everything from manual testing to advanced automation. The real-world projects helped me secure a QA engineer position at Microsoft!"
      },
      {
        name: "Rajesh Singh",
        role: "Test Automation Lead at Cognizant",
        content: "Excellent course covering the entire testing landscape. The automation modules with Selenium were particularly valuable. I'm now leading a test automation team at Cognizant with an amazing package."
      },
      {
        name: "Kavya Reddy",
        role: "Senior QA Analyst at Amazon",
        content: "The hands-on approach and industry-relevant tools training made all the difference. I learned to work with enterprise testing tools and got promoted to senior QA analyst at Amazon after completing the course."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available in software testing?",
        answer: "Testing offers roles like QA Engineer, Test Automation Engineer, Performance Tester, QA Lead, and Test Manager. Starting salaries range from ₹3-8 LPA with excellent growth potential in the software industry."
      },
      {
        question: "Do I need programming knowledge for testing?",
        answer: "Basic programming knowledge is helpful for automation testing, but we teach scripting from basics. Manual testing requires no programming skills, making it accessible to non-technical backgrounds."
      },
      {
        question: "Is software testing a good career choice?",
        answer: "Yes! Testing is a critical part of software development with high demand, job security, and good growth opportunities. Every software product needs quality assurance, ensuring consistent job demand."
      },
      {
        question: "What's the difference between manual and automation testing?",
        answer: "Manual testing involves human testers executing test cases manually, while automation testing uses tools and scripts. Both are important - manual for exploratory testing, automation for regression and repetitive tests."
      },
      {
        question: "Will I get hands-on experience with real projects?",
        answer: "Absolutely! Our course includes extensive hands-on practice with real applications, testing tools, and industry scenarios. You'll build a portfolio of testing projects during the course."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default SoftwareTestingQA;