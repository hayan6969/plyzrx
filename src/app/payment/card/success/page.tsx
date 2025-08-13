"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CardSuccess() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Card Payment Successful</h1>
        <p className="text-gray-600">Thanks! You're all set.</p>
      </div>
    </div>
  );
}
