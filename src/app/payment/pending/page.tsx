"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pendingDetails, setPendingDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setPendingDetails(params);

    console.log("Payment pending data:", params);

    localStorage.setItem("paymentPendingData", JSON.stringify(params));

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Pending</h1>
          <p className="text-gray-600 mt-2">
            Your payment is being processed. This may take a few moments.
          </p>
        </div>

        {Object.keys(pendingDetails).length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(pendingDetails).map(([key, value]) => (
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
            You will be redirected to your dashboard shortly...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We'll notify you once your payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPending() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Loading...</h1>
          </div>
        </div>
      }
    >
      <PaymentPendingContent />
    </Suspense>
  );
}
