import React, { useState, useEffect } from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer({ onNavigate, currentPage }) {
    const [visitorCount, setVisitorCount] = useState('...');

    useEffect(() => {
        // Fetches the visitor count from a free counter API
        fetch('https://api.countapi.xyz/hit/agnidhra-technologies-website/visits')
            .then(response => response.json())
            .then(data => {
                setVisitorCount(data.value);
            })
            .catch(() => {
                setVisitorCount('N/A');
            });
    }, []);

    const handleScrollToSection = (sectionId) => {
        if (currentPage !== 'home') {
            onNavigate('home');
            // Wait for the home page to render before scrolling
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    {/* Column 1 & 2: About Section */}
                    <div className="md:col-span-2">
                        <div className="flex justify-center md:justify-start items-center mb-4">
                            <img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-10 h-10 rounded-full mr-3"/>
                            <span className="text-xl font-bold text-white">Agnidhra Technologies</span>
                        </div>
                        <p className="max-w-md mx-auto md:mx-0">Empowering the next wave of tech leaders with practical, hands-on training in high-demand skills.</p>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => handleScrollToSection('about')} className="hover:text-sky-400 transition-colors">About Us</button></li>
                            <li><button onClick={() => handleScrollToSection('offerings')} className="hover:text-sky-400 transition-colors">Our Offerings</button></li>
                            <li><button onClick={() => handleScrollToSection('faq')} className="hover:text-sky-400 transition-colors">FAQ</button></li>
                            <li><button onClick={() => handleScrollToSection('contact')} className="hover:text-sky-400 transition-colors">Contact</button></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-4">Connect</h4>
                        <ul className="space-y-2 mb-6">
                             <li><button onClick={() => onNavigate('terms')} className="hover:text-sky-400 transition-colors">Terms & Conditions</button></li>
                             <li><button onClick={() => onNavigate('disclaimer')} className="hover:text-sky-400 transition-colors">Disclaimer</button></li>
                        </ul>
                        <div className="flex justify-center md:justify-start space-x-4">
                             <a href="https://www.linkedin.com/company/agnidhra-technologies/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors" aria-label="LinkedIn"><Linkedin size={24} /></a>
                             <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors" aria-label="YouTube"><Youtube size={24} /></a>
                             <a href="https://www.instagram.com/agnidhra_technologies/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors" aria-label="Instagram"><Instagram size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section with Copyright and Counter */}
                <div className="mt-8 border-t border-slate-700 pt-8 text-center text-slate-500">
                    <div className="mb-4 text-sm">
                        Site Visits: <span className="font-bold text-white">{visitorCount}</span>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

