# RagaPay Payment Integration

This document outlines the integration of RagaPay payment gateway for credit and debit card payments.

## Setup

1. Set the following environment variables in your `.env` file:
   ```
   RAGAPAY_MERCHANT_KEY=your_merchant_key
   RAGAPAY_PASSWORD=your_password
   ```

2. For testing, you can use these test credentials:
   - Merchant Key: `65bb029e-671c-11f0-b63f-9a05f0e3d98a`
   - Password: `207ae01fd4b2a60576979b8f47b2a2b4`

## Components

- `RagaPayButton.tsx`: UI component for initiating payments
- `src/app/api/payment/ragapay/route.ts`: API endpoint for creating payment sessions
- `src/app/api/payment/ragapay/webhook/route.ts`: Webhook handler for payment notifications
- `src/app/api/payment/ragapay/callback/route.ts`: Callback handler for redirects after payment

## Flow

1. User clicks the payment button
2. Frontend calls `/api/payment/ragapay` endpoint
3. Backend creates a payment session with RagaPay
4. User is redirected to RagaPay checkout page
5. After payment, user is redirected back to success/cancel/failure page
6. RagaPay sends a webhook notification with payment status

## Testing

Use the following test card for testing:
- Card Number: 4242 4242 4242 4242
- Expiry: Any future date
- CVV: Any 3 digits