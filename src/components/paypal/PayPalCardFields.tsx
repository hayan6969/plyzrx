"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import axios from "axios";
import { assignUserToTournament, createPaymentLog } from "@/lib/appwriteDB";
import { updateUserTierFromPayment } from "@/lib/tierUpdater";

// Helper function to determine plan type based on amount
function determineUserPlanType(amount: number): string {
  if (amount >= 50) {
    return "pro";
  } else if (amount >= 25) {
    return "premium";
  }
  return "basic";
}

import PaymentStatusModal from "./PaymentStatusModal";

interface PayPalCardFieldsProps {
  amount: string;
  userId?: string;
  username?: string;
  onClose?: () => void;
}

interface CreateOrderResponse {
  id: string;
}

interface CaptureOrderResponse {
  purchase_units: {
    payments: {
      captures: {
        id: string;
        status: "COMPLETED" | "DECLINED" | "PENDING" | "FAILED";
        processor_response?: {
          response_code?: string;
          cvv_code?: string;
        };
      }[];
      authorizations?: { id: string }[];
    };
  }[];
  details?: { issue?: string; description?: string }[];
  debug_id?: string;
  error?: {
    message?: string;
    status?: string;
  };
}

interface OnApproveData {
  orderID: string;
}

function SubmitPaymentButton({
  isPaying,
  setIsPaying,
}: {
  isPaying: boolean;
  setIsPaying: (v: boolean) => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = useCallback(async () => {
    if (!cardFieldsForm) {
      throw new Error(
        "Unable to find any child components in the <PayPalCardFieldsProvider />"
      );
    }

    const formState = await cardFieldsForm.getState();
    if (!formState.isFormValid) {
      alert("The payment form is invalid");
      return;
    }

    setIsPaying(true);
    try {
      await cardFieldsForm.submit();
    } catch {
      // submit will surface errors in onError/onApprove caller path
      setIsPaying(false);
    }
  }, [cardFieldsForm, setIsPaying]);

  return (
    <button
      className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#0070BA] hover:bg-[#003087] text-white font-semibold text-sm font-sans transition-colors duration-200 shadow-md"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      onClick={handleClick}
      disabled={isPaying}
    >
      <Image src="/img/paypal.jpeg" alt="PayPal" width={20} height={20} />
      {isPaying ? "Processing..." : "Pay now"}
    </button>
  );
}

export default function PayPalCardFields({
  amount,
  userId: userIdProp,
  username: usernameProp,
  onClose,
}: PayPalCardFieldsProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusKind, setStatusKind] = useState<"success" | "error">("success");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusTxnId, setStatusTxnId] = useState<string | undefined>(undefined);
  const userId = useMemo(() => {
    if (userIdProp) return userIdProp;
    if (typeof window !== "undefined") {
      const localId = localStorage.getItem("userid");
      if (localId && localId !== "anonymous") return localId;
    }
    return "anonymous";
  }, [userIdProp]);

  // Get user email for FirstPromoter tracking
  const username = useMemo(() => {
    if (usernameProp) return usernameProp;
    if (typeof window !== "undefined") {
      const localName = localStorage.getItem("userName");
      if (localName && localName !== "guest") return localName;
    }
    return "guest";
  }, [usernameProp]);

  // Ensure we have user email for FirstPromoter tracking
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to get email from localStorage
      const email = localStorage.getItem("userEmail");

      if (!email && userId !== "anonymous") {
        // If we don't have an email but have a userId, fetch from API
        const fetchUserEmail = async () => {
          try {
            const response = await axios.post("/api/userdata", {
              userId: userId,
              username: username,
            });

            if (response.data.success && response.data.email) {
              const fetchedEmail = response.data.email;
              localStorage.setItem("userEmail", fetchedEmail);
              console.log("Fetched email from API:", fetchedEmail);
            } else {
              // Fallback to placeholder if API doesn't return email
              const placeholderEmail = `${userId}@plyzrx.com`;
              localStorage.setItem("userEmail", placeholderEmail);
              console.log("Using placeholder email:", placeholderEmail);
            }
          } catch (error) {
            console.error("Failed to fetch user email:", error);
            // Use placeholder on error
            const placeholderEmail = `${userId}@plyzrx.com`;
            localStorage.setItem("userEmail", placeholderEmail);
          }
        };

        fetchUserEmail();
      } else if (email) {
        console.log("Using email from localStorage:", email);
      }
    }
  }, [userId, username]);
  const [, setBillingAddress] = useState<Record<string, string>>({
    addressLine1: "",
    addressLine2: "",
    adminArea1: "",
    adminArea2: "",
    countryCode: "",
    postalCode: "",
  });

  const handleBillingAddressChange = useCallback(
    (field: string, value: string) => {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const createOrder = useCallback(async (): Promise<string> => {
    const response = await axios.post<CreateOrderResponse>(
      "/api/paypal/card/create-order",
      { orderAmount: amount }
    );
    if (!response.data?.id) {
      throw new Error("Failed to create order");
    }
    return response.data.id;
  }, [amount]);

  const onApprove = useCallback(
    async (data: OnApproveData) => {
      try {
        // Add the user's email and ID to the request for FirstPromoter tracking
        // Get the most up-to-date email and user ID from localStorage
        const currentEmail = localStorage.getItem("userEmail");
        const currentUserId = localStorage.getItem("userid");
        console.log(
          "Sending payment with email:",
          currentEmail,
          "and userid:",
          currentUserId
        );

        const response = await axios.post<CaptureOrderResponse>(
          "/api/paypal/card/capture-order",
          {
            orderID: data.orderID,
            email: currentEmail || undefined,
            uid: currentUserId || (userId !== "anonymous" ? userId : undefined),
            planType: determineUserPlanType(parseFloat(amount)),
          }
        );

        // Check for error response from our API
        if (response.data.error) {
          throw new Error(
            response.data.error.message || "Payment processing failed"
          );
        }

        const capture =
          response.data?.purchase_units?.[0]?.payments?.captures?.[0];
        if (!capture) {
          throw new Error("No capture information found in response");
        }

        // Check capture status
        if (capture.status === "DECLINED") {
          const processorResponse = capture.processor_response || {};
          throw new Error(
            `Payment declined (${
              processorResponse.response_code || "Unknown reason"
            }). Please try a different payment method.`
          );
        }

        if (capture.status !== "COMPLETED") {
          throw new Error(
            `Payment ${capture.status.toLowerCase()}. Please try again.`
          );
        }

        const transactionId = capture.id;
        const paymentAmount = parseFloat(amount);

        try {
          await createPaymentLog({
            userId,
            username,
            dateTime: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 19),
            platform: "Web",
            paymentAmount,
            paymentId: transactionId,
          });
          await updateUserTierFromPayment(userId, paymentAmount);
          await assignUserToTournament(userId, transactionId);
        } catch (e) {
          console.error("Failed to persist payment", e);
          throw new Error(
            "Payment was processed but failed to update account. Please contact support."
          );
        }

        setIsPaying(false);
        setStatusTxnId(transactionId);
        setStatusKind("success");
        setStatusMessage("Your payment was successful!");
        setStatusOpen(true);
      } catch (error) {
        console.error("onApprove error", error);
        setIsPaying(false);
        setStatusKind("error");
        setStatusMessage(
          error instanceof Error
            ? error.message
            : "Payment could not be processed."
        );
        setStatusOpen(true);
      }
    },
    [amount, userId, username]
  );

  const onError = useCallback((err: unknown) => {
    console.error("PayPal Card Fields error", err);
    setIsPaying(false);
  }, []);

  const initialOptions = useMemo(
    () => ({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "capture",
      components: "card-fields",
      "data-sdk-integration-source": "developer-studio",
    }),
    []
  );

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{
          input: {
            "font-size": "16px",
            "font-family":
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial",
            color: "#111827",
            "letter-spacing": "0.01em",
          },
          ".invalid": { color: "#b91c1c" },
          ":focus": { outline: "none" },
        }}
      >
        <div className="w-[320px] sm:w-[420px] max-w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex justify-center">
              {/* PayPal Logo */}
              <table border={0} cellPadding={10} cellSpacing={0} align="center">
                <tbody>
                  <tr>
                    <td align="center">
                      <a
                        href="/digital-wallet/ways-to-pay/add-payment-method"
                        title="How PayPal Works"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            "/digital-wallet/ways-to-pay/add-payment-method",
                            "WIPaypal",
                            "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1060, height=700"
                          );
                          return false;
                        }}
                      >
                        <Image
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
                          alt="PayPal Acceptance Mark"
                          width={200}
                          height={40}
                          priority
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <div className=" rounded-md ">
                <PayPalNameField />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card number
              </label>
              <div className="rounded-md ">
                <PayPalNumberField />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry
              </label>
              <div className="rounded-md">
                <PayPalExpiryField />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <div className="rounded-md">
                <PayPalCVVField />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address line 1
              </label>
              <input
                type="text"
                placeholder="Address line 1"
                onChange={(e) =>
                  handleBillingAddressChange("addressLine1", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address line 2
              </label>
              <input
                type="text"
                placeholder="Address line 2"
                onChange={(e) =>
                  handleBillingAddressChange("addressLine2", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="State"
                onChange={(e) =>
                  handleBillingAddressChange("adminArea1", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City "
                onChange={(e) =>
                  handleBillingAddressChange("adminArea2", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country code
              </label>
              <input
                type="text"
                placeholder="US"
                onChange={(e) =>
                  handleBillingAddressChange("countryCode", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal code
              </label>
              <input
                type="text"
                placeholder="12345"
                onChange={(e) =>
                  handleBillingAddressChange("postalCode", e.target.value)
                }
                className="w-full border text-black rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <SubmitPaymentButton isPaying={isPaying} setIsPaying={setIsPaying} />
          <span className="text-md text-red-500 flex items-center justify-center gap-1">
            <span className="text-red-500">*</span> No Refunds all sales final
          </span>
        </div>
      </PayPalCardFieldsProvider>

      <PaymentStatusModal
        open={statusOpen}
        status={statusKind}
        message={statusMessage}
        transactionId={statusTxnId}
        onOk={() => {
          setStatusOpen(false);
          if (statusKind === "success" && onClose) onClose();
        }}
      />
    </PayPalScriptProvider>
  );
}
