import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  try {
    if (
      !process.env.PAYPAL_API ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID  ||
      !process.env.PAYPAL_SECRET
    ) {
      throw new Error("PayPal environment variables are not set");
    }

    // Get PayPal Access Token
    const auth = btoa(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    );

    const tokenResponse = await fetch(
      `${process.env.PAYPAL_API}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token)
      throw new Error("Failed to retrieve PayPal access token");

    // Create Subscription Plan
    const planResponse = await fetch(
      `${process.env.PAYPAL_API}/v1/billing/plans`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          product_id: "PROD-74H972345B874603L", // Replace with your actual product ID
          name: "7-Day Subscription Plan",
          description: "Access to premium features for 7 days",
          status: "ACTIVE",
          billing_cycles: [
            {
              frequency: { interval_unit: "DAY", interval_count: 7 },
              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 12, // 12 weeks
              pricing_scheme: {
                fixed_price: { value: "19.99", currency_code: "USD" },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: { value: "0", currency_code: "USD" },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3,
          },
        }),
      }
    );

    const planData = await planResponse.json();
    return NextResponse.json({ planId: planData.id }, { status: 200 });
  } catch (error) {
    console.error("PayPal Plan Creation Error:", error);
    return NextResponse.json(
      { error: "Error creating PayPal plan" },
      { status: 500 }
    );
  }
}
