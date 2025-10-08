import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, BookOpen, MessageSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnrollmentEnquiryModal({ 
    isOpen, 
    onClose, 
    initialType = 'enquiry', // 'enquiry' or 'enrollment' 
    courseTitle = '',
    courseType = 'general'
}) {
    const [formType, setFormType] = useState(initialType);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: courseTitle || '',
        interest: courseType || 'general',
        message: '',
        urgency: 'normal'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ 
                name: '', 
                email: '', 
                phone: '', 
                course: courseTitle || '', 
                interest: courseType || 'general',
                message: '',
                urgency: 'normal'
            });
            onClose();
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    const modalConfig = {
        enquiry: {
            title: "Course Enquiry",
            subtitle: "Get detailed information about our programs",
            icon: MessageSquare,
            color: "blue",
            submitText: "Send Enquiry"
        },
        enrollment: {
            title: "Enroll Now",
            subtitle: "Start your cybersecurity journey today",
            icon: BookOpen,
            color: "green",
            submitText: "Submit Enrollment"
        }
    };

    const config = modalConfig[formType];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <config.icon className={`w-6 h-6 text-${config.color}-400`} />
                            <div>
                                <h3 className="text-xl font-bold text-white">{config.title}</h3>
                                <p className="text-sm text-slate-400">{config.subtitle}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Type Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
                        <button
                            onClick={() => setFormType('enquiry')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                                formType === 'enquiry' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Course Enquiry
                        </button>
                        <button
                            onClick={() => setFormType('enrollment')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                                formType === 'enrollment' 
                                    ? 'bg-green-600 text-white' 
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Direct Enrollment
                        </button>
                    </div>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className={`w-16 h-16 bg-${config.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Check className={`w-8 h-8 text-${config.color}-400`} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">
                                {formType === 'enrollment' ? 'Enrollment Submitted!' : 'Enquiry Sent!'}
                            </h4>
                            <p className="text-slate-300 mb-4">
                                {formType === 'enrollment' 
                                    ? 'Our admissions team will contact you within 24 hours to complete your enrollment process.'
                                    : 'We\'ll send you detailed course information and get back to you within 24 hours.'
                                }
                            </p>
                            <p className="text-sm text-slate-400">
                                This window will close automatically...
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Description */}
                            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {formType === 'enrollment' ? (
                                        <>
                                            <strong className="text-blue-400">Ready to enroll?</strong> Fill out this form and our admissions team will guide you through the enrollment process, payment options, and batch schedules.
                                        </>
                                    ) : (
                                        <>
                                            <strong className="text-blue-400">Have questions?</strong> Get detailed course information, syllabus, pricing, and answers to all your questions.
                                        </>
                                    )}
                                    {courseTitle && (
                                        <span className="block mt-2 font-semibold text-blue-400">
                                            Course: {courseTitle}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Course Interest
                                    </label>
                                    <select
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="defensive">Defensive Security (SOC Analyst)</option>
                                        <option value="offensive">Offensive Security (Ethical Hacking)</option>
                                        <option value="cloud">Cloud Security Specialist</option>
                                        <option value="corporate">Corporate Training</option>
                                        <option value="both">Both Defensive & Offensive</option>
                                        <option value="general">General Inquiry</option>
                                    </select>
                                </div>

                                {formType === 'enrollment' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Enrollment Urgency
                                        </label>
                                        <select
                                            name="urgency"
                                            value={formData.urgency}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="asap">ASAP - Next available batch</option>
                                            <option value="normal">Within 2-3 weeks</option>
                                            <option value="flexible">Flexible timing</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        {formType === 'enrollment' ? 'Additional Requirements' : 'Your Questions'}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder={
                                            formType === 'enrollment' 
                                                ? 'Any specific requirements, batch timing preferences, or payment queries...'
                                                : 'Ask about course content, pricing, batch schedules, prerequisites...'
                                        }
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-700">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-gradient-to-r ${
                                            config.color === 'green' 
                                                ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                                                : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                        } text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                {formType === 'enrollment' ? 'Processing...' : 'Sending...'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Send className="w-5 h-5" />
                                                {config.submitText}
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-xs text-slate-400 mt-4 text-center">
                                We respect your privacy. Your information will only be used for course communication and updates.
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}