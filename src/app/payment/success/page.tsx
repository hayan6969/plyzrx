"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPaymentLog, assignUserToTournament } from "@/lib/appwriteDB";
import { updateUserTierFromPayment } from "@/lib/tierUpdater";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionDetails, setTransactionDetails] = useState<
    Record<string, any>
  >({});



  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setTransactionDetails(params);

    console.log("Payment success data:", params);

    localStorage.setItem("paymentSuccessData", JSON.stringify(params));
const userId =  localStorage.getItem("userid") || "anonymous";
    const username =  localStorage.getItem("userName") || "guest";
    const paymentAmount = parseFloat(params.TRANS_VALUE  || "0");
    const paymentId =  params.TRANS_RECORD_ID||"";

    if (paymentId && userId) {
  
      createPaymentLog({
        userId,
        username,
        dateTime: new Date().toISOString().replace("T", " ").substring(0, 19),
        platform: "Web",
        paymentAmount,
        paymentId,
      })
        .then(() => {
          // 2. Update user tier
          return updateUserTierFromPayment(userId, paymentAmount);
        })
        .then(() => {
          // 3. Assign user to tournament
          return assignUserToTournament(userId, paymentId);
        })
        .then(() => {
          console.log("Payment, tier update, and tournament assignment complete.");
        })
        .catch((err) => {
          console.error("Error in post-payment actions:", err);
        });
    }



    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mt-2">
            Thank you for your payment. Your transaction was successful.
          </p>
        </div>

        {Object.keys(transactionDetails).length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(transactionDetails).map(([key, value]) => (
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
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}
