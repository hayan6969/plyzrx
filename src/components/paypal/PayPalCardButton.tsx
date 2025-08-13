"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { assignUserToTournament, createPaymentLog } from "@/lib/appwriteDB";
import { updateUserTierFromPayment } from "@/lib/tierUpdater";

interface PayPalCardButtonProps {
  amount: string;
  userId?: string;
  username?: string;
  onClose?: () => void;
}

interface CreateOrderResponse {
  id: string;
}

interface CaptureOrderResponse {
  purchase_units: {
    payments: {
      captures: { id: string }[];
    };
  }[];
}

export default function PayPalCardButton({
  amount,
  userId = typeof window !== "undefined"
    ? localStorage.getItem("userid") || "anonymous"
    : "anonymous",
  username = typeof window !== "undefined"
    ? localStorage.getItem("userName") || "guest"
    : "guest",
}: PayPalCardButtonProps) {
  const createOrder = async (): Promise<string> => {
    const response = await axios.post<CreateOrderResponse>(
      "/api/paypal/card/create-order",
      { orderAmount: amount }
    );
    return response.data.id;
  };

  const onApprove = async (data: { orderID: string }) => {
    const response = await axios.post<CaptureOrderResponse>(
      "/api/paypal/card/capture-order",
      { orderID: data.orderID }
    );

    const transactionId =
      response.data.purchase_units[0].payments.captures[0].id;
    const paymentAmount = parseFloat(amount);

    try {
      await createPaymentLog({
        userId,
        username,
        dateTime: new Date().toISOString().replace("T", " ").substring(0, 19),
        platform: "Web",
        paymentAmount,
        paymentId: transactionId,
      });
      await updateUserTierFromPayment(userId, paymentAmount);
      await assignUserToTournament(userId, transactionId);
    } catch (e) {
      console.error("Failed to persist payment", e);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        components: "buttons",
        intent: "capture",
        currency: "USD",
        "disable-funding":
          "paypal,venmo,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort",
        "enable-funding": "card",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect" }}
        fundingSource="card"
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
}
