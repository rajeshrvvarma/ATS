import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';

export default function Header({ onNavigate, currentPage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    // Updated navigation links to match the sections on the home page
    const navLinks = ["About", "Offerings", "Video Learning", "Dashboard", "Admin", "Login", "Specialized Trainings","Why Us", "Admissions", "Trainers", "Testimonials", "Inquiry", "Contact Us"];

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

        // Handle "Admin" - navigate to admin panel
        if (id === "Admin") {
            onNavigate('admin');
            setIsOpen(false);
            return;
        }

        // Handle "Login" - navigate to login page
        if (id === "Login") {
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
                    {navLinks.map(link => {
                        const active = isLinkActive(link);
                        const base = "font-medium pb-1 transition-colors duration-300";
                        const color = active ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-300 hover:text-blue-400";
                        return (
                            <button
                                key={link}
                                onClick={() => scrollToSection(link)}
                                className={`${base} ${color}`}
                            >
                                {link}
                            </button>
                        );
                    })}
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
                        {navLinks.map(link => {
                            const active = isLinkActive(link);
                            const color = active ? "text-blue-400 bg-slate-800" : "text-slate-300 hover:text-blue-500 hover:bg-slate-800";
                            return (
                                <li key={link}>
                                    <button onClick={() => scrollToSection(link)} className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${color}`}>
                                        {link}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </header>
    );
}

