"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function FailedContent() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/"), 5000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600">Your payment could not be completed.</p>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={<div />}>
      <FailedContent />
    </Suspense>
  );
}

("use client");

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failedDetails, setFailedDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setFailedDetails(params);

    console.log("Payment failed data:", params);

    localStorage.setItem("paymentFailedData", JSON.stringify(params));
  }, [searchParams]);

  const handleTryAgain = () => {
    router.push("/pricing");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
          <p className="text-gray-600 mt-2">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {Object.keys(failedDetails).length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Error Details</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(failedDetails).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2 mb-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            You can try again with a different payment method or contact support
            if the problem persists.
          </p>
          <Button
            onClick={handleTryAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
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
      <PaymentFailedContent />
    </Suspense>
  );
}
