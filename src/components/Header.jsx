import React, { useState } from 'react';
import { X, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext.jsx';

export default function Header({ onNavigate, currentPage }) {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    // Slim navigation
    const navLinks = ["Programs", "Video Learning", "Admissions", "Contact Us", "Account"];

    const scrollToSection = (id) => {
        setActiveLink(id);
        // Handle "Contact Us" - navigate to support page
        if (id === "Contact Us") {
            onNavigate('contact');
            setIsOpen(false);
            return;
        }
        
        // Handle "Video Learning" - navigate to video learning page
        if (id === "Video Learning") {
            onNavigate('video-learning');
            setIsOpen(false);
            return;
        }

        // Handle "Dashboard" - navigate to student dashboard
        if (id === "Dashboard") {
            onNavigate('dashboard');
            setIsOpen(false);
            return;
        }

        // Account hub
        if (id === "Account") {
            onNavigate('login');
            setIsOpen(false);
            return;
        }

        // Handle "Inquiry" - scroll to contact section on homepage
        const targetId = id === "Inquiry" ? "contact" : id.toLowerCase().replace(/\s+/g, '-');
        
        // If we are not on the home page, navigate there first, then scroll
        if (currentPage !== 'home') {
            // Pass the section to scroll to via URL hash so Home can handle it after navigation
            window.location.assign(`/${'#' + targetId}`);
        } else {
            // If we are already on the home page, just scroll
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false); // Close the mobile menu after clicking a link
    };

    const isLinkActive = (link) => {
        // Map page routes to human-readable labels
        const routeMap = {
            'video-learning': 'Video Learning',
            'dashboard': 'Dashboard',
            'admin': 'Admin',
            'login': 'Login',
            'contact': 'Contact Us',
            'home': ''
        };

        // If we are on a routed page, highlight the matching nav item
        if (routeMap[currentPage] && routeMap[currentPage] === link) {
            return true;
        }

        // When on the home page, use the last selected section as active
        if (currentPage === 'home' && activeLink === link) {
            return true;
        }

        return false;
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/20 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3 text-left">
                    <img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-9 h-9 rounded-full" />
                    <span className="text-xl md:text-2xl font-bold text-white">Agnidhra Technologies</span>
                </button>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Programs dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                            onMouseEnter={() => setIsProgramsOpen(true)}
                            onMouseLeave={() => setIsProgramsOpen(false)}
                            className={`font-medium pb-1 transition-colors duration-300 ${isProgramsOpen ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}
                        >
                            <span className="inline-flex items-center gap-1">Programs <ChevronDown size={16} /></span>
                        </button>
                        {isProgramsOpen && (
                            <div onMouseEnter={() => setIsProgramsOpen(true)} onMouseLeave={() => setIsProgramsOpen(false)} className="absolute left-0 mt-3 w-[360px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 grid grid-cols-1 gap-1">
                                <div className="px-3 py-2 text-slate-400 text-xs uppercase">Defensive (SOC)</div>
                                <button onClick={() => { setIsProgramsOpen(false); onNavigate('defensiveBootcamp'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">7‑Day Bootcamp</button>
                                <button onClick={() => { setIsProgramsOpen(false); window.location.hash = ''; scrollToSection('Offerings'); setTimeout(()=>document.getElementById('offerings')?.scrollIntoView({behavior:'smooth'}),50); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">2‑Month Program</button>
                                <div className="px-3 py-2 text-slate-400 text-xs uppercase mt-1">Offensive (Ethical Hacking)</div>
                                <button onClick={() => { setIsProgramsOpen(false); onNavigate('offensiveBootcamp'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">7‑Day Bootcamp</button>
                                <button onClick={() => { setIsProgramsOpen(false); scrollToSection('Offerings'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">2‑Month Program</button>
                                <div className="border-t border-slate-700 mt-2"></div>
                                <button onClick={() => { setIsProgramsOpen(false); onNavigate('workshop'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">Free Intro Workshop</button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => scrollToSection('Video Learning')} className={`font-medium pb-1 transition-colors ${isLinkActive('Video Learning') ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-300 hover:text-blue-400'}`}>Video Learning</button>
                    <button onClick={() => scrollToSection('Admissions')} className={`font-medium pb-1 transition-colors ${isLinkActive('Admissions') ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-300 hover:text-blue-400'}`}>Admissions</button>
                    <button onClick={() => scrollToSection('Contact Us')} className={`font-medium pb-1 transition-colors ${isLinkActive('Contact Us') ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-300 hover:text-blue-400'}`}>Contact</button>
                    <button onClick={() => scrollToSection('Account')} className={`font-medium pb-1 transition-colors ${isLinkActive('Account') ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-300 hover:text-blue-400'}`}>Account</button>
                    <button onClick={() => onNavigate('enroll')} className="btn-primary px-4 py-2">Enroll</button>
                    <button onClick={toggleTheme} className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700" title="Toggle theme">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
                
                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300 focus:outline-none">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900">
                    <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <li>
                            <button onClick={() => scrollToSection('Programs')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800">Programs</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('Video Learning')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800">Video Learning</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('Admissions')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800">Admissions</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('Contact Us')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800">Contact</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('Account')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-500 hover:bg-slate-800">Account</button>
                        </li>
                        <li>
                            <button onClick={() => { setIsOpen(false); onNavigate('enroll'); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600">Enroll</button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

