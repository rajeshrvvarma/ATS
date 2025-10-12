import React, { useState } from 'react';
import { X, Menu, ChevronDown, Home, Shield, Sword, Sparkles, Target, Code, Cloud, Database, Globe, Laptop, TestTube, BookOpen, Clock, Star, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell.jsx';
import UserMenu from '@/components/UserMenu.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useCoursePricing, formatPrice } from '@/hooks/useCoursePricing.js';

export default function Header({ onNavigate, currentPage }) {
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

    // Mobile navigation items
    const mobileNavItems = [
        { name: "Upcoming Batches", action: () => onNavigate('upcoming-batches') },
        { name: "About Us", action: () => scrollToSection('about') },
        { name: "Learning Portal", action: () => onNavigate('video-learning') },
        { name: "Contact Us", action: () => onNavigate('contact') },
        { name: "Login", action: () => onNavigate('login') }
    ];

    // Mobile program categories (simplified from mega menu)
    const mobileProgramCategories = {
        foundation: {
            title: '🎯 Foundation Programs (₹99)',
            courses: [
                { name: 'Cybersecurity Fundamentals', action: () => onNavigate('enroll') },
                { name: 'Technology Overview', action: () => onNavigate('enroll') }
            ]
        },
        bootcamp: {
            title: '⚡ 7-Day Bootcamps',
            courses: [
                { name: 'SOC Analyst Bootcamp (₹499+)', action: () => onNavigate('defensiveBootcampLanding') },
                { name: 'Ethical Hacking Bootcamp (₹599+)', action: () => onNavigate('offensiveBootcampLanding') }
            ]
        },
        premium: {
            title: '🏆 2-Month Programs',
            courses: [
                { name: 'Defensive Mastery (₹5,999)', action: () => onNavigate('defensiveMastery') },
                { name: 'Elite Hacker Program (₹7,999)', action: () => onNavigate('offensiveMastery') }
            ]
        },
        specialized: {
            title: '🎯 Specialized Courses',
            courses: [
                { name: 'Cloud Security', action: () => onNavigate('specializedCourses') },
                { name: 'Digital Forensics', action: () => onNavigate('specializedCourses') },
                { name: 'GRC & Compliance', action: () => onNavigate('specializedCourses') }
            ]
        },
        technology: {
            title: '💻 Technology Training',
            courses: [
                { name: 'Full Stack Development', action: () => onNavigate('enroll') },
                { name: 'Cloud & DevOps', action: () => onNavigate('enroll') },
                { name: 'AI & Data Science', action: () => onNavigate('enroll') },
                { name: 'Software Testing', action: () => onNavigate('enroll') }
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
            className="bg-slate-900 shadow-lg sticky top-0 w-full" 
            style={{
                zIndex: 50, 
                backgroundColor: 'rgb(15 23 42)', 
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
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg">
                                <img 
                                    src="/logo.png" 
                                    alt="AT Logo" 
                                    className="w-10 h-10 rounded-full group-hover:scale-110 transition-transform duration-200" 
                                />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                                    Agnidhra Technologies
                                </span>
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
                            <button
                                onClick={() => onNavigate('upcoming-batches')}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap px-2"
                            >
                                Upcoming Batches
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap px-2"
                            >
                                About Us
                            </button>
                            <button
                                onClick={() => onNavigate('video-learning')}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap px-2"
                            >
                                Learning Portal
                            </button>
                            <button
                                onClick={() => onNavigate('contact')}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap px-2"
                            >
                                Contact Us
                            </button>
                        </div>
                    </nav>

                    {/* Right - Actions: Enroll Now and Login/Username Dropdown */}
                    <div className="flex items-center space-x-4 flex-shrink-0 ml-8">
                        <button
                            onClick={() => onNavigate('enroll')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                            Enroll Now
                        </button>
                        {user ? (
                            <UserMenu 
                                user={user} 
                                onProfile={() => onNavigate('profile')} 
                                onDashboard={() => onNavigate('dashboard')}
                                onLogout={logout} 
                            />
                        ) : (
                            <button
                                onClick={() => onNavigate('login')}
                                className="bg-slate-800 px-4 py-2 rounded-lg text-white font-semibold hover:bg-slate-700 transition-colors"
                            >
                                Login
                            </button>
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
                                    
                                    <AnimatePresence>
                                        {expandedMobileCategory === key && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                            <button 
                                onClick={() => { setIsOpen(false); onNavigate('enroll'); }} 
                                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                🚀 Enroll Now
                            </button>
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
                    action: () => onNavigate('enroll'),
                    popular: true
                },
                {
                    title: 'Technology Overview Workshop',
                    duration: '2 Days',
                    price: '₹99',
                    description: 'Explore AI, Cloud Computing, and DevSecOps fundamentals',
                    action: () => onNavigate('enroll')
                }
            ]
        },
        defensive: {
            title: 'Defensive Security',
            icon: Shield,
            color: 'blue',
            courses: [
                {
                    title: '7-Day SOC Bootcamp',
                    duration: '1 Week',
                    price: getPrice('defensive-bootcamp', 'Starting ₹499'),
                    description: 'From Zero to SOC Analyst Ready',
                    action: () => onNavigate('defensiveBootcampLanding'),
                    popular: true
                },
                {
                    title: '2-Month Mastery Program',
                    duration: '2 Months',
                    price: getPrice('defensive-mastery', '₹5,999'),
                    description: 'Premium certification with mentorship',
                    action: () => onNavigate('defensiveMastery')
                }
            ]
        },
        offensive: {
            title: 'Offensive Security',
            icon: Sword,
            color: 'red',
            courses: [
                {
                    title: '7-Day Ethical Hacking Bootcamp',
                    duration: '1 Week',
                    price: getPrice('offensive-bootcamp', 'Starting ₹599'),
                    description: 'Master penetration testing fundamentals',
                    action: () => onNavigate('offensiveBootcampLanding'),
                    popular: true
                },
                {
                    title: '2-Month Elite Hacker Program',
                    duration: '2 Months',
                    price: getPrice('offensive-mastery', '₹7,999'),
                    description: 'Advanced red team operations',
                    action: () => onNavigate('offensiveMastery')
                }
            ]
        },
        specialized: {
            title: 'Specialized Security',
            icon: Target,
            color: 'purple',
            courses: [
                // Cloud Security
                { title: 'AWS Security Specialist', duration: '4 Weeks', price: getPrice('aws-security-specialist', '₹3,999'), description: 'AWS security services, IAM & cloud-native tools', action: () => onNavigate('specializedCourses') },
                { title: 'Azure Security Engineer', duration: '4 Weeks', price: getPrice('azure-security-engineer', '₹3,999'), description: 'Azure security implementation & management', action: () => onNavigate('specializedCourses') },
                { title: 'Multi-Cloud Security Architect', duration: '6 Weeks', price: getPrice('multi-cloud-security-architect', '₹5,999'), description: 'Advanced multi-cloud security architecture', action: () => onNavigate('specializedCourses') },

                // Digital Forensics & Malware
                { title: 'Digital Forensics Investigator', duration: '5 Weeks', price: getPrice('digital-forensics-investigator', '₹4,999'), description: 'Digital evidence collection and analysis', action: () => onNavigate('specializedCourses') },
                { title: 'Advanced Malware Forensics', duration: '4 Weeks', price: getPrice('advanced-malware-forensics', '₹4,499'), description: 'Malware reverse engineering & analysis', action: () => onNavigate('specializedCourses') },
                { title: 'Malware Analysis Fundamentals', duration: '3 Weeks', price: getPrice('malware-analysis-fundamentals', '₹2,999'), description: 'Intro to malware analysis & tooling', action: () => onNavigate('specializedCourses') },
                { title: 'Advanced Reverse Engineering', duration: '6 Weeks', price: getPrice('advanced-reverse-engineering', '₹5,499'), description: 'Exploit analysis & advanced RE', action: () => onNavigate('specializedCourses') },

                // Compliance & Incident Response
                { title: 'ISO 27001 Lead Implementer', duration: '4 Weeks', price: getPrice('iso-27001-lead-implementer', '₹3,499'), description: 'Complete ISO 27001 implementation', action: () => onNavigate('specializedCourses') },
                { title: 'GRC Analyst Professional', duration: '5 Weeks', price: getPrice('grc-analyst-professional', '₹4,299'), description: 'Governance, risk and compliance', action: () => onNavigate('specializedCourses') },
                { title: 'Incident Response Specialist', duration: '4 Weeks', price: getPrice('incident-response-specialist', '₹3,999'), description: 'End-to-end incident response', action: () => onNavigate('specializedCourses') },
                { title: 'Advanced Threat Hunting', duration: '5 Weeks', price: getPrice('advanced-threat-hunting', '₹4,799'), description: 'Proactive detection & hunting', action: () => onNavigate('specializedCourses') }
            ]
        },
        technology: {
            title: 'Technology Training',
            icon: Laptop,
            color: 'indigo',
            courses: [
                // Full Stack Development
                { title: 'MERN Stack Developer', duration: '6 Months', price: getPrice('mern-stack-developer', '₹30,000'), description: 'MongoDB, Express, React, Node', action: () => onNavigate('technologyTraining') },
                { title: 'Full Stack Python Developer', duration: '6 Months', price: getPrice('full-stack-python-developer', '₹28,000'), description: 'Python, Django/Flask, PostgreSQL', action: () => onNavigate('technologyTraining') },
                { title: 'Java Full Stack Developer', duration: '7 Months', price: getPrice('java-full-stack-developer', '₹32,000'), description: 'Java, Spring Boot, Angular/React', action: () => onNavigate('technologyTraining') },

                // Cloud & DevOps
                { title: 'AWS Cloud Architect', duration: '4 Months', price: getPrice('aws-cloud-architect', '₹25,000'), description: 'AWS services & architecture', action: () => onNavigate('technologyTraining') },
                { title: 'DevOps Engineer Bootcamp', duration: '5 Months', price: getPrice('devops-engineer-bootcamp', '₹27,000'), description: 'CI/CD, Docker, Kubernetes', action: () => onNavigate('technologyTraining') },
                { title: 'Azure Cloud Solutions', duration: '4 Months', price: getPrice('azure-cloud-solutions', '₹24,000'), description: 'Azure services & enterprise solutions', action: () => onNavigate('technologyTraining') },

                // AI & Data
                { title: 'Data Science with Python', duration: '5 Months', price: getPrice('data-science-with-python', '₹20,000'), description: 'Data analysis & machine learning', action: () => onNavigate('technologyTraining') },
                { title: 'AI & Machine Learning Engineer', duration: '6 Months', price: getPrice('ai-ml-engineer', '₹35,000'), description: 'Deep learning & model deployment', action: () => onNavigate('technologyTraining') },
                { title: 'Business Intelligence Analyst', duration: '3 Months', price: getPrice('business-intelligence-analyst', '₹18,000'), description: 'Power BI, Tableau and SQL', action: () => onNavigate('technologyTraining') },

                // Testing
                { title: 'Automation Testing Engineer', duration: '4 Months', price: getPrice('automation-testing-engineer', '₹18,000'), description: 'Selenium, API & performance testing', action: () => onNavigate('technologyTraining') },
                { title: 'Manual Testing Specialist', duration: '2 Months', price: getPrice('manual-testing-specialist', '₹12,000'), description: 'Manual QA foundations', action: () => onNavigate('technologyTraining') },

                // Mobile
                { title: 'React Native Developer', duration: '4 Months', price: getPrice('react-native-developer', '₹22,000'), description: 'Cross-platform mobile apps', action: () => onNavigate('technologyTraining') },
                { title: 'Flutter App Developer', duration: '4 Months', price: getPrice('flutter-app-developer', '₹20,000'), description: 'Flutter & Dart mobile apps', action: () => onNavigate('technologyTraining') }
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
            
            <AnimatePresence>
                {isProgramsOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-[800px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

