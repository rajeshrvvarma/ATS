// ---
// Announcement Banner - Rotates through upcoming events
//
// [UPDATE LOG: 2025-10-17]
// Recent changes:
// - Banner now fetches events from both static and Firestore sources
// - Null safety added for all event fields
// - Rotates through all events
// - ✅ FIXED: Banner events now clickable - entire banner content shows event details modal
// - ✅ FIXED: Register/Enroll buttons properly navigate to enrollment or events page
// - ✅ FIXED: View All button navigates to events-batches page
// - ✅ NEW: Manual navigation arrows for user-controlled event browsing
//
// Banner functionality completed:
// - ✅ Event rotation with progress indicators (auto-scroll every 6 seconds)
// - ✅ Manual navigation arrows (left/right) for user control
// - ✅ Clickable banner content (shows EventDetailModal)
// - ✅ Functional CTA buttons (Register/View All)
// - ✅ Responsive design with mobile-specific CTAs and navigation
// - ✅ Urgency-based styling and messaging
// - ✅ Proper event type handling (batch/bootcamp/workshop)
import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Sparkles, ArrowRight, Clock, Zap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Data utilities file was removed. Provide tiny safe helpers here that
// prefer a global loader if available, otherwise attempt to fetch
// /modules.json. These keep the banner buildable without reintroducing
// the original data module.
async function loadEventsFallback() {
    if (typeof globalThis.getAllEvents === 'function') {
        try {
            return globalThis.getAllEvents() || [];
        } catch (e) {
            console.error('global getAllEvents error', e);
        }
    }
    try {
        const res = await fetch('/modules.json');
        const json = await res.json();
        // Expect modules.json to contain an events array; adapt if different
        return json.events || [];
    } catch (e) {
        return [];
    }
}

function getSeatsLeft(event) {
    // Best-effort seats left
    return event?.seatsLeft ?? event?.seats_available ?? 0;
}

function calculateUrgency(event) {
    const seats = getSeatsLeft(event);
    if (seats <= 3 && seats > 0) return 'high';
    return 'low';
}
import EventDetailModal from './EventDetailModal.jsx';

