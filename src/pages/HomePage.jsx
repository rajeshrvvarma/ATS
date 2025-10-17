import React, { useState, useEffect } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle, ArrowRight, Star, TrendingUp, Clock, DollarSign, BookOpen, Globe, Zap, Grid3X3, Layers, Map, Eye, RotateCcw, Laptop, Cloud, Database, TestTube, Search, Filter, Play, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle.jsx';
import { sendContactForm } from '@/services/netlifyFormsService.js';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import EnhancedEnrollmentModal from '@/components/EnhancedEnrollmentModal.jsx';


// PREMIUM COURSES SECTION - Revenue Focus
const PremiumCoursesSection = ({ onNavigate, premiumCourses }) => {
    const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, courseType: '', courseName: '' });

    const getUrgencyColor = (urgency) => {
        switch(urgency) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            default: return 'text-green-400';
        }
    };

    const getUrgencyMessage = (seatsLeft, urgency) => {
        if (urgency === 'high') return `Only ${seatsLeft} seats left!`;
        if (urgency === 'medium') return `${seatsLeft} seats available`;
        return `${seatsLeft} seats available`;
    };

    return (
        <>
            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            <span className="text-yellow-400">🚀 Launch Your Career</span><br />
                            Professional Cybersecurity Courses
                        </h2>
                        <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                            <strong className="text-blue-400">Weekend-only classes</strong> designed for working professionals.
                            <strong className="text-green-400"> Personal instruction</strong>,
                            <strong className="text-purple-400"> job assistance</strong>, and
                            <strong className="text-cyan-400"> industry mentorship</strong> included.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <div className="bg-red-500/20 border border-red-500 rounded-full px-6 py-2">
                                <span className="text-red-400 font-bold">🔥 December Batches Filling Fast</span>
                            </div>
                            <div className="bg-green-500/20 border border-green-500 rounded-full px-6 py-2">
                                <span className="text-green-400 font-bold">💰 Early Bird: ₹20,000 (Save ₹15K)</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        {premiumCourses.map((course, index) => {
                            const IconComponent = course.icon;
                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group relative"
                                >
                                    {/* Urgency Banner */}
                                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-bold
                                        ${course.urgency === 'high' ? 'bg-red-500 text-white animate-pulse' :
                                          course.urgency === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                                        {course.urgency === 'high' && '🔥 FILLING FAST'}
                                        {course.urgency === 'medium' && '⚡ LIMITED SEATS'}
                                        {course.urgency === 'low' && '✅ SEATS AVAILABLE'}
                                    </div>

                                    {/* Course Header */}
                                    <div className={`bg-gradient-to-br ${course.gradient} p-6 text-white relative`}>
                                        <IconComponent className="w-12 h-12 mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                                        <p className="text-lg opacity-90">{course.subtitle}</p>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-6">
                                        <p className="text-slate-300 mb-6">{course.description}</p>

                                        {/* Key Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center bg-slate-700/50 rounded-lg p-3">
                                                <div className="text-2xl font-bold text-green-400">{course.placementRate}</div>
                                                <div className="text-sm text-slate-400">Placement Rate</div>
                                            </div>
                                            <div className="text-center bg-slate-700/50 rounded-lg p-3">
                                                <div className="text-2xl font-bold text-blue-400">{course.avgSalary}</div>
                                                <div className="text-sm text-slate-400">Avg Salary</div>
                                            </div>
                                        </div>

                                        {/* Course Details */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Duration:</span>
                                                <span className="text-white font-semibold">{course.duration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Schedule:</span>
                                                <span className="text-white font-semibold">{course.schedule}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Next Batch:</span>
                                                <span className="text-yellow-400 font-semibold">{course.nextBatch}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Enrolled:</span>
                                                <span className="text-blue-400 font-semibold">{course.enrolled}+ students</span>
                                            </div>
                                        </div>

                                        {/* Seats Left */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-slate-400">Seats:</span>
                                                <span className={`font-bold ${getUrgencyColor(course.urgency)}`}>
                                                    {getUrgencyMessage(course.seatsLeft, course.urgency)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300
                                                        ${course.urgency === 'high' ? 'bg-red-500' :
                                                          course.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(course.totalSeats - course.seatsLeft) / course.totalSeats * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-6">
                                            <h4 className="text-white font-semibold mb-3">What You'll Learn:</h4>
                                            <div className="space-y-2">
                                                {course.features.slice(0, 4).map((feature, idx) => (
                                                    <div key={idx} className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                                        <span className="text-slate-300 text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="text-center mb-6">
                                            <div className="mb-2">
                                                <span className="text-3xl font-bold text-green-400">₹{course.currentPrice.replace('₹', '')}</span>
                                                <span className="text-lg text-slate-400 line-through ml-2">{course.originalPrice}</span>
                                            </div>
                                            <div className="text-red-400 font-semibold">
                                                Save ₹{parseInt(course.originalPrice.replace('₹', '').replace(',', '')) - parseInt(course.currentPrice.replace('₹', '').replace(',', ''))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={course.action}
                                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                                                    ${course.urgency === 'high'
                                                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                            >
                                                {course.urgency === 'high' ? '🔥 Grab Last Seats!' : '🚀 Enroll Now'}
                                            </button>
                                            <button className="w-full py-3 px-6 rounded-xl border border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-300">
                                                💬 Book Free Consultation
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Not Sure Which Course to Choose?
                            </h3>
                            <p className="text-xl text-blue-100 mb-6">
                                Book a free 30-minute consultation with our cybersecurity expert
                            </p>
                            <button
                                onClick={() => onNavigate('contact')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                            >
                                📞 Book Free Consultation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <EnhancedEnrollmentModal
                isOpen={enrollmentModal.isOpen}
                onClose={() => setEnrollmentModal({ isOpen: false, courseType: '', courseName: '' })}
                courseType={enrollmentModal.courseType}
                courseName={enrollmentModal.courseName}
            />
        </>
    );
};

// Simplified Hero Section - Premium Courses Focus
const HeroSection = ({ onNavigate }) => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

    // Single hero message focused on premium courses
    const heroData = {
        title: <>
            <span className="text-red-400">December Batch Starting Soon!</span><br />
            <span className="text-3xl md:text-5xl text-blue-400">Launch Your Cybersecurity Career</span><br />
            <span className="text-2xl md:text-3xl text-yellow-400">in Just 8 Weeks</span>
        </>,
        description: <>
            Join <strong className="text-green-400">15+ professionals</strong> who successfully transitioned to
            <strong className="text-blue-400"> High-Paying Cybersecurity Roles</strong> through our intensive weekend program.<br />
            <span className="text-yellow-400 font-semibold">₹20,000 only • Weekends • Personal Instruction • Job Assistance</span>
        </>,
        features: [
            { icon: Users, text: 'Only 8 Seats Left' },
            { icon: Clock, text: 'Weekends Only' },
            { icon: Star, text: '80% Placement Rate' },
        ]
    };



    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <div className="min-h-[45vh] flex items-center justify-center bg-slate-900 bg-fixed py-3 md:py-07 relative">
                <section id="home" className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-6 relative">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {heroData.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                            {heroData.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 mb-6 text-center">
                            {heroData.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 bg-slate-800/50 px-6 py-3 rounded-full backdrop-blur-sm border border-slate-700">
                                    <f.icon className="w-5 h-5 text-blue-400" />
                                    <span className="text-white font-semibold">{f.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Clear Call to Action */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('enroll')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                            >
                                🚀 View Courses & Enroll
                            </button>
                            <button
                                onClick={() => onNavigate('contact')}
                                className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                            >
                                💬 Book Free Consultation
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

// Module system has been archived - focus on premium courses only

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
                    Join dozens of successful students who have transformed their careers with our training programs
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { icon: Users, label: '50+ Students', value: 'Enrolled', color: 'blue' },
                    { icon: TrendingUp, label: '78% Placement', value: 'Success Rate', color: 'green' },
                    { icon: Star, label: '4.6/5 Rating', value: 'Student Reviews', color: 'yellow' },
                    { icon: Award, label: '25+ Companies', value: 'Hiring Partners', color: 'purple' }
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
                        Over 50+ students have transformed their careers with us
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
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);

    // --- HIGH-VALUE COURSES (Revenue Focus) ---
    const premiumCourses = [
        {
            id: 'defensive-security-professional',
            title: 'Defensive Security Professional',
            subtitle: 'SOC Analyst to Security Engineer Path',
            description: 'Master SIEM, incident response, threat hunting, and security operations. Get job-ready in 8 weeks.',
            originalPrice: '₹35,000',
            currentPrice: '₹20,000',
            duration: '8 Weeks',
            schedule: 'Weekends (Fri-Sun)',
            level: 'Beginner to Advanced',
            icon: Shield,
            color: 'blue',
            features: ['SIEM Mastery (Splunk/QRadar)', 'Incident Response', 'Threat Hunting', 'Security Tools', 'Job Assistance', 'Personal Mentoring'],
            seatsLeft: 3,
            totalSeats: 8,
            enrolled: '12',
            placementRate: '85%',
            avgSalary: '4-8 LPA',
            nextBatch: 'Dec 15, 2025',
            action: () => handleNavigate('enroll?course=defensive-security-professional'),
            gradient: 'from-blue-600 to-blue-800',
            urgency: 'high'
        },
        {
            id: 'offensive-security-mastery',
            title: 'Offensive Security Mastery',
            subtitle: 'Ethical Hacker to Penetration Tester',
            description: 'Learn penetration testing, vulnerability assessment, and red team operations. OSCP preparation included.',
            originalPrice: '₹40,000',
            currentPrice: '₹20,000',
            duration: '8 Weeks',
            schedule: 'Weekends (Fri-Sun)',
            level: 'Intermediate to Advanced',
            icon: Sword,
            color: 'red',
            features: ['Web App Penetration Testing', 'Network Security Testing', 'OSCP Preparation', 'Report Writing', 'Job Assistance', 'Personal Mentoring'],
            seatsLeft: 5,
            totalSeats: 8,
            enrolled: '8',
            placementRate: '80%',
            avgSalary: '5-10 LPA',
            nextBatch: 'Jan 5, 2026',
            action: () => handleNavigate('enroll?course=offensive-security-mastery'),
            gradient: 'from-red-600 to-red-800',
            urgency: 'medium'
        },
        {
            id: 'cloud-devops-security',
            title: 'Cloud DevOps Security',
            subtitle: 'AWS/Azure Security Specialist',
            description: 'Combine DevOps skills with cloud security. Master AWS/Azure security, container security, and automation.',
            originalPrice: '₹30,000',
            currentPrice: '₹20,000',
            duration: '6 Weeks',
            schedule: 'Weekends (Sat-Sun)',
            level: 'Intermediate',
            icon: Cloud,
            color: 'cyan',
            features: ['AWS/Azure Security', 'Container Security', 'Infrastructure as Code', 'DevSecOps', 'Job Assistance', 'Personal Mentoring'],
            seatsLeft: 6,
            totalSeats: 10,
            enrolled: '15',
            placementRate: '78%',
            avgSalary: '6-12 LPA',
            nextBatch: 'Dec 22, 2025',
            action: () => handleNavigate('enroll?course=cloud-devops-security'),
            gradient: 'from-cyan-600 to-cyan-800',
            urgency: 'low'
        }
    ];

    // Simplified navigation handler
    const handleNavigate = (route, params) => {
        if (typeof onNavigate === 'function') {
            onNavigate(route, params);
        }
    };

    useEffect(() => {
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
            <HeroSection onNavigate={handleNavigate} />
            <PremiumCoursesSection onNavigate={handleNavigate} premiumCourses={premiumCourses} />
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