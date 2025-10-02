import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Users, Award, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { processPayment, createOrder, PAYMENT_PLANS } from '../services/razorpay';

export default function AccountActivationPage({ onNavigate, planType = 'defensiveBootcamp' }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        organization: ''
    });

    const plan = PAYMENT_PLANS[planType];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            const order = await createOrder({
                amount: plan.price,
                currency: plan.currency,
                receipt: `${planType}_${Date.now()}`
            });

            // Process payment
            const paymentResult = await processPayment({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                description: plan.description,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone
            });

            if (paymentResult.success) {
                // Store payment details in localStorage for success page
                localStorage.setItem('paymentDetails', JSON.stringify({
                    ...paymentResult,
                    planName: plan.name,
                    customerName: formData.name,
                    customerEmail: formData.email
                }));
                
                onNavigate('paymentSuccess');
            }
        } catch (error) {
            console.error('Payment failed:', error);
            // Store error details for failure page
            localStorage.setItem('paymentError', JSON.stringify({
                message: error.message || 'Payment failed',
                planName: plan.name
            }));
            
            onNavigate('paymentFailed');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        'Live interactive sessions with industry experts',
        'Hands-on labs and practical exercises',
        'Course materials and resources',
        'Certificate of completion',
        'Lifetime access to course materials',
        '24/7 community support',
        'Job placement assistance',
        'Real-world project experience'
    ];

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Programs
                </button>

                <SectionTitle>Account Activation</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                    Complete your enrollment for {plan.name}
                </p>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Payment Form */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Secure Payment</h3>
                            <div className="flex items-center justify-center text-slate-300">
                                <Shield size={20} className="mr-2 text-green-400" />
                                SSL Secured & PCI Compliant
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-600 mb-6">
                            <h4 className="text-lg font-semibold text-white mb-2">{plan.name}</h4>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-sky-400">₹{plan.price.toLocaleString()}</span>
                                    {plan.originalPrice > plan.price && (
                                        <span className="text-lg text-slate-400 line-through ml-2">
                                            ₹{plan.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {plan.originalPrice > plan.price && (
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                                        Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-1">
                                    Organization (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-sky-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} className="mr-2" />
                                        Pay ₹{plan.price.toLocaleString()} & Activate Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-4 text-xs text-slate-400 text-center">
                            By proceeding, you agree to our{' '}
                            <button 
                                onClick={() => onNavigate('terms')}
                                className="text-sky-400 hover:text-sky-300"
                            >
                                Terms of Service
                            </button>
                            {', '}
                            <button 
                                onClick={() => onNavigate('privacy')}
                                className="text-sky-400 hover:text-sky-300"
                            >
                                Privacy Policy
                            </button>
                            {', and '}
                            <button 
                                onClick={() => onNavigate('cancellationRefund')}
                                className="text-sky-400 hover:text-sky-300"
                            >
                                Refund Policy
                            </button>
                        </div>
                    </div>

                    {/* Benefits & Features */}
                    <div className="space-y-8">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <Award size={24} className="mr-3 text-yellow-400" />
                                What's Included
                            </h3>
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <Users size={24} className="mr-3" />
                                <h3 className="text-xl font-bold">Join 1000+ Successful Students</h3>
                            </div>
                            <p className="text-sky-100 mb-4">
                                Our graduates are working at top companies like TCS, Wipro, Infosys, and leading startups.
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">95%</div>
                                    <div className="text-sm text-sky-200">Job Placement Rate</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">4.8/5</div>
                                    <div className="text-sm text-sky-200">Student Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}