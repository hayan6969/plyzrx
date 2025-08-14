import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  FIRSTPROMOTER_PLANS,
  trackFirstPromoterSale,
  getFirstPromoterTrackingId,
} from "@/lib/firstpromoter";

interface PayPalCaptureRequest {
  orderID: string;
  email?: string;
  uid?: string;
  planType?: string; // basic, premium, pro
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { orderID, email, uid, planType }: PayPalCaptureRequest =
      await request.json();

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
          Prefer: "return=representation",
        },
      }
    );

    const captureData = await captureResponse.json();

    // If PayPal returned a non-2xx status, forward details back to the client
    if (!captureResponse.ok) {
      return NextResponse.json(
        {
          error: {
            message:
              captureData?.message ||
              captureData?.details?.[0]?.description ||
              "PayPal capture failed",
            status: captureData?.name || captureData?.status,
          },
          details: captureData?.details,
          debug_id: captureData?.debug_id,
        },
        { status: captureResponse.status }
      );
    }

    // Check if there's a capture and its status
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
      return NextResponse.json(
        {
          error: {
            message: "No capture information found in response",
            status: captureData?.status,
          },
          details: captureData?.details,
          debug_id: captureData?.debug_id,
        },
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

    // If capture status is COMPLETED, track the sale with FirstPromoter
    if (capture.status === "COMPLETED") {
      // Get transaction details
      const transactionId = capture.id || orderID;
      const amount = parseInt(capture.amount?.value || "0") * 100; // Convert to cents
      const currency = capture.amount?.currency_code || "USD";

      // Determine which plan to use
      let planId = FIRSTPROMOTER_PLANS.BASIC;
      if (planType === "premium") {
        planId = FIRSTPROMOTER_PLANS.PREMIUM;
      } else if (planType === "pro") {
        planId = FIRSTPROMOTER_PLANS.PRO;
      }

      // Get tracking ID from cookies
      const cookieStore = cookies();
      const tid = await getFirstPromoterTrackingId(cookieStore);

      // Ensure we have either email or uid for FirstPromoter
      const fpEmail = email || "customer@example.com"; // Fallback email if none provided
      const fpUid = uid || transactionId; // Use transaction ID as fallback user ID

      console.log("FirstPromoter tracking data:", {
        email: fpEmail,
        uid: fpUid,
        event_id: transactionId,
        tid,
        originalEmail: email,
        originalUid: uid,
      });

      // Track the sale with FirstPromoter
      await trackFirstPromoterSale({
        email: fpEmail,
        uid: fpUid,
        event_id: transactionId,
        amount,
        plan: planId,
        currency,
        tid,
      });

      // Return success response with the format expected by the client
      return NextResponse.json({
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: capture.id,
                  status: "COMPLETED",
                  amount: capture.amount,
                },
              ],
            },
          },
        ],
        status: "success",
        orderId: orderID,
        captureId: capture.id,
      });
    }

    // If we get here, the capture status is not COMPLETED
    return NextResponse.json(
      {
        error: {
          status: capture.status,
          message: "Payment capture failed. Please try again.",
        },
        details: captureData?.details,
        debug_id: captureData?.debug_id,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error capturing PayPal payment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
