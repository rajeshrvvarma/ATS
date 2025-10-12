import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Users, Award, Target, Code, Database, Server, Cloud, Monitor, Smartphone, Globe, TestTube, BrainCircuit, Layers, Info, X, BookOpen, Play } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const TechnologyTrainingLandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [courseDetailsModal, setCourseDetailsModal] = useState({ isOpen: false, course: null });
  const coursePricingData = useCoursePricing();
  const coursePricing = coursePricingData?.pricing || {};
  const pricingLoading = coursePricingData?.loading || false;
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Mapping from course titles to centralized pricing IDs
  const titleToIdMap = {
    'MERN Stack Developer': 'mern-stack-developer',
    'Full Stack Python Developer': 'full-stack-python-developer',
    'Java Full Stack Developer': 'java-full-stack-developer',
    'AWS Cloud Architect': 'aws-cloud-architect',
    'DevOps Engineer Bootcamp': 'devops-engineer-bootcamp',
    'Azure Cloud Solutions': 'azure-cloud-solutions',
    'Data Science with Python': 'data-science-with-python',
    'AI & Machine Learning Engineer': 'ai-ml-engineer',
    'Business Intelligence Analyst': 'business-intelligence-analyst',
    'Automation Testing Engineer': 'automation-testing-engineer',
    'Manual Testing Specialist': 'manual-testing-specialist',
    'React Native Developer': 'react-native-developer',
    'Flutter App Developer': 'flutter-app-developer'
  };

  // Helper function to get pricing info
  const getPricing = (title) => {
    const courseId = titleToIdMap[title];
    if (pricingLoading) {
      return { finalPrice: '...', originalPrice: '...' };
    }
    if (coursePricing && courseId && coursePricing[courseId]) {
      return {
        finalPrice: formatPrice(coursePricing[courseId].finalPrice),
        originalPrice: formatPrice(coursePricing[courseId].originalPrice)
      };
    }
    // Fallback to hardcoded prices if not found
    return null;
  };

  const categories = [
    { id: 'all', name: 'All Programs', icon: Target },
    { id: 'fullstack', name: 'Full Stack Development', icon: Code },
    { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud },
    { id: 'ai', name: 'AI & Data Science', icon: BrainCircuit },
    { id: 'testing', name: 'Software Testing', icon: TestTube },
    { id: 'mobile', name: 'Mobile Development', icon: Smartphone }
  ];

  const technologyPrograms = [
    // Full Stack Development
    {
      id: 1,
      category: 'fullstack',
      title: 'MERN Stack Developer',
      duration: '6 months',
      level: 'Beginner to Advanced',
      priceKey: 'mern-stack-developer', // Add priceKey for dynamic pricing
      price: '₹30,000', // Fallback price
      originalPrice: '₹45,000', // Fallback original price
      description: 'Master full-stack development with MongoDB, Express.js, React, and Node.js.',
      detailedDescription: 'Become a professional MERN Stack developer with comprehensive training in modern web development. Learn to build scalable, full-stack applications using the most in-demand technologies in the industry.',
      features: [
        'React.js Frontend Development',
        'Node.js Backend Development',
        'MongoDB Database Design',
        'RESTful API Development',
        'Authentication & Security',
        'Deployment & DevOps Basics'
      ],
      curriculum: [
        {
          module: 'Frontend Development',
          topics: ['React Fundamentals', 'State Management (Redux)', 'Component Architecture', 'Hooks & Context API', 'UI Libraries (Material-UI, Tailwind)']
        },
        {
          module: 'Backend Development', 
          topics: ['Node.js & Express.js', 'API Design & Development', 'Middleware & Authentication', 'File Handling & Uploads', 'Error Handling']
        },
        {
          module: 'Database Design',
          topics: ['MongoDB Fundamentals', 'Schema Design', 'Aggregation Pipeline', 'Indexing & Performance', 'Database Security']
        },
        {
          module: 'Full Stack Integration',
          topics: ['Frontend-Backend Communication', 'Real-time Features (Socket.io)', 'Testing & Debugging', 'Deployment (AWS, Heroku)', 'Performance Optimization']
        }
      ],
      prerequisites: ['Basic HTML, CSS, JavaScript knowledge', 'Understanding of programming concepts'],
      careerOutcomes: ['Full Stack Developer', 'React Developer', 'Node.js Developer', 'JavaScript Engineer'],
      enrolled: 45,
      maxSeats: 60,
      highlights: ['Industry Projects Portfolio', 'Live Coding Sessions', 'Job Placement Support'],
      color: 'blue'
    },
    {
      id: 2,
      category: 'fullstack',
      title: 'Full Stack Python Developer',
      duration: '6 months',
      level: 'Beginner to Advanced', 
      price: '₹28,000',
      originalPrice: '₹42,000',
      description: 'Complete Python web development with Django/Flask frameworks.',
      features: [
        'Python Programming Mastery',
        'Django Web Framework',
        'Flask Microservices',
        'PostgreSQL Database',
        'REST APIs & GraphQL',
        'Docker & Deployment'
      ],
      enrolled: 38,
      maxSeats: 50,
      highlights: ['Real-world Projects', 'Industry Mentorship', 'Certification Included'],
      color: 'green',
      curriculum: [
        {
          title: 'Python Fundamentals',
          topics: ['Python Syntax & Data Types', 'Control Structures', 'Functions & Modules', 'Object-Oriented Programming']
        },
        {
          title: 'Web Development with Django',
          topics: ['Django Framework', 'Models & Views', 'Templates & Forms', 'User Authentication']
        },
        {
          title: 'Database & APIs',
          topics: ['PostgreSQL Integration', 'REST API Development', 'GraphQL Implementation', 'Database Optimization']
        },
        {
          title: 'Advanced Topics',
          topics: ['Flask Microservices', 'Testing & Debugging', 'Docker Containerization', 'Cloud Deployment']
        }
      ],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of web technologies',
        'Familiarity with databases helpful'
      ],
      careerOutcomes: [
        'Python Full Stack Developer',
        'Django Developer',
        'Backend Engineer',
        'Web Application Developer'
      ]
    },
    {
      id: 3,
      category: 'fullstack',
      title: 'Java Full Stack Developer',
      duration: '7 months',
      level: 'Beginner to Advanced',
      price: '₹32,000',
      originalPrice: '₹48,000', 
      description: 'Enterprise Java development with Spring Boot and modern frameworks.',
      features: [
        'Core Java & Advanced Concepts',
        'Spring Boot Framework',
        'Hibernate ORM',
        'Angular/React Frontend',
        'Microservices Architecture',
        'Enterprise Application Development'
      ],
      enrolled: 52,
      maxSeats: 70,
      highlights: ['Enterprise Focus', 'Spring Certification Prep', 'Corporate Training Style'],
      color: 'orange',
      curriculum: [
        {
          title: 'Core Java Mastery',
          topics: ['Java Fundamentals', 'OOP Concepts', 'Exception Handling', 'Collections Framework']
        },
        {
          title: 'Spring Boot Development',
          topics: ['Spring Boot Framework', 'Dependency Injection', 'Spring MVC', 'Spring Security']
        },
        {
          title: 'Database & ORM',
          topics: ['Hibernate ORM', 'JPA Implementation', 'Database Design', 'Transaction Management']
        },
        {
          title: 'Frontend Integration',
          topics: ['Angular/React Integration', 'RESTful Services', 'Microservices Architecture', 'Enterprise Deployment']
        }
      ],
      prerequisites: [
        'Basic programming concepts',
        'Understanding of object-oriented programming',
        'Familiarity with databases'
      ],
      careerOutcomes: [
        'Java Full Stack Developer',
        'Spring Boot Developer',
        'Enterprise Java Developer',
        'Backend Engineer'
      ]
    },

    // Cloud & DevOps
    {
      id: 4,
      category: 'cloud',
      title: 'AWS Cloud Architect',
      duration: '4 months',
      level: 'Intermediate to Advanced',
      price: '₹25,000',
      originalPrice: '₹35,000',
      description: 'Master AWS cloud services and architecture patterns.',
      features: [
        'AWS Core Services (EC2, S3, RDS)',
        'Cloud Architecture Design',
        'Infrastructure as Code (Terraform)',
        'Container Services (ECS, EKS)',
        'Serverless Computing (Lambda)',
        'AWS Security & Compliance'
      ],
      enrolled: 34,
      maxSeats: 45,
      highlights: ['AWS Certification Prep', 'Hands-on Labs', 'Industry Projects'],
      color: 'yellow',
      curriculum: [
        {
          title: 'AWS Foundation',
          topics: ['AWS Console & CLI', 'EC2 & Storage Services', 'VPC & Networking', 'IAM & Security']
        },
        {
          title: 'Architecture Design',
          topics: ['Well-Architected Framework', 'High Availability', 'Scalability Patterns', 'Cost Optimization']
        },
        {
          title: 'Advanced Services',
          topics: ['Container Services (ECS/EKS)', 'Serverless (Lambda)', 'Database Services', 'Monitoring & Logging']
        },
        {
          title: 'Infrastructure as Code',
          topics: ['CloudFormation', 'Terraform', 'CI/CD Pipelines', 'DevOps Best Practices']
        }
      ],
      prerequisites: [
        'Basic cloud computing knowledge',
        'Linux/Windows system administration',
        'Networking fundamentals'
      ],
      careerOutcomes: [
        'AWS Solutions Architect',
        'Cloud Engineer',
        'DevOps Engineer',
        'Cloud Consultant'
      ]
    },
    {
      id: 5,
      category: 'cloud',
      title: 'DevOps Engineer Bootcamp',
      duration: '5 months',
      level: 'Intermediate',
      price: '₹27,000',
      originalPrice: '₹40,000',
      description: 'Complete DevOps pipeline automation and infrastructure management.',
      features: [
        'CI/CD Pipeline Setup',
        'Docker & Kubernetes',
        'Jenkins Automation',
        'Infrastructure Monitoring',
        'Git Version Control Advanced',
        'Cloud Platform Integration'
      ],
      enrolled: 41,
      maxSeats: 55,
      highlights: ['Industry-standard Tools', 'Real Pipeline Projects', 'DevOps Certification'],
      color: 'purple',
      curriculum: [
        {
          title: 'DevOps Fundamentals',
          topics: ['DevOps Culture & Practices', 'Git Advanced Workflows', 'Linux System Administration', 'Shell Scripting']
        },
        {
          title: 'CI/CD Pipelines',
          topics: ['Jenkins Setup & Configuration', 'Pipeline as Code', 'Automated Testing', 'Deployment Strategies']
        },
        {
          title: 'Containerization',
          topics: ['Docker Fundamentals', 'Kubernetes Orchestration', 'Container Security', 'Microservices Deployment']
        },
        {
          title: 'Infrastructure & Monitoring',
          topics: ['Infrastructure as Code', 'Terraform/Ansible', 'Monitoring & Logging', 'Cloud Platform Integration']
        }
      ],
      prerequisites: [
        'Basic Linux knowledge',
        'Understanding of software development',
        'Networking fundamentals'
      ],
      careerOutcomes: [
        'DevOps Engineer',
        'Site Reliability Engineer',
        'Cloud Infrastructure Engineer',
        'Automation Specialist'
      ]
    },
    {
      id: 6,
      category: 'cloud',
      title: 'Azure Cloud Solutions',
      duration: '4 months',
      level: 'Intermediate',
      price: '₹24,000',
      originalPrice: '₹36,000',
      description: 'Microsoft Azure cloud services and enterprise solutions.',
      features: [
        'Azure Core Services',
        'Azure Active Directory',
        'Azure DevOps Services',
        'Power Platform Integration',
        'Azure Security Center',
        'Hybrid Cloud Solutions'
      ],
      enrolled: 28,
      maxSeats: 40,
      highlights: ['Microsoft Partnership', 'AZ-900/104 Certification Prep', 'Enterprise Focus'],
      color: 'blue',
      curriculum: [
        {
          title: 'Azure Fundamentals',
          topics: ['Azure Portal & CLI', 'Virtual Machines', 'Storage Solutions', 'Virtual Networks']
        },
        {
          title: 'Identity & Security',
          topics: ['Azure Active Directory', 'Role-based Access Control', 'Azure Security Center', 'Key Vault']
        },
        {
          title: 'Application Services',
          topics: ['App Services', 'Azure Functions', 'Logic Apps', 'API Management']
        },
        {
          title: 'DevOps & Integration',
          topics: ['Azure DevOps', 'Power Platform', 'Hybrid Solutions', 'Migration Strategies']
        }
      ],
      prerequisites: [
        'Basic cloud computing concepts',
        'Windows/Linux administration',
        'Networking fundamentals'
      ],
      careerOutcomes: [
        'Azure Solutions Architect',
        'Azure Developer',
        'Cloud Administrator',
        'Microsoft Cloud Specialist'
      ]
    },

    // AI & Data Science
    {
      id: 7,
      category: 'ai',
      title: 'Data Science with Python',
      duration: '5 months',
      level: 'Beginner to Advanced',
      price: '₹20,000',
      originalPrice: '₹30,000',
      description: 'Comprehensive data science program with machine learning.',
      features: [
        'Python for Data Analysis',
        'Pandas, NumPy, Matplotlib',
        'Machine Learning Algorithms',
        'Deep Learning with TensorFlow',
        'Data Visualization',
        'Real-world Data Projects'
      ],
      enrolled: 56,
      maxSeats: 70,
      highlights: ['Kaggle Competition Projects', 'Industry Datasets', 'ML Certification'],
      color: 'green',
      curriculum: [
        {
          title: 'Python Fundamentals for Data Science',
          topics: ['Python Basics', 'Data Structures', 'NumPy Arrays', 'Pandas DataFrames']
        },
        {
          title: 'Data Analysis & Visualization',
          topics: ['Data Cleaning', 'Exploratory Data Analysis', 'Matplotlib & Seaborn', 'Statistical Analysis']
        },
        {
          title: 'Machine Learning',
          topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering']
        },
        {
          title: 'Advanced ML & Deep Learning',
          topics: ['Neural Networks', 'TensorFlow & Keras', 'Computer Vision', 'Natural Language Processing']
        },
        {
          title: 'Real-world Projects',
          topics: ['Kaggle Competitions', 'Industry Case Studies', 'Model Deployment', 'MLOps Basics']
        }
      ],
      prerequisites: [
        'Basic programming knowledge (any language)',
        'High school level mathematics',
        'Interest in data and problem-solving'
      ],
      careerOutcomes: [
        'Data Scientist positions',
        'Machine Learning Engineer roles',
        'Business Analyst opportunities',
        'Research and Analytics positions'
      ]
    },
    {
      id: 8,
      category: 'ai',
      title: 'AI & Machine Learning Engineer',
      duration: '6 months',
      level: 'Intermediate to Advanced',
      price: '₹35,000',
      originalPrice: '₹50,000',
      description: 'Advanced AI development with deep learning and neural networks.',
      features: [
        'Advanced Machine Learning',
        'Deep Neural Networks',
        'Computer Vision (OpenCV)',
        'Natural Language Processing',
        'MLOps & Model Deployment',
        'AI Ethics & Responsible AI'
      ],
      enrolled: 23,
      maxSeats: 35,
      highlights: ['AI Research Projects', 'Industry Mentorship', 'Advanced Certification'],
      color: 'purple',
      curriculum: [
        {
          title: 'Advanced Machine Learning',
          topics: ['Ensemble Methods', 'Feature Engineering', 'Model Optimization', 'Advanced Algorithms']
        },
        {
          title: 'Deep Learning',
          topics: ['Neural Networks', 'CNNs & RNNs', 'Transfer Learning', 'Generative Models']
        },
        {
          title: 'Computer Vision & NLP',
          topics: ['OpenCV Applications', 'Image Processing', 'Natural Language Processing', 'Text Analytics']
        },
        {
          title: 'MLOps & Deployment',
          topics: ['Model Deployment', 'MLOps Pipeline', 'AI Ethics', 'Production Scaling']
        }
      ],
      prerequisites: [
        'Strong Python programming skills',
        'Mathematics and statistics background',
        'Basic machine learning knowledge'
      ],
      careerOutcomes: [
        'AI/ML Engineer',
        'Research Scientist',
        'Computer Vision Engineer',
        'NLP Specialist'
      ]
    },
    {
      id: 9,
      category: 'ai',
      title: 'Business Intelligence Analyst',
      duration: '3 months',
      level: 'Beginner to Intermediate',
      price: '₹18,000',
      originalPrice: '₹25,000',
      description: 'Business analytics with Power BI, Tableau, and SQL.',
      features: [
        'Advanced SQL & Database Design',
        'Power BI Dashboard Creation',
        'Tableau Data Visualization',
        'Excel Advanced Analytics',
        'Business Intelligence Strategy',
        'Data Warehousing Concepts'
      ],
      enrolled: 47,
      maxSeats: 60,
      highlights: ['Business-focused Projects', 'Industry Datasets', 'BI Certification'],
      color: 'blue',
      curriculum: [
        {
          title: 'SQL & Database Fundamentals',
          topics: ['Advanced SQL Queries', 'Database Design', 'Data Modeling', 'ETL Processes']
        },
        {
          title: 'Business Intelligence Tools',
          topics: ['Power BI Development', 'Tableau Visualizations', 'Dashboard Design', 'Report Automation']
        },
        {
          title: 'Data Analysis & Strategy',
          topics: ['Excel Advanced Functions', 'Statistical Analysis', 'Business Metrics', 'KPI Development']
        },
        {
          title: 'Data Warehousing',
          topics: ['Data Warehouse Concepts', 'OLAP Systems', 'Data Integration', 'Performance Optimization']
        }
      ],
      prerequisites: [
        'Basic database knowledge',
        'Excel proficiency',
        'Business analytics interest'
      ],
      careerOutcomes: [
        'Business Intelligence Analyst',
        'Data Analyst',
        'Reporting Specialist',
        'Business Data Consultant'
      ]
    },

    // Software Testing
    {
      id: 10,
      category: 'testing',
      title: 'Automation Testing Engineer',
      duration: '4 months',
      level: 'Beginner to Advanced',
      price: '₹18,000',
      originalPrice: '₹28,000',
      description: 'Comprehensive test automation with modern frameworks.',
      features: [
        'Selenium WebDriver Automation',
        'TestNG/JUnit Frameworks',
        'API Testing (REST Assured)',
        'Performance Testing (JMeter)',
        'Mobile App Testing',
        'CI/CD Integration'
      ],
      enrolled: 39,
      maxSeats: 50,
      highlights: ['Automation Framework Development', 'Industry Tools', 'ISTQB Certification Prep'],
      color: 'orange',
      curriculum: [
        {
          title: 'Testing Fundamentals',
          topics: ['Testing Principles', 'Test Design Techniques', 'Test Planning', 'Defect Management']
        },
        {
          title: 'Selenium Automation',
          topics: ['WebDriver Basics', 'Page Object Model', 'TestNG Framework', 'Data-Driven Testing']
        },
        {
          title: 'API & Performance Testing',
          topics: ['REST API Testing', 'REST Assured', 'JMeter Performance Testing', 'Load Testing']
        },
        {
          title: 'Advanced Automation',
          topics: ['Mobile Testing', 'Cross-browser Testing', 'CI/CD Integration', 'Framework Development']
        }
      ],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of web applications',
        'Software testing basics'
      ],
      careerOutcomes: [
        'Automation Test Engineer',
        'QA Automation Lead',
        'Test Framework Developer',
        'SDET (Software Developer in Test)'
      ]
    },
    {
      id: 11,
      category: 'testing',
      title: 'Manual Testing Specialist',
      duration: '2 months',
      level: 'Beginner',
      price: '₹12,000',
      originalPrice: '₹18,000',
      description: 'Foundation in manual testing methodologies and processes.',
      features: [
        'Software Testing Fundamentals',
        'Test Case Design Techniques',
        'Bug Reporting & Tracking',
        'Agile Testing Methodologies',
        'Database Testing',
        'Web & Mobile Testing'
      ],
      enrolled: 61,
      maxSeats: 80,
      highlights: ['Entry-level Friendly', 'Real Project Experience', 'Job Placement Assistance'],
      color: 'green',
      curriculum: [
        {
          title: 'Testing Fundamentals',
          topics: ['SDLC & STLC', 'Testing Types', 'Test Planning', 'Test Strategy']
        },
        {
          title: 'Test Design & Execution',
          topics: ['Test Case Design', 'Boundary Value Analysis', 'Equivalence Partitioning', 'Test Execution']
        },
        {
          title: 'Defect Management',
          topics: ['Bug Life Cycle', 'Defect Reporting', 'Severity & Priority', 'Tracking Tools']
        },
        {
          title: 'Specialized Testing',
          topics: ['Database Testing', 'Web Testing', 'Mobile Testing', 'Agile Testing']
        }
      ],
      prerequisites: [
        'Basic computer knowledge',
        'Understanding of software applications',
        'Attention to detail'
      ],
      careerOutcomes: [
        'Manual Test Engineer',
        'QA Analyst',
        'Software Tester',
        'Quality Assurance Specialist'
      ]
    },

    // Mobile Development
    {
      id: 12,
      category: 'mobile',
      title: 'React Native Developer',
      duration: '4 months',
      level: 'Intermediate',
      price: '₹22,000',
      originalPrice: '₹32,000',
      description: 'Cross-platform mobile app development with React Native.',
      features: [
        'React Native Framework',
        'Navigation & State Management',
        'Native Module Integration',
        'App Store Deployment',
        'Push Notifications',
        'Mobile App Security'
      ],
      enrolled: 31,
      maxSeats: 40,
      highlights: ['Cross-platform Focus', 'App Store Publishing', 'Industry Projects'],
      color: 'blue',
      curriculum: [
        {
          title: 'React Native Fundamentals',
          topics: ['Setup & Environment', 'Components & Styling', 'Navigation Basics', 'State Management']
        },
        {
          title: 'Advanced UI Development',
          topics: ['Custom Components', 'Animations', 'Platform-specific Code', 'Responsive Design']
        },
        {
          title: 'Native Integration',
          topics: ['Native Modules', 'Camera & Gallery', 'Geolocation', 'Device APIs']
        },
        {
          title: 'Data & Backend',
          topics: ['API Integration', 'AsyncStorage', 'SQLite Database', 'Offline Support']
        },
        {
          title: 'App Distribution',
          topics: ['App Store Guidelines', 'Google Play Store', 'Code Signing', 'CI/CD Pipelines']
        }
      ],
      prerequisites: [
        'Strong JavaScript and React knowledge',
        'Understanding of mobile app concepts',
        'Basic knowledge of mobile development lifecycle'
      ],
      careerOutcomes: [
        'React Native Developer',
        'Cross-platform Mobile Developer',
        'Mobile App Consultant',
        'Hybrid App Specialist'
      ]
    },
    {
      id: 13,
      category: 'mobile',
      title: 'Flutter App Developer',
      duration: '4 months', 
      level: 'Beginner to Intermediate',
      price: '₹20,000',
      originalPrice: '₹30,000',
      description: 'Google Flutter framework for beautiful mobile applications.',
      features: [
        'Dart Programming Language',
        'Flutter Widget System',
        'State Management (Bloc, Provider)',
        'Firebase Integration',
        'Custom UI Components',
        'App Performance Optimization'
      ],
      enrolled: 26,
      maxSeats: 35,
      highlights: ['Google Certification Path', 'Beautiful UI Focus', 'Firebase Integration'],
      color: 'purple',
      curriculum: [
        {
          title: 'Dart & Flutter Basics',
          topics: ['Dart Programming', 'Flutter Framework', 'Widgets & Layouts', 'Navigation']
        },
        {
          title: 'State Management',
          topics: ['StatefulWidget', 'Provider Pattern', 'Bloc Architecture', 'Redux Pattern']
        },
        {
          title: 'Backend Integration',
          topics: ['Firebase Services', 'REST API Integration', 'Database Operations', 'Authentication']
        },
        {
          title: 'Advanced Features',
          topics: ['Custom Widgets', 'Animations', 'Performance Optimization', 'App Publishing']
        }
      ],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of mobile app concepts',
        'Object-oriented programming familiarity'
      ],
      careerOutcomes: [
        'Flutter Developer',
        'Mobile App Developer',
        'Cross-platform Developer',
        'Freelance App Developer'
      ]
    }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? technologyPrograms 
    : technologyPrograms.filter(program => program.category === selectedCategory);

  const handleEnrollment = (courseTitle) => {
    const courseType = titleToIdMap[courseTitle];
    setEnrollmentModal({ isOpen: true, courseType, courseName: courseTitle });
  };

  const handleCourseDetails = (course) => {
    setCourseDetailsModal({ isOpen: true, course });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-600 to-blue-800 border-blue-500',
      green: 'from-green-600 to-green-800 border-green-500',
      purple: 'from-purple-600 to-purple-800 border-purple-500',
      orange: 'from-orange-600 to-orange-800 border-orange-500',
      yellow: 'from-yellow-600 to-yellow-800 border-yellow-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground variant="specialized">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technology Training Programs
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              Master Modern Tech Stack • Build Your Career
            </p>
            <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto">
              Comprehensive technology training programs designed for developers, cloud engineers, data scientists, and IT professionals
            </p>

            {/* Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">13+</div>
                <div className="text-sm text-gray-300">Specializations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">500+</div>
                <div className="text-sm text-gray-300">Students Placed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">95%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">₹18K-₹35K</div>
                <div className="text-sm text-gray-300">Price Range</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <IconComponent size={18} />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group"
              >
                {/* Program Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(program.color)} bg-opacity-20 text-white border`}>
                      {program.level}
                    </div>
                    <div className="text-right">
                      {(() => {
                        const dynamicPricing = getPricing(program.title);
                        return dynamicPricing ? (
                          <>
                            <div className="text-2xl font-bold text-white">{dynamicPricing.finalPrice}</div>
                            <div className="text-sm text-gray-400 line-through">{dynamicPricing.originalPrice}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-white">{program.price}</div>
                            <div className="text-sm text-gray-400 line-through">{program.originalPrice}</div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3">{program.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {program.enrolled}/{program.maxSeats}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">What You'll Learn:</h4>
                  <ul className="space-y-1">
                    {program.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {program.features.length > 4 && (
                      <li className="text-sm text-blue-400">+{program.features.length - 4} more topics...</li>
                    )}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {program.highlights.map((highlight, highlightIndex) => (
                      <span
                        key={highlightIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                    <span>Enrollment Progress</span>
                    <span>{Math.round((program.enrolled / program.maxSeats) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(program.enrolled / program.maxSeats) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses(program.color)}`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCourseDetails(program)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Info size={16} />
                    Course Details
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEnrollment(program.title)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Enroll Now
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      </AnimatedBackground>

      {/* Call to Action */}
      <AnimatedBackground variant="contact" className="py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Tech Career Today</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of students who have transformed their careers with our industry-focused training programs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdvisorOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300"
              >
                Get Career Guidance
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-slate-600 hover:border-green-500 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Download Curriculum
              </motion.button>
            </div>
          </motion.div>
        </section>
      </AnimatedBackground>

      {/* Modals */}
      {/* Course Details Modal */}
      {courseDetailsModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {courseDetailsModal.course?.title}
                </h3>
                <p className="text-slate-600">
                  {courseDetailsModal.course?.description}
                </p>
              </div>
              <button
                onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Course Details */}
              <div className="space-y-6">
                {/* Course Highlights */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    Course Highlights
                  </h4>
                  <ul className="space-y-2">
                    {courseDetailsModal.course?.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <ArrowRight size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {courseDetailsModal.course?.prerequisites && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Prerequisites</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <ArrowRight size={14} className="text-orange-600 mt-1 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Career Outcomes */}
                {courseDetailsModal.course?.careerOutcomes && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Career Outcomes</h4>
                    <ul className="space-y-2">
                      {courseDetailsModal.course.careerOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <ArrowRight size={14} className="text-green-600 mt-1 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column - Curriculum */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Play size={18} className="text-blue-600" />
                  Curriculum
                </h4>
                <div className="space-y-3">
                  {courseDetailsModal.course?.curriculum?.map((module, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 mb-2">
                        Module {index + 1}: {module.title}
                      </h5>
                      <ul className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-slate-600 flex items-start gap-2">
                            <ArrowRight size={12} className="text-slate-400 mt-1 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const dynamicPricing = getPricing(courseDetailsModal.course?.title);
                    return dynamicPricing ? dynamicPricing.finalPrice : courseDetailsModal.course?.price;
                  })()}
                </div>
                <div className="text-sm text-slate-600">Duration: {courseDetailsModal.course?.duration}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCourseDetailsModal({ isOpen: false, course: null });
                  handleEnrollment(courseDetailsModal.course?.title);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              >
                Enroll Now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <EnhancedEnrollmentModal 
        isOpen={enrollmentModal.isOpen}
        onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '' })}
        courseType={enrollmentModal.courseType}
        courseName={enrollmentModal.courseName}
        coursePrice={pricingLoading ? undefined : (coursePricing?.[enrollmentModal.courseType]?.finalPrice)}
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default TechnologyTrainingLandingPage;