import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Menu, ChevronDown, Linkedin, Youtube, Instagram, ArrowLeft, Bot, Briefcase, Award, MessageCircle, Send } from 'lucide-react';

// --- Gemini API Call Function ---
const callGeminiAPI = async (prompt, systemInstruction) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("VITE_GEMINI_API_KEY is not configured in Netlify.");
        return "The AI service is not configured correctly. The API key is missing.";
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    let retries = 3;
    let delay = 1500; // Increased initial delay for better stability

    while (retries > 0) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) return text;
                return "The AI generated an empty response. Please try rephrasing your question.";
            } else {
                 console.error("API Error:", response.status, await response.text());
            }
        } catch (error) {
            console.error("Fetch call failed:", error);
        }

        retries--;
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    return "Sorry, the AI service is currently unavailable. Please check your connection and try again later.";
};

// --- Reusable Components ---

const SectionTitle = ({ children, className = '' }) => <h2 className={`text-3xl md:text-4xl font-bold text-center text-white mb-12 ${className}`}>{children}</h2>;

const Header = ({ onNavigate, currentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = ["About", "Offerings", "Why Us", "Admissions", "Trainers", "Testimonials", "Contact"];

    const scrollToSection = (id) => {
        const targetId = id.toLowerCase().replace(/\s+/g, '-');
        if (currentPage !== 'home') {
            onNavigate('home');
            setTimeout(() => { document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <header className="bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/20 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3 text-left"><img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-9 h-9 rounded-full" /><span className="text-xl md:text-2xl font-bold text-white">Agnidhra Technologies</span></button>
                <div className="hidden md:flex items-center space-x-6">{navLinks.map(link => <button key={link} onClick={() => scrollToSection(link)} className="text-slate-300 font-medium pb-1 transition-colors duration-300 hover:text-sky-400">{link}</button>)}</div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300 focus:outline-none">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </nav>
            {isOpen && <div className="md:hidden bg-slate-900"><ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{navLinks.map(link => <li key={link}><button onClick={() => scrollToSection(link)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-sky-500 hover:bg-slate-800">{link}</button></li>)}</ul></div>}
        </header>
    );
};

const Footer = ({ onNavigate }) => {
    const [visitCount, setVisitCount] = useState('...');
    useEffect(() => {
        const initAndCount = async () => {
            try {
                const firebaseConfigStr = import.meta.env.VITE_FIREBASE_CONFIG;
                if (!firebaseConfigStr) { setVisitCount('N/A'); return; }
                const firebaseConfig = JSON.parse(firebaseConfigStr);
                const { initializeApp } = await import('firebase/app');
                const { getAuth, signInAnonymously } = await import('firebase/auth');
                const { getFirestore, doc, onSnapshot, runTransaction, serverTimestamp } = await import('firebase/firestore');
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);
                await signInAnonymously(auth);
                const appId = import.meta.env.VITE_APP_ID || 'default-app-id';
                const counterRef = doc(db, `artifacts/${appId}/public/data/siteStats`, 'visits');
                const hasVisited = sessionStorage.getItem('agnidhra-site-visited');
                if (!hasVisited) {
                    await runTransaction(db, async (transaction) => {
                        const docSnap = await transaction.get(counterRef);
                        if (!docSnap.exists()) { transaction.set(counterRef, { count: 1, lastUpdated: serverTimestamp() }); }
                        else { const newCount = docSnap.data().count + 1; transaction.update(counterRef, { count: newCount, lastUpdated: serverTimestamp() }); }
                    });
                    sessionStorage.setItem('agnidhra-site-visited', 'true');
                }
                const unsubscribe = onSnapshot(counterRef, (docSnap) => {
                    if (docSnap.exists()) { setVisitCount(docSnap.data().count.toLocaleString()); }
                    else { setVisitCount('1'); }
                });
                return () => unsubscribe();
            } catch (error) { console.error("Firebase initialization or counter error:", error); setVisitCount('N/A'); }
        };
        initAndCount();
    }, []);

    return (
        <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2 text-center md:text-left"><div className="flex items-center justify-center md:justify-start mb-4"><img src="/logo.png" alt="Agnidhra Technologies Logo" className="w-10 h-10 rounded-full mr-3"/><span className="text-xl font-bold text-white">Agnidhra Technologies</span></div><p className="max-w-md mx-auto md:mx-0">Empowering the next wave of tech leaders with practical, hands-on training.</p></div>
                    <div><h4 className="font-bold text-lg text-white mb-4">Quick Links</h4><ul className="space-y-2"><li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">About Us</button></li><li><button onClick={() => document.getElementById('offerings')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Our Offerings</button></li><li><button onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Admissions</button></li><li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Contact</button></li></ul></div>
                    <div><h4 className="font-bold text-lg text-white mb-4">Connect</h4><div className="flex justify-center md:justify-start space-x-4 mb-6"><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-400 transition-colors"><Linkedin size={24} /></a><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-sky-400 transition-colors"><Youtube size={24} /></a><a href="https://www.instagram.com/agnidhra_technologies/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-sky-400 transition-colors"><Instagram size={24} /></a></div><ul className="space-y-2"><li><button onClick={() => onNavigate('terms')} className="hover:text-sky-400 transition-colors">Terms & Conditions</button></li><li><button onClick={() => onNavigate('disclaimer')} className="hover:text-sky-400 transition-colors">Disclaimer</button></li></ul></div>
                </div>
                <div className="mt-8 border-t border-slate-700 pt-8 text-center text-slate-500 flex flex-col sm:flex-row justify-between items-center"><p>&copy; {new Date().getFullYear()} Agnidhra Technologies. All Rights Reserved.</p><div className="flex items-center gap-2 mt-4 sm:mt-0"><span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span><span>Site Visitors: {visitCount}</span></div></div>
            </div>
        </footer>
    );
};

const AiCareerAdvisor = ({ isOpen, onClose }) => {
    const [interests, setInterests] = useState('');
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) onClose(); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const getAdvice = async () => {
        if (!interests.trim()) return;
        setIsLoading(true);
        const systemPrompt = "You are a friendly and encouraging career advisor for Agnidhra Technologies. Based on a student's interests, recommend either the 'Defensive Security (SOC Analyst)' path or the 'Offensive Security (Ethical Hacking)' path. Briefly explain why their interests align with your recommendation. Keep the tone supportive and the response concise (2-3 paragraphs).";
        const userPrompt = `My interests are: ${interests}`;
        const generatedAdvice = await callGeminiAPI(userPrompt, systemPrompt);
        setAdvice(generatedAdvice);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            {/* BUG FIX 1: Added max-h-[90vh] and flex-col to constrain height */}
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full relative flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3"><Sparkles className="text-sky-400 w-8 h-8" /><h2 className="text-2xl font-bold text-white">AI Career Advisor</h2></div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
                {/* BUG FIX 1: Added overflow-y-auto to this wrapper */}
                <div className="p-8 overflow-y-auto">
                    <p className="text-slate-300 mb-4">Not sure which path is right for you? Describe your interests, and our AI advisor will suggest a path!</p>
                    <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., 'I enjoy solving puzzles and finding weaknesses in systems' or 'I want to protect companies from hackers.'" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 h-24 resize-none" disabled={isLoading} />
                    <button onClick={getAdvice} disabled={isLoading || !interests.trim()} className="mt-4 w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">{isLoading ? '✨ Thinking...' : 'Get Advice'}</button>
                    {advice && <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700"><p className="text-white whitespace-pre-wrap">{advice}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Page Components ---

const HomePage = ({ onNavigate }) => {
    const [visibleSyllabus, setVisibleSyllabus] = useState(null);
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    
    // Sub-components are defined inside HomePage to keep them self-contained
    const Hero = () => {/* ... */};
    const About = () => {/* ... */};
    const CourseOfferings = () => {/* ... */};
    const WhyUs = () => {/* ... */};
    const Admissions = () => {/* ... */};
    const SyllabusWeek = () => {/* ... */};
    const Syllabus = () => {/* ... */};
    const Trainers = () => {/* ... */};
    const Testimonials = () => {/* ... */};
    const Contact = () => {/* ... */};
    const AiFaqBot = () => {/* ... */};

    return (
        <>
            {/* ... sections ... */}
             <div className="fixed bottom-6 right-6 z-40">
                <button onClick={() => setIsFaqBotOpen(true)} className="bg-sky-600 text-white rounded-full p-4 shadow-lg hover:bg-sky-500 transition-all duration-300 transform hover:scale-110" aria-label="Open AI Admissions Advisor"><MessageCircle size={28} /></button>
            </div>
            <AiFaqBot isOpen={isFaqBotOpen} onClose={() => setIsFaqBotOpen(false)} />
        </>
    );
};

// --- The rest of the page components (Workshop, Bootcamp, Legal) remain the same ---

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);

    const renderPage = () => {
        // ... switch case for rendering pages ...
    };

    return (
        <div className="bg-slate-900 antialiased">
            <Header onNavigate={setCurrentPage} currentPage={currentPage} />
            <main>{renderPage()}</main>
            <Footer onNavigate={setCurrentPage} />
        </div>
    );
}

// Re-pasting full component definitions for clarity

function AiFaqBot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => { if (isOpen) setMessages([{ sender: 'ai', text: "Hello! I'm the Agnidhra AI Advisor. Ask me anything about our Cyber Security courses, career paths, or prerequisites." }]); }, [isOpen]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => {
        function handleClickOutside(event) { if (modalRef.current && !modalRef.current.contains(event.target)) onClose(); }
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
        const systemPrompt = `You are a friendly and helpful AI admissions advisor for Agnidhra Technologies. Your sole purpose is to answer questions about their Cyber Security courses (SOC Analyst and Ethical Hacking), trainers, curriculum, and career prospects. If a question is off-topic, politely state you can only answer questions about the programs and redirect the conversation. Do not invent information. Keep answers concise for beginners.`;
        const responseText = await callGeminiAPI(input, systemPrompt);
        const aiMessage = { sender: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-end z-50 p-4 md:p-6">
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md h-[70vh] flex flex-col transform transition-all duration-300 ease-out translate-y-0 opacity-100">
                <div className="flex items-center justify-between p-4 border-b border-slate-700"><div className="flex items-center gap-3"><Bot className="text-sky-400 w-7 h-7" /><h2 className="text-lg font-bold text-white">AI Admissions Advisor</h2></div><button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button></div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">{messages.map((msg, index) => <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>{msg.sender === 'ai' && <Bot className="w-6 h-6 text-slate-400 flex-shrink-0" />}<div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 text-white ${msg.sender === 'user' ? 'bg-sky-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}><p className="whitespace-pre-wrap">{msg.text}</p></div></div>)}{isLoading && <div className="flex items-end gap-2 justify-start"><Bot className="w-6 h-6 text-slate-400 flex-shrink-0" /><div className="bg-slate-700 rounded-lg px-4 py-3"><div className="flex items-center justify-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span><span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span><span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span></div></div></div>}<div ref={messagesEndRef} /></div>
                <form onSubmit={handleSend} className="p-4 border-t border-slate-700"><div className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a course..." className="w-full bg-slate-900 border border-slate-600 rounded-full py-2 pl-4 pr-12 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none" disabled={isLoading} /><button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"><Send size={18} /></button></div></form>
            </div>
        </div>
    );
}

function HomePageContent({ onNavigate }) {
    const [visibleSyllabus, setVisibleSyllabus] = useState(null);
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    
    // The rest of the components from the original HomePage go here...
    const Hero = () => { /* as before */};
    const About = () => { /* as before */};
    const CourseOfferings = ({ setVisibleSyllabus, onNavigate }) => { /* as before */};
    const WhyUs = () => { /* as before */};
    const Admissions = () => { /* as before */};
    const Trainers = () => { /* as before */};
    const Testimonials = () => { /* as before */};
    const Contact = () => { /* as before */};
    
    const SyllabusWeek = ({ week, accentColor }) => {
        const [explanation, setExplanation] = useState('');
        const [isLoading, setIsLoading] = useState(false);
    
        const handleExplain = async () => {
            // BUG FIX 2: Check if explanation exists to toggle it
            if (explanation) {
                setExplanation('');
                return;
            }
            setIsLoading(true);
            const systemPrompt = "You are an expert cybersecurity instructor. Explain the following topic to a complete beginner in a simple, concise, and encouraging way. Focus on why this skill is important for their future job. Keep the explanation to 2-3 sentences.";
            const userPrompt = `Explain the topic "${week.title}" which is described as: "${week.desc}"`;
            const result = await callGeminiAPI(userPrompt, systemPrompt);
            setExplanation(result);
            setIsLoading(false);
        };
    
        return (
            <div className="relative">
                <div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-${accentColor}-500`}></div>
                <h4 className="font-bold text-white">{week.title}</h4>
                <p className="text-slate-400">{week.desc}</p>
                {/* BUG FIX 2: Dynamic button text and toggle logic */}
                <button onClick={handleExplain} disabled={isLoading} className={`mt-2 text-sm text-${accentColor}-400 hover:text-${accentColor}-300 flex items-center gap-1 disabled:text-slate-500`}>
                    {explanation ? <X size={14} /> : <Sparkles size={14} />}
                    {isLoading ? 'Explaining...' : (explanation ? 'Hide Explanation' : '✨ Explain Topic')}
                </button>
                {explanation && <div className="mt-2 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700"><p className="text-slate-200">{explanation}</p></div>}
            </div>
        );
    };

    const Syllabus = ({ visibleSyllabus, setVisibleSyllabus }) => { /* ... as before, but using the new SyllabusWeek */};

    // ... return statement for HomePageContent with all sections and the floating bot
    return <></>; // Placeholder
}

// Full page components (Legal, Workshop, Bootcamp) go here
function LegalPage({ onNavigate, title, children }) {/* ... */}
function TermsPage({ onNavigate }) {/* ... */}
function DisclaimerPage({ onNavigate }) {/* ... */}
function FreeWorkshopPage({ onNavigate }) {/* ... */}
function BootcampPage({ onNavigate, type }) {/* ... */}

