"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status] = useState("Processing");
  const [details, setDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setDetails(params);

    console.log("Payment callback received:", params);

    localStorage.setItem("paymentCallbackData", JSON.stringify(params));

    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Payment Processing
        </h1>
        <div className="mb-4 text-center">
          <p className="text-lg mb-2">{status}</p>
          <p className="text-sm text-gray-600">
            We are processing your payment. You will be redirected shortly.
          </p>
        </div>

        {Object.keys(details).length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2 mb-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallback() {
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
      <PaymentCallbackContent />
    </Suspense>
  );
}
