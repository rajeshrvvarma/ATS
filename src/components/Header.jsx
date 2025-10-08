import React, { useState } from 'react';
import { X, Menu, ChevronDown, Home, Shield, Sword, Sparkles, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header({ onNavigate, currentPage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [showMega, setShowMega] = useState(false);
    // Mobile navigation items
    const mobileNavItems = [
        { name: "Programs", action: () => scrollToSection('programs') },
        { name: "About Us", action: () => scrollToSection('about') },
        { name: "Video Learning", action: () => onNavigate('video-learning') },
        { name: "Contact Us", action: () => onNavigate('contact') },
        { name: "Login", action: () => onNavigate('login') }
    ];

    const scrollToSection = (id) => {
        setActiveLink(id);
        
        // Handle different navigation scenarios
        const targetId = id.toLowerCase().replace(/\s+/g, '-');
        
        // If we are not on the home page, navigate there first, then scroll
        if (currentPage !== 'home') {
            // Pass the section to scroll to via URL hash so Home can handle it after navigation
            window.location.assign(`/${'#' + targetId}`);
        } else {
            // If we are already on the home page, just scroll
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false); // Close the mobile menu after clicking a link
    };

    const isLinkActive = (link) => {
        // Map page routes to human-readable labels
        const routeMap = {
            'video-learning': 'Video Learning',
            'dashboard': 'Dashboard',
            'admin': 'Admin',
            'login': 'Login',
            'contact': 'Contact Us',
            'home': ''
        };

        // If we are on a routed page, highlight the matching nav item
        if (routeMap[currentPage] && routeMap[currentPage] === link) {
            return true;
        }

        // When on the home page, use the last selected section as active
        if (currentPage === 'home' && activeLink === link) {
            return true;
        }

        return false;
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/20 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                {/* Desktop Navigation - Clean & Professional */}
                <div className="hidden md:flex items-center justify-between w-full">
                    {/* Left - Logo & Company Name */}
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => onNavigate('home')} 
                            className="flex items-center space-x-3 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg">
                                <img 
                                    src="/logo.png" 
                                    alt="AT Logo" 
                                    className="w-10 h-10 rounded-full group-hover:scale-110 transition-transform duration-200" 
                                />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                                    Agnidhra Technologies
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Center - Main Navigation */}
                    <nav className="flex items-center space-x-8">
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsProgramsOpen(true)}
                            onMouseLeave={() => setIsProgramsOpen(false)}
                        >
                            <button
                                className="flex items-center text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                            >
                                Programs
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            
                            <AnimatePresence>
                                {isProgramsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Training Programs</h3>
                                            <div className="space-y-3">
                                                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                                    Defensive Security
                                                </div>
                                                <button
                                                    onClick={() => onNavigate('bootcampLanding')}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 group"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="bg-blue-600 rounded-lg p-2">
                                                            <Shield className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-white group-hover:text-blue-400">
                                                                7-Day SOC Bootcamp
                                                            </div>
                                                            <div className="text-sm text-slate-400 mt-1">
                                                                From Zero to SOC Analyst • Starting ₹499
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                <button
                                                    onClick={() => onNavigate('premiumProgram')}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 group"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="bg-purple-600 rounded-lg p-2">
                                                            <Sparkles className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-white group-hover:text-purple-400">
                                                                2-Month Mastery Program
                                                            </div>
                                                            <div className="text-sm text-slate-400 mt-1">
                                                                Premium certification • ₹5,999
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>

                                                <div className="border-t border-slate-700 pt-3 mt-3">
                                                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                                        Offensive Security
                                                    </div>
                                                    <button
                                                        onClick={() => onNavigate('offensiveBootcampLanding')}
                                                        className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 group"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="bg-red-600 rounded-lg p-2">
                                                                <Sword className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white group-hover:text-red-400">
                                                                    7-Day Hacking Bootcamp
                                                                </div>
                                                                <div className="text-sm text-slate-400 mt-1">
                                                                    Ethical hacking fundamentals • Starting ₹599
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => onNavigate('offensiveMastery')}
                                                        className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 group"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="bg-orange-600 rounded-lg p-2">
                                                                <Sparkles className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white group-hover:text-orange-400">
                                                                    2-Month Elite Hacker
                                                                </div>
                                                                <div className="text-sm text-slate-400 mt-1">
                                                                    Advanced red team training • ₹7,999
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>

                                                <div className="border-t border-slate-700 pt-3 mt-3">
                                                    <button
                                                        onClick={() => onNavigate('specializedCourses')}
                                                        className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 group"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="bg-green-600 rounded-lg p-2">
                                                                <Target className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white group-hover:text-green-400">
                                                                    Specialized Courses
                                                                </div>
                                                                <div className="text-sm text-slate-400 mt-1">
                                                                    Cloud, Forensics, GRC & More • ₹2,999+
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => scrollToSection('programs')}
                                                        className="w-full text-center mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                                                    >
                                                        View All Programs →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={() => scrollToSection('about')}
                            className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                        >
                            About Us
                        </button>
                        <button
                            onClick={() => onNavigate('video-learning')}
                            className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                        >
                            Video Learning
                        </button>
                        <button
                            onClick={() => onNavigate('contact')}
                            className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                        >
                            Contact Us
                        </button>
                    </nav>

                    {/* Right - Actions */}
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => onNavigate('enroll')} 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                            Enroll Now
                        </button>
                        
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                        >
                            Login
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center justify-between">
                    <button 
                        onClick={() => onNavigate('home')} 
                        className="flex items-center space-x-3"
                    >
                        <img src="/logo.png" alt="AT Logo" className="w-10 h-10 rounded-full" />
                        <span className="text-lg font-bold text-white">Agnidhra Technologies</span>
                    </button>
                    
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="text-slate-300 focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
                    <ul className="px-4 pt-2 pb-3 space-y-1">
                        {mobileNavItems.map((item, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => { item.action(); setIsOpen(false); }} 
                                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800/50"
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                        <li className="pt-2 border-t border-slate-700">
                            <button 
                                onClick={() => { setIsOpen(false); onNavigate('enroll'); }} 
                                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Enroll Now
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

