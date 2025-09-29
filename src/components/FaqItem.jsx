import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-semibold text-white">{question}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-sky-400`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                <p className="text-slate-400">{answer}</p>
            </div>
        </div>
    );
}

