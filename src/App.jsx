import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Menu, ChevronDown, Linkedin, Youtube, Instagram, ArrowLeft } from 'lucide-react';

// --- Gemini API Call Function ---
const callGeminiAPI = async (prompt, systemInstruction) => {
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
    };

    let response;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response right now.";
            }
        } catch (error) {
            console.error("API call failed:", error);
        }

        retries--;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
    }

    return "Sorry, the AI service is currently unavailable. Please try again later.";
};

// --- Reusable Components ---

const SectionTitle = ({ children, className = '' }) => (
    <h2 className={`text-3xl md:text-4xl font-bold text-center text-white mb-12 ${className}`}>{children}</h2>
);

const Header = ({ onNavigate, currentPage }) => {
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
                    <img src="https://i.imgur.com/8f2KqVv.png" alt="Agnidhra Technologies Logo" className="w-9 h-9 rounded-full" />
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
};

const Footer = ({ onNavigate }) => (
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

const AiCareerAdvisor = ({ isOpen, onClose }) => {
    const [interests, setInterests] = useState('');
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const getAdvice = async () => {
        if (!interests.trim()) return;
        setIsLoading(true);
        setAdvice('');

        const systemPrompt = "You are a friendly and encouraging career advisor for Agnidhra Technologies, a cybersecurity training company. A prospective student will tell you their interests. Based on their input, recommend whether they should pursue the 'Defensive Security (SOC Analyst)' path or the 'Offensive Security (Ethical Hacking)' path. Briefly explain why their interests align with your recommendation. Your goal is to guide them, not make a hard sale. Keep the tone supportive and the response concise (2-3 paragraphs).";
        const userPrompt = `My interests are: ${interests}`;

        const generatedAdvice = await callGeminiAPI(userPrompt, systemPrompt);
        setAdvice(generatedAdvice);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full relative transform transition-all duration-300 scale-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-sky-400 w-8 h-8" />
                    <h2 className="text-2xl font-bold text-white">AI Career Advisor</h2>
                </div>
                <p className="text-slate-300 mb-4">Not sure which path is right for you? Describe your interests, and our AI advisor will suggest a path!</p>
                <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., 'I enjoy solving puzzles and finding weaknesses in systems' or 'I want to protect companies from hackers.'"
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 h-24 resize-none"
                    disabled={isLoading}
                />
                <button
                    onClick={getAdvice}
                    disabled={isLoading || !interests.trim()}
                    className="mt-4 w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? '✨ Thinking...' : 'Get Advice'}
                </button>
                {advice && (
                    <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="text-white whitespace-pre-wrap">{advice}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FaqItem = ({ question, answer }) => {
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
};

// --- Page Components ---

const HomePage = ({ onNavigate }) => {
    const [visibleSyllabus, setVisibleSyllabus] = useState(null);

    // --- Sub-components for HomePage ---
    const Hero = () => {
        const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
        return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <section id="home" className="py-24 md:py-32 text-center bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center gap-4">
                        <Shield className="w-16 h-16 md:w-20 md-h-20 text-sky-400 mb-6 animate-pulse" />
                        <Code className="w-16 h-16 md:w-20 md:h-20 text-red-400 mb-6 animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        Master Offensive & Defensive Cyber Security
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                        Master in-demand skills with our expert-led, hands-on training programs designed to make you a job-ready SOC Analyst or Ethical Hacker.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button
                            onClick={() => document.getElementById('offerings')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-sky-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Programs
                        </button>
                        <button
                            onClick={() => setIsAdvisorOpen(true)}
                            className="bg-slate-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Get AI Career Advice
                        </button>
                    </div>
                </div>
            </section>
        </>
        );
    };
    
    const About = () => (
        <section id="about" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>About Agnidhra Technologies</SectionTitle>
                <div className="max-w-4xl mx-auto text-center">
                     <p className="text-lg text-slate-300">
                        In today's rapidly evolving tech landscape, theoretical knowledge is not enough. Agnidhra Technologies was founded on the principle of bridging the critical gap between academic learning and real-world industry demands. Our mission is to empower aspiring tech professionals with practical, hands-on skills that make them not just knowledgeable, but job-ready from day one. We believe in mentorship-driven education, ensuring every student receives the personalized attention needed to truly master complex subjects and build a successful career in Cyber Security.
                    </p>
                </div>
            </div>
        </section>
    );

    const CourseOfferings = ({ setVisibleSyllabus, onNavigate }) => {
        const freeWorkshop = {
            icon: Users,
            title: "Free Introductory Workshop",
            description: "A live, 1-hour session covering the landscape of Cyber Security. The perfect starting point for your journey.",
            cta: "Register for Free",
            page: "workshop",
        };

        const defensivePath = {
            title: "Defensive Security Path (SOC Analyst)",
            icon: Shield,
            courses: [
                { title: "7-Day Bootcamp", description: "An intensive week of learning core defensive skills.", features: ["OS Hardening Labs", "Intro to SIEM", "Vulnerability Scanning"], cta: "Enroll in Bootcamp", page: "defensiveBootcamp" },
                { title: "2-Month Intensive Program", description: "The complete SOC Analyst training, from fundamentals to advanced incident response.", features: ["Entire 8-week syllabus", "Capstone Project", "Interview Preparation"], cta: "Learn More", syllabus: "soc" }
            ]
        };

        const offensivePath = {
            title: "Offensive Security Path (Ethical Hacking)",
            icon: Code,
            courses: [
                { title: "7-Day Bootcamp", description: "A fast-paced introduction to the attacker's mindset.", features: ["Kali Linux Setup", "Scanning with Nmap", "Basic Exploitation"], cta: "Enroll in Bootcamp", page: "offensiveBootcamp" },
                { title: "2-Month Intensive Program", description: "Become a job-ready Ethical Hacker by mastering offensive techniques.", features: ["Advanced Exploitation", "Web & Network Hacking", "Reporting & Remediation"], cta: "Learn More", syllabus: "ethicalHacking" }
            ]
        };

        const handleSyllabusClick = (syllabus) => {
            setVisibleSyllabus(syllabus);
            setTimeout(() => document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' }), 100);
        };

        return (
            <section id="offerings" className="py-20 bg-slate-900">
                <div className="container mx-auto px-6">
                    <SectionTitle>Choose Your Cyber Security Path</SectionTitle>
                    <div className="max-w-xl mx-auto mb-16">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 flex flex-col text-center items-center hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 transform hover:-translate-y-2">
                            <freeWorkshop.icon size={32} className="mb-4 text-sky-400" />
                            <h3 className="text-2xl font-bold text-white mb-3">{freeWorkshop.title}</h3>
                            <p className="text-slate-400 mb-6">{freeWorkshop.description}</p>
                            <button onClick={() => onNavigate(freeWorkshop.page)} className="w-full max-w-xs mt-auto bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors duration-300">{freeWorkshop.cta}</button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <div className="flex flex-col space-y-8">
                            <div className="flex items-center gap-4"><defensivePath.icon size={40} className="text-sky-400" /><h3 className="text-3xl font-bold text-white">{defensivePath.title}</h3></div>
                            {defensivePath.courses.map((course, index) => (
                                <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
                                    <h4 className="text-2xl font-bold text-white mb-3">{course.title}</h4>
                                    <p className="text-slate-400 mb-6 flex-grow">{course.description}</p>
                                    <ul className="space-y-2 mb-8 text-slate-300">{course.features.map((feature, i) => <li key={i} className="flex items-center"><Target size={16} className="text-sky-400 mr-3 flex-shrink-0" /><span>{feature}</span></li>)}</ul>
                                    <button onClick={() => course.syllabus ? handleSyllabusClick(course.syllabus) : onNavigate(course.page)} className="w-full mt-auto bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors duration-300">{course.cta}</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col space-y-8">
                            <div className="flex items-center gap-4"><offensivePath.icon size={40} className="text-red-400" /><h3 className="text-3xl font-bold text-white">{offensivePath.title}</h3></div>
                            {offensivePath.courses.map((course, index) => (
                                <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 h-full">
                                    <h4 className="text-2xl font-bold text-white mb-3">{course.title}</h4>
                                    <p className="text-slate-400 mb-6 flex-grow">{course.description}</p>
                                    <ul className="space-y-2 mb-8 text-slate-300">{course.features.map((feature, i) => <li key={i} className="flex items-center"><Target size={16} className="text-red-400 mr-3 flex-shrink-0" /><span>{feature}</span></li>)}</ul>
                                    <button onClick={() => course.syllabus ? handleSyllabusClick(course.syllabus) : onNavigate(course.page)} className="w-full mt-auto bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors duration-300">{course.cta}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    };
    
    const SyllabusWeek = ({ week, accentColor }) => {
        const [explanation, setExplanation] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const handleExplain = async () => {
            setIsLoading(true);
            setExplanation('');
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
                <button onClick={handleExplain} disabled={isLoading} className={`mt-2 text-sm text-${accentColor}-400 hover:text-${accentColor}-300 flex items-center gap-1 disabled:text-slate-500`}>
                    <Sparkles size={14} />
                    {isLoading ? 'Explaining...' : '✨ Explain Topic'}
                </button>
                {explanation && (
                    <div className="mt-2 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700">
                        <p className="text-slate-200">{explanation}</p>
                    </div>
                )}
            </div>
        );
    };

    const Syllabus = ({ visibleSyllabus, setVisibleSyllabus }) => {
        const socSyllabus = { title: "SOC Analyst Program Syllabus", month1: { title: "Month 1: Cybersecurity Fundamentals & Tooling", weeks: [{ title: "Week 1: Security, Networking & OS Hardening", desc: "Combine core security principles (CIA Triad), networking (TCP/IP), and hands-on system hardening for both Windows and Linux." }, { title: "Week 2: The Attacker's Mindset & Threat Intel", desc: "Understand the Cyber Kill Chain and use the MITRE ATT&CK framework to analyze attacker tactics, techniques, and procedures (TTPs)." }, { title: "Week 3: SIEM & Log Analysis", desc: "A deep dive into Security Information and Event Management (SIEM) tools. Learn to write queries and create correlation rules to detect threats." }, { title: "Week 4: EDR & Vulnerability Management", desc: "Explore Endpoint Detection & Response (EDR) for monitoring devices and use scanners to find and prioritize system vulnerabilities." }] }, month2: { title: "Month 2: Incident Response & Career Readiness", weeks: [{ title: "Week 5: Phishing & Malware Analysis", desc: "Deconstruct phishing emails, analyze malicious headers, and use sandboxing tools to safely inspect suspicious attachments and links." }, { title: "Week 6: Introduction to Digital Forensics", desc: "Learn the principles of digital evidence collection (Chain of Custody) and use tools like Autopsy to analyze a disk image." }, { title: "Week 7: Capstone Project: SOC Analyst Simulation", desc: "Apply your skills in a real-world simulation. Investigate a queue of security alerts, document findings, and recommend remediation." }, { title: "Week 8: Career Prep & Final Review", desc: "Focus on resume building, LinkedIn optimization, and mock interviews for SOC Analyst roles. Review key concepts from the course." }] } };
        const ethicalHackingSyllabus = { title: "Ethical Hacking Program Syllabus", month1: { title: "Month 1: Foundations of Offensive Security", weeks: [{ title: "Week 1: Intro to Hacking & Kali Linux", desc: "Explore the phases of pentesting, legal frameworks, and set up your own virtual hacking lab with Kali Linux." }, { title: "Week 2: Reconnaissance & Scanning", desc: "Master passive and active reconnaissance techniques. Perform a deep dive into network scanning with Nmap." }, { title: "Week 3: Gaining Access & Enumeration", desc: "Learn system hacking, password cracking techniques, and detailed vulnerability analysis to find entry points." }, { title: "Week 4: Exploitation Fundamentals", desc: "Get hands-on with the Metasploit Framework, learn to customize payloads, and exploit common vulnerabilities." }] }, month2: { title: "Month 2: Advanced Attacks & Reporting", weeks: [{ title: "Week 5: Web Application Hacking", desc: "Exploit the OWASP Top 10 vulnerabilities, including SQL Injection, Cross-Site Scripting (XSS), and more." }, { title: "Week 6: Network Hacking & Sniffing", desc: "Dive into network-level attacks like ARP spoofing, DNS poisoning, and session hijacking to capture sensitive data." }, { title: "Week 7: Capstone Project: Live Pentest", desc: "Conduct a full penetration test from start to finish against a vulnerable, multi-system lab environment." }, { title: "Week 8: Reporting & Career Prep", desc: "Learn to write professional penetration testing reports and prepare for certifications (e.g., OSCP, CEH) and interviews." }] } };
        
        const syllabusData = visibleSyllabus === 'soc' ? socSyllabus : ethicalHackingSyllabus;
        const accentColor = visibleSyllabus === 'soc' ? 'sky' : 'red';

        if (!visibleSyllabus) return <div id="syllabus"></div>;

        return (
            <section id="syllabus" className="py-20 bg-slate-800">
                 <div className="container mx-auto px-6 relative">
                    <button onClick={() => setVisibleSyllabus(null)} className="absolute top-0 right-6 text-slate-400 hover:text-white transition-colors z-10"><X size={32} /></button>
                    <SectionTitle>{syllabusData.title}</SectionTitle>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month1.title}</h3>
                            <div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month1.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div>
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month2.title}</h3>
                            <div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month2.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div>
                        </div>
                    </div>
                    <div className="text-center mt-12"><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={`bg-${accentColor}-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-${accentColor}-700 transition-colors duration-300 transform hover:scale-105`}>Enroll in 2-Month Program</button></div>
                </div>
            </section>
        );
    };

    const Trainers = () => (
        <section id="trainers" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <SectionTitle>Meet Your Trainers</SectionTitle>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="https://placehold.co/150x150/1E293B/38BDF8?text=SK" alt="Santosh Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Santosh Kumar</h3><p className="text-sky-400 font-semibold mb-3">Lead Trainer & Founder | PSM® Certified</p><p className="text-slate-300">With 8 years of hands-on experience, Santosh's journey from QA to DevOps and now Cyber Security provides a practical, end-to-end understanding of the tech landscape.</p></div>
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="https://placehold.co/150x150/1E293B/38BDF8?text=JK" alt="Jeevan Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Jeevan Kumar</h3><p className="text-sky-400 font-semibold mb-3">Co-Trainer | SOC Certified</p><p className="text-slate-300">With 6 years of experience defending systems, Jeevan brings rich practical exposure and a systematic perspective to the security landscape.</p></div>
                </div>
            </div>
        </section>
    );

    const Testimonials = () => (
        <section id="testimonials" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>What Our Students Say</SectionTitle>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-700"><p className="text-slate-300 italic mb-6">"The project-based approach was a game-changer. I landed a job as a SOC Analyst within two months of finishing the course!"</p><div className="flex items-center"><img src="https://placehold.co/50x50/0F172A/38BDF8?text=R" alt="Rohan S." className="w-12 h-12 rounded-full mr-4"/><div><h4 className="font-bold text-white">Rohan S.</h4><p className="text-sm text-slate-400">Cyber Security Program Graduate</p></div></div></div>
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-700"><p className="text-slate-300 italic mb-6">"The focus on real-world scenarios and hands-on labs prepared me for the technical interviews. Highly recommended!"</p><div className="flex items-center"><img src="https://placehold.co/50x50/0F172A/38BDF8?text=A" alt="Anjali P." className="w-12 h-12 rounded-full mr-4"/><div><h4 className="font-bold text-white">Anjali P.</h4><p className="text-sm text-slate-400">Cyber Security Program Graduate</p></div></div></div>
                </div>
            </div>
        </section>
    );

    const FAQ = () => {
        const faqs = [{ q: "Is this course suitable for complete beginners?", a: "Absolutely. Our program starts with the fundamentals. The only prerequisite is a strong desire to learn." }, { q: "Do you provide job placement assistance?", a: "While we don't guarantee placement, our career support includes resume building, LinkedIn optimization, and extensive mock interviews." }, { q: "What is the format of the classes?", a: "Our classes are live, interactive online sessions. All sessions are recorded and provided for future reference." }];
        return (
            <section id="faq" className="py-20 bg-slate-900">
                <div className="container mx-auto px-6">
                    <SectionTitle>Frequently Asked Questions</SectionTitle>
                    <div className="max-w-3xl mx-auto space-y-4">{faqs.map((faq, i) => <FaqItem key={i} question={faq.q} answer={faq.a} />)}</div>
                </div>
            </section>
        );
    };

    const Contact = () => (
        <section id="contact" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>Get In Touch</SectionTitle>
                <div className="max-w-3xl mx-auto text-center">
                     <p className="text-lg text-slate-300 mb-8">Have a question or ready to enroll? Send us a message!</p>
                     <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="bg-slate-900 p-8 text-left space-y-6 rounded-lg border border-slate-700">
                        <input type="hidden" name="_next" value="https://www.agnidhra-technologies.com/thank-you.html" /><input type="hidden" name="_subject" value="New Cyber Security Inquiry!" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="name" name="name" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="email" name="email" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                        </div>
                        <div><label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label><textarea id="message" name="message" rows="4" required placeholder="Tell us which program you're interested in!" className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"></textarea></div>
                        <div className="text-right"><button type="submit" className="inline-block bg-sky-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-300">Send Message</button></div>
                     </form>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Hero />
            <About />
            <CourseOfferings setVisibleSyllabus={setVisibleSyllabus} onNavigate={onNavigate} />
            <Syllabus visibleSyllabus={visibleSyllabus} setVisibleSyllabus={setVisibleSyllabus} />
            <Trainers />
            <Testimonials />
            <FAQ />
            <Contact />
        </>
    );
};

const FreeWorkshopPage = ({ onNavigate }) => (
    <div className="bg-slate-900 text-white min-h-screen">
        <div className="container mx-auto px-6 py-12 md:py-20">
             <button onClick={() => onNavigate('home')} className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"><ArrowLeft size={20} className="mr-2" />Back to All Programs</button>
            <SectionTitle>Free Introductory Workshop</SectionTitle>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="text-slate-300 space-y-4">
                    <h3 className="text-2xl font-bold text-white">Unlock Your Career in Cyber Security</h3>
                    <p>Join our live, 1-hour introductory workshop to get a comprehensive overview of the Cyber Security landscape. This session is perfect for beginners and anyone curious about a career in this exciting field.</p>
                    <h4 className="text-xl font-semibold text-white pt-4">What You'll Learn:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>The key differences between Defensive (SOC) and Offensive (Ethical Hacking) security.</span></li>
                        <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>A day in the life of a security professional.</span></li>
                        <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>Essential skills and career paths for both domains.</span></li>
                        <li className="flex items-start"><Target size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" /><span>Live Q&A session with our expert trainers.</span></li>
                    </ul>
                </div>
                 <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                     <h3 className="text-2xl font-bold text-white mb-6 text-center">Register Now</h3>
                     <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-4">
                        <input type="hidden" name="_subject" value="New FREE WORKSHOP Registration!" />
                        <div><label htmlFor="ws-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="ws-name" name="name" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                        <div><label htmlFor="ws-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="ws-email" name="email" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                        <button type="submit" className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-300">Claim Your Spot</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
);

const BootcampPage = ({ onNavigate, type }) => {
    const content = {
        defensive: { title: "7-Day Defensive Security Bootcamp", subtitle: "Build a strong foundation as a SOC Analyst.", accentColor: "sky", dailyPlan: ["Networking & Security Fundamentals", "Windows OS Hardening & Security Policies", "Linux OS Hardening & SSH Security", "Intro to SIEM & Log Analysis", "Hands-on with Wireshark & Packet Analysis", "Vulnerability Scanning with Nessus", "Mini Project: Analyze a Mock Incident"] },
        offensive: { title: "7-Day Ethical Hacking Bootcamp", subtitle: "Start thinking like an attacker.", accentColor: "red", dailyPlan: ["Pentesting Methodology & Setting up Kali Linux", "Active & Passive Reconnaissance Techniques", "Network Scanning with Nmap (Advanced)", "Enumeration & Vulnerability Analysis", "Intro to Metasploit Framework", "System Hacking & Password Cracking Basics", "Mini-CTF (Capture The Flag) Challenge"] }
    };
    const current = content[type];

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <button onClick={() => onNavigate('home')} className={`flex items-center text-${current.accentColor}-400 hover:text-${current.accentColor}-300 transition-colors mb-8`}><ArrowLeft size={20} className="mr-2" />Back to All Programs</button>
                <SectionTitle>{current.title}</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">{current.subtitle}</p>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                         <h3 className="text-2xl font-bold text-white mb-6 text-center">Enroll Now</h3>
                         <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-4">
                            <input type="hidden" name="_subject" value={`New ${current.title} ENROLLMENT!`} />
                            <div><label htmlFor="bc-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="bc-name" name="name" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                            <div><label htmlFor="bc-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="bc-email" name="email" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                            <button type="submit" className={`w-full bg-${current.accentColor}-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-${current.accentColor}-700 transition-colors duration-300`}>Enroll in Bootcamp</button>
                        </form>
                    </div>
                    <div className="text-slate-300">
                        <h3 className="text-2xl font-bold text-white mb-4">What You'll Achieve in 7 Days:</h3>
                        <ul className="space-y-3">{current.dailyPlan.map((day, index) => <li key={index} className="flex items-start"><Target size={16} className={`text-${current.accentColor}-400 mr-3 mt-1 flex-shrink-0`} /><span><span className="font-bold text-white">Day {index + 1}:</span> {day}</span></li>)}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LegalPage = ({ onNavigate, title, children }) => (
    <div className="bg-slate-900 text-white min-h-screen">
        <div className="container mx-auto px-6 py-12 md:py-20">
            <button onClick={() => onNavigate('home')} className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"><ArrowLeft size={20} className="mr-2" />Back to Home</button>
            <SectionTitle className="!mb-4">{title}</SectionTitle>
            <p className="text-center text-slate-400 mb-12">Last updated: September 29, 2025</p>
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 md:p-12 rounded-lg border border-slate-700 text-slate-300 space-y-6">{children}</div>
        </div>
    </div>
);

const TermsPage = ({ onNavigate }) => (
    <LegalPage onNavigate={onNavigate} title="Terms and Conditions">
        <p>Welcome to Agnidhra Technologies. These terms and conditions outline the rules and regulations for the use of our website and the enrollment in our courses.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">1. Enrollment and Access</h3>
        <p>Upon enrolling in a course, you are granted a limited, non-transferable license to access the course materials for personal, non-commercial use. You agree not to share, distribute, or resell any course content.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">2. Payments and Refunds</h3>
        <p>All payments for courses are to be made in full prior to the commencement of the course unless otherwise specified. Our refund policy is detailed on the course enrollment page and is subject to change.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">3. Intellectual Property</h3>
        <p>The content, curriculum, and materials provided in our courses are the intellectual property of Agnidhra Technologies. You may not reproduce, duplicate, or copy any part of our service without express written permission from us.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">4. Limitation of Liability</h3>
        <p>While we strive to provide the most accurate and up-to-date information, Agnidhra Technologies does not guarantee employment or any specific career outcome upon completion of a course. Our programs are designed to enhance skills and knowledge in the respective fields.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">5. Governing Law</h3>
        <p>These terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Andhra Pradesh for the resolution of any disputes.</p>
    </LegalPage>
);

const DisclaimerPage = ({ onNavigate }) => (
    <LegalPage onNavigate={onNavigate} title="Disclaimer">
        <p>The information provided by Agnidhra Technologies on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">Professional Disclaimer</h3>
        <p>The website cannot and does not contain financial or career advice. The information is provided for educational and informational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of career or employment guarantee.</p>
        <h3 className="text-xl font-bold text-sky-400 pt-4">External Links Disclaimer</h3>
        <p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
    </LegalPage>
);


// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const renderPage = () => {
        switch (currentPage) {
            case 'workshop': return <FreeWorkshopPage onNavigate={setCurrentPage} />;
            case 'defensiveBootcamp': return <BootcampPage onNavigate={setCurrentPage} type="defensive" />;
            case 'offensiveBootcamp': return <BootcampPage onNavigate={setCurrentPage} type="offensive" />;
            case 'terms': return <TermsPage onNavigate={setCurrentPage} />;
            case 'disclaimer': return <DisclaimerPage onNavigate={setCurrentPage} />;
            case 'home':
            default: return <HomePage onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="bg-slate-900 antialiased">
            <Header onNavigate={setCurrentPage} currentPage={currentPage} />
            <main>
                {renderPage()}
            </main>
            <Footer onNavigate={setCurrentPage} />
        </div>
    );
}

