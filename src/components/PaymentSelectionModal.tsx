"use client";
import React from "react";
import { Button } from "./ui/button";

interface PaymentSelectionModalProps {
  onClose: () => void;
  tier: string;
  finalprice: string;
  userId: string;
  username: string;
  onSelectPayPal: () => void;
  onSelectCreditCard: () => void;
}

const PaymentSelectionModal: React.FC<
  Omit<PaymentSelectionModalProps, "userId" | "username"> & {
    userId?: string;
    username?: string;
  }
> = ({ onClose, tier, finalprice, onSelectPayPal, onSelectCreditCard }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative p-6 bg-white rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-300 transition"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {tier} Tournament
          </h2>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            Total: ${finalprice}
          </p>
          <p className="text-md text-gray-600 mt-4">
            Please select your payment method
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <Button
            className="w-full py-4 bg-[#0070ba] hover:bg-[#003087] text-white font-medium rounded-md"
            onClick={onSelectPayPal}
          >
            <span className="flex items-center justify-center">
              <span className="font-bold">Pay</span>
              <span className="font-light">Pal</span>
            </span>
          </Button>

          <Button
            className="w-full py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-medium rounded-md"
            onClick={onSelectCreditCard}
          >
            Credit / Debit Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionModal;
