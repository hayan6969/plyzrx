import React from "react";
import { Button } from "./ui/button";

interface BankfulButtonProps {
  amount: string;
  userId: string;
  username: string;
  tier: string;
  onClose: () => void;
}

export default function BankfulButton({
  amount,
  userId,
  username,
  tier,
}: BankfulButtonProps) {
  const handleBankfulPayment = async () => {
    try {
      const response = await fetch("/api/payment/bankful", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          userId,
          username,
          tier,
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        console.error("Error initiating Bankful payment:", data.error);
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment processing error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-700 mb-4 text-center">
        Pay securely with Bankful eChecks
      </p>
      <Button
        onClick={handleBankfulPayment}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Pay with Bankful eChecks
      </Button>
    </div>
  );
}
