import { NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY = process.env.BANKFUL_SECRET_KEY || "Fatherland.2k@";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const transStatus = data.TRANS_STATUS_NAME;
    const transValue = data.TRANS_VALUE;
    const xtlOrderId = data.XTL_ORDER_ID;
    const transCurrency = data.TRANS_CUR;
    const signature = data.SIGNATURE;

    let isValidSignature = false;
    if (signature) {
      const params: Record<string, string> = {};
      Object.keys(data).forEach((key) => {
        if (key !== "SIGNATURE") {
          params[key] = data[key];
        }
      });

      const sortedKeys = Object.keys(params).sort();

      let message = "";
      for (const key of sortedKeys) {
        message += key + params[key];
      }

      const calculatedSignature = crypto
        .createHmac("sha256", API_KEY)
        .update(message)
        .digest("hex");

      isValidSignature = calculatedSignature === signature;
    }

    console.log(
      `Bankful webhook: Status ${transStatus}, Order ID ${xtlOrderId}, Amount ${transValue}, Signature valid: ${isValidSignature}`
    );

    if (!isValidSignature) {
      console.error("Invalid signature in Bankful webhook");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    if (transStatus === "APPROVED") {
      console.log(
        `Payment approved for order ${xtlOrderId}, amount ${transValue} ${transCurrency}`
      );
    } else if (transStatus === "PENDING") {
      console.log(
        `Payment pending for order ${xtlOrderId}, amount ${transValue} ${transCurrency}`
      );
    } else if (transStatus === "DECLINED") {
      const errorMessage = data.ERROR_MESSAGE;

      console.log(
        `Payment declined for order ${xtlOrderId}: ${
          errorMessage || "No error message"
        }`
      );
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error processing Bankful webhook:", error);
    return new Response(null, { status: 500 });
  }
}
