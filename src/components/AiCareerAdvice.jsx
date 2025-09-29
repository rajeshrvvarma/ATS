import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import { callGeminiAPI } from '../api/gemini';

export default function AiCareerAdvisor({ isOpen, onClose }) {
    const [interests, setInterests] = useState('');
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) { onClose(); }};
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const getAdvice = async () => {
        if (!interests.trim()) return;
        setIsLoading(true); setAdvice('');
        const systemPrompt = "You are a friendly career advisor for Agnidhra Technologies. Based on a student's interests, recommend either the 'Defensive Security (SOC Analyst)' or 'Offensive Security (Ethical Hacking)' path. Briefly explain why their interests align with your recommendation. Keep the tone supportive and the response concise (2-3 paragraphs).";
        const userPrompt = `My interests are: ${interests}`;
        const generatedAdvice = await callGeminiAPI(userPrompt, systemPrompt);
        setAdvice(generatedAdvice); setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                <div className="flex items-center gap-3 mb-4"><Sparkles className="text-sky-400 w-8 h-8" /><h2 className="text-2xl font-bold text-white">AI Career Advisor</h2></div>
                <p className="text-slate-300 mb-4">Describe your interests, and our AI advisor will suggest a path!</p>
                <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., 'I enjoy solving puzzles and finding weaknesses in systems' or 'I want to protect companies from hackers.'" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 h-24 resize-none" disabled={isLoading} />
                <button onClick={getAdvice} disabled={isLoading || !interests.trim()} className="mt-4 w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">{isLoading ? '✨ Thinking...' : 'Get Advice'}</button>
                {advice && (<div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700"><p className="text-white whitespace-pre-wrap">{advice}</p></div>)}
            </div>
        </div>
    );
}

