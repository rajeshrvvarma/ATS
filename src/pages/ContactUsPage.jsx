import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

export default function ContactUsPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

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

    const contactMethods = [
        {
            icon: Phone,
            title: "Phone Support",
            primary: "+91-9160813700",
            secondary: "Mon-Fri, 9 AM - 6 PM IST",
            description: "Immediate assistance for urgent queries"
        },
        {
            icon: Mail,
            title: "Email Support",
            primary: "santosh.m@agnidhra-technologies.com",
            secondary: "Response within 24 hours",
            description: "Detailed queries and documentation"
        },
        {
            icon: MessageSquare,
            title: "WhatsApp",
            primary: "+91-9160813700",
            secondary: "Quick responses available",
            description: "Instant messaging for quick questions"
        }
    ];

    const departments = [
        {
            department: "Admissions",
            email: "santosh.m@agnidhra-technologies.com",
            phone: "+91-9160813700",
            description: "Course enrollment, pricing, and schedules"
        },
        {
            department: "Technical Support",
            email: "santosh.m@agnidhra-technologies.com",
            phone: "+91-9160813700",
            description: "Platform access, lab issues, and technical problems"
        },
        {
            department: "Payments & Billing",
            email: "santosh.m@agnidhra-technologies.com",
            phone: "+91-9160813700",
            description: "Payment issues, refunds, and invoices"
        },
        {
            department: "Career Services",
            email: "santosh.m@agnidhra-technologies.com",
            phone: "+91-9160813700",
            description: "Job placement, resume help, and interview prep"
        }
    ];

    const faqs = [
        {
            question: "How do I access my course after payment?",
            answer: "You'll receive login credentials within 24 hours of payment confirmation via email."
        },
        {
            question: "Can I get a refund if I'm not satisfied?",
            answer: "Yes, we offer refunds based on our cancellation policy. Full details are available on our refund page."
        },
        {
            question: "Are there any prerequisites for the courses?",
            answer: "Basic computer knowledge is helpful, but our courses are designed for beginners to advanced learners."
        },
        {
            question: "Do you provide job placement assistance?",
            answer: "Yes, we have dedicated career services including resume review, interview prep, and job placement assistance."
        }
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

                <SectionTitle>Contact Us</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                    Get in touch with our team for any questions or support
                </p>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Contact Methods */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {contactMethods.map((method, index) => {
                            const IconComponent = method.icon;
                            return (
                                <div key={index} className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                                    <div className="bg-sky-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <IconComponent size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                                    <div className="text-sky-400 font-semibold mb-1">{method.primary}</div>
                                    <div className="text-slate-400 text-sm mb-3">{method.secondary}</div>
                                    <p className="text-slate-300 text-sm">{method.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Form */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <Send size={24} className="mr-3 text-sky-400" />
                                Send us a Message
                            </h2>
                            
                            {submitted && (
                                <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-center">
                                    <CheckCircle size={20} className="text-green-400 mr-3" />
                                    <span className="text-green-100">Thank you! Your message has been sent successfully.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
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
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
                                            Query Category
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="admissions">Course Admissions</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="payments">Payment Issues</option>
                                            <option value="careers">Career Services</option>
                                            <option value="partnerships">Partnerships</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="block w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="Please provide as much detail as possible..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-sky-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-sky-700 transition-colors duration-300 flex items-center justify-center"
                                >
                                    <Send size={20} className="mr-2" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Department Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6">Department Contacts</h2>
                                
                                <div className="space-y-4">
                                    {departments.map((dept, index) => (
                                        <div key={index} className="p-4 bg-slate-900 rounded-lg border border-slate-600">
                                            <h3 className="font-semibold text-sky-400 mb-2">{dept.department}</h3>
                                            <p className="text-slate-300 text-sm mb-3">{dept.description}</p>
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center text-slate-400">
                                                    <Mail size={14} className="mr-2" />
                                                    {dept.email}
                                                </div>
                                                <div className="flex items-center text-slate-400">
                                                    <Phone size={14} className="mr-2" />
                                                    {dept.phone}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Office Information */}
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <MapPin size={24} className="mr-3 text-sky-400" />
                                    Office Location
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Agnidhra Technologies Pvt Ltd</h3>
                                        <p className="text-slate-300 text-sm">
                                            123 Cyber Security Hub<br />
                                            Tech City, Electronic City<br />
                                            Bangalore - 560100<br />
                                            Karnataka, India
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Clock size={16} className="mr-2" />
                                        <span>Monday - Friday: 9:00 AM - 6:00 PM IST</span>
                                    </div>
                                    
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Clock size={16} className="mr-2" />
                                        <span>Saturday: 10:00 AM - 4:00 PM IST</span>
                                    </div>
                                    
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Clock size={16} className="mr-2" />
                                        <span>Sunday: Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="p-6 bg-slate-900 rounded-lg border border-slate-600">
                                    <h3 className="font-semibold text-sky-400 mb-3">{faq.question}</h3>
                                    <p className="text-slate-300 text-sm">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-slate-400 text-sm">
                                Can't find what you're looking for? 
                                <button 
                                    onClick={() => document.getElementById('message').focus()}
                                    className="text-sky-400 hover:text-sky-300 ml-1"
                                >
                                    Send us a message
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Response Time Information */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Our Response Commitment</h2>
                        <p className="text-green-100 mb-6">
                            We're committed to providing timely and helpful responses to all your queries.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <div className="text-2xl font-bold mb-1">&lt; 1 Hour</div>
                                <div className="text-sm text-green-200">Urgent technical issues</div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <div className="text-2xl font-bold mb-1">&lt; 24 Hours</div>
                                <div className="text-sm text-green-200">General inquiries</div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <div className="text-2xl font-bold mb-1">&lt; 48 Hours</div>
                                <div className="text-sm text-green-200">Complex queries</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}