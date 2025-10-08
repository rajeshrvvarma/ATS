import React from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import AnimatedBackground from '@/components/AnimatedBackground.jsx';

export default function FreeWorkshopPage({ onNavigate }) {
    return (
        <AnimatedBackground variant="workshop" className="text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                 <button onClick={() => onNavigate('home')} className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8">
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
                         <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-4">
                            <input type="hidden" name="_subject" value="New FREE WORKSHOP Registration!" />
                            <div>
                                <label htmlFor="ws-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                <input type="text" id="ws-name" name="name" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" />
                            </div>
                            <div>
                                <label htmlFor="ws-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                <input type="email" id="ws-email" name="email" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" />
                            </div>
                            <button type="submit" className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-300">
                                Claim Your Spot
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}

