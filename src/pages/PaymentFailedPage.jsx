import React, { useEffect, useState } from 'react';
import { XCircle, RefreshCw, Mail, Phone, Home, ArrowLeft } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import siteConfig from '@/config/site.config.js';

export default function PaymentFailedPage({ onNavigate }) {
    const [errorDetails, setErrorDetails] = useState(null);

    useEffect(() => {
        // Retrieve error details from localStorage
        const storedError = localStorage.getItem('paymentError');
        if (storedError) {
            setErrorDetails(JSON.parse(storedError));
        }
    }, []);

    const handleRetryPayment = () => {
        // Clear the error and redirect back to activation page
        localStorage.removeItem('paymentError');
        onNavigate('accountActivation');
    };

    const commonIssues = [
        {
            issue: 'Insufficient Balance',
            solution: 'Check your account balance and ensure you have sufficient funds.'
        },
        {
            issue: 'Card Expired',
            solution: 'Verify your card expiry date and update with a valid card.'
        },
        {
            issue: 'Network Timeout',
            solution: 'Check your internet connection and try again.'
        },
        {
            issue: 'Bank Restrictions',
            solution: 'Contact your bank to enable online transactions or international payments.'
        },
        {
            issue: 'OTP Verification Failed',
            solution: 'Ensure you enter the OTP correctly within the time limit.'
        }
    ];

    const paymentMethods = [
        'Credit/Debit Cards (Visa, Mastercard, RuPay)',
        'Net Banking (All major banks)',
    'UPI (GPay, Paytm, etc.)',
        'Digital Wallets',
        'EMI Options (Selected cards)'
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

                <div className="max-w-4xl mx-auto">
                    {/* Error Icon */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-600 rounded-full p-6">
                                <XCircle size={64} className="text-white" />
                            </div>
                        </div>

                        <SectionTitle>Payment Failed</SectionTitle>
                        <p className="text-xl text-slate-300 -mt-8 mb-8">
                            We couldn't process your payment. Don't worry, no amount has been charged.
                        </p>
                    </div>

                    {/* Error Details */}
                    {errorDetails && (
                        <div className="bg-slate-800 rounded-lg p-6 border border-red-500/30 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Error Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-300">Course: <span className="text-white">{errorDetails.planName}</span></p>
                                    <p className="text-slate-300">Error: <span className="text-red-400">{errorDetails.message}</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-300">Time: <span className="text-white">{new Date().toLocaleString()}</span></p>
                                    <p className="text-slate-300">Status: <span className="text-red-400">Failed</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Retry Section */}
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <RefreshCw size={24} className="mr-3 text-sky-400" />
                                Try Again
                            </h3>
                            
                            <p className="text-slate-300 mb-6">
                                Most payment issues are temporary. You can retry your payment with the same or different payment method.
                            </p>

                            <div className="mb-6">
                                <h4 className="font-semibold text-white mb-3">Accepted Payment Methods:</h4>
                                <ul className="space-y-2">
                                    {paymentMethods.map((method, index) => (
                                        <li key={index} className="flex items-center text-slate-300">
                                            <div className="w-2 h-2 bg-sky-400 rounded-full mr-3"></div>
                                            {method}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={handleRetryPayment}
                                className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center"
                            >
                                <RefreshCw size={20} className="mr-2" />
                                Retry Payment
                            </button>
                        </div>

                        {/* Troubleshooting */}
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-6">Common Issues & Solutions</h3>
                            
                            <div className="space-y-4 mb-6">
                                {commonIssues.map((item, index) => (
                                    <div key={index} className="border-b border-slate-600 pb-4 last:border-b-0 last:pb-0">
                                        <h4 className="font-semibold text-white mb-2">{item.issue}</h4>
                                        <p className="text-slate-300 text-sm">{item.solution}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Support */}
                            <div className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                                <h4 className="font-semibold text-white mb-4">Still Having Issues?</h4>
                                <p className="text-slate-300 mb-4 text-sm">
                                    Our support team is available 24/7 to help you complete your enrollment.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={`mailto:${siteConfig.supportEmail}`}
                                        className="flex items-center justify-center bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors text-sm"
                                    >
                                        <Mail size={16} className="mr-2" />
                                        Email Support
                                    </a>
                                    <a
                                        href={`tel:${siteConfig.supportPhone}`}
                                        className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Phone size={16} className="mr-2" />
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alternative Options */}
                    <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Alternative Enrollment Options</h3>
                        <p className="text-purple-100 mb-4">
                            Can't complete online payment? We offer alternative ways to enroll in our programs.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Bank Transfer</h4>
                                <p className="text-sm text-purple-100">
                                    Make a direct bank transfer and share the transaction details with us.
                                </p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Offline Payment</h4>
                                <p className="text-sm text-purple-100">
                                    Visit our office or authorized centers for in-person enrollment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('home')}
                                className="bg-slate-700 text-white px-8 py-3 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center"
                            >
                                <Home size={20} className="mr-2" />
                                Back to Home
                            </button>
                            <button
                                onClick={handleRetryPayment}
                                className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center"
                            >
                                <RefreshCw size={20} className="mr-2" />
                                Try Payment Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}