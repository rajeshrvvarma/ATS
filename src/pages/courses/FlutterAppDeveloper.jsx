import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Smartphone, Palette, Code, Zap, Layers, Settings, Globe, Target } from 'lucide-react';

const FlutterAppDeveloper = () => {
  const courseData = {
    title: "Flutter App Developer",
    subtitle: "Google Flutter Framework for Beautiful Mobile Applications",
    description: "Master Google's Flutter framework to create stunning, high-performance mobile applications. Learn Dart programming and Flutter's widget system to build beautiful apps for iOS and Android with single codebase and native performance.",
    category: "technology",
    courseId: "flutter-app-developer",

    keyBenefits: [
      "Master Google Flutter framework",
      "Learn Dart programming language",
      "Build beautiful mobile UIs",
      "Create high-performance apps",
      "Google certification pathway"
    ],

    duration: "4 Months",
    level: "Beginner to Intermediate",
    price: "₹20,000",
    originalPrice: "₹30,000",

    batchInfo: {
      date: "1st February 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Palette,
        title: "Beautiful UI Design",
        description: "Create stunning, customizable user interfaces with Flutter widgets"
      },
      {
        icon: Code,
        title: "Dart Programming",
        description: "Master Dart language fundamentals and object-oriented concepts"
      },
      {
        icon: Zap,
        title: "High Performance",
        description: "Build fast, smooth applications with native compilation"
      },
      {
        icon: Globe,
        title: "Firebase Integration",
        description: "Connect with Firebase for backend services and real-time features"
      }
    ],

    features: [
      {
        title: "Dart Programming Language",
        description: "Complete mastery of Dart syntax, object-oriented programming, and language features"
      },
      {
        title: "Flutter Widget System",
        description: "Build complex UIs using Flutter's rich widget library and custom widgets"
      },
      {
        title: "State Management",
        description: "Learn Provider, Bloc, Riverpod, and other state management solutions"
      },
      {
        title: "Firebase Integration",
        description: "Backend services, authentication, real-time database, and cloud storage"
      },
      {
        title: "Custom Animations",
        description: "Create smooth, engaging animations and micro-interactions"
      },
      {
        title: "App Publishing",
        description: "Complete app store submission process and app distribution"
      }
    ],

    skills: [
      "Dart Programming",
      "Flutter Framework",
      "Widget Development",
      "State Management",
      "Firebase Services",
      "Mobile UI/UX",
      "Custom Animations",
      "RESTful APIs",
      "Local Storage",
      "Push Notifications",
      "App Performance",
      "Testing"
    ],

    curriculum: [
      {
        title: "Dart Programming Fundamentals",
        topics: [
          "Dart Syntax & Variables",
          "Data Types & Collections",
          "Functions & Methods",
          "Object-Oriented Programming"
        ]
      },
      {
        title: "Flutter Basics",
        topics: [
          "Flutter Architecture",
          "Development Environment",
          "First Flutter App",
          "Hot Reload & Debugging"
        ]
      },
      {
        title: "Widget System",
        topics: [
          "Stateless & Stateful Widgets",
          "Layout Widgets",
          "Material & Cupertino Design",
          "Custom Widget Development"
        ]
      },
      {
        title: "User Interface Design",
        topics: [
          "Responsive Design",
          "Theming & Styling",
          "Navigation & Routing",
          "Forms & Input Handling"
        ]
      },
      {
        title: "State Management",
        topics: [
          "setState & InheritedWidget",
          "Provider Pattern",
          "Bloc Architecture",
          "Riverpod Framework"
        ]
      },
      {
        title: "Backend Integration",
        topics: [
          "HTTP Requests & APIs",
          "JSON Parsing",
          "Local Database (SQLite)",
          "Shared Preferences"
        ]
      },
      {
        title: "Firebase Services",
        topics: [
          "Firebase Setup",
          "Authentication",
          "Firestore Database",
          "Cloud Storage & Messaging"
        ]
      },
      {
        title: "Advanced Features",
        topics: [
          "Custom Animations",
          "Device Features Integration",
          "Performance Optimization",
          "App Store Publishing"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹20,000",
        type: "standard",
        popular: true,
        features: [
          "4 Months Comprehensive Training",
          "5+ Beautiful App Projects",
          "Google Certification Path",
          "Firebase Integration Focus",
          "Job Placement Assistance",
          "UI/UX Design Training",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "Flutter Expert",
        price: "₹35,000",
        type: "advanced",
        features: [
          "6 Months Extended Program",
          "Advanced Architecture Patterns",
          "Custom Plugin Development",
          "Freelance Business Setup",
          "1-on-1 Flutter Expert Mentoring",
          "Guaranteed High-Paying Job",
          "Google Developer Certification"
        ]
      }
    ],

    prerequisites: "Basic programming knowledge in any language is helpful but not mandatory. Understanding of object-oriented programming concepts is beneficial. No prior mobile development experience required. Interest in UI/UX design is advantageous.",

    eligibility: [
      "Any Graduate - B.Tech, BSc, B.Com, BBA, etc.",
      "Software developers and programmers",
      "UI/UX designers interested in development",
      "Fresh graduates interested in mobile development",
      "Career changers seeking mobile development skills"
    ],

    testimonials: [
      {
        name: "Sneha Gupta",
        role: "Flutter Developer at Google",
        content: "The Flutter course was comprehensive and beautifully structured. The focus on UI design and Firebase integration gave me the skills to build professional apps. Now working at Google as Flutter developer with amazing opportunities!"
      },
      {
        name: "Vikash Singh",
        role: "Mobile App Developer at Paytm",
        content: "Excellent course covering Dart and Flutter from basics to advanced. The state management and animation modules were particularly valuable. I built multiple apps and secured a great position at Paytm's mobile team."
      },
      {
        name: "Ananya Sharma",
        role: "Freelance Flutter Developer",
        content: "The practical approach and beautiful app projects gave me confidence to start freelancing. I learned to create stunning UIs and now have a successful Flutter development business with international clients."
      }
    ],

    faqs: [
      {
        question: "Why choose Flutter over other mobile development frameworks?",
        answer: "Flutter offers beautiful UIs, fast development, hot reload, single codebase for multiple platforms, and Google's backing. It compiles to native code for excellent performance."
      },
      {
        question: "Is Dart difficult to learn for beginners?",
        answer: "Dart is designed to be familiar to developers coming from other languages. It's relatively easy to learn, especially with our structured approach starting from basics."
      },
      {
        question: "Can Flutter apps match native app performance?",
        answer: "Yes! Flutter compiles to native ARM code, providing near-native performance. Many production apps like Google Ads, Alibaba, and BMW use Flutter successfully."
      },
      {
        question: "What career opportunities are available for Flutter developers?",
        answer: "Flutter developers are in high demand with roles at startups and major companies. Opportunities include Mobile Developer, Flutter Specialist, Cross-platform Developer, and Freelance App Developer."
      },
      {
        question: "Will I be able to publish apps to both app stores?",
        answer: "Yes! Flutter apps can be published to both Google Play Store and Apple App Store from a single codebase. We cover the complete publishing process for both platforms."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default FlutterAppDeveloper;