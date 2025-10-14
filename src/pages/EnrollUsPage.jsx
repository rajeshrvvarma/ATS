import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, BookOpen, Send, CheckCircle, GraduationCap, Target, Calendar, Users, Clock, Zap } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { initiatePayment, verifyPayment } from '@/services/phonepe.js';
import { getBatchById, getActiveBatches, getBatchesByCourse, getUrgencyColor } from '@/data/activeBatches.js';
import { sendEnrollmentInquiry } from '@/services/netlifyFormsService.js';

export default function EnrollUsPage({ onNavigate }) {
        // Modular pricing options
        const pricingOptions = [
                { label: 'Individual Module', modules: 1, price: 699 },
                { label: 'Mini Path (3 modules)', modules: 3, price: 1899 },
                { label: 'Standard Path (5 modules)', modules: 5, price: 3199 },
                { label: 'Advanced Path (7 modules)', modules: 7, price: 4399 },
                { label: 'Add-on Module (existing students)', modules: 1, price: 599 },
                { label: 'Specialization Combo (Programming + DSA)', modules: 2, price: 1299 },
        ];

        // Import the 102+ modules from the catalog (sync with ModuleCatalog.jsx)
        const moduleCategories = [
            { name: 'Programming Foundation', modules: [
                'C Programming Fundamentals', 'C++ Object-Oriented Programming', 'Java Programming', 'Python Programming', 'JavaScript & ES6+', 'Go Programming', 'Rust Programming', 'Data Structures & Algorithms',
            ] },
            { name: 'Web Development Frontend', modules: [
                'HTML5 & CSS3 Mastery', 'Responsive Web Design', 'JavaScript DOM & APIs', 'React.js Development', 'Angular Framework', 'Vue.js Framework',
            ] },
            { name: 'Web Development Backend', modules: [
                'Node.js & Express', 'Python Web Frameworks', 'Java Spring Boot', 'PHP & Laravel', 'Ruby on Rails', 'ASP.NET Core', 'RESTful API Design',
            ] },
            { name: 'Database Technologies', modules: [
                'SQL Fundamentals', 'Advanced Database Design', 'NoSQL Databases', 'Redis & Caching', 'Elasticsearch & Search', 'Database Administration', 'Data Warehousing', 'Graph Databases',
            ] },
            { name: 'Cloud Platforms', modules: [
                'AWS Fundamentals', 'AWS Advanced Services', 'AWS Solutions Architecture', 'Azure Fundamentals', 'Azure Advanced Services', 'Azure Solutions Architecture', 'Google Cloud Platform', 'Multi-Cloud Architecture', 'Cloud Cost Optimization', 'Serverless Computing', 'Cloud Networking', 'Cloud Storage Solutions',
            ] },
            { name: 'DevOps & Infrastructure', modules: [
                'Linux System Administration', 'Docker & Containerization', 'Kubernetes Orchestration', 'CI/CD Pipeline Development', 'Infrastructure as Code', 'Configuration Management', 'Monitoring & Logging', 'GitOps & Version Control', 'Site Reliability Engineering', 'DevSecOps',
            ] },
            { name: 'Mobile Development', modules: [
                'Android Native Development', 'iOS Native Development', 'React Native Cross-Platform', 'Flutter Development', 'Mobile Backend Services', 'Mobile App Testing & Deployment',
            ] },
            { name: 'Data Science & Analytics', modules: [
                'Statistics for Data Science', 'Data Analysis with Python', 'Data Analysis with R', 'Machine Learning Fundamentals', 'Advanced Machine Learning', 'Deep Learning & Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Big Data Processing', 'MLOps & Model Deployment',
            ] },
            { name: 'Artificial Intelligence', modules: [
                'AI Fundamentals', 'Generative AI & LLMs', 'AI Model Development', 'AI Integration & APIs', 'Computer Vision AI', 'AI for Business Applications',
            ] },
            { name: 'Cybersecurity', modules: [
                'Information Security Basics', 'Network Security', 'Web Application Security', 'Cloud Security', 'Incident Response & Forensics', 'Security Operations Center', 'Ethical Hacking & Pen Testing', 'Compliance & Governance',
            ] },
            { name: 'Software Testing', modules: [
                'Manual Testing Fundamentals', 'Test Automation with Selenium', 'API Testing', 'Performance Testing', 'Mobile App Testing',
            ] },
            { name: 'Specialized Technologies', modules: [
                'Blockchain Development', 'IoT & Embedded Systems', 'Game Development', 'AR/VR Development', 'Quantum Computing Basics', 'Edge Computing', 'Microservices Architecture', 'Enterprise Integration',
            ] },
        ];

        // Flatten all modules for selection
        const allModules = moduleCategories.flatMap(cat => cat.modules.map(title => ({ title, category: cat.name })));

        const [formData, setFormData] = useState({
                name: '',
                email: '',
                phone: '',
                selectedModules: [],
                pricingOption: pricingOptions[0],
                experience: 'beginner',
                background: '',
                goals: '',
                startDate: '',
                source: 'website'
        });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentMsg, setPaymentMsg] = useState('');
    const [lastOrderId, setLastOrderId] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null);


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle module selection (checkboxes)
    const handleModuleSelect = (title) => {
        setFormData(prev => {
            const already = prev.selectedModules.includes(title);
            return {
                ...prev,
                selectedModules: already
                    ? prev.selectedModules.filter(m => m !== title)
                    : [...prev.selectedModules, title]
            };
        });
    };

    // Handle pricing option change
    const handlePricingOptionChange = (option) => {
        setFormData(prev => ({ ...prev, pricingOption: option }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Validate module count matches pricing option
            if (formData.selectedModules.length !== formData.pricingOption.modules && formData.pricingOption.label !== 'Add-on Module (existing students)' && formData.pricingOption.label !== 'Specialization Combo (Programming + DSA)') {
                alert(`Please select exactly ${formData.pricingOption.modules} module(s) for the chosen pricing option.`);
                setSubmitting(false);
                return;
            }
            // Send enrollment inquiry via Netlify Forms
            const result = await sendEnrollmentInquiry({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                modules: formData.selectedModules,
                pricingOption: formData.pricingOption.label,
                experience: formData.experience,
                message: `Background: ${formData.background}\nGoals: ${formData.goals}\nPreferred Start Date: ${formData.startDate}`,
                source: 'modular-enrollment-page'
            });
            if (result.success) {
                setSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    selectedModules: [],
                    pricingOption: pricingOptions[0],
                    experience: 'beginner',
                    background: '',
                    goals: '',
                    startDate: '',
                    source: 'website'
                });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                throw new Error(result.error || 'Failed to submit inquiry');
            }
        } catch (error) {
            console.error('Enrollment inquiry submission error:', error);
            alert('Failed to submit inquiry. Please try again or contact us directly.');
        } finally {
            setSubmitting(false);
        }
    };



    const experienceLevels = [
        { id: 'beginner', name: 'Complete Beginner', description: 'New to cybersecurity' },
        { id: 'some', name: 'Some Experience', description: '1-2 years in IT/Security' },
        { id: 'intermediate', name: 'Intermediate', description: '3-5 years experience' },
        { id: 'advanced', name: 'Advanced', description: '5+ years in cybersecurity' }
    ];

    const benefits = [
        'Free career counseling session',
        'Course roadmap personalized for you',
        'Access to exclusive study materials',
        'Priority enrollment in upcoming batches',
        'Industry mentor assignment',
        'Job placement assistance'
    ];

    const handleTestPayment = async () => {
        try {
            setPaymentLoading(true);
            setPaymentMsg('');

            // Find selected course and get price
            const selectedCourse = courses.find(course => course.id === formData.course);
            if (!selectedCourse) {
                setPaymentMsg('Please select a course first.');
                setPaymentLoading(false);
                return;
            }

            if (selectedCourse.razorpayPrice === null) {
                setPaymentMsg('This course requires custom pricing. Please contact us.');
                setPaymentLoading(false);
                return;
            }

            if (selectedCourse.razorpayPrice === 0) {
                setPaymentMsg('This is a free course. No payment required.');
                setPaymentLoading(false);
                return;
            }

            const batchInfo = selectedBatch || (formData.batchId ? getBatchById(formData.batchId) : null);
            const description = batchInfo ? `${selectedCourse.name} - ${batchInfo.batchName}` : `Payment for ${selectedCourse.name}`;

            // UPI-first mode: redirect to payment failed page to inform user about UPI option
            throw new Error('Please use the UPI payment option or contact support for enrollment assistance');
        } catch (e) {
            setPaymentMsg(e?.message || 'Payment was cancelled or failed.');
            const selectedCourse = courses.find(course => course.id === formData.course);
            const err = {
                planName: selectedCourse?.name || 'Selected Course',
                message: e?.message || 'Payment cancelled or failed'
            };
            localStorage.setItem('paymentError', JSON.stringify(err));
            setTimeout(() => onNavigate('paymentFailed'), 600);
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="bg-gradient-green bg-fixed text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </button>

                {selectedBatch ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {selectedBatch.title}
                            </h1>
                            <p className="text-xl text-slate-300 mb-6">
                                {selectedBatch.batchName} - Limited Time Enrollment
                            </p>
                        </div>
                        
                        {/* Batch Information Card */}
                        <div className={`max-w-4xl mx-auto mb-8 p-6 rounded-xl border ${getUrgencyColor(selectedBatch.urgency)} backdrop-blur-sm`}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                                <div>
                                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                    <p className="text-sm text-slate-400">Start Date</p>
                                    <p className="font-semibold text-white">{selectedBatch.startDate}</p>
                                </div>
                                <div>
                                    <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                    <p className="text-sm text-slate-400">Schedule</p>
                                    <p className="font-semibold text-white">{selectedBatch.schedule}</p>
                                </div>
                                <div>
                                    <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                                    <p className="text-sm text-slate-400">Seats Available</p>
                                    <p className={`font-semibold ${selectedBatch.urgency === 'high' ? 'text-red-300' : 'text-white'}`}>
                                        {selectedBatch.seatsLeft}/{selectedBatch.totalSeats}
                                    </p>
                                </div>
                                <div>
                                    <Target className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                                    <p className="text-sm text-slate-400">Investment</p>
                                    <p className="font-semibold text-green-300">{selectedBatch.price}</p>
                                    <p className="text-xs text-slate-400 line-through">{selectedBatch.originalPrice}</p>
                                </div>
                            </div>
                            
                            {selectedBatch.urgency === 'high' && (
                                <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-red-400 mr-2 animate-pulse" />
                                    <span className="text-red-300 font-semibold">
                                        ⚡ Hurry! Only {selectedBatch.seatsLeft} seats remaining for this batch!
                                    </span>
                                </div>
                            )}
                            
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-300">
                                    📚 <strong>{selectedBatch.features.length} Key Benefits:</strong> {selectedBatch.features.join(' • ')}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <SectionTitle>Enroll in Our Programs</SectionTitle>
                        <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                            Start your cybersecurity journey with personalized guidance
                        </p>
                    </>
                )}

                <div className="max-w-6xl mx-auto">
                    {submitted && (
                        <div className="mb-8 p-6 bg-green-900/30 border border-green-700 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-400 mr-4" />
                            <div>
                                <h3 className="text-green-300 font-semibold text-lg">Enrollment Request Submitted!</h3>
                                <p className="text-green-100">Our admissions team will contact you within 24 hours to discuss your personalized learning path.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Enrollment Form */}
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <GraduationCap size={24} className="mr-3 text-blue-400" />
                                Enrollment Form
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Personal Information */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="+91-9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="course" className="block text-sm font-medium text-slate-300 mb-2">
                                            Interested Course *
                                        </label>
                                        <select
                                            id="course"
                                            name="course"
                                            required
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            disabled={selectedBatch} // Disable if coming from specific batch
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                        >
                                            <option value="">Select a course</option>
                                            
                                            {/* Group courses by category */}
                                            <optgroup label="🔥 7-Day Bootcamps (Popular)">
                                                {courses.filter(course => course.category === '7-Day Bootcamps').map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} - {course.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            
                                            <optgroup label="🏆 2-Month Premium Programs">
                                                {courses.filter(course => course.category === '2-Month Premium Programs').map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} - {course.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            
                                            <optgroup label="🎯 Specialized Courses">
                                                {courses.filter(course => course.category === 'Specialized Courses').map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} - {course.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            
                                            <optgroup label="🚀 Foundation Programs">
                                                {courses.filter(course => course.category === 'Foundation Programs').map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} - {course.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            
                                            <optgroup label="🎨 Custom Programs">
                                                {courses.filter(course => course.category === 'Custom Programs').map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} - {course.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                        
                                        {selectedBatch && (
                                            <p className="text-sm text-blue-300 mt-1">
                                                ✅ Pre-selected from banner: {selectedBatch.courseName}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Batch Selection (when course is selected and multiple batches available) */}
                                    {availableBatches.length > 0 && formData.course && !selectedBatch && (
                                        <div>
                                            <label htmlFor="batchId" className="block text-sm font-medium text-slate-300 mb-2">
                                                Select Batch *
                                            </label>
                                            <select
                                                id="batchId"
                                                name="batchId"
                                                value={formData.batchId}
                                                onChange={handleInputChange}
                                                className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Choose your preferred batch</option>
                                                {availableBatches
                                                    .filter(batch => batch.courseId === formData.course)
                                                    .map(batch => (
                                                        <option key={batch.id} value={batch.id}>
                                                            {batch.batchName} - Starts {batch.startDate} ({batch.seatsLeft} seats left)
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    )}
                                    
                                    {selectedBatch && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Selected Batch
                                            </label>
                                            <div className="bg-slate-900 border border-green-600 rounded-md p-3">
                                                <p className="text-green-300 font-semibold">
                                                    ✅ {selectedBatch.batchName}
                                                </p>
                                                <p className="text-slate-300 text-sm">
                                                    Starts {selectedBatch.startDate} • {selectedBatch.schedule}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Current Experience Level *
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {experienceLevels.map(level => (
                                            <label key={level.id} className="flex items-start p-3 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value={level.id}
                                                    checked={formData.experience === level.id}
                                                    onChange={handleInputChange}
                                                    className="mt-1 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-white font-medium">{level.name}</div>
                                                    <div className="text-slate-400 text-sm">{level.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Background & Goals */}
                                <div>
                                    <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-2">
                                        Educational/Professional Background
                                    </label>
                                    <textarea
                                        id="background"
                                        name="background"
                                        rows={3}
                                        value={formData.background}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="Tell us about your current education or work experience..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="goals" className="block text-sm font-medium text-slate-300 mb-2">
                                        Career Goals & Expectations *
                                    </label>
                                    <textarea
                                        id="goals"
                                        name="goals"
                                        required
                                        rows={3}
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="What do you want to achieve with this course? What specific skills are you looking for?"
                                    ></textarea>
                                </div>

                                {/* Preferred Start Date */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-2">
                                            Preferred Start Date
                                        </label>
                                        <select
                                            id="startDate"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select timeline</option>
                                            <option value="immediate">Immediately (Next batch)</option>
                                            <option value="1month">Within 1 month</option>
                                            <option value="3months">Within 3 months</option>
                                            <option value="flexible">Flexible timing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="source" className="block text-sm font-medium text-slate-300 mb-2">
                                            How did you hear about us?
                                        </label>
                                        <select
                                            id="source"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="website">Website</option>
                                            <option value="social">Social Media</option>
                                            <option value="friend">Friend/Colleague</option>
                                            <option value="search">Google Search</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full py-4 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} className="mr-2" />
                                        {submitting ? 'Submitting...' : 'Submit Enrollment Request'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleTestPayment}
                                        disabled={paymentLoading || !formData.course}
                                        className="btn-primary w-full py-4 shadow-lg"
                                    >
                                        {(() => {
                                            if (paymentLoading) return 'Processing…';
                                            
                                            const selectedCourse = courses.find(course => course.id === formData.course);
                                            if (!selectedCourse) return 'Select a course first';
                                            if (selectedCourse.razorpayPrice === 0) return 'Free Course - Submit Form';
                                            if (selectedCourse.razorpayPrice === null) return 'Contact for Custom Pricing';
                                            
                                            const batchInfo = selectedBatch || (formData.batchId ? getBatchById(formData.batchId) : null);
                                            if (batchInfo) {
                                                return `Secure Seat in ${batchInfo.batchName} - ${batchInfo.price}`;
                                            }
                                            
                                            return `Pay via UPI (${selectedCourse.price})`;
                                        })()}
                                    </button>
                                </div>
                                {paymentMsg && (
                                    <p className="text-sm text-slate-300 text-center mt-3">{paymentMsg}</p>
                                )}

                                <p className="text-xs text-slate-400 text-center">
                                    By submitting this form, you agree to be contacted by our admissions team via phone, email, or WhatsApp.
                                </p>
                            </form>
                        </div>

                        {/* Benefits & Next Steps */}
                        <div className="space-y-8">
                            {/* What Happens Next */}
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Target size={24} className="mr-3 text-sky-400" />
                                    What Happens Next?
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Personal Consultation</h4>
                                            <p className="text-slate-300 text-sm">Our admissions counselor will call you within 24 hours to understand your goals and recommend the best program.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Customized Learning Path</h4>
                                            <p className="text-slate-300 text-sm">We'll create a personalized curriculum based on your experience level and career objectives.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Enrollment & Payment</h4>
                                            <p className="text-slate-300 text-sm">Secure your spot with flexible payment options and get immediate access to pre-course materials.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Benefits */}
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h3 className="text-2xl font-bold text-white mb-6">Why Enroll Through This Form?</h3>
                                
                                <ul className="space-y-3">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-slate-300 text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact for Questions */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-center">
                                <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
                                <p className="text-sky-100 mb-4">
                                    Speak directly with our admissions team for personalized guidance.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <div className="font-semibold">Admissions Hotline</div>
                                        <div className="text-sm text-blue-200">+91-9160813700</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <div className="font-semibold">Email</div>
                                        <div className="text-sm text-blue-200">santosh.m@agnidhra-technologies.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Debug/Test Info (only visible in test mode keys) */}
                            {import.meta.env.VITE_RAZORPAY_KEY_ID && (
                                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 text-left">
                                    <div className="text-sm text-slate-300"><span className="font-semibold text-blue-300">Checkout Mode:</span> Using key {import.meta.env.VITE_RAZORPAY_KEY_ID}</div>
                                    {lastOrderId && <div className="text-sm text-slate-300 mt-1">Last order_id: {lastOrderId}</div>}
                                    {paymentMsg && <div className="text-sm text-slate-300 mt-1">Status: {paymentMsg}</div>}
                                    <div className="text-xs text-slate-400 mt-2">Tip: UPI is preferred. In Test Mode, you can use <span className="font-mono">success@razorpay</span> for instant success.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}