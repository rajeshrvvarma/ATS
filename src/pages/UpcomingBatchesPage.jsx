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
  List
} from 'lucide-react';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';
import AdvancedTabs from '@/components/AdvancedTabs.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const EventsBatchesPage = ({ onNavigate }) => {
  // Tab state handled by AdvancedTabs; category filter defaults to 'all'
  const [selectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const { pricing, loading } = useCoursePricing();

  // Separate arrays for batches, bootcamps, and workshops
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
    }
  ];

  // Placeholder for free workshops
  const freeWorkshops = [
    {
      id: 'free-cyber-workshop-jan2025',
      title: 'Free Cybersecurity Workshop',
      date: '2025-01-25',
      time: '6:00 PM - 8:00 PM',
      location: 'Online',
      description: 'Introductory workshop for beginners. Covers basics of cybersecurity, career paths, and Q&A with experts.',
      registrationLink: '#'
    }
  ];

  // Filter batches by category
  const filteredBatches = selectedCategory === 'all'
    ? upcomingBatches
    : upcomingBatches.filter(batch => batch.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Batches', count: upcomingBatches.length },
    { id: 'defensive', name: 'Defensive Security', count: upcomingBatches.filter(b => b.category === 'defensive').length },
    { id: 'offensive', name: 'Offensive Security', count: upcomingBatches.filter(b => b.category === 'offensive').length }
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
              {bootcamps.length === 0 ? (
                <div className="text-slate-400 mb-8">No bootcamps scheduled at the moment.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {bootcamps.map((camp) => (
                    <div key={camp.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                      <h3 className="text-xl font-semibold text-white mb-2">{camp.title}</h3>
                      <div className="text-slate-400 mb-2">{camp.startDate} to {camp.endDate} &bull; {camp.location}</div>
                      <div className="text-slate-300 mb-2">Trainer: {camp.trainer.name} ({camp.trainer.experience})</div>
                      <div className="text-slate-400 mb-2">{camp.duration} &bull; {camp.mode}</div>
                      <ul className="list-disc ml-6 text-slate-400 mb-2">
                        {camp.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => handleEnrollment(camp)}>Enroll</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Tab 3: Free Workshops */}
            <div>
              {freeWorkshops.length === 0 ? (
                <div className="text-slate-400 mb-8">No free workshops scheduled at the moment.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {freeWorkshops.map((ws) => (
                    <div key={ws.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                      <h3 className="text-xl font-semibold text-white mb-2">{ws.title}</h3>
                      <div className="text-slate-400 mb-2">{ws.date} &bull; {ws.time} &bull; {ws.location}</div>
                      <div className="text-slate-300 mb-2">{ws.description}</div>
                      <a href={ws.registrationLink} className="mt-2 inline-block px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Register</a>
                    </div>
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