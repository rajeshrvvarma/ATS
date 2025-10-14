import React, { useState, useEffect } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle, ArrowRight, Star, TrendingUp, Clock, DollarSign, BookOpen, Globe, Zap, Grid3X3, Layers, Map, Eye, RotateCcw, Laptop, Cloud, Database, TestTube, Search, Filter, Play, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle.jsx';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';
import { sendContactForm } from '@/services/netlifyFormsService.js';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import modules from '@/modules.json';

// Module-Focused Hero Section
const HeroSection = ({ onNavigate }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Get unique categories from modules
    const categories = ['All', ...new Set(modules.map(module => module.category))];
    
    // Filter modules based on search and category
    const filteredModules = modules.filter(module => {
        const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            module.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <AnimatedBackground variant="default" className="min-h-screen flex items-center justify-center">
                <section id="home" className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Learn{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
                                Any Skill
                            </span>
                            <br />
                            <span className="text-3xl md:text-5xl text-slate-300">One Module at a Time</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Choose from <strong className="text-blue-400">{modules.length}+ Expert Modules</strong> across 
                            <strong className="text-purple-400"> Technology</strong>, <strong className="text-red-400">Cybersecurity</strong>, 
                            and <strong className="text-green-400">Programming</strong>. Build your custom learning path.
                        </p>

                        <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                <span className="text-white font-semibold">{modules.length}+ Learning Modules</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <Layers className="w-5 h-5 text-purple-400" />
                                <span className="text-white font-semibold">{categories.length - 1} Categories</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-white font-semibold">Self-Paced Learning</span>
                            </div>
                        </div>

                        {/* Module Search Interface */}
                        <div className="max-w-4xl mx-auto mb-8">
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search modules... (e.g., Python, Cybersecurity, Cloud)"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category} className="bg-slate-800">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-slate-300 mb-4">
                                {searchTerm || selectedCategory !== 'All' ? 
                                    `${filteredModules.length} modules found` : 
                                    `Browse all ${modules.length} modules`
                                }
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('featured-modules')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                            >
                                <Grid3X3 className="w-5 h-5" />
                                Browse All Modules
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAdvisorOpen(true)}
                                className="bg-slate-700/80 text-white font-semibold px-8 py-4 rounded-lg border border-slate-600 hover:bg-slate-600 transition-all duration-300 flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get Learning Path Advice
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('traditional-courses')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-slate-700/80 text-white font-semibold px-8 py-4 rounded-lg border border-slate-600 hover:bg-slate-600 transition-all duration-300 flex items-center gap-2"
                            >
                                <BookOpen className="w-5 h-5" />
                                Traditional Courses
                            </motion.button>
                        </div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-8"
                        >
                            <div className="flex flex-col items-center text-slate-400">
                                <span className="text-sm mb-2">Explore Modules</span>
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

// Featured Modules Showcase
const FeaturedModulesSection = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Get categories and featured modules
    const categories = ['All', ...new Set(modules.map(module => module.category))];
    
    // Get featured modules (first 12 or filtered modules)
    const featuredModules = modules
        .filter(module => {
            const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                module.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .slice(0, 12);

    // Get category icon
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

    // Get category color
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

    return (
        <AnimatedBackground variant="subtle" className="py-20">
            <section id="featured-modules" className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Featured{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Learning Modules
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        Expertly crafted modules covering everything from programming fundamentals to advanced cybersecurity. 
                        Start with any module that matches your interests and career goals.
                    </p>

                    {/* Search and Filter */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search modules..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category} className="bg-slate-800">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`p-3 bg-${colorClass}-500/20 rounded-lg`}>
                                        <IconComponent className={`w-6 h-6 text-${colorClass}-400`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {module.title}
                                        </h3>
                                        <div className="text-sm text-slate-400 mb-2">
                                            {module.category}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        {module.duration}
                                    </div>
                                    <div className="text-lg font-bold text-blue-400">
                                        ₹{module.price}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onNavigate('moduleDetail', { moduleId: module.id })}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Learn More
                                    </button>
                                    <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                        <BookmarkPlus className="w-4 h-4" />
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
                        onClick={() => onNavigate('modules')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
                    >
                        <Grid3X3 className="w-5 h-5" />
                        View All {modules.length} Modules
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </section>
        </AnimatedBackground>
    );
};
// Traditional Courses Section (Secondary to Modules)
const TraditionalCoursesSection = ({ onNavigate }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    
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
        <AnimatedBackground variant="subtle" className="py-20">
            <section id="traditional-courses" className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Traditional{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Course Programs
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        Structured learning paths with mentorship, job guarantees, and comprehensive curriculum. 
                        Perfect for those who prefer guided learning experiences.
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
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group"
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

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-8 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Not sure which path to choose?
                        </h3>
                        <p className="text-slate-300 mb-6">
                            Our AI Career Advisor can help you choose between individual modules or structured courses based on your goals and experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('featured-modules')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <Grid3X3 className="w-5 h-5" />
                                Browse Modules
                            </button>
                            <button
                                onClick={() => setIsAdvisorOpen(true)}
                                className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get AI Guidance
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
        </AnimatedBackground>
    );
};
// Success Metrics & Why Choose Us Section
const SuccessMetrics = () => (

    // Job exploration interface (non-clickable, informational)
    const JobExplorationSection = () => {
        const jobOptions = [
            // Cybersecurity Jobs
            {
                id: 'cybersecurity-analyst',
                title: '🛡️ Cybersecurity Analyst',
                salary: '₹4-6 LPA',
                demand: 'High Demand',
                description: 'Protect companies from cyber threats and incidents',
                category: 'cybersecurity',
                icon: Shield,
                gradient: 'from-blue-600 to-cyan-600',
                companies: 'TCS, Wipro, Infosys, HDFC Bank',
                skills: ['SIEM Management', 'Incident Response', 'Threat Analysis']
            },
            {
                id: 'ethical-hacker',
                title: '🔍 Ethical Hacker',
                salary: '₹5-7 LPA',
                demand: 'Exciting',
                description: 'Find security vulnerabilities and test systems',
                category: 'cybersecurity',
                icon: Sword,
                gradient: 'from-red-600 to-pink-600',
                companies: 'Security Firms, Banks, Fintech',
                skills: ['Penetration Testing', 'Vulnerability Assessment', 'Web App Security']
            },
            {
                id: 'security-consultant',
                title: '🛡️ Security Consultant',
                salary: '₹6-10 LPA',
                demand: 'High Growth',
                description: 'Advise organizations on security best practices',
                category: 'cybersecurity',
                icon: Award,
                gradient: 'from-purple-600 to-blue-600',
                companies: 'Deloitte, PwC, EY, KPMG',
                skills: ['Risk Assessment', 'Compliance', 'Security Architecture']
            },
            // Technology Jobs  
            {
                id: 'cloud-engineer',
                title: '☁️ Cloud Engineer',
                salary: '₹5-8 LPA',
                demand: 'Growing Fast',
                description: 'Build and manage cloud infrastructure',
                category: 'technology',
                icon: Cloud,
                gradient: 'from-purple-600 to-blue-600',
                companies: 'Amazon, Microsoft, Google, IBM',
                skills: ['AWS/Azure', 'Kubernetes', 'DevOps', 'Infrastructure']
            },
            {
                id: 'software-developer',
                title: '💻 Software Developer',
                salary: '₹3-5 LPA',
                demand: 'Always Hiring',
                description: 'Create websites and applications',
                category: 'technology',
                icon: Code,
                gradient: 'from-green-600 to-blue-600',
                companies: 'Zoho, Freshworks, Startups',
                skills: ['React/Angular', 'Node.js', 'Databases', 'API Development']
            },
            {
                id: 'devops-engineer',
                title: '🔧 DevOps Engineer',
                salary: '₹6-9 LPA',
                demand: 'Hot Skill',
                description: 'Automate software delivery and operations',
                category: 'technology',
                icon: Server,
                gradient: 'from-orange-600 to-red-600',
                companies: 'Tech Mahindra, HCL, L&T, Accenture',
                skills: ['CI/CD', 'Docker', 'Jenkins', 'Monitoring']
            },
            {
                id: 'data-analyst',
                title: '� Data Analyst',
                salary: '₹4-6 LPA',
                demand: 'Stable',
                description: 'Turn data into insights and business decisions',
                category: 'technology',
                icon: BrainCircuit,
                gradient: 'from-indigo-600 to-purple-600',
                companies: 'Accenture, Deloitte, EY, Mu Sigma',
                skills: ['Python/R', 'SQL', 'Machine Learning', 'Data Visualization']
            },
            // Specialized Jobs
            {
                id: 'digital-forensics',
                title: '🔍 Digital Forensics Expert',
                salary: '₹5-8 LPA',
                demand: 'Niche',
                description: 'Investigate cyber crimes and digital evidence',
                category: 'specialized',
                icon: Target,
                gradient: 'from-cyan-600 to-blue-600',
                companies: 'Law Enforcement, Legal Firms, Consultancies',
                skills: ['Evidence Analysis', 'Investigation Tools', 'Legal Procedures']
            },
            {
                id: 'compliance-officer',
                title: '� Compliance Officer',
                salary: '₹4-7 LPA',
                demand: 'Growing',
                description: 'Ensure regulatory compliance and governance',
                category: 'specialized',
                icon: CheckCircle,
                gradient: 'from-teal-600 to-green-600',
                companies: 'Banks, Insurance, Healthcare, IT',
                skills: ['ISO 27001', 'GDPR', 'Risk Management', 'Audit']
            }
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
            >
                {/* Main Job Exploration Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
                    {jobOptions.map((job, index) => (
                        <motion.div
                            key={job.id}
                            whileHover={{ y: -5, scale: 1.02 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-left hover:border-slate-500 transition-all duration-300 group relative overflow-hidden cursor-default"
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

                                {/* Skills */}
                                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-slate-400 mb-2">Key Skills:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills.map((skill, idx) => (
                                            <span key={idx} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Companies */}
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Briefcase className="w-3 h-3" />
                                    <span>Hiring: {job.companies}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Next Section Indicator */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            🎯 Ready to start your journey?
                        </h3>
                        <p className="text-slate-400 mb-4">
                            Explore our training programs designed to help you land these exciting roles
                        </p>
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-slate-400"
                        >
                            ↓ Browse Our Course Programs ↓
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    // Course Programs Section with Tabs
    const CourseProgramsSection = () => {
        const { pricing, loading } = useCoursePricing();
        const [activeTab, setActiveTab] = useState('defensive');
        
        const courseCategories = {
            defensive: {
                id: 'defensive',
                title: 'Defensive Cybersecurity',
                icon: Shield,
                color: 'blue',
                courses: [
                    {
                        id: 'defensive-bootcamp',
                        title: '7-Day Defensive Security Bootcamp',
                        subtitle: 'SOC Analyst Ready',
                        duration: '7 Days',
                        level: 'Beginner to Intermediate',
                        priceKey: 'defensive-bootcamp',
                        enrolled: '120+',
                        features: ['SIEM Mastery', 'Incident Response', 'Live Labs', 'Certificate'],
                        action: () => onNavigate('defensiveBootcampLanding'),
                        popular: true
                    },
                    {
                        id: 'defensive-mastery',
                        title: '2-Month Defensive Security Mastery',
                        subtitle: 'Advanced Professional Program',
                        duration: '2 Months',
                        level: 'All Levels',
                        priceKey: 'defensive-mastery',
                        enrolled: '18/20',
                        features: ['Personal Mentor', '10+ Projects', 'Job Guarantee', 'Small Batch'],
                        action: () => onNavigate('defensiveMastery')
                    }
                ]
            },
            offensive: {
                id: 'offensive',
                title: 'Offensive Cybersecurity',
                icon: Sword,
                color: 'red',
                courses: [
                    {
                        id: 'offensive-bootcamp',
                        title: '7-Day Ethical Hacking Bootcamp',
                        subtitle: 'Penetration Testing Focused',
                        duration: '7 Days',
                        level: 'Beginner to Intermediate',
                        priceKey: 'offensive-bootcamp',
                        enrolled: '95+',
                        features: ['Kali Linux', 'Web Pentesting', 'Network Hacking', 'Tools Mastery'],
                        action: () => onNavigate('offensiveBootcampLanding'),
                        popular: true
                    },
                    {
                        id: 'offensive-mastery',
                        title: '2-Month Offensive Security Mastery',
                        subtitle: 'Advanced Red Team Operations',
                        duration: '2 Months',
                        level: 'Advanced',
                        priceKey: 'offensive-mastery',
                        enrolled: '12/15',
                        features: ['Elite Training', 'Custom Exploits', 'Red Team Ops', 'Industry Mentors'],
                        action: () => onNavigate('offensiveMastery')
                    }
                ]
            },
            specialized: {
                id: 'specialized',
                title: 'Specialized Cybersecurity',
                icon: Target,
                color: 'purple',
                courses: [
                    { id: 'aws-security-specialist', title: 'AWS Security Specialist', subtitle: 'AWS security services, IAM & cloud-native tools', duration: '4 Weeks', level: 'Intermediate', priceKey: 'aws-security-specialist', enrolled: '23+', features: ['AWS Security', 'Cloud IAM', 'Compliance', 'Incident Response'], action: () => onNavigate('specializedCourses') },
                    { id: 'azure-security-engineer', title: 'Azure Security Engineer', subtitle: 'Azure security implementation & management', duration: '4 Weeks', level: 'Intermediate', priceKey: 'azure-security-engineer', enrolled: '18+', features: ['Azure Security Center', 'Azure AD', 'Key Vault', 'Sentinel SIEM'], action: () => onNavigate('specializedCourses') },
                    { id: 'multi-cloud-security-architect', title: 'Multi-Cloud Security Architect', subtitle: 'Advanced multi-cloud security architecture', duration: '6 Weeks', level: 'Advanced', priceKey: 'multi-cloud-security-architect', enrolled: '12+', features: ['Multi-Cloud Design', 'Identity Management', 'Automation', 'DevSecOps'], action: () => onNavigate('specializedCourses') },
                    { id: 'digital-forensics-investigator', title: 'Digital Forensics Investigator', subtitle: 'Digital evidence collection and analysis', duration: '5 Weeks', level: 'Beginner to Intermediate', priceKey: 'digital-forensics-investigator', enrolled: '15+', features: ['Evidence Collection', 'File Forensics', 'Network Forensics', 'Mobile Forensics'], action: () => onNavigate('specializedCourses') },
                    { id: 'advanced-malware-forensics', title: 'Advanced Malware Forensics', subtitle: 'Malware reverse engineering & analysis', duration: '4 Weeks', level: 'Advanced', priceKey: 'advanced-malware-forensics', enrolled: '8+', features: ['Malware Analysis', 'Reverse Engineering', 'Sandboxing', 'Memory Forensics'], action: () => onNavigate('specializedCourses') },
                    { id: 'malware-analysis-fundamentals', title: 'Malware Analysis Fundamentals', subtitle: 'Intro to malware analysis & tooling', duration: '3 Weeks', level: 'Beginner', priceKey: 'malware-analysis-fundamentals', enrolled: '32+', features: ['Malware Types', 'Static Analysis', 'Dynamic Analysis', 'Behavioral Analysis'], action: () => onNavigate('specializedCourses') },
                    { id: 'advanced-reverse-engineering', title: 'Advanced Reverse Engineering', subtitle: 'Exploit analysis & advanced RE', duration: '6 Weeks', level: 'Advanced', priceKey: 'advanced-reverse-engineering', enrolled: '9+', features: ['Assembly', 'Debugging', 'Exploit Dev', 'Custom Tools'], action: () => onNavigate('specializedCourses') },
                    { id: 'iso-27001-lead-implementer', title: 'ISO 27001 Lead Implementer', subtitle: 'Complete ISO 27001 implementation', duration: '4 Weeks', level: 'Intermediate', priceKey: 'iso-27001-lead-implementer', enrolled: '28+', features: ['ISO 27001', 'Risk Management', 'ISMS Docs', 'Audit Techniques'], action: () => onNavigate('specializedCourses') },
                    { id: 'grc-analyst-professional', title: 'GRC Analyst Professional', subtitle: 'Governance, risk and compliance', duration: '5 Weeks', level: 'Intermediate', priceKey: 'grc-analyst-professional', enrolled: '21+', features: ['GRC Framework', 'Risk Assessment', 'Compliance Mgmt', 'GRC Tools'], action: () => onNavigate('specializedCourses') },
                    { id: 'incident-response-specialist', title: 'Incident Response Specialist', subtitle: 'End-to-end incident response', duration: '4 Weeks', level: 'Intermediate', priceKey: 'incident-response-specialist', enrolled: '19+', features: ['IR Lifecycle', 'Forensics', 'Threat Hunting', 'Crisis Mgmt'], action: () => onNavigate('specializedCourses') },
                    { id: 'advanced-threat-hunting', title: 'Advanced Threat Hunting', subtitle: 'Proactive detection & hunting', duration: '5 Weeks', level: 'Advanced', priceKey: 'advanced-threat-hunting', enrolled: '11+', features: ['Threat Hunting', 'Analytics', 'Threat Intel', 'Automation'], action: () => onNavigate('specializedCourses') }
                ]
            },
            technology: {
                id: 'technology',
                title: 'Technology Courses',
                icon: Code,
                color: 'green',
                courses: [
                    { id: 'mern-stack-developer', title: 'MERN Stack Developer', subtitle: 'MongoDB, Express, React, Node', duration: '6 Months', level: 'Beginner to Advanced', priceKey: 'mern-stack-developer', enrolled: '45+', features: ['React.js', 'Node.js', 'MongoDB', 'API Dev'], action: () => onNavigate('technologyTraining') },
                    { id: 'full-stack-python-developer', title: 'Full Stack Python Developer', subtitle: 'Python, Django/Flask, PostgreSQL', duration: '6 Months', level: 'Beginner to Advanced', priceKey: 'full-stack-python-developer', enrolled: '38+', features: ['Python', 'Django', 'Flask', 'PostgreSQL'], action: () => onNavigate('technologyTraining') },
                    { id: 'java-full-stack-developer', title: 'Java Full Stack Developer', subtitle: 'Java, Spring Boot, Angular/React', duration: '7 Months', level: 'Beginner to Advanced', priceKey: 'java-full-stack-developer', enrolled: '52+', features: ['Java', 'Spring Boot', 'Angular/React', 'Microservices'], action: () => onNavigate('technologyTraining') },
                    { id: 'aws-cloud-architect', title: 'AWS Cloud Architect', subtitle: 'AWS services & architecture', duration: '4 Months', level: 'Intermediate to Advanced', priceKey: 'aws-cloud-architect', enrolled: '34+', features: ['AWS', 'Terraform', 'ECS/EKS', 'Security'], action: () => onNavigate('technologyTraining') },
                    { id: 'devops-engineer-bootcamp', title: 'DevOps Engineer Bootcamp', subtitle: 'CI/CD, Docker, Kubernetes', duration: '5 Months', level: 'Intermediate', priceKey: 'devops-engineer-bootcamp', enrolled: '41+', features: ['CI/CD', 'Docker', 'Kubernetes', 'Jenkins'], action: () => onNavigate('technologyTraining') },
                    { id: 'azure-cloud-solutions', title: 'Azure Cloud Solutions', subtitle: 'Azure services & enterprise solutions', duration: '4 Months', level: 'Intermediate', priceKey: 'azure-cloud-solutions', enrolled: '28+', features: ['Azure', 'AD', 'DevOps', 'Security Center'], action: () => onNavigate('technologyTraining') },
                    { id: 'data-science-with-python', title: 'Data Science with Python', subtitle: 'Data analysis & machine learning', duration: '5 Months', level: 'Beginner to Advanced', priceKey: 'data-science-with-python', enrolled: '56+', features: ['Python', 'ML', 'TensorFlow', 'Visualization'], action: () => onNavigate('technologyTraining') },
                    { id: 'ai-ml-engineer', title: 'AI & Machine Learning Engineer', subtitle: 'Deep learning & model deployment', duration: '6 Months', level: 'Intermediate to Advanced', priceKey: 'ai-ml-engineer', enrolled: '23+', features: ['ML', 'Deep Learning', 'NLP', 'MLOps'], action: () => onNavigate('technologyTraining') },
                    { id: 'business-intelligence-analyst', title: 'Business Intelligence Analyst', subtitle: 'Power BI, Tableau and SQL', duration: '3 Months', level: 'Beginner to Intermediate', priceKey: 'business-intelligence-analyst', enrolled: '47+', features: ['SQL', 'Power BI', 'Tableau', 'Analytics'], action: () => onNavigate('technologyTraining') },
                    { id: 'automation-testing-engineer', title: 'Automation Testing Engineer', subtitle: 'Selenium, API & performance testing', duration: '4 Months', level: 'Beginner to Advanced', priceKey: 'automation-testing-engineer', enrolled: '39+', features: ['Selenium', 'API Testing', 'Performance', 'CI/CD'], action: () => onNavigate('technologyTraining') },
                    { id: 'manual-testing-specialist', title: 'Manual Testing Specialist', subtitle: 'Manual QA foundations', duration: '2 Months', level: 'Beginner', priceKey: 'manual-testing-specialist', enrolled: '61+', features: ['Manual Testing', 'Bug Tracking', 'Agile', 'Web/Mobile'], action: () => onNavigate('technologyTraining') },
                    { id: 'react-native-developer', title: 'React Native Developer', subtitle: 'Cross-platform mobile apps', duration: '4 Months', level: 'Intermediate', priceKey: 'react-native-developer', enrolled: '31+', features: ['React Native', 'State Mgmt', 'Native Modules', 'App Store'], action: () => onNavigate('technologyTraining') },
                    { id: 'flutter-app-developer', title: 'Flutter App Developer', subtitle: 'Flutter & Dart mobile apps', duration: '4 Months', level: 'Beginner to Intermediate', priceKey: 'flutter-app-developer', enrolled: '26+', features: ['Flutter', 'Dart', 'Firebase', 'UI'], action: () => onNavigate('technologyTraining') }
                ]
            },
            college: {
                id: 'college',
                title: 'College Training',
                icon: Users,
                color: 'orange',
                courses: [
                    {
                        id: 'college-training',
                        title: 'College Bulk Training Program',
                        subtitle: 'Customized for Educational Institutions',
                        duration: 'Custom',
                        level: 'All Levels',
                        priceKey: 'college-training',
                        enrolled: '500+ Students',
                        features: ['Bulk Pricing', 'Placement Support', 'Industry Certificates', 'College Partnerships'],
                        action: () => onNavigate('collegeTraining')
                        },
                        {
                            id: 'team-skill-development',
                            title: 'Team Skill Development',
                            subtitle: 'Multi-technology Training Solutions',
                            duration: 'Customizable',
                            level: 'All Levels',
                            priceKey: 'team-skill-development',
                            enrolled: 'Contact Us',
                            features: ['Custom Curriculum', 'Team Training', 'Skill Assessment', 'Progress Tracking'],
                            action: () => onNavigate('contact')
                    }
                ]
            }
        };

        const tabs = Object.values(courseCategories);
        const currentCategory = courseCategories[activeTab];

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                activeTab === tab.id
                                    ? `bg-${tab.color}-600 text-white shadow-lg`
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.title}
                        </button>
                    ))}
                </div>

                {/* Course Cards for Active Tab */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCategory.courses.map((course, index) => {
                        const coursePrice = pricing?.[course.priceKey];
                            const displayPrice = loading ? '₹...' : (coursePrice ? (coursePrice.finalPrice === 0 ? 'Contact Us' : formatPrice(coursePrice.finalPrice)) : '₹999');
                        const originalPrice = coursePrice ? formatPrice(coursePrice.originalPrice) : '';
                        
                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-${currentCategory.color}-500 transition-all duration-300 group relative overflow-hidden`}
                            >
                                {course.popular && (
                                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                        POPULAR
                                    </div>
                                )}
                                
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-${currentCategory.color}-600 to-${currentCategory.color}-800 opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                
                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br from-${currentCategory.color}-600 to-${currentCategory.color}-800 rounded-lg flex items-center justify-center`}>
                                            <currentCategory.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-green-400">{course.enrolled}</div>
                                            <div className="text-xs text-slate-400">{course.level}</div>
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
                                    <p className="text-slate-400 text-sm mb-4">{course.subtitle}</p>

                                    {/* Features */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {course.features.map((feature, idx) => (
                                                <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-lg font-bold text-white">{displayPrice}</div>
                                            {originalPrice && (
                                                <div className="text-sm text-slate-400 line-through">{originalPrice}</div>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400">{course.duration}</div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={course.action}
                                        className={`w-full bg-gradient-to-r from-${currentCategory.color}-600 to-${currentCategory.color}-700 text-white py-2 px-4 rounded-lg hover:from-${currentCategory.color}-700 hover:to-${currentCategory.color}-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
                                    >
                                        <span>Explore Course</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
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

    const handleJobSelection = (job) => {
        setIsTransitioning(true);
        
        setTimeout(() => {
            if (job.targetPage && onNavigate) {
                // Navigate to specific course landing page based on job selection
                onNavigate(job.targetPage);
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
                        <>
                            {/* Job Exploration Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-20"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        Which Career Path Interests You?
                                    </h2>
                                    <p className="text-slate-400 text-lg">
                                        Explore high-demand tech careers and their requirements
                                    </p>
                                </div>
                                <JobExplorationSection />
                            </motion.div>

                            {/* Course Programs Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        Our Training Programs
                                    </h2>
                                    <p className="text-slate-400 text-lg">
                                        Choose your specialization and start your learning journey
                                    </p>
                                </div>
                                <CourseProgramsSection />
                            </motion.div>
                        </>
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
            <FeaturedModulesSection onNavigate={onNavigate} />
            <TraditionalCoursesSection onNavigate={onNavigate} />
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