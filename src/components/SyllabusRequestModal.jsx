import React, { useState } from 'react';
import { X, Download, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyllabusRequestModal({ isOpen, onClose, courseTitle, courseType }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: courseTitle || '',
        interest: courseType || 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', course: courseTitle || '', interest: courseType || 'general' });
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
                    className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Download className="w-6 h-6 text-blue-400" />
                            <h3 className="text-xl font-bold text-white">Get Syllabus & Course Details</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Download className="w-8 h-8 text-green-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Request Submitted!</h4>
                            <p className="text-slate-300 mb-4">
                                We'll send you the detailed syllabus and course information within 24 hours.
                            </p>
                            <p className="text-sm text-slate-400">
                                This window will close automatically...
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Description */}
                            <div className="mb-6">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Get the complete syllabus, course outline, and training details for 
                                    <span className="font-semibold text-blue-400"> {courseTitle}</span>. 
                                    Our team will also reach out to discuss your learning goals and answer any questions.
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
                                        placeholder="Enter your email address"
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
                                        placeholder="Enter your phone number"
                                    />
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
                                        <option value="both">Both Defensive & Offensive</option>
                                        <option value="general">General Inquiry</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-slate-700">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Submitting...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Download className="w-5 h-5" />
                                                Get Syllabus & Details
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-xs text-slate-400 mt-4 text-center">
                                We respect your privacy. Your information will only be used to send course details and updates.
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}