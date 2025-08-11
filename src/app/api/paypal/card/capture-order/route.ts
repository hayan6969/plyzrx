import { NextResponse } from "next/server";

interface PayPalCaptureRequest {
  orderID: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { orderID }: PayPalCaptureRequest = await request.json();

    if (
      !process.env.PAYPAL_API ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_SECRET
    ) {
      throw new Error("PayPal environment variables are not set");
    }

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

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token as string | undefined;
    if (!accessToken) {
      throw new Error("Failed to retrieve PayPal access token");
    }

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

    const captureData = await captureResponse.json();

    // Check if there's a capture and its status
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
      return NextResponse.json(
        { error: "No capture information found in response" },
        { status: 400 }
      );
    }

    // If capture status is DECLINED, return error with details
    if (capture.status === "DECLINED") {
      const processorResponse = capture.processor_response || {};
      const errorDetail = {
        status: "DECLINED",
        reason: processorResponse.response_code || "Unknown reason",
        message:
          "Your payment was declined. Please try a different payment method.",
      };
      return NextResponse.json({ error: errorDetail }, { status: 400 });
    }

    // Only return success if capture status is COMPLETED
    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: {
            status: capture.status,
            message: "Payment capture failed. Please try again.",
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(captureData, { status: captureResponse.status });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error capturing PayPal payment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
