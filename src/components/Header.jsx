import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header({ onNavigate, currentPage }) {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = ["About", "Offerings", "Trainers", "Testimonials", "FAQ", "Contact"];

    const scrollToSection = (id) => {
        if (currentPage !== 'home') {
            onNavigate('home');
            setTimeout(() => {
                 document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/20 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3 text-left">
                    <img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-9 h-9 rounded-full" />
                    <span className="text-xl md:text-2xl font-bold text-white">Agnidhra Technologies</span>
                </button>
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <button key={link} onClick={() => scrollToSection(link)} className="text-slate-300 font-medium pb-1 transition-colors duration-300 hover:text-sky-400">
                            {link}
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300 focus:outline-none">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>
            {isOpen && (
                <div className="md:hidden bg-slate-900">
                    <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <li key={link}>
                                <button onClick={() => scrollToSection(link)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-sky-500 hover:bg-slate-800">
                                    {link}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}