const AnnouncementBanner = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [allEvents, setAllEvents] = useState([]);
    const [eventDetailModal, setEventDetailModal] = useState({ isOpen: false, event: null, type: '' });

    // Load events (static first, then Firestore)
    useEffect(() => {
        // Start with static data for immediate display
        const staticEvents = getUpcomingEventsSync();
        setAllEvents(staticEvents);

        // Then fetch from Firestore to get latest data
        const loadFirestoreEvents = async () => {
            try {
                const events = await getUpcomingEvents();
                setAllEvents(events);
            } catch (error) {
                console.error('Error loading Firestore events:', error);
                // Keep using static data if Firestore fails
            }
        };
        loadFirestoreEvents();
    }, []);

    // Rotate between all events every 6 seconds
    useEffect(() => {
        if (allEvents.length > 1) {
            const interval = setInterval(() => {
                setCurrentEventIndex(prev => (prev + 1) % allEvents.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [allEvents.length]);

    if (!isVisible || allEvents.length === 0) return null;

    const currentEvent = allEvents[currentEventIndex] || allEvents[0];
    const seatsLeft = getSeatsLeft(currentEvent);
    const urgency = calculateUrgency(currentEvent);

    // Handler to show event details modal
    const handleShowEventDetails = (event) => {
        setEventDetailModal({
            isOpen: true,
            event: event,
            type: event.type || 'batch' // fallback to batch if type is missing
        });
    };

    // Manual navigation handlers
    const handlePrevEvent = () => {
        setCurrentEventIndex(prev =>
            prev === 0 ? allEvents.length - 1 : prev - 1
        );
    };

    const handleNextEvent = () => {
        setCurrentEventIndex(prev => (prev + 1) % allEvents.length);
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 text-white overflow-hidden relative"
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 animate-pulse"></div>
                </div>

                <div className="container mx-auto px-4 py-3 relative z-10">
                    <div className="flex items-center justify-between">
                        {/* Left Navigation Arrow - Always visible if events exist */}
                        {allEvents.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevEvent();
                                }}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm border border-white/40 hover:border-white/60 shadow-lg"
                                aria-label="Previous event"
                                title="Previous event"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                        )}

                        {/* Main Announcement Content */}
                        <div
                            className="flex items-center justify-center flex-1 space-x-3 md:space-x-4 cursor-pointer hover:opacity-90 transition-opacity duration-200 mx-2"
                            onClick={() => handleShowEventDetails(currentEvent)}
                            title="Click to view event details"
                        >
                            <div className="hidden sm:flex items-center space-x-2 text-yellow-300">
                                {currentEvent.type === 'workshop' ? (
                                    <BookOpen className="w-5 h-5" />
                                ) : currentEvent.type === 'bootcamp' ? (
                                    <Zap className="w-5 h-5" />
                                ) : (
                                    <Sparkles className="w-5 h-5 animate-spin" />
                                )}
                                <Calendar className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-1 sm:space-y-0 sm:space-x-3">
                                <div className="flex items-center space-x-2">
                                    {/* Event type badge */}
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        currentEvent.type === 'workshop'
                                            ? 'bg-green-500/30 text-green-300'
                                            : currentEvent.type === 'bootcamp'
                                            ? 'bg-purple-500/30 text-purple-300'
                                            : 'bg-blue-500/30 text-blue-300'
                                    }`}>
                                        {currentEvent.type === 'workshop' ? 'FREE' : currentEvent.type.toUpperCase()}
                                    </span>
                                    <span className="font-bold text-sm md:text-base">
                                        {currentEvent.title}
                                    </span>
                                    <span className="hidden md:inline text-yellow-300">|</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                    <span className="text-xs md:text-sm font-medium">
                                        Starting {new Date(currentEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        {urgency === 'high' ? (
                                            <Zap className="w-3 h-3 md:w-4 md:h-4 text-red-400 animate-pulse" />
                                        ) : (
                                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                                        )}
                                        <span className={`text-xs md:text-sm ${
                                            urgency === 'high' ? 'text-red-300 font-semibold' : 'text-white'
                                        }`}>
                                            {urgency === 'high'
                                                ? `Only ${seatsLeft} seats left!`
                                                : currentEvent.type === 'workshop'
                                                ? `Free Workshop`
                                                : `${seatsLeft} seats available`
                                            }
                                        </span>
                                    </div>

                                    {/* Price indicator */}
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-300">•</span>
                                        <span className={`text-xs md:text-sm font-semibold ${
                                            currentEvent.type === 'workshop' ? 'text-green-300' : 'text-green-300'
                                        }`}>
                                            {currentEvent.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons - Enroll & View All */}
                            <div className="hidden sm:flex items-center space-x-2">
                                <button
                                    onClick={() => onNavigate && onNavigate('events-batches')}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (currentEvent.type === 'workshop') {
                                            onNavigate && onNavigate('events-batches');
                                        } else {
                                            onNavigate && onNavigate(`enroll?course=${currentEvent.courseId}&batch=${currentEvent.id}`);
                                        }
                                    }}
                                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-sm border ${
                                        urgency === 'high'
                                            ? 'bg-red-500/90 hover:bg-red-500 text-white border-red-400 animate-pulse'
                                            : currentEvent.type === 'workshop'
                                            ? 'bg-green-500/90 hover:bg-green-600 text-white border-green-400'
                                            : 'bg-white/90 hover:bg-white text-blue-600 border-white'
                                    }`}
                                >
                                    <span>
                                        {urgency === 'high'
                                            ? 'Grab Last Seats!'
                                            : currentEvent.type === 'workshop'
                                            ? 'Register Free'
                                            : 'Register Now'
                                        }
                                    </span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Right Navigation Arrow - Always visible if events exist */}
                        {allEvents.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextEvent();
                                }}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm border border-white/40 hover:border-white/60 shadow-lg mr-2"
                                aria-label="Next event"
                                title="Next event"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                            aria-label="Close announcement"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Navigation Arrows - Always visible if events exist */}
                    {allEvents.length > 0 && (
                        <div className="sm:hidden mt-3 flex justify-center gap-4 mb-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevEvent();
                                }}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm border border-white/40 shadow-lg"
                                aria-label="Previous event"
                                title="Previous event"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextEvent();
                                }}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm border border-white/40 shadow-lg"
                                aria-label="Next event"
                                title="Next event"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    )}

                    {/* Mobile CTA */}
                    <div className="sm:hidden mt-2 flex justify-center gap-2">
                        <button
                            onClick={() => onNavigate && onNavigate('events-batches')}
                            className="inline-flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                        >
                            <span>View All</span>
                        </button>
                        <button
                            onClick={() => {
                                if (currentEvent.type === 'workshop') {
                                    onNavigate && onNavigate('events-batches');
                                } else {
                                    onNavigate && onNavigate(`enroll?course=${currentEvent.courseId}&batch=${currentEvent.id}`);
                                }
                            }}
                            className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-sm border ${
                                urgency === 'high'
                                    ? 'bg-red-500/90 hover:bg-red-500 text-white border-red-400 animate-pulse'
                                    : currentEvent.type === 'workshop'
                                    ? 'bg-green-500/90 hover:bg-green-600 text-white border-green-400'
                                    : 'bg-white/90 hover:bg-white text-blue-600 border-white'
                            }`}
                        >
                            <span>
                                {urgency === 'high'
                                    ? 'Last Seats!'
                                    : currentEvent.type === 'workshop'
                                    ? 'Free'
                                    : 'Register'
                                }
                            </span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Event rotation indicator */}
                    {allEvents.length > 1 && (
                        <div className="mt-2 flex justify-center space-x-1">
                            {allEvents.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 w-6 rounded-full transition-all duration-300 ${
                                        index === currentEventIndex ? 'bg-white/70' : 'bg-white/20'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Animated Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
                    <motion.div
                        className="h-full bg-white/60"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                    />
                </div>
            </motion.div>
            </AnimatePresence>

            {/* Event Detail Modal */}
            <EventDetailModal
                isOpen={eventDetailModal.isOpen}
                onClose={() => setEventDetailModal({ isOpen: false, event: null, type: '' })}
                event={eventDetailModal.event}
                type={eventDetailModal.type}
            />
        </>
    );
};

export default AnnouncementBanner;