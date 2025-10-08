import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit, Sword, CheckCircle } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import ScrollNavigation from '@/components/ScrollNavigation.jsx';
import SpecializedTrainingModal from '@/components/SpecializedTrainingModal.jsx';
import SyllabusRequestModal from '@/components/SyllabusRequestModal.jsx';
import EnrollmentEnquiryModal from '@/components/EnrollmentEnquiryModal.jsx';

// --- Sub-components specific to HomePage ---

// Company Introduction Section (1st Section)
const CompanyIntro = () => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    
    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <section id="home" className="py-16 md:py-20 text-center relative overflow-hidden min-h-screen flex items-center">
                {/* Hero Background */}
                <div className="absolute inset-0">
                    {/* Base gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    
                    {/* Cybersecurity themed background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-red-900/40"></div>
                    
                    {/* Digital grid pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div 
                            className="w-full h-full"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px'
                            }}
                        ></div>
                    </div>
                    
                    {/* Animated cybersecurity icons as background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Top left area */}
                        <div className="absolute top-20 left-10 md:top-32 md:left-20 opacity-20">
                            <Shield className="w-20 h-20 md:w-32 md:h-32 text-blue-400 animate-pulse" />
                        </div>
                        <div className="absolute top-40 left-40 md:top-60 md:left-60 opacity-15">
                            <Code className="w-16 h-16 md:w-24 md:h-24 text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                        </div>
                        
                        {/* Top right area */}
                        <div className="absolute top-10 right-20 md:top-20 md:right-32 opacity-20">
                            <Server className="w-18 h-18 md:w-28 md:h-28 text-red-400 animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                        <div className="absolute top-60 right-10 md:top-80 md:right-20 opacity-15">
                            <BrainCircuit className="w-16 h-16 md:w-24 md:h-24 text-green-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
                        </div>
                        
                        {/* Bottom area */}
                        <div className="absolute bottom-20 left-20 md:bottom-32 md:left-40 opacity-20">
                            <Target className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 animate-pulse" style={{ animationDelay: '2s' }} />
                        </div>
                        <div className="absolute bottom-40 right-40 md:bottom-60 md:right-60 opacity-15">
                            <Briefcase className="w-14 h-14 md:w-20 md:h-20 text-indigo-400 animate-bounce" style={{ animationDelay: '2.5s' }} />
                        </div>
                    </div>
                    
                    {/* Radial gradient overlay for focus */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(15,23,42,0.8)_70%)]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    {/* Company Name */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 bg-clip-text text-transparent">
                        Agnidhra Technologies
                    </h1>
                    
                    {/* Company Description */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <p className="text-xl md:text-2xl text-slate-300 mb-6 font-light leading-relaxed">
                            Premier Cybersecurity Training Institute
                        </p>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                            At Agnidhra Technologies, we specialize in transforming aspiring cybersecurity professionals into industry-ready experts. Our comprehensive training programs bridge the gap between theoretical knowledge and real-world application, ensuring our students are equipped with the practical skills demanded by today's cybersecurity landscape.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6 mt-12 text-center">
                            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-700">
                                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Expert-Led Training</h3>
                                <p className="text-slate-400">Industry professionals with years of hands-on experience</p>
                            </div>
                            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-700">
                                <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Job-Ready Skills</h3>
                                <p className="text-slate-400">Practical, hands-on training that employers value</p>
                            </div>
                            <div className="p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-700">
                                <Award className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Industry Recognition</h3>
                                <p className="text-slate-400">Certified programs aligned with industry standards</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Call to Action */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => document.getElementById('cybersecurity-mastery')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary px-8 py-3 shadow-lg transform hover:scale-105"
                        >
                            Explore Our Expertise
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

// Master Cybersecurity Section (2nd Section)
const CybersecurityMastery = () => (
    <section id="cybersecurity-mastery" className="py-20 bg-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/20"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <div className="flex justify-center items-center gap-6 mb-8">
                    <Shield className="w-16 h-16 md:w-20 md:h-20 text-blue-400 animate-pulse" />
                    <Code className="w-16 h-16 md:w-20 md:h-20 text-red-400 animate-pulse" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Master Offensive & Defensive Cyber Security
                </h2>
                
                <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                    Comprehensive training programs designed to transform you into a skilled cybersecurity professional. 
                    Whether you're defending against threats or learning ethical hacking techniques, our expert-led courses 
                    provide the hands-on experience you need to excel in the cybersecurity industry.
                </p>
            </div>
            
            {/* Dual Path Overview */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-8 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <Shield className="w-12 h-12 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Defensive Security</h3>
                    </div>
                    <p className="text-blue-100 mb-6">
                        Become a SOC Analyst and learn to protect organizations from cyber threats. Master incident response, 
                        threat hunting, and security monitoring techniques used by industry professionals.
                    </p>
                    <ul className="space-y-3 text-blue-200">
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span>SIEM Tools & Log Analysis</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span>Incident Response & Forensics</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span>Threat Intelligence & Hunting</span>
                        </li>
                    </ul>
                </div>
                
                <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 p-8 rounded-xl border border-red-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <Code className="w-12 h-12 text-red-400" />
                        <h3 className="text-2xl font-bold text-white">Offensive Security</h3>
                    </div>
                    <p className="text-red-100 mb-6">
                        Master ethical hacking and penetration testing to identify vulnerabilities before malicious actors do. 
                        Learn the attacker's mindset and advanced exploitation techniques.
                    </p>
                    <ul className="space-y-3 text-red-200">
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-red-400" />
                            <span>Penetration Testing & VAPT</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-red-400" />
                            <span>Web & Network Exploitation</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-red-400" />
                            <span>Advanced Attack Techniques</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

// Our Expertise Section (4th Section)
const About = () => (
    <section id="about" className="py-20 bg-slate-800" name="expertise">
        <div className="container mx-auto px-6">
            <SectionTitle>Our Expertise</SectionTitle>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        With years of industry experience and a passion for cybersecurity education, 
                        Agnidhra Technologies stands at the forefront of practical cybersecurity training.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Defensive Security</h3>
                        <p className="text-slate-400 text-sm">SOC operations, incident response, threat hunting, and security monitoring expertise.</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Offensive Security</h3>
                        <p className="text-slate-400 text-sm">Penetration testing, ethical hacking, vulnerability assessment, and red team operations.</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Server className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Cloud Security</h3>
                        <p className="text-slate-400 text-sm">AWS, Azure, GCP security implementations and cloud-native security solutions.</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Industry Training</h3>
                        <p className="text-slate-400 text-sm">Corporate training, compliance programs, and customized cybersecurity workshops.</p>
                    </div>
                </div>

                <div className="mt-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 border border-slate-700">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                            <p className="text-slate-300">Students Trained</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                            <p className="text-slate-300">Job Placement Rate</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                            <p className="text-slate-300">Industry Partners</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Revamped Programs Section (3rd Section)
const ProgramsOffering = ({ onNavigate }) => {
    const [activeProgram, setActiveProgram] = useState('all');
    const [syllabusModal, setSyllabusModal] = useState({ isOpen: false, course: '', type: '' });
    const [enrollmentModal, setEnrollmentModal] = useState({ isOpen: false, course: '', type: '', formType: 'enquiry' });

    // New program structure
    const programs = {
        foundation: {
            title: "Foundation Programs",
            subtitle: "Start your cybersecurity journey",
            courses: [
                {
                    title: "Cybersecurity Fundamentals Workshop",
                    duration: "2 Hours",
                    type: "Online Live Session",
                    description: "Introduction to cybersecurity landscape, career paths, and industry opportunities.",
                    features: ["Career Guidance", "Industry Overview", "Live Q&A Session", "Certificate of Participation"],
                    level: "Beginner",
                    price: "₹99",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Cybersecurity Fundamentals Workshop', type: 'foundation', formType: 'enrollment' }),
                    color: "green"
                },
                {
                    title: "Specialized Technologies Workshop",
                    duration: "2 Hours",
                    type: "Online Live Session",
                    description: "Explore emerging technologies including AI, Cloud Computing, and DevSecOps fundamentals.",
                    features: ["Technology Overview", "Career Paths", "Industry Trends", "Certificate of Participation"],
                    level: "Beginner",
                    price: "₹99",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Specialized Technologies Workshop', type: 'foundation', formType: 'enrollment' }),
                    color: "green"
                }
            ]
        },
        defensive: {
            title: "Defensive Security Programs",
            subtitle: "Become a SOC Analyst & Incident Response Expert",
            courses: [
                {
                    title: "7-Day Intensive Bootcamp",
                    duration: "7 Days",
                    type: "High-Volume Enrollment",
                    description: "From Zero to SOC Analyst Ready - Join 100+ cybersecurity enthusiasts",
                    features: ["Live Sessions", "Recorded Access", "Certificate", "Job Assistance"],
                    level: "Beginner to Intermediate",
                    price: "Starting ₹499",
                    cta: "Join Bootcamp",
                    action: () => onNavigate('bootcampLanding'),
                    color: "blue"
                },
                {
                    title: "2-Month Mastery Program",
                    duration: "2 Months",
                    type: "Premium with Mentorship",
                    description: "Advanced certification program with personal mentorship and guaranteed job support",
                    features: ["Personal Mentor", "10+ Projects", "Small Batch (20 students)", "Interview Guarantee"],
                    level: "All levels welcome",
                    price: "₹5,999",
                    cta: "Reserve Premium Seat",
                    action: () => onNavigate('premiumProgram'),
                    color: "purple"
                }
            ]
        },
        offensive: {
            title: "Offensive Security Programs",
            subtitle: "Master Ethical Hacking & Penetration Testing",
            courses: [
                {
                    title: "7-Day Ethical Hacking Bootcamp",
                    duration: "7 Days",
                    type: "High-Volume Enrollment",
                    description: "Master penetration testing - Join 80+ aspiring ethical hackers",
                    features: ["Kali Linux Mastery", "Web App Pentesting", "Network Exploitation", "Report Writing"],
                    level: "Beginner to Intermediate",
                    price: "Starting ₹599",
                    cta: "Join Hacking Bootcamp",
                    action: () => onNavigate('offensiveBootcampLanding'),
                    color: "red"
                },
                {
                    title: "2-Month Elite Hacker Program",
                    duration: "2 Months",
                    type: "Elite Training (15 students)",
                    description: "Advanced red team operations with personal mentorship and custom exploit development",
                    features: ["Custom Exploits", "Red Team Ops", "Advanced Techniques", "Elite Mentorship"],
                    level: "Advanced",
                    price: "₹7,999",
                    cta: "Reserve Elite Seat",
                    action: () => onNavigate('offensiveMastery'),
                    color: "orange"
                }
            ]
        },
        specialized: {
            title: "Specialized Training Programs",
            subtitle: "Domain Expertise & Niche Skills",
            courses: [
                {
                    title: "Cloud Security Specialist",
                    duration: "4-6 weeks",
                    type: "Domain Specialization",
                    description: "Master AWS, Azure, and multi-cloud security architectures",
                    features: ["AWS Security", "Azure Security", "Multi-Cloud", "Compliance"],
                    level: "Intermediate",
                    price: "Starting ₹3,999",
                    cta: "Explore Specializations",
                    action: () => onNavigate('specializedCourses'),
                    color: "blue"
                },
                {
                    title: "Digital Forensics Expert",
                    duration: "5 weeks", 
                    type: "Investigation Skills",
                    description: "Master digital evidence collection and malware forensics",
                    features: ["Evidence Collection", "Memory Forensics", "Mobile Forensics", "Legal Framework"],
                    level: "Intermediate",
                    price: "Starting ₹4,999",
                    cta: "Explore Specializations", 
                    action: () => onNavigate('specializedCourses'),
                    color: "green"
                },
                {
                    title: "GRC & Compliance Analyst",
                    duration: "4-5 weeks",
                    type: "Risk & Compliance",
                    description: "ISO 27001, risk management, and governance frameworks",
                    features: ["ISO 27001", "Risk Management", "Audit Techniques", "Compliance"],
                    level: "Intermediate",
                    price: "Starting ₹3,499",
                    cta: "Explore Specializations",
                    action: () => onNavigate('specializedCourses'),
                    color: "purple"
                }
            ]
        },
        additional: {
            title: "Additional Training Programs", 
            subtitle: "Comprehensive Technology Solutions",
            courses: [
                {
                    title: "Cloud Computing & DevOps",
                    duration: "Customizable",
                    type: "Specialized Training",
                    description: "Comprehensive training on cloud platforms, DevOps practices, and infrastructure management.",
                    features: ["AWS/Azure/GCP", "Docker & Kubernetes", "CI/CD Pipelines", "Infrastructure as Code", "Hands-on Projects"],
                    level: "Intermediate",
                    price: "₹25,000",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Cloud Computing & DevOps', type: 'specialized', formType: 'enrollment' }),
                    color: "purple"
                },
                {
                    title: "AI & Data Science Fundamentals",
                    duration: "Customizable",
                    type: "Specialized Training",
                    description: "Introduction to artificial intelligence, machine learning, and data analytics.",
                    features: ["Python Programming", "Machine Learning", "Data Analytics", "AI Applications", "Practical Projects"],
                    level: "Beginner to Intermediate",
                    price: "₹20,000",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'AI & Data Science Fundamentals', type: 'specialized', formType: 'enrollment' }),
                    color: "purple"
                },
                {
                    title: "Programming & Web Development",
                    duration: "Customizable",
                    type: "Specialized Training",
                    description: "Full-stack development training covering modern programming languages and frameworks.",
                    features: ["Frontend Development", "Backend Programming", "Database Management", "API Development", "Project Portfolio"],
                    level: "Beginner to Advanced",
                    price: "₹30,000",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Programming & Web Development', type: 'specialized', formType: 'enrollment' }),
                    color: "purple"
                },
                {
                    title: "Corporate Training",
                    duration: "Customizable",
                    type: "Enterprise Solution",
                    description: "Tailored training programs for organizations across all technology domains.",
                    features: ["Custom Curriculum", "On-site Training", "Team Assessments", "Ongoing Support", "Multiple Technologies"],
                    level: "All Levels",
                    price: "Contact Us",
                    cta: "Register Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Corporate Training', type: 'corporate', formType: 'enquiry' }),
                    color: "indigo"
                }
            ]
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            green: "border-green-500/30 hover:border-green-500 bg-gradient-to-br from-green-900/20 to-green-800/10",
            blue: "border-blue-500/30 hover:border-blue-500 bg-gradient-to-br from-blue-900/20 to-blue-800/10",
            red: "border-red-500/30 hover:border-red-500 bg-gradient-to-br from-red-900/20 to-red-800/10",
            purple: "border-purple-500/30 hover:border-purple-500 bg-gradient-to-br from-purple-900/20 to-purple-800/10",
            indigo: "border-indigo-500/30 hover:border-indigo-500 bg-gradient-to-br from-indigo-900/20 to-indigo-800/10"
        };
        return colors[color] || colors.blue;
    };

    const getButtonClasses = (color) => {
        const colors = {
            green: "bg-green-600 hover:bg-green-700 text-white",
            blue: "bg-blue-600 hover:bg-blue-700 text-white",
            red: "bg-red-600 hover:bg-red-700 text-white",
            purple: "bg-purple-600 hover:bg-purple-700 text-white",
            indigo: "bg-indigo-600 hover:bg-indigo-700 text-white"
        };
        return colors[color] || colors.blue;
    };

    const filteredPrograms = activeProgram === 'all' 
        ? Object.values(programs).flatMap(category => category.courses.map(course => ({ ...course, category: category.title })))
        : programs[activeProgram]?.courses || [];

    return (
        <>
            <section id="programs" className="py-20 bg-slate-900">
                <div className="container mx-auto px-6">
                    <SectionTitle>Our Training Programs</SectionTitle>
                    
                    {/* Program Categories Filter */}
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <div className="inline-flex flex-wrap gap-2 bg-slate-800 border border-slate-700 rounded-xl p-2">
                            <button 
                                onClick={() => setActiveProgram('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'all' 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                All Programs
                            </button>
                            <button 
                                onClick={() => setActiveProgram('foundation')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'foundation' 
                                        ? 'bg-green-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                Foundation
                            </button>
                            <button 
                                onClick={() => setActiveProgram('defensive')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'defensive' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                Defensive Security
                            </button>
                            <button 
                                onClick={() => setActiveProgram('offensive')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'offensive' 
                                        ? 'bg-red-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                Offensive Security
                            </button>
                            <button 
                                onClick={() => setActiveProgram('specialized')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'specialized' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                Specialized
                            </button>
                            <button 
                                onClick={() => setActiveProgram('additional')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeProgram === 'additional' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                            >
                                Additional
                            </button>
                        </div>
                    </div>

                    {/* Programs Grid */}
                    {activeProgram === 'all' ? (
                        // Show all programs by category
                        Object.entries(programs).map(([key, category]) => (
                            <div key={key} className="mb-16">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.title}</h3>
                                    <p className="text-slate-400">{category.subtitle}</p>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                    {category.courses.map((course, index) => (
                                        <div key={index} className={`card p-6 border-2 transition-all duration-300 ${getColorClasses(course.color)}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{course.type}</span>
                                                    <h4 className="text-xl font-bold text-white mt-1">{course.title}</h4>
                                                </div>
                                                <span className="text-lg font-bold text-blue-400">{course.duration}</span>
                                            </div>
                                            
                                            <p className="text-slate-300 text-sm mb-4">{course.description}</p>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{course.level}</span>
                                                <span className="text-lg font-bold text-white">{course.price}</span>
                                            </div>
                                            
                                            <ul className="space-y-2 mb-6 text-sm text-slate-300">
                                                {course.features.slice(0, 4).map((feature, i) => (
                                                    <li key={i} className="flex items-center">
                                                        <Target size={14} className={`text-${course.color}-400 mr-2 flex-shrink-0`} />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                                {course.features.length > 4 && (
                                                    <li className="text-slate-400 text-xs">+{course.features.length - 4} more...</li>
                                                )}
                                            </ul>
                                            
                                            <button 
                                                onClick={course.action}
                                                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${getButtonClasses(course.color)}`}
                                            >
                                                {course.cta}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Show filtered programs
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {filteredPrograms.map((course, index) => (
                                <div key={index} className={`card p-6 border-2 transition-all duration-300 ${getColorClasses(course.color)}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{course.type}</span>
                                            <h4 className="text-xl font-bold text-white mt-1">{course.title}</h4>
                                        </div>
                                        <span className="text-lg font-bold text-blue-400">{course.duration}</span>
                                    </div>
                                    
                                    <p className="text-slate-300 text-sm mb-4">{course.description}</p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{course.level}</span>
                                        <span className="text-lg font-bold text-white">{course.price}</span>
                                    </div>
                                    
                                    <ul className="space-y-2 mb-6 text-sm text-slate-300">
                                        {course.features.map((feature, i) => (
                                            <li key={i} className="flex items-center">
                                                <Target size={14} className={`text-${course.color}-400 mr-2 flex-shrink-0`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <button 
                                        onClick={course.action}
                                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${getButtonClasses(course.color)}`}
                                    >
                                        {course.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Syllabus Request Modal */}
            <SyllabusRequestModal 
                isOpen={syllabusModal.isOpen}
                onClose={() => setSyllabusModal({ isOpen: false, course: '', type: '' })}
                courseTitle={syllabusModal.course}
                courseType={syllabusModal.type}
            />

            {/* Enrollment & Enquiry Modal */}
            <EnrollmentEnquiryModal 
                isOpen={enrollmentModal.isOpen}
                onClose={() => setEnrollmentModal({ isOpen: false, course: '', type: '', formType: 'enquiry' })}
                initialType={enrollmentModal.formType}
                courseTitle={enrollmentModal.course}
                courseType={enrollmentModal.type}
            />
        </>
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

const Trainers = () => {
    const [bio, setBio] = useState(null);
    const trainers = [
        { 
            name: 'Santosh Kumar', 
            role: 'Lead Trainer & Founder', 
            img: '/logo.png', 
            specialization: 'Cybersecurity & SOC Operations',
            experience: '8+ Years',
            certifications: ['CISSP', 'CEH', 'GCIH', 'GCFA'],
            bio: 'Santosh is a seasoned cybersecurity professional with over 8 years of hands-on experience in Security Operations Centers (SOC), Endpoint Detection & Response (EDR), and advanced threat hunting. As the founder of Agnidhra Technologies, he has successfully designed and implemented comprehensive training programs that bridge the gap between theoretical knowledge and real-world application.\n\nHis expertise spans across multiple domains including incident response, digital forensics, malware analysis, and security architecture. Santosh has worked with leading enterprises to strengthen their security posture and has trained over 500+ professionals who are now working in top-tier organizations.\n\nHe is passionate about mentoring the next generation of cybersecurity professionals and believes in hands-on, practical learning approaches. His training methodology focuses on real-world scenarios, ensuring students are job-ready from day one.',
            achievements: [
                'Trained 500+ cybersecurity professionals',
                'Designed 20+ hands-on lab environments',
                'Led incident response for 100+ security incidents',
                'Published research on advanced persistent threats'
            ]
        },
        { 
            name: 'Jeevan Kumar', 
            role: 'Co-Trainer | SOC Specialist', 
            img: '/logo.png', 
            specialization: 'Blue Team Operations & Incident Response',
            experience: '6+ Years',
            certifications: ['GCIH', 'GCFA', 'CySA+', 'Security+'],
            bio: 'Jeevan brings 6+ years of intensive experience in blue team operations and incident response from enterprise environments. He has worked extensively with Fortune 500 companies, handling complex security incidents and building robust defense mechanisms.\n\nHis expertise includes advanced SIEM technologies, log analysis, threat hunting, and digital forensics. Jeevan has been instrumental in developing incident response playbooks and has led critical security investigations that prevented major data breaches.\n\nAs a co-trainer at Agnidhra Technologies, Jeevan focuses on practical SOC analyst training, ensuring students understand real-world threat landscapes and response procedures. His teaching style emphasizes hands-on learning through simulated environments and real-world case studies.',
            achievements: [
                'Managed SOC operations for enterprise clients',
                'Developed incident response frameworks',
                'Expertise in SIEM platforms (Splunk, QRadar, ArcSight)',
                'Led threat hunting operations resulting in proactive threat detection'
            ]
        },
        { 
            name: 'Priyanka Sharma', 
            role: 'Senior Trainer | Full Stack & QA Expert', 
            img: '/logo.png', 
            specialization: 'Full Stack Development & Quality Assurance',
            experience: '7+ Years',
            certifications: ['ISTQB Advanced', 'AWS Certified Developer', 'Azure DevOps Expert', 'Scrum Master'],
            bio: 'Priyanka is a versatile technology professional with 7+ years of comprehensive experience spanning full stack web development and quality assurance across multiple industries. She has successfully led development teams at major IT companies and has expertise in both manual and automated testing methodologies.\n\nHer technical expertise covers modern web technologies including React, Angular, Node.js, Python, Java, and cloud platforms like AWS and Azure. In QA domain, she specializes in test automation frameworks, performance testing, API testing, and DevOps integration for continuous testing.\n\nAt Agnidhra Technologies, Priyanka leads the full stack development and QA testing programs, combining theoretical knowledge with hands-on project work. She focuses on industry best practices, agile methodologies, and modern development workflows to ensure students are ready for contemporary software development environments.',
            achievements: [
                'Trained 300+ developers and QA professionals',
                'Led full stack development for 50+ enterprise applications',
                'Designed comprehensive test automation frameworks',
                'Expert in CI/CD pipeline implementation and DevOps practices',
                'Published articles on modern testing strategies and development practices'
            ]
        }
    ];
    return (
        <section id="trainers" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <SectionTitle>Meet Your Trainers</SectionTitle>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trainers.map((t) => (
                        <div key={t.name} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-xl border border-slate-700 text-center hover:border-blue-500/50 transition-all duration-300">
                            <div className="relative">
                                <img src={t.img} alt={t.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500/50 shadow-lg" />
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                    {t.experience}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.name}</h3>
                            <p className="text-blue-400 font-semibold mb-2">{t.role}</p>
                            <p className="text-slate-300 text-sm mb-4">{t.specialization}</p>
                            
                            {/* Certifications */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {t.certifications.map((cert, index) => (
                                    <span key={index} className="text-xs bg-slate-700 text-blue-400 px-2 py-1 rounded-md font-medium">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setBio(t)} 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                                View Full Bio
                            </button>
                        </div>
                    ))}
                </div>

                {bio && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setBio(null)}>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e)=>e.stopPropagation()}>
                            {/* Header */}
                            <div className="flex items-center gap-6 mb-8">
                                <img src={bio.img} alt={bio.name} className="w-24 h-24 rounded-full border-4 border-blue-500/50" />
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-2">{bio.name}</h3>
                                    <p className="text-blue-400 font-semibold text-lg mb-2">{bio.role}</p>
                                    <p className="text-slate-300">{bio.specialization} • {bio.experience}</p>
                                </div>
                                <button 
                                    onClick={() => setBio(null)} 
                                    className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Certifications */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-white mb-3">Professional Certifications</h4>
                                <div className="flex flex-wrap gap-3">
                                    {bio.certifications.map((cert, index) => (
                                        <span key={index} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg font-medium border border-blue-500/30">
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-white mb-3">Professional Background</h4>
                                <div className="text-slate-300 leading-relaxed space-y-4">
                                    {bio.bio.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-white mb-3">Key Achievements</h4>
                                <ul className="space-y-2">
                                    {bio.achievements.map((achievement, index) => (
                                        <li key={index} className="flex items-center text-slate-300">
                                            <Target size={16} className="text-blue-400 mr-3 flex-shrink-0" />
                                            <span>{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-right">
                                <button 
                                    onClick={() => setBio(null)} 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    Close Bio
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
const Testimonials = () => {
    const items = [
        { quote: "The project-based approach was a game-changer for my career transition. Coming from a non-technical background, I was initially worried about keeping up with cybersecurity concepts. However, the structured curriculum and hands-on labs made complex topics like SIEM analysis, threat detection, and incident response incredibly easy to understand. The trainers provided real-world scenarios that prepared me for actual workplace challenges. Within two months of completing the SOC Analyst program, I successfully landed my first cybersecurity role. The job assistance and mock interviews were instrumental in building my confidence.", name: "Rohan Sharma", role: "SOC Analyst at TCS", company: "TCS", img: "https://placehold.co/50x50/0F172A/38BDF8?text=RS", rating: 5 },
        { quote: "What sets Agnidhra Technologies apart is their commitment to practical learning and industry-relevant training. The hands-on labs using cutting-edge security tools like Splunk, QRadar, and Wireshark gave me real-world experience before stepping into the job market. The trainers are not just educators but seasoned professionals who share their field experience and insider knowledge. The mentorship program extended beyond classroom hours, with personalized guidance on career development. The technical interviews became a breeze after the rigorous mock sessions. I'm now confidently handling security incidents and threat analysis in my role as a Cybersecurity Analyst.", name: "Anjali Patel", role: "Cybersecurity Analyst", company: "Infosys", img: "https://placehold.co/50x50/0F172A/F59E0B?text=AP", rating: 5 },
        { quote: "The comprehensive curriculum covered everything from network security fundamentals to advanced threat hunting techniques. The trainers maintained perfect balance between theoretical knowledge and practical implementation. What impressed me most was the individual attention given to each student's learning pace and career goals. The program included real-time project work on live environments, which gave me the confidence to handle production systems. The certification guidance and interview preparation sessions were exceptional. Today, as a Security Engineer, I apply the methodologies and best practices learned during the training in my daily work responsibilities.", name: "Kartik Verma", role: "Security Engineer", company: "Wipro", img: "https://placehold.co/50x50/0F172A/10B981?text=KV", rating: 5 },
        { quote: "The ethical hacking bootcamp was an intensive and transformative experience that opened doors to my dream career in penetration testing. The program covered advanced topics like web application security, network penetration testing, and vulnerability assessment using industry-standard tools like Metasploit, Burp Suite, and Nmap. The lab environment simulated real-world corporate networks, allowing us to practice attacks safely and understand defense mechanisms. The trainers' expertise in red team operations and their ability to explain complex exploitation techniques made learning enjoyable and effective. The career counseling and placement support helped me transition smoothly into the cybersecurity field.", name: "Priya Singh", role: "Penetration Tester", company: "Accenture", img: "https://placehold.co/50x50/0F172A/EF4444?text=PS", rating: 5 },
        { quote: "Starting from zero knowledge in cybersecurity to landing a well-paying role as an Information Security Analyst in just 4 months seemed impossible until I joined Agnidhra Technologies. The curriculum is meticulously designed to cover all aspects of information security including risk assessment, compliance frameworks like ISO 27001, incident response procedures, and security governance. The trainers provided personalized attention, ensuring no student was left behind. The industry connections and networking opportunities during the program were invaluable. The continuous support even after course completion, including job referrals and career guidance, demonstrates their commitment to student success.", name: "Amit Kumar", role: "Information Security Analyst", company: "HCL Technologies", img: "https://placehold.co/50x50/0F172A/8B5CF6?text=AK", rating: 5 },
        { quote: "The cloud security specialization program was comprehensive and perfectly timed with the industry's shift towards cloud infrastructure. The training covered AWS security services, Azure security center, Google Cloud security tools, and multi-cloud security strategies. The hands-on experience with cloud security configurations, identity and access management, and security monitoring tools was invaluable. The trainers' expertise in both traditional security and modern cloud architectures provided a holistic learning experience. The program's emphasis on practical implementations and real-world case studies prepared me thoroughly for my current role. The 40% salary increase I received after completion exceeded my expectations completely.", name: "Sneha Reddy", role: "Cloud Security Specialist", company: "Cognizant", img: "https://placehold.co/50x50/0F172A/F97316?text=SR", rating: 5 },
        { quote: "After researching multiple cybersecurity training institutes, I chose Agnidhra Technologies based on their reputation and comprehensive curriculum. It was the best investment I made for my career advancement. The trainers are industry veterans who bring real-world experience into the classroom, sharing insights from actual security incidents and breach investigations. The program structure balances theoretical foundations with extensive practical exercises, ensuring deep understanding of security concepts. The continuous assessment and feedback system helped track my progress effectively. The networking opportunities with fellow students and industry professionals expanded my professional circle significantly, leading to better career opportunities.", name: "Rahul Gupta", role: "SOC Team Lead", company: "Tech Mahindra", img: "https://placehold.co/50x50/0F172A/06B6D4?text=RG", rating: 5 },
        { quote: "The incident response training program was exceptionally well-structured, covering the complete incident response lifecycle from preparation to post-incident analysis. The simulation exercises using real-world attack scenarios helped me understand the pressure and decision-making required during actual security incidents. Learning digital forensics techniques, malware analysis, and evidence collection procedures with proper chain of custody was crucial for my current role. The trainers' experience in handling major security breaches provided valuable insights into enterprise-level incident response strategies. I now confidently lead incident response activities and coordinate with multiple stakeholders during critical security events.", name: "Kavya Nair", role: "Incident Response Analyst", company: "IBM", img: "https://placehold.co/50x50/0F172A/EC4899?text=KN", rating: 5 },
        { quote: "The comprehensive cybersecurity program covered every aspect I needed to become job-ready, from fundamental networking concepts to advanced security analytics. The curriculum included hands-on experience with security frameworks, compliance requirements, risk assessment methodologies, and security architecture design principles. What made the biggest difference was the dedicated job assistance program, which included resume building, interview preparation, and direct referrals to partner companies. The trainers maintained regular follow-ups even after course completion, providing guidance on career growth and professional development. The program's reputation in the industry opened doors to opportunities I wouldn't have accessed otherwise.", name: "Vikash Singh", role: "Security Consultant", company: "Deloitte", img: "https://placehold.co/50x50/0F172A/84CC16?text=VS", rating: 5 },
        { quote: "The digital forensics specialization was exactly what I needed to advance my career in cybersecurity investigations. The program covered computer forensics, mobile device forensics, network forensics, and cloud forensics using industry-standard tools like EnCase, FTK, and Volatility. The hands-on experience with evidence acquisition, analysis techniques, and report writing prepared me thoroughly for real-world investigations. Learning about legal aspects, chain of custody procedures, and expert witness testimony was crucial for my role. The trainers' experience in law enforcement and corporate investigations provided unique insights into different forensics scenarios. I'm now working with one of India's leading IT companies, handling complex digital investigations.", name: "Meera Joshi", role: "Digital Forensics Expert", company: "Capgemini", img: "https://placehold.co/50x50/0F172A/F59E0B?text=MJ", rating: 5 },
        { quote: "As a CISO, I needed comprehensive training for my entire security team to enhance our organizational security posture. Agnidhra Technologies provided excellent corporate training that was customized to our specific industry requirements and security challenges. The program covered security governance, risk management, compliance frameworks, and advanced threat detection techniques. The trainers worked closely with our team to understand our existing security infrastructure and provided practical recommendations for improvement. The training significantly enhanced our security operations capability, improved incident response times, and strengthened our overall security program. The ROI was evident within months of program completion.", name: "Suresh Menon", role: "CISO", company: "Leading Bank", img: "https://placehold.co/50x50/0F172A/3B82F6?text=SM", rating: 5 },
        { quote: "The practical approach to learning cybersecurity through Agnidhra Technologies transformed my understanding of security concepts completely. The hands-on labs using virtual environments simulated real-world attack scenarios, allowing us to practice both offensive and defensive techniques safely. Learning about different attack vectors, exploitation techniques, and defense mechanisms through practical exercises was far more effective than traditional theoretical learning. The program covered ethical hacking methodologies, penetration testing frameworks, and vulnerability assessment procedures comprehensively. The trainers' guidance helped me develop both technical skills and professional ethics required for cybersecurity roles. The practical knowledge gained directly applies to my daily responsibilities as an ethical hacker.", name: "Deepak Yadav", role: "Ethical Hacker", company: "Freelancer", img: "https://placehold.co/50x50/0F172A/EF4444?text=DY", rating: 5 },
        { quote: "Starting as a complete fresher with no prior experience in cybersecurity, the transformation journey through Agnidhra Technologies was remarkable and life-changing. The program began with fundamental IT concepts and gradually progressed to advanced security topics, ensuring a solid foundation before diving into complex areas. The structured learning path, combined with mentorship and regular assessments, kept me motivated and on track throughout the course. The practical projects, industry exposure, and soft skills training prepared me holistically for the professional world. The placement assistance was exceptional, with multiple interview opportunities and continuous support until job confirmation. Today, as a Security Analyst, I credit my success entirely to this comprehensive training program.", name: "Ritu Kumari", role: "Security Analyst", company: "L&T Infotech", img: "https://placehold.co/50x50/0F172A/8B5CF6?text=RK", rating: 5 }
    ];
    const [index, setIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    
    React.useEffect(() => {
        if (isPaused) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
        return () => clearInterval(id);
    }, [items.length, isPaused]);

    const current = items[index];
    
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}>
                ★
            </span>
        ));
    };
    return (
        <section id="testimonials" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>What Our Students Say</SectionTitle>
                <div className="text-center mb-12">
                    <p className="text-slate-300 text-lg">
                        Over 500+ students have transformed their careers with us
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 relative">
                        <p className="text-slate-300 italic mb-6">“{current.quote}”</p>
                        <div className="flex items-center">
                            <img src={current.img} alt={current.name} className="w-12 h-12 rounded-full mr-4"/>
                            <div>
                                <h4 className="font-bold text-white">{current.name}</h4>
                                <p className="text-blue-400 font-semibold">{current.role}</p>
                                <p className="text-slate-400 text-sm">{current.company}</p>
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

// New Programs Banner
const NewProgramsBanner = ({ onNavigate }) => (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                    🔥 NEW LAUNCH • HIGH DEMAND PROGRAMS
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Transform Your Career in Cybersecurity
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                    Choose your path: Fast-track bootcamp for immediate entry or premium mastery program for advanced certification
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {/* Defensive Bootcamp */}
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 border border-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    <div className="text-center mb-4">
                        <div className="inline-block bg-blue-600 rounded-full p-3 mb-3">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">SOC Bootcamp</h3>
                        <p className="text-blue-200 text-sm">7 Days • 100+ Students</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center text-blue-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>SOC Analyst Ready</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>SIEM Tools & Analysis</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white">₹499</div>
                        <div className="text-blue-200 text-sm">Early Bird Special</div>
                    </div>

                    <button
                        onClick={() => onNavigate('bootcampLanding')}
                        className="w-full bg-white text-blue-900 font-bold py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm"
                    >
                        Join Bootcamp →
                    </button>
                </div>

                {/* Defensive Premium */}
                <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 border border-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl relative">
                    <div className="absolute -top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                    </div>
                    
                    <div className="text-center mb-4">
                        <div className="inline-block bg-purple-600 rounded-full p-3 mb-3">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">SOC Mastery</h3>
                        <p className="text-purple-200 text-sm">2 Months • 20 Students</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center text-purple-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>Personal Mentor</span>
                        </div>
                        <div className="flex items-center text-purple-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>100+ Hours Training</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white">₹5,999</div>
                        <div className="text-purple-200 text-sm">Save ₹3,000</div>
                    </div>

                    <button
                        onClick={() => onNavigate('premiumProgram')}
                        className="w-full bg-white text-purple-900 font-bold py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 text-sm"
                    >
                        Reserve Seat →
                    </button>
                </div>

                {/* Offensive Bootcamp */}
                <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-6 border border-red-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    <div className="text-center mb-4">
                        <div className="inline-block bg-red-600 rounded-full p-3 mb-3">
                            <Sword className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Hacking Bootcamp</h3>
                        <p className="text-red-200 text-sm">7 Days • 80+ Hackers</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center text-red-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>Ethical Hacking</span>
                        </div>
                        <div className="flex items-center text-red-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>Pentesting Skills</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white">₹599</div>
                        <div className="text-red-200 text-sm">Early Bird Special</div>
                    </div>

                    <button
                        onClick={() => onNavigate('offensiveBootcampLanding')}
                        className="w-full bg-white text-red-900 font-bold py-3 rounded-lg hover:bg-red-50 transition-all duration-300 text-sm"
                    >
                        Join Hackers →
                    </button>
                </div>

                {/* Specialized Courses */}
                <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 border border-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    <div className="text-center mb-4">
                        <div className="inline-block bg-green-600 rounded-full p-3 mb-3">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Specialized</h3>
                        <p className="text-green-200 text-sm">11+ Courses • Niche Skills</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center text-green-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>Cloud Security</span>
                        </div>
                        <div className="flex items-center text-green-100">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>Digital Forensics</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white">₹2,999+</div>
                        <div className="text-green-200 text-sm">Various Durations</div>
                    </div>

                    <button
                        onClick={() => onNavigate('specializedCourses')}
                        className="w-full bg-white text-green-900 font-bold py-3 rounded-lg hover:bg-green-50 transition-all duration-300 text-sm"
                    >
                        Explore All →
                    </button>
                </div>
            </div>

            <div className="text-center mt-12">
                <p className="text-gray-300 text-lg mb-4">
                    🚀 <strong>Fast-Track Your Career</strong> • 📊 <strong>Proven Success Rate</strong> • 🏆 <strong>Industry Partnerships</strong>
                </p>
                <p className="text-gray-400">
                    Choose the program that fits your goals and timeline
                </p>
            </div>
        </div>
    </section>
);

// --- Main HomePage Component ---
export default function HomePage({ onNavigate }) {
    const [isFaqBotOpen, setIsFaqBotOpen] = useState(false);
    
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
            <CompanyIntro />
            <NewProgramsBanner onNavigate={onNavigate} />
            <CybersecurityMastery />
            <ProgramsOffering onNavigate={onNavigate} />
            <About />
            <WhyUs />
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
            <ScrollNavigation />
        </>
    );
}


