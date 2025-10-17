import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { CheckCircle, FileText, Bug, Search, Target, Settings, TestTube, Users } from 'lucide-react';

const ManualTestingSpecialist = () => {
  const courseData = {
    title: "Manual Testing Specialist",
    subtitle: "Foundation in Manual Testing Methodologies & Processes",
    description: "Start your software testing career with comprehensive training in manual testing fundamentals. Learn test planning, test case design, defect reporting, and quality assurance processes. Perfect entry point into the software testing field.",
    category: "technology",
    courseId: "manual-testing-specialist",

    keyBenefits: [
      "Master manual testing fundamentals",
      "Learn test case design techniques",
      "Understand software quality processes",
      "Entry-level friendly career path",
      "High job placement success rate"
    ],

    duration: "2 Months",
    level: "Beginner",
    price: "₹12,000",
    originalPrice: "₹18,000",

    batchInfo: {
      date: "20th January 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: FileText,
        title: "Test Planning",
        description: "Master test planning, strategy, and documentation"
      },
      {
        icon: Search,
        title: "Test Design",
        description: "Learn test case design techniques and methodologies"
      },
      {
        icon: Bug,
        title: "Defect Management",
        description: "Bug reporting, tracking, and lifecycle management"
      },
      {
        icon: Target,
        title: "Quality Assurance",
        description: "QA processes, standards, and best practices"
      }
    ],

    features: [
      {
        title: "Testing Fundamentals",
        description: "Complete understanding of software testing principles, SDLC, and STLC processes"
      },
      {
        title: "Test Case Design",
        description: "Master various test design techniques including boundary value analysis and equivalence partitioning"
      },
      {
        title: "Defect Management",
        description: "Learn bug lifecycle, severity/priority assessment, and defect tracking tools"
      },
      {
        title: "Testing Types",
        description: "Understand functional, non-functional, and specialized testing approaches"
      },
      {
        title: "Agile Testing",
        description: "Learn testing in agile environments and collaborative development practices"
      },
      {
        title: "Documentation Skills",
        description: "Master test documentation, reporting, and communication with stakeholders"
      }
    ],

    skills: [
      "Manual Testing",
      "Test Case Design",
      "Bug Reporting",
      "Test Planning",
      "SDLC/STLC",
      "Agile Testing",
      "Quality Assurance",
      "Documentation",
      "Test Execution",
      "Defect Tracking",
      "Communication",
      "Attention to Detail"
    ],

    curriculum: [
      {
        title: "Testing Fundamentals",
        topics: [
          "Introduction to Software Testing",
          "Testing Principles & Objectives",
          "SDLC & STLC Models",
          "Testing Levels & Types"
        ]
      },
      {
        title: "Test Planning & Strategy",
        topics: [
          "Test Planning Process",
          "Test Strategy Development",
          "Risk Assessment",
          "Test Estimation"
        ]
      },
      {
        title: "Test Design Techniques",
        topics: [
          "Black Box Testing Techniques",
          "Boundary Value Analysis",
          "Equivalence Partitioning",
          "Decision Table Testing"
        ]
      },
      {
        title: "Test Case Development",
        topics: [
          "Test Case Writing",
          "Test Case Review",
          "Test Data Preparation",
          "Test Environment Setup"
        ]
      },
      {
        title: "Test Execution",
        topics: [
          "Test Execution Process",
          "Defect Identification",
          "Test Results Recording",
          "Status Reporting"
        ]
      },
      {
        title: "Defect Management",
        topics: [
          "Bug Life Cycle",
          "Defect Reporting",
          "Severity & Priority",
          "Defect Tracking Tools"
        ]
      },
      {
        title: "Specialized Testing",
        topics: [
          "Web Application Testing",
          "Mobile Application Testing",
          "Database Testing",
          "Usability Testing"
        ]
      },
      {
        title: "Agile & Communication",
        topics: [
          "Agile Testing Practices",
          "Team Collaboration",
          "Test Reporting",
          "Client Communication"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹12,000",
        type: "standard",
        popular: true,
        features: [
          "2 Months Intensive Training",
          "4+ Real Testing Projects",
          "Industry Tools Training",
          "Entry-level Friendly",
          "Job Placement Assistance",
          "ISTQB Foundation Prep",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "QA Professional",
        price: "₹20,000",
        type: "advanced",
        features: [
          "3 Months Extended Program",
          "Advanced Testing Techniques",
          "Leadership Skills Training",
          "Industry Internship",
          "1-on-1 QA Expert Mentoring",
          "Guaranteed Job Placement",
          "ISTQB Advanced Level Prep"
        ]
      }
    ],

    prerequisites: "Basic computer knowledge and understanding of software applications. No prior technical experience required. Attention to detail, logical thinking, and good communication skills are important. Interest in quality and process improvement is beneficial.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "Fresh graduates seeking IT careers",
      "Non-technical professionals wanting IT transition",
      "Career changers interested in quality assurance",
      "Anyone interested in software testing"
    ],

    testimonials: [
      {
        name: "Meera Singh",
        role: "QA Analyst at Infosys",
        content: "The manual testing course was perfect for my career transition from non-tech to IT. The systematic approach and practical projects gave me confidence to enter the testing field. Now working at Infosys as QA analyst!"
      },
      {
        name: "Ravi Kumar",
        role: "Test Engineer at TCS",
        content: "Excellent foundation course for testing career. The instructors explained concepts clearly and the hands-on practice with real applications was invaluable. Got placed at TCS immediately after course completion."
      },
      {
        name: "Pooja Sharma",
        role: "Software Tester at Wipro",
        content: "The course provided comprehensive knowledge of testing processes and methodologies. The job placement assistance was excellent and I secured a testing position at Wipro with good starting package."
      }
    ],

    faqs: [
      {
        question: "Is manual testing a good career choice for beginners?",
        answer: "Yes! Manual testing is an excellent entry point into IT with good job opportunities, steady growth, and no complex programming requirements. It's ideal for detail-oriented individuals."
      },
      {
        question: "Do I need technical programming skills for manual testing?",
        answer: "No programming skills are required for manual testing. We focus on testing concepts, processes, and methodologies. Basic computer literacy and logical thinking are sufficient."
      },
      {
        question: "What are the career growth opportunities in testing?",
        answer: "Testing offers good growth from Test Engineer to Senior Tester, Test Lead, QA Manager, and Quality Consultant. You can also transition to automation testing or specialized testing areas."
      },
      {
        question: "How is manual testing different from automation testing?",
        answer: "Manual testing involves human testers executing test cases manually, while automation uses tools and scripts. Manual testing is essential for usability, exploratory, and ad-hoc testing scenarios."
      },
      {
        question: "What kind of companies hire manual testers?",
        answer: "All software companies need manual testers - IT services, product companies, startups, e-commerce, banking, and healthcare. Testing is essential in every software development environment."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default ManualTestingSpecialist;