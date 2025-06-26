import { NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY = process.env.BANKFUL_SECRET_KEY || "Fatherland.2k@";
const FRONTEND_URL = "https://plyzrx.vercel.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const transStatus = searchParams.get("TRANS_STATUS_NAME");
  const transValue = searchParams.get("TRANS_VALUE");
  const transOrderId = searchParams.get("TRANS_ORDER_ID");
  const xtlOrderId = searchParams.get("XTL_ORDER_ID");
  const signature = searchParams.get("SIGNATURE");

  let isValidSignature = false;
  if (signature) {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "SIGNATURE") {
        params[key] = value;
      }
    });

    const sortedKeys = Object.keys(params).sort();

    let message = "";
    for (const key of sortedKeys) {
      if (params[key] !== undefined && params[key] !== "") {
        message += key + params[key];
      }
    }

    const calculatedSignature = crypto
      .createHmac("sha256", API_KEY)
      .update(message)
      .digest("hex");

    isValidSignature = calculatedSignature === signature;
    console.log("Signature verification:", {
      received: signature,
      calculated: calculatedSignature,
      isValid: isValidSignature,
    });
  }

  console.log(
    `Payment ${status || transStatus}: Order ID ${
      xtlOrderId || transOrderId || "unknown"
    }, Amount ${transValue || "unknown"}, Signature valid: ${isValidSignature}`
  );

  let redirectPath = "/payment/failed";

  if (status === "success" || transStatus === "APPROVED") {
    redirectPath = "/payment/success";
  } else if (status === "pending" || transStatus === "PENDING") {
    redirectPath = "/payment/pending";
  }

  return NextResponse.redirect(
    `${FRONTEND_URL}${redirectPath}?orderId=${xtlOrderId || ""}`
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const transStatus = data.TRANS_STATUS_NAME;
    const transValue = data.TRANS_VALUE;
    const transOrderId = data.TRANS_ORDER_ID;
    const xtlOrderId = data.XTL_ORDER_ID;
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
        if (params[key] !== undefined && params[key] !== "") {
          message += key + params[key];
        }
      }

      const calculatedSignature = crypto
        .createHmac("sha256", API_KEY)
        .update(message)
        .digest("hex");

      isValidSignature = calculatedSignature === signature;
      console.log("Webhook signature verification:", {
        received: signature,
        calculated: calculatedSignature,
        isValid: isValidSignature,
      });
    }

    console.log(
      `Payment callback: Status ${transStatus}, Order ID ${
        xtlOrderId || transOrderId
      }, Amount ${transValue}, Signature valid: ${isValidSignature}`
    );

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error processing Bankful callback:", error);
    return new Response(null, { status: 500 });
  }
}
