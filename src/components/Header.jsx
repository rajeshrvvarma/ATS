import React, { useState } from 'react';
import { X, Menu, ChevronDown, Home, Shield, Sword, Sparkles, Target, Code, Cloud, Database, Globe, Laptop, TestTube, BookOpen, Clock, Star, Users, BrainCircuit } from 'lucide-react';
// Removed framer-motion to eliminate header animations
import NotificationBell from '@/components/NotificationBell.jsx';
import UserMenu from '@/components/UserMenu.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';

// Clean header background - no gradients
const headerBackground = 'bg-slate-900';

export default function Header({ onNavigate, currentPage }) {
  // Use clean header background
  const gradientClass = headerBackground;
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    // Get authentication state for notification bell
    const { user, logout } = useAuth();

    // Load centralized pricing
    const coursePricingData = useCoursePricing();
    const coursePricing = coursePricingData?.pricing || {};
    const pricingLoading = coursePricingData?.loading || false;

    // Production debugging
    React.useEffect(() => {
        console.log('🔧 Header mounted in production:', { currentPage, timestamp: new Date().toISOString() });
    }, [currentPage]);
    // Mobile navigation state
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

    // Mobile navigation items - dynamic based on user status
    const mobileNavItems = [
    { name: "Events & Batches", action: () => onNavigate('events-batches') },
        // Module catalog archived - premium courses only
        { name: "About Us", action: () => scrollToSection('about') },
        ...(user && user.enrolledCourses && user.enrolledCourses.length > 0
            ? [{ name: "My Learning", action: () => onNavigate('dashboard') }]
            : []
        ),
        { name: "Contact Us", action: () => onNavigate('contact') },
        { name: "Login", action: () => onNavigate('login') }
    ];

    // Mobile program categories (simplified from mega menu)
    const mobileProgramCategories = {
        foundation: {
            title: '🎯 Foundation Programs (₹99)',
            courses: [
                { name: 'Cybersecurity Fundamentals', action: () => onNavigate('cybersecurityFundamentals') },
                { name: 'Technology Overview', action: () => onNavigate('technologyOverview') }
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
            setActiveLink(id);

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

    const isLinkActive = (link) => {
        // Map page routes to human-readable labels
        const routeMap = {
            'video-learning': 'Learning Portal',
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
                                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                                    Agnidhra Technologies
                                </span>
                                {/* Search bar beside Agnidhra Technologies - always show on desktop */}
                                <div className="block ml-4">
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Center - Main Navigation */}
                    <nav className="flex-1 flex justify-center">
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <MegaMenuPrograms
                                onNavigate={onNavigate}
                                scrollToSection={scrollToSection}
                                coursePricing={coursePricing}
                                pricingLoading={pricingLoading}
                            />
                            {/* Remove search bar from here, now beside Agnidhra Technologies */}
                            <button
                                onClick={() => onNavigate('events-batches')}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap px-2"
                            >
                                Events & Batches
                            </button>
                            {/* About Us and Contact Us links removed */}
                        </div>
                    </nav>

                    {/* Right - Actions: Enroll Now and Login/Username Dropdown */}
                    <div className="flex items-center space-x-4 flex-shrink-0 ml-8">
                        {/* Enroll Now button removed as enrollment is now per-course */}
                        {user ? (
                            <UserMenu
                                user={user}
                                onProfile={() => onNavigate('profile')}
                                onDashboard={() => onNavigate('dashboard')}
                                onLogout={logout}
                            />
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('trainer-signup')}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                                >
                                    Trainer Sign Up
                                </button>
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                                >
                                    Login
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

// Mega Menu Component for Programs
const MegaMenuPrograms = ({ onNavigate, scrollToSection, coursePricing, pricingLoading }) => {
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('foundation');

    // Helper function to get price from centralized pricing
    const getPrice = (courseId, fallbackPrice = '₹999') => {
        if (pricingLoading) return '₹...';
        if (coursePricing && coursePricing[courseId]) {
            return formatPrice(coursePricing[courseId].finalPrice);
        }
        return fallbackPrice;
    };

    const programCategories = {
        foundation: {
            title: 'Foundation Programs',
            icon: BookOpen,
            color: 'green',
            courses: [
                {
                    title: 'Cybersecurity Fundamentals Workshop',
                    duration: '2 Days',
                    price: '₹99',
                    description: 'Introduction to cybersecurity landscape and career paths',
                    action: () => onNavigate('cybersecurityFundamentals'),
                    popular: true
                },
                {
                    title: 'Technology Overview Workshop',
                    duration: '2 Days',
                    price: '₹99',
                    description: 'Explore AI, Cloud Computing, and DevSecOps fundamentals',
                    action: () => onNavigate('technologyOverview')
                }
            ]
        },
        defensive: {
            title: 'Defensive Security',
            icon: Shield,
            color: 'blue',
            courses: [
                {
                    title: 'Defensive Security Professional',
                    duration: '8 Weeks',
                    price: '₹20,000',
                    description: 'SOC Analyst to Security Engineer Path',
                    action: () => onNavigate('home'),
                    popular: true
                },
                {
                    title: '7-Day SOC Bootcamp',
                    duration: '1 Week',
                    price: getPrice('defensive-bootcamp', 'Starting ₹499'),
                    description: 'From Zero to SOC Analyst Ready',
                    action: () => onNavigate('events-batches'),
                    badge: 'Bootcamp'
                }
            ]
        },
        offensive: {
            title: 'Offensive Security',
            icon: Sword,
            color: 'red',
            courses: [
                {
                    title: 'Offensive Security Mastery',
                    duration: '8 Weeks',
                    price: '₹20,000',
                    description: 'Ethical Hacker to Penetration Tester',
                    action: () => onNavigate('home'),
                    popular: true
                },
                {
                    title: '7-Day Ethical Hacking Bootcamp',
                    duration: '1 Week',
                    price: getPrice('offensive-bootcamp', 'Starting ₹599'),
                    description: 'Master penetration testing fundamentals',
                    action: () => onNavigate('events-batches'),
                    badge: 'Bootcamp'
                }
            ]
        },
        multicloud: {
            title: 'MultiCloud DevOps',
            icon: Cloud,
            color: 'cyan',
            courses: [
                {
                    title: 'MultiCloud DevOps Mastery',
                    duration: '8 Weeks',
                    price: '₹20,000',
                    description: 'AWS/Azure/GCP + DevOps Engineer',
                    action: () => onNavigate('home'),
                    popular: true
                },
                {
                    title: 'Cloud Security Add-on',
                    duration: '4 Weeks',
                    price: '₹8,999',
                    description: 'Multi-cloud security & compliance',
                    action: () => onNavigate('home'),
                    badge: 'Add-on'
                }
            ]
        },
        addons: {
            title: 'Specialized Add-ons',
            icon: Target,
            color: 'purple',
            courses: [
                { title: 'Cloud Security Mastery', duration: '4 Weeks', price: '₹8,999', description: 'AWS/Azure/GCP security & compliance', action: () => onNavigate('home') },
                { title: 'Digital Forensics & Investigation', duration: '3 Weeks', price: '₹7,999', description: 'Evidence collection & analysis', action: () => onNavigate('home') },
                { title: 'Malware Analysis & Reverse Engineering', duration: '4 Weeks', price: '₹9,999', description: 'Dissect malware & understand attacks', action: () => onNavigate('home') },
                { title: 'GRC & Compliance', duration: '3 Weeks', price: '₹6,999', description: 'Governance, Risk & Compliance', action: () => onNavigate('home') },
                { title: 'Incident Response & Threat Hunting', duration: '4 Weeks', price: '₹8,999', description: 'Advanced incident response', action: () => onNavigate('home') },
                { title: 'Red Team Operations', duration: '6 Weeks', price: '₹12,999', description: 'Advanced persistent threat simulation', action: () => onNavigate('home') }
            ]
        },
        college: {
            title: 'College Training',
            icon: Users,
            color: 'orange',
            courses: [
                {
                    title: 'College Bulk Training Program',
                    duration: '8 Weeks',
                    price: 'Starting ₹299/student',
                    description: 'Specialized training for 100-200 engineering students',
                    action: () => onNavigate('collegeTraining'),
                    popular: true
                },
                {
                    title: 'Team Skill Development',
                    duration: 'Customizable',
                    price: 'Contact Us',
                    description: 'Multi-technology training solutions',
                    action: () => onNavigate('contact')
                }
            ]
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            green: 'text-green-400 bg-green-600',
            blue: 'text-blue-400 bg-blue-600',
            red: 'text-red-400 bg-red-600',
            purple: 'text-purple-400 bg-purple-600',
            indigo: 'text-indigo-400 bg-indigo-600',
            orange: 'text-orange-400 bg-orange-600'
        };
        return colors[color] || colors.blue;
    };

    const getHoverClasses = (color) => {
        const colors = {
            green: 'hover:bg-green-600/20 hover:text-green-300',
            blue: 'hover:bg-blue-600/20 hover:text-blue-300',
            red: 'hover:bg-red-600/20 hover:text-red-300',
            purple: 'hover:bg-purple-600/20 hover:text-purple-300',
            indigo: 'hover:bg-indigo-600/20 hover:text-indigo-300',
            orange: 'hover:bg-orange-600/20 hover:text-orange-300'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsProgramsOpen(true)}
            onMouseLeave={() => setIsProgramsOpen(false)}
        >
            <button className="flex items-center text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200">
                Programs
                <ChevronDown className="ml-1 h-4 w-4" />
            </button>

            {isProgramsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[800px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
                >
                        <div className="flex">
                            {/* Left sidebar - Categories */}
                            <div className="w-64 bg-slate-900 p-4 border-r border-slate-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Training Categories</h3>
                                <div className="space-y-1">
                                    {Object.entries(programCategories).map(([key, category]) => {
                                        const IconComponent = category.icon;
                                        const isActive = activeCategory === key;
                                        const colorClasses = getColorClasses(category.color);
                                        const hoverClasses = getHoverClasses(category.color);

                                        return (
                                            <button
                                                key={key}
                                                onMouseEnter={() => setActiveCategory(key)}
                                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                                                    isActive
                                                        ? `bg-slate-700 ${category.color === 'blue' ? 'text-blue-400' : category.color === 'red' ? 'text-red-400' : category.color === 'green' ? 'text-green-400' : category.color === 'purple' ? 'text-purple-400' : category.color === 'indigo' ? 'text-indigo-400' : 'text-orange-400'}`
                                                        : `text-slate-300 ${hoverClasses}`
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`rounded-lg p-2 ${isActive ? colorClasses.split(' ')[1] : 'bg-slate-700'}`}>
                                                        <IconComponent className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{category.title}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {category.courses.length} course{category.courses.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right content - Courses */}
                            <div className="flex-1 p-6">
                                <div className="mb-4">
                                    <h4 className="text-xl font-semibold text-white mb-2">
                                        {programCategories[activeCategory]?.title}
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Choose from our comprehensive {programCategories[activeCategory]?.title.toLowerCase()} programs
                                    </p>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {programCategories[activeCategory]?.courses.map((course, index) => (
                                        <button
                                            key={index}
                                            onClick={course.action}
                                            className="w-full text-left p-4 rounded-lg hover:bg-slate-700 transition-colors duration-200 group border border-slate-700 hover:border-slate-600"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-medium text-white group-hover:text-blue-400">
                                                            {course.title}
                                                        </h5>
                                                        {course.popular && (
                                                            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
                                                                POPULAR
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-400 mb-2">{course.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {course.duration}
                                                        </span>
                                                        <span className="font-semibold text-green-400">
                                                            {course.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-700">
                                    <button
                                        onClick={() => scrollToSection('programs')}
                                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Star className="h-4 w-4" />
                                        View All Programs & Detailed Information
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};


