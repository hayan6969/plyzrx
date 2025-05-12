"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import axios from "axios";

interface PayPalButtonProps {
  amount: string;
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

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount }) => {
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

      // Close the PayPal checkout modal by returning a resolved promise
      alert(
        "Payment Successful! Transaction ID: " +
          response.data.purchase_units[0].payments.captures[0].id
      );
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
