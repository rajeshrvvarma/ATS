/**
 * Enhanced Payment Service
 * Comprehensive payment processing with multiple gateways and methods
 */

import { initiatePayment as phonePeInitiate, verifyPayment as phonePeVerify } from './phonepe.js';
import { enrollStudent } from './enrollmentService.js';
import siteConfig from '@/config/site.config.js';

/**
 * Payment Methods Configuration
 */
export const PAYMENT_METHODS = {
  UPI: {
    id: 'upi',
    name: 'UPI Payment',
    icon: 'Smartphone',
    description: 'Pay directly using any UPI app',
    fees: 0,
    processingTime: 'Instant',
    preferred: true
  },
  PHONEPE: {
    id: 'phonepe',
    name: 'PhonePe Gateway',
    icon: 'CreditCard',
    description: 'Pay using PhonePe payment gateway',
    fees: '1.8%',
    processingTime: 'Instant'
  },
  BANK_TRANSFER: {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'Building',
    description: 'Direct bank account transfer',
    fees: 0,
    processingTime: '1-2 hours'
  },
  PAYMENT_LINK: {
    id: 'payment_link',
    name: 'Payment Link',
    icon: 'Link',
    description: 'Secure payment link via email/SMS',
    fees: '1.8%',
    processingTime: 'Instant'
  }
};

/**
 * Generate UPI payment URL
 */
export function generateUPIUrl(amount, transactionNote = '', transactionId = '') {
  const params = new URLSearchParams({
    pa: siteConfig.upiId,
    pn: siteConfig.upiPayeeName,
    am: amount.toString(),
    cu: 'INR',
    tn: transactionNote || `Course Enrollment Payment`,
    tr: transactionId || `TXN_${Date.now()}`
  });
  
  return `upi://pay?${params.toString()}`;
}

/**
 * Generate UPI QR Code data
 */
export function generateUPIQRData(amount, transactionNote = '', transactionId = '') {
  return generateUPIUrl(amount, transactionNote, transactionId);
}

/**
 * Initiate payment based on method
 */
export async function initiatePayment(paymentData) {
  const {
    method,
    amount,
    courseId,
    courseName,
    studentDetails,
    metadata = {}
  } = paymentData;

  try {
    switch (method) {
      case 'upi':
        return await initiateUPIPayment(paymentData);
      
      case 'phonepe':
        return await initiatePhonePePayment(paymentData);
      
      case 'bank_transfer':
        return await initiateBankTransfer(paymentData);
      
      case 'payment_link':
        return await generatePaymentLink(paymentData);
      
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
}

/**
 * UPI Payment Initiation
 */
async function initiateUPIPayment(paymentData) {
  const { amount, courseName, studentDetails } = paymentData;
  
  const transactionId = `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const transactionNote = `${courseName} - ${studentDetails.name}`;
  
  const upiUrl = generateUPIUrl(amount, transactionNote, transactionId);
  const qrData = generateUPIQRData(amount, transactionNote, transactionId);
  
  // Store pending payment
  await storePendingPayment({
    transactionId,
    method: 'upi',
    amount,
    studentDetails,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  
  return {
    success: true,
    method: 'upi',
    transactionId,
    upiUrl,
    qrData,
    instructions: [
      `Open any UPI app (GPay, PhonePe, Paytm, etc.)`,
      `Scan the QR code or click the "Pay Now" button`,
      `Verify payee name: ${siteConfig.upiPayeeName}`,
      `Complete payment of ₹${amount}`,
      `Copy the UTR/Transaction ID and submit below`
    ]
  };
}

/**
 * PhonePe Gateway Payment
 */
async function initiatePhonePePayment(paymentData) {
  const { amount, courseName, studentDetails } = paymentData;
  
  try {
    const phonePeResponse = await phonePeInitiate({
      amount,
      customer: {
        email: studentDetails.email,
        phone: studentDetails.phone,
        name: studentDetails.name
      },
      notes: {
        courseId: paymentData.courseId,
        courseName,
        description: `Enrollment for ${courseName}`
      }
    });
    
    return {
      success: true,
      method: 'phonepe',
      transactionId: phonePeResponse.merchantTransactionId,
      redirectUrl: phonePeResponse.redirectUrl,
      instructions: [
        'You will be redirected to PhonePe payment page',
        'Complete payment using your preferred method',
        'You will be redirected back after payment'
      ]
    };
  } catch (error) {
    throw new Error(`PhonePe payment initiation failed: ${error.message}`);
  }
}

/**
 * Bank Transfer Instructions
 */
async function initiateBankTransfer(paymentData) {
  const { amount, courseName, studentDetails } = paymentData;
  
  const transactionId = `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  // Store pending payment
  await storePendingPayment({
    transactionId,
    method: 'bank_transfer',
    amount,
    studentDetails,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  
  return {
    success: true,
    method: 'bank_transfer',
    transactionId,
    bankDetails: {
      accountName: siteConfig.legalName,
      accountNumber: 'XXXXXXXXXXXX', // Replace with actual
      ifscCode: 'XXXXXXXXX', // Replace with actual
      bankName: 'Bank Name', // Replace with actual
      branch: 'Branch Name' // Replace with actual
    },
    instructions: [
      `Transfer ₹${amount} to the bank account shown above`,
      `Use reference: ${transactionId}`,
      `Send screenshot/receipt via WhatsApp: ${siteConfig.supportPhone}`,
      `Or email to: ${siteConfig.supportEmail}`,
      `Processing time: 1-2 hours during business hours`
    ]
  };
}

/**
 * Generate Payment Link
 */
async function generatePaymentLink(paymentData) {
  const { amount, courseName, studentDetails } = paymentData;
  
  // In a real implementation, this would create a secure payment link
  // For now, we'll redirect to PhonePe
  return await initiatePhonePePayment(paymentData);
}

/**
 * Verify payment based on method
 */
export async function verifyPayment(verificationData) {
  const { method, transactionId, reference, additionalData = {} } = verificationData;
  
  try {
    switch (method) {
      case 'upi':
        return await verifyUPIPayment(transactionId, reference);
      
      case 'phonepe':
        return await verifyPhonePePayment(transactionId);
      
      case 'bank_transfer':
        return await verifyBankTransfer(transactionId, reference);
      
      default:
        throw new Error('Unsupported payment verification method');
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * UPI Payment Verification (Manual)
 */
async function verifyUPIPayment(transactionId, utrReference) {
  if (!utrReference || utrReference.length < 8) {
    throw new Error('Please provide valid UTR/Transaction ID (minimum 8 characters)');
  }
  
  // In a real implementation, you might integrate with bank APIs
  // For now, we'll mark as verified pending manual confirmation
  
  await updatePendingPayment(transactionId, {
    status: 'verification_pending',
    utrReference,
    verifiedAt: new Date().toISOString()
  });
  
  return {
    success: true,
    status: 'verification_pending',
    message: 'Payment submitted for verification. You will receive confirmation within 1 hour.',
    reference: utrReference
  };
}

/**
 * PhonePe Payment Verification
 */
async function verifyPhonePePayment(transactionId) {
  try {
    const verification = await phonePeVerify(transactionId);
    
    if (verification.success) {
      await updatePendingPayment(transactionId, {
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        gatewayResponse: verification
      });
      
      return {
        success: true,
        status: 'verified',
        message: 'Payment verified successfully',
        amount: verification.amount
      };
    } else {
      throw new Error(verification.message || 'Payment verification failed');
    }
  } catch (error) {
    throw new Error(`PhonePe verification failed: ${error.message}`);
  }
}

/**
 * Bank Transfer Verification
 */
async function verifyBankTransfer(transactionId, reference) {
  if (!reference || reference.length < 8) {
    throw new Error('Please provide valid bank reference/transaction ID');
  }
  
  await updatePendingPayment(transactionId, {
    status: 'verification_pending',
    bankReference: reference,
    verifiedAt: new Date().toISOString()
  });
  
  return {
    success: true,
    status: 'verification_pending',
    message: 'Bank transfer submitted for verification. Processing time: 1-2 hours.',
    reference
  };
}

/**
 * Process payment and enrollment
 */
export async function processPaymentAndEnrollment(paymentData, enrollmentData) {
  try {
    // Verify payment first
    const verification = await verifyPayment(paymentData);
    
    if (!verification.success) {
      throw new Error(verification.error || 'Payment verification failed');
    }
    
    // If payment is verified, proceed with enrollment
    if (verification.status === 'verified') {
      const enrollmentResult = await enrollStudent({
        ...enrollmentData,
        paymentReference: paymentData.reference || paymentData.transactionId,
        paymentMethod: paymentData.method,
        paymentAmount: paymentData.amount
      });
      
      if (enrollmentResult.success) {
        // Update payment record with enrollment info
        await updatePendingPayment(paymentData.transactionId, {
          status: 'completed',
          enrollmentId: enrollmentResult.enrollmentId,
          completedAt: new Date().toISOString()
        });
        
        return {
          success: true,
          enrollmentId: enrollmentResult.enrollmentId,
          message: 'Payment verified and enrollment completed successfully!'
        };
      } else {
        throw new Error(enrollmentResult.error);
      }
    } else {
      // Payment pending verification
      return {
        success: true,
        status: 'pending_verification',
        message: verification.message
      };
    }
  } catch (error) {
    console.error('Payment and enrollment processing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Store pending payment
 */
async function storePendingPayment(paymentData) {
  try {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    payments.push(paymentData);
    localStorage.setItem('pending_payments', JSON.stringify(payments));
    
    // In real implementation, store in Firebase/database
    return true;
  } catch (error) {
    console.error('Failed to store pending payment:', error);
    return false;
  }
}

/**
 * Update pending payment
 */
async function updatePendingPayment(transactionId, updates) {
  try {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    const updatedPayments = payments.map(payment => 
      payment.transactionId === transactionId 
        ? { ...payment, ...updates, updatedAt: new Date().toISOString() }
        : payment
    );
    localStorage.setItem('pending_payments', JSON.stringify(updatedPayments));
    
    // In real implementation, update in Firebase/database
    return true;
  } catch (error) {
    console.error('Failed to update pending payment:', error);
    return false;
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(transactionId) {
  try {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    const payment = payments.find(p => p.transactionId === transactionId);
    
    if (!payment) {
      return {
        found: false,
        message: 'Payment record not found'
      };
    }
    
    return {
      found: true,
      payment,
      status: payment.status,
      message: getStatusMessage(payment.status)
    };
  } catch (error) {
    console.error('Failed to get payment status:', error);
    return {
      found: false,
      error: error.message
    };
  }
}

/**
 * Get status message for payment status
 */
function getStatusMessage(status) {
  const messages = {
    pending: 'Payment is pending completion',
    verification_pending: 'Payment submitted for verification',
    verified: 'Payment verified successfully',
    completed: 'Payment completed and enrollment active',
    failed: 'Payment failed or was rejected',
    refunded: 'Payment has been refunded'
  };
  
  return messages[status] || 'Unknown payment status';
}

/**
 * Payment analytics and reporting
 */
export async function getPaymentAnalytics(dateRange = 'last_30_days') {
  try {
    const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    
    // Filter by date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last_7_days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    // Calculate analytics
    const analytics = {
      totalPayments: filteredPayments.length,
      totalAmount: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      byStatus: {},
      byMethod: {},
      byDate: {}
    };
    
    // Group by status
    filteredPayments.forEach(payment => {
      analytics.byStatus[payment.status] = (analytics.byStatus[payment.status] || 0) + 1;
      analytics.byMethod[payment.method] = (analytics.byMethod[payment.method] || 0) + 1;
      
      const date = new Date(payment.createdAt).toDateString();
      analytics.byDate[date] = (analytics.byDate[date] || 0) + 1;
    });
    
    return analytics;
  } catch (error) {
    console.error('Failed to get payment analytics:', error);
    return null;
  }
}