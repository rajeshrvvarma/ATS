import React, { useState, useEffect } from 'react';
// ...existing code...
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Star, CheckCircle, ArrowRight, Timer, Award, Target } from 'lucide-react';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';

const DefensiveBootcampLandingPage = () => {
  // ...existing code...
  const [currentEnrolled, setCurrentEnrolled] = useState(23); // Dynamic counter
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 8, minutes: 42 });
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  
  // Get centralized pricing
  const coursePricingData = useCoursePricing();
  const coursePricing = coursePricingData?.pricing || {};
  const pricingLoading = coursePricingData?.loading || false;

  // Simulate real-time enrollment updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 30 seconds
        setCurrentEnrolled(prev => Math.min(prev + 1, 100));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const curriculum = [
    {
      day: 1,
      title: 'Cybersecurity Fundamentals',
      sessions: ['Threat Landscape Overview', 'Career Paths & Opportunities'],
      duration: '3 hours',
      highlights: ['Live Q&A with industry expert', 'Career roadmap session']
    },
    {
      day: 2, 
      title: 'Network Security Essentials',
      sessions: ['Network Security Basics', 'Hands-on with Security Tools'],
      duration: '3 hours',
      highlights: ['Wireshark demonstration', 'Network monitoring setup']
    },
    {
      day: 3,
      title: 'Incident Response & SIEM',
      sessions: ['Incident Response Process', 'SIEM Tools Introduction'],
      duration: '3 hours', 
      highlights: ['Real incident case studies', 'SIEM dashboard walkthrough']
    },
    {
      day: 4,
      title: 'Vulnerability Management',
      sessions: ['Vulnerability Assessment', 'Patch Management'],
      duration: '3 hours',
      highlights: ['Hands-on vulnerability scanning', 'Remediation planning']
    },
    {
      day: 5,
      title: 'Security Operations Center',
      sessions: ['SOC Operations', 'Monitoring & Alerting'],
      duration: '3 hours',
      highlights: ['SOC analyst daily routine', 'Alert triage techniques']
    },
    {
      day: 6,
      title: 'Compliance & Risk Management', 
      sessions: ['Security Frameworks', 'Risk Assessment'],
      duration: '3 hours',
      highlights: ['ISO 27001 overview', 'Risk calculation methods']
    },
    {
      day: 7,
      title: 'Career Launch & Certification',
      sessions: ['Resume Building', 'Interview Preparation', 'Certification Exam'],
      duration: '4 hours',
      highlights: ['Mock interviews', 'Job application strategy', 'Certificate ceremony']
    }
  ];

  const includes = [
    'Live interactive sessions (21+ hours)',
    'All sessions recorded for lifetime access',
    'Comprehensive course materials (PDFs)',
    'Hands-on lab exercises and tools',
    'Industry-recognized certificate of completion', 
    'Resume review and optimization',
    'Job placement assistance and referrals',
    'Access to exclusive alumni network',
    'Monthly career guidance sessions (6 months)',
    '24/7 doubt clearing support group'
  ];

  const getCurrentPrice = () => {
    // Use centralized pricing if available, otherwise fallback to tiered pricing
    const defensiveBootcampPrice = coursePricing?.['defensive-bootcamp'];
    
    if (defensiveBootcampPrice && !pricingLoading) {
      return {
        price: formatPrice(defensiveBootcampPrice.finalPrice),
        label: 'Current Price',
        savings: `Save ${formatPrice(defensiveBootcampPrice.originalPrice - defensiveBootcampPrice.finalPrice)}!`,
        originalPrice: formatPrice(defensiveBootcampPrice.originalPrice)
      };
    }
    
    // Fallback to tiered pricing logic
    if (currentEnrolled < 50) return { price: '₹499', label: 'Early Bird Special', savings: 'Save ₹500!' };
    if (currentEnrolled < 90) return { price: '₹799', label: 'Regular Price', savings: 'Save ₹200!' };
    return { price: '₹999', label: 'Final Price', savings: 'Last chance!' };
  };

  const pricing = getCurrentPrice();
  const seatsLeft = 100 - currentEnrolled;
  const progressPercentage = (currentEnrolled / 100) * 100;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <AnimatedBackground variant="bootcamp" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-purple">
                7-Day Defensive Security Bootcamp
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                From Zero to SOC Analyst Ready
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Join 100+ cybersecurity enthusiasts in this intensive bootcamp designed to kickstart your cybersecurity career
              </p>
            </motion.div>

            {/* Pricing & Enrollment Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/90 via-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">{pricing.price}</div>
                  <div className="text-lg text-white mb-1">{pricing.label}</div>
                  <div className="text-green-400 font-semibold bg-green-500/10 px-3 py-1 rounded-full inline-block">{pricing.savings}</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Seats Filled</span>
                    <span className="text-white font-semibold">{currentEnrolled}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {seatsLeft <= 10 ? (
                    <div className="text-red-400 font-semibold flex items-center">
                      <Timer className="h-5 w-5 mr-2" />
                      Only {seatsLeft} seats left!
                    </div>
                  ) : (
                    <div className="text-gray-300">{seatsLeft} seats remaining</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-red-900 rounded-xl p-6 mb-8 border border-red-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-100">⏰ Registration Closes In:</h3>
              <div className="flex justify-center space-x-6 text-center">
                <div className="bg-red-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-sm text-red-200">Days</div>
                </div>
                <div className="bg-red-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-sm text-red-200">Hours</div>
                </div>
                <div className="bg-red-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-sm text-red-200">Minutes</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
              onClick={() => setIsEnrollmentModalOpen(true)}
            >
              Secure Your Seat Now - {pricing.price}
              <ArrowRight className="ml-2 h-6 w-6 inline" />
            </motion.button>
          </div>
        </div>
      </AnimatedBackground>

      {/* Key Benefits */}
      <AnimatedBackground variant="bootcamp" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our Bootcamp?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-blue-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Job-Ready Skills</h3>
              <p className="text-blue-100">Learn practical skills that employers actually want. No theory overload.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-purple-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Learn with Peers</h3>
              <p className="text-purple-100">Join 100+ like-minded individuals on the same cybersecurity journey.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-green-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Industry Recognition</h3>
              <p className="text-green-100">Get certified and stand out in the competitive job market.</p>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>

      <AnimatedBackground variant="bootcamp" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">7-Day Intensive Curriculum</h2>
          <div className="space-y-6">
            {curriculum.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{day.title}</h3>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {day.duration}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-300">Sessions:</h4>
                    <ul className="space-y-1">
                      {day.sessions.map((session, idx) => (
                        <li key={idx} className="text-gray-400">• {session}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-300">Highlights:</h4>
                    <ul className="space-y-1">
                      {day.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-400 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-2" />
                          {highlight}
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
      <AnimatedBackground variant="bootcamp" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Everything You Get</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {includes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center bg-gray-700 rounded-lg p-4"
              >
                <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBackground>

      {/* Enrollment Form */}
      <AnimatedBackground variant="bootcamp" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8">Secure Your Seat Now!</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Current Experience Level</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="">Select your experience level</option>
                  <option value="complete-beginner">Complete Beginner</option>
                  <option value="some-it-knowledge">Some IT Knowledge</option>
                  <option value="it-professional">IT Professional</option>
                  <option value="career-changer">Career Changer</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Why do you want to learn cybersecurity?</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Tell us about your goals and motivation..."
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-400">{pricing.price}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {pricing.label} • {pricing.savings}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                Enroll Now - Pay {pricing.price}
              </button>

              <div className="text-center text-sm text-gray-400">
                <p>🔒 Secure payment • 💯 Money-back guarantee if not satisfied</p>
                <p>📧 You'll receive confirmation email with batch details</p>
              </div>
            </form>
          </div>
        </div>
      </AnimatedBackground>

      {/* Footer CTA */}
      <AnimatedBackground variant="bootcamp" className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss This Opportunity!</h2>
          <p className="text-xl text-gray-200 mb-6">
            Only {seatsLeft} seats left • Registration closes in {timeLeft.days} days
          </p>
          <button
            className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsEnrollmentModalOpen(true)}
          >
            Join Now - {pricing.price}
          </button>
        </div>
      </AnimatedBackground>

      {/* Enrollment Modal */}
      <EnhancedEnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        courseType="defensive-bootcamp"
        courseName="7-Day Intensive Cybersecurity Bootcamp"
        coursePrice={pricingLoading ? undefined : (coursePricing?.['defensive-bootcamp']?.finalPrice)}
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default DefensiveBootcampLandingPage;