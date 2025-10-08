import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, X, Mail, Phone, User, Briefcase } from 'lucide-react';

const EnrollmentModal = ({ isOpen, onClose, courseType, courseTitle, price }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    currentRole: '',
    motivation: '',
    referralSource: '',
    paymentPlan: courseType === 'premium' ? 'full' : 'single'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate unique enrollment ID
      const newEnrollmentId = `ENR-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setEnrollmentId(newEnrollmentId);
      
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally:
      // 1. Send to your backend
      // 2. Add to Firebase
      // 3. Send confirmation email
      // 4. Add to Google Sheets for tracking
      
      console.log('Enrollment submitted:', {
        enrollmentId: newEnrollmentId,
        courseType,
        formData,
        timestamp: new Date().toISOString()
      });
      
      setCurrentStep(3); // Success step
      
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      experience: '',
      currentRole: '',
      motivation: '',
      referralSource: '',
      paymentPlan: courseType === 'premium' ? 'full' : 'single'
    });
    setEnrollmentId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{courseTitle}</h2>
              <p className="text-gray-400">Secure your seat now</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm font-semibold`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-600'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-600'} text-white text-sm font-semibold`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-green-600' : 'bg-gray-600'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-green-600' : 'bg-gray-600'} text-white text-sm font-semibold`}>
              ✓
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Experience Level</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select your experience level</option>
                    <option value="complete-beginner">Complete Beginner</option>
                    <option value="some-it-knowledge">Some IT Knowledge</option>
                    <option value="it-professional">IT Professional (1-3 years)</option>
                    <option value="experienced">Experienced (3+ years)</option>
                    <option value="career-changer">Career Changer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Current Role
                  </label>
                  <select
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select your current role</option>
                    <option value="student">Student</option>
                    <option value="it-support">IT Support</option>
                    <option value="developer">Software Developer</option>
                    <option value="network-admin">Network Administrator</option>
                    <option value="system-admin">System Administrator</option>
                    <option value="other-it">Other IT Role</option>
                    <option value="non-it">Non-IT Professional</option>
                    <option value="unemployed">Looking for Job</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                Continue to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment & Confirmation */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Your Enrollment</h3>
              
              {courseType === 'premium' && (
                <div>
                  <label className="block text-gray-300 mb-3">Payment Plan</label>
                  <div className="space-y-3">
                    {[
                      { id: 'full', name: 'Full Payment', price: '₹5,999', savings: 'Save ₹3,000', popular: true },
                      { id: 'installment', name: 'Two Installments', price: '₹3,299 + ₹2,999', savings: 'Save ₹1,700' },
                      { id: 'monthly', name: 'Monthly Payment', price: '₹3,299/month x 2', savings: 'Save ₹1,400' }
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.paymentPlan === plan.id 
                            ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentPlan: plan.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{plan.name}</div>
                            <div className="text-purple-300 font-bold">{plan.price}</div>
                            <div className="text-sm text-green-400">{plan.savings}</div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentPlan === plan.id ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                          }`}>
                            {formData.paymentPlan === plan.id && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                        {plan.popular && (
                          <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full mt-2 inline-block">
                            Most Popular
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2">Why do you want to learn cybersecurity?</label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Tell us about your goals and motivation..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">How did you hear about us?</label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select source</option>
                  <option value="google">Google Search</option>
                  <option value="social-media">Social Media</option>
                  <option value="friend-referral">Friend/Colleague Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-400">{price}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {courseType === 'bootcamp' ? 'Early Bird Special' : 'Best Value Package'}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Enrollment'}
                  {!isSubmitting && <CheckCircle className="ml-2 h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Enrollment Successful!</h3>
                <p className="text-gray-400">
                  Your seat has been reserved for {courseTitle}
                </p>
              </div>

              <div className="bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-2">Enrollment ID</div>
                <div className="font-bold text-green-400 text-lg">{enrollmentId}</div>
              </div>

              <div className="text-left space-y-2 text-sm text-gray-400">
                <p>✅ Confirmation email sent to {formData.email}</p>
                <p>✅ Payment instructions will be shared shortly</p>
                <p>✅ Batch details and schedule will be emailed</p>
                {courseType === 'premium' && <p>✅ Mentor assignment within 24 hours</p>}
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
              >
                Continue Exploring
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnrollmentModal;