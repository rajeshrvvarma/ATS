import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
// Corrected the import path to use the '@' alias for the 'src' directory.
import { callGeminiAPI } from '@/api/gemini.js';

export default function AiFaqBot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef();
    const messagesEndRef = useRef(null);

    // Effect to add the initial greeting message when the bot opens
    useEffect(() => {
        if (isOpen) {
            setMessages([{
                sender: 'ai',
                text: "Hello! I'm the Agnidhra AI Advisor. Ask me anything about our Cyber Security courses, career paths, or prerequisites."
            }]);
        }
    }, [isOpen]);

    // Effect to auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Effect to handle clicks outside the modal to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [modalRef, onClose]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // System prompt to guide the AI's behavior
        const systemPrompt = `You are a friendly and helpful AI admissions advisor for a training institute named Agnidhra Technologies. Your sole purpose is to answer questions about their Cyber Security courses (both SOC Analyst and Ethical Hacking paths), trainers, curriculum, career prospects, and prerequisites.
        - Be encouraging and clear in your answers.
        - If a question is off-topic (e.g., about politics, weather, or other random subjects), politely state that you can only answer questions about Agnidhra Technologies' Cyber Security programs and redirect the conversation back to that topic.
        - Do not invent information. If you don't know an answer, say so and suggest they use the contact form on the website.
        - Keep your answers concise and easy to understand for beginners.`;

        const responseText = await callGeminiAPI(input, systemPrompt);
        
        const aiMessage = { sender: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-end z-50 p-4 md:p-6">
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md h-[70vh] flex flex-col transform transition-all duration-300 ease-out translate-y-0 opacity-100">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Bot className="text-sky-400 w-7 h-7" />
                        <h2 className="text-lg font-bold text-white">AI Admissions Advisor</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <Bot className="w-6 h-6 text-slate-400 flex-shrink-0" />}
                            <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 text-white ${msg.sender === 'user' ? 'bg-sky-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <Bot className="w-6 h-6 text-slate-400 flex-shrink-0" />
                            <div className="bg-slate-700 rounded-lg px-4 py-3">
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about a course..."
                            className="w-full bg-slate-900 border border-slate-600 rounded-full py-2 pl-4 pr-12 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

