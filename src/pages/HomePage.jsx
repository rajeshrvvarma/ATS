import React, { useState } from 'react';
import { Shield, Users, Target, Code, Sparkles, X, Briefcase, Award, MessageCircle, Server, BrainCircuit } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle.jsx';
import AiCareerAdvisor from '@/components/AiCareerAdvisor.jsx';
import AiFaqBot from '@/components/AiFaqBot.jsx';
import SpecializedTrainingModal from '@/components/SpecializedTrainingModal.jsx';
import SyllabusRequestModal from '@/components/SyllabusRequestModal.jsx';
import EnrollmentEnquiryModal from '@/components/EnrollmentEnquiryModal.jsx';
import { callGeminiAPI } from '@/api/gemini.js';

// --- Sub-components specific to HomePage ---

// Company Introduction Section (1st Section)
const CompanyIntro = () => {
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    
    return (
        <>
            <AiCareerAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
            <section id="home" className="py-24 md:py-32 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="container mx-auto px-6">
                    {/* Company Logo */}
                    <div className="flex justify-center items-center mb-8">
                        <img src="/logo.png" alt="Agnidhra Technologies" className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl" />
                    </div>
                    
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
                    title: "Free Cybersecurity Workshop",
                    duration: "2 Hours",
                    type: "Online Live Session",
                    description: "Introduction to cybersecurity landscape, career paths, and industry opportunities.",
                    features: ["Career Guidance", "Industry Overview", "Live Q&A Session", "Free Certificate"],
                    level: "Beginner",
                    price: "Free",
                    cta: "Register Now",
                    action: () => onNavigate('workshop'),
                    color: "green"
                }
            ]
        },
        defensive: {
            title: "Defensive Security Programs",
            subtitle: "Become a SOC Analyst & Incident Response Expert",
            courses: [
                {
                    title: "SOC Analyst Bootcamp",
                    duration: "7 Days",
                    type: "Intensive Training",
                    description: "Fast-track program covering essential SOC analyst skills and tools.",
                    features: ["SIEM Tools", "Log Analysis", "Incident Response", "Threat Detection"],
                    level: "Beginner to Intermediate",
                    price: "₹15,000",
                    cta: "Enroll Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'SOC Analyst Bootcamp', type: 'defensive', formType: 'enrollment' }),
                    color: "blue"
                },
                {
                    title: "Complete SOC Analyst Program",
                    duration: "2 Months",
                    type: "Comprehensive Training",
                    description: "In-depth training to become job-ready SOC analyst with hands-on projects.",
                    features: ["Advanced SIEM", "Digital Forensics", "Malware Analysis", "Capstone Project", "Job Assistance"],
                    level: "Intermediate to Advanced",
                    price: "₹45,000",
                    cta: "Get Syllabus",
                    action: () => setSyllabusModal({ isOpen: true, course: 'Complete SOC Analyst Program', type: 'defensive' }),
                    color: "blue"
                }
            ]
        },
        offensive: {
            title: "Offensive Security Programs",
            subtitle: "Master Ethical Hacking & Penetration Testing",
            courses: [
                {
                    title: "Ethical Hacking Bootcamp",
                    duration: "7 Days",
                    type: "Intensive Training",
                    description: "Learn the fundamentals of ethical hacking and penetration testing.",
                    features: ["Kali Linux", "Network Scanning", "Web App Testing", "Exploitation Basics"],
                    level: "Beginner to Intermediate",
                    price: "₹18,000",
                    cta: "Enroll Now",
                    action: () => setEnrollmentModal({ isOpen: true, course: 'Ethical Hacking Bootcamp', type: 'offensive', formType: 'enrollment' }),
                    color: "red"
                },
                {
                    title: "Advanced Penetration Testing",
                    duration: "2 Months",
                    type: "Professional Training",
                    description: "Comprehensive penetration testing program with real-world scenarios.",
                    features: ["Advanced Exploitation", "Red Team Tactics", "Report Writing", "Live Projects", "Certification Prep"],
                    level: "Advanced",
                    price: "₹55,000",
                    cta: "Get Syllabus", 
                    action: () => setSyllabusModal({ isOpen: true, course: 'Advanced Penetration Testing', type: 'offensive' }),
                    color: "red"
                }
            ]
        },
        specialized: {
            title: "Specialized Training Programs",
            subtitle: "Advanced & Custom Training Solutions",
            courses: [
                {
                    title: "Cloud Security Specialist",
                    duration: "6 Weeks",
                    type: "Specialized Training",
                    description: "Master cloud security across AWS, Azure, and GCP platforms.",
                    features: ["Multi-Cloud Security", "IAM & Compliance", "Container Security", "DevSecOps"],
                    level: "Intermediate",
                    price: "₹35,000",
                    cta: "Get Details",
                    action: () => setSyllabusModal({ isOpen: true, course: 'Cloud Security Specialist', type: 'specialized' }),
                    color: "purple"
                },
                {
                    title: "Corporate Training",
                    duration: "Customizable",
                    type: "Enterprise Solution",
                    description: "Tailored cybersecurity training programs for organizations and teams.",
                    features: ["Custom Curriculum", "On-site Training", "Team Assessments", "Ongoing Support"],
                    level: "All Levels",
                    price: "Contact Us",
                    cta: "Enquire Now",
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

const Admissions = () => (
    <section id="admissions" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
            <SectionTitle>Admissions</SectionTitle>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="card p-6 text-center">
                    <div className="mx-auto w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">1</div>
                    <h3 className="text-lg font-bold text-white mb-1">Apply</h3>
                    <p className="text-slate-400 text-sm">Tell us your goals and pick a program.</p>
                    </div>
                <div className="card p-6 text-center">
                    <div className="mx-auto w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">2</div>
                    <h3 className="text-lg font-bold text-white mb-1">Free Demo</h3>
                    <p className="text-slate-400 text-sm">Experience a live session and get your roadmap.</p>
                    </div>
                <div className="card p-6 text-center">
                    <div className="mx-auto w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">3</div>
                    <h3 className="text-lg font-bold text-white mb-1">Enroll</h3>
                    <p className="text-slate-400 text-sm">Secure your seat and start learning.</p>
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

const Trainers = () => {
    const [bio, setBio] = useState(null);
    const trainers = [
        { name: 'Santosh Kumar', role: 'Lead Trainer & Founder', img: '/logo.png', bio: '8+ years across SOC, EDR, and threat hunting. Built multiple hands‑on labs and capstones.' },
        { name: 'Jeevan Kumar', role: 'Co‑Trainer | SOC Certified', img: '/logo.png', bio: '6+ years in blue team operations and incident response with enterprise experience.' }
    ];
    return (
        <section id="trainers" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <SectionTitle>Meet Your Trainers</SectionTitle>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {trainers.map((t) => (
                        <div key={t.name} className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                            <img src={t.img} alt={t.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600" />
                            <h3 className="text-2xl font-bold text-white">{t.name}</h3>
                            <p className="text-blue-400 font-semibold mb-3">{t.role}</p>
                            <button onClick={() => setBio(t)} className="btn-secondary px-4 py-2">Read bio</button>
                        </div>
                    ))}
                </div>

                {bio && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setBio(null)}>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6" onClick={(e)=>e.stopPropagation()}>
                            <div className="flex items-center gap-4 mb-4">
                                <img src={bio.img} alt={bio.name} className="w-16 h-16 rounded-full border-2 border-slate-600" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">{bio.name}</h3>
                                    <p className="text-slate-300 text-sm">{bio.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-300 mb-6">{bio.bio}</p>
                            <div className="text-right">
                                <button onClick={() => setBio(null)} className="btn-primary px-4 py-2">Close</button>
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
            <CompanyIntro />
            <CybersecurityMastery />
            <ProgramsOffering onNavigate={onNavigate} />
            <About />
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


