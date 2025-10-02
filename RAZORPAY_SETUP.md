# Razorpay Integration Setup Guide

This guide will help you integrate Razorpay payments into your AT-CS website.

## Prerequisites

1. **Razorpay Account**: Create an account at [https://razorpay.com/](https://razorpay.com/)
2. **API Keys**: Get your Razorpay Key ID from the dashboard

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Razorpay credentials:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag  # Replace with your key
   ```

### 2. Razorpay Dashboard Setup

1. **Login to Razorpay Dashboard**: [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate/Download your Key ID and Key Secret
   - Use the Key ID in your `.env` file

3. **Configure Webhooks** (Optional but recommended):
   - Go to Settings → Webhooks
   - Add your webhook URL: `https://yourdomain.com/api/webhook`
   - Select events: `payment.authorized`, `payment.failed`, `payment.captured`

### 3. Payment Flow

The integration includes these pages:

1. **Account Activation Page** (`/accountActivation`)
   - Payment form with customer details
   - Integration with Razorpay checkout
   - Pricing display with discounts

2. **Payment Success Page** (`/paymentSuccess`)
   - Confirmation of successful payment
   - Receipt download functionality
   - Next steps for students

3. **Payment Failed Page** (`/paymentFailed`)
   - Error handling and retry options
   - Troubleshooting information
   - Alternative payment methods

### 4. Available Payment Plans

The system supports multiple payment plans defined in `src/services/razorpay.js`:

- **Defensive Security Bootcamp**: ₹2,999 (Save ₹2,000)
- **Ethical Hacking Bootcamp**: ₹3,499 (Save ₹2,500)
- **Free Workshop**: ₹0 (Free registration)
- **Premium Workshop Bundle**: ₹499 (Save ₹500)

### 5. Navigation Routes

New routes added to the application:

- `accountActivation-defensive` - Payment for defensive bootcamp
- `accountActivation-offensive` - Payment for offensive bootcamp
- `paymentSuccess` - Success page after payment
- `paymentFailed` - Failure page with retry options

## Testing

### Test Mode (Recommended for development)

1. Use Razorpay test keys (they start with `rzp_test_`)
2. Use test card numbers:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4000 0000 0000 0002
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

### Production Mode

1. Complete Razorpay account verification
2. Switch to live keys (start with `rzp_live_`)
3. Update environment variables

## Security Considerations

1. **Never expose Key Secret** in frontend code
2. **Verify payments on server-side** (currently simulated)
3. **Use HTTPS** in production
4. **Implement proper webhook verification**

## Backend Integration (Recommended)

For production, implement these server-side endpoints:

```javascript
// Create Order
POST /api/orders
{
  "amount": 299900,  // in paise
  "currency": "INR",
  "receipt": "order_receipt_123"
}

// Verify Payment
POST /api/verify-payment
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

## File Structure

```
src/
├── services/
│   └── razorpay.js          # Payment service integration
├── pages/
│   ├── AccountActivationPage.jsx  # Payment form
│   ├── PaymentSuccessPage.jsx     # Success page
│   └── PaymentFailedPage.jsx      # Failure page
└── App.jsx                  # Updated routing
```

## Customization

### Updating Payment Plans

Edit `src/services/razorpay.js`:

```javascript
export const PAYMENT_PLANS = {
  newPlan: {
    name: 'New Course',
    price: 1999,
    originalPrice: 2999,
    currency: 'INR',
    description: 'Course description'
  }
};
```

### Styling

The pages use Tailwind CSS classes. Customize colors and styling in:
- `AccountActivationPage.jsx`
- `PaymentSuccessPage.jsx`
- `PaymentFailedPage.jsx`

## Troubleshooting

### Common Issues

1. **Razorpay script not loading**
   - Check internet connection
   - Verify script URL is accessible

2. **Payment not processing**
   - Verify API keys are correct
   - Check browser console for errors
   - Ensure test mode is enabled for development

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for syntax errors in new files

### Support

- **Razorpay Documentation**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support**: [https://razorpay.com/support/](https://razorpay.com/support/)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Notes

1. **Environment Variables**: Ensure `.env` is not committed to Git
2. **Production Keys**: Use live Razorpay keys for production
3. **Domain Verification**: Add your domain to Razorpay dashboard
4. **SSL Certificate**: Ensure HTTPS is enabled for production

---

**Note**: This integration currently simulates backend operations. For production use, implement proper server-side order creation and payment verification.