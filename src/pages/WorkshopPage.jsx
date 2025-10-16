import React, { useState } from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { sendEnrollmentInquiry } from '@/services/netlifyFormsService.js';

export default function FreeWorkshopPage({ onNavigate }) {
    const [formData, setFormData] = useState({ name: '', email: '' });
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
            const res = await sendEnrollmentInquiry({
                name: formData.name,
                email: formData.email,
                course: 'free-workshop',
                source: 'workshop-page'
            });
            if (res.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                throw new Error(res.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Workshop registration failed:', err);
            alert('Could not submit. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="bg-gradient-sky text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                 <button onClick={() => onNavigate('home')} className="flex items-center text-white hover:text-sky-200 transition-colors mb-8">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to All Programs
                </button>
                <SectionTitle>Free Introductory Workshop</SectionTitle>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-slate-300 space-y-4">
                        <h3 className="text-2xl font-bold text-white">Unlock Your Career in Cyber Security</h3>
                        <p>Join our live, 1-hour introductory workshop to get a comprehensive overview of the Cyber Security landscape. This session is perfect for beginners and anyone curious about a career in this exciting field.</p>
                        <h4 className="text-xl font-semibold text-white pt-4">What You'll Learn:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>The key differences between Defensive (SOC) and Offensive (Ethical Hacking) security.</span></li>
                            <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>A day in the life of a security professional.</span></li>
                            <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>Essential skills and career paths for both domains.</span></li>
                            <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>Live Q&A session with our expert trainers.</span></li>
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                         <h3 className="text-2xl font-bold text-white mb-6 text-center">Register Now</h3>
                         {submitted && (
                           <div className="mb-4 p-3 rounded bg-green-900/30 border border-green-700 text-green-200 text-sm">
                             Thank you! Your registration has been received.
                           </div>
                         )}
                         <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="ws-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input type="text" id="ws-name" name="name" required value={formData.name} onChange={handleChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" />
                            </div>
                            <div>
                                <label htmlFor="ws-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                <input type="email" id="ws-email" name="email" required value={formData.email} onChange={handleChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50">
                                {submitting ? 'Submitting...' : 'Claim Your Spot'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

