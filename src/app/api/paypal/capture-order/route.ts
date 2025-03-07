import { NextResponse } from "next/server";

interface PayPalCaptureRequest {
  orderID: string;
}

interface PayPalTokenResponse {
  access_token?: string;
  error?: string;
}

interface PayPalCaptureResponse {
  id?: string;
  status?: string;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<PayPalCaptureResponse>> {
  try {
    const { orderID }: PayPalCaptureRequest = await request.json();

    if (!process.env.PAYPAL_API || !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      throw new Error("PayPal environment variables are not set");
    }

    // Get PayPal Access Token
    const tokenResponse = await fetch(
      `${process.env.PAYPAL_API}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData: PayPalTokenResponse = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Failed to retrieve PayPal access token");
    }

    // Capture PayPal Order
    const captureResponse = await fetch(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData: PayPalCaptureResponse = await captureResponse.json();
    return NextResponse.json(captureData);
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error capturing PayPal payment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}