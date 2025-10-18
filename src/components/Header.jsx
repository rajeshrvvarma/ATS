import React, { useState } from 'react';
import { X, Menu, ChevronDown } from 'lucide-react';
// Removed framer-motion to eliminate header animations
// NotificationBell removed
import UserMenu from '@/components/UserMenu.jsx';

// Clean header background - no gradients
const headerBackground = 'bg-slate-900';

export default function Header({ onNavigate, currentPage }) {
  // Use clean header background
  const gradientClass = headerBackground;
    const [isOpen, setIsOpen] = useState(false);
    // activeLink state removed — navigation highlights simplified

    // Auth context was removed; avoid importing missing file.
    // Use a local placeholder so header renders without auth.
    const user = null;
    const logout = () => {};

    // Centralized pricing hook removed

    // Production debugging
    React.useEffect(() => {
        console.log('🔧 Header mounted in production:', { currentPage, timestamp: new Date().toISOString() });
    }, [currentPage]);
    // Mobile navigation state
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

    // Mobile navigation items - dynamic based on user status
    const mobileNavItems = [
        { name: "Events & Batches", action: () => onNavigate('events-batches') },
        { name: "Tech Academy", action: () => onNavigate('technologyTraining') },
        // Module catalog archived - premium courses only
        { name: "About Us", action: () => scrollToSection('about') },
        { name: "Contact Us", action: () => onNavigate('contact') }
    ];

    // Mobile program categories (simplified from mega menu)
    const mobileProgramCategories = {
        foundation: {
            title: '🎯 Foundation Programs (₹99)',
            courses: [
                { name: 'Cybersecurity Fundamentals', action: () => onNavigate('events-batches') },
                { name: 'Technology Overview', action: () => onNavigate('events-batches') }
            ]
        },
        premium: {
            title: '🏆 Premium Courses (₹20K)',
            courses: [
                { name: 'Defensive Security Professional', action: () => onNavigate('home') },
                { name: 'Offensive Security Mastery', action: () => onNavigate('home') },
                { name: 'MultiCloud DevOps Mastery', action: () => onNavigate('home') }
            ]
        },
        bootcamp: {
            title: '⚡ 7-Day Bootcamps',
            courses: [
                { name: 'SOC Analyst Bootcamp (₹499+)', action: () => onNavigate('events-batches') },
                { name: 'Ethical Hacking Bootcamp (₹599+)', action: () => onNavigate('events-batches') }
            ]
        },
        addons: {
            title: '🎯 Specialized Add-ons',
            courses: [
                { name: 'Cloud Security Mastery', action: () => onNavigate('home') },
                { name: 'Digital Forensics & Investigation', action: () => onNavigate('home') },
                { name: 'Red Team Operations', action: () => onNavigate('home') }
            ]
        },
        college: {
            title: '🎓 College Training',
            courses: [
                { name: 'Bulk Training Program (₹299/student)', action: () => onNavigate('collegeTraining') },
                { name: 'Engineering Student Focus', action: () => onNavigate('collegeTraining') }
            ]
        }
    };

    const scrollToSection = (id) => {
        try {
            // navigation triggered; active link highlighting removed

            // Handle different navigation scenarios
            const targetId = id.toLowerCase().replace(/\s+/g, '-');

            // If we are not on the home page, navigate there first, then scroll
            if (currentPage !== 'home') {
                // Pass the section to scroll to via URL hash so Home can handle it after navigation
                onNavigate('home');
                setTimeout(() => {
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // If we are already on the home page, just scroll
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            setIsOpen(false); // Close the mobile menu after clicking a link
        } catch (error) {
            console.error('Scroll error:', error);
            setIsOpen(false);
        }
    };



    return (
        <header
            className={`shadow-lg sticky top-0 w-full ${gradientClass} bg-fixed`}
            style={{
                zIndex: 50,
                display: 'block',
                minHeight: '80px'
            }}
        >
            <nav className="mx-auto px-6 py-4" style={{maxWidth: '1200px'}}>
                {/* Desktop Navigation - Clean & Professional */}
                <div className="flex items-center w-full"
                     style={{display: 'flex', alignItems: 'center'}}>
                    {/* Left - Logo & Company Name */}
                    <div className="flex items-center space-x-3 flex-shrink-0 mr-8">
                        <button
                            onClick={() => onNavigate('home')}
                            className="flex items-center space-x-3 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <img
                                    src="/logo.png"
                                    alt="AT Logo"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2 lg:space-x-4">
                                <div>
                                    <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                                        Agnidhra Technologies
                                    </span>
                                    <div className="text-xs text-slate-300 -mt-1">
                                        Cybersecurity & Technology Training
                                    </div>
                                </div>
                                {/* Search bar beside Agnidhra Technologies - always show on desktop */}
                                <div className="block ml-4">
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Center - Main Navigation */}
                    <nav className="flex-1 flex justify-center">
                        <SimpleNavigation onNavigate={onNavigate} currentPage={currentPage} />
                    </nav>

                    {/* Right - Actions: Enroll Now and Login/Username Dropdown */}
                    <div className="flex items-center space-x-4 flex-shrink-0 ml-8">
                        {/* Enroll Now button removed as enrollment is now per-course */}
                        {user ? (
                            <UserMenu
                                user={user}
                                onProfile={() => onNavigate('profile')}
                                onLogout={logout}
                            />
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                                >
                                    Contact Us
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="hidden" style={{display: 'none'}}>
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
                <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 max-h-96 overflow-y-auto">
                    <ul className="px-4 pt-2 pb-3 space-y-1">
                        {/* Programs Section */}
                        <li>
                            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide px-3 py-2">
                                Training Programs
                            </div>
                            {Object.entries(mobileProgramCategories).map(([key, category]) => (
                                <div key={key} className="mb-2">
                                    <button
                                        onClick={() => setExpandedMobileCategory(expandedMobileCategory === key ? null : key)}
                                        className="flex items-center justify-between w-full text-left px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-md"
                                    >
                                        <span className="text-sm font-medium">{category.title}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                                            expandedMobileCategory === key ? 'rotate-180' : ''
                                        }`} />
                                    </button>

                                    {expandedMobileCategory === key && (
                                        <div className="overflow-hidden">
                                            <div className="pl-4 space-y-1">
                                                {category.courses.map((course, courseIndex) => (
                                                    <button
                                                        key={courseIndex}
                                                        onClick={() => { course.action(); setIsOpen(false); setExpandedMobileCategory(null); }}
                                                        className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-blue-400 hover:bg-slate-800/30 rounded-md"
                                                    >
                                                        {course.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => { scrollToSection('programs'); setIsOpen(false); }}
                                className="w-full text-center px-3 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                                📋 View All Programs
                            </button>
                        </li>

                        {/* Divider */}
                        <li className="border-t border-slate-700 pt-2"></li>

                        {/* Other Navigation Items */}
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

                        {/* CTA Button */}
                        <li className="pt-2 border-t border-slate-700">
                            {/* Enroll Now button removed from mobile menu */}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

// Simplified Navigation Component - Replaces Mega Menu
const SimpleNavigation = ({ onNavigate, currentPage }) => {
    const [isCyberDropdownOpen, setIsCyberDropdownOpen] = useState(false);

    const navigationItems = [
        {
            label: 'Cybersecurity Academy',
            hasDropdown: true,
            isActive: currentPage === 'home',
            action: () => onNavigate('home'),
            dropdownItems: [
                { label: 'Premium Courses (₹20K)', action: () => onNavigate('home'), highlight: true },
                { label: 'Security Bootcamps', action: () => onNavigate('events-batches') },
                { label: 'Specialized Add-ons', action: () => onNavigate('home') }
            ]
        },
        {
            label: 'Technology Institute',
            hasDropdown: false,
            isActive: currentPage === 'technologyTraining',
            action: () => onNavigate('technologyTraining'),
            highlight: true
        },
        {
            label: 'Events & Batches',
            hasDropdown: false,
            isActive: currentPage === 'events-batches',
            action: () => onNavigate('events-batches')
        }
    ];

    return (
        <nav className="flex items-center space-x-8">
            {navigationItems.map((item, index) => (
                <div key={index} className="relative group">
                    {item.hasDropdown ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setIsCyberDropdownOpen(true)}
                            onMouseLeave={() => setIsCyberDropdownOpen(false)}
                        >
                            <button
                                onClick={item.action}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    item.isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {item.label}
                                <ChevronDown size={16} className={`transition-transform ${isCyberDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {isCyberDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-50">
                                    {item.dropdownItems.map((dropdownItem, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                dropdownItem.action();
                                                setIsCyberDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 transition-colors ${
                                                dropdownItem.highlight
                                                    ? 'text-blue-400 hover:bg-blue-500/20'
                                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }`}
                                        >
                                            {dropdownItem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={item.action}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                item.highlight
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                    : item.isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {item.label}
                        </button>
                    )}
                </div>
            ))}
        </nav>
    );
};



