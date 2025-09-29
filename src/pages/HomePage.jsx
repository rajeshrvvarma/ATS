import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Bot, Briefcase, Award, MessageCircle } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import { callGeminiAPI } from '@/api/gemini.js';

// --- Sub-components for HomePage ---

const Hero = () => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    return (
    <>
        <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
        <section id="home" className="py-24 md:py-32 text-center bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="flex justify-center items-center gap-4">
                    <Shield className="w-16 h-16 md:w-20 md:h-20 text-sky-400 mb-6 animate-pulse" />
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
    return (
        <section id="offerings" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <SectionTitle>Choose Your Cyber Security Path</SectionTitle>
                <div className="max-w-xl mx-auto mb-16">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 flex flex-col text-center items-center hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-2">
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
    );
};

const WhyUs = () => (
    <section id="why-us" className="py-20 bg-slate-800">
        <div className="container mx-auto px-6">
            <SectionTitle>Why Train With Us?</SectionTitle>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="text-sky-400 mb-4"><Briefcase className="w-12 h-12 mx-auto" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Project-Based Learning</h3>
                    <p className="text-slate-400">Build a portfolio of real-world projects that showcases your skills to employers.</p>
                </div>
                <div className="text-center">
                    <div className="text-sky-400 mb-4"><Users className="w-12 h-12 mx-auto" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Expert Mentorship</h3>
                    <p className="text-slate-400">Receive personalized guidance from industry veterans with multi-domain experience.</p>
                </div>
                <div className="text-center">
                    <div className="text-sky-400 mb-4"><Award className="w-12 h-12 mx-auto" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Career-Focused</h3>
                    <p className="text-slate-400">Our curriculum is aligned with the latest industry trends and employer demands.</p>
                </div>
                <div className="text-center">
                    <div className="text-sky-400 mb-4"><Sparkles className="w-12 h-12 mx-auto" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Modern Online Learning</h3>
                    <p className="text-slate-400">Learn from anywhere with our live, interactive online classes and AI-powered tools.</p>
                </div>
            </div>
        </div>
    </section>
);

