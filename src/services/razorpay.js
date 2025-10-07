/**
 * Razorpay Integration Service
 * Handles payment processing and order creation
 */

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id';

/**
 * Load Razorpay script dynamically
 * @returns {Promise<boolean>} True if script loaded successfully
 */
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * Create Razorpay order
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Order response
 */
export const createOrder = async (orderData) => {
    try {
        const res = await fetch('/.netlify/functions/razorpay-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: orderData.amount * 100, currency: orderData.currency || 'INR', receipt: orderData.receipt })
        });
        if (!res.ok) {
            throw new Error(`Order creation failed: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

/**
 * Process payment using Razorpay
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (paymentData) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
    }

    return new Promise((resolve, reject) => {
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: 'Agnidhra Technologies',
            description: paymentData.description,
            order_id: paymentData.orderId,
            handler: function (response) {
                resolve({
                    success: true,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature
                });
            },
            prefill: {
                name: paymentData.customerName,
                email: paymentData.customerEmail,
                contact: paymentData.customerPhone
            },
            config: {
                display: {
                    blocks: {
                        upi: {
                            name: 'UPI',
                            instruments: [{ method: 'upi' }]
                        }
                    },
                    sequence: ['upi'],
                    preferences: {
                        show_default_blocks: false
                    }
                }
            },
            theme: {
                color: '#2563eb' // Blue 600 to match the new theme
            },
            modal: {
                ondismiss: function() {
                    reject(new Error('Payment cancelled by user'));
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    });
};

/**
 * Verify payment signature (this should be done on the server)
 * @param {Object} paymentDetails - Payment verification data
 * @returns {Promise<boolean>} Verification result
 */
export const verifyPayment = async (paymentDetails) => {
    try {
        const res = await fetch('/.netlify/functions/razorpay-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: paymentDetails.orderId,
                paymentId: paymentDetails.paymentId,
                signature: paymentDetails.signature,
            })
        });
        if (!res.ok) return false;
        const data = await res.json();
        return !!data.valid;
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
};

/**
 * Payment plans configuration
 */
export const PAYMENT_PLANS = {
    defensiveBootcamp: {
        name: '7-Day Defensive Security Bootcamp',
        price: 2999,
        originalPrice: 4999,
        currency: 'INR',
        description: 'Complete defensive security training with hands-on labs'
    },
    offensiveBootcamp: {
        name: '7-Day Ethical Hacking Bootcamp',
        price: 3499,
        originalPrice: 5999,
        currency: 'INR',
        description: 'Comprehensive ethical hacking training with practical exercises'
    },
    workshop: {
        name: 'Free Cybersecurity Workshop',
        price: 0,
        originalPrice: 0,
        currency: 'INR',
        description: 'Introduction to cybersecurity fundamentals'
    },
    workshopPremium: {
        name: 'Premium Workshop Bundle',
        price: 499,
        originalPrice: 999,
        currency: 'INR',
        description: 'Workshop + exclusive materials + career guidance session'
    }
};