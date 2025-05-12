# Appwrite Setup Guide for Payment System

This guide will walk you through setting up the Appwrite database and collections needed for the payment system.

## 1. Create a Database

1. Log in to your Appwrite Console
2. Navigate to Databases
3. Click "Create Database"
4. Name it "payments_db" (or any name you prefer)
5. Set appropriate permissions (recommended: allow read/write for authenticated users)

## 2. Create Collections

### Payment Logs Collection

1. In your database, click "Create Collection"
2. Name it "payment_logs"
3. Set appropriate permissions
4. Add the following attributes:

| Attribute Name | Type | Required | Default | Min Length | Max Length |
|---------------|------|----------|---------|------------|------------|
| userId | String | Yes | - | - | - |
| username | String | Yes | - | - | - |
| dateTime | String | Yes | - | - | - |
| platform | String | Yes | - | - | - |
| paymentAmount | Integer | Yes | - | - | - |
| paymentId | String | Yes | - | - | - |

> **Important**: The `paymentAmount` is stored as an integer in cents (e.g., $19.99 is stored as 1999). The application automatically handles the conversion between dollars and cents.

5. Create the following indexes:

| Key | Type | Attributes | Orders |
|-----|------|------------|--------|
| userId | Key | userId | ASC |
| paymentId | Unique | paymentId | - |

### User Tiers Collection

1. In your database, click "Create Collection"
2. Name it "user_tiers"
3. Set appropriate permissions
4. Add the following attributes:

| Attribute Name | Type | Required | Default | Min | Max |
|---------------|------|----------|---------|-----|-----|
| userId | String | Yes | - | - | - |
| tier1 | Boolean | Yes | false | - | - |
| tier2 | Boolean | Yes | false | - | - |
| tier3 | Boolean | Yes | false | - | - |

5. Create the following indexes:

| Key | Type | Attributes | Orders |
|-----|------|------------|--------|
| userId | Unique | userId | - |

## 3. Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_PAYMENT_LOGS_COLLECTION_ID=your-payment-logs-collection-id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your-user-tiers-collection-id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
```

Replace the placeholder values with your actual Appwrite and PayPal credentials.

## 4. Integration with Existing PayPal Implementation

The integration with your existing PayPal implementation has been completed without changing the core PayPal payment flow:

1. When a payment is successful, the transaction data is saved to Appwrite
2. User tier information is updated based on the payment amount
3. The admin dashboard displays both payment logs and user tier information

### How It Works

1. **PayPalButton Component**: 
   - The original PayPal implementation remains unchanged
   - After a successful payment, it saves the transaction data to Appwrite
   - It also updates the user's tier information based on the payment amount

2. **Admin Dashboard**:
   - Fetches payment logs and user tier information from Appwrite
   - Displays this data in two tabs: Payment Logs and Users
   - Falls back to mock data if Appwrite data is not available

3. **User Identification**:
   - The PayPalButton component accepts userId and username props
   - These values are stored with the payment data
   - If not provided, defaults to "anonymous" and "guest"

### Using the PayPalButton Component

```tsx
<PayPalButton
  amount="19.99"
  userId="user_123"
  username="testuser"
/>
```

## 5. Tier Pricing

The system automatically determines which tier to activate based on the payment amount:

- Tier 1: $19.99
- Tier 2: $49.99
- Tier 3: $99.99

When a user purchases a higher tier, all lower tiers are automatically activated as well.

## 6. Security Considerations

- Ensure that your collections have appropriate permissions
- Consider implementing server-side validation for payments
- For production, consider implementing webhook verification for PayPal payments
- Implement proper error handling and logging

## 7. Troubleshooting

### Payment Amount Format

If you encounter errors related to the payment amount format, ensure that:

1. The `paymentAmount` attribute in the Appwrite collection is set to `Integer` type
2. The application is correctly converting dollar amounts to cents before saving to Appwrite
3. The application is converting cents back to dollars when displaying amounts in the UI 