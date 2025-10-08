import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Star, CheckCircle, ArrowRight, BookOpen, Award, Target, Briefcase, TrendingUp } from 'lucide-react';
import EnrollmentModal from '@/components/EnrollmentModal.jsx';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';

const PremiumProgramLandingPage = () => {
  const [currentEnrolled, setCurrentEnrolled] = useState(7); // Dynamic counter for small batch
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('full');
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // Simulate real-time enrollment updates (slower for premium)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance every minute for premium course
        setCurrentEnrolled(prev => Math.min(prev + 1, 20));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const curriculum = [
    {
      week: 1,
      title: 'Cybersecurity Fundamentals & Foundations',
      sessions: [
        'Cybersecurity Landscape & Career Paths',
        'Network Security Fundamentals', 
        'Operating System Security',
        'Cryptography Basics',
        'Security Frameworks Overview'
      ],
      projects: ['Network Security Assessment', 'System Hardening Lab'],
      duration: '12 hours'
    },
    {
      week: 2,
      title: 'Threat Intelligence & Analysis',
      sessions: [
        'Threat Intelligence Fundamentals',
        'OSINT Techniques',
        'Malware Analysis Basics', 
        'Threat Hunting Concepts',
        'IOC Analysis'
      ],
      projects: ['Threat Intelligence Report', 'Malware Sample Analysis'],
      duration: '12 hours'
    },
    {
      week: 3,
      title: 'Security Operations Center (SOC)',
      sessions: [
        'SOC Operations & Procedures',
        'SIEM Implementation & Management',
        'Log Analysis & Correlation',
        'Incident Response Planning',
        'Alert Investigation Techniques'
      ],
      projects: ['SOC Playbook Creation', 'SIEM Rule Development'],
      duration: '15 hours'
    },
    {
      week: 4,
      title: 'Vulnerability Management & Assessment',
      sessions: [
        'Vulnerability Assessment Methodologies',
        'Penetration Testing Fundamentals',
        'Security Scanning Tools',
        'Risk Assessment & Prioritization',
        'Patch Management Strategies'
      ],
      projects: ['Complete Vulnerability Assessment', 'Risk Register Creation'],
      duration: '15 hours'
    },
    {
      week: 5,
      title: 'Compliance & Governance',
      sessions: [
        'Security Frameworks (ISO 27001, NIST)',
        'Compliance Management',
        'Audit Preparation & Execution',
        'Policy Development',
        'Risk Management Frameworks'
      ],
      projects: ['Compliance Gap Analysis', 'Security Policy Document'],
      duration: '12 hours'
    },
    {
      week: 6,
      title: 'Advanced Security Technologies',
      sessions: [
        'Cloud Security Fundamentals',
        'Zero Trust Architecture',
        'Identity & Access Management',
        'Security Automation & Orchestration',
        'Emerging Threats & Technologies'
      ],
      projects: ['Cloud Security Assessment', 'IAM Implementation'],
      duration: '15 hours'
    },
    {
      week: 7,
      title: 'Digital Forensics & Investigation',
      sessions: [
        'Digital Forensics Fundamentals',
        'Evidence Collection & Analysis',
        'Memory & Network Forensics',
        'Mobile Device Forensics',
        'Legal & Ethical Considerations'
      ],
      projects: ['Digital Forensics Investigation', 'Evidence Report'],
      duration: '12 hours'
    },
    {
      week: 8,
      title: 'Career Development & Capstone',
      sessions: [
        'Industry Networking & Personal Branding',
        'Advanced Interview Preparation',
        'Salary Negotiation Strategies',
        'Capstone Project Presentation',
        'Certification Exam & Career Planning'
      ],
      projects: ['Capstone Security Project', 'Professional Portfolio'],
      duration: '10 hours'
    }
  ];

  const includes = [
    'Live interactive sessions (100+ hours)',
    'Small batch of only 20 students',
    'Personal mentorship from industry experts',
    'All sessions recorded for lifetime access',
    '10+ hands-on projects and labs',
    'Comprehensive course materials & resources',
    'Industry-recognized certificate of completion', 
    'Advanced resume review and optimization',
    'Mock interviews with real hiring managers',
    'Direct connections to hiring partners',
    'Guaranteed interview opportunities',
    'Access to exclusive alumni network',
    'Monthly career guidance sessions (12 months)',
    '24/7 priority support and mentorship',
    'Professional LinkedIn profile optimization',
    'Salary negotiation coaching'
  ];

  const paymentPlans = [
    {
      id: 'full',
      name: 'Full Payment',
      price: '₹5,999',
      originalPrice: '₹8,999',
      savings: 'Save ₹3,000',
      benefits: ['Best Value', 'Lifetime Access', 'All Bonuses Included'],
      popular: true
    },
    {
      id: 'installment',
      name: 'Two Installments', 
      price: '₹3,299 + ₹2,999',
      originalPrice: '₹7,999',
      savings: 'Save ₹1,700',
      benefits: ['Flexible Payment', 'Start Now, Pay Later', 'No Interest'],
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly Payment',
      price: '₹3,299/month x 2',
      originalPrice: '₹7,999',
      savings: 'Save ₹1,400', 
      benefits: ['Cash Flow Friendly', 'Easy on Budget', 'No Hidden Fees'],
      popular: false
    }
  ];

  const seatsLeft = 20 - currentEnrolled;
  const progressPercentage = (currentEnrolled / 20) * 100;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <AnimatedBackground variant="premium" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg animate-pulse">
                🏆 PREMIUM PROGRAM • LIMITED TO 20 STUDENTS ✨
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                2-Month Cybersecurity Mastery Program
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                Advanced Professional Certification Program
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Transform into a cybersecurity professional with personalized mentorship, hands-on projects, and direct industry connections
              </p>
            </motion.div>

            {/* Premium Badge & Enrollment Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-2xl p-8 mb-8 border border-purple-600"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl font-bold text-purple-300 mb-2">₹5,999</div>
                  <div className="text-lg text-gray-300 mb-1 line-through">₹8,999</div>
                  <div className="text-green-400 font-semibold">Save ₹3,000 with full payment</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-200">Premium Seats Taken</span>
                    <span className="text-white font-semibold">{currentEnrolled}/20</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {seatsLeft <= 5 ? (
                    <div className="text-red-400 font-semibold flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Only {seatsLeft} premium seats left!
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
              <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4 border border-purple-600">
                <Users className="h-8 w-8 text-purple-300 mb-2" />
                <div className="font-semibold">Small Batch</div>
                <div className="text-sm text-gray-300">Only 20 students for personalized attention</div>
              </div>
              <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 border border-blue-600">
                <Briefcase className="h-8 w-8 text-blue-300 mb-2" />
                <div className="font-semibold">Industry Mentors</div>
                <div className="text-sm text-gray-300">Direct guidance from working professionals</div>
              </div>
              <div className="bg-green-800 bg-opacity-50 rounded-lg p-4 border border-green-600">
                <TrendingUp className="h-8 w-8 text-green-300 mb-2" />
                <div className="font-semibold">Job Guarantee</div>
                <div className="text-sm text-gray-300">Guaranteed interview opportunities</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setIsEnrollmentModalOpen(true)}
            >
              Reserve Your Premium Seat
              <ArrowRight className="ml-2 h-6 w-6 inline" />
            </motion.button>
          </div>
        </div>
      </AnimatedBackground>

      {/* Premium Benefits */}
      <AnimatedBackground variant="premium" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Premium Program?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-purple-700 to-purple-800 rounded-xl p-6 border border-purple-600">
              <Target className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Guaranteed Results</h3>
              <p className="text-gray-200">Direct connections to hiring partners with guaranteed interview opportunities.</p>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-6 border border-blue-600">
              <BookOpen className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Curriculum</h3>
              <p className="text-gray-200">100+ hours of advanced content with 10+ hands-on projects and labs.</p>
            </div>
            <div className="text-center bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-6 border border-green-600">
              <Award className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personal Mentorship</h3>
              <p className="text-gray-200">1-on-1 guidance from industry experts throughout your journey.</p>
            </div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Detailed Curriculum */}
      <AnimatedBackground variant="premium" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Comprehensive 8-Week Curriculum</h2>
          <div className="space-y-6">
            {curriculum.map((week, index) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-300">Sessions Covered:</h4>
                    <ul className="space-y-2">
                      {week.sessions.map((session, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {session}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-300">Hands-on Projects:</h4>
                    <ul className="space-y-2">
                      {week.projects.map((project, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start">
                          <Star className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
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
      </AnimatedBackground>

      {/* What's Included */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Premium Package Includes</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {includes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4 border border-gray-600"
              >
                <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-100">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Plans */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Payment Plan</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {paymentPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`relative bg-gray-800 rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                  selectedPaymentPlan === plan.id 
                    ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                    : 'border-gray-600 hover:border-gray-500'
                } ${plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
                onClick={() => setSelectedPaymentPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-purple-300 mb-1">{plan.price}</div>
                  <div className="text-gray-400 line-through text-sm mb-1">{plan.originalPrice}</div>
                  <div className="text-green-400 font-semibold text-sm">{plan.savings}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
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
                      ? 'bg-purple-500 border-purple-500' 
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
      </section>

      {/* Enrollment Form */}
      <section id="enrollment-form" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
            <h2 className="text-3xl font-bold text-center mb-8">Reserve Your Premium Seat</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Current Experience Level</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years IT)</option>
                    <option value="experienced">Experienced (3+ years IT)</option>
                    <option value="career-changer">Career Changer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Current Role</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="">Select your current role</option>
                    <option value="student">Student</option>
                    <option value="it-support">IT Support</option>
                    <option value="developer">Developer</option>
                    <option value="network-admin">Network Admin</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Career Goals & Motivation</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                  placeholder="Tell us about your cybersecurity career goals and what you hope to achieve..."
                />
              </div>

              <div className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg p-6 border border-purple-600">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Selected Plan:</span>
                  <span className="text-xl font-bold text-purple-300">
                    {paymentPlans.find(plan => plan.id === selectedPaymentPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-3xl font-bold text-purple-300">
                    {paymentPlans.find(plan => plan.id === selectedPaymentPlan)?.price}
                  </span>
                </div>
                <div className="text-sm text-green-400">
                  {paymentPlans.find(plan => plan.id === selectedPaymentPlan)?.savings}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                Reserve Premium Seat Now
              </button>

              <div className="text-center text-sm text-gray-400">
                <p>🔒 Secure payment • 💯 Money-back guarantee • 🎯 Job placement guarantee</p>
                <p>📧 You'll receive priority confirmation and mentor assignment details</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited to 20 Premium Students Only</h2>
          <p className="text-xl text-gray-200 mb-6">
            Only {seatsLeft} exclusive seats remaining • Personal mentorship guaranteed
          </p>
          <button
            className="bg-white text-purple-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsEnrollmentModalOpen(true)}
          >
            Reserve Premium Seat - ₹5,999
          </button>
        </div>
      </section>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        courseType="premium"
        courseTitle="2-Month Cybersecurity Mastery Program"
        price="₹5,999"
      />
    </div>
  );
};

export default PremiumProgramLandingPage;