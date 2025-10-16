// Upcoming Batches Page - Shows courses with available trainers and scheduled batches
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
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

const UpcomingBatchesPage = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const { pricing, loading } = useCoursePricing();

  // Current available batches with trainer information
  const upcomingBatches = [
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
    },
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
      {/* Hero Section */}
      <div className="bg-gradient-blue py-16">
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm">Live Training Batches</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
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
          </motion.div>
        </section>
      </div>

      {/* Filters and View Options */}
      <section className="py-8 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">View:</span>
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batches Grid/List */}
      <section className="py-8 bg-slate-900">
        <div className="container mx-auto px-6">
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
                    {/* Batch Header */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-white">{batch.title}</h3>
                            {isStartingSoon && (
                              <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                                Starting Soon
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {batch.duration}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trainer Info */}
                      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{batch.trainer.name}</h4>
                            <p className="text-sm text-slate-400">{batch.trainer.experience}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {batch.trainer.certifications.map((cert, idx) => (
                            <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Batch Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Mode:</span>
                          <span className="text-white">{batch.mode}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-white">{batch.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Batch Size:</span>
                          <span className="text-white">{batch.currentEnrolled}/{batch.maxStudents} students</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Spots Left:</span>
                          <span className={`font-semibold ${spotsLeft <= 5 ? 'text-orange-400' : 'text-green-400'}`}>
                            {spotsLeft} remaining
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Enrollment Progress</span>
                          <span>{Math.round((batch.currentEnrolled / batch.maxStudents) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(batch.currentEnrolled / batch.maxStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="border-t border-slate-700 pt-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">
                              {loading ? '₹...' : (coursePrice ? formatPrice(coursePrice.finalPrice) : '₹999')}
                            </div>
                            {coursePrice && coursePrice.originalPrice !== coursePrice.finalPrice && (
                              <div className="text-sm text-slate-400 line-through">
                                {formatPrice(coursePrice.originalPrice)}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-400">
                              {daysUntilStart > 0 ? `Starts in ${daysUntilStart} days` : 'Started'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleEnrollment(batch)}
                        disabled={hasStarted || spotsLeft === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {hasStarted ? (
                          'Batch Started'
                        ) : spotsLeft === 0 ? (
                          'Batch Full'
                        ) : (
                          <>
                            Reserve Your Seat
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Schedule Sidebar (Grid View Only) */}
                    {viewMode === 'grid' && (
                      <div className="p-6 border-t border-slate-700">
                        <h4 className="font-semibold text-white mb-3">Training Schedule</h4>
                        <div className="space-y-2">
                          {batch.schedule.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="font-medium text-blue-400">{item.day}</div>
                              <div className="text-slate-400">{item.topic}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-cyan py-16">
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

export default UpcomingBatchesPage;