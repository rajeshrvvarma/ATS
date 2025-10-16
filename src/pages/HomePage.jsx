import React, { useState, useEffect } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle, ArrowRight, Star, TrendingUp, Clock, DollarSign, BookOpen, Globe, Zap, Grid3X3, Layers, Map, Eye, RotateCcw, Laptop, Cloud, Database, TestTube, Search, Filter, Play, BookmarkPlus, ChevronDown, ArrowDown, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle.jsx';
import { sendContactForm } from '@/services/netlifyFormsService.js';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';


// Module-Focused Hero Section
const HeroSection = ({ onNavigate, modules, loading, error }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    const [activeHero, setActiveHero] = useState(0); // 0: modular, 1: traditional
    const categories = ['All', ...new Set(modules.map(module => module.category))];

    if (loading) return <div className="text-center text-white py-12">Loading modules...</div>;
    if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

    // Hero panel data
    const heroPanels = [
        {
            title: <>
                Learn <span className="text-cyan-400">Any Skill</span><br />
                <span className="text-3xl md:text-5xl text-blue-400">One Module at a Time</span>
            </>,
            description: <>
                Choose from <strong className="text-blue-400">{modules.length}+ Expert Modules</strong> across
                <strong className="text-purple-400"> Technology</strong>, <strong className="text-red-400">Cybersecurity</strong>,
                and <strong className="text-green-400">Programming</strong>. Build your custom learning path.<br />
                <span className="text-green-400 font-semibold">Self-paced, flexible, skill-focused.</span>
            </>,
            features: [
                { icon: BookOpen, text: `${modules.length}+ Learning Modules` },
                { icon: Layers, text: `${categories.length - 1} Categories` },
                { icon: TrendingUp, text: 'Self-Paced Learning' },
            ],
            label: 'Modular Learning',
        },
        {
            title: <>
                <span className="text-yellow-400">Traditional Training Programs</span><br />
                <span className="text-3xl md:text-5xl text-blue-400">Comprehensive Course Paths</span>
            </>,
            description: <>
                Enroll in <strong className="text-yellow-400">Specialized Security Courses</strong> and
                <strong className="text-blue-400"> Full-Length Programs</strong> for a guided, instructor-led experience.<br />
                <span className="text-yellow-400 font-semibold">Structured, cohort-based, certification-ready.</span>
            </>,
            features: [
                { icon: Star, text: 'Instructor-Led Sessions' },
                { icon: Users, text: 'Cohort-Based Learning' },
                { icon: Clock, text: 'Fixed Timelines' },
            ],
            label: 'Traditional Courses',
        },
    ];

    // Custom bounce delay for staggered arrow animation
    const arrowBounceDelays = [
        '', // center
        'animation-delay-300', // left
        'animation-delay-600', // right
    ];

    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <div className="min-h-[45vh] flex items-center justify-center bg-slate-900 bg-fixed py-8 md:py-12 relative">
                <section id="home" className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-6 relative">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {heroPanels[activeHero].title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                            {heroPanels[activeHero].description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 mb-6 text-center">
                            {heroPanels[activeHero].features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                    <f.icon className={`w-5 h-5 ${activeHero === 0 ? 'text-blue-400' : 'text-yellow-400'}`} />
                                    <span className="text-white font-semibold">{f.text}</span>
                                </div>
                            ))}
                        </div>
                        {/* Three animated arrows pointing to Section 2 */}
                        <div className="flex flex-col items-center mt-2">
                            <ArrowDown className={`w-16 h-16 ${activeHero === 0 ? 'text-cyan-400' : 'text-yellow-400'} animate-bounce`} />
                            <div className="flex justify-center gap-32 mt-6">
                                <ArrowDownLeft className={`w-16 h-16 ${activeHero === 0 ? 'text-cyan-400' : 'text-yellow-400'} animate-bounce animation-delay-300`} />
                                <ArrowDownRight className={`w-16 h-16 ${activeHero === 0 ? 'text-cyan-400' : 'text-yellow-400'} animate-bounce animation-delay-600`} />
                            </div>
                        </div>
                        {/* Left/right arrows for toggle */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                            <button
                                aria-label="Previous hero panel"
                                onClick={() => setActiveHero((activeHero + heroPanels.length - 1) % heroPanels.length)}
                                className="bg-slate-800 text-white rounded-full p-2 shadow hover:bg-slate-700 transition-all"
                            >
                                <ChevronDown style={{ transform: 'rotate(90deg)' }} className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <button
                                aria-label="Next hero panel"
                                onClick={() => setActiveHero((activeHero + 1) % heroPanels.length)}
                                className="bg-slate-800 text-white rounded-full p-2 shadow hover:bg-slate-700 transition-all"
                            >
                                <ChevronDown style={{ transform: 'rotate(-90deg)' }} className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};


// Combined Modules & Traditional Courses Section with Tabs
const CoursesTabbedSection = ({ onNavigate, modules, activeTab, setActiveTab, searchFilter, setSearchFilter, expandedCard, setExpandedCard, setCourseDetailsModal, setEnrollmentModal }) => {
    // --- Module Section Logic ---
    const [selectedCategory, setSelectedCategory] = useState('All');
    // Make searchTerm fully controlled by searchFilter prop
    const searchTerm = typeof searchFilter === 'string' ? searchFilter : '';
    const categories = ['All', ...new Set(modules.map(module => module.category))];
    const handleTabClick = (category) => {
        setSelectedCategory(category);
        if (setSearchFilter) setSearchFilter('');
    };
    const featuredModules = modules
        .filter(module => {
            const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                module.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .slice(0, 12);
    const getCategoryIcon = (category) => {
        const iconMap = {
            'Programming Foundation': Code,
            'Web Development': Globe,
            'Cloud Computing': Cloud,
            'Data Science & Analytics': Database,
            'Cybersecurity Foundation': Shield,
            'Network Security': Server,
            'Threat Intelligence': Eye,
            'Incident Response': Target,
            'DevOps & Infrastructure': Laptop,
            'Software Testing': TestTube,
            'AI & Machine Learning': BrainCircuit,
            'Blockchain & Cryptocurrency': Grid3X3
        };
        return iconMap[category] || BookOpen;
    };
    const getCategoryColor = (category) => {
        const colorMap = {
            'Programming Foundation': 'blue',
            'Web Development': 'green',
            'Cloud Computing': 'cyan',
            'Data Science & Analytics': 'purple',
            'Cybersecurity Foundation': 'red',
            'Network Security': 'orange',
            'Threat Intelligence': 'yellow',
            'Incident Response': 'pink',
            'DevOps & Infrastructure': 'indigo',
            'Software Testing': 'gray',
            'AI & Machine Learning': 'violet',
            'Blockchain & Cryptocurrency': 'emerald'
        };
        return colorMap[category] || 'slate';
    };
    // --- Traditional Courses Logic ---
    const traditionalCourses = [
        {
            id: 'specialized-courses',
            title: 'Specialized Security Courses',
            subtitle: '11+ Domain-Specific Training',
            description: 'Master specialized cybersecurity domains like cloud security, forensics, and compliance.',
            price: 'Starting ₹2,999',
            duration: 'Flexible',
            level: 'Intermediate',
            icon: Target,
            color: 'purple',
            features: ['Cloud Security', 'Digital Forensics', 'GRC & Compliance', 'Expert Mentorship'],
            action: () => onNavigate('specializedCourses'),
            gradient: 'from-purple-600 to-purple-800',
            enrolled: '200+'
        },
        {
            id: 'technology-training',
            title: 'Technology Training',
            subtitle: 'Full Stack & Cloud Development',
            description: 'Comprehensive technology training beyond cybersecurity including web development and cloud.',
            price: 'Starting ₹18,000',
            duration: 'Flexible',
            level: 'Beginner to Advanced',
            icon: Laptop,
            color: 'indigo',
            features: ['Full Stack Development', 'Cloud & DevOps', 'AI & Data Science', 'Software Testing'],
            action: () => onNavigate('technologyTraining'),
            gradient: 'from-indigo-600 to-indigo-800',
            enrolled: '150+'
        },
        {
            id: 'defensive-mastery',
            title: 'Defensive Security Mastery',
            subtitle: '2-Month Elite Training',
            description: 'Comprehensive defensive security training with personal mentorship and job guarantee.',
            price: '₹5,999',
            duration: '2 Months',
            level: 'All Levels',
            icon: Shield,
            color: 'blue',
            features: ['Personal Mentor', '10+ Projects', 'Job Guarantee', 'Small Batch (20 students)'],
            action: () => onNavigate('defensiveMastery'),
            gradient: 'from-blue-600 to-purple-800',
            enrolled: '18/20'
        },
        {
            id: 'offensive-mastery',
            title: 'Elite Hacker Program',
            subtitle: '2-Month Advanced Training',
            description: 'Advanced red team operations with custom exploit development and elite mentorship.',
            price: '₹7,999',
            duration: '2 Months',
            level: 'Advanced',
            icon: Sword,
            color: 'red',
            features: ['Custom Exploits', 'Red Team Operations', 'Elite Mentorship', 'Advanced Labs'],
            action: () => onNavigate('offensiveMastery'),
            gradient: 'from-red-600 to-orange-800',
            enrolled: '12/15'
        },
        {
            id: 'college-training',
            title: 'College Bulk Training',
            subtitle: 'Student Programs',
            description: 'Specialized cybersecurity training for 100-200 engineering students with placement support.',
            price: 'Starting ₹299/student',
            duration: '8 Weeks',
            level: 'Beginner Friendly',
            icon: Users,
            color: 'orange',
            features: ['Bulk Pricing', 'Placement Support', 'Industry Certificates', 'College Partnerships'],
            action: () => onNavigate('collegeTraining'),
            gradient: 'from-orange-600 to-orange-800',
            enrolled: '500+ Colleges'
        }
    ];

    return (
        <div className="py-20 bg-slate-900" id="courses-tabbed-section">
            <section className="container mx-auto px-6">
                {/* Tab Switcher */}
                <div className="flex justify-center mb-10">
                    <button
                        className={`px-8 py-3 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ${activeTab === 'modules' ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-slate-800 text-slate-300 border-transparent hover:bg-blue-700 hover:text-white'}`}
                        onClick={() => setActiveTab('modules')}
                    >
                        Module-Based Courses
                    </button>
                    <button
                        className={`px-8 py-3 rounded-t-lg font-bold text-lg transition-all duration-200 border-b-4 ml-2 ${activeTab === 'traditional' ? 'bg-purple-600 text-white border-purple-400 shadow-lg' : 'bg-slate-800 text-slate-300 border-transparent hover:bg-purple-700 hover:text-white'}`}
                        onClick={() => setActiveTab('traditional')}
                    >
                        Traditional Programs
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'modules' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-10"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Featured <span className="text-green-400">Learning Modules</span>
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                                Expertly crafted modules covering everything from programming fundamentals to advanced cybersecurity. Start with any module that matches your interests and career goals.
                            </p>
                            {/* Tabs for categories */}
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleTabClick(category)}
                                        className={`px-5 py-2 rounded-full font-semibold border transition-colors duration-200 text-sm
                                            ${selectedCategory === category
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-blue-700 hover:text-white'}
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                        </motion.div>
                        {/* Modules Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {featuredModules.map((module, index) => {
                                    const IconComponent = getCategoryIcon(module.category);
                                    const colorClass = getCategoryColor(module.category);
                                    return (
                                        <motion.div
                                            key={module.id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                            className="content-card hover:border-blue-500/50 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className={`p-4 bg-${colorClass}-500/20 rounded-lg`}>
                                                    <IconComponent className={`w-8 h-8 text-${colorClass}-400`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                        {module.title}
                                                    </h3>
                                                    <div className="text-sm text-slate-400 mb-2">
                                                        {module.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 mb-6 leading-relaxed line-clamp-3">
                                                {module.description}
                                            </p>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Clock className="w-4 h-4" />
                                                    {module.duration}
                                                </div>
                                                <div className="text-xl font-bold text-blue-400">
                                                    ₹{module.price}
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                {module.learningPaths && module.learningPaths.length > 0 && (
                                                    <>
                                                        <div className="text-sm text-slate-400 mb-3">Learning Paths:</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {module.learningPaths.slice(0, 3).map((path, idx) => (
                                                                <span key={idx} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                                    {path}
                                                                </span>
                                                            ))}
                                                            {module.learningPaths.length > 3 && (
                                                                <span className="text-xs text-slate-400">+{module.learningPaths.length - 3} more</span>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => setCourseDetailsModal({
                                                        isOpen: true,
                                                        course: {
                                                            ...module,
                                                            highlights: [
                                                                'Industry-standard curriculum',
                                                                'Hands-on practical projects',
                                                                'Expert instructor guidance',
                                                                'Lifetime access to materials',
                                                                'Certificate of completion'
                                                            ]
                                                        }
                                                    })}
                                                    className="w-full bg-slate-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    Course Details
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEnrollmentModal({
                                                        isOpen: true,
                                                        courseType: 'module',
                                                        courseName: module.title,
                                                        coursePrice: module.price,
                                                        courseDuration: module.duration
                                                    })}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                        {/* View All Modules Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <button
                                onClick={() => onNavigate('moduleCatalog')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
                            >
                                <Grid3X3 className="w-5 h-5" />
                                View All {modules.length} Modules
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </>
                )}
                {activeTab === 'traditional' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-10"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Traditional <span className="text-purple-400">Course Programs</span>
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                                Structured learning paths with mentorship, job guarantees, and comprehensive curriculum. Perfect for those who prefer guided learning experiences.
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {traditionalCourses.map((course, index) => {
                                const IconComponent = course.icon;
                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                        className="content-card hover:border-blue-500/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={`p-4 bg-gradient-to-br ${course.gradient} rounded-lg`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                    {course.title}
                                                </h3>
                                                <div className="text-sm text-slate-400 mb-2">
                                                    {course.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 mb-6 leading-relaxed">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {course.enrolled}
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold text-blue-400">
                                                {course.price}
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <div className="text-sm text-slate-400 mb-3">Key Features:</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {course.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={course.action}
                                            className={`w-full bg-gradient-to-r ${course.gradient} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                                        >
                                            Learn More
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

// Success Metrics & Why Choose Us Section
const SuccessMetrics = () => (
    <div className="py-20 bg-slate-900 bg-fixed">
        <section id="success-metrics" className="container mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Proven{' '}
                    <span className="text-cyan-400">
                        Results
                    </span>
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                    Join thousands of successful students who have transformed their careers with our training programs
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { icon: Users, label: '1000+ Students', value: 'Enrolled', color: 'blue' },
                    { icon: TrendingUp, label: '85% Placement', value: 'Success Rate', color: 'green' },
                    { icon: Star, label: '4.8/5 Rating', value: 'Student Reviews', color: 'yellow' },
                    { icon: Award, label: '200+ Companies', value: 'Hiring Partners', color: 'purple' }
                ].map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="content-card text-center hover:border-blue-500/50 transition-all duration-300"
                    >
                        <metric.icon className={`w-12 h-12 text-${metric.color}-400 mx-auto mb-4`} />
                        <h3 className="text-2xl font-bold text-white mb-2">{metric.label}</h3>
                        <p className="text-slate-400">{metric.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                    {
                        icon: Shield,
                        title: 'Industry-Relevant Curriculum',
                        description: 'Our modules are designed by industry experts and updated regularly to match current market demands.',
                        color: 'blue'
                    },
                    {
                        icon: Users,
                        title: 'Expert Mentorship',
                        description: 'Learn from experienced professionals who provide personalized guidance throughout your journey.',
                        color: 'purple'
                    },
                    {
                        icon: Briefcase,
                        title: 'Job Placement Support',
                        description: 'Comprehensive placement assistance including resume building, interview prep, and direct company connections.',
                        color: 'green'
                    }
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="content-card hover:border-blue-500/50 transition-all duration-300"
                    >
                        <feature.icon className={`w-12 h-12 text-${feature.color}-400 mb-4`} />
                        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    </div>
);

// Testimonials Section
const Testimonials = () => {
    const [index, setIndex] = useState(0);

    const items = [
        {
            quote: "The cybersecurity training was exceptional. Within 3 months, I landed a job as a SOC Analyst at a leading fintech company.",
            name: "Priya Sharma",
            role: "SOC Analyst",
            company: "PayTM",
            img: "/api/placeholder/40/40"
        },
        {
            quote: "The hands-on approach and real-world projects helped me transition from mechanical engineering to cybersecurity seamlessly.",
            name: "Rajesh Kumar",
            role: "Cybersecurity Consultant",
            company: "Deloitte",
            img: "/api/placeholder/40/40"
        },
        {
            quote: "Great mentorship and practical knowledge. The course content is up-to-date with industry standards.",
            name: "Anita Patel",
            role: "Penetration Tester",
            company: "TCS",
            img: "/api/placeholder/40/40"
        }
    ];

    const current = items[index];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="py-20 bg-slate-900 bg-fixed">
            <section id="testimonials" className="container mx-auto px-6">
                <SectionTitle>What Our Students Say</SectionTitle>
                <div className="text-center mb-12">
                    <p className="text-slate-300 text-lg">
                        Over 1000+ students have transformed their careers with us
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-blue-900/30 backdrop-blur-sm p-8 rounded-xl border border-purple-500/30 relative shadow-2xl hover:border-purple-400/50 transition-all duration-300"
                    >
                        <p className="text-slate-300 italic mb-6 text-lg">"{current.quote}"</p>
                        <div className="flex items-center">
                            <img src={current.img} alt={current.name} className="w-12 h-12 rounded-full mr-4"/>
                            <div>
                                <h4 className="font-bold text-white">{current.name}</h4>
                                <p className="text-blue-400 font-semibold">{current.role}</p>
                                <p className="text-slate-400 text-sm">{current.company}</p>
                            </div>
                        </div>
                        <div className="absolute right-4 top-4 flex gap-2">
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? 'bg-blue-500' : 'bg-slate-600'}`}
                                ></button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
    </div>
    );
};

// Contact Section
const Contact = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await sendContactForm(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
        } catch (error) {
            console.error('Contact form submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-20 bg-slate-900 bg-fixed">
            <section id="contact" className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Ready to{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Get Started?
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Contact us to discuss your learning goals and find the perfect program for your career advancement
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-slate-300">
                                <MessageCircle className="w-6 h-6 text-blue-400" />
                                <span>support@atcs.in</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <Star className="w-6 h-6 text-blue-400" />
                                <span>+91 9876543210</span>
                            </div>
                        </div>

                        <div className="content-card">
                            <h4 className="text-lg font-semibold text-green-400 mb-4">Why Choose Our Training?</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Industry-relevant curriculum
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Expert mentorship
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Job placement assistance
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Flexible payment options
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="form-card"
                    >
                        {submitted ? (
                            <div className="text-center">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                                <p className="text-slate-300">
                                    We've received your message and will get back to you soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Your Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={formData.interest}
                                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Your Interest</option>
                                        <option value="modules">Individual Modules</option>
                                        <option value="specialized">Specialized Courses</option>
                                        <option value="technology">Technology Training</option>
                                        <option value="defensive">Defensive Security</option>
                                        <option value="offensive">Offensive Security</option>
                                        <option value="college">College Training</option>
                                    </select>
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        rows={4}
                                        className="form-textarea"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-gradient w-full py-3 px-6 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
    </div>
    );
};

// Main HomePage Component
const HomePage = ({ onNavigate }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('modules');
    const [expandedCard, setExpandedCard] = useState(null);
    const [courseDetailsModal, setCourseDetailsModal] = useState({ isOpen: false, course: null });
    const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '', coursePrice: '', courseDuration: '' });
    // Read filter from URL query param on mount
    const getInitialFilter = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('filter') || '';
        }
        return '';
    };
    const [searchFilter, setSearchFilter] = useState(getInitialFilter());
    const tabbedSectionRef = React.useRef(null);

    // Custom onNavigate handler
    const handleNavigate = (route, params) => {
        if (route === 'moduleCatalog') {
            setActiveTab('modules');
            setSearchFilter(params && params.filter ? params.filter : '');
            // Wait for state to update, then scroll
            setTimeout(() => {
                const el = document.getElementById('courses-tabbed-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        } else if (typeof onNavigate === 'function') {
            onNavigate(route, params);
        }
    };

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch('/modules.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch modules: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                // Filter to show only active modules (hide hidden/archived)
                const activeModules = data.filter(m => !m.status || m.status === 'active');
                setModules(activeModules);
                setLoading(false);
            } catch (err) {
                setError(`Failed to load modules: ${err.message}`);
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    useEffect(() => {
        // On mount, if a hash exists, attempt smooth scroll to that section
        const hash = window.location.hash?.replace('#', '');
        if (hash) {
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        // If filter query param changes (e.g., via navigation), update searchFilter
        const params = new URLSearchParams(window.location.search);
        const urlFilter = params.get('filter') || '';
        setSearchFilter(urlFilter);
    }, [window.location.search]);

    return (
        <>
            <HeroSection onNavigate={handleNavigate} modules={modules} loading={loading} error={error} />
            <CoursesTabbedSection
                onNavigate={handleNavigate}
                modules={modules}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
                setCourseDetailsModal={setCourseDetailsModal}
                setEnrollmentModal={setEnrollmentModal}
            />
            <SuccessMetrics />
            <Testimonials />
            <Contact onNavigate={handleNavigate} />

            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsFaqBotOpen(true)}
                    className="bg-sky-600 text-white rounded-full p-4 shadow-lg hover:bg-sky-500 transition-all duration-300 transform hover:scale-110"
                    aria-label="Open AI Admissions Advisor"
                >
                    <MessageCircle size={28} />
                </button>
            </div>
            <AiFaqBot isOpen={isFaqBotOpen} onClose={() => setIsFaqBotOpen(false)} />
            <ScrollNavigation />

            {/* Course Details Modal */}
            <AnimatePresence>
                {courseDetailsModal.isOpen && courseDetailsModal.course && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setCourseDetailsModal({ isOpen: false, course: null })}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-white mb-4">{courseDetailsModal.course.title}</h2>
                                <p className="text-slate-300 mb-6">{courseDetailsModal.course.description}</p>

                                {/* Course Highlights */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                                        <BookOpen size={20} />
                                        Course Highlights
                                    </h3>
                                    <ul className="space-y-2">
                                        {courseDetailsModal.course.highlights?.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Curriculum */}
                                {courseDetailsModal.course.curriculum && courseDetailsModal.course.curriculum.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                                            <Play size={20} />
                                            Curriculum
                                        </h3>
                                        <div className="space-y-2">
                                            {courseDetailsModal.course.curriculum.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-slate-300">
                                                    <ArrowRight size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prerequisites */}
                                {courseDetailsModal.course.prerequisites && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-green-400 mb-3">Prerequisites</h3>
                                        <p className="text-slate-300">{courseDetailsModal.course.prerequisites}</p>
                                    </div>
                                )}

                                {/* Career Outcomes */}
                                {courseDetailsModal.course.learningPaths && courseDetailsModal.course.learningPaths.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-cyan-400 mb-3">Career Outcomes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {courseDetailsModal.course.learningPaths.map((path, idx) => (
                                                <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                                                    {path}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer with Price and Enroll */}
                                <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold text-blue-400">
                                            ₹{courseDetailsModal.course.price}
                                        </div>
                                        <div className="text-sm text-slate-400">{courseDetailsModal.course.duration}</div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCourseDetailsModal({ isOpen: false, course: null });
                                            setEnrollmentModal({
                                                isOpen: true,
                                                courseType: 'module',
                                                courseName: courseDetailsModal.course.title,
                                                coursePrice: courseDetailsModal.course.price,
                                                courseDuration: courseDetailsModal.course.duration
                                            });
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                                    >
                                        Enroll Now
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enrollment Modal */}
            <EnhancedEnrollmentModal
                isOpen={enrollmentModal.isOpen}
                onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '', coursePrice: '', courseDuration: '' })}
                courseType={enrollmentModal.courseType}
                courseName={enrollmentModal.courseName}
                coursePrice={enrollmentModal.coursePrice}
                courseDuration={enrollmentModal.courseDuration}
            />
        </>
    );
};

export default HomePage;