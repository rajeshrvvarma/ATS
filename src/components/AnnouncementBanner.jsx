import React, { useState } from 'react';
import { X, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

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
                <div className="absolute inset-0 opacity-20">
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
                                        🚀 NEW BATCH ALERT!
                                    </span>
                                    <span className="hidden md:inline text-yellow-300">|</span>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                    <span className="text-xs md:text-sm font-medium">
                                        Cybersecurity Bootcamp starting January 15th, 2025
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="text-xs md:text-sm">Limited seats available</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button className="hidden sm:flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-sm border border-white/20">
                                <span>Register Now</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0"
                            aria-label="Close announcement"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile CTA */}
                    <div className="sm:hidden mt-2 text-center">
                        <button className="inline-flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-sm border border-white/20">
                            <span>Register Now</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
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