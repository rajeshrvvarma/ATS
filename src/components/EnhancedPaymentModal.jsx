/**
 * Enhanced Payment Modal
 * Supports multiple payment methods with comprehensive UX
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  CreditCard,
  Building,
  Link,
  Check,
  Copy,
  Download,
  AlertCircle,
  Clock,
  Shield,
  ArrowRight,
  RefreshCw,
  QrCode,
  ExternalLink
} from 'lucide-react';
import {
  PAYMENT_METHODS,
  initiatePayment,
  verifyPayment,
  processPaymentAndEnrollment,
  getPaymentStatus
} from '@/services/enhancedPaymentService.js';
import UPIQRCode from './UPIQRCode.jsx';
import { useAccessControl } from '@/context/AccessControlContext.jsx';
import siteConfig from '@/config/site.config.js';

const EnhancedPaymentModal = ({
  isOpen,
  onClose,
  course,
  user,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState(1); // 1: Method Selection, 2: Payment Details, 3: Verification, 4: Success
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationData, setVerificationData] = useState({
    reference: '',
    screenshot: null
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const { refreshEnrollments } = useAccessControl();

  // Auto-refresh payment status for PhonePe
  useEffect(() => {
    let interval;
    if (paymentData && paymentData.method === 'phonepe' && step === 3) {
      interval = setInterval(async () => {
        try {
          const status = await getPaymentStatus(paymentData.transactionId);
          if (status.found && status.payment.status === 'verified') {
            setPaymentStatus(status);
            setStep(4);
          }
        } catch (error) {
          console.error('Status check failed:', error);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentData, step]);

  // Countdown timer for urgency
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handlePaymentInitiation = async () => {
    setLoading(true);
    setError('');

    try {
      const paymentRequest = {
        method: selectedMethod,
        amount: parseFloat(course.price.replace(/[₹,]/g, '')),
        courseId: course.id,
        courseName: course.title,
        studentDetails: {
          name: user.displayName || user.email,
          email: user.email,
          phone: user.phoneNumber || ''
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'enhanced_payment_modal'
        }
      };

      const result = await initiatePayment(paymentRequest);

      if (result.success) {
        setPaymentData(result);
        setStep(2);
        
        if (result.method === 'phonepe' && result.redirectUrl) {
          // Redirect to PhonePe for gateway payment
          window.location.href = result.redirectUrl;
        } else {
          // For UPI/Bank transfer, start countdown
          setCountdown(600); // 10 minutes
        }
      } else {
        throw new Error(result.error || 'Payment initiation failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async () => {
    if (!verificationData.reference || verificationData.reference.length < 8) {
      setError('Please provide valid transaction reference (minimum 8 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verificationRequest = {
        method: selectedMethod,
        transactionId: paymentData.transactionId,
        reference: verificationData.reference,
        additionalData: {
          screenshot: verificationData.screenshot
        }
      };

      const enrollmentRequest = {
        courseId: course.id,
        studentId: user.uid,
        studentEmail: user.email,
        studentName: user.displayName || user.email,
        studentPhone: user.phoneNumber || ''
      };

      const result = await processPaymentAndEnrollment(verificationRequest, enrollmentRequest);

      if (result.success) {
        if (result.status === 'pending_verification') {
          setPaymentStatus({
            status: 'pending_verification',
            message: result.message
          });
          setStep(3);
        } else {
          setPaymentStatus({
            status: 'verified',
            enrollmentId: result.enrollmentId,
            message: result.message
          });
          setStep(4);
          
          // Refresh enrollments
          await refreshEnrollments();
          
          if (onPaymentSuccess) {
            onPaymentSuccess(result.enrollmentId);
          }
        }
      } else {
        throw new Error(result.error || 'Payment processing failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show temporary success feedback
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getMethodIcon = (methodId) => {
    const icons = {
      upi: Smartphone,
      phonepe: CreditCard,
      bank_transfer: Building,
      payment_link: Link
    };
    return icons[methodId] || CreditCard;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h3 className="text-xl font-semibold text-white">Secure Payment</h3>
              <p className="text-slate-400 text-sm">{course.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Payment Method Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Choose Payment Method</h4>
                  <p className="text-slate-400">Select your preferred payment option</p>
                </div>

                <div className="grid gap-4">
                  {Object.values(PAYMENT_METHODS).map((method) => {
                    const IconComponent = getMethodIcon(method.id);
                    return (
                      <div
                        key={method.id}
                        onClick={() => handleMethodSelect(method.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-sky-500 bg-sky-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-6 h-6 ${
                              selectedMethod === method.id ? 'text-sky-400' : 'text-slate-400'
                            }`} />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-white">{method.name}</span>
                                {method.preferred && (
                                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm">{method.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-slate-500">
                                  Fees: {method.fees === 0 ? 'Free' : method.fees}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Processing: {method.processingTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedMethod === method.id
                              ? 'border-sky-500 bg-sky-500'
                              : 'border-slate-500'
                          }`}>
                            {selectedMethod === method.id && (
                              <Check className="w-2 h-2 text-white m-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Course Total */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Course Price</span>
                    <span className="text-white font-semibold">{course.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-300">Payment Method Fee</span>
                    <span className="text-white">
                      {PAYMENT_METHODS[selectedMethod.toUpperCase()]?.fees === 0 ? 'Free' : 
                       PAYMENT_METHODS[selectedMethod.toUpperCase()]?.fees || '0'}
                    </span>
                  </div>
                  <hr className="border-slate-600 my-2" />
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-sky-400 text-xl">{course.price}</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <button
                  onClick={handlePaymentInitiation}
                  disabled={loading}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Initializing...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed with {PAYMENT_METHODS[selectedMethod.toUpperCase()]?.name}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Payment Details */}
            {step === 2 && paymentData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Complete Payment</h4>
                  {countdown > 0 && (
                    <div className="flex items-center justify-center space-x-2 text-orange-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Complete within {formatCountdown(countdown)}</span>
                    </div>
                  )}
                </div>

                {/* UPI Payment */}
                {paymentData.method === 'upi' && (
                  <div className="space-y-4">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <h5 className="text-blue-400 font-medium mb-3">UPI Payment Instructions</h5>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          {paymentData.instructions.map((instruction, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-blue-300 text-sm">{instruction}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                          <UPIQRCode upiUrl={paymentData.qrData} size={150} />
                          <a
                            href={paymentData.upiUrl}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Pay with UPI App</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Enter UTR/Transaction ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 123456789012"
                        value={verificationData.reference}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          reference: e.target.value.trim()
                        })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                      />
                      <p className="text-xs text-slate-400">
                        Find this in your UPI app after completing payment
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank Transfer */}
                {paymentData.method === 'bank_transfer' && (
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <h5 className="text-green-400 font-medium mb-3">Bank Transfer Details</h5>
                      <div className="grid gap-3">
                        {Object.entries(paymentData.bankDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-slate-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-mono">{value}</span>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="text-green-400 hover:text-green-300 p-1"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Bank Reference/Transaction ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter bank transaction reference"
                        value={verificationData.reference}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          reference: e.target.value.trim()
                        })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePaymentVerification}
                    disabled={loading || !verificationData.reference}
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification Pending */}
            {step === 3 && paymentStatus && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 rounded-full mx-auto">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Payment Verification Pending</h4>
                  <p className="text-slate-400">{paymentStatus.message}</p>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-left">
                  <h5 className="text-yellow-400 font-medium mb-2">What happens next?</h5>
                  <ul className="text-yellow-300 text-sm space-y-1">
                    <li>• Our team will verify your payment within 1 hour</li>
                    <li>• You'll receive email confirmation once verified</li>
                    <li>• Course access will be granted automatically</li>
                    <li>• For urgent queries, contact: {siteConfig.supportPhone}</li>
                  </ul>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && paymentStatus && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Payment Successful!</h4>
                  <p className="text-slate-400">{paymentStatus.message}</p>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-left">
                  <h5 className="text-green-400 font-medium mb-2">Enrollment Details</h5>
                  <div className="text-green-300 text-sm space-y-1">
                    <p>Course: {course.title}</p>
                    <p>Enrollment ID: {paymentStatus.enrollmentId}</p>
                    <p>Access: Immediate</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Start Learning
                </button>
              </div>
            )}
          </div>

          {/* Security Badge */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL encrypted • Your payment is secure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnhancedPaymentModal;