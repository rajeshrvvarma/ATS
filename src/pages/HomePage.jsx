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
    <AnimatedBackground variant="metrics" className="py-20">
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
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
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
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
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
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300"
                    >
                        <feature.icon className={`w-12 h-12 text-${feature.color}-400 mb-4`} />
                        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    </AnimatedBackground>
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
        <AnimatedBackground variant="contact" className="py-20">
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
                        
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-white mb-4">Why Choose Our Training?</h4>
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
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
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
                                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Your Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={formData.interest}
                                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
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
                                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </motion.div>
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