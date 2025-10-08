/**
 * Enhanced Course Enrollment Modal
 * Integrates with Firebase backend and email automation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader, CreditCard, Mail, Phone, User } from 'lucide-react';
import { enrollStudentInCourse } from '@/services/studentManagementService.js';
import { sendWelcomeEmail, sendPaymentConfirmationEmail } from '@/services/emailService.js';

const EnhancedEnrollmentModal = ({ 
  isOpen, 
  onClose, 
  courseType, 
  courseName,
  coursePrice,
  onEnrollmentSuccess 
}) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrollmentResult, setEnrollmentResult] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'razorpay', // razorpay, upi, bank_transfer
    agreeToTerms: false,
    marketingConsent: true
  });

  const [paymentData, setPaymentData] = useState({
    amount: coursePrice,
    reference: '',
    transactionId: '',
    paymentScreenshot: null
  });

  const courseDetails = {
    '7-day-bootcamp': {
      name: '7-Day Cybersecurity Bootcamp',
      price: 2999,
      originalPrice: 4999,
      duration: '7 days',
      features: [
        'Live interactive sessions',
        'Hands-on labs and exercises',
        'Industry expert mentorship',
        'Course completion certificate',
        'Lifetime access to materials',
        'Job placement assistance'
      ]
    },
    '2-month-premium': {
      name: '2-Month Premium Cybersecurity Program',
      price: 5999,
      originalPrice: 9999,
      duration: '2 months',
      features: [
        'Comprehensive curriculum',
        '1-on-1 mentoring sessions',
        'Real-world project experience',
        'Industry-recognized certification',
        'Career guidance and placement',
        'Alumni network access'
      ]
    }
  };

  const course = courseDetails[courseType] || courseDetails['7-day-bootcamp'];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setError('');
    setStep(2); // Move to payment step
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Import Razorpay services
      const { createOrder, processPayment } = await import('@/services/razorpay.js');
      
      // First create an order
      const orderData = {
        amount: course.price,
        currency: 'INR',
        receipt: `receipt_${courseType}_${Date.now()}`,
        notes: {
          courseType,
          studentName: formData.name,
          studentEmail: formData.email,
          studentPhone: formData.phone
        }
      };

      const order = await createOrder(orderData);
      
      if (!order.id) {
        throw new Error('Failed to create payment order');
      }

      // Then process payment with the order
      const paymentData = {
        amount: course.price * 100, // Razorpay expects amount in paise
        currency: 'INR',
        orderId: order.id,
        description: `${course.name} - Enrollment`,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      const result = await processPayment(paymentData);
      
      console.log('Payment result received:', result);
      
      if (result.success) {
        // Payment successful, proceed with enrollment
        console.log('Processing enrollment after successful payment...');
        await handleEnrollmentAfterPayment(result.paymentId);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // If order creation fails, try direct payment (test mode)
      if (error.message.includes('Order creation failed') || error.message.includes('Server payment keys')) {
        try {
          console.log('Falling back to direct payment mode...');
          
          const { processPayment } = await import('@/services/razorpay.js');
          const directPaymentData = {
            amount: course.price * 100,
            currency: 'INR',
            description: `${course.name} - Enrollment`,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone
          };

          const result = await processPayment(directPaymentData);
          
          if (result.success) {
            await handleEnrollmentAfterPayment(`test_${result.paymentId || Date.now()}`);
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback payment also failed:', fallbackError);
        }
      }
      
      setError(error.message || 'Payment failed. Please use UPI or Bank Transfer option below.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Handle Razorpay payment
    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }
    
    // Only require reference for non-Razorpay payment methods
    if (!paymentData.reference.trim()) {
      setError('Please provide payment reference/transaction ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Process enrollment with manual payment reference
      await handleEnrollmentAfterPayment(paymentData.reference);
    } catch (error) {
      console.error('Enrollment error:', error);
      setError(error.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentAfterPayment = async (paymentReference) => {
    try {
      console.log('Starting enrollment process with payment reference:', paymentReference);
      // Process enrollment
      const enrollmentData = {
        courseType,
        paymentAmount: course.price,
        paymentReference: paymentReference,
        paymentMethod: formData.paymentMethod,
        studentEmail: formData.email,
        studentName: formData.name,
        studentPhone: formData.phone
      };

      console.log('Calling enrollStudentInCourse with:', enrollmentData);
      const enrollmentResult = await enrollStudentInCourse(enrollmentData);
      console.log('Enrollment result:', enrollmentResult);

      if (!enrollmentResult.success) {
        throw new Error(enrollmentResult.error);
      }

      // Try to send welcome email (don't block on failure)
      try {
        console.log('Attempting to send welcome email...');
        const welcomeEmailResult = await sendWelcomeEmail(
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          {
            enrollmentId: enrollmentResult.enrollmentId || `enrollment_${Date.now()}`,
            courseType,
            startDate: new Date().toISOString(),
            accessUrl: `/dashboard?enrollmentId=${enrollmentResult.enrollmentId}`
          }
        );
        console.log('Welcome email result:', welcomeEmailResult);
      } catch (emailError) {
        console.warn('Welcome email failed, continuing anyway:', emailError);
      }

      // Try to send payment confirmation email (don't block on failure)
      try {
        console.log('Attempting to send payment confirmation email...');
        await sendPaymentConfirmationEmail(
          {
            name: formData.name,
            email: formData.email
          },
          {
            amount: course.price,
            paymentReference: paymentReference,
            paymentMethod: formData.paymentMethod,
            courseType,
            enrollmentId: enrollmentResult.enrollmentId || `enrollment_${Date.now()}`
          }
        );
        console.log('Payment confirmation email sent');
      } catch (emailError) {
        console.warn('Payment confirmation email failed, continuing anyway:', emailError);
      }

      // Always show success, even if emails fail
      const finalResult = {
        ...enrollmentResult,
        enrollmentId: enrollmentResult.enrollmentId || `enrollment_${Date.now()}`,
        courseAccess: enrollmentResult.courseAccess || {
          startDate: new Date().toISOString(),
          accessUrl: `/dashboard?enrollmentId=${enrollmentResult.enrollmentId}`
        }
      };

      setEnrollmentResult(finalResult);
      setStep(3); // Move to confirmation step

      // Save enrollment receipt for dashboard access
      const enrollmentReceipt = {
        enrollmentId: finalResult.enrollmentId,
        courseType,
        studentEmail: formData.email,
        studentName: formData.name,
        studentPhone: formData.phone,
        paymentId: paymentReference,
        amount: courseType === 'bootcamp' ? 2999 : 9999,
        timestamp: new Date().toISOString(),
        ts: Date.now()
      };
      
      const existingReceipts = JSON.parse(localStorage.getItem('enrollment_receipts') || '[]');
      existingReceipts.push(enrollmentReceipt);
      localStorage.setItem('enrollment_receipts', JSON.stringify(existingReceipts));
      console.log('Enrollment receipt saved:', enrollmentReceipt);

      console.log('Enrollment process completed successfully');

      // Notify parent component
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess(finalResult);
      }

    } catch (error) {
      console.error('Enrollment error:', error);
      setError(error.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      paymentMethod: 'razorpay',
      agreeToTerms: false,
      marketingConsent: true
    });
    setPaymentData({
      amount: coursePrice,
      reference: '',
      transactionId: '',
      paymentScreenshot: null
    });
    setError('');
    setEnrollmentResult(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle bg-slate-800 rounded-xl shadow-xl border border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Enroll in {course.name}
                </h3>
                <p className="text-slate-400 mt-1">
                  Step {step} of 3
                </p>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span className={step >= 1 ? 'text-sky-400' : ''}>Details</span>
                <span className={step >= 2 ? 'text-sky-400' : ''}>Payment</span>
                <span className={step >= 3 ? 'text-sky-400' : ''}>Confirmation</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Step 1: Student Details Form */}
            {step === 1 && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Course summary */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="text-lg font-semibold text-white mb-2">{course.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Duration: {course.duration}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-sky-400">₹{course.price}</span>
                      <span className="text-slate-400 line-through ml-2">₹{course.originalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Student details */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Course features */}
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-3">What you'll get:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                      className="mt-1 rounded border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                    />
                    <span className="text-sm text-slate-300">
                      I agree to the{' '}
                      <a href="/terms" className="text-sky-400 hover:text-sky-300">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-sky-400 hover:text-sky-300">
                        Privacy Policy
                      </a>
                      *
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                      className="mt-1 rounded border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                    />
                    <span className="text-sm text-slate-300">
                      I'd like to receive updates about new courses and cybersecurity insights
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold"
                >
                  Proceed to Payment
                </button>
              </form>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment summary */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Course Fee</span>
                    <span className="text-white">₹{course.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Discount</span>
                    <span className="text-green-400">-₹{course.originalPrice - course.price}</span>
                  </div>
                  <hr className="border-slate-600 my-2" />
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-sky-400 text-xl">₹{course.price}</span>
                  </div>
                </div>

                {/* Payment method selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Choose Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'razorpay', label: 'Razorpay (Card/UPI/Net Banking)', recommended: true },
                      { value: 'upi', label: 'Direct UPI Transfer' },
                      { value: 'bank_transfer', label: 'Bank Transfer' }
                    ].map((method) => (
                      <div 
                        key={method.value} 
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.paymentMethod === method.value 
                            ? 'bg-sky-500/20 border-sky-500' 
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={() => {}} // Controlled by div click
                          className="text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                        />
                        <div className="flex-1">
                          <span className="text-white">{method.label}</span>
                          {method.recommended && (
                            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment instructions */}
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="text-blue-400 font-medium mb-2">Payment Instructions</h5>
                  {formData.paymentMethod === 'razorpay' && (
                    <p className="text-blue-300 text-sm">
                      After clicking "Make Payment", you'll be redirected to Razorpay to complete your secure payment using your preferred method.
                    </p>
                  )}
                  {formData.paymentMethod === 'upi' && (
                    <div className="text-blue-300 text-sm">
                      <p>Transfer ₹{course.price} to:</p>
                      <p className="font-mono bg-slate-700 p-2 rounded mt-2">
                        UPI ID: agnidhra@paytm
                      </p>
                      <p className="mt-2">Please enter the transaction ID below after payment.</p>
                    </div>
                  )}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="text-blue-300 text-sm">
                      <p>Transfer ₹{course.price} to our bank account and enter the reference number below.</p>
                    </div>
                  )}
                </div>

                {/* Payment reference (for non-Razorpay methods) */}
                {formData.paymentMethod !== 'razorpay' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Payment Reference/Transaction ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentData.reference}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter transaction ID or reference number"
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-5 h-5 animate-spin" />}
                    {formData.paymentMethod === 'razorpay' ? 'Make Payment' : 'Complete Enrollment'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && enrollmentResult && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Enrollment Successful! 🎉
                  </h3>
                  <p className="text-slate-300">
                    Welcome to {course.name}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 text-left">
                  <h4 className="text-lg font-semibold text-white mb-4">Next Steps:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Check your email</p>
                        <p className="text-slate-400">We've sent course access details to {formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Course starts soon</p>
                        <p className="text-slate-400">Your course begins on {new Date(enrollmentResult.courseAccess.startDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Enrollment ID</p>
                        <p className="text-slate-400 font-mono">{enrollmentResult.enrollmentId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleClose();
                      // Navigate to dashboard with enrollment ID
                      window.location.href = enrollmentResult.courseAccess.accessUrl;
                    }}
                    className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold"
                  >
                    Access Course Dashboard
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EnhancedEnrollmentModal;