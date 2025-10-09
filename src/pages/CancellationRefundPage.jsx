import React from 'react';
import { ArrowLeft, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import AnimatedBackground from '../components/AnimatedBackground';

export default function CancellationRefundPage({ onNavigate }) {
    const refundTimeline = [
        {
            period: "Before Course Start",
            timeframe: "Up to 7 days before course commencement",
            refundAmount: "100% refund",
            processingTime: "5-7 business days",
            icon: CheckCircle,
            color: "green"
        },
        {
            period: "Early Cancellation",
            timeframe: "3-6 days before course start",
            refundAmount: "75% refund",
            processingTime: "7-10 business days",
            icon: AlertTriangle,
            color: "yellow"
        },
        {
            period: "Late Cancellation",
            timeframe: "1-2 days before course start",
            refundAmount: "50% refund",
            processingTime: "10-14 business days",
            icon: Clock,
            color: "orange"
        },
        {
            period: "After Course Start",
            timeframe: "Course has already begun",
            refundAmount: "No refund",
            processingTime: "N/A",
            icon: XCircle,
            color: "red"
        }
    ];

    const eligibilityCriteria = [
        "Course cancellation request must be submitted in writing via email",
        "Original payment receipt or transaction ID must be provided",
        "Refund requests must include student's full name and registered email",
        "Course materials (if any) must be returned or access revoked",
        "Partial completion of course modules may affect refund eligibility"
    ];

    const nonRefundableItems = [
        "Processing fees and payment gateway charges",
        "Certificate fees (if certificate has been issued)",
        "Individual session recordings or materials already accessed",
        "Administrative costs for course setup",
        "Third-party tool licenses or subscriptions"
    ];

    return (
        <AnimatedBackground variant="contact" className="min-h-screen text-white">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <motion.button 
                    onClick={() => onNavigate('home')} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionTitle>Cancellation & Refund Policy</SectionTitle>
                    <p className="text-center text-xl text-slate-300 -mt-8 mb-12 max-w-4xl mx-auto">
                        Transparent and fair refund policy for all our courses
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Refund Timeline */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                            <RefreshCw size={24} className="mr-3 text-sky-400" />
                            Refund Timeline & Amounts
                        </h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {refundTimeline.map((item, index) => {
                                const IconComponent = item.icon;
                                const colorClasses = {
                                    green: "bg-green-600 text-green-100 border-green-500",
                                    yellow: "bg-yellow-600 text-yellow-100 border-yellow-500",
                                    orange: "bg-orange-600 text-orange-100 border-orange-500",
                                    red: "bg-red-600 text-red-100 border-red-500"
                                };
                                
                                return (
                                    <div key={index} className={`p-6 rounded-lg border-2 ${colorClasses[item.color]}`}>
                                        <div className="text-center mb-4">
                                            <IconComponent size={32} className="mx-auto mb-2" />
                                            <h3 className="font-bold text-lg">{item.period}</h3>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>When:</strong> {item.timeframe}</p>
                                            <p><strong>Refund:</strong> {item.refundAmount}</p>
                                            <p><strong>Processing:</strong> {item.processingTime}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* How to Request Refund */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">How to Request a Refund</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Send Email Request</h4>
                                        <p className="text-slate-300 text-sm">Email us at <strong>refunds@agnidhra.com</strong> with your cancellation request.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Provide Details</h4>
                                        <p className="text-slate-300 text-sm">Include full name, course name, payment ID, and reason for cancellation.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Await Confirmation</h4>
                                        <p className="text-slate-300 text-sm">We'll review and confirm your refund eligibility within 48 hours.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Receive Refund</h4>
                                        <p className="text-slate-300 text-sm">Refund will be processed to your original payment method.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Eligibility Criteria</h2>
                            
                            <ul className="space-y-3">
                                {eligibilityCriteria.map((criteria, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300 text-sm">{criteria}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Special Cases & Non-Refundable Items */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Non-Refundable Items</h2>
                            
                            <ul className="space-y-3">
                                {nonRefundableItems.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <XCircle size={16} className="text-red-400 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Special Circumstances</h2>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                                    <h4 className="font-semibold text-blue-300 mb-2">Medical Emergency</h4>
                                    <p className="text-slate-300 text-sm">Full refund available with valid medical documentation, regardless of timing.</p>
                                </div>
                                
                                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700">
                                    <h4 className="font-semibold text-purple-300 mb-2">Technical Issues</h4>
                                    <p className="text-slate-300 text-sm">If we cannot provide course access due to technical problems, full refund guaranteed.</p>
                                </div>
                                
                                <div className="p-4 bg-green-900/30 rounded-lg border border-green-700">
                                    <h4 className="font-semibold text-green-300 mb-2">Course Cancellation</h4>
                                    <p className="text-slate-300 text-sm">If we cancel or postpone a course, 100% refund or free transfer to next batch.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Need Help with Refunds?</h2>
                        <p className="text-sky-100 mb-6">
                            Our dedicated refund team is here to assist you with any questions or concerns.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Email</h4>
                                <p className="text-sm">refunds@agnidhra.com</p>
                                <p className="text-xs text-sky-200">Response within 24 hours</p>
                            </div>
                            
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Phone</h4>
                                <p className="text-sm">+91-9876543210</p>
                                <p className="text-xs text-sky-200">Mon-Fri, 9 AM - 6 PM IST</p>
                            </div>
                            
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">WhatsApp</h4>
                                <p className="text-sm">+91-9876543210</p>
                                <p className="text-xs text-sky-200">Quick support available</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-900/20 border border-yellow-700 p-6 rounded-lg">
                        <h3 className="text-yellow-300 font-semibold mb-4 flex items-center">
                            <AlertTriangle size={20} className="mr-2" />
                            Important Notes
                        </h3>
                        <ul className="text-yellow-100 space-y-2 text-sm">
                            <li>• Refunds will be processed to the original payment method used during purchase</li>
                            <li>• Bank processing times may vary and are not included in our refund timeline</li>
                            <li>• This policy is subject to change with 30 days notice to enrolled students</li>
                            <li>• Disputes will be handled according to Indian consumer protection laws</li>
                            <li>• Screenshots or proof of technical issues may be required for technical refunds</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AnimatedBackground>
    );
}