import React from 'react';
import CoursePageTemplate from './CoursePageTemplate.jsx';
import { Smartphone, Code, Layers, Globe, Zap, Settings, Users, Target } from 'lucide-react';

const ReactNativeDeveloper = () => {
  const courseData = {
    title: "React Native Developer",
    subtitle: "Cross-Platform Mobile App Development with React Native",
    description: "Master React Native framework to build beautiful, high-performance mobile applications for both iOS and Android. Learn to create cross-platform apps with native performance using JavaScript and React concepts.",
    category: "technology",
    courseId: "react-native-developer",

    keyBenefits: [
      "Master cross-platform mobile development",
      "Learn React Native framework",
      "Build iOS and Android apps",
      "Deploy to app stores",
      "High-demand mobile developer career"
    ],

    duration: "4 Months",
    level: "Intermediate",
    price: "₹22,000",
    originalPrice: "₹32,000",

    batchInfo: {
      date: "25th January 2026",
      time: "10:00 AM TO 7:00 PM"
    },

    highlights: [
      {
        icon: Smartphone,
        title: "Cross-Platform Development",
        description: "Build apps for both iOS and Android with single codebase"
      },
      {
        icon: Code,
        title: "React Native Framework",
        description: "Master React Native components, navigation, and state management"
      },
      {
        icon: Layers,
        title: "Native Integration",
        description: "Access device features and integrate with native modules"
      },
      {
        icon: Globe,
        title: "App Store Deployment",
        description: "Learn app store submission and publishing processes"
      }
    ],

    features: [
      {
        title: "React Native Fundamentals",
        description: "Complete understanding of React Native framework, components, and development environment"
      },
      {
        title: "Navigation & Routing",
        description: "Master React Navigation for complex app navigation and deep linking"
      },
      {
        title: "State Management",
        description: "Learn Redux, Context API, and modern state management patterns"
      },
      {
        title: "Native Module Integration",
        description: "Access camera, GPS, storage, and other device APIs"
      },
      {
        title: "Backend Integration",
        description: "Connect with REST APIs, handle authentication, and manage data"
      },
      {
        title: "App Store Publishing",
        description: "Complete app store submission process for iOS App Store and Google Play Store"
      }
    ],

    skills: [
      "React Native",
      "JavaScript ES6+",
      "React Fundamentals",
      "Mobile UI/UX",
      "Redux/Context API",
      "REST API Integration",
      "Native Modules",
      "App Store Deployment",
      "Push Notifications",
      "Mobile Security",
      "Performance Optimization",
      "Debugging"
    ],

    curriculum: [
      {
        title: "React Native Setup",
        topics: [
          "Development Environment Setup",
          "React Native CLI vs Expo",
          "Project Structure",
          "Running on Devices/Emulators"
        ]
      },
      {
        title: "Core Components",
        topics: [
          "View, Text, Image Components",
          "TouchableOpacity & Gestures",
          "ScrollView & FlatList",
          "TextInput & Forms"
        ]
      },
      {
        title: "Styling & Layout",
        topics: [
          "Flexbox Layout System",
          "StyleSheet API",
          "Responsive Design",
          "Platform-specific Styling"
        ]
      },
      {
        title: "Navigation",
        topics: [
          "React Navigation Library",
          "Stack Navigator",
          "Tab Navigator",
          "Drawer Navigator"
        ]
      },
      {
        title: "State Management",
        topics: [
          "Component State",
          "Context API",
          "Redux Integration",
          "Async State Handling"
        ]
      },
      {
        title: "Device Integration",
        topics: [
          "Camera & Gallery Access",
          "Geolocation Services",
          "AsyncStorage",
          "Push Notifications"
        ]
      },
      {
        title: "Backend & APIs",
        topics: [
          "Fetch API & Axios",
          "Authentication Flow",
          "Data Persistence",
          "Offline Support"
        ]
      },
      {
        title: "Deployment & Publishing",
        topics: [
          "App Store Guidelines",
          "iOS App Store Submission",
          "Google Play Store Publishing",
          "CI/CD for Mobile Apps"
        ]
      }
    ],

    programs: [
      {
        name: "Standard Training",
        price: "₹22,000",
        type: "standard",
        popular: true,
        features: [
          "4 Months Comprehensive Training",
          "6+ Mobile App Projects",
          "Cross-platform Focus",
          "App Store Publishing",
          "Job Placement Assistance",
          "Industry Mentorship",
          "Lifetime Resources Access"
        ]
      },
      {
        name: "Mobile App Specialist",
        price: "₹38,000",
        type: "advanced",
        features: [
          "6 Months Extended Program",
          "Advanced Performance Optimization",
          "Native Module Development",
          "Freelance Business Training",
          "1-on-1 Mobile Expert Mentoring",
          "Guaranteed High-Paying Position",
          "Multiple App Store Publications"
        ]
      }
    ],

    prerequisites: "Strong JavaScript and React knowledge is required. Understanding of ES6+ features, React hooks, and component lifecycle. Basic mobile app development concepts are helpful. No prior React Native experience needed.",

    eligibility: [
      "React Developers seeking mobile skills",
      "Frontend developers with JavaScript expertise",
      "Software developers interested in mobile",
      "Computer Science/IT graduates",
      "Working professionals wanting mobile development skills"
    ],

    testimonials: [
      {
        name: "Arjun Reddy",
        role: "React Native Developer at Swiggy",
        content: "The React Native course was exactly what I needed to transition from web to mobile development. The cross-platform approach and app store publishing guidance helped me build professional apps. Now working at Swiggy as mobile developer!"
      },
      {
        name: "Kavya Patel",
        role: "Mobile App Developer at Zomato",
        content: "Excellent course covering the entire React Native ecosystem. The navigation and state management modules were particularly valuable. I built several apps during the course and landed a great position at Zomato."
      },
      {
        name: "Rohit Sharma",
        role: "Freelance Mobile Developer",
        content: "The practical approach and real app development projects gave me confidence to start freelancing. I learned to build and publish apps independently and now run a successful mobile app development freelance business."
      }
    ],

    faqs: [
      {
        question: "What are the advantages of React Native over native development?",
        answer: "React Native allows single codebase for both iOS and Android, faster development, code reusability, and lower maintenance costs. It provides near-native performance with JavaScript development ease."
      },
      {
        question: "Do I need Mac for iOS development in React Native?",
        answer: "For iOS app store submission, you need Mac with Xcode. However, you can develop and test React Native apps on Windows/Linux using Expo. We provide guidance for both approaches."
      },
      {
        question: "How does React Native compare to Flutter?",
        answer: "React Native uses JavaScript and has larger community, while Flutter uses Dart. Both are excellent for cross-platform development. React Native is better if you have React/JavaScript background."
      },
      {
        question: "Can I build complex apps with React Native?",
        answer: "Yes! React Native is used by Facebook, Instagram, Airbnb, and many other major apps. It's capable of building complex, high-performance mobile applications with rich features."
      },
      {
        question: "What kind of apps will I build during the course?",
        answer: "You'll build various apps including social media apps, e-commerce apps, weather apps, task managers, and real-time chat applications with complete functionality and app store deployment."
      }
    ]
  };

  return <CoursePageTemplate courseData={courseData} />;
};

export default ReactNativeDeveloper;