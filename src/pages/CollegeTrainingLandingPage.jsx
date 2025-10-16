import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, BookOpen, Trophy, Target, CheckCircle, Star, Clock, Award, TrendingUp, Briefcase, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AiCareerAdvisor from '../components/AiCareerAdvisor';
import ScrollNavigation from '../components/ScrollNavigation';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';

const CollegeTrainingLandingPage = () => {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(2847);
  const [selectedProgram, setSelectedProgram] = useState('cybersecurity');
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  
  // Load centralized pricing with simpler pattern
  const coursePricingData = useCoursePricing();
  const coursePricing = coursePricingData?.pricing || {};
  const pricingLoading = coursePricingData?.loading || false;

  // Helper function to get pricing for college programs
  const getCollegePricing = (courseId) => {
    if (pricingLoading) {
      return { finalPrice: '...', originalPrice: '...' };
    }
    if (coursePricing && coursePricing[courseId]) {
      return {
        finalPrice: formatPrice(coursePricing[courseId].finalPrice),
        originalPrice: formatPrice(coursePricing[courseId].originalPrice)
      };
    }
    // Fallback to hardcoded prices if not found
    return null;
  };

  useEffect(() => {
    // Simulate visitor count updates
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Bulk Training Excellence",
      description: "Specialized programs designed for 100-200 student batches with industry-focused curriculum"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Placement-Ready Skills", 
      description: "Skills specifically chosen by recruiters from top companies for immediate employment"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Industry Certifications",
      description: "Students receive industry-recognized certificates that boost their resume value"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
      title: "Job Placement Support",
      description: "Direct connections with hiring partners and dedicated placement assistance"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: "Career Growth Focus",
      description: "Training aligned with industry trends and emerging cybersecurity roles"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      title: "Hands-on Learning",
      description: "Practical labs and projects that prepare students for real-world challenges"
    }
  ];

  const successStories = [
    {
      college: "VIT University",
      studentsPlaced: 156,
      avgSalary: "₹5.2 LPA",
      topCompany: "TCS, Wipro, Infosys"
    },
    {
      college: "SRM University", 
      studentsPlaced: 134,
      avgSalary: "₹4.8 LPA",
      topCompany: "Accenture, HCL, Tech Mahindra"
    },
    {
      college: "Amity University",
      studentsPlaced: 178,
      avgSalary: "₹5.5 LPA", 
      topCompany: "IBM, Capgemini, DXC Technology"
    }
  ];

  const programData = {
    cybersecurity: {
      title: "Cybersecurity Training",
      description: "Comprehensive cybersecurity training designed specifically for engineering colleges",
      curriculum: [
        {
          week: "Week 1-2",
          title: "Cybersecurity Fundamentals",
          topics: ["Network Security Basics", "Threat Landscape", "Security Frameworks", "Risk Assessment"]
        },
        {
          week: "Week 3-4", 
          title: "Defensive Security Skills",
          topics: ["SOC Operations", "Incident Response", "Log Analysis", "Security Monitoring"]
        },
        {
          week: "Week 5-6",
          title: "Ethical Hacking Basics", 
          topics: ["Penetration Testing", "Vulnerability Assessment", "Web Application Security", "Network Scanning"]
        },
        {
          week: "Week 7-8",
          title: "Industry Projects & Certification",
          topics: ["Capstone Project", "Industry Case Studies", "Certification Exam", "Placement Preparation"]
        }
      ]
    },
    technology: {
      title: "Technology Training",
      description: "Modern technology stack training covering development, cloud, AI, and testing",
      curriculum: [
        {
          week: "Week 1-3",
          title: "Programming Fundamentals",
          topics: ["Python/Java Basics", "Data Structures", "Algorithms", "Object-Oriented Programming"]
        },
        {
          week: "Week 4-6", 
          title: "Web Development Stack",
          topics: ["Frontend (React/Angular)", "Backend (Node.js/Spring)", "Database Design", "API Development"]
        },
        {
          week: "Week 7-9",
          title: "Cloud & DevOps", 
          topics: ["AWS/Azure Basics", "Docker Containers", "CI/CD Pipelines", "Infrastructure as Code"]
        },
        {
          week: "Week 10-12",
          title: "Specialization & Projects",
          topics: ["AI/ML Basics OR Testing", "Industry Projects", "Portfolio Development", "Job Preparation"]
        }
      ]
    }
  };

  const currentProgram = programData[selectedProgram];

  // Dynamic pricing tiers using centralized pricing
  const pricingTiers = {
    cybersecurity: [
      {
        name: "Standard Batch",
        students: "50-99 Students",
        courseId: "college-cybersecurity-standard",
        price: getCollegePricing('college-cybersecurity-standard')?.finalPrice || "₹399",
        originalPrice: getCollegePricing('college-cybersecurity-standard')?.originalPrice || "₹599",
        features: [
          "8-week comprehensive training",
          "Cybersecurity curriculum",
          "Basic certification",
          "Email support",
          "Basic placement assistance"
        ]
      },
      {
        name: "Premium Batch",
        students: "100-149 Students",
        courseId: "college-cybersecurity-premium",
        price: getCollegePricing('college-cybersecurity-premium')?.finalPrice || "₹299",
        originalPrice: getCollegePricing('college-cybersecurity-premium')?.originalPrice || "₹499",
        popular: true,
        features: [
          "8-week intensive training",
          "Advanced hands-on labs",
          "Premium certification", 
          "Dedicated support manager",
          "Priority placement support",
          "Industry mentor sessions"
        ]
      },
      {
        name: "Elite Batch",
        students: "150+ Students",
        courseId: "college-cybersecurity-elite",
        price: getCollegePricing('college-cybersecurity-elite')?.finalPrice || "₹199",
        originalPrice: getCollegePricing('college-cybersecurity-elite')?.originalPrice || "₹399",
        features: [
          "8-week comprehensive program",
          "Real-world project assignments",
          "Elite certification with portfolio",
          "24/7 support & mentorship",
          "Guaranteed placement assistance", 
          "Direct recruiter connects",
          "Alumni network access"
        ]
      }
    ],
    technology: [
      {
        name: "Standard Batch",
        students: "50-99 Students",
        courseId: "college-technology-standard",
        price: getCollegePricing('college-technology-standard')?.finalPrice || "₹599",
        originalPrice: getCollegePricing('college-technology-standard')?.originalPrice || "₹899",
        features: [
          "12-week comprehensive training",
          "Multi-technology curriculum",
          "Basic certification",
          "Email support",
          "Basic placement assistance"
        ]
      },
      {
        name: "Premium Batch",
        students: "100-149 Students",
        courseId: "college-technology-premium",
        price: getCollegePricing('college-technology-premium')?.finalPrice || "₹499",
        originalPrice: getCollegePricing('college-technology-premium')?.originalPrice || "₹799",
        popular: true,
        features: [
          "12-week intensive training",
          "Advanced project-based learning",
          "Premium certification", 
          "Dedicated support manager",
          "Priority placement support",
          "Industry mentor sessions",
          "Portfolio development"
        ]
      },
      {
        name: "Elite Batch",
        students: "150+ Students",
        courseId: "college-technology-elite",
        price: getCollegePricing('college-technology-elite')?.finalPrice || "₹399",
        originalPrice: getCollegePricing('college-technology-elite')?.originalPrice || "₹699",
        features: [
          "12-week comprehensive program",
          "Real-world industry projects",
          "Elite certification with portfolio",
          "24/7 support & mentorship",
          "Guaranteed placement assistance", 
          "Direct recruiter connects",
          "Alumni network access",
          "Specialization tracks"
        ]
      }
    ]
  };

  const currentPricingTiers = pricingTiers[selectedProgram];

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm">College Bulk Training Program</span>
            </div>
            
            {/* Program Selection Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800/50 rounded-full p-1 backdrop-blur-sm border border-slate-700">
                <motion.button
                  onClick={() => setSelectedProgram('cybersecurity')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedProgram === 'cybersecurity'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛡️ Cybersecurity Training
                </motion.button>
                <motion.button
                  onClick={() => setSelectedProgram('technology')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedProgram === 'technology'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💻 Technology Training
                </motion.button>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transform Your Students Into
              <span className="block">
                {selectedProgram === 'cybersecurity' ? 'Cybersecurity' : 'Technology'} Professionals
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              {currentProgram.description}. Train 100-200 students with industry-focused curriculum and guaranteed placement support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button 
                onClick={() => setEnrollmentModal({ 
                  isOpen: true, 
                  courseType: 'college-training', 
                  courseName: `${currentProgram.title} - Bulk Training Program` 
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Get Bulk Pricing Quote
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-slate-600 hover:border-blue-500 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Download Course Curriculum
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>500+ Colleges Served</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>15,000+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>85% Placement Success</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Success Stories */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">College Success Stories</h2>
            <p className="text-slate-300 text-lg">Real results from engineering colleges across India</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-400">{story.college}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Students Placed:</span>
                    <span className="font-semibold text-green-400">{story.studentsPlaced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Salary:</span>
                    <span className="font-semibold text-yellow-400">{story.avgSalary}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">Top Recruiters:</span>
                    <p className="text-sm font-medium mt-1">{story.topCompany}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Pricing Section */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Pricing for Every College</h2>
            <p className="text-slate-300 text-lg">Choose the perfect plan based on your student batch size</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {currentPricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-slate-800/50 rounded-xl p-6 border transition-all duration-300 backdrop-blur-sm ${
                  tier.popular 
                    ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/25' 
                    : 'border-slate-700 hover:border-blue-500/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="text-slate-400 text-sm mb-3">{tier.students}</div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400 line-through">{tier.originalPrice}</span>
                    <span className="text-slate-400 text-sm">/student</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEnrollmentModal({ 
                    isOpen: true, 
                    courseType: tier.courseId, 
                    courseName: `${currentProgram.title} - ${tier.name}` 
                  })}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    tier.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border border-slate-600 hover:border-blue-500 text-slate-300'
                  }`}
                >
                  Get Quote for {tier.students}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Benefits Section */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our College Training Program?</h2>
            <p className="text-slate-300 text-lg">Designed specifically for engineering students and fresh graduates</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors backdrop-blur-sm"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-slate-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Curriculum Section */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {selectedProgram === 'cybersecurity' ? '8-Week' : '12-Week'} Industry-Ready Curriculum
            </h2>
            <p className="text-slate-300 text-lg">
              {currentProgram.title} program designed by industry experts
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {currentProgram.curriculum.map((week, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors backdrop-blur-sm"
              >
                <div className="text-blue-400 font-semibold mb-2">{week.week}</div>
                <h3 className="text-xl font-semibold mb-3">{week.title}</h3>
                <ul className="space-y-1 text-slate-400">
                  {week.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Train Your Students?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join 500+ engineering colleges that have successfully trained over 15,000 students with our proven curriculum.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEnrollmentModal({ 
                  isOpen: true, 
                  courseType: 'college-training', 
                  courseName: `${currentProgram.title} - College Training Program` 
                })}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300"
              >
                Start Your Program Today
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-slate-600 hover:border-green-500 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Schedule Demo Session
              </motion.button>
            </div>

            <p className="text-slate-400 text-sm">
              Over {visitorCount.toLocaleString()} colleges have visited us this month
            </p>
          </motion.div>
        </section>
      </div>

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

export default CollegeTrainingLandingPage;