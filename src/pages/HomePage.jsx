import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle, ArrowRight, Star, TrendingUp, Clock, DollarSign, BookOpen, Globe, Zap, Grid3X3, Layers, Map, Eye, RotateCcw, Laptop, Cloud, Database, TestTube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle.jsx';
import { sendContactForm } from '@/services/netlifyFormsService.js';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';

// Animated Background Component
const AnimatedBackground = ({ variant = 'default', children, className = '' }) => {
    const variants = {
        default: {
            gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-red-900/20',
            particles: { color: 'bg-blue-400', count: 15 }
        },
        testimonials: {
            gradient: 'bg-gradient-to-br from-slate-800 via-purple-900 to-blue-900',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-blue-800/20',
            particles: { color: 'bg-purple-400', count: 12 }
        },
        contact: {
            gradient: 'bg-gradient-to-br from-slate-900 via-green-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-blue-900/20',
            particles: { color: 'bg-green-400', count: 18 }
        },
        footer: {
            gradient: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950',
            overlay: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-purple-900/20',
            particles: { color: 'bg-indigo-400', count: 10 }
        },
        programs: {
            gradient: 'bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900',
            overlay: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-purple-800/20',
            particles: { color: 'bg-blue-400', count: 16 }
        },
        success: {
            gradient: 'bg-gradient-to-br from-slate-900 via-emerald-950 to-blue-950',
            overlay: 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-blue-900/20',
            particles: { color: 'bg-emerald-400', count: 14 }
        }
    };

    const currentVariant = variants[variant] || variants.default;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 ${currentVariant.gradient}`}></div>
                <div className={`absolute inset-0 ${currentVariant.overlay}`}></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(currentVariant.particles.count)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-1 h-1 ${currentVariant.particles.color} rounded-full opacity-70`}
                            initial={{
                                x: Math.random() * 1200, // Fixed width to prevent layout calculation
                                y: Math.random() * 800, // Fixed height to prevent layout calculation
                                opacity: Math.random() * 0.7
                            }}
                            animate={{
                                y: [null, -100, -200],
                                opacity: [null, 0.7, 0]
                            }}
                            transition={{
                                duration: 6 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }}
                        />
                    ))}
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-20 h-20 ${currentVariant.particles.color} rounded-full blur-xl`}
                            initial={{
                                x: Math.random() * 1200, // Fixed width to prevent layout calculation
                                y: Math.random() * 800, // Fixed height to prevent layout calculation
                            }}
                            animate={{
                                x: [null, Math.random() * 200 - 100],
                                y: [null, Math.random() * 200 - 100],
                            }}
                            transition={{
                                duration: 15 + Math.random() * 10,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: Math.random() * 5
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

// Modern Hero Section
const HeroSection = ({ onNavigate }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    
    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <AnimatedBackground variant="default" className="min-h-screen flex items-center justify-center">
                <section id="home" className="container mx-auto px-6 text-center">
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
                </section>
            </AnimatedBackground>
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
            action: () => onNavigate('defensiveBootcampLanding'),
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
            action: () => onNavigate('defensiveMastery'),
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
            action: () => onNavigate('technologyTraining'),
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
        collegeTraining: {
            id: 'college-training',
            title: 'College Bulk Training',
            subtitle: 'Student Programs',
            description: 'Specialized cybersecurity training for 100-200 engineering students',
            price: 'Starting ₹299/student',
            originalPrice: '₹499/student',
            enrolled: '500+ Colleges',
            duration: '8 Weeks',
            level: 'Beginner Friendly',
            icon: Users,
            color: 'orange',
            features: ['Bulk Pricing', 'Placement Support', 'Industry Certificates', 'College Partnerships'],
            action: () => onNavigate('collegeTraining'),
            gradient: 'from-orange-600 to-orange-800',
            bgGradient: 'from-orange-900/20 to-orange-800/10',
            borderColor: 'border-orange-500/30 hover:border-orange-400'
        }
    };

    // View selection interface
    const StudentJobSelector = () => {
        const jobOptions = [
            {
                id: 'cybersecurity-analyst',
                title: '🛡️ Cybersecurity Analyst',
                salary: '₹4-6 LPA',
                demand: 'High Demand',
                description: 'Protect companies from cyber threats',
                course: '7-Day SOC Bootcamp',
                price: '₹499',
                icon: Shield,
                gradient: 'from-blue-600 to-cyan-600',
                companies: 'TCS, Wipro, Infosys',
                viewId: 'cybersecurity'
            },
            {
                id: 'cloud-engineer',
                title: '☁️ Cloud Engineer',
                salary: '₹5-8 LPA',
                demand: 'Growing Fast',
                description: 'Build and manage cloud infrastructure',
                course: 'Cloud Security Specialist',
                price: '₹3,999',
                icon: Cloud,
                gradient: 'from-purple-600 to-blue-600',
                companies: 'Amazon, Microsoft, Google',
                viewId: 'cloud'
            },
            {
                id: 'software-developer',
                title: '💻 Software Developer',
                salary: '₹3-5 LPA',
                demand: 'Always Hiring',
                description: 'Create websites and applications',
                course: 'Full Stack Development',
                price: '₹4,999',
                icon: Code,
                gradient: 'from-green-600 to-blue-600',
                companies: 'Zoho, Freshworks, Startups',
                viewId: 'development'
            },
            {
                id: 'devops-engineer',
                title: '🔧 DevOps Engineer',
                salary: '₹6-9 LPA',
                demand: 'Hot Skill',
                description: 'Automate software delivery',
                course: 'DevOps & Automation',
                price: '₹5,499',
                icon: Server,
                gradient: 'from-orange-600 to-red-600',
                companies: 'Tech Mahindra, HCL, L&T',
                viewId: 'devops'
            },
            {
                id: 'ethical-hacker',
                title: '🔍 Ethical Hacker',
                salary: '₹5-7 LPA',
                demand: 'Exciting',
                description: 'Find security vulnerabilities',
                course: '7-Day Hacking Bootcamp',
                price: '₹599',
                icon: Sword,
                gradient: 'from-red-600 to-pink-600',
                companies: 'Security Firms, Banks',
                viewId: 'hacking'
            },
            {
                id: 'data-analyst',
                title: '📊 Data Analyst',
                salary: '₹4-6 LPA',
                demand: 'Stable',
                description: 'Turn data into insights',
                course: 'AI & Data Science',
                price: '₹3,999',
                icon: BrainCircuit,
                gradient: 'from-indigo-600 to-purple-600',
                companies: 'Accenture, Deloitte, EY',
                viewId: 'data'
            }
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
            >
                {/* Main Job Selection Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
                    {jobOptions.map((job, index) => (
                        <motion.button
                            key={job.id}
                            onClick={() => handleJobSelection(job)}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-left hover:border-slate-500 transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${job.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            
                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${job.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <job.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-green-400">{job.salary}</div>
                                        <div className="text-xs text-slate-400">{job.demand}</div>
                                    </div>
                                </div>

                                {/* Job Title & Description */}
                                <h4 className="text-lg font-semibold text-white mb-2">{job.title}</h4>
                                <p className="text-slate-400 text-sm mb-4">{job.description}</p>

                                {/* Course Info */}
                                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                                    <div className="text-sm text-slate-300 font-medium">{job.course}</div>
                                    <div className="text-xs text-slate-400 mt-1">Starting {job.price}</div>
                                </div>

                                {/* Companies */}
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Briefcase className="w-3 h-3" />
                                    <span>Hiring: {job.companies}</span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* View All Courses Option */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            🎯 Want to see all courses we offer?
                        </h3>
                        <p className="text-slate-400 mb-4">
                            Explore our complete catalog of 15+ courses across cybersecurity, programming, cloud, and more
                        </p>
                        <button
                            onClick={() => handleViewSelection('complete')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto group"
                        >
                            <Grid3X3 className="w-5 h-5" />
                            <span>View All Courses</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
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

    const handleJobSelection = (job) => {
        setIsTransitioning(true);
        
        // Map job viewId to corresponding course landing page keys
        const jobToPageKeyMap = {
            'cybersecurity': 'defensiveBootcampLanding',
            'cloud': 'technologyTraining',
            'development': 'technologyTraining',
            'devops': 'technologyTraining', 
            'hacking': 'offensiveBootcampLanding',
            'data': 'technologyTraining'
        };
        
        const targetPageKey = jobToPageKeyMap[job.viewId];
        
        setTimeout(() => {
            if (targetPageKey && onNavigate) {
                // Navigate to specific course landing page
                onNavigate(targetPageKey);
            } else {
                // Fallback to complete courses view
                setSelectedView('complete');
            }
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
        <AnimatedBackground variant="programs" className="py-20">
            <section id="programs" className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Which Tech <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Job</span> Do You Want?
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Pick your dream career and we'll show you the perfect course to get there
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>1,247 students got placed this month!</span>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!selectedView && !isTransitioning && (
                        <StudentJobSelector />
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
            </section>
        </AnimatedBackground>
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
            title: 'Technology & College Programs',
            subtitle: 'Beyond cybersecurity',
            programs: [programs.technology, programs.collegeTraining],
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
            subtitle: 'Technology & College Programs',
            programs: [programs.technology, programs.collegeTraining],
            description: 'Expand beyond cybersecurity or train college students in bulk'
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
    <AnimatedBackground variant="success" className="py-20">
        <section className="container mx-auto px-6">
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
                            icon: BookOpen,
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
        </section>
    </AnimatedBackground>
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
        <AnimatedBackground variant="testimonials" className="py-20">
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
        </AnimatedBackground>
    );
};

// Contact Section
const Contact = ({ onNavigate }) => { 
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await sendContactForm({
                name: formData.name,
                email: formData.email,
                subject: 'General inquiry',
                category: 'general',
                message: formData.message,
                source: 'homepage'
            });
            if (res.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                throw new Error(res.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            alert('Could not send your message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
    <AnimatedBackground variant="contact" className="py-20">
        <section id="contact" className="container mx-auto px-6">
            <SectionTitle>Get In Touch</SectionTitle>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-lg text-slate-300 mb-8">
                        Ready to start your cybersecurity journey? Get in touch with our team for personalized guidance.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-slate-800/80 to-blue-900/30 backdrop-blur-sm p-8 text-left space-y-6 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-2xl"
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">General Inquiry</h3>
                            <p className="text-blue-200 text-sm mt-2">We'd love to hear from you!</p>
                        </div>
                        {submitted && (
                          <div className="p-3 rounded bg-green-900/30 border border-green-700 text-green-200 text-sm">Thank you! We'll get back to you shortly.</div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleChange}
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Ask us about our programs, schedules, or anything else!" 
                                    className="block w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                            >
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 rounded-xl text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Ready to Enroll?</h3>
                            <p className="text-white/90 mb-6">
                                Start your cybersecurity journey with personalized guidance and career counseling.
                            </p>
                            <button 
                                onClick={() => onNavigate('enroll')} 
                                className="bg-white text-purple-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 mb-4 hover:shadow-xl"
                            >
                                Start Enrollment Process
                            </button>
                            <div className="space-y-2 text-sm text-white/80">
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Free career counseling
                                </div>
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Personalized learning path
                                </div>
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Flexible payment options
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    </AnimatedBackground>
    );
};

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