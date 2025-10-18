import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Code, Coffee, Database, Globe, Layers } from 'lucide-react';

const JavaFullStackDeveloper = () => {
  const courseData = {
    title: "Java Full Stack Developer",
    subtitle: "Enterprise Java Development with Spring Boot & Modern Frameworks",
    description: "Become a professional Java Full Stack developer with comprehensive training in enterprise Java development. Master Spring Boot, Hibernate, and modern frontend frameworks to build scalable, enterprise-grade applications.",
    category: "technology",
    courseId: "java-fullstack-developer",

    keyBenefits: [
      "Master enterprise Java development",
      "Learn Spring Boot and microservices",
      "Build full-stack applications",
      "Work with modern frontend frameworks",
      "Prepare for high-paying enterprise roles"
    ],

    duration: "7 Months",
    level: "Beginner to Advanced",
    price: "₹32,000",
    originalPrice: "₹48,000",

    batchInfo: {
      date: "25th December 2025",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Coffee,
        title: "Enterprise Java",
        description: "Master core Java, advanced concepts, and enterprise patterns"
      },
      {
        icon: Layers,
        title: "Spring Ecosystem",
        description: "Learn Spring Boot, Spring Security, and Spring Data JPA"
      },
      {
        icon: Database,
        title: "Database & ORM",
        description: "Master Hibernate, JPA, and database design patterns"
      },
      {
        icon: Globe,
        title: "Frontend Integration",
        description: "Integrate with Angular/React and build REST APIs"
      }
    ],

    features: [
      {
        title: "Core Java Mastery",
        description: "Complete Java programming from basics to advanced concepts including multithreading and collections"
      },
      {
        title: "Spring Boot Framework",
        description: "Enterprise application development with Spring Boot, dependency injection, and MVC architecture"
      },
      {
        title: "Database & ORM",
        description: "Hibernate ORM, JPA implementation, and advanced database operations"
      },
      {
        title: "Frontend Development",
        description: "Angular or React integration for full-stack enterprise applications"
      },
      {
        title: "Microservices Architecture",
        description: "Design and build microservices using Spring Cloud and related technologies"
      },
      {
        title: "Enterprise Deployment",
        description: "Application deployment, monitoring, and production best practices"
      }
    ],

    skills: [
      "Core Java",
      "Spring Boot",
      "Spring Security",
      "Hibernate/JPA",
      "REST APIs",
      "Angular/React",
      "Maven/Gradle",
      "MySQL/PostgreSQL",
      "Microservices",
      "Docker",
      "Enterprise Patterns",
      "Unit Testing"
    ],

    curriculum: [
      {
        title: "Core Java Fundamentals",
        topics: [
          "Java Syntax & OOP Concepts",
          "Exception Handling",
          "Collections Framework",
          "Multithreading & Concurrency"
        ]
      },
      {
        title: "Advanced Java",
        topics: [
          "Java 8+ Features (Streams, Lambda)",
          "Generics & Annotations",
          "JDBC & Database Connectivity",
          "Design Patterns"
        ]
      },
      {
        title: "Spring Framework",
        topics: [
          "Spring Core & Dependency Injection",
          "Spring MVC Architecture",
          "Spring Security",
          "Spring Data JPA"
        ]
      },
      {
        title: "Spring Boot Development",
        topics: [
          "Spring Boot Fundamentals",
          "REST API Development",
          "Configuration Management",
          "Auto-configuration"
        ]
      },
      {
        title: "Database & ORM",
        topics: [
          "Hibernate ORM",
          "JPA Implementation",
          "Database Design",
          "Transaction Management"
        ]
      },
      {
        title: "Frontend Integration",
        topics: [
          "Angular/React Basics",
          "RESTful Web Services",
          "JSON Data Handling",
          "Frontend-Backend Communication"
        ]
      },
      {
        title: "Microservices & Advanced",
        topics: [
          "Microservices Architecture",
          "Spring Cloud",
          "API Gateway",
          "Service Discovery"
        ]
      },
      {
        title: "Enterprise Deployment",
        topics: [
          "Application Packaging",
          "Docker Containerization",
          "Testing Strategies",
          "Production Deployment"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹32,000",
        type: "standard",
        popular: true,
        features: [
          "7 Months Comprehensive Training",
          "8+ Enterprise Projects",
          "Spring Certification Preparation",
          "Industry Expert Instructors",
          "Job Placement Assistance",
          "Lifetime Resource Access",
          "Corporate Training Style"
        ]
      },
      {
        name: "Enterprise Specialist",
        price: "₹55,000",
        type: "advanced",
        features: [
          "10 Months Extended Program",
          "Advanced Enterprise Architecture",
          "Microservices Mastery",
          "Industry Internship",
          "1-on-1 Senior Developer Mentoring",
          "Guaranteed High-Paying Job",
          "Spring Professional Certification"
        ]
      }
    ],

    prerequisites: "Basic programming concepts and object-oriented programming understanding. No prior Java experience required as we cover everything from fundamentals. Strong logical thinking and problem-solving skills are essential.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, etc.",
      "Working professionals in software development",
      "Fresh graduates interested in enterprise development",
      "Basic programming knowledge helpful"
    ],

    testimonials: [
      {
        name: "Rakesh Kumar",
        role: "Java Developer at Infosys",
        content: "The Java full stack course was exactly what I needed for my career transition. The Spring Boot modules were comprehensive and the enterprise focus helped me land a developer role at Infosys with excellent package!"
      },
      {
        name: "Priya Sharma",
        role: "Senior Developer at TCS",
        content: "Excellent course structure covering the entire Java ecosystem. The microservices and enterprise patterns were particularly valuable. I got promoted to senior developer position after completing this course."
      },
      {
        name: "Amit Patel",
        role: "Full Stack Developer at Wipro",
        content: "The hands-on approach and industry-relevant projects made this course outstanding. I learned to build enterprise-grade applications and now work as a full stack developer with 50% salary increase."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available for Java developers?",
        answer: "Java offers excellent career opportunities including Full Stack Developer, Backend Developer, Enterprise Application Developer, and Software Architect roles. Starting salaries range from ₹4-10 LPA with great growth potential."
      },
      {
        question: "Do I need prior Java experience for this course?",
        answer: "No prior Java experience is required. We start from core Java fundamentals and gradually progress to advanced enterprise development concepts. Basic programming knowledge is helpful but not mandatory."
      },
      {
        question: "Why choose Java over other programming languages?",
        answer: "Java is widely used in enterprise applications, has excellent job market demand, platform independence, and strong community support. It's ideal for large-scale, mission-critical applications."
      },
      {
        question: "Will this course prepare me for Spring certification?",
        answer: "Yes, our course specifically prepares you for Spring Framework certifications including Spring Professional certification. We cover all exam topics with hands-on practice."
      },
      {
        question: "What kind of projects will I work on?",
        answer: "You'll work on enterprise-level projects like e-commerce applications, banking systems, inventory management, and microservices architectures using real-world technologies and patterns."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default JavaFullStackDeveloper;