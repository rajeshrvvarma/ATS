import React, { useState } from 'react';
import { X, Menu, ChevronDown, Sun, Moon, Home, Shield, Sword, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useSettings } from '@/context/SettingsContext.jsx';

export default function Header({ onNavigate, currentPage }) {
    const { theme, toggleTheme } = useTheme();
    const { toggleOpen } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [showMega, setShowMega] = useState(false);

    // Global shortcut: press "s" to open Settings
    React.useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                toggleOpen();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggleOpen]);
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
                
                {/* Desktop Navigation with center mega menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex-1 flex justify-end">
                        <button onClick={() => onNavigate('defensiveBootcamp')} className="text-slate-300 hover:text-blue-400">Defensive</button>
                    </div>
                    <div className="relative">
                        <button
                          onMouseEnter={() => setShowMega(true)}
                          onMouseLeave={() => setShowMega(false)}
                          onClick={() => setShowMega(v=>!v)}
                          className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700"
                          title="Home & Programs"
                        >
                          <Home size={20} />
                        </button>
                        <AnimatePresence>
                        {showMega && (
                          <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18 }} onMouseEnter={()=>setShowMega(true)} onMouseLeave={()=>setShowMega(false)} className="absolute left-1/2 -translate-x-1/2 mt-4 w-[680px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Defensive</div>
                              <div className="space-y-2">
                                <button onClick={() => { setShowMega(false); onNavigate('defensiveBootcamp'); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">7‑Day Bootcamp</button>
                                <button onClick={() => { setShowMega(false); window.location.hash = ''; scrollToSection('Offerings'); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">2‑Month Program</button>
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Sword className="w-4 h-4"/> Offensive</div>
                              <div className="space-y-2">
                                <button onClick={() => { setShowMega(false); onNavigate('offensiveBootcamp'); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">7‑Day Bootcamp</button>
                                <button onClick={() => { setShowMega(false); scrollToSection('Offerings'); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">2‑Month Program</button>
                              </div>
                            </div>
                            <div className="col-span-2 border-t border-slate-700 pt-4">
                              <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Specialized Courses</div>
                              <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => { setShowMega(false); onNavigate('workshop'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">Free Intro Workshop</button>
                                <button onClick={() => { setShowMega(false); onNavigate('video-learning'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">Video Learning</button>
                                <button onClick={() => { setShowMega(false); onNavigate('enroll'); }} className="text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">Admissions</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <div className="flex-1 flex justify-start">
                        <button onClick={() => onNavigate('offensiveBootcamp')} className="text-slate-300 hover:text-blue-400">Offensive</button>
                    </div>
                    <button onClick={() => onNavigate('enroll')} className="btn-primary px-4 py-2">Enroll</button>
                    <button onClick={toggleTheme} className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700" title="Toggle theme">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={toggleOpen} className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700" title="Settings">⚙</button>
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

