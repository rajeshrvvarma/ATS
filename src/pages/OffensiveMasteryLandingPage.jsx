import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Star, CheckCircle, ArrowRight, BookOpen, Award, Target, Briefcase, TrendingUp, Sword, Zap, Code2 } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const OffensiveMasteryLandingPage = () => {
  const [currentEnrolled, setCurrentEnrolled] = useState(4); // Dynamic counter for small batch
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('full');
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Simulate real-time enrollment updates (slower for premium)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance every minute for premium course
        setCurrentEnrolled(prev => Math.min(prev + 1, 15));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const curriculum = [
    {
      week: 1,
      title: 'Advanced Reconnaissance & Intelligence',
      modules: ['Threat Intelligence', 'Behavioral Analysis'],
      sessions: [
        'Advanced OSINT & Social Engineering',
        'Network Reconnaissance Techniques',
        'Target Profiling & Attack Surface Analysis', 
        'Custom Tool Development for Recon',
        'Threat Intelligence Integration'
      ],
      projects: ['Custom OSINT Framework', 'Advanced Footprinting Campaign'],
      duration: '15 hours'
    },
    {
      week: 2,
      title: 'Web Application Security Mastery',
      modules: ['Web Application Security', 'Penetration Testing Methodology'],
      sessions: [
        'Advanced Web Application Attacks',
        'API Security Testing',
        'Client-Side Exploitation Techniques',
        'Modern Web Framework Vulnerabilities',
        'Custom Payload Development'
      ],
      projects: ['Complete Web App Pentest', 'Custom Exploit Development'],
      duration: '15 hours'
    },
    {
      week: 3,
      title: 'Network Penetration & Infrastructure',
      modules: ['Network Security Fundamentals', 'Linux Administration'],
      sessions: [
        'Advanced Network Exploitation',
        'Active Directory Attacks',
        'Lateral Movement & Persistence',
        'Privilege Escalation Techniques',
        'Network Segmentation Bypass'
      ],
      projects: ['Enterprise Network Pentest', 'AD Attack Chain'],
      duration: '18 hours'
    },
    {
      week: 4,
      title: 'Mobile & Wireless Security',
      modules: ['Wireless & Mobile Security', 'Ethical Hacking Foundation'],
      sessions: [
        'Mobile Application Security Testing',
        'Wireless Network Exploitation',
        'IoT Device Penetration Testing',
        'Bluetooth & NFC Attacks',
        'Mobile Malware Analysis'
      ],
      projects: ['Mobile App Security Assessment', 'Wireless Infrastructure Audit'],
      duration: '12 hours'
    },
    {
      week: 5,
      title: 'Advanced Exploitation Techniques',
      modules: ['Reverse Engineering', 'Malware Analysis Fundamentals'],
      sessions: [
        'Binary Exploitation & Buffer Overflows',
        'Return-Oriented Programming (ROP)',
        'Kernel Exploitation Fundamentals',
        'Custom Shellcode Development',
        'Anti-Forensics Techniques'
      ],
      projects: ['Custom Exploit Development', 'Advanced Payload Creation'],
      duration: '18 hours'
    },
    {
      week: 6,
      title: 'Cloud Security & Modern Infrastructure',
      modules: ['AWS Fundamentals', 'AWS Security Services'],
      sessions: [
        'Cloud Platform Penetration Testing',
        'Container Security Assessment',
        'Serverless Application Testing',
        'DevSecOps Pipeline Attacks',
        'Infrastructure as Code Vulnerabilities'
      ],
      projects: ['Cloud Infrastructure Pentest', 'Container Escape Techniques'],
      duration: '15 hours'
    },
    {
      week: 7,
      title: 'Red Team Operations & Advanced Techniques',
      modules: ['Advanced Threat Detection', 'Incident Response Planning'],
      sessions: [
        'Red Team Methodology & Planning',
        'Command & Control Infrastructure',
        'Covert Channel Communication',
        'Advanced Persistence Mechanisms',
        'Operational Security (OpSec)'
      ],
      projects: ['Red Team Exercise Simulation', 'C2 Infrastructure Setup'],
      duration: '15 hours'
    },
    {
      week: 8,
      title: 'Professional Development & Certification',
      modules: ['Professional Skills Integration'],
      sessions: [
        'Advanced Report Writing & Communication',
        'Client Presentation & Remediation Planning',
        'Ethical Hacking Business & Consulting',
        'Industry Certifications Preparation',
        'Career Advancement in Offensive Security'
      ],
      projects: ['Professional Pentest Report', 'Client Presentation Delivery'],
      duration: '12 hours'
    }
  ];

  const includes = [
    'Live interactive sessions (120+ hours)',
    'Small elite batch of only 15 students',
    'Personal mentorship from senior pentesters',
    'All sessions recorded for lifetime access',
    '15+ hands-on projects and real-world labs',
    'Custom penetration testing lab environment',
    'Industry-recognized ethical hacker certification', 
    'Advanced toolkit and custom scripts',
    'Direct connections to cybersecurity firms',
    'Guaranteed interview opportunities',
    'Resume optimization for pentesting roles',
    'Mock technical interviews with experts',
    'Access to exclusive red team community',
    'Monthly advanced technique workshops (12 months)',
    '24/7 priority mentorship and support',
    'Professional LinkedIn profile optimization',
    'Salary negotiation coaching for pentesting roles',
    'Industry conference networking opportunities'
  ];

  const paymentPlans = [
    {
      id: 'full',
      name: 'Full Payment',
      price: '₹7,999',
      originalPrice: '₹12,999',
      savings: 'Save ₹5,000',
      benefits: ['Best Value', 'Lifetime Access', 'All Bonuses Included'],
      popular: true
    },
    {
      id: 'installment',
      name: 'Two Installments', 
      price: '₹4,499 + ₹4,000',
      originalPrice: '₹11,999',
      savings: 'Save ₹3,500',
      benefits: ['Flexible Payment', 'Start Now, Pay Later', 'No Interest'],
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly Payment',
      price: '₹4,499/month x 2',
      originalPrice: '₹11,999',
      savings: 'Save ₹3,000', 
      benefits: ['Cash Flow Friendly', 'Easy on Budget', 'No Hidden Fees'],
      popular: false
    }
  ];

  const seatsLeft = 15 - currentEnrolled;
  const progressPercentage = (currentEnrolled / 15) * 100;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-indigo py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🔥 ELITE PROGRAM • LIMITED TO 15 HACKERS
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                2-Month Offensive Security Mastery
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                Advanced Ethical Hacking & Red Team Certification
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Transform into an elite penetration tester with advanced offensive techniques, custom exploit development, and red team operations
              </p>
            </motion.div>

            {/* Premium Badge & Enrollment Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-red-800 to-orange-800 rounded-2xl p-8 mb-8 border border-red-600"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl font-bold text-red-300 mb-2">₹7,999</div>
                  <div className="text-lg text-gray-300 mb-1 line-through">₹12,999</div>
                  <div className="text-indigo-400 font-semibold">Save ₹5,000 with full payment</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-200">Elite Seats Taken</span>
                    <span className="text-white font-semibold">{currentEnrolled}/15</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {seatsLeft <= 3 ? (
                    <div className="text-red-400 font-semibold flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Only {seatsLeft} elite seats left!
                    </div>
                  ) : (
                    <div className="text-gray-300">{seatsLeft} exclusive seats available</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Key Differentiators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-red-800 bg-opacity-50 rounded-lg p-4 border border-red-600">
                <Sword className="h-8 w-8 text-red-300 mb-2" />
                <div className="font-semibold">Elite Training</div>
                <div className="text-sm text-gray-300">Only 15 students for intensive mentorship</div>
              </div>
              <div className="bg-orange-800 bg-opacity-50 rounded-lg p-4 border border-orange-600">
                <Zap className="h-8 w-8 text-indigo-300 mb-2" />
                <div className="font-semibold">Real-World Labs</div>
                <div className="text-sm text-gray-300">Advanced labs with enterprise environments</div>
              </div>
              <div className="bg-yellow-800 bg-opacity-50 rounded-lg p-4 border border-yellow-600">
                <Code2 className="h-8 w-8 text-yellow-300 mb-2" />
                <div className="font-semibold">Custom Exploits</div>
                <div className="text-sm text-gray-300">Learn to develop your own exploits and tools</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setIsEnrollmentModalOpen(true)}
            >
              Reserve Elite Hacker Seat
              <ArrowRight className="ml-2 h-6 w-6 inline" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Elite Benefits */}
      <div className="bg-gradient-indigo py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Elite Offensive Program?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-red-700 to-red-800 rounded-xl p-6 border border-red-600">
              <Target className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Techniques</h3>
              <p className="text-gray-200">Master zero-day exploitation, custom payload development, and red team operations.</p>
            </div>
            <div className="text-center bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl p-6 border border-orange-600">
              <BookOpen className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Elite Curriculum</h3>
              <p className="text-gray-200">120+ hours of advanced content with 15+ hands-on projects and custom labs.</p>
            </div>
            <div className="text-center bg-gradient-to-br from-yellow-700 to-yellow-800 rounded-xl p-6 border border-yellow-600">
              <Award className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Elite Mentorship</h3>
              <p className="text-gray-200">Direct guidance from senior pentesters and red team leaders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Curriculum */}
      <div className="bg-gradient-indigo py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Comprehensive 8-Week Elite Curriculum</h2>
          <div className="space-y-6">
            {curriculum.map((week, index) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-red-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                    {week.week}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{week.title}</h3>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {week.duration}
                    </div>
                  </div>
                </div>
                
                {/* Modules Covered This Week */}
                {week.modules && week.modules.length > 0 && (
                  <div className="mb-4 bg-slate-800/50 rounded-lg p-4 border border-red-600/30">
                    <h4 className="font-semibold mb-2 text-red-300 flex items-center gap-2">
                      <span className="text-sm">🧩</span> Modules Covered:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {week.modules.map((module, idx) => (
                        <span key={idx} className="bg-red-700/30 text-red-200 px-3 py-1 rounded-full text-sm border border-red-600/50">
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-red-300">Advanced Sessions:</h4>
                    <ul className="space-y-2">
                      {week.sessions.map((session, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start">
                          <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          {session}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-indigo-300">Elite Projects:</h4>
                    <ul className="space-y-2">
                      {week.projects.map((project, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start">
                          <Star className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gradient-indigo py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Elite Package Includes</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {includes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 border border-red-600"
              >
                <CheckCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" />
                <span className="text-gray-100">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Plans */}
      <div className="bg-gradient-indigo py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Investment Plan</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {paymentPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`relative bg-gray-800 rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                  selectedPaymentPlan === plan.id 
                    ? 'border-red-500 bg-red-900 bg-opacity-20' 
                    : 'border-gray-600 hover:border-gray-500'
                } ${plan.popular ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
                onClick={() => setSelectedPaymentPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-red-300 mb-1">{plan.price}</div>
                  <div className="text-gray-400 line-through text-sm mb-1">{plan.originalPrice}</div>
                  <div className="text-indigo-400 font-semibold text-sm">{plan.savings}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-red-400 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={plan.id}
                    checked={selectedPaymentPlan === plan.id}
                    onChange={() => setSelectedPaymentPlan(plan.id)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                    selectedPaymentPlan === plan.id 
                      ? 'bg-red-500 border-red-500' 
                      : 'border-gray-400'
                  }`}>
                    {selectedPaymentPlan === plan.id && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-indigo py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited to 15 Elite Hackers Only</h2>
          <p className="text-xl text-gray-200 mb-6">
            Only {seatsLeft} exclusive seats remaining • Advanced mentorship guaranteed
          </p>
          <button
            className="btn-gradient font-bold py-3 px-8 text-lg"
            onClick={() => setIsEnrollmentModalOpen(true)}
          >
            Reserve Elite Seat - ₹7,999
          </button>
        </div>
      </div>

      {/* Enhanced Enrollment Modal - centralized pricing */}
      <EnhancedEnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        courseType="offensive-mastery"
        courseName="Offensive Security Mastery"
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default OffensiveMasteryLandingPage;