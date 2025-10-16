import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, Calendar, Home } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import siteConfig from '@/config/site.config.js';
import { pollPaymentStatus } from '@/services/payments.js';

export default function PaymentSuccessPage({ onNavigate }) {
    const location = useLocation();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const mtid = params.get('mtid') || params.get('merchantTransactionId');

        if (mtid) {
            // Poll our backend for order status written by PhonePe callback/verify endpoints
            (async () => {
                const result = await pollPaymentStatus(mtid, { timeoutMs: 45000, intervalMs: 1500 });
                setVerifying(false);
                if (result.success && result.data) {
                    const order = result.data;
                    setPaymentDetails({
                        paymentId: order.phonepe?.data?.transactionId || order.merchantTransactionId || mtid,
                        orderId: order.merchantTransactionId || mtid,
                        planName: order.notes?.description || 'Course Enrollment',
                        customerName: order.customer?.name || order.customer?.email || 'Student',
                        customerEmail: order.customer?.email || '',
                        amount: (order.amount || 0) / 100,
                        status: (order.status || 'SUCCESS').toString()
                    });
                } else {
                    // Fallback: show generic failure page
                    onNavigate('paymentFailed');
                }
            })();
        } else {
            // Legacy fallback: Retrieve payment details from localStorage (older flows)
            const storedDetails = localStorage.getItem('paymentDetails');
            if (storedDetails) {
                setPaymentDetails(JSON.parse(storedDetails));
            }
            setVerifying(false);
        }
    }, [location.search, onNavigate]);

    const handleDownloadReceipt = () => {
        if (!paymentDetails) return;
    const receiptContent = `
${siteConfig.brandName} - PAYMENT RECEIPT\n===============\n\nPayment ID: ${paymentDetails.paymentId}\nOrder ID: ${paymentDetails.orderId}\nCourse: ${paymentDetails.planName}\nStudent: ${paymentDetails.customerName}\nEmail: ${paymentDetails.customerEmail}\nAmount: ₹${paymentDetails.amount || ''}\nDate: ${new Date().toLocaleDateString()}\nStatus: PAID\n\nThank you for your enrollment!\n${siteConfig.legalName}\nSupport: ${siteConfig.supportEmail} | ${siteConfig.supportPhone}\n`;
        const element = document.createElement('a');
        const file = new Blob([receiptContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `receipt_${paymentDetails.paymentId}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const nextSteps = [
        { title: 'Check Your Email', description: 'You will receive course access details and joining instructions within 24 hours.', icon: Mail },
        { title: 'Mark Your Calendar', description: 'The bootcamp starts on the next Monday. You will receive the exact schedule via email.', icon: Calendar },
        { title: 'Join Our Community', description: 'Access our Discord/Slack community for peer support and networking.', icon: Home }
    ];

    if (verifying) {
        return (
            <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-300 mb-2">Verifying your payment…</h2>
                    <p className="text-slate-400">Please wait while we confirm your transaction.</p>
                </div>
            </div>
        );
    }

    if (!paymentDetails) {
        return (
            <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-300 mb-4">No Payment Information Found</h2>
                    <button onClick={() => onNavigate('home')} className="btn-primary px-6 py-3">Go to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-green bg-fixed text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-8">
                        <div className="bg-green-600 rounded-full p-6">
                            <CheckCircle size={64} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-green-400 text-center mb-4">Payment Successful!</h1>
                    
                    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Enrollment Confirmed</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div>
                                <h4 className="font-semibold text-slate-300 mb-2">Course Details</h4>
                                <p className="text-white font-medium">{paymentDetails.planName}</p>
                                <p className="text-slate-400">Student: {paymentDetails.customerName}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-slate-300 mb-2">Payment Information</h4>
                                <p className="text-white">Payment ID: <span className="font-mono text-sm">{paymentDetails.paymentId}</span></p>
                                <p className="text-slate-400">Order ID: <span className="font-mono text-sm">{paymentDetails.orderId}</span></p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-600">
                            <button onClick={handleDownloadReceipt} className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center mx-auto">
                                <Download size={20} className="mr-2" />
                                Download Receipt
                            </button>
                        </div>
                    </div>

                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">What Happens Next?</h3>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {nextSteps.map((step, index) => {
                                const IconComponent = step.icon;
                                return (
                                    <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-sky-600 rounded-full p-3 mr-4">
                                                <IconComponent size={24} className="text-white" />
                                            </div>
                                            <span className="bg-sky-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">{index + 1}</span>
                                        </div>
                                        <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                                        <p className="text-slate-300 text-sm">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 rounded-lg mb-8">
                        <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                        <p className="text-sky-100 mb-4">We're here to help you get started. Contact us if you have any questions.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={`mailto:${siteConfig.supportEmail}`} className="btn-secondary px-6 py-2">Email Support</a>
                            <a href={`tel:${siteConfig.supportPhone}`} className="bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-800 transition-colors">Call Support</a>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => onNavigate('home')} className="bg-slate-700 text-white px-8 py-3 rounded-lg hover:bg-slate-600 transition-colors">Back to Home</button>
                        <button onClick={() => window.open('https://discord.gg/agnidhra', '_blank')} className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors">Join Community</button>
                    </div>
                </div>
            </div>
        </div>
    );
}