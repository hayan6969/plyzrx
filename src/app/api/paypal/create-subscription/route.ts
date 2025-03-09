import { NextResponse } from "next/server";

interface PayPalSubscriptionRequest {
  planId: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { planId }: PayPalSubscriptionRequest = await req.json();

    if (
      !process.env.PAYPAL_API ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_SECRET
    ) {
      throw new Error("PayPal environment variables are not set");
    }

    // Get PayPal Access Token
    const tokenResponse = await fetch(
      `${process.env.PAYPAL_API}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Failed to retrieve PayPal access token");
    }

    // Create Subscription Order
    const subscriptionResponse = await fetch(
      `${process.env.PAYPAL_API}/v1/billing/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          plan_id: planId,
          subscriber: {
            name: { given_name: "John", surname: "Doe" },
            email_address: "john.doe@example.com",
          },
          application_context: {
            shipping_preference: "NO_SHIPPING", // Hides shipping details
            user_action: "SUBSCRIBE_NOW",
          },
        }),
      }
    );

    const subscriptionData = await subscriptionResponse.json();

    return NextResponse.json(
      { subscriptionId: subscriptionData.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("PayPal Subscription Error:", error);
    return NextResponse.json(
      { error: "Error creating PayPal subscription" },
      { status: 500 }
    );
  }
}
