import React, { useState, useEffect } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';
// Removed framer-motion to eliminate footer animations

export default function Footer({ onNavigate }) {
    const [visitCount, setVisitCount] = useState('...');

    useEffect(() => {
        // Simple local visit counter using localStorage
        const initLocalCounter = () => {
            try {
                const storageKey = 'agnidhra-site-visits';
                const sessionKey = 'agnidhra-session-visited';

                // Check if this session has already been counted
                const hasVisitedThisSession = sessionStorage.getItem(sessionKey);

                if (!hasVisitedThisSession) {
                    // Get current count or initialize to 0
                    const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
                    const newCount = currentCount + 1;

                    // Update count
                    localStorage.setItem(storageKey, newCount.toString());
                    sessionStorage.setItem(sessionKey, 'true');

                    console.log('Visit counter: New visit recorded');
                }

                // Display current count
                const totalVisits = parseInt(localStorage.getItem(storageKey) || '1', 10);
                setVisitCount(totalVisits.toLocaleString());

            } catch (error) {
                console.warn('Visit counter error:', error.message);
                setVisitCount('1,000+'); // Fallback display
            }
        };

        initLocalCounter();
    }, []);

    return (
        <footer className="text-slate-200 py-16 relative bg-slate-900 border-t border-slate-800">

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: About Us */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
                            ABOUT AGNIDHRA
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors duration-200 text-left">About Us</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors duration-200 text-left">Our Mission</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors duration-200 text-left">Our Team</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors duration-200 text-left">Contact Us</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors duration-200 text-left">Career Opportunities</button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Cybersecurity Programs */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-purple-500 mr-3"></div>
                            CYBERSECURITY ACADEMY
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors duration-200 text-left">Defensive Security Professional</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors duration-200 text-left">Offensive Security Mastery</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors duration-200 text-left">MultiCloud DevOps Mastery</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('events-batches')} className="hover:text-blue-400 transition-colors duration-200 text-left">SOC Analyst Bootcamp</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors duration-200 text-left">Specialized Add-ons</button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Technology Institute */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-green-500 mr-3"></div>
                            TECHNOLOGY INSTITUTE
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('technologyTraining')} className="hover:text-blue-400 transition-colors duration-200 text-left">Full Stack Development</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('technologyTraining')} className="hover:text-blue-400 transition-colors duration-200 text-left">Cloud & DevOps</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('technologyTraining')} className="hover:text-blue-400 transition-colors duration-200 text-left">AI & Data Science</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('technologyTraining')} className="hover:text-blue-400 transition-colors duration-200 text-left">Software Testing</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('technologyTraining')} className="hover:text-blue-400 transition-colors duration-200 text-left">Mobile Development</button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Support & Legal */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 flex items-center">
                            <div className="w-1 h-6 bg-orange-500 mr-3"></div>
                            SUPPORT & POLICIES
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => onNavigate('video-learning')} className="hover:text-blue-400 transition-colors duration-200 text-left">Learning Portal</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 transition-colors duration-200 text-left">Terms & Conditions</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 transition-colors duration-200 text-left">Privacy Policy</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('cancellationRefund')} className="hover:text-blue-400 transition-colors duration-200 text-left">Refund Policy</button>
                            </li>
                            <li>
                                <button onClick={() => onNavigate('disclaimer')} className="hover:text-blue-400 transition-colors duration-200 text-left">Disclaimer</button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Centered Company Logo & Branding */}
                <div className="border-t border-slate-700 pt-8 pb-4">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                                <img src="/logo.png" alt="AT Logo" className="w-10 h-10 rounded-full"/>
                            </div>
                            <span className="text-2xl font-bold text-white">Agnidhra Technologies</span>
                        </div>
                        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Empowering careers through professional cybersecurity and technology training.
                            Building tomorrow is digital defenders and innovators.
                        </p>
                    </div>

                    {/* Social Links & Site Stats */}
                    <div className="text-center">
                        {/* Social Links - Centered */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <a
                                href="https://www.linkedin.com/company/agnidhra-technologies"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                            >
                                <Linkedin size={16} />
                            </a>
                            <a
                                href="https://www.youtube.com/@agnidhra-technologies"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                            >
                                <Youtube size={16} />
                            </a>
                            <a
                                href="https://www.instagram.com/agnidhra_technologies/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                            >
                                <Instagram size={16} />
                            </a>
                        </div>

                        {/* Bottom Row: Copyright Left, Visitors Right */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                            {/* Left: Copyright */}
                            <p className="text-slate-500">
                                All Rights Reserved Agnidhra Technologies India Pvt. Ltd.
                            </p>

                            {/* Right: Site Visitors */}
                            <div className="flex items-center gap-2 text-slate-500">
                                <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span>Site Visitors: {visitCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Footer Note */}
                    <div className="text-center mt-4 pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-600">
                            *Note: The certification names and logos are the trademarks of their respective owners.{' '}
                            <button onClick={() => onNavigate('disclaimer')} className="hover:text-blue-400 transition-colors duration-200">
                                View Disclaimer
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

