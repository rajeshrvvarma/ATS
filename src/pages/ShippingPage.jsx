import React from 'react';
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';

export default function ShippingPage({ onNavigate }) {
    const shippingMethods = [
        {
            name: "Digital Delivery",
            description: "Course materials, certificates, and resources",
            timeframe: "Instant to 24 hours",
            cost: "Free",
            icon: Package,
            items: ["Course access links", "Digital certificates", "Study materials (PDF)", "Video recordings", "Lab access credentials"]
        },
        {
            name: "Physical Materials",
            description: "Hardware kits, books, and branded merchandise",
            timeframe: "3-7 business days",
            cost: "₹200 - ₹500",
            icon: Truck,
            items: ["Hardware kits (if applicable)", "Printed course materials", "Branded merchandise", "Physical certificates (premium)", "USB drives with tools"]
        }
    ];

    const deliveryZones = [
        {
            zone: "Metro Cities",
            areas: "Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune",
            timeframe: "2-3 business days",
            cost: "₹200"
        },
        {
            zone: "Tier 1 Cities",
            areas: "State capitals and major cities",
            timeframe: "3-5 business days",
            cost: "₹300"
        },
        {
            zone: "Tier 2/3 Cities",
            areas: "Smaller cities and towns",
            timeframe: "5-7 business days",
            cost: "₹400"
        },
        {
            zone: "Remote Areas",
            areas: "Rural and remote locations",
            timeframe: "7-10 business days",
            cost: "₹500"
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

                <SectionTitle>Shipping & Delivery Policy</SectionTitle>
                <p className="text-center text-xl text-slate-300 -mt-8 mb-12">
                    Digital-first learning with optional physical delivery services
                </p>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Important Notice */}
                    <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle size={24} className="text-blue-400 mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-blue-300 font-semibold mb-2">Digital-First Education</h3>
                                <p className="text-blue-100 text-sm">
                                    Our courses are primarily delivered digitally. All essential materials, certificates, and course access
                                    are provided online for immediate access. Physical shipping applies only to optional hardware kits
                                    and premium add-ons.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Methods */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {shippingMethods.map((method, index) => {
                            const IconComponent = method.icon;
                            return (
                                <div key={index} className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-sky-600 p-3 rounded-lg mr-4">
                                            <IconComponent size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{method.name}</h3>
                                            <p className="text-slate-400 text-sm">{method.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                                            <Clock size={20} className="text-sky-400 mx-auto mb-1" />
                                            <div className="text-sm text-slate-300">Delivery Time</div>
                                            <div className="font-semibold text-white">{method.timeframe}</div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-900 rounded-lg">
                                            <Package size={20} className="text-green-400 mx-auto mb-1" />
                                            <div className="text-sm text-slate-300">Cost</div>
                                            <div className="font-semibold text-white">{method.cost}</div>
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-white mb-3">What's Included:</h4>
                                    <ul className="space-y-2">
                                        {method.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-center text-sm text-slate-300">
                                                <CheckCircle size={14} className="text-green-400 mr-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* Delivery Zones */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                            <MapPin size={24} className="mr-3 text-sky-400" />
                            Physical Delivery Zones (India)
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {deliveryZones.map((zone, index) => (
                                <div key={index} className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                                    <h3 className="font-bold text-sky-400 mb-2">{zone.zone}</h3>
                                    <p className="text-slate-300 text-sm mb-4">{zone.areas}</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Time:</span>
                                            <span className="text-white">{zone.timeframe}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Cost:</span>
                                            <span className="text-green-400 font-semibold">{zone.cost}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                            <p className="text-yellow-100 text-sm">
                                <strong>Note:</strong> Delivery times are estimates and may vary during festivals,
                                natural disasters, or other unforeseen circumstances. Tracking information will be
                                provided for all physical shipments.
                            </p>
                        </div>
                    </div>

                    {/* Digital Delivery Process */}
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-8">Digital Delivery Process</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="bg-sky-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Payment Confirmation</h3>
                                <p className="text-slate-300 text-sm">
                                    Once payment is confirmed, you will receive an immediate email confirmation with next steps.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-sky-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Account Setup</h3>
                                <p className="text-slate-300 text-sm">
                                    Your learning account is activated within 24 hours with full course access and materials.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-sky-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Start Learning</h3>
                                <p className="text-slate-300 text-sm">
                                    Access your course dashboard, download materials, and begin your cybersecurity journey.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Terms */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Shipping Terms & Conditions</h2>

                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    Physical items are shipped only within India
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    Shipping address cannot be changed after order confirmation
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    We are not responsible for delays by courier services
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    Damaged items must be reported within 48 hours of delivery
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    Tracking information provided via SMS and email
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                                    Multiple delivery attempts will be made
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">International Students</h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                                    <h4 className="font-semibold text-blue-300 mb-2">Digital Access</h4>
                                    <p className="text-blue-100 text-sm">
                                        Full course access available worldwide. All materials delivered digitally.
                                    </p>
                                </div>

                                <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-700">
                                    <h4 className="font-semibold text-orange-300 mb-2">Physical Materials</h4>
                                    <p className="text-orange-100 text-sm">
                                        Currently not available for international shipping. Digital alternatives provided.
                                    </p>
                                </div>

                                <div className="p-4 bg-green-900/30 rounded-lg border border-green-700">
                                    <h4 className="font-semibold text-green-300 mb-2">Certificates</h4>
                                    <p className="text-green-100 text-sm">
                                        Digital certificates with blockchain verification available for all students globally.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Shipping Support</h2>
                        <p className="text-purple-100 mb-6">
                            Questions about delivery? Our support team is here to help track your order and resolve any issues.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Order Tracking</h4>
                                <p className="text-sm text-purple-200">shipping@agnidhra.com</p>
                                <p className="text-xs text-purple-300">Track your physical orders</p>
                            </div>

                            <div className="bg-white/10 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Delivery Issues</h4>
                                <p className="text-sm text-purple-200">+91-9876543210</p>
                                <p className="text-xs text-purple-300">Report damaged or missing items</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}