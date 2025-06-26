"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface BankfulPaymentButtonProps {
  amount: number;
  userId: string;
  username: string;
  tier: string;
  buttonText?: string;
  className?: string;
}

export default function BankfulPaymentButton({
  amount,
  userId,
  username,
  tier,
  buttonText = "Pay Now",
  className = "",
}: BankfulPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

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

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        console.error("Payment initiation failed:", data.error);
        alert("Payment initiation failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
