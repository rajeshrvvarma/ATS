import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Code, Database, Server, Globe } from 'lucide-react';

const FullStackPythonDeveloper = () => {
  const courseData = {
    title: "Full Stack Python Developer",
    subtitle: "Master Python Web Development with Django & Flask",
    description: "Become a professional full-stack Python developer with comprehensive training in Django and Flask frameworks. Learn to build scalable web applications, RESTful APIs, and database-driven solutions. This program covers everything from Python fundamentals to advanced web development and deployment strategies.",
    category: "technology",
    courseId: "full-stack-python-developer",

    keyBenefits: [
      "Master Python programming and web frameworks",
      "Build web applications with Django and Flask",
      "Learn database design and ORM concepts",
      "Create RESTful APIs and microservices",
      "Deploy applications to cloud platforms"
    ],

    duration: "6 Months",
    level: "Beginner to Advanced",
    price: "₹28,000",
    originalPrice: "₹42,000",

    batchInfo: {
      date: "5th December 2025",
      time: "09:00 AM TO 6:00 PM"
    },

    highlights: [
      {
        icon: Code,
        title: "Python Mastery",
        description: "Master Python programming from basics to advanced concepts and best practices"
      },
      {
        icon: Server,
        title: "Web Frameworks",
        description: "Learn Django and Flask for building robust web applications and APIs"
      },
      {
        icon: Database,
        title: "Database Integration",
        description: "Master SQL databases, ORM concepts, and database optimization techniques"
      },
      {
        icon: Globe,
        title: "Full-Stack Development",
        description: "Build complete web applications with frontend and backend integration"
      }
    ],

    features: [
      {
        title: "Python Programming",
        description: "Comprehensive Python training covering syntax, data structures, OOP, and advanced concepts"
      },
      {
        title: "Django Framework",
        description: "Master Django for rapid development of secure and maintainable web applications"
      },
      {
        title: "Flask Microservices",
        description: "Learn Flask for building lightweight APIs and microservices architecture"
      },
      {
        title: "Database Design",
        description: "SQL databases, PostgreSQL, MySQL, and Django ORM for data management"
      },
      {
        title: "Frontend Integration",
        description: "HTML, CSS, JavaScript, and template engines for complete web solutions"
      },
      {
        title: "Cloud Deployment",
        description: "Deploy Python applications on AWS, Heroku, and implement DevOps practices"
      }
    ],

    skills: [
      "Python Programming",
      "Django Framework",
      "Flask Framework",
      "SQL & PostgreSQL",
      "Django ORM",
      "RESTful APIs",
      "HTML/CSS/JavaScript",
      "Git & GitHub",
      "Testing",
      "AWS Deployment",
      "Docker",
      "API Development"
    ],

    curriculum: [
      {
        title: "Python Fundamentals",
        topics: [
          "Python Syntax & Data Types",
          "Control Structures",
          "Functions & Modules",
          "Error Handling"
        ]
      },
      {
        title: "Advanced Python",
        topics: [
          "Object-Oriented Programming",
          "File Handling",
          "Regular Expressions",
          "Decorators & Generators"
        ]
      },
      {
        title: "Web Development Basics",
        topics: [
          "HTML5 & CSS3",
          "JavaScript Fundamentals",
          "HTTP Protocol",
          "Web Server Concepts"
        ]
      },
      {
        title: "Django Framework",
        topics: [
          "Django Architecture (MVT)",
          "Models & Database Design",
          "Views & URL Routing",
          "Templates & Forms"
        ]
      },
      {
        title: "Advanced Django",
        topics: [
          "Django Admin Interface",
          "User Authentication",
          "Django REST Framework",
          "Testing & Debugging"
        ]
      },
      {
        title: "Flask Framework",
        topics: [
          "Flask Application Structure",
          "Routing & Blueprints",
          "SQLAlchemy ORM",
          "Flask-RESTful APIs"
        ]
      },
      {
        title: "Database Management",
        topics: [
          "SQL Fundamentals",
          "PostgreSQL & MySQL",
          "Database Optimization",
          "Migration Strategies"
        ]
      },
      {
        title: "Deployment & DevOps",
        topics: [
          "Linux Server Management",
          "Docker Containerization",
          "Cloud Deployment (AWS)",
          "CI/CD Pipelines"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹28,000",
        type: "standard",
        popular: true,
        features: [
          "6 Months Comprehensive Training",
          "Django & Flask Projects",
          "Industry Expert Instructors",
          "Portfolio Development",
          "Job Placement Assistance",
          "Lifetime Resource Access",
          "Industry Mentorship"
        ]
      },
      {
        name: "Premium with Internship",
        price: "₹45,000",
        type: "premium",
        features: [
          "8 Months Extended Program",
          "Real Industry Projects",
          "3-Month Internship",
          "Advanced Python Libraries",
          "1-on-1 Mentoring",
          "Guaranteed Job Placement",
          "Advanced Certifications"
        ]
      }
    ],

    prerequisites: "Basic computer knowledge and logical thinking ability. No prior programming experience required, but familiarity with basic mathematics and problem-solving concepts will be helpful. Dedication to regular practice and learning is essential.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "Working professionals seeking career transition",
      "Fresh graduates entering IT industry",
      "No programming experience required"
    ],

    testimonials: [
      {
        name: "Shreya Patel",
        role: "Python Developer at TCS",
        content: "The Python full-stack course was excellent! I learned Django thoroughly and built amazing projects. The instructors were very helpful and now I'm working as a Python developer at TCS with a great package."
      },
      {
        name: "Amit Gupta",
        role: "Backend Developer at Swiggy",
        content: "Outstanding course covering both Django and Flask. The hands-on approach and real-world projects helped me understand web development deeply. Got placed at Swiggy as a backend developer!"
      },
      {
        name: "Priya Reddy",
        role: "Full Stack Developer at Ola",
        content: "The comprehensive curriculum and practical training made me job-ready. I learned everything from Python basics to deployment. Now working as a full-stack developer at Ola with excellent growth opportunities."
      }
    ],

    faqs: [
      {
        question: "What job roles can I apply for after completing this course?",
        answer: "You can work as Python Developer, Full Stack Developer, Backend Developer, Django Developer, Flask Developer, Web Developer, and Software Engineer. Starting salaries range from ₹3.5-8 LPA."
      },
      {
        question: "Is prior programming experience necessary?",
        answer: "No prior programming experience is required. We start from Python basics and gradually progress to advanced web development concepts. Strong logical thinking and dedication to practice are important."
      },
      {
        question: "What makes Python development a good career choice?",
        answer: "Python is one of the most in-demand programming languages with applications in web development, data science, AI, and automation. It offers excellent career growth and salary prospects."
      },
      {
        question: "What projects will I work on during the course?",
        answer: "You'll build projects like e-commerce websites, blog applications, REST APIs, social media platforms, and task management systems using Django and Flask frameworks."
      },
      {
        question: "How comprehensive is the placement assistance?",
        answer: "We provide complete placement support including resume building, interview preparation, mock interviews, and direct connections with our hiring partners in the Python development space."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default FullStackPythonDeveloper;