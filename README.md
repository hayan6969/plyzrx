This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Bankful eChecks Integration

This project includes integration with Bankful eChecks payment system. To set up the integration:

1. Create a `.env.local` file in the root directory with the following variables:

```
# Bankful API credentials
BANKFUL_MERCHANT_ID=your-merchant-id
BANKFUL_API_KEY=your-api-key

# Base URL for callbacks and webhooks
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Other environment variables
NEXT_PUBLIC_PLAN_ONE=plan-id-1
NEXT_PUBLIC_PLAN_TWO=plan-id-2
NEXT_PUBLIC_PLAN_THREE=plan-id-3
```

2. Replace `your-merchant-id` and `your-api-key` with your actual Bankful API credentials.
3. Update the `NEXT_PUBLIC_BASE_URL` to match your production URL when deploying.

### Payment Flow

The Bankful payment flow works as follows:

1. User clicks "Purchase" on a tournament card
2. User selects "Pay with Bankful eChecks" in the payment modal
3. User is redirected to the Bankful hosted payment page
4. After completing payment, user is redirected back to the success/failure page
5. Bankful sends a webhook notification to confirm the payment status

### API Routes

- `/api/payment/bankful` - Initiates the payment process and redirects to Bankful
- `/api/payment/bankful/callback` - Handles user redirection after payment
- `/api/payment/bankful/webhook` - Processes webhook notifications from Bankful
