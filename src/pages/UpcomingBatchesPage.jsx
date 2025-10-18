// ---
// Events & Batches Page - Shows upcoming batches, bootcamps, and free workshops
//
// [UPDATE LOG: 2025-10-17]
// Recent changes:
// - ✅ COMPLETED: Event data duplication fixed - now uses centralized getAllEvents()
// - ✅ COMPLETED: Banner events clickability fixed - banner content shows event details modal
// - ✅ COMPLETED: EventDetailModal integration for View Details functionality
// - ✅ COMPLETED: Single source of truth for all events (static + Firestore merged)
// - ✅ COMPLETED: Removed duplicate static data arrays and merging logic
// - ✅ COMPLETED: Simplified event filtering by type from centralized data
//
// Remaining tasks:
// - Fix Upcoming Batches Firestore Integration (in progress)
// - Validate Events Page Functionality
//
// All events now properly loaded from centralized allEventsData.js with Firestore integration.
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
// ModernEnrollmentModal removed — enrollment now funnels to WhatsApp contact
import EventDetailModal from '@/components/EventDetailModal.jsx';
import AdvancedTabs from '@/components/AdvancedTabs.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import { getAllEvents } from '@/data/allEventsData.js';

const EventsBatchesPage = ({ onNavigate }) => {
  // Tab state handled by AdvancedTabs; category filter defaults to 'all'
  const [selectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  // enrollment modal removed; enrollment handled via WhatsApp CTA
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [eventDetailModal, setEventDetailModal] = useState({ isOpen: false, event: null, type: '' });

  // State for all events (static + Firestore, already merged by getAllEvents)
  const [allEvents, setAllEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const { pricing, loading: pricingLoading } = useCoursePricing();

  // Fetch all events (already merged) from centralized data source
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const events = await getAllEvents();
        setAllEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Keep empty array if fetch fails
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Separate events by type from the centralized merged data
  const upcomingBatches = allEvents.filter(event => event.type === 'batch');
  const bootcamps = allEvents.filter(event => event.type === 'bootcamp');
  const freeWorkshops = allEvents.filter(event => event.type === 'workshop');

  // Filter batches by category
  const filteredBatches = selectedCategory === 'all'
    ? upcomingBatches
    : upcomingBatches.filter(batch => batch.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Batches', count: upcomingBatches.length },
    { id: 'defensive', name: 'Defensive Security', count: upcomingBatches.filter(b => b.category === 'defensive').length },
    { id: 'offensive', name: 'Offensive Security', count: upcomingBatches.filter(b => b.category === 'offensive').length }
  ];

  // Helper function to calculate days until start
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
    const msg = `Hi, I want to enroll in ${batch.title}${batch.id ? ' (batch: ' + batch.id + ')' : ''}. Please share details and next steps.`;
    window.open('https://wa.me/919160813700?text=' + encodeURIComponent(msg), '_blank');
  };

  const handleShowEventDetails = (event, type) => {
    setEventDetailModal({
      isOpen: true,
      event: event,
      type: type // 'batch', 'bootcamp', or 'workshop'
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
                        className={`bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden group ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">{batch.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</span>
                              </div>
                            </div>
                            {isStartingSoon && (
                              <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                                Starting Soon
                              </span>
                            )}
                            {hasStarted && (
                              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          {/* Trainer */}
                          {batch.trainer && (
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{batch.trainer.name}</div>
                                <div className="text-sm text-slate-400">{batch.trainer.experience}</div>
                              </div>
                            </div>
                          )}

                          {/* Details */}
                          <div className="space-y-3 mb-4">
                            {batch.duration && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span>{batch.duration}{batch.mode && ` • ${batch.mode}`}</span>
                              </div>
                            )}
                            {batch.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span>{batch.location}</span>
                              </div>
                            )}
                            {batch.maxStudents && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span>{spotsLeft} seats left of {batch.maxStudents}</span>
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          {batch.features && batch.features.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-slate-400 mb-2">What's Included:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {batch.features.slice(0, 4).map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Price & CTA */}
                          <div className="pt-4 border-t border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                {pricingLoading ? (
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
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleShowEventDetails(batch, 'batch')}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                View Details
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEnrollment(batch)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                Enroll Now
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Tab 2: Bootcamps */}
            <div>
              {loadingEvents && bootcamps.length === 0 ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading bootcamps...</p>
                </div>
              ) : bootcamps.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No bootcamps scheduled</h3>
                  <p className="text-slate-500">Check back soon for upcoming intensive bootcamp programs.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {bootcamps.map((camp, index) => {
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
                          {camp.trainer && (
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{camp.trainer.name}</div>
                                <div className="text-sm text-slate-400">{camp.trainer.experience}</div>
                              </div>
                            </div>
                          )}

                          {/* Details */}
                          <div className="space-y-3 mb-4">
                            {camp.duration && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span>{camp.duration}{camp.mode && ` • ${camp.mode}`}</span>
                              </div>
                            )}
                            {camp.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span>{camp.location}</span>
                              </div>
                            )}
                            {camp.maxStudents && (
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span>{spotsLeft} seats left of {camp.maxStudents}</span>
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          {camp.features && camp.features.length > 0 && (
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
                          )}

                          {/* Price & CTA */}
                          <div className="pt-4 border-t border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                {pricingLoading ? (
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
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleShowEventDetails(camp, 'bootcamp')}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                View Details
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEnrollment(camp)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                Enroll Now
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
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
              {loadingEvents && freeWorkshops.length === 0 ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading workshops...</p>
                </div>
              ) : freeWorkshops.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No workshops scheduled</h3>
                  <p className="text-slate-500">Subscribe to our newsletter to get notified about upcoming free workshops.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freeWorkshops.map((ws, index) => (
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
                            <span>{ws.date || formatDate(ws.startDate)}</span>
                          </div>
                          {ws.time && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{ws.time}</span>
                            </div>
                          )}
                          {ws.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Video className="w-4 h-4 text-purple-400" />
                              <span>{ws.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Instructor */}
                        {ws.instructor && (
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                            <User className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300">by {ws.instructor}</span>
                          </div>
                        )}

                        {/* Description */}
                        {ws.description && (
                          <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                            {ws.description}
                          </p>
                        )}

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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowEventDetails(ws, 'workshop')}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            View Details
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <a
                            href={ws.registrationLink || '#'}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-center px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            Register Free
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
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

      {/* Enrollment modal removed — contact via WhatsApp CTA instead */}

      <EventDetailModal
        isOpen={eventDetailModal.isOpen}
        onClose={() => setEventDetailModal({ isOpen: false, event: null, type: '' })}
        event={eventDetailModal.event}
        type={eventDetailModal.type}
        onEnroll={handleEnrollment}
      />

      <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
      <ScrollNavigation />
    </div>
  );
};

export default EventsBatchesPage;