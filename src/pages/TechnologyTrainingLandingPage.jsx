import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Users, Award, Target, Code, Database, Server, Cloud, Monitor, Smartphone, Globe, TestTube, BrainCircuit, Layers } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const TechnologyTrainingLandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
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
      features: [
        'React.js Frontend Development',
        'Node.js Backend Development',
        'MongoDB Database Design',
        'RESTful API Development',
        'Authentication & Security',
        'Deployment & DevOps Basics'
      ],
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
      color: 'green'
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
      color: 'orange'
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
      color: 'yellow'
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
      color: 'purple'
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
      color: 'blue'
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
      color: 'green'
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
      color: 'purple'
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
      color: 'blue'
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
      color: 'orange'
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
      color: 'green'
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
      color: 'blue'
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
      color: 'purple'
    }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? technologyPrograms 
    : technologyPrograms.filter(program => program.category === selectedCategory);

  const handleEnrollment = (courseTitle) => {
    const courseType = titleToIdMap[courseTitle];
    setEnrollmentModal({ isOpen: true, courseType, courseName: courseTitle });
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

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEnrollment(program.title)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Enroll Now
                  <ArrowRight size={16} />
                </motion.button>
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