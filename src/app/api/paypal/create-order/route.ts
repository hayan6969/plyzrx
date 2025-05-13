import { NextResponse } from "next/server";

interface PayPalOrderRequest {
  orderAmount: string;
}

interface PayPalOrderResponse {
  id?: string;
  status?: string;
  error?: string;
}

export async function POST(
  req: Request
): Promise<NextResponse<PayPalOrderResponse>> {
  try {
    const { orderAmount }: PayPalOrderRequest = await req.json();

    if (
      !process.env.PAYPAL_API ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_SECRET
    ) {
      throw new Error("PayPal environment variables are not set");
    }

    const response = await fetch(
      `${process.env.PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: orderAmount,
              },
            },
          ],
application_context: {
    shipping_preference: "NO_SHIPPING", 
  },
        }),
      }
    );

    const data: PayPalOrderResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error creating PayPal order";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
