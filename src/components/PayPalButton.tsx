"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import axios from "axios";
import { createPaymentLog } from "@/lib/appwriteDB";
import { updateUserTierFromPayment } from "@/lib/tierUpdater";

interface PayPalButtonProps {
  amount: string;
  userId?: string;
  username?: string;
}

interface CreateOrderResponse {
  id: string;
}

interface CaptureOrderResponse {
  purchase_units: {
    payments: {
      captures: {
        id: string;
      }[];
    };
  }[];
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  userId = "anonymous",
  username = "guest",
}) => {
  const [orderID, setOrderID] = useState<string>("");

  // Create Order
  const createOrder = async (): Promise<string> => {
    try {
      const response = await axios.post<CreateOrderResponse>(
        "/api/paypal/create-order",
        {
          orderAmount: amount,
        }
      );
      setOrderID(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Capture Payment
  const onApprove = async (data: { orderID: string }): Promise<void> => {
    try {
      const response = await axios.post<CaptureOrderResponse>(
        "/api/paypal/capture-order",
        {
          orderID: data.orderID,
        }
      );

      const transactionId =
        response.data.purchase_units[0].payments.captures[0].id;
      const paymentAmount = parseFloat(amount);

      // Save payment data to Appwrite
      try {
        // 1. Save payment log
        await createPaymentLog({
          userId: userId,
          username: username,
          dateTime: new Date().toISOString().replace("T", " ").substring(0, 19), // Format: YYYY-MM-DD HH:MM:SS
          platform: "Web",
          paymentAmount: paymentAmount,
          paymentId: transactionId,
        });

        // 2. Update user tier information
        await updateUserTierFromPayment(userId, paymentAmount);

        console.log("Payment data saved to Appwrite and user tier updated");
      } catch (appwriteError) {
        console.error(
          "Failed to save payment data to Appwrite:",
          appwriteError
        );
        // Continue with the PayPal flow even if Appwrite save fails
      }

      // Close the PayPal checkout modal by returning a resolved promise
      alert("Payment Successful! Transaction ID: " + transactionId);
      return Promise.resolve();
    } catch (error) {
      console.error("Error capturing payment:", error);
      return Promise.reject("Payment failed");
    }
  };

  console.log("orderID :>> ", orderID);

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}
    >
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
