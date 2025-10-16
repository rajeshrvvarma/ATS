// Events & Batches Page - Shows upcoming batches, bootcamps, and free workshops
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  CheckCircle,
  ArrowRight,
  Star,
  User,
  BookOpen,
  Target,
  Award,
  AlertCircle,
  Filter,
  Grid,
  List,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AdvancedTabs from '@/components/AdvancedTabs.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import { getAllEvents } from '@/data/allEventsData.js';

const EventsBatchesPage = ({ onNavigate }) => {
  // Tab state handled by AdvancedTabs; category filter defaults to 'all'
  const [selectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // State for dynamic events from Firestore (will be merged with static data)
  const [firestoreEvents, setFirestoreEvents] = useState([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  const { pricing, loading: pricingLoading } = useCoursePricing();

  // Fetch events from Firestore on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingFirestore(true);
        const allEvents = await getAllEvents();
        setFirestoreEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events from Firestore:', error);
        // Keep empty array if fetch fails
      } finally {
        setLoadingFirestore(false);
      }
    };

    fetchEvents();
  }, []);

  // Static/hardcoded data (will be kept until admin adds data through panel)
  const bootcamps = [
    {
      id: 'defensive-bootcamp-jan2025',
      courseId: 'defensive-bootcamp',
      title: '7-Day Defensive Security Bootcamp',
      category: 'defensive',
      startDate: '2025-01-15',
      endDate: '2025-01-21',
      duration: '7 Days',
      mode: 'Hybrid (Online + Offline)',
      location: 'Hyderabad & Online',
      maxStudents: 25,
      currentEnrolled: 12,
      trainer: {
        name: 'Santosh Kumar',
        experience: '8+ Years',
        certifications: ['CISSP', 'CEH', 'GCIH'],
        avatar: '/images/trainer-santosh.jpg'
      },
      schedule: [
        { day: 'Day 1-2', topic: 'SOC Fundamentals & SIEM Tools' },
        { day: 'Day 3-4', topic: 'Incident Response & Threat Hunting' },
        { day: 'Day 5-6', topic: 'Log Analysis & Forensics' },
        { day: 'Day 7', topic: 'Capstone Project & Assessment' }
      ],
      price: 'defensive-bootcamp',
      features: [
        'Live instructor-led sessions',
        'Hands-on lab exercises',
        'Industry tools access',
        'Certificate of completion',
        'Job placement assistance',
        'Lifetime community access'
      ],
      highlights: [
        'Small batch size (max 25 students)',
        'Experienced industry trainer',
        'Hybrid learning mode',
        'Real-world projects'
      ]
    },
    {
      id: 'offensive-bootcamp-feb2025',
      courseId: 'offensive-bootcamp',
      title: '7-Day Ethical Hacking Bootcamp',
      category: 'offensive',
      startDate: '2025-02-10',
      endDate: '2025-02-16',
      duration: '7 Days',
      mode: 'Online Live',
      location: 'Online',
      maxStudents: 20,
      currentEnrolled: 8,
      trainer: {
        name: 'Rajesh Kumar',
        experience: '6+ Years',
        certifications: ['OSCP', 'CEH', 'CISSP'],
        avatar: '/images/trainer-rajesh.jpg'
      },
      schedule: [
        { day: 'Day 1-2', topic: 'Reconnaissance & Information Gathering' },
        { day: 'Day 3-4', topic: 'Web Application Security Testing' },
        { day: 'Day 5-6', topic: 'Network Penetration Testing' },
        { day: 'Day 7', topic: 'Report Writing & Ethics' }
      ],
      price: 'offensive-bootcamp',
      features: [
        'Live online sessions',
        'Virtual lab environment',
        'Penetration testing tools',
        'Ethical hacking certification',
        'Career guidance',
        'Alumni network access'
      ],
      highlights: [
        'OSCP preparation focused',
        'Virtual labs included',
        'Expert-led training',
        'Interactive sessions'
      ]
    }
  ];

  const upcomingBatches = [
    {
      id: 'defensive-mastery-mar2025',
      courseId: 'defensive-mastery',
      title: '2-Month Defensive Security Mastery',
      category: 'defensive',
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      duration: '2 Months',
      mode: 'Weekend Classes',
      location: 'Hyderabad & Online',
      maxStudents: 15,
      currentEnrolled: 5,
      trainer: {
        name: 'Santosh Kumar',
        experience: '8+ Years',
        certifications: ['CISSP', 'GCIH', 'GCFA'],
        avatar: '/images/trainer-santosh.jpg'
      },
      schedule: [
        { day: 'Week 1-2', topic: 'Advanced SOC Operations' },
        { day: 'Week 3-4', topic: 'Threat Intelligence & Hunting' },
        { day: 'Week 5-6', topic: 'Digital Forensics & Incident Response' },
        { day: 'Week 7-8', topic: 'Capstone Project & Industry Exposure' }
      ],
      price: 'defensive-mastery',
      features: [
        'Weekend-only classes',
        'In-depth mastery program',
        'Industry project work',
        'Advanced certification',
        'Guaranteed job placement',
        'Mentorship program'
      ],
      highlights: [
        'Weekend flexibility',
        'Intensive 2-month program',
        'Small premium batch',
        'Job guarantee'
      ]
    },
    {
      id: 'offensive-mastery-apr2025',
      courseId: 'offensive-mastery',
      title: '2-Month Offensive Security Mastery',
      category: 'offensive',
      startDate: '2025-04-15',
      endDate: '2025-06-15',
      duration: '2 Months',
      mode: 'Weekday Evenings',
      location: 'Online Live',
      maxStudents: 20,
      currentEnrolled: 8,
      trainer: {
        name: 'Rajesh Kumar',
        experience: '10+ Years',
        certifications: ['OSCP', 'OSCE', 'CEH'],
        avatar: '/images/trainer-rajesh.jpg'
      },
      schedule: [
        { day: 'Week 1-2', topic: 'Advanced Penetration Testing' },
        { day: 'Week 3-4', topic: 'Web App Security & Exploitation' },
        { day: 'Week 5-6', topic: 'Network & Active Directory Attacks' },
        { day: 'Week 7-8', topic: 'Red Team Operations & Reporting' }
      ],
      price: 'offensive-mastery',
      features: [
        'Evening sessions (7-9 PM)',
        'OSCP preparation focused',
        'Virtual lab environment',
        'Real-world penetration testing',
        'Certification support',
        'Career mentoring'
      ],
      highlights: [
        'Flexible evening schedule',
        'OSCP-aligned curriculum',
        'Hands-on labs',
        'Industry projects'
      ]
    },
    {
      id: 'soc-analyst-feb2025',
      courseId: 'defensive-bootcamp',
      title: 'SOC Analyst Intensive Training',
      category: 'defensive',
      startDate: '2025-02-20',
      endDate: '2025-03-20',
      duration: '1 Month',
      mode: 'Hybrid (Online + Offline)',
      location: 'Hyderabad & Online',
      maxStudents: 25,
      currentEnrolled: 18,
      trainer: {
        name: 'Priya Sharma',
        experience: '7+ Years',
        certifications: ['GCIA', 'GCIH', 'Security+'],
        avatar: '/images/trainer-priya.jpg'
      },
      schedule: [
        { day: 'Week 1', topic: 'SIEM Tools & Log Analysis' },
        { day: 'Week 2', topic: 'Incident Response Fundamentals' },
        { day: 'Week 3', topic: 'Threat Hunting & Detection' },
        { day: 'Week 4', topic: 'Capstone: Real SOC Scenarios' }
      ],
      price: 'defensive-bootcamp',
      features: [
        'Industry-standard SIEM tools',
        'Real incident response drills',
        'Job-ready skills',
        'Certificate of completion',
        'Placement assistance',
        'Community support'
      ],
      highlights: [
        'Fast-track to SOC jobs',
        'Hands-on SIEM training',
        'Hybrid learning',
        'Limited seats'
      ]
    }
  ];

  // Placeholder for free workshops
  const freeWorkshops = [
    {
      id: 'free-cyber-workshop-jan2025',
      title: 'Introduction to Cybersecurity Careers',
      date: '2025-01-25',
      time: '6:00 PM - 8:00 PM',
      location: 'Online (Zoom)',
      description: 'Discover cybersecurity career paths, required skills, certifications, and how to get started. Open Q&A with industry experts.',
      registrationLink: '#',
      instructor: 'Santosh Kumar',
      topics: ['Career Paths', 'Certifications', 'Skills Required', 'Industry Insights']
    },
    {
      id: 'free-siem-workshop-feb2025',
      title: 'Free SIEM Workshop: Splunk Basics',
      date: '2025-02-10',
      time: '5:00 PM - 7:00 PM',
      location: 'Online (Zoom)',
      description: 'Hands-on introduction to SIEM tools using Splunk. Learn log analysis, search queries, and basic threat detection.',
      registrationLink: '#',
      instructor: 'Priya Sharma',
      topics: ['Splunk Basics', 'Log Analysis', 'Search Queries', 'Threat Detection']
    },
    {
      id: 'free-webapp-workshop-mar2025',
      title: 'Web Application Security 101',
      date: '2025-03-05',
      time: '6:30 PM - 8:30 PM',
      location: 'Online (Zoom)',
      description: 'Learn common web vulnerabilities (OWASP Top 10), how to identify them, and basic defense techniques.',
      registrationLink: '#',
      instructor: 'Rajesh Kumar',
      topics: ['OWASP Top 10', 'SQL Injection', 'XSS', 'Secure Coding']
    }
  ];

  // Merge Firestore events with hardcoded data
  // Separate Firestore events by type
  const firestoreBatches = firestoreEvents.filter(event => event.type === 'batch');
  const firestoreBootcamps = firestoreEvents.filter(event => event.type === 'bootcamp');
  const firestoreWorkshops = firestoreEvents.filter(event => event.type === 'workshop');

  // Merge and deduplicate (Firestore events take priority over hardcoded if same ID)
  const mergedBatches = [...upcomingBatches];
  firestoreBatches.forEach(fbEvent => {
    const existingIndex = mergedBatches.findIndex(b => b.id === fbEvent.id);
    if (existingIndex >= 0) {
      // Replace hardcoded with Firestore version
      mergedBatches[existingIndex] = { ...mergedBatches[existingIndex], ...fbEvent };
    } else {
      // Add new Firestore event
      mergedBatches.push(fbEvent);
    }
  });

  const mergedBootcamps = [...bootcamps];
  firestoreBootcamps.forEach(fbEvent => {
    const existingIndex = mergedBootcamps.findIndex(b => b.id === fbEvent.id);
    if (existingIndex >= 0) {
      mergedBootcamps[existingIndex] = { ...mergedBootcamps[existingIndex], ...fbEvent };
    } else {
      mergedBootcamps.push(fbEvent);
    }
  });

  const mergedWorkshops = [...freeWorkshops];
  firestoreWorkshops.forEach(fbEvent => {
    const existingIndex = mergedWorkshops.findIndex(w => w.id === fbEvent.id);
    if (existingIndex >= 0) {
      mergedWorkshops[existingIndex] = { ...mergedWorkshops[existingIndex], ...fbEvent };
    } else {
      mergedWorkshops.push(fbEvent);
    }
  });

  // Filter batches by category
  const filteredBatches = selectedCategory === 'all'
    ? mergedBatches
    : mergedBatches.filter(batch => batch.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Batches', count: mergedBatches.length },
    { id: 'defensive', name: 'Defensive Security', count: mergedBatches.filter(b => b.category === 'defensive').length },
    { id: 'offensive', name: 'Offensive Security', count: mergedBatches.filter(b => b.category === 'offensive').length }
  ];

  // Calculate days until start
  const getDaysUntilStart = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEnrollment = (batch) => {
    setEnrollmentModal({
      isOpen: true,
      courseType: batch.courseId,
      courseName: batch.title,
      batchId: batch.id
    });
  };

  return (
    <div className="min-h-screen text-white pt-20">
      {/* Hero Section - now clickable */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto cursor-pointer group"
            onClick={() => onNavigate && onNavigate('events-batches')}
            tabIndex={0}
            role="button"
            aria-label="Go to Events & Batches"
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { onNavigate && onNavigate('events-batches'); } }}
            style={{ outline: 'none' }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6 group-hover:bg-blue-500/20">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm">Live Training Batches</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight group-hover:text-blue-400 transition-colors">
              Upcoming Training Batches
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Join our next live training sessions with expert instructors
            </p>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Small batch sizes, experienced trainers, and hands-on learning.
              Secure your spot in our upcoming cybersecurity training programs.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span>{upcomingBatches.length} Upcoming Batches</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span>Expert Trainers Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Industry Certification</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                <span>Job Placement Support</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-400 opacity-70">Click anywhere on this banner to view all Events & Batches</div>
          </motion.div>
        </section>
      </div>

      {/* Tabbed Sections for Events & Batches */}
      <section className="py-8 bg-slate-900">
        <div className="container mx-auto px-6">
          <AdvancedTabs>
            {/* Tab 1: Upcoming Batches */}
            <div>
              {/* ...existing batches grid/list rendering... */}
              {/* Use filteredBatches and viewMode logic here */}
              {filteredBatches.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No batches found</h3>
                  <p className="text-slate-500">Try selecting a different category or check back later for new batches.</p>
                </div>
              ) : (
                <div className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {filteredBatches.map((batch, index) => {
                    const daysUntilStart = getDaysUntilStart(batch.startDate);
                    const isStartingSoon = daysUntilStart <= 7 && daysUntilStart > 0;
                    const hasStarted = daysUntilStart < 0;
                    const spotsLeft = batch.maxStudents - batch.currentEnrolled;
                    const coursePrice = pricing?.[batch.price];

                    return (
                      <motion.div
                        key={batch.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {/* ...existing batch card rendering... */}
                        {/* ...existing code... */}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Tab 2: Bootcamps */}
            <div>
              {loadingFirestore && bootcamps.length === 0 ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading bootcamps...</p>
                </div>
              ) : mergedBootcamps.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No bootcamps scheduled</h3>
                  <p className="text-slate-500">Check back soon for upcoming intensive bootcamp programs.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {mergedBootcamps.map((camp, index) => {
                    const daysUntilStart = getDaysUntilStart(camp.startDate);
                    const spotsLeft = camp.maxStudents - camp.currentEnrolled;
                    const coursePrice = pricing?.[camp.price];

                    return (
                      <motion.div
                        key={camp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl"
                      >
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">{camp.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-blue-100">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(camp.startDate)} - {formatDate(camp.endDate)}</span>
                              </div>
                            </div>
                            {daysUntilStart <= 7 && daysUntilStart > 0 && (
                              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                                Starting Soon!
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          {/* Trainer Info */}
                          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{camp.trainer.name}</div>
                              <div className="text-sm text-slate-400">{camp.trainer.experience}</div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{camp.duration} • {camp.mode}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span>{camp.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Users className="w-4 h-4 text-purple-400" />
                              <span>{spotsLeft} seats left of {camp.maxStudents}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-slate-400 mb-2">What's Included:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {camp.features.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <div>
                              {loading ? (
                                <div className="text-lg font-bold text-blue-400">₹...</div>
                              ) : coursePrice ? (
                                <>
                                  <div className="text-2xl font-bold text-blue-400">
                                    {formatPrice(coursePrice.finalPrice)}
                                  </div>
                                  {coursePrice.originalPrice !== coursePrice.finalPrice && (
                                    <div className="text-xs text-slate-500 line-through">
                                      {formatPrice(coursePrice.originalPrice)}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-lg font-bold text-blue-400">₹999</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleEnrollment(camp)}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                            >
                              Enroll Now
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Tab 3: Free Workshops */}
            <div>
              {loadingFirestore && freeWorkshops.length === 0 ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading workshops...</p>
                </div>
              ) : mergedWorkshops.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No workshops scheduled</h3>
                  <p className="text-slate-500">Subscribe to our newsletter to get notified about upcoming free workshops.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mergedWorkshops.map((ws, index) => (
                    <motion.div
                      key={ws.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-green-500 transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl"
                    >
                      {/* Header Badge */}
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-sm">FREE WORKSHOP</span>
                          <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                          {ws.title}
                        </h3>

                        {/* Date & Time */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Calendar className="w-4 h-4 text-green-400" />
                            <span>{ws.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{ws.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Video className="w-4 h-4 text-purple-400" />
                            <span>{ws.location}</span>
                          </div>
                        </div>

                        {/* Instructor */}
                        {ws.instructor && (
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                            <User className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300">by {ws.instructor}</span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                          {ws.description}
                        </p>

                        {/* Topics */}
                        {ws.topics && ws.topics.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1.5">
                              {ws.topics.map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="bg-slate-700/50 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <a
                          href={ws.registrationLink}
                          className="block w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-center px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 group-hover:scale-105"
                        >
                          Register Free
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </AdvancedTabs>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-slate-900 py-16">
        <section className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't See Your Preferred Batch?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Contact us to get notified about upcoming batches or discuss custom training schedules for your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsAdvisorOpen(true)}
                className="border border-slate-600 hover:border-blue-500 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Get Career Guidance
              </button>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Enhanced Enrollment Modal */}
      <EnhancedEnrollmentModal
        isOpen={enrollmentModal.isOpen}
        onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '', batchId: '' })}
        courseType={enrollmentModal.courseType}
        courseName={enrollmentModal.courseName}
        batchId={enrollmentModal.batchId}
        coursePrice={loading ? undefined : (pricing?.[enrollmentModal.courseType]?.finalPrice)}
      />

      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default EventsBatchesPage;