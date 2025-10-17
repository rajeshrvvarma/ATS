import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Code, Database, Globe, Server, Smartphone, Target, Users, BookOpen } from 'lucide-react';

const MERNStackDeveloper = () => {
  const courseData = {
    title: "MERN Stack Developer",
    subtitle: "Master Full-Stack Development with MongoDB, Express, React & Node.js",
    description: "Become a professional full-stack developer with comprehensive training in the MERN stack. Learn to build scalable, modern web applications using MongoDB, Express.js, React.js, and Node.js. This program transforms beginners into skilled developers ready to create end-to-end web solutions.",
    category: "technology",
    courseId: "mern-stack-developer",

    keyBenefits: [
      "Master complete MERN stack development",
      "Build responsive React.js applications",
      "Learn backend development with Node.js",
      "Database design with MongoDB",
      "Deploy applications to cloud platforms"
    ],

    duration: "6 Months",
    level: "Beginner to Advanced",
    price: "₹30,000",
    originalPrice: "₹45,000",

    batchInfo: {
      date: "1st December 2025",
      time: "10:00 AM TO 6:00 PM"
    },

    highlights: [
      {
        icon: Code,
        title: "Frontend Mastery",
        description: "Master React.js, Redux, and modern JavaScript for building dynamic UIs"
      },
      {
        icon: Server,
        title: "Backend Development",
        description: "Learn Node.js, Express.js, and RESTful API development"
      },
      {
        icon: Database,
        title: "Database Design",
        description: "Master MongoDB operations, schema design, and database optimization"
      },
      {
        icon: Globe,
        title: "Full-Stack Projects",
        description: "Build complete web applications from frontend to backend deployment"
      }
    ],

    features: [
      {
        title: "React.js Development",
        description: "Master component-based architecture, hooks, state management, and modern React patterns"
      },
      {
        title: "Node.js Backend",
        description: "Build scalable server-side applications with Express.js framework and middleware"
      },
      {
        title: "MongoDB Database",
        description: "Learn NoSQL database design, aggregation pipelines, and performance optimization"
      },
      {
        title: "RESTful API Design",
        description: "Create robust APIs with authentication, validation, and security best practices"
      },
      {
        title: "State Management",
        description: "Master Redux, Context API, and modern state management solutions"
      },
      {
        title: "Deployment & DevOps",
        description: "Deploy applications on AWS, Heroku, and implement CI/CD pipelines"
      }
    ],

    skills: [
      "HTML5 & CSS3",
      "JavaScript ES6+",
      "React.js",
      "Redux",
      "Node.js",
      "Express.js",
      "MongoDB",
      "RESTful APIs",
      "Authentication",
      "Git & GitHub",
      "AWS Deployment",
      "Testing"
    ],

    curriculum: [
      {
        title: "Frontend Fundamentals",
        topics: [
          "HTML5 Semantic Elements",
          "CSS3 & Flexbox/Grid",
          "JavaScript ES6+ Features",
          "DOM Manipulation"
        ]
      },
      {
        title: "React.js Mastery",
        topics: [
          "Component Architecture",
          "Hooks & State Management",
          "Event Handling",
          "Conditional Rendering"
        ]
      },
      {
        title: "Advanced React",
        topics: [
          "Context API",
          "Redux State Management",
          "React Router",
          "Performance Optimization"
        ]
      },
      {
        title: "Node.js Backend",
        topics: [
          "Node.js Fundamentals",
          "NPM & Package Management",
          "File System Operations",
          "Asynchronous Programming"
        ]
      },
      {
        title: "Express.js Framework",
        topics: [
          "Server Setup & Routing",
          "Middleware Development",
          "Error Handling",
          "API Development"
        ]
      },
      {
        title: "MongoDB Database",
        topics: [
          "Database Design",
          "CRUD Operations",
          "Aggregation Pipeline",
          "Indexing & Performance"
        ]
      },
      {
        title: "Full-Stack Integration",
        topics: [
          "Frontend-Backend Communication",
          "Authentication & Authorization",
          "File Upload & Processing",
          "Real-time Features"
        ]
      },
      {
        title: "Testing & Deployment",
        topics: [
          "Unit & Integration Testing",
          "Cloud Deployment (AWS/Heroku)",
          "Environment Configuration",
          "Performance Monitoring"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹30,000",
        type: "standard",
        popular: true,
        features: [
          "6 Months Comprehensive Training",
          "Hands-on Project Development",
          "Industry Expert Instructors",
          "Portfolio Development",
          "Job Placement Assistance",
          "Lifetime Code Access",
          "Industry Mentorship"
        ]
      },
      {
        name: "Premium with Internship",
        price: "₹50,000",
        type: "premium",
        features: [
          "8 Months Extended Program",
          "Real Industry Projects",
          "3-Month Internship",
          "Advanced Frameworks",
          "1-on-1 Mentoring",
          "Guaranteed Job Placement",
          "Advanced Certifications"
        ]
      }
    ],

    prerequisites: "Basic computer knowledge and familiarity with web browsing. No prior programming experience required. Logical thinking and problem-solving attitude are essential. Dedication to practice coding regularly is important for success.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "All IT & Non-IT Branches - CSE, EEE, Civil, Mech, Bio, etc.",
      "Working professionals seeking career change",
      "Fresh graduates looking to enter IT",
      "No programming experience required"
    ],

    testimonials: [
      {
        name: "Ankit Sharma",
        role: "Full Stack Developer at Flipkart",
        content: "The MERN stack course at Agnidhra was incredibly comprehensive. I learned everything from React basics to advanced deployment. Now I'm working as a full-stack developer at Flipkart with a great salary package!"
      },
      {
        name: "Pooja Verma",
        role: "Software Engineer at Zomato",
        content: "Excellent training program with hands-on projects. The instructors were very supportive and the curriculum covered all aspects of modern web development. I got placed at Zomato within 2 weeks of completion."
      },
      {
        name: "Rohit Agarwal",
        role: "Frontend Developer at Paytm",
        content: "The React.js training was outstanding, and the full-stack projects helped me build a strong portfolio. The placement assistance was excellent - I received multiple job offers after completing the course."
      }
    ],

    faqs: [
      {
        question: "What career opportunities are available after this course?",
        answer: "Graduates can work as Full Stack Developer, Frontend Developer, Backend Developer, React Developer, Node.js Developer, and JavaScript Engineer. Starting salaries range from ₹4-10 LPA."
      },
      {
        question: "Do I need any programming background?",
        answer: "No programming background is required. We start from basics and gradually build to advanced concepts. However, logical thinking and dedication to practice are essential."
      },
      {
        question: "What projects will I build during the course?",
        answer: "You'll build multiple projects including e-commerce websites, social media applications, task management systems, and real-time chat applications using the complete MERN stack."
      },
      {
        question: "How much practice and projects are included?",
        answer: "The course is 70% hands-on with 10+ major projects and 50+ coding exercises. You'll build a comprehensive portfolio showcasing your full-stack development skills."
      },
      {
        question: "What support is provided for job placement?",
        answer: "We provide resume building, interview preparation, portfolio review, and direct connections with our hiring partners. Our placement team actively works to connect students with opportunities."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default MERNStackDeveloper;