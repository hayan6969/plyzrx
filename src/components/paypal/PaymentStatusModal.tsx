"use client";

import React from "react";

interface PaymentStatusModalProps {
  open: boolean;
  status: "success" | "error";
  title?: string;
  message?: string;
  transactionId?: string;
  onOk: () => void;
}

export default function PaymentStatusModal({
  open,
  status,
  title,
  message,
  transactionId,
  onOk,
}: PaymentStatusModalProps) {
  if (!open) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <span className="text-white text-sm">{isSuccess ? "✓" : "!"}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title || (isSuccess ? "Payment successful" : "Payment failed")}
          </h3>
        </div>

        {message && <p className="text-sm text-gray-700 mb-2">{message}</p>}

        {transactionId && (
          <div className="text-xs text-gray-600 mb-4 break-all">
            <span className="font-medium">Transaction ID: </span>
            <span>{transactionId}</span>
          </div>
        )}

        <button
          onClick={onOk}
          className="w-full bg-gray-900 text-white rounded-md py-2.5 text-sm font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
