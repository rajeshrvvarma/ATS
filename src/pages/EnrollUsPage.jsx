import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, BookOpen, Send, CheckCircle, GraduationCap, Target } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { createOrder, processPayment, verifyPayment } from '@/services/razorpay.js';

export default function EnrollUsPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        experience: 'beginner',
        background: '',
        goals: '',
        startDate: '',
        source: 'website'
    });
    const [submitted, setSubmitted] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentMsg, setPaymentMsg] = useState('');
    const [lastOrderId, setLastOrderId] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic would go here
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const courses = [
        { id: 'defensive', name: '7-Day Defensive Security Bootcamp', price: 'Starting ₹499' },
        { id: 'offensive', name: '7-Day Ethical Hacking Bootcamp', price: 'Starting ₹599' },
        { id: 'workshop', name: 'Free Cybersecurity Workshop', price: 'Free' },
        { id: 'custom', name: 'Custom Training Program', price: 'Contact for pricing' }
    ];

    const experienceLevels = [
        { id: 'beginner', name: 'Complete Beginner', description: 'New to cybersecurity' },
        { id: 'some', name: 'Some Experience', description: '1-2 years in IT/Security' },
        { id: 'intermediate', name: 'Intermediate', description: '3-5 years experience' },
        { id: 'advanced', name: 'Advanced', description: '5+ years in cybersecurity' }
    ];

    const benefits = [
        'Free career counseling session',
        'Course roadmap personalized for you',
        'Access to exclusive study materials',
        'Priority enrollment in upcoming batches',
        'Industry mentor assignment',
        'Job placement assistance'
    ];

    const handleTestPayment = async () => {
        try {
            setPaymentLoading(true);
            setPaymentMsg('');

            const order = await createOrder({ amount: 499, currency: 'INR' });
            setLastOrderId(order.id);

            const paymentResult = await processPayment({
                amount: order.amount,
                currency: order.currency,
                description: 'Demo Payment (Workshop Premium) ',
                orderId: order.id,
                customerName: formData.name || 'Demo User',
                customerEmail: formData.email || 'demo@example.com',
                customerPhone: formData.phone || '9999999999'
            });

            const valid = await verifyPayment({
                orderId: paymentResult.orderId,
                paymentId: paymentResult.paymentId,
                signature: paymentResult.signature
            });

            if (valid) {
                const details = {
                    paymentId: paymentResult.paymentId,
                    orderId: paymentResult.orderId,
                    planName: 'Premium Workshop Bundle',
                    customerName: formData.name || 'Demo User',
                    customerEmail: formData.email || 'demo@example.com'
                };
                localStorage.setItem('paymentDetails', JSON.stringify(details));
                setPaymentMsg('Payment successful and verified. Redirecting...');
                setTimeout(() => onNavigate('paymentSuccess'), 600);
            } else {
                const err = {
                    planName: 'Premium Workshop Bundle',
                    message: 'Signature verification failed'
                };
                localStorage.setItem('paymentError', JSON.stringify(err));
                setPaymentMsg('Verification failed. Redirecting...');
                setTimeout(() => onNavigate('paymentFailed'), 600);
            }
        } catch (e) {
            setPaymentMsg(e?.message || 'Payment was cancelled or failed.');
            const err = {
                planName: 'Premium Workshop Bundle',
                message: e?.message || 'Payment cancelled or failed'
            };
            localStorage.setItem('paymentError', JSON.stringify(err));
            setTimeout(() => onNavigate('paymentFailed'), 600);
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </button>

                <SectionTitle>Enroll in Our Programs</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                    Start your cybersecurity journey with personalized guidance
                </p>

                <div className="max-w-6xl mx-auto">
                    {submitted && (
                        <div className="mb-8 p-6 bg-green-900/30 border border-green-700 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-400 mr-4" />
                            <div>
                                <h3 className="text-green-300 font-semibold text-lg">Enrollment Request Submitted!</h3>
                                <p className="text-green-100">Our admissions team will contact you within 24 hours to discuss your personalized learning path.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Enrollment Form */}
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <GraduationCap size={24} className="mr-3 text-blue-400" />
                                Enrollment Form
                            </h2>

                            <form action="https://formsubmit.co/santosh.m@agnidhra-technologies.com" method="POST" className="space-y-6">
                                <input type="hidden" name="_subject" value="New Course Enrollment Request!" />
                                <input type="hidden" name="_next" value="https://yourdomain.com/enrollment-success" />
                                <input type="hidden" name="_captcha" value="false" />

                                {/* Personal Information */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="+91-9876543210"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="course" className="block text-sm font-medium text-slate-300 mb-2">
                                            Interested Course *
                                        </label>
                                        <select
                                            id="course"
                                            name="course"
                                            required
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select a course</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.name}>
                                                    {course.name} - {course.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">
                                        Current Experience Level *
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {experienceLevels.map(level => (
                                            <label key={level.id} className="flex items-start p-3 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value={level.id}
                                                    checked={formData.experience === level.id}
                                                    onChange={handleInputChange}
                                                    className="mt-1 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="ml-3">
                                                    <div className="text-white font-medium">{level.name}</div>
                                                    <div className="text-slate-400 text-sm">{level.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Background & Goals */}
                                <div>
                                    <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-2">
                                        Educational/Professional Background
                                    </label>
                                    <textarea
                                        id="background"
                                        name="background"
                                        rows={3}
                                        value={formData.background}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="Tell us about your current education or work experience..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="goals" className="block text-sm font-medium text-slate-300 mb-2">
                                        Career Goals & Expectations *
                                    </label>
                                    <textarea
                                        id="goals"
                                        name="goals"
                                        required
                                        rows={3}
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="What do you want to achieve with this course? What specific skills are you looking for?"
                                    ></textarea>
                                </div>

                                {/* Preferred Start Date */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-2">
                                            Preferred Start Date
                                        </label>
                                        <select
                                            id="startDate"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select timeline</option>
                                            <option value="immediate">Immediately (Next batch)</option>
                                            <option value="1month">Within 1 month</option>
                                            <option value="3months">Within 3 months</option>
                                            <option value="flexible">Flexible timing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="source" className="block text-sm font-medium text-slate-300 mb-2">
                                            How did you hear about us?
                                        </label>
                                        <select
                                            id="source"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="website">Website</option>
                                            <option value="social">Social Media</option>
                                            <option value="friend">Friend/Colleague</option>
                                            <option value="search">Google Search</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <button
                                        type="submit"
                                        className="btn-primary w-full py-4 shadow-lg flex items-center justify-center"
                                    >
                                        <Send size={20} className="mr-2" />
                                        Submit Enrollment Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleTestPayment}
                                        disabled={paymentLoading}
                                        className="btn-primary w-full py-4 shadow-lg"
                                    >
                                        {paymentLoading ? 'Processing…' : 'Pay via UPI (₹499)'}
                                    </button>
                                </div>
                                {paymentMsg && (
                                    <p className="text-sm text-slate-300 text-center mt-3">{paymentMsg}</p>
                                )}

                                <p className="text-xs text-slate-400 text-center">
                                    By submitting this form, you agree to be contacted by our admissions team via phone, email, or WhatsApp.
                                </p>
                            </form>
                        </div>

                        {/* Benefits & Next Steps */}
                        <div className="space-y-8">
                            {/* What Happens Next */}
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Target size={24} className="mr-3 text-sky-400" />
                                    What Happens Next?
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Personal Consultation</h4>
                                            <p className="text-slate-300 text-sm">Our admissions counselor will call you within 24 hours to understand your goals and recommend the best program.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Customized Learning Path</h4>
                                            <p className="text-slate-300 text-sm">We'll create a personalized curriculum based on your experience level and career objectives.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Enrollment & Payment</h4>
                                            <p className="text-slate-300 text-sm">Secure your spot with flexible payment options and get immediate access to pre-course materials.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Benefits */}
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h3 className="text-2xl font-bold text-white mb-6">Why Enroll Through This Form?</h3>
                                
                                <ul className="space-y-3">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-slate-300 text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact for Questions */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-center">
                                <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
                                <p className="text-sky-100 mb-4">
                                    Speak directly with our admissions team for personalized guidance.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <div className="font-semibold">Admissions Hotline</div>
                                        <div className="text-sm text-blue-200">+91-9160813700</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <div className="font-semibold">Email</div>
                                        <div className="text-sm text-blue-200">santosh.m@agnidhra-technologies.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Debug/Test Info (only visible in test mode keys) */}
                            {import.meta.env.VITE_RAZORPAY_KEY_ID && (
                                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 text-left">
                                    <div className="text-sm text-slate-300"><span className="font-semibold text-blue-300">Checkout Mode:</span> Using key {import.meta.env.VITE_RAZORPAY_KEY_ID}</div>
                                    {lastOrderId && <div className="text-sm text-slate-300 mt-1">Last order_id: {lastOrderId}</div>}
                                    {paymentMsg && <div className="text-sm text-slate-300 mt-1">Status: {paymentMsg}</div>}
                                    <div className="text-xs text-slate-400 mt-2">Tip: UPI is preferred. In Test Mode, you can use <span className="font-mono">success@razorpay</span> for instant success.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}