import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle, ArrowRight, Star, TrendingUp, Clock, DollarSign, BookOpen, Globe, Zap, Grid3X3, Layers, Map, Eye, RotateCcw, Laptop, Cloud, Database, TestTube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

// Modern Hero Section
const HeroSection = ({ onNavigate }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    
    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-red-900/20"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    opacity: Math.random() * 0.7
                                }}
                                animate={{
                                    y: [null, -100, -200],
                                    opacity: [null, 0.7, 0]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 4,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Master{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
                                Cybersecurity
                            </span>
                            <br />
                            <span className="text-3xl md:text-5xl text-slate-300">Launch Your Career</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            From <strong className="text-blue-400">Beginner Bootcamps</strong> to <strong className="text-red-400">Elite Programs</strong> - 
                            Choose your cybersecurity path and join thousands of successful graduates.
                        </p>

                        {/* Key Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span className="text-white font-semibold">1000+ Students Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-white font-semibold">85% Job Placement</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-white font-semibold">4.8/5 Student Rating</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                            >
                                <BookOpen className="w-5 h-5" />
                                Explore All Programs
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAdvisorOpen(true)}
                                className="bg-slate-700/80 text-white font-semibold px-8 py-4 rounded-lg border border-slate-600 hover:bg-slate-600 transition-all duration-300 flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get AI Career Guidance
                            </motion.button>
                        </div>

                        {/* Scroll Indicator */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-16"
                        >
                            <div className="flex flex-col items-center text-slate-400">
                                <span className="text-sm mb-2">Discover Programs</span>
                                <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
                                    <div className="w-1 h-3 bg-slate-400 rounded-full mt-2"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

// Interactive Programs Showcase Section
const ProgramsShowcase = ({ onNavigate }) => {
    const [selectedView, setSelectedView] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Complete program data structure
    const allPrograms = {
        foundation: {
            id: 'foundation',
            title: 'Foundation Programs',
            subtitle: '2-Day Workshops',
            description: 'Start your journey with fundamental knowledge and career guidance',
            price: '₹99',
            originalPrice: '₹499',
            enrolled: '500+',
            duration: '2 Days',
            level: 'Beginner',
            icon: BookOpen,
            color: 'green',
            features: ['Career Guidance', 'Industry Overview', 'Live Q&A', 'Certificate'],
            action: () => onNavigate('enroll'),
            gradient: 'from-green-600 to-green-800',
            bgGradient: 'from-green-900/20 to-green-800/10',
            borderColor: 'border-green-500/30 hover:border-green-400',
            courses: [
                { name: 'Cybersecurity Fundamentals', popular: true },
                { name: 'Technology Overview Workshop' }
            ]
        },
        defensiveBootcamp: {
            id: 'defensive-bootcamp',
            title: 'Defensive Security Bootcamp',
            subtitle: '7-Day Intensive Program',
            description: 'Master SOC operations, incident response, and threat hunting in just 7 days',
            price: 'Starting ₹499',
            originalPrice: '₹2,999',
            enrolled: '120+',
            duration: '7 Days',
            level: 'Beginner to Intermediate',
            icon: Shield,
            color: 'blue',
            features: ['SIEM Mastery', 'Incident Response', 'Live Labs', 'Certificate'],
            action: () => onNavigate('bootcampLanding'),
            gradient: 'from-blue-600 to-blue-800',
            bgGradient: 'from-blue-900/20 to-blue-800/10',
            borderColor: 'border-blue-500/30 hover:border-blue-400'
        },
        offensiveBootcamp: {
            id: 'offensive-bootcamp',
            title: 'Ethical Hacking Bootcamp',
            subtitle: '7-Day Intensive Program',
            description: 'Learn penetration testing, web app security, and ethical hacking techniques',
            price: 'Starting ₹599',
            originalPrice: '₹3,999',
            enrolled: '95+',
            duration: '7 Days',
            level: 'Beginner to Intermediate',
            icon: Sword,
            color: 'red',
            features: ['Kali Linux', 'Web Pentesting', 'Network Hacking', 'Tools Mastery'],
            action: () => onNavigate('offensiveBootcampLanding'),
            gradient: 'from-red-600 to-red-800',
            bgGradient: 'from-red-900/20 to-red-800/10',
            borderColor: 'border-red-500/30 hover:border-red-400'
        },
        defensivePremium: {
            id: 'defensive-premium',
            title: 'Defensive Mastery Program',
            subtitle: '2-Month Elite Training',
            description: 'Comprehensive defensive security training with personal mentorship',
            price: '₹5,999',
            originalPrice: '₹15,999',
            enrolled: '18/20',
            duration: '2 Months',
            level: 'All Levels',
            icon: Award,
            color: 'blue',
            features: ['Personal Mentor', '10+ Projects', 'Job Guarantee', 'Small Batch'],
            action: () => onNavigate('premiumProgram'),
            gradient: 'from-blue-600 to-purple-800',
            bgGradient: 'from-blue-900/20 to-purple-800/10',
            borderColor: 'border-blue-500/30 hover:border-purple-400'
        },
        offensivePremium: {
            id: 'offensive-premium',
            title: 'Elite Hacker Program',
            subtitle: '2-Month Advanced Training',
            description: 'Advanced red team operations with custom exploit development',
            price: '₹7,999',
            originalPrice: '₹19,999',
            enrolled: '12/15',
            duration: '2 Months',
            level: 'Advanced',
            icon: Sword,
            color: 'red',
            features: ['Custom Exploits', 'Red Team Ops', 'Elite Mentorship', 'Advanced Labs'],
            action: () => onNavigate('offensiveMastery'),
            gradient: 'from-red-600 to-orange-800',
            bgGradient: 'from-red-900/20 to-orange-800/10',
            borderColor: 'border-red-500/30 hover:border-orange-400'
        },
        specialized: {
            id: 'specialized-courses',
            title: 'Specialized Security',
            subtitle: '11+ Domain Courses',
            description: 'Master specific cybersecurity domains with expert-led training',
            price: 'Starting ₹2,999',
            originalPrice: '₹8,999',
            enrolled: '200+',
            duration: 'Flexible',
            level: 'Intermediate',
            icon: Target,
            color: 'purple',
            features: ['6 Domains', 'Cloud Security', 'Forensics', 'GRC & More'],
            action: () => onNavigate('specializedCourses'),
            gradient: 'from-purple-600 to-purple-800',
            bgGradient: 'from-purple-900/20 to-purple-800/10',
            borderColor: 'border-purple-500/30 hover:border-purple-400',
            courses: [
                { name: 'Cloud Security', price: '₹3,999' },
                { name: 'Digital Forensics', price: '₹4,999' },
                { name: 'GRC & Compliance', price: '₹3,499' }
            ]
        },
        technology: {
            id: 'technology-training',
            title: 'Technology Training',
            subtitle: 'Full Stack & Cloud',
            description: 'Comprehensive technology training beyond cybersecurity',
            price: 'Starting ₹18,000',
            originalPrice: '₹40,000',
            enrolled: '150+',
            duration: 'Flexible',
            level: 'Beginner to Advanced',
            icon: Laptop,
            color: 'indigo',
            features: ['Full Stack Dev', 'Cloud & DevOps', 'AI & Data Science', 'Testing'],
            action: () => onNavigate('enroll'),
            gradient: 'from-indigo-600 to-indigo-800',
            bgGradient: 'from-indigo-900/20 to-indigo-800/10',
            borderColor: 'border-indigo-500/30 hover:border-indigo-400',
            courses: [
                { name: 'Full Stack Development', price: '₹30,000' },
                { name: 'Cloud & DevOps', price: '₹25,000' },
                { name: 'AI & Data Science', price: '₹20,000' },
                { name: 'Software Testing', price: '₹18,000' }
            ]
        },
        corporate: {
            id: 'corporate-training',
            title: 'Corporate Solutions',
            subtitle: 'Enterprise Training',
            description: 'Tailored training programs for organizations and teams',
            price: 'Custom Pricing',
            originalPrice: 'Contact Us',
            enrolled: '50+ Companies',
            duration: 'Customizable',
            level: 'All Levels',
            icon: Briefcase,
            color: 'orange',
            features: ['Custom Curriculum', 'On-site Training', 'Team Assessment', 'Ongoing Support'],
            action: () => onNavigate('contact'),
            gradient: 'from-orange-600 to-orange-800',
            bgGradient: 'from-orange-900/20 to-orange-800/10',
            borderColor: 'border-orange-500/30 hover:border-orange-400'
        }
    };

    // View selection interface
    const ViewSelectionInterface = () => {
        const viewOptions = [
            {
                id: 'complete',
                title: 'Complete Overview',
                description: 'All 7 program categories in organized cards',
                icon: Grid3X3,
                color: 'blue',
                preview: '7 comprehensive program cards',
                gradient: 'from-blue-600 to-blue-800'
            },
            {
                id: 'grouped',
                title: 'Smart Grouping',
                description: '4 intelligent groups for simplified decision making',
                icon: Layers,
                color: 'purple',
                preview: 'Related programs grouped together',
                gradient: 'from-purple-600 to-purple-800'
            },
            {
                id: 'journey',
                title: 'Learning Journey',
                description: 'Progressive tabs to follow your career path',
                icon: Map,
                color: 'green',
                preview: 'Step-by-step program progression',
                gradient: 'from-green-600 to-green-800'
            }
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h3 className="text-2xl font-semibold text-slate-300 mb-4">
                    How would you like to explore our programs?
                </h3>
                <p className="text-slate-400 mb-8">Choose your preferred viewing style</p>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {viewOptions.map((option) => (
                        <motion.button
                            key={option.id}
                            onClick={() => handleViewSelection(option.id)}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-left hover:border-slate-600 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <option.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">{option.title}</h4>
                            <p className="text-slate-400 text-sm mb-3">{option.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Eye className="w-3 h-3" />
                                <span>{option.preview}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        );
    };

    const handleViewSelection = (viewId) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedView(viewId);
            setIsTransitioning(false);
        }, 200);
    };

    const handleResetView = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedView(null);
            setIsTransitioning(false);
        }, 200);
    };

    return (
        <section id="programs" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Path</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        From foundation workshops to elite mastery programs - discover the perfect training for your career goals
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!selectedView && !isTransitioning && (
                        <ViewSelectionInterface />
                    )}

                    {selectedView && !isTransitioning && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* View Change Button */}
                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={handleResetView}
                                    className="bg-slate-700 text-slate-300 px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors duration-300 flex items-center gap-2 text-sm"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Change View
                                </button>
                            </div>

                            {selectedView === 'complete' && <CompleteOverview programs={allPrograms} />}
                            {selectedView === 'grouped' && <SmartGrouping programs={allPrograms} />}
                            {selectedView === 'journey' && <LearningJourney programs={allPrograms} />}
                        </motion.div>
                    )}

                    {isTransitioning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center py-20"
                        >
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom CTA */}
                {selectedView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-16"
                    >
                        <p className="text-slate-300 mb-6">
                            Not sure which program fits your career goals?
                        </p>
                        <button className="bg-slate-700 text-white px-8 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-300 flex items-center gap-2 mx-auto">
                            <MessageCircle className="w-5 h-5" />
                            Get Personal Guidance
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

// Complete Overview - Shows all 7 programs
const CompleteOverview = ({ programs }) => {
    const programArray = Object.values(programs);
    
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {programArray.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
            ))}
        </div>
    );
};

// Smart Grouping - 4 intelligent groups
const SmartGrouping = ({ programs }) => {
    const groupedPrograms = [
        {
            title: 'Foundation & Quick Start',
            subtitle: 'Perfect for beginners',
            programs: [programs.foundation, programs.defensiveBootcamp, programs.offensiveBootcamp],
            color: 'green',
            gradient: 'from-green-600 to-blue-600'
        },
        {
            title: 'Premium Mastery Programs',
            subtitle: '2-month intensive training',
            programs: [programs.defensivePremium, programs.offensivePremium],
            color: 'purple',
            gradient: 'from-purple-600 to-red-600'
        },
        {
            title: 'Specialized Security',
            subtitle: 'Domain expertise',
            programs: [programs.specialized],
            color: 'blue',
            gradient: 'from-blue-600 to-purple-600'
        },
        {
            title: 'Technology & Corporate',
            subtitle: 'Beyond cybersecurity',
            programs: [programs.technology, programs.corporate],
            color: 'indigo',
            gradient: 'from-indigo-600 to-orange-600'
        }
    ];

    return (
        <div className="space-y-12">
            {groupedPrograms.map((group, groupIndex) => (
                <motion.div
                    key={groupIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: groupIndex * 0.2 }}
                >
                    <div className="text-center mb-8">
                        <h3 className={`text-2xl font-bold text-white mb-2 bg-gradient-to-r ${group.gradient} bg-clip-text text-transparent`}>
                            {group.title}
                        </h3>
                        <p className="text-slate-400">{group.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {group.programs.map((program, index) => (
                            <ProgramCard key={program.id} program={program} index={index} />
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Learning Journey - Progressive tabs
const LearningJourney = ({ programs }) => {
    const [activeTab, setActiveTab] = useState('beginner');
    
    const journeyTabs = {
        beginner: {
            title: '🎯 Start Here',
            subtitle: 'Foundation & First Steps',
            programs: [programs.foundation, programs.defensiveBootcamp, programs.offensiveBootcamp],
            description: 'Begin your cybersecurity journey with fundamentals and choose your initial specialization'
        },
        intermediate: {
            title: '🚀 Level Up',
            subtitle: 'Premium Programs',
            programs: [programs.defensivePremium, programs.offensivePremium, programs.specialized],
            description: 'Advance your skills with intensive programs and specialized knowledge'
        },
        advanced: {
            title: '💼 Professional',
            subtitle: 'Technology & Corporate',
            programs: [programs.technology, programs.corporate],
            description: 'Expand beyond cybersecurity or provide training for organizations'
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
                <div className="bg-slate-900 p-1 rounded-lg flex space-x-1">
                    {Object.entries(journeyTabs).map(([key, tab]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                activeTab === key
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {journeyTabs[activeTab].subtitle}
                        </h3>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            {journeyTabs[activeTab].description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {journeyTabs[activeTab].programs.map((program, index) => (
                            <ProgramCard key={program.id} program={program} index={index} />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Reusable Program Card Component
const ProgramCard = ({ program, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-slate-900 border ${program.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
            onClick={program.action}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${program.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <program.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                        <div className="text-green-400 text-sm font-semibold">{program.enrolled} enrolled</div>
                        <div className="text-slate-400 text-xs">{program.duration}</div>
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                <p className={`text-sm font-semibold mb-3 text-${program.color}-400`}>{program.subtitle}</p>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{program.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                            <CheckCircle className={`w-3 h-3 text-${program.color}-400 flex-shrink-0`} />
                            <span className="text-xs text-slate-400">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Sub-courses (if any) */}
                {program.courses && (
                    <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-xs font-semibold text-slate-400 mb-2">Includes:</div>
                        {program.courses.map((course, idx) => (
                            <div key={idx} className="text-xs text-slate-500 flex items-center gap-1">
                                <span>•</span>
                                <span>{course.name}</span>
                                {course.price && <span className="ml-auto text-green-400">({course.price})</span>}
                                {course.popular && <span className="bg-yellow-500 text-black px-1 rounded text-xs">HOT</span>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pricing */}
                <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-2xl font-bold text-white">{program.price}</div>
                            {program.originalPrice && program.originalPrice !== 'Contact Us' && (
                                <div className="text-sm text-slate-400 line-through">{program.originalPrice}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400">
                            {program.level}
                        </div>
                    </div>
                    
                    <button className={`w-full bg-gradient-to-r ${program.gradient} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                        <span>{program.price.includes('Contact') ? 'Get Quote' : 'Enroll Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Success Metrics & Why Choose Us Section
const SuccessMetrics = () => (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            {/* Success Stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Proven <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Success</span>
                </h2>
                <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
                    Our numbers speak for themselves - thousands of students have transformed their careers with our programs
                </p>

                <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    {[
                        { number: '1000+', label: 'Students Enrolled', icon: Users, color: 'blue' },
                        { number: '85%', label: 'Job Placement Rate', icon: TrendingUp, color: 'green' },
                        { number: '4.8/5', label: 'Student Rating', icon: Star, color: 'yellow' },
                        { number: '50+', label: 'Industry Partners', icon: Briefcase, color: 'purple' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-400 rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.number}</div>
                            <p className="text-slate-300">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Why Choose Agnidhra Technologies?
                    </h3>
                    <p className="text-lg text-slate-300">
                        We don't just teach theory - we create cybersecurity professionals ready for real-world challenges
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Shield,
                            title: 'Industry Expert Instructors',
                            description: 'Learn from certified professionals with years of hands-on cybersecurity experience',
                            color: 'blue'
                        },
                        {
                            icon: Target,
                            title: 'Hands-On Lab Environment',
                            description: 'Practice in real-world scenarios with dedicated lab setups and cutting-edge tools',
                            color: 'red'
                        },
                        {
                            icon: Award,
                            title: 'Industry-Recognized Certificates',
                            description: 'Earn certificates that are valued by employers and align with industry standards',
                            color: 'purple'
                        },
                        {
                            icon: Users,
                            title: 'Job Placement Support',
                            description: '85% placement rate with dedicated career guidance and interview preparation',
                            color: 'green'
                        },
                        {
                            icon: Clock,
                            title: 'Flexible Learning Options',
                            description: 'Choose from intensive bootcamps, premium programs, or specialized courses',
                            color: 'yellow'
                        },
                        {
                            icon: Globe,
                            title: 'Global Learning Community',
                            description: 'Join a network of cybersecurity professionals and continue learning together',
                            color: 'indigo'
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-600 to-${feature.color}-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                            <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

// Testimonials Section
const Testimonials = () => {
    const items = [
        { quote: "The project-based approach was a game-changer for my career transition. The structured curriculum and hands-on labs made complex topics like SIEM analysis, threat detection, and incident response incredibly easy to understand. Within two months of completing the SOC Analyst program, I successfully landed my first cybersecurity role.", name: "Rohan Sharma", role: "SOC Analyst", company: "TCS", img: "https://placehold.co/50x50/0F172A/38BDF8?text=RS", rating: 5 },
        { quote: "What sets Agnidhra Technologies apart is their commitment to practical learning and industry-relevant training. The hands-on labs using cutting-edge security tools gave me real-world experience before stepping into the job market. I'm now confidently handling security incidents and threat analysis in my role.", name: "Anjali Patel", role: "Cybersecurity Analyst", company: "Infosys", img: "https://placehold.co/50x50/0F172A/F59E0B?text=AP", rating: 5 },
        { quote: "The ethical hacking bootcamp was an intensive and transformative experience that opened doors to my dream career in penetration testing. The program covered advanced topics using industry-standard tools like Metasploit, Burp Suite, and Nmap. The career counseling helped me transition smoothly into the cybersecurity field.", name: "Priya Singh", role: "Penetration Tester", company: "Accenture", img: "https://placehold.co/50x50/0F172A/EF4444?text=PS", rating: 5 }
    ];
    
    const [index, setIndex] = React.useState(0);
    
    React.useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
        return () => clearInterval(id);
    }, [items.length]);

    const current = items[index];
    
    return (
        <section id="testimonials" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
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
                        className="bg-slate-900 p-8 rounded-xl border border-slate-700 relative"
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
            </div>
        </section>
    );
};

// Contact Section
const Contact = ({ onNavigate }) => ( 
    <section id="contact" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
            <SectionTitle>Get In Touch</SectionTitle>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-lg text-slate-300 mb-8">
                        Ready to start your cybersecurity journey? Get in touch with our team for personalized guidance.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-8 text-left space-y-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">General Inquiry</h3>
                        <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-6">
                            <input type="hidden" name="_next" value="https://atstatic.netlify.app/thank-you" />
                            <input type="hidden" name="_subject" value="New Cyber Security Inquiry!" />
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    required 
                                    className="block w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    required 
                                    className="block w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows="4" 
                                    required 
                                    placeholder="Ask us about our programs, schedules, or anything else!" 
                                    className="block w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-xl text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">Ready to Enroll?</h3>
                        <p className="text-blue-100 mb-6">
                            Start your cybersecurity journey with personalized guidance and career counseling.
                        </p>
                        <button 
                            onClick={() => onNavigate('enroll')} 
                            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105 mb-4"
                        >
                            Start Enrollment Process
                        </button>
                        <div className="space-y-2 text-sm text-blue-200">
                            <div>✓ Free career counseling</div>
                            <div>✓ Personalized learning path</div>
                            <div>✓ Flexible payment options</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Main HomePage Component
const HomePage = ({ onNavigate }) => {
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    
    React.useEffect(() => {
        // On mount, if a hash exists, attempt smooth scroll to that section
        const hash = window.location.hash?.replace('#', '');
        if (hash) {
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);

    return (
        <>
            <HeroSection onNavigate={onNavigate} />
            <ProgramsShowcase onNavigate={onNavigate} />
            <SuccessMetrics />
            <Testimonials />
            <Contact onNavigate={onNavigate} />

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
        </>
    );
};

export default HomePage;