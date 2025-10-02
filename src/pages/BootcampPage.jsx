import React from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

export default function BootcampPage({ onNavigate, type }) {
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
                         
                         {/* Pricing Information */}
                         <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-sky-400 mb-2">
                                {type === 'defensive' ? '₹2,999' : '₹3,499'}
                            </div>
                            <div className="text-lg text-slate-400 line-through mb-2">
                                {type === 'defensive' ? '₹4,999' : '₹5,999'}
                            </div>
                            <div className="text-sm text-green-400 font-semibold">
                                Limited Time Offer - Save {type === 'defensive' ? '₹2,000' : '₹2,500'}!
                            </div>
                         </div>

                         <form action="https://formsubmit.co/9209e4394cef0efacaef254750017022" method="POST" className="space-y-4">
                            <input type="hidden" name="_subject" value={`New ${current.title} ENROLLMENT!`} />
                            <div><label htmlFor="bc-name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" id="bc-name" name="name" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                            <div><label htmlFor="bc-email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label><input type="email" id="bc-email" name="email" required className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500" /></div>
                            
                            <div className="space-y-3">
                                <button 
                                    type="button" 
                                    onClick={() => onNavigate(`accountActivation-${type}`)}
                                    className={`w-full bg-${current.accentColor}-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-${current.accentColor}-700 transition-colors duration-300`}
                                >
                                    Pay Now & Secure Your Spot
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="w-full bg-slate-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-slate-600 transition-colors duration-300"
                                >
                                    Request Info (Free)
                                </button>
                            </div>
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
}

