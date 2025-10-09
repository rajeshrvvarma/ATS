import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Star, CheckCircle, ArrowRight, Timer, Award, Target, Sword, Zap, Shield } from 'lucide-react';
import EnrollmentModal from '@/components/EnrollmentModal.jsx';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const OffensiveBootcampLandingPage = () => {
  const [currentEnrolled, setCurrentEnrolled] = useState(18); // Dynamic counter
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 6, minutes: 32 });
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Simulate real-time enrollment updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 30 seconds
        setCurrentEnrolled(prev => Math.min(prev + 1, 80));
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
      title: 'Ethical Hacking Fundamentals',
      sessions: ['Introduction to Penetration Testing', 'Legal & Ethical Framework'],
      duration: '3 hours',
      highlights: ['Hacker mindset development', 'Legal compliance essentials']
    },
    {
      day: 2, 
      title: 'Information Gathering & Reconnaissance',
      sessions: ['OSINT Techniques', 'Footprinting & Scanning'],
      duration: '3 hours',
      highlights: ['Advanced Google dorking', 'Network enumeration techniques']
    },
    {
      day: 3,
      title: 'Vulnerability Assessment',
      sessions: ['Vulnerability Scanning', 'Manual Testing Techniques'],
      duration: '3 hours', 
      highlights: ['Nessus & OpenVAS hands-on', 'Custom vulnerability validation']
    },
    {
      day: 4,
      title: 'Web Application Penetration Testing',
      sessions: ['OWASP Top 10', 'SQL Injection & XSS'],
      duration: '4 hours',
      highlights: ['Burp Suite mastery', 'Real-world web app exploitation']
    },
    {
      day: 5,
      title: 'Network Penetration Testing',
      sessions: ['Network Exploitation', 'Post-Exploitation Techniques'],
      duration: '4 hours',
      highlights: ['Metasploit framework', 'Lateral movement strategies']
    },
    {
      day: 6,
      title: 'Wireless Security & Social Engineering', 
      sessions: ['WiFi Penetration Testing', 'Social Engineering Attacks'],
      duration: '3 hours',
      highlights: ['Aircrack-ng usage', 'Phishing campaign creation']
    },
    {
      day: 7,
      title: 'Report Writing & Career Guidance',
      sessions: ['Penetration Testing Reports', 'Career in Ethical Hacking'],
      duration: '3 hours',
      highlights: ['Professional report templates', 'Industry job opportunities']
    }
  ];

  const includes = [
    'Live interactive sessions (23+ hours)',
    'All sessions recorded for lifetime access',
    'Kali Linux VM setup and tools',
    'Hands-on lab exercises with real targets',
    'Industry-recognized ethical hacker certificate', 
    'Professional penetration testing toolkit',
    'Resume review for cybersecurity roles',
    'Job placement assistance in pentesting',
    'Access to exclusive hacker community',
    'Monthly advanced technique workshops (6 months)',
    '24/7 technical support and mentorship'
  ];

  const getCurrentPrice = () => {
    if (currentEnrolled < 40) return { price: '₹599', label: 'Early Bird Special', savings: 'Save ₹400!' };
    if (currentEnrolled < 70) return { price: '₹899', label: 'Regular Price', savings: 'Save ₹200!' };
    return { price: '₹999', label: 'Final Price', savings: 'Last chance!' };
  };

  const pricing = getCurrentPrice();
  const seatsLeft = 80 - currentEnrolled;
  const progressPercentage = (currentEnrolled / 80) * 100;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <AnimatedBackground variant="offensive" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                7-Day Ethical Hacking Bootcamp
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                Master Penetration Testing & Offensive Security
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Join 80+ aspiring ethical hackers in this intensive bootcamp designed to master penetration testing skills
              </p>
            </motion.div>

            {/* Pricing & Enrollment Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-8 mb-8 border border-red-700"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl font-bold text-red-400 mb-2">{pricing.price}</div>
                  <div className="text-lg text-gray-300 mb-1">{pricing.label}</div>
                  <div className="text-red-400 font-semibold">{pricing.savings}</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Hackers Enrolled</span>
                    <span className="text-white font-semibold">{currentEnrolled}/80</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
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
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setIsEnrollmentModalOpen(true)}
            >
              Join Ethical Hacker Bootcamp - {pricing.price}
              <ArrowRight className="ml-2 h-6 w-6 inline" />
            </motion.button>
          </div>
        </div>
      </AnimatedBackground>

      {/* Key Benefits */}
      <AnimatedBackground variant="offensive" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Ethical Hacking?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-red-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-red-500/20 hover:border-red-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Sword className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Think Like a Hacker</h3>
              <p className="text-red-100">Learn the offensive mindset to better defend against real threats.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-orange-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">High Demand Skills</h3>
              <p className="text-orange-100">Penetration testers are among the highest paid cybersecurity professionals.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center bg-gradient-to-br from-gray-700/80 via-yellow-900/30 to-transparent backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Ethical Framework</h3>
              <p className="text-yellow-100">Master ethical hacking within legal boundaries and professional standards.</p>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Curriculum */}
      <AnimatedBackground variant="offensive" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">7-Day Intensive Curriculum</h2>
          <div className="space-y-6">
            {curriculum.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-red-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
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
                          <Star className="h-4 w-4 text-red-400 mr-2" />
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
      <AnimatedBackground variant="offensive" className="py-16">
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
                <CheckCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" />
                <span className="text-gray-200">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBackground>

      {/* Tools & Technologies */}
      <AnimatedBackground variant="offensive" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Tools You'll Master</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'Kali Linux', 'Metasploit', 'Burp Suite', 'Nmap',
              'Wireshark', 'Nessus', 'OWASP ZAP', 'Aircrack-ng',
              'Sqlmap', 'John the Ripper', 'Hashcat', 'Nikto'
            ].map((tool, index) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-4 text-center border border-red-600"
              >
                <div className="font-semibold text-white">{tool}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBackground>

      {/* Footer CTA */}
      <AnimatedBackground variant="offensive" className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Ethical Hacking Journey!</h2>
          <p className="text-xl text-gray-200 mb-6">
            Only {seatsLeft} seats left • Registration closes in {timeLeft.days} days
          </p>
          <button
            className="bg-white text-red-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsEnrollmentModalOpen(true)}
          >
            Join Now - {pricing.price}
          </button>
        </div>
      </AnimatedBackground>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        courseType="bootcamp"
        courseTitle="7-Day Ethical Hacking Bootcamp"
        price={pricing.price}
      />
      
      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default OffensiveBootcampLandingPage;