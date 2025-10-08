import React, { useState } from 'react';
import { X, Menu, ChevronDown, Sun, Moon, Home, Shield, Sword, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useSettings } from '@/context/SettingsContext.jsx';

export default function Header({ onNavigate, currentPage }) {
    const { theme, toggleTheme } = useTheme();
    const { toggleOpen } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [showMega, setShowMega] = useState(false);

    // Global shortcut: press "s" to open Settings
    React.useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                toggleOpen();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggleOpen]);
    // Navigation structure like dettol.co.in
    const leftNavItems = [
        { name: "Programs", action: () => scrollToSection('programs') },
        { name: "About Us", action: () => scrollToSection('about') },
        { name: "Our Expertise", action: () => scrollToSection('expertise') }
    ];

    const rightNavItems = [
        { name: "Video Learning", action: () => onNavigate('video-learning') },
        { name: "Admissions", action: () => onNavigate('enroll') },
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
                {/* Desktop Navigation - Dettol.co.in inspired layout */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Left Navigation */}
                    <div className="flex items-center space-x-8">
                        {leftNavItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Center Logo (Home Button) */}
                    <div className="relative">
                        <button 
                            onClick={() => onNavigate('home')} 
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-slate-700 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg group"
                            title="Agnidhra Technologies - Home"
                        >
                            <img 
                                src="/logo.png" 
                                alt="AT Logo" 
                                className="w-12 h-12 rounded-full group-hover:scale-110 transition-transform duration-200" 
                            />
                        </button>
                        
                        {/* Company name below logo - visible on hover */}
                        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            <span className="text-xs text-slate-400 font-medium">Agnidhra Technologies</span>
                        </div>
                    </div>

                    {/* Right Navigation */}
                    <div className="flex items-center space-x-6">
                        {rightNavItems.slice(0, -1).map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </button>
                        ))}
                        
                        {/* CTA Button */}
                        <button 
                            onClick={() => onNavigate('enroll')} 
                            className="btn-primary px-6 py-2 font-semibold"
                        >
                            Enroll Now
                        </button>
                        
                        {/* Login */}
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200"
                        >
                            Login
                        </button>

                        {/* Settings & Theme */}
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={toggleTheme} 
                                className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700" 
                                title="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button 
                                onClick={toggleOpen} 
                                className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700" 
                                title="Settings"
                            >
                                ⚙
                            </button>
                        </div>
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
                <div className="md:hidden bg-slate-900/95 backdrop-blur-sm">
                    <ul className="px-4 pt-2 pb-3 space-y-1">
                        {[...leftNavItems, ...rightNavItems].map((item, index) => (
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
                                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
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

