import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
  MessageCircle,
  Download,
  QrCode,
  Smartphone
} from 'lucide-react';
import WhatsAppContactButton from './WhatsAppContactButton.jsx';
import UPIQRCode from './UPIQRCode.jsx';
import siteConfig from '../config/site.config.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { enrollStudentInCourse } from '@/services/studentManagementService.js';
import { enrollStudent } from '@/services/enrollmentService.js';

/**
 * Modern Enrollment Modal - Redesigned for better UX
 * Streamlined process with multiple contact options
 */
export default function ModernEnrollmentModal({
  isOpen,
  onClose,
  courseData
}) {
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1); // 1: Course Info, 2: Contact Options, 3: Form, 4: Payment
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'whatsapp', // whatsapp, phone, email
    timePreference: 'morning', // morning, afternoon, evening
    message: '',
    courseId: courseData?.courseId || courseData?.id || null,
    courseName: courseData?.title || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | razorpay
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(null);

  const {
    title = 'Course',
    duration = '8 Weeks',
    price = '₹20,000',
    originalPrice = '₹35,000',
    batchInfo = { date: 'Starting Soon', time: '10:00 AM TO 7:00 PM' },
    features = [],
  } = courseData || {};

  // Prefill form when user is logged in or when courseData changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name || '',
        email: user.email || prev.email || '',
        phone: user.phoneNumber || prev.phone || '',
        courseId: courseData?.courseId || courseData?.id || prev.courseId,
        courseName: courseData?.title || prev.courseName
      }));
    } else {
      // If courseData provided (clicked from course card), ensure course fields set for guests
      setFormData(prev => ({
        ...prev,
        courseId: courseData?.courseId || courseData?.id || prev.courseId,
        courseName: courseData?.title || prev.courseName
      }));
    }
  }, [user, courseData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // If user is logged in, use enrollStudent API directly (fast-path)
    const enrollmentPayload = {
      courseId: formData.courseId,
      courseName: formData.courseName || title,
      studentName: formData.name,
      studentEmail: formData.email,
      studentPhone: formData.phone,
      contactMethod: formData.preferredContact,
      message: formData.message
    };

    const doEnrollment = async () => {
      setIsProcessing(true);
      try {
        if (user) {
          // server-side enrollment for logged-in user
          const res = await enrollStudentInCourse({ ...enrollmentPayload, studentId: user.uid });
          setEnrollSuccess(res);
          // Optionally refresh access control elsewhere
        } else {
          // For guest, create a lead/enrollment record (non-verified) using enrollStudent
          const res = await enrollStudent(enrollmentPayload);
          setEnrollSuccess(res);
        }
      } catch (err) {
        console.error('Enrollment failed', err);
        setEnrollSuccess({ success: false, error: err.message || String(err) });
      } finally {
        setIsProcessing(false);
      }
    };

    doEnrollment();
  };

  // Generate UPI payment URL
  const generateUPIUrl = (amount, courseName) => {
    const params = new URLSearchParams({
      pa: siteConfig.upiId,
      pn: siteConfig.upiPayeeName,
      am: amount.toString(),
      cu: 'INR',
      tn: `${courseName} Enrollment`,
      tr: `TXN_${Date.now()}`
    });

    return `upi://pay?${params.toString()}`;
  };

  const contactOptions = [
    {
      id: 'payment',
      title: 'Pay Now & Enroll',
      description: `Secure UPI payment - Complete enrollment for ${price}`,
      icon: CreditCard,
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      action: () => setStep(4),
      priority: true
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Chat',
      description: 'Get instant support and payment assistance',
      icon: MessageCircle,
      color: 'bg-green-500',
      action: () => setStep(3)
    },
    {
      id: 'phone',
      title: 'Call for Support',
      description: 'Speak with our enrollment advisor',
      icon: Phone,
      color: 'bg-blue-500',
      action: () => {
        window.open('tel:+919160813700', '_self');
      }
    },
    {
      id: 'form',
      title: 'Request Information',
      description: 'Get detailed course info and payment options',
      icon: Calendar,
      color: 'bg-purple-500',
      action: () => setStep(3)
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Enroll in {title}</h2>
              <p className="text-slate-400">Join thousands of successful graduates</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Course Overview */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Course Highlights */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Course Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-300">Duration: {duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Starts: {batchInfo.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-300">Mode: Online + Labs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-orange-400" />
                      <span className="text-slate-300">Job Assistance Included</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Special Launch Price</h3>
                      <p className="opacity-90">Limited time offer - Save {originalPrice && price ?
                        `₹${parseInt(originalPrice.replace(/₹|,/g, '')) - parseInt(price.replace(/₹|,/g, ''))}` :
                        '₹15,000'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{price}</div>
                      {originalPrice && (
                        <div className="text-lg opacity-75 line-through">{originalPrice}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                {features && features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">What You'll Get:</h3>
                    <div className="space-y-2">
                      {features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">
                            {typeof feature === 'string' ? feature : feature.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Enrollment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Options */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">How would you like to enroll?</h3>
                  <p className="text-slate-400">Choose your preferred enrollment method</p>
                </div>

                <div className="grid gap-4">
                  {contactOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className={`${option.color} hover:opacity-90 text-white p-6 rounded-xl transition-all duration-300 text-left group ${option.priority ? 'ring-2 ring-green-400 shadow-lg' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          <div>
                            <h4 className="font-semibold text-lg">{String(option.title)}</h4>
                            <p className="opacity-90">{String(option.description)}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full border border-slate-600 text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Back to Course Details
                </button>
              </motion.div>
            )}

            {/* Step 3: Contact Form */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Let's Get You Enrolled!</h3>
                  <p className="text-slate-400">Fill in your details and we'll contact you immediately</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 12345 67890"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* If user is not logged in show a compact enroll CTA + payment method selector */}
                  {!user && (
                    <div className="bg-slate-800 rounded-xl p-4">
                      <h4 className="text-sm text-slate-300 mb-2">Choose Payment Method</h4>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setPaymentMethod('upi')} className={`py-2 px-3 rounded-lg ${paymentMethod === 'upi' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>UPI / PayTM QR</button>
                        {import.meta.env.VITE_RAZORPAY_KEY_ID && (
                          <button type="button" onClick={() => setPaymentMethod('razorpay')} className={`py-2 px-3 rounded-lg ${paymentMethod === 'razorpay' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Razorpay</button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
                        className="w-full py-3 px-4 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Best Time to Contact
                      </label>
                      <select
                        value={formData.timePreference}
                        onChange={(e) => setFormData(prev => ({ ...prev, timePreference: e.target.value }))}
                        className="w-full py-3 px-4 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                        <option value="evening">Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full py-3 px-4 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="border border-slate-600 text-slate-300 py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? 'Processing...' : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          {user ? 'Enroll Now' : 'Request & Enroll'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: UPI Payment */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Complete Your Payment</h3>
                  <p className="text-slate-400">Scan QR code or use UPI ID to pay securely</p>
                </div>

                {/* Payment Details */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300">Course:</span>
                    <span className="text-white font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300">Amount:</span>
                    <div className="text-right">
                      <span className="text-green-400 text-2xl font-bold">{price}</span>
                      {originalPrice && (
                        <div className="text-slate-400 text-sm line-through">{originalPrice}</div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">You Save:</span>
                      <span className="text-green-400 font-bold">
                        {originalPrice && price ?
                          `₹${parseInt(originalPrice.replace(/₹|,/g, '')) - parseInt(price.replace(/₹|,/g, ''))}` :
                          '₹15,000'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method UI */}
                {paymentMethod === 'upi' && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <UPIQRCode
                      upiUrl={generateUPIUrl(
                        parseInt(String(price).replace(/₹|,/g, '')) || 0,
                        title
                      )}
                      size={200}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-slate-600 text-sm mb-2">UPI ID:</p>
                      <div className="bg-slate-100 rounded-lg p-3">
                        <code className="text-slate-800 text-sm font-mono break-all">
                          {siteConfig.upiId}
                        </code>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'razorpay' && import.meta.env.VITE_RAZORPAY_KEY_ID && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <h4 className="text-lg font-semibold mb-2">Razorpay Checkout</h4>
                    <p className="text-slate-500 mb-4">Secure card/UPI checkout using Razorpay</p>
                    <button
                      onClick={async () => {
                        // Dynamically load Razorpay script and open checkout
                        setIsProcessing(true);
                        try {
                          if (!window.Razorpay) {
                            await new Promise((resolve, reject) => {
                              const s = document.createElement('script');
                              s.src = 'https://checkout.razorpay.com/v1/checkout.js';
                              s.onload = resolve;
                              s.onerror = reject;
                              document.head.appendChild(s);
                            });
                          }

                          // Create order via enhancedPaymentService or backend - simplified here
                          // For real integration call backend endpoint to create Razorpay orderId
                          const amount = parseInt(String(price).replace(/₹|,/g, '')) || 0;
                          // Create server-side order first
                          const orderResp = await fetch('/.netlify/functions/razorpay-create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              amount,
                              currency: 'INR',
                              receipt: `enroll_${Date.now()}`,
                              notes: { courseId: formData.courseId, courseName: formData.courseName },
                              customer: { email: formData.email, phone: formData.phone }
                            })
                          });
                          const orderData = await orderResp.json();
                          if (!orderResp.ok) throw new Error(orderData.error || 'Failed to create order');

                          const options = {
                            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                            amount: orderData.amount,
                            order_id: orderData.id,
                            name: siteConfig.siteName || 'Course Enrollment',
                            description: title,
                            handler: async function (response) {
                              // response.razorpay_payment_id
                              try {
                                await enrollStudentInCourse({
                                  courseId: formData.courseId,
                                  courseName: formData.courseName || title,
                                  studentName: formData.name,
                                  studentEmail: formData.email,
                                  studentPhone: formData.phone,
                                  paymentMethod: 'razorpay',
                                  transactionId: response.razorpay_payment_id,
                                  orderId: orderData.id,
                                  studentId: user?.uid || null
                                });
                                setEnrollSuccess({ success: true, transactionId: response.razorpay_payment_id });
                              } catch (err) {
                                console.error('Enrollment after razorpay failed', err);
                                setEnrollSuccess({ success: false, error: String(err) });
                              }
                            },
                            prefill: {
                              name: formData.name,
                              email: formData.email,
                              contact: formData.phone
                            }
                          };

                          const rzp = new window.Razorpay(options);
                          rzp.open();
                        } catch (err) {
                          console.error('Razorpay failed to load or open', err);
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
                    >
                      {isProcessing ? 'Opening...' : 'Open Razorpay Checkout'}
                    </button>
                  </div>
                )}

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">How to Pay:</h4>
                      <ol className="text-blue-800 text-sm space-y-1">
                        <li>1. Open any UPI app (PayTM, PhonePe, GPay, etc.)</li>
                        <li>2. Scan the QR code above OR use the UPI ID</li>
                        <li>3. Enter amount: <strong>{price}</strong></li>
                        <li>4. Complete the payment</li>
                        <li>5. Take a screenshot of payment confirmation</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="border border-slate-600 text-slate-300 py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Back
                  </button>

                  {paymentMethod === 'upi' && (
                    <button
                      onClick={() => {
                        const paymentConfirmMessage = `\n🎉 *Payment Completed for ${title}*\n\n💰 *Amount Paid:* ${price}\n📝 *Course:* ${title}\n\nHi! I have completed the payment for the above course. Please confirm my enrollment and provide access details.`;
                        const whatsappUrl = `https://wa.me/919160813700?text=${encodeURIComponent(paymentConfirmMessage)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Confirm Payment (I paid via UPI)
                    </button>
                  )}

                  {paymentMethod === 'razorpay' && (
                    <button
                      onClick={() => {
                        // Open Razorpay button above handles flow; here just show a help action
                        setPaymentMethod('razorpay');
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Open Razorpay Checkout
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}