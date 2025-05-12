"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import axios from "axios";

interface OnApproveData {
  subscriptionID: string;
}

interface SubscriptionProps {
  planId: string; // Pass different Plan IDs here
}

const PayPalSubscription: React.FC<SubscriptionProps> = ({ planId }) => {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "subscription",
    vault: true,
  };

  const createSubscription = async (): Promise<string> => {
    try {
      const response = await axios.post("/api/paypal/create-subscription", {
        planId,
      });
      setSubscriptionId(response.data.subscriptionId);
      return response.data.subscriptionId;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  };

  const onApprove = async (data: OnApproveData): Promise<void> => {
    if (data.subscriptionID) {
      console.log("Subscription successful:", data);
      alert(`Subscription Successful! Subscription ID: ${data.subscriptionID}`);
      return Promise.resolve();
    } else {
      console.error("Subscription ID is null or undefined");
      return Promise.reject("Subscription ID is missing");
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={createSubscription}
        onApprove={async () => onApprove({ subscriptionID: subscriptionId! })}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalSubscription;
