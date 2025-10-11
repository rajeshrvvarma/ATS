import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock, Users, AlertTriangle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

export default function PrivacyPage({ onNavigate }) {
    const dataTypes = [
        {
            category: "Personal Information",
            icon: Users,
            items: ["Full name and contact details", "Email address and phone number", "Educational background", "Payment information", "Course preferences"]
        },
        {
            category: "Technical Data",
            icon: Database,
            items: ["IP address and device information", "Browser type and version", "Course access logs", "Learning progress data", "System performance metrics"]
        },
        {
            category: "Usage Information",
            icon: Eye,
            items: ["Course completion rates", "Time spent on modules", "Quiz and assignment scores", "Forum participation", "Feature usage patterns"]
        }
    ];

    const dataUsage = [
        {
            purpose: "Course Delivery",
            description: "Providing access to courses, tracking progress, and personalizing learning experience",
            icon: Shield,
            retention: "Duration of course + 2 years"
        },
        {
            purpose: "Communication",
            description: "Sending course updates, notifications, and educational content via email/SMS",
            icon: Eye,
            retention: "Until unsubscribed"
        },
        {
            purpose: "Payment Processing",
            description: "Processing payments, generating invoices, and maintaining transaction records",
            icon: Lock,
            retention: "7 years (legal requirement)"
        },
        {
            purpose: "Service Improvement",
            description: "Analyzing usage patterns to improve course quality and platform performance",
            icon: Database,
            retention: "3 years (anonymized)"
        }
    ];

    const userRights = [
        "Access your personal data and obtain a copy",
        "Rectify inaccurate or incomplete information",
        "Delete your personal data (subject to legal obligations)",
        "Restrict or object to certain processing activities",
        "Data portability to another service provider",
        "Withdraw consent for marketing communications"
    ];

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </button>

                <SectionTitle>Privacy Policy</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                    How we collect, use, and protect your personal information
                </p>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Overview */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Shield size={24} className="mr-3 text-sky-400" />
                            Our Privacy Commitment
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-slate-300 mb-4">
                                    At Agnidhra Technologies, we are committed to protecting your privacy and ensuring 
                                    the security of your personal information. This privacy policy explains how we collect, 
                                    use, and safeguard your data when you use our cybersecurity training platform.
                                </p>
                                <p className="text-slate-300">
                                    We comply with applicable data protection laws including the Information Technology 
                                    Act, 2000 and follow international best practices for data security.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-green-900/30 rounded-lg border border-green-700">
                                    <Lock size={20} className="text-green-400 mr-3" />
                                    <span className="text-green-100 text-sm">SSL Encryption for all data transmission</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                                    <Database size={20} className="text-blue-400 mr-3" />
                                    <span className="text-blue-100 text-sm">Secure cloud storage with regular backups</span>
                                </div>
                                <div className="flex items-center p-4 bg-purple-900/30 rounded-lg border border-purple-700">
                                    <Shield size={20} className="text-purple-400 mr-3" />
                                    <span className="text-purple-100 text-sm">Regular security audits and updates</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Collection */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8">Information We Collect</h2>
                        
                        <div className="grid lg:grid-cols-3 gap-6">
                            {dataTypes.map((type, index) => {
                                const IconComponent = type.icon;
                                return (
                                    <div key={index} className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                                        <div className="flex items-center mb-4">
                                            <IconComponent size={24} className="text-sky-400 mr-3" />
                                            <h3 className="font-bold text-white">{type.category}</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {type.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="text-slate-300 text-sm flex items-start">
                                                    <div className="w-2 h-2 bg-sky-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* How We Use Data */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8">How We Use Your Information</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {dataUsage.map((usage, index) => {
                                const IconComponent = usage.icon;
                                return (
                                    <div key={index} className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                                        <div className="flex items-start">
                                            <IconComponent size={24} className="text-sky-400 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-bold text-white mb-2">{usage.purpose}</h3>
                                                <p className="text-slate-300 text-sm mb-3">{usage.description}</p>
                                                <div className="text-xs text-slate-400">
                                                    <strong>Retention:</strong> {usage.retention}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data Sharing */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Data Sharing & Third Parties</h2>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-green-900/30 rounded-lg border border-green-700">
                                    <h4 className="font-semibold text-green-300 mb-2">✓ We DO Share With:</h4>
                                    <ul className="text-green-100 text-sm space-y-1">
                                        <li>• Payment processors or UPI apps for transactions</li>
                                        <li>• Email services for course communications</li>
                                        <li>• Cloud providers for secure data storage</li>
                                        <li>• Analytics tools (anonymized data only)</li>
                                    </ul>
                                </div>
                                
                                <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
                                    <h4 className="font-semibold text-red-300 mb-2">✗ We NEVER Share With:</h4>
                                    <ul className="text-red-100 text-sm space-y-1">
                                        <li>• Marketing companies or advertisers</li>
                                        <li>• Data brokers or third-party sellers</li>
                                        <li>• Social media platforms</li>
                                        <li>• Unrelated commercial entities</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Your Rights & Controls</h2>
                            
                            <ul className="space-y-3">
                                {userRights.map((right, index) => (
                                    <li key={index} className="flex items-start">
                                        <Shield size={16} className="text-sky-400 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300 text-sm">{right}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-6 p-4 bg-sky-900/30 rounded-lg border border-sky-700">
                                <p className="text-sky-100 text-sm">
                                    <strong>Exercise Your Rights:</strong> Contact our privacy team at 
                                    <strong> privacy@agnidhra.com</strong> to request access, correction, 
                                    or deletion of your personal data.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Measures */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8">Security Measures</h2>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Lock size={32} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Encryption</h3>
                                <p className="text-slate-300 text-sm">
                                    All data is encrypted in transit (SSL/TLS) and at rest using industry-standard AES-256 encryption.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Shield size={32} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Access Control</h3>
                                <p className="text-slate-300 text-sm">
                                    Strict access controls with multi-factor authentication and role-based permissions for all staff.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Eye size={32} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Monitoring</h3>
                                <p className="text-slate-300 text-sm">
                                    24/7 security monitoring with automated threat detection and regular penetration testing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cookies & Tracking */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Cookies & Tracking Technologies</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-white mb-4">Essential Cookies</h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    Required for basic website functionality, authentication, and security. 
                                    These cannot be disabled.
                                </p>
                                <ul className="text-slate-400 text-xs space-y-1">
                                    <li>• Session management</li>
                                    <li>• Authentication tokens</li>
                                    <li>• Security preferences</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-white mb-4">Analytics Cookies</h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    Help us understand how you use our platform to improve user experience. 
                                    You can opt out anytime.
                                </p>
                                <ul className="text-slate-400 text-xs space-y-1">
                                    <li>• Page views and navigation</li>
                                    <li>• Feature usage statistics</li>
                                    <li>• Performance metrics</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Updates */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">Privacy Questions?</h2>
                            <p className="text-sky-100 mb-6">
                                Our dedicated privacy team is here to address any concerns about your data protection.
                            </p>
                            
                            <div className="space-y-3">
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <div className="font-semibold">Email</div>
                                    <div className="text-sm text-sky-200">privacy@agnidhra.com</div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <div className="font-semibold">Data Protection Officer</div>
                                    <div className="text-sm text-sky-200">dpo@agnidhra.com</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Policy Updates</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <AlertTriangle size={20} className="text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-slate-300 text-sm mb-2">
                                            We may update this privacy policy from time to time to reflect changes 
                                            in our practices or legal requirements.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                                    <h4 className="font-semibold text-blue-300 mb-2">Notification Process</h4>
                                    <ul className="text-blue-100 text-sm space-y-1">
                                        <li>• Email notification for significant changes</li>
                                        <li>• 30 days notice before implementation</li>
                                        <li>• Continued use implies acceptance</li>
                                    </ul>
                                </div>
                            </div>
                            
                                <div className="mt-6 text-center">
                                <div className="text-slate-400 text-sm">Last Updated: October 11, 2025</div>
                                <div className="text-slate-400 text-sm">Version 2.2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}