import { NextResponse } from "next/server";
import crypto from "crypto";

const BANKFUL_API_URL =
  "https://api.paybybankful.com/front-calls/go-in/hosted-page-pay";

const MERCHANT_USERNAME = process.env.BANKFUL_USERNAME || "support@plyzrx.com";
const API_KEY = process.env.BANKFUL_SECRET_KEY || "Fatherland.2k@";

interface BankfulPayload {
  req_username: string;
  transaction_type: string;
  amount: string;
  request_currency: string;
  xtl_order_id: string;
  url_cancel: string;
  url_complete: string;
  url_failed: string;
  url_pending: string;
  url_callback: string;
  cart_name: string;
  return_redirect_url: string;
  signature?: string;
  cust_fname?: string;
  cust_lname?: string;
  cust_email?: string;
  cust_phone?: string;
  bill_addr?: string;
  bill_addr_2?: string;
  bill_addr_city?: string;
  bill_addr_state?: string;
  bill_addr_zip?: string;
  bill_addr_country?: string;
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const xtl_order_id = `order-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const payload: BankfulPayload = {
      req_username: MERCHANT_USERNAME,
      transaction_type: "CAPTURE",
      amount: amount.toString(),
      request_currency: "USD",
      xtl_order_id: xtl_order_id,
      url_cancel: "https://plyzrx.vercel.app/payment/cancelled",
      url_complete: "https://plyzrx.vercel.app/payment/success",
      url_failed: "https://plyzrx.vercel.app/payment/failed",
      url_callback: "https://plyzrx.vercel.app/payment/callback",
      url_pending: "https://plyzrx.vercel.app/payment/pending",
      cart_name: "Hosted-Page",
      return_redirect_url: "Y",
    };

    const signature = generateSignature(payload, API_KEY);

    payload.signature = signature;

    console.log("Full payload with signature:", payload);

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    console.log("Sending payload to Bankful:", Object.fromEntries(formData));

    const response = await fetch(BANKFUL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Bankful API error response:", responseText);

      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = JSON.stringify(errorJson);
      } catch {}

      return NextResponse.json(
        {
          success: false,
          error: `Bankful API Error (${response.status}): ${errorDetails}`,
          statusCode: response.status,
          rawResponse: responseText,
        },
        { status: response.status }
      );
    }

    let responseData;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);

        const redirectMatch = text.match(
          /window\.location\.href\s*=\s*['"]([^'"]+)['"]/
        );
        if (redirectMatch && redirectMatch[1]) {
          return NextResponse.json({
            success: true,
            redirectUrl: redirectMatch[1],
            orderId: xtl_order_id,
          });
        }

        return NextResponse.json({
          success: false,
          error: "Unexpected response format",
          rawResponse: text,
        });
      }
    } catch (error) {
      console.error("Error parsing response:", error);

      const rawResponse = await response.text();
      return NextResponse.json({
        success: false,
        error: "Failed to parse API response",
        rawResponse: rawResponse,
      });
    }

    console.log("Bankful API response:", responseData);

    if (responseData.redirect_url) {
      console.log("Redirect URL:", responseData.redirect_url);
      return NextResponse.json({
        success: true,
        redirectUrl: responseData.redirect_url,
        orderId: xtl_order_id,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "API request failed",
        errorDetails: {
          errorMessage: responseData.ERROR_MESSAGE || null,
          apiAdvice: responseData.API_ADVICE || null,
          genericError: responseData.errorMessage || null,
          fullResponse: responseData,
        },
      });
    }
  } catch (error) {
    console.error("Error processing Bankful payment request:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process payment request",
      errorDetails: error instanceof Error ? error.message : String(error),
    });
  }
}

function generateSignature(payload: BankfulPayload, apiKey: string): string {
  const payloadForSignature = { ...payload };
  delete payloadForSignature.signature;

  const sortedKeys = Object.keys(payloadForSignature).sort();
  console.log("sortedKeys:", sortedKeys);

  const payloadString = sortedKeys
    .filter(
      (k) =>
        typeof payloadForSignature[k as keyof typeof payloadForSignature] !==
          "undefined" &&
        payloadForSignature[k as keyof typeof payloadForSignature] !== null &&
        payloadForSignature[k as keyof typeof payloadForSignature] !== ""
    )
    .map(
      (k) => `${k}${payloadForSignature[k as keyof typeof payloadForSignature]}`
    )
    .join("");

  console.log("Signature message:", payloadString);

  const signature = crypto
    .createHmac("sha256", apiKey)
    .update(payloadString)
    .digest("hex");
  console.log("Generated signature:", signature);

  return signature;
}
