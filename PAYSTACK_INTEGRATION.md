# Paystack Integration Guide

## Overview

The payment system has been integrated with Paystack for secure payment processing. Paystack is a popular payment gateway in Africa that supports multiple payment methods including cards, bank transfers, and mobile money.

## API Endpoints

### 1. Initialize Payment
```
POST /api/payments/initialize
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "courseId": "course_id_here",
  "email": "student@example.com",
  "callback_url": "https://yoursite.com/payment/callback"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://paystack.com/pay/xxx",
    "access_code": "access_code",
    "reference": "payment_reference"
  }
}
```

### 2. Verify Payment
```
POST /api/payments/verify
```

**Request Body:**
```json
{
  "reference": "payment_reference_from_paystack"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // enrollment object
  }
}
```

### 3. Get Payment History
```
GET /api/payments/history
Authorization: Bearer {token}
```

## Setup Instructions

### 1. Get Paystack API Keys

1. Sign up at https://paystack.com
2. Go to Settings → API Keys & Webhooks
3. Copy your test/live secret key and public key

### 2. Configure Environment Variables

Add to your `backend/.env` file:

```env
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_CURRENCY=NGN
```

### 3. Configure Webhook (Optional but Recommended)

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/webhook/paystack`
3. Enable events: `charge.success`

## Payment Flow

### Frontend Integration

```javascript
// 1. Initialize Payment
const initializePayment = async (courseId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/initialize`,
      {
        courseId,
        email: user.email,
        callback_url: `${window.location.origin}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Redirect user to Paystack payment page
    window.location.href = response.data.data.authorization_url;
  } catch (error) {
    console.error('Payment initialization error:', error);
  }
};

// 2. Verify Payment (after callback)
const verifyPayment = async (reference) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/verify`,
      { reference }
    );

    if (response.data.success) {
      // Payment verified, student enrolled
      alert('Payment successful! You are now enrolled.');
      window.location.href = '/my-courses';
    }
  } catch (error) {
    console.error('Payment verification error:', error);
  }
};

// On callback page
const params = new URLSearchParams(window.location.search);
const reference = params.get('reference');
if (reference) {
  verifyPayment(reference);
}
```

## Test Payments

### Test Cards

Use these test cards in Paystack's test mode:

**Successful Payment:**
- Card Number: `4084084084084081`
- CVV: Any 3 digits
- Expiry: Any future date
- PIN: `0000` (or any 4 digits)

**Failed Payment:**
- Card Number: `4000000000000002`

### Alternative Payment Methods

Paystack supports various payment methods:
- **Card Payments**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct account deposit
- **USSD**: Mobile phone banking
- **QR Code**: Scan to pay

## Currency Support

Paystack supports multiple African currencies:

- `NGN` - Nigerian Naira (default)
- `GHS` - Ghanaian Cedi
- `ZAR` - South African Rand
- `KES` - Kenyan Shilling
- And more...

Update `PAYSTACK_CURRENCY` in `.env` to change currency.

## Amount Conversion

Amounts are stored in the smallest currency unit:
- NGN: Kobo (1 NGN = 100 Kobo)
- GHS: Pesewas (1 GHS = 100 Pesewas)
- USD: Cents (1 USD = 100 Cents)

The API automatically converts prices to the correct unit.

## Security Features

1. **Webhook Verification**: Uses HMAC SHA512 signature verification
2. **Metadata Tracking**: Stores user and course IDs in transaction metadata
3. **Duplicate Prevention**: Checks if user already enrolled before creating duplicate enrollments
4. **Reference Tracking**: Each payment has a unique Paystack reference

## Error Handling

### Common Errors

**Payment Not Successful:**
```json
{
  "success": false,
  "message": "Payment not successful"
}
```

**Already Enrolled:**
```json
{
  "success": true,
  "message": "Already enrolled",
  "data": { /* existing enrollment */ }
}
```

**Invalid Metadata:**
```json
{
  "success": false,
  "message": "Invalid payment metadata"
}
```

## Monitoring

### Paystack Dashboard:
- View all transactions
- Monitor success rates
- Track revenue
- Download reports

### Database Tracking:
- All payments saved to `Payment` collection
- Track payment history per user
- Link payments to enrollments

## Production Considerations

1. **Use Live Keys**: Replace test keys with live keys in production
2. **SSL Required**: HTTPS required for webhooks in production
3. **Rate Limiting**: Implement rate limiting on payment endpoints
4. **Logging**: Log all payment attempts for debugging
5. **Notifications**: Send email confirmations for successful payments

## Troubleshooting

### Payment Initialization Fails
- Check API keys are correct
- Verify network connectivity to Paystack
- Check amount is not zero
- Ensure user email is valid

### Webhook Not Working
- Verify webhook URL is correct
- Check server is accessible from internet (use ngrok for testing)
- Verify webhook secret matches
- Check webhook signature in headers

### Payment Not Verified
- Check reference is valid
- Verify transaction status is 'success'
- Check metadata is properly stored
- Ensure course/user IDs are correct

## Support

- Paystack Documentation: https://paystack.com/docs
- Support: support@paystack.com
- Status Page: https://status.paystack.com

## Example Frontend Component

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EnrollButton = ({ course, user }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (course.price === 0) {
      // Free course - enroll directly
      try {
        await axios.post(
          `${API_URL}/api/enrollments/${course._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Successfully enrolled!');
        navigate('/my-courses');
      } catch (error) {
        alert('Enrollment failed');
      }
      return;
    }

    // Paid course - initialize payment
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/payments/initialize`,
        {
          courseId: course._id,
          email: user.email,
          callback_url: `${window.location.origin}/payment/callback`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Paystack
      window.location.href = response.data.data.authorization_url;
    } catch (error) {
      alert('Payment initialization failed');
      setLoading(false);
    }
  };

  return (
    <button onClick={handleEnroll} disabled={loading}>
      {loading ? 'Processing...' : course.price === 0 ? 'Enroll Free' : `Enroll - $${course.price}`}
    </button>
  );
};

export default EnrollButton;
```

## Migration from Stripe

If you were previously using Stripe:

1. **Environment Variables**: Update from Stripe keys to Paystack keys
2. **API Endpoints**: Changed from `/create-payment-intent` to `/initialize`
3. **Verification**: Changed from `/confirm-payment` to `/verify`
4. **Amount Format**: Same (multiply by 100)
5. **Webhooks**: Different webhook signature format

All payment records maintain compatibility with existing data.

