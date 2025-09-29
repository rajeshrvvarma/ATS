import React from 'react';
import { Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer({ onNavigate }) {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="flex justify-center items-center mb-4">
                    <img src="https://i.imgur.com/8f2KqVv.png" alt="Agnidhra Technologies Logo" className="w-10 h-10 rounded-full mr-3"/>
                    <span className="text-xl font-bold text-white">Agnidhra Technologies</span>
                </div>
                <p className="max-w-2xl mx-auto mb-6">Empowering the next wave of tech leaders with practical, hands-on training.</p>
                <div className="flex justify-center space-x-6 mb-8">
                    <a href="#" className="hover:text-sky-400 transition-colors"><Linkedin size={24} /></a>
                    <a href="#" className="hover:text-sky-400 transition-colors"><Youtube size={24} /></a>
                    <a href="#" className="hover:text-sky-400 transition-colors"><Instagram size={24} /></a>
                </div>
                 <div className="flex justify-center space-x-6 mb-8">
                    <button onClick={() => onNavigate('terms')} className="hover:text-sky-400 transition-colors">Terms & Conditions</button>
                    <span className="text-slate-600">|</span>
                    <button onClick={() => onNavigate('disclaimer')} className="hover:text-sky-400 transition-colors">Disclaimer</button>
                </div>
                <p>&copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