const Admissions = () => (
    <section id="admissions" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
            <SectionTitle>Admissions Process</SectionTitle>
            <div className="relative max-w-4xl mx-auto">
                {/* Desktop timeline line */}
                <div className="absolute left-1/2 top-8 h-full w-0.5 bg-slate-700 hidden md:block"></div>
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Step 1 */}
                    <div className="text-center md:text-right relative">
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-[-2rem] top-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">1</div>
                        <h3 className="text-xl font-bold text-white mb-2">Submit an Inquiry</h3>
                        <p className="text-slate-400">Fill out our contact form with your details and the course you're interested in.</p>
                    </div>
                    <div></div> {/* Empty column for spacing */}
                    
                    <div></div> {/* Empty column for spacing */}
                    {/* Step 2 */}
                    <div className="text-center md:text-left relative">
                         <div className="absolute left-1/2 -translate-x-1/2 md:left-[-2rem] top-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">2</div>
                        <h3 className="text-xl font-bold text-white mb-2">Free Demo Session</h3>
                        <p className="text-slate-400">We'll contact you to schedule a free one-on-one demo and consultation to answer all your questions.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center md:text-right relative">
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-[-2rem] top-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white ring-8 ring-slate-900">3</div>
                        <h3 className="text-xl font-bold text-white mb-2">Enroll & Learn</h3>
                        <p className="text-slate-400">Complete the enrollment process and start your journey to becoming a tech pro.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SyllabusWeek = ({ week, accentColor }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleExplain = async () => { setIsLoading(true); setExplanation(''); const systemPrompt = "You are an expert cybersecurity instructor. Explain the following topic to a complete beginner in a simple, concise, and encouraging way. Focus on why this skill is important for their future job. Keep the explanation to 2-3 sentences."; const userPrompt = `Explain the topic "${week.title}" which is described as: "${week.desc}"`; const result = await callGeminiAPI(userPrompt, systemPrompt); setExplanation(result); setIsLoading(false); };
    return ( <div className="relative"><div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-${accentColor}-500`}></div><h4 className="font-bold text-white">{week.title}</h4><p className="text-slate-400">{week.desc}</p><button onClick={handleExplain} disabled={isLoading} className={`mt-2 text-sm text-${accentColor}-400 hover:text-${accentColor}-300 flex items-center gap-1 disabled:text-slate-500`}><Sparkles size={14} />{isLoading ? 'Explaining...' : '✨ Explain Topic'}</button>{explanation && (<div className="mt-2 text-sm bg-slate-900/50 p-3 rounded-md border border-slate-700"><p className="text-slate-200">{explanation}</p></div>)}</div>);
};
const Syllabus = ({ visibleSyllabus, setVisibleSyllabus }) => {
    const socSyllabus = { title: "SOC Analyst Program Syllabus", month1: { title: "Month 1: Cybersecurity Fundamentals & Tooling", weeks: [{ title: "Week 1: Security, Networking & OS Hardening", desc: "Combine core security principles (CIA Triad), networking (TCP/IP), and hands-on system hardening for both Windows and Linux." }, { title: "Week 2: The Attacker's Mindset & Threat Intel", desc: "Understand the Cyber Kill Chain and use the MITRE ATT&CK framework to analyze attacker TTPs." }, { title: "Week 3: SIEM & Log Analysis", desc: "A deep dive into SIEM tools. Learn to write queries and create correlation rules to detect threats." }, { title: "Week 4: EDR & Vulnerability Management", desc: "Explore EDR for monitoring devices and use scanners to find and prioritize system vulnerabilities." }] }, month2: { title: "Month 2: Incident Response & Career Readiness", weeks: [{ title: "Week 5: Phishing & Malware Analysis", desc: "Deconstruct phishing emails and use sandboxing tools to safely inspect suspicious attachments." }, { title: "Week 6: Introduction to Digital Forensics", desc: "Learn the principles of digital evidence collection and use tools like Autopsy to analyze a disk image." }, { title: "Week 7: Capstone Project: SOC Analyst Simulation", desc: "Apply your skills in a real-world simulation, investigating security alerts and recommending remediation." }, { title: "Week 8: Career Prep & Final Review", desc: "Focus on resume building, LinkedIn optimization, and mock interviews for SOC Analyst roles." }] } };
    const ethicalHackingSyllabus = { title: "Ethical Hacking Program Syllabus", month1: { title: "Month 1: Foundations of Offensive Security", weeks: [{ title: "Week 1: Intro to Hacking & Kali Linux", desc: "Explore the phases of pentesting, legal frameworks, and set up your own virtual hacking lab with Kali Linux." }, { title: "Week 2: Reconnaissance & Scanning", desc: "Master passive and active reconnaissance techniques. Perform a deep dive into network scanning with Nmap." }, { title: "Week 3: Gaining Access & Enumeration", desc: "Learn system hacking, password cracking techniques, and detailed vulnerability analysis to find entry points." }, { title: "Week 4: Exploitation Fundamentals", desc: "Get hands-on with the Metasploit Framework, learn to customize payloads, and exploit common vulnerabilities." }] }, month2: { title: "Month 2: Advanced Attacks & Reporting", weeks: [{ title: "Week 5: Web Application Hacking", desc: "Exploit the OWASP Top 10 vulnerabilities, including SQL Injection, Cross-Site Scripting (XSS), and more." }, { title: "Week 6: Network Hacking & Sniffing", desc: "Dive into network-level attacks like ARP spoofing, DNS poisoning, and session hijacking." }, { title: "Week 7: Capstone Project: Live Pentest", desc: "Conduct a full penetration test from start to finish against a vulnerable lab environment." }, { title: "Week 8: Reporting & Career Prep", desc: "Learn to write professional penetration testing reports and prepare for certifications and interviews." }] } };
    const syllabusData = visibleSyllabus === 'soc' ? socSyllabus : ethicalHackingSyllabus; const accentColor = visibleSyllabus === 'soc' ? 'sky' : 'red'; if (!visibleSyllabus) { return <div id="syllabus"></div>; }
    return ( <section id="syllabus" className="py-20 bg-slate-800"><div className="container mx-auto px-6 relative"><button onClick={() => setVisibleSyllabus(null)} className="absolute top-0 right-6 text-slate-400 hover:text-white transition-colors z-10"><X size={32} /></button><SectionTitle>{syllabusData.title}</SectionTitle><div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12"><div><h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month1.title}</h3><div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month1.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div></div><div><h3 className={`text-2xl font-bold text-${accentColor}-400 mb-6`}>{syllabusData.month2.title}</h3><div className="space-y-6 border-l-2 border-slate-700 pl-6">{syllabusData.month2.weeks.map((week, index) => <SyllabusWeek key={index} week={week} accentColor={accentColor} />)}</div></div></div><div className="text-center mt-12"><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={`bg-${accentColor}-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-${accentColor}-700 transition-colors duration-300 transform hover:scale-105`}>Enroll in 2-Month Program</button></div></div></section>);
};
const Trainers = () => ( <section id="trainers" className="py-20 bg-slate-900"><div className="container mx-auto px-6"><SectionTitle>Meet Your Trainers</SectionTitle><div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8"><div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="/logo.png" alt="Santosh Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Santosh Kumar</h3><p className="text-sky-400 font-semibold mb-3">Lead Trainer & Founder</p><p className="text-slate-300">With 8 years of experience across the full software lifecycle, Santosh provides a practical, end-to-end understanding of the tech landscape.</p></div><div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center"><img src="/logo.png" alt="Jeevan Kumar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" /><h3 className="text-2xl font-bold text-white">Jeevan Kumar</h3><p className="text-sky-400 font-semibold mb-3">Co-Trainer | SOC Certified</p><p className="text-slate-300">With 6 years of experience defending systems against real-world threats, Jeevan brings rich practical exposure to the security landscape.</p></div></div></div></section>);
const Testimonials = () => ( <section id="testimonials" className="py-20 bg-slate-800"><div className="container mx-auto px-6"><SectionTitle>What Our Students Say</SectionTitle><div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8"><div className="bg-slate-900 p-8 rounded-lg border border-slate-700"><p className="text-slate-300 italic mb-6">"The project-based approach was a game-changer. I landed a job as a SOC Analyst within two months of finishing the course!"</p><div className="flex items-center"><img src="https://placehold.co/50x50/0F172A/38BDF8?text=R" alt="Rohan S." className="w-12 h-12 rounded-full mr-4"/><div><h4 className="font-bold text-white">Rohan S.</h4><p className="text-sm text-slate-400">Cyber Security Graduate</p></div></div></div><div className="bg-slate-900 p-8 rounded-lg border border-slate-700"><p className="text-slate-300 italic mb-6">"The focus on real-world scenarios and hands-on labs prepared me for the technical interviews. Highly recommended!"</p><div className="flex items-center"><img src="https://placehold.co/50x50/0F172A/38BDF8?text=A" alt="Anjali P." className="w-12 h-12 rounded-full mr-4"/><div><h4 className="font-bold text-white">Anjali P.</h4><p className="text-sm text-slate-400">Cyber Security Graduate</p></div></div></div></div></div></section>);
const Contact = () => ( <section id="contact" className="py-20 bg-slate-800"><div className="container mx-auto px-6"><SectionTitle>Get In Touch</SectionTitle><div className="max-w-3xl mx-auto text-center"><p className="text-lg text-slate-300 mb-8">Have a question or ready to enroll? Send us a message!</p><form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="bg-slate-900 p-8 text-left space-y-6 rounded-lg border border-slate-700"><input type="hidden" name="_next" value="https://www.agnidhra-technologies.com/thank-you.html" /><input type="hidden" name="_subject" value="New Cyber Security Inquiry!" /><div className="grid md:grid-cols-2 gap-6"><div><label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="name" name="name" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div><div><label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="email" name="email" required className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div></div><div><label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label><textarea id="message" name="message" rows="4" required placeholder="Tell us which program you're interested in!" className="block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"></textarea></div><div className="text-right"><button type="submit" className="inline-block bg-sky-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-300">Send Message</button></div></form></div></div></section>);

// --- Main HomePage Component ---
export default function HomePage({ onNavigate }) {
    const [visibleSyllabus, setVisibleSyllabus] = useState(null);
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);

    return (
        <>
            <Hero />
            <About />
            <CourseOfferings setVisibleSyllabus={setVisibleSyllabus} onNavigate={onNavigate} />
            <WhyUs />
            <Admissions />
            <Syllabus visibleSyllabus={visibleSyllabus} setVisibleSyllabus={setVisibleSyllabus} />
            <Trainers />
            <Testimonials />
            <Contact />

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
        </>
    );
}

