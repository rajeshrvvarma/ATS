import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import SpecializedTrainingModal from '@/components/SpecializedTrainingModal.jsx'; // Import the new modal
import { callGeminiAPI } from '@/api/gemini.js';

// --- Sub-components specific to HomePage ---

const Hero = () => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    return (
    <>
        <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
        <section id="home" className="py-24 md:py-32 text-center bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="flex justify-center items-center gap-4">
                    <Shield className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mb-6 animate-pulse" />
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
                        className="btn-primary px-8 py-3 shadow-lg transform hover:scale-105"
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
                    In today's rapidly evolving tech landscape, theoretical knowledge is not enough. Agnidhra Technologies was founded on the principle of bridging the critical gap between academic learning and real-world industry demands. Our mission is to empower aspiring tech professionals with practical, hands-on skills that make them not just knowledgeable, but job-ready from day one.
                </p>
            </div>
        </div>
    </section>
);

const CourseOfferings = ({ setVisibleSyllabus, onNavigate }) => {
    const freeWorkshop = { icon: Users, title: "Free Introductory Workshop", description: "A live, 1-hour session covering the landscape of Cyber Security.", cta: "Register for Free", page: "workshop" };
    const defensivePath = { title: "Defensive Security Path (SOC Analyst)", icon: Shield, courses: [{ title: "7-Day Bootcamp", description: "An intensive week of learning core defensive skills.", features: ["OS Hardening Labs", "Intro to SIEM", "Vulnerability Scanning"], cta: "Enroll in Bootcamp", page: "defensiveBootcamp" }, { title: "2-Month Intensive Program", description: "The complete SOC Analyst training, from fundamentals to advanced incident response.", features: ["Entire 8-week syllabus", "Capstone Project", "Interview Preparation"], cta: "Learn More", syllabus: "soc" }] };
    const offensivePath = { title: "Offensive Security Path (Ethical Hacking)", icon: Code, courses: [{ title: "7-Day Bootcamp", description: "A fast-paced introduction to the attacker's mindset.", features: ["Kali Linux Setup", "Scanning with Nmap", "Basic Exploitation"], cta: "Enroll in Bootcamp", page: "offensiveBootcamp" }, { title: "2-Month Intensive Program", description: "Become a job-ready Ethical Hacker by mastering offensive techniques.", features: ["Advanced Exploitation", "Web & Network Hacking", "Reporting & Remediation"], cta: "Learn More", syllabus: "ethicalHacking" }]};
    const handleSyllabusClick = (syllabus) => { setVisibleSyllabus(syllabus); setTimeout(() => { document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' }); }, 100); };
    const [activeTab, setActiveTab] = useState('defensive');
    return (
        <section id="offerings" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <SectionTitle>Programs</SectionTitle>
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <div className="inline-flex bg-slate-800 border border-slate-700 rounded-lg p-1">
                        <button onClick={() => setActiveTab('defensive')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab==='defensive' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}>Defensive (SOC)</button>
                        <button onClick={() => setActiveTab('offensive')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab==='offensive' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'}`}>Offensive (Ethical Hacking)</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {(activeTab==='defensive' ? defensivePath.courses : offensivePath.courses).map((course, index) => (
                        <div key={index} className={`card card-hover p-6 flex flex-col ${activeTab==='defensive' ? 'hover:border-blue-500' : 'hover:border-red-500'}`}>
                            <h4 className="text-xl font-bold text-white mb-1">{course.title}</h4>
                            <p className="text-slate-400 mb-4">{course.description}</p>
                            <ul className="space-y-2 mb-6 text-slate-300">{course.features.map((feature, i) => <li key={i} className="flex items-center"><Target size={16} className={`${activeTab==='defensive' ? 'text-blue-400' : 'text-red-400'} mr-3 flex-shrink-0`} /><span>{feature}</span></li>)}</ul>
                            <div className="mt-auto flex items-center gap-3">
                                <button onClick={() => course.syllabus ? handleSyllabusClick(course.syllabus) : onNavigate(course.page)} className={`${activeTab==='defensive' ? 'btn-primary' : 'btn-danger'} px-5 py-2`}>{course.cta}</button>
                                {course.syllabus && (<button onClick={() => handleSyllabusClick(course.syllabus)} className="btn-secondary px-4 py-2">View syllabus</button>)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-5xl mx-auto mt-12 text-slate-300">
                    <div className="overflow-x-auto rounded-lg border border-slate-700">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-800 text-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">Feature</th>
                                    <th className="px-4 py-3 text-left">7‑Day Bootcamp</th>
                                    <th className="px-4 py-3 text-left">2‑Month Program</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-slate-700"><td className="px-4 py-3">Duration</td><td className="px-4 py-3">7 days</td><td className="px-4 py-3">8 weeks</td></tr>
                                <tr className="border-t border-slate-700"><td className="px-4 py-3">Projects</td><td className="px-4 py-3">Mini labs</td><td className="px-4 py-3">Capstone + labs</td></tr>
                                <tr className="border-t border-slate-700"><td className="px-4 py-3">Career Prep</td><td className="px-4 py-3">Basics</td><td className="px-4 py-3">Mock interviews</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="max-w-xl mx-auto mt-12">
                    <div className="card card-hover p-8 flex flex-col text-center items-center">
                        <freeWorkshop.icon size={32} className="mb-4 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white mb-3">{freeWorkshop.title}</h3>
                        <p className="text-slate-400 mb-6">{freeWorkshop.description}</p>
                        <button onClick={() => onNavigate(freeWorkshop.page)} className="btn-primary w-full max-w-xs mt-auto py-3">{freeWorkshop.cta}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const WhyUs = () => (
    <section id="why-us" className="py-20 bg-slate-800">
        <div className="container mx-auto px-6">
            <SectionTitle>Why Train With Us?</SectionTitle>
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="text-center"><div className="text-blue-400 mb-4"><Briefcase className="w-12 h-12 mx-auto" /></div><h3 className="text-xl font-bold text-white mb-2">Project‑Based</h3><p className="text-slate-400">Hands‑on labs and real projects build a hireable portfolio.</p></div>
                <div className="text-center"><div className="text-blue-400 mb-4"><Users className="w-12 h-12 mx-auto" /></div><h3 className="text-xl font-bold text-white mb-2">Mentorship</h3><p className="text-slate-400">Weekly guidance, code reviews, and interview prep.</p></div>
                <div className="text-center"><div className="text-blue-400 mb-4"><Award className="w-12 h-12 mx-auto" /></div><h3 className="text-xl font-bold text-white mb-2">Career‑Focused</h3><p className="text-slate-400">Resume, LinkedIn, and mock interviews included.</p></div>
            </div>
        </div>
    </section>
);

const Admissions = () => (
    <section id="admissions" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
            <SectionTitle>Admissions Process</SectionTitle>
            <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 top-8 h-full w-0.5 bg-slate-700 hidden md:block"></div>
                <div className="grid md:grid-cols-2 gap-16">

                    {/* ITEM 1: Reduced padding to md:pr-8 */}
                    <div className="text-center md:text-right relative">
                        {/* Centered the circle by adding md:translate-x-1/2 */}
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-[-2rem] md:translate-x-1/2 top-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">1</div>
                        <h3 className="text-xl font-bold text-white mb-2">Submit an Inquiry</h3>
                        <p className="text-slate-400">Fill out our contact form with your details and the course you're interested in.</p>
                    </div>
                    
                    <div></div>
                    <div></div>
                    
                    {/* ITEM 2: Reduced padding to md:pl-8 */}
                    <div className="text-center md:text-left relative">
                        {/* Centered the circle by adding md:-translate-x-1/2 */}
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-[-2rem] md:-translate-x-1/2 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">2</div>
                        <h3 className="text-xl font-bold text-white mb-2">Free Demo Session</h3>
                        <p className="text-slate-400">We'll contact you to schedule a free one-on-one demo and consultation.</p>
                    </div>

                    {/* ITEM 3: Reduced padding to md:pr-8 */}
                    <div className="text-center md:text-right relative">
                         {/* Centered the circle by adding md:translate-x-1/2 */}
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-[-2rem] md:translate-x-1/2 top-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">3</div>
                        <h3 className="text-xl font-bold text-white mb-2">Enroll & Learn</h3>
                        <p className="text-slate-400">Complete the enrollment process and start your journey to becoming a tech pro.</p>
                    </div>

                </div>
            </div>
        </div>
    </section>
);

const SpecializedTrainings = ({ onTrainingSelect }) => {
    const trainings = [
        { name: "C & Python Programming", icon: Code },
        { name: "Cloud & DevOps", icon: Server },
        { name: "AI & Data Science", icon: BrainCircuit }
    ];
    return (
        <section id="specialized-trainings" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>On-Demand Specialized Trainings</SectionTitle>
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg text-slate-300 mb-8">
                        Alongside our core Cyber Security programs, we offer flexible, on-demand training modules. These are designed for individuals, college groups, and corporate teams seeking customized learning experiences in other high-demand technologies.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {trainings.map(training => (
                            <button 
                                key={training.name}
                                onClick={() => onTrainingSelect(training.name)}
                                className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center hover:bg-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <training.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                                <h3 className="text-xl font-bold text-white">{training.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const SyllabusWeek = ({ week, accentColor }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleExplain = async () => { if (explanation) { setExplanation(''); return; } setIsLoading(true); const systemPrompt = "You are an expert cybersecurity instructor. Explain the following topic to a complete beginner in a simple, concise, and encouraging way. Focus on why this skill is important for their future job. Keep the explanation to 2-3 sentences."; const userPrompt = `Explain the topic "${week.title}" which is described as: "${week.desc}"`; const result = await callGeminiAPI(userPrompt, systemPrompt); setExplanation(result); setIsLoading(false); };
    return ( <div className="relative"><div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-${accentColor}-500`}></div><h4 className="font-bold text-white">{week.title}</h4><p className="text-slate-400">{week.desc}</p><button onClick={handleExplain} disabled={isLoading} className={`mt-2 text-sm text-${accentColor}-400 hover:text-${accentColor}-300 flex items-center gap-1 disabled:text-slate-500`}>{explanation ? <X size={14} /> : <Sparkles size={14} />}{isLoading ? 'Explaining...' : (explanation ? 'Hide Explanation' : '✨ Explain Topic')}</button>{explanation && (<div className="mt-2 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700 animate-fade-in"><p className="text-slate-200">{explanation}</p></div>)}</div>);
};

const Syllabus = ({ visibleSyllabus, setVisibleSyllabus }) => {
    const socSyllabus = { title: "SOC Analyst Program Syllabus", month1: { title: "Month 1: Cybersecurity Fundamentals & Tooling", weeks: [{ title: "Week 1: Security, Networking & OS Hardening", desc: "Combine core security principles, networking, and hands-on system hardening for Windows and Linux." }, { title: "Week 2: The Attacker's Mindset & Threat Intel", desc: "Understand the Cyber Kill Chain and use the MITRE ATT&CK framework to analyze attacker TTPs." }, { title: "Week 3: SIEM & Log Analysis", desc: "A deep dive into SIEM tools. Learn to write queries and correlation rules to detect threats." }, { title: "Week 4: EDR & Vulnerability Management", desc: "Explore EDR for monitoring devices and use scanners to find and prioritize system vulnerabilities." }] }, month2: { title: "Month 2: Incident Response & Career Readiness", weeks: [{ title: "Week 5: Phishing & Malware Analysis", desc: "Deconstruct phishing emails and use sandboxing tools to safely inspect suspicious attachments." }, { title: "Week 6: Introduction to Digital Forensics", desc: "Learn the principles of digital evidence collection and use tools like Autopsy to analyze a disk image." }, { title: "Week 7: Capstone Project: SOC Analyst Simulation", desc: "Apply your skills in a real-world simulation, investigating security alerts and recommending remediation." }, { title: "Week 8: Career Prep & Final Review", desc: "Focus on resume building, LinkedIn optimization, and mock interviews for SOC Analyst roles." }] } };
    const ethicalHackingSyllabus = { title: "Ethical Hacking Program Syllabus", month1: { title: "Month 1: Foundations of Offensive Security", weeks: [{ title: "Week 1: Intro to Hacking & Kali Linux", desc: "Explore pentesting phases, legal frameworks, and set up your virtual hacking lab." }, { title: "Week 2: Reconnaissance & Scanning", desc: "Master passive and active reconnaissance techniques and perform deep dives with Nmap." }, { title: "Week 3: Gaining Access & Enumeration", desc: "Learn system hacking, password cracking, and vulnerability analysis to find entry points." }, { title: "Week 4: Exploitation Fundamentals", desc: "Get hands-on with Metasploit, learn to customize payloads, and exploit common vulnerabilities." }] }, month2: { title: "Month 2: Advanced Attacks & Reporting", weeks: [{ title: "Week 5: Web Application Hacking", desc: "Exploit the OWASP Top 10 vulnerabilities like SQL Injection, XSS, and more." }, { title: "Week 6: Network Hacking & Sniffing", desc: "Dive into network-level attacks like ARP spoofing, DNS poisoning, and session hijacking." }, { title: "Week 7: Capstone Project: Live Pentest", desc: "Conduct a full penetration test against a vulnerable, multi-system lab environment." }, { title: "Week 8: Reporting & Career Prep", desc: "Learn to write professional pentesting reports and prepare for certifications and interviews." }] } };
    const syllabusData = visibleSyllabus === 'soc' ? socSyllabus : ethicalHackingSyllabus; const accentColor = visibleSyllabus === 'soc' ? 'blue' : 'red'; if (!visibleSyllabus) { return <div id="syllabus"></div>; }
    return ( <section id="syllabus" className="py-20 bg-slate-800"><div className="container mx-auto px-6 relative"><button onClick={() => setVisibleSyllabus(null)} className="absolute top-0 right-6 text-slate-400 hover:text-white transition-colors z-10"><X size={32} /></button><SectionTitle>{syllabusData.title}</SectionTitle><div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12"><div><h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month1.title}</h3><div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month1.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div></div><div><h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month2.title}</h3><div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month2.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div></div></div><div className="text-center mt-12"><button onClick={() => onNavigate('enroll')} className={`bg-${accentColor}-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-${accentColor}-700 transition-colors duration-300 transform hover:scale-105`}>Enroll in 2-Month Program</button></div></div></section>);
};

const Trainers = () => ( <section id="trainers" className="py-20 bg-slate-900"><div className="container mx-auto px-6"><SectionTitle>Meet Your Trainers</SectionTitle><div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8"><div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="/logo.png" alt="Santosh Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Santosh Kumar</h3><p className="text-sky-400 font-semibold mb-3">Lead Trainer & Founder</p><p className="text-slate-300">With 8 years of experience, Santosh provides a practical, end-to-end understanding of the tech landscape.</p></div><div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="/logo.png" alt="Jeevan Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Jeevan Kumar</h3><p className="text-sky-400 font-semibold mb-3">Co-Trainer | SOC Certified</p><p className="text-slate-300">With 6 years of experience, Jeevan brings rich practical exposure to the security landscape.</p></div></div></div></section>);
const Testimonials = () => {
    const items = [
        { quote: "The project-based approach was a game-changer. I landed a job as a SOC Analyst within two months!", name: "Rohan S.", role: "SOC Analyst", img: "https://placehold.co/50x50/0F172A/38BDF8?text=R" },
        { quote: "Hands-on labs prepared me for technical interviews. Highly recommended!", name: "Anjali P.", role: "Cyber Security Graduate", img: "https://placehold.co/50x50/0F172A/38BDF8?text=A" },
        { quote: "Mentors were amazing and kept me accountable throughout.", name: "Kartik V.", role: "Security Engineer", img: "https://placehold.co/50x50/0F172A/38BDF8?text=K" }
    ];
    const [index, setIndex] = React.useState(0);
    React.useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
        return () => clearInterval(id);
    }, [items.length]);

    const current = items[index];
    return (
        <section id="testimonials" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>What Our Students Say</SectionTitle>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 relative">
                        <p className="text-slate-300 italic mb-6">“{current.quote}”</p>
                        <div className="flex items-center">
                            <img src={current.img} alt={current.name} className="w-12 h-12 rounded-full mr-4"/>
                            <div>
                                <h4 className="font-bold text-white">{current.name}</h4>
                                <p className="text-sm text-slate-400">{current.role}</p>
                            </div>
                        </div>
                        <div className="absolute right-4 top-4 flex gap-2">
                            {items.map((_, i) => (
                                <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full ${i===index ? 'bg-blue-500' : 'bg-slate-600'}`}></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const Contact = ({ onNavigate }) => ( <section id="contact" className="py-20 bg-slate-800"><div className="container mx-auto px-6"><SectionTitle>Get In Touch</SectionTitle><div className="max-w-3xl mx-auto text-center"><p className="text-lg text-slate-300 mb-8">Have a question about our programs? Send us a message!</p><div className="grid md:grid-cols-2 gap-8"><div className="bg-slate-900 p-8 text-left space-y-6 rounded-lg border border-slate-700"><h3 className="text-xl font-bold text-white mb-4 text-center">General Inquiry</h3><form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-6"><input type="hidden" name="_next" value="https://atstatic.netlify.app/thank-you" /><input type="hidden" name="_subject" value="New Cyber Security Inquiry!" /><div><label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="name" name="name" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="email" name="email" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label><textarea id="message" name="message" rows="4" required placeholder="Ask us about our programs, schedules, or anything else!" className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"></textarea></div><button type="submit" className="w-full bg-slate-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-300">Send Message</button></form></div><div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-lg text-center"><h3 className="text-2xl font-bold text-white mb-4">Ready to Enroll?</h3><p className="text-blue-100 mb-6">Start your cybersecurity journey with personalized guidance and career counseling.</p><button onClick={() => onNavigate('enroll')} className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105 mb-4">Start Enrollment Process</button><div className="space-y-2 text-sm text-blue-200"><div>✓ Free career counseling</div><div>✓ Personalized learning path</div><div>✓ Flexible payment options</div></div></div></div></div></div></section>);

// --- Main HomePage Component ---
export default function HomePage({ onNavigate }) {
    const [visibleSyllabus, setVisibleSyllabus] = useState(null);
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    
    React.useEffect(() => {
        // On mount, if a hash exists, attempt smooth scroll to that section
        const hash = window.location.hash?.replace('#', '');
        if (hash) {
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);

    return (
        <>
            <Hero />
            <About />
            <CourseOfferings setVisibleSyllabus={setVisibleSyllabus} onNavigate={onNavigate} />
            <SpecializedTrainings onTrainingSelect={setSelectedTraining} />
            <WhyUs />
            <Admissions />            
            <Syllabus visibleSyllabus={visibleSyllabus} setVisibleSyllabus={setVisibleSyllabus} />
            <Trainers />
            <Testimonials />
            <Contact onNavigate={onNavigate} />

            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsFaqBotOpen(true)}
                    className="bg-sky-600 text-white rounded-full p-4 shadow-lg hover:bg-sky-500 transition-all duration-300 transform hover:scale-110"
                    aria-label="Open AI Admissions Advisor"
                >
                    <MessageCircle size={28} />
                </button>
            </div>
            
            <AiFaqBot isOpen={isFaqBotOpen} onClose={() => setIsFaqBotOpen(false)} />

            {selectedTraining && (
                <SpecializedTrainingModal 
                    courseTitle={selectedTraining} 
                    onClose={() => setSelectedTraining(null)} 
                />
            )}
        </>
    );
}


