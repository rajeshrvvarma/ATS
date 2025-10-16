import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Sparkles, ArrowRight, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveBatches, getUrgencyColor } from '@/data/activeBatches.js';

const AnnouncementBanner = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

    const activeBatches = getActiveBatches();

    // Rotate between batches every 8 seconds if multiple batches exist
    useEffect(() => {
        if (activeBatches.length > 1) {
            const interval = setInterval(() => {
                setCurrentBatchIndex(prev => (prev + 1) % activeBatches.length);
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [activeBatches.length]);

    if (!isVisible || activeBatches.length === 0) return null;

    const currentBatch = activeBatches[currentBatchIndex] || activeBatches[0];

    return (
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
                        {/* Main Announcement Content */}
                        <div className="flex items-center justify-center flex-1 space-x-3 md:space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-yellow-300">
                                <Sparkles className="w-5 h-5 animate-spin" />
                                <Calendar className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-1 sm:space-y-0 sm:space-x-3">
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-sm md:text-base">
                                        {currentBatch.title}
                                    </span>
                                    <span className="hidden md:inline text-yellow-300">|</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                    <span className="text-xs md:text-sm font-medium">
                                        Starting {currentBatch.startDate}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        {currentBatch.urgency === 'high' ? (
                                            <Zap className="w-3 h-3 md:w-4 md:h-4 text-red-400 animate-pulse" />
                                        ) : (
                                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                                        )}
                                        <span className={`text-xs md:text-sm ${
                                            currentBatch.urgency === 'high' ? 'text-red-300 font-semibold' : 'text-white'
                                        }`}>
                                            {currentBatch.urgency === 'high'
                                                ? `Only ${currentBatch.seatsLeft} seats left!`
                                                : `${currentBatch.seatsLeft} seats available`
                                            }
                                        </span>
                                    </div>

                                    {/* Price indicator */}
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-300">•</span>
                                        <span className="text-xs md:text-sm font-semibold text-green-300">
                                            {currentBatch.price}
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
                                    onClick={() => onNavigate && onNavigate(`enroll?course=${currentBatch.courseId}&batch=${currentBatch.id}`)}
                                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-sm border ${
                                        currentBatch.urgency === 'high'
                                            ? 'bg-red-500/90 hover:bg-red-500 text-white border-red-400 animate-pulse'
                                            : 'bg-white/90 hover:bg-white text-blue-600 border-white'
                                    }`}
                                >
                                    <span>
                                        {currentBatch.urgency === 'high' ? 'Grab Last Seats!' : 'Register Now'}
                                    </span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                            aria-label="Close announcement"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile CTA */}
                    <div className="sm:hidden mt-2 flex justify-center gap-2">
                        <button
                            onClick={() => onNavigate && onNavigate('events-batches')}
                            className="inline-flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                        >
                            <span>View All</span>
                        </button>
                        <button
                            onClick={() => onNavigate && onNavigate(`enroll?course=${currentBatch.courseId}&batch=${currentBatch.id}`)}
                            className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-sm border ${
                                currentBatch.urgency === 'high'
                                    ? 'bg-red-500/90 hover:bg-red-500 text-white border-red-400 animate-pulse'
                                    : 'bg-white/90 hover:bg-white text-blue-600 border-white'
                            }`}
                        >
                            <span>
                                {currentBatch.urgency === 'high' ? 'Last Seats!' : 'Register'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>                    {/* Batch rotation indicator for multiple batches */}
                    {activeBatches.length > 1 && (
                        <div className="mt-2 flex justify-center space-x-1">
                            {activeBatches.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 w-6 rounded-full transition-all duration-300 ${
                                        index === currentBatchIndex ? 'bg-white/70' : 'bg-white/20'
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
    );
};

export default AnnouncementBanner;