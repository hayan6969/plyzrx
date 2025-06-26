import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log("Received payment callback:", params);

    const transactionId = params.transaction_id || "";
    const status = params.status || "";
    const amount = params.amount || "";
    const currency = params.currency || "";
    const orderReference = params.order_reference || "";

    console.log(
      `Payment ${status} for order ${orderReference}: ${amount} ${currency} (Transaction ID: ${transactionId})`
    );

    return NextResponse.json({
      success: true,
      message: "Payment callback received and processed",
    });
  } catch (error) {
    console.error("Error processing payment callback:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process payment callback",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
