"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCancelled() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cancelDetails, setCancelDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setCancelDetails(params);

    console.log("Payment cancelled data:", params);

    localStorage.setItem("paymentCancelledData", JSON.stringify(params));

    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Cancelled</h1>
          <p className="text-gray-600 mt-2">
            Your payment process was cancelled.
          </p>
        </div>

        {Object.keys(cancelDetails).length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(cancelDetails).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2 mb-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You will be redirected to the homepage shortly...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You can try again later if you wish to complete your purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
