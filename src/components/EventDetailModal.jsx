import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  CheckCircle,
  User,
  Award,
  Target,
  BookOpen,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';

const EventDetailModal = ({ isOpen, onClose, event, type, onEnroll }) => {
  const { pricing } = useCoursePricing();

  if (!event) return null;

  const coursePrice = pricing?.[event.price];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilStart = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilStart = getDaysUntilStart(event.startDate);
  const spotsLeft = event.maxStudents ? event.maxStudents - event.currentEnrolled : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="relative bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                      {event.endDate && (
                        <>
                          <span>-</span>
                          <span>{formatDate(event.endDate)}</span>
                        </>
                      )}
                    </div>
                    {daysUntilStart > 0 && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        Starts in {daysUntilStart} days
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {event.duration && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Duration</span>
                    </div>
                    <p className="text-white">{event.duration}</p>
                    {event.mode && <p className="text-slate-400 text-sm">{event.mode}</p>}
                  </div>
                )}

                {event.location && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      {event.location.includes('Online') ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                      <span className="font-semibold">Location</span>
                    </div>
                    <p className="text-white">{event.location}</p>
                  </div>
                )}

                {spotsLeft !== null && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">Availability</span>
                    </div>
                    <p className="text-white">{spotsLeft} seats left</p>
                    <p className="text-slate-400 text-sm">of {event.maxStudents} total</p>
                  </div>
                )}
              </div>

              {/* Trainer Info */}
              {event.trainer && (
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Instructor Details
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white">{event.trainer.name}</h4>
                      <p className="text-blue-400 mb-2">{event.trainer.experience}</p>
                      {event.trainer.certifications && (
                        <div className="flex flex-wrap gap-2">
                          {event.trainer.certifications.map((cert, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-600 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-500/30"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Course Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    Course Schedule
                  </h3>
                  <div className="space-y-3">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                            {item.day}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{item.topic}</h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features & Benefits */}
              {event.features && event.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    What's Included
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {event.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Key Highlights
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics (for workshops) */}
              {event.topics && event.topics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-700 text-green-400 px-3 py-1 rounded-full border border-green-500/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description (for workshops) */}
              {event.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
                  <p className="text-slate-300 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>

            {/* Footer with Pricing and Actions */}
            <div className="border-t border-slate-700 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  {type === 'workshop' ? (
                    <div className="text-2xl font-bold text-green-400">Free Workshop</div>
                  ) : coursePrice ? (
                    <>
                      <div className="text-3xl font-bold text-blue-400">
                        {formatPrice(coursePrice.finalPrice)}
                      </div>
                      {coursePrice.originalPrice !== coursePrice.finalPrice && (
                        <div className="text-slate-500 line-through">
                          {formatPrice(coursePrice.originalPrice)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-blue-400">₹999</div>
                  )}
                </div>

                <div className="flex gap-3">
                  {type === 'workshop' && event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      Register Free
                      <Globe className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        onEnroll?.(event);
                        onClose();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;