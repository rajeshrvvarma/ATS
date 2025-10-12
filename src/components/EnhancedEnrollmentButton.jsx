/**
 * Enhanced Enrollment Button
 * Handles course enrollment with enhanced payment integration and access control
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Check, AlertCircle, Loader } from 'lucide-react';
import { useAccessControl } from '@/context/AccessControlContext.jsx';
import { enrollStudent } from '@/services/enrollmentService.js';
import EnhancedPaymentModal from './EnhancedPaymentModal.jsx';

const EnhancedEnrollmentButton = ({ 
  course, 
  user, 
  onEnrollmentSuccess,
  className = "",
  variant = "primary"
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { refreshEnrollments, checkCourseAccess } = useAccessControl();

  const handleEnrollment = async () => {
    if (!user) {
      alert('Please log in to enroll in courses');
      return;
    }

    setIsEnrolling(true);
    setEnrollmentStatus(null);

    try {
      // Check if already enrolled
      const accessResult = await checkCourseAccess(course.id);
      if (accessResult.hasAccess) {
        setEnrollmentStatus('Already enrolled in this course');
        setIsEnrolling(false);
        return;
      }

      // For free courses, enroll directly
      if (course.price === 0 || course.price === 'Free') {
        const enrollmentResult = await enrollStudent({
          courseId: course.id,
          studentId: user.uid,
          studentEmail: user.email,
          studentName: user.displayName || user.email,
          studentPhone: user.phoneNumber || '',
          paymentReference: `FREE_${Date.now()}`,
          paymentAmount: 0,
          paymentMethod: 'free'
        });

        if (enrollmentResult.success) {
          setEnrollmentStatus('Successfully enrolled!');
          await refreshEnrollments();
          if (onEnrollmentSuccess) {
            onEnrollmentSuccess(course.id);
          }
        } else {
          throw new Error(enrollmentResult.error);
        }
      } else {
        // For paid courses, open payment modal
        setShowPaymentModal(true);
      }

    } catch (error) {
      console.error('Enrollment failed:', error);
      setEnrollmentStatus(`Enrollment failed: ${error.message}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaymentSuccess = async (enrollmentId) => {
    setShowPaymentModal(false);
    setEnrollmentStatus('Payment successful! Enrollment complete.');
    await refreshEnrollments();
    if (onEnrollmentSuccess) {
      onEnrollmentSuccess(course.id);
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-600 hover:bg-slate-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'outline':
        return 'border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white';
      default:
        return 'bg-sky-600 hover:bg-sky-700 text-white';
    }
  };

  const getPriceDisplay = () => {
    if (course.price === 0 || course.price === 'Free') {
      return 'Enroll Free';
    }
    return `Enroll for ${course.price}`;
  };

  if (enrollmentStatus === 'Successfully enrolled!' || enrollmentStatus === 'Payment successful! Enrollment complete.') {
    return (
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg ${className}`}
        disabled
      >
        <Check className="w-4 h-4" />
        <span>Enrolled</span>
      </motion.button>
    );
  }

  return (
    <div className="space-y-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleEnrollment}
        disabled={isEnrolling}
        className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${getButtonVariant()} ${className} ${
          isEnrolling ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isEnrolling ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : course.price === 0 || course.price === 'Free' ? (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>{getPriceDisplay()}</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{getPriceDisplay()}</span>
          </>
        )}
      </motion.button>

      {enrollmentStatus && enrollmentStatus !== 'Successfully enrolled!' && enrollmentStatus !== 'Payment successful! Enrollment complete.' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center space-x-2 text-sm p-2 rounded ${
            enrollmentStatus.includes('failed') || enrollmentStatus.includes('error') 
              ? 'bg-red-500/20 text-red-400' 
              : enrollmentStatus.includes('Already enrolled')
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{enrollmentStatus}</span>
        </motion.div>
      )}

      {/* Enhanced Payment Modal */}
      <EnhancedPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default EnhancedEnrollmentButton;