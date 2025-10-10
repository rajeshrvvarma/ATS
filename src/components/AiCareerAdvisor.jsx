import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Target, TrendingUp, DollarSign, MapPin, Clock, Brain, Award, Lightbulb } from 'lucide-react';
// Corrected the import path to be relative
import { callGeminiAPI } from '../api/gemini.js';

export default function AiCareerAdvisor({ isOpen, onClose }) {
    const [interests, setInterests] = useState('');
    const [experience, setExperience] = useState('beginner');
    const [location, setLocation] = useState('');
    const [advice, setAdvice] = useState('');
    const [skillGapAnalysis, setSkillGapAnalysis] = useState('');
    const [careerRoadmap, setCareerRoadmap] = useState('');
    const [salaryInsights, setSalaryInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('advice');
    const modalRef = useRef();

    // Effect to handle clicks outside the modal to close it
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
        
        // Clear previous results
        setAdvice('');
        setSkillGapAnalysis('');
        setCareerRoadmap('');
        setSalaryInsights('');

        const baseContext = `Student Profile:
- Interests: ${interests}
- Experience Level: ${experience}
- Location: ${location || 'Not specified'}`;

        // Get comprehensive career advice
        const advicePrompt = "You are a senior cybersecurity career advisor for Agnidhra Technologies. Based on the student's profile, recommend the most suitable cybersecurity career path (Defensive Security/SOC Analyst, Offensive Security/Ethical Hacking, or other specialized areas). Provide specific reasoning, required skills, and career prospects. Keep response structured and actionable (3-4 paragraphs).";
        
        const skillGapPrompt = "As a cybersecurity training expert, analyze the skill gaps for this student's chosen career path. List 5-7 specific technical skills they should develop, current industry demands, and learning priorities. Format as bullet points with brief explanations.";
        
        const roadmapPrompt = "Create a detailed 12-month career roadmap for this cybersecurity student. Include monthly milestones, certifications to pursue, practical projects, and skill development phases. Format as a structured timeline with specific actionable goals.";
        
        const salaryPrompt = "Provide realistic salary insights for cybersecurity careers in their location/experience level. Include entry-level ranges, mid-career progression, and factors affecting compensation. Mention relevant certifications that boost earning potential. Be specific with numbers where possible.";

        try {
            // Run all API calls in parallel for better performance
            const [adviceResult, skillGapResult, roadmapResult, salaryResult] = await Promise.all([
                callGeminiAPI(baseContext, advicePrompt),
                callGeminiAPI(baseContext, skillGapPrompt),
                callGeminiAPI(baseContext, roadmapPrompt),
                callGeminiAPI(baseContext, salaryPrompt)
            ]);

            setAdvice(adviceResult);
            setSkillGapAnalysis(skillGapResult);
            setCareerRoadmap(roadmapResult);
            setSalaryInsights(salaryResult);
        } catch (error) {
            console.error('Career analysis failed:', error);
            setAdvice('Sorry, we encountered an issue generating your career guidance. Please try again.');
        }
        
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full relative flex flex-col max-h-[90vh]">
                {/* Header (not scrollable) */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-sky-400 w-8 h-8" />
                        {/* Corrected the typo from <hh2> to <h2> */}
                        <h2 className="text-2xl font-bold text-white">AI Career Advisor</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Content (scrollable) */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-slate-300 mb-6">Get personalized cybersecurity career guidance powered by AI. Tell us about yourself and receive comprehensive career insights!</p>
                    
                    {/* Input Form */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Interests & Goals</label>
                            <textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="e.g., 'I enjoy solving puzzles and finding system vulnerabilities' or 'I want to protect companies from cyber threats and analyze security incidents'"
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500 h-24 resize-none"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                                <select
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                    disabled={isLoading}
                                >
                                    <option value="beginner">Complete Beginner</option>
                                    <option value="some-knowledge">Some IT Knowledge</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="experienced">Experienced Professional</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Location (Optional)</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Bangalore, Mumbai, Remote"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={getAdvice}
                        disabled={isLoading || !interests.trim()}
                        className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Analyzing Your Profile...
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5" />
                                Get Career Guidance
                            </>
                        )}
                    </button>

                    {/* Results Tabs */}
                    {advice && (
                        <div className="mt-8">
                            <div className="flex space-x-1 mb-4 bg-slate-900/50 p-1 rounded-lg">
                                {[
                                    { id: 'advice', label: 'Career Path', icon: Target },
                                    { id: 'skills', label: 'Skill Gap', icon: TrendingUp },
                                    { id: 'roadmap', label: 'Roadmap', icon: MapPin },
                                    { id: 'salary', label: 'Salary', icon: DollarSign }
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                                            activeTab === id
                                                ? 'bg-sky-600 text-white'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                                {activeTab === 'advice' && advice && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-5 h-5 text-sky-400" />
                                            <h3 className="text-lg font-semibold text-white">Recommended Career Path</h3>
                                        </div>
                                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{advice}</div>
                                    </div>
                                )}

                                {activeTab === 'skills' && skillGapAnalysis && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                            <h3 className="text-lg font-semibold text-white">Skill Gap Analysis</h3>
                                        </div>
                                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{skillGapAnalysis}</div>
                                    </div>
                                )}

                                {activeTab === 'roadmap' && careerRoadmap && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <MapPin className="w-5 h-5 text-purple-400" />
                                            <h3 className="text-lg font-semibold text-white">12-Month Career Roadmap</h3>
                                        </div>
                                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{careerRoadmap}</div>
                                    </div>
                                )}

                                {activeTab === 'salary' && salaryInsights && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <DollarSign className="w-5 h-5 text-yellow-400" />
                                            <h3 className="text-lg font-semibold text-white">Salary Insights</h3>
                                        </div>
                                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{salaryInsights}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

