"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { FaShieldAlt, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import ButtonLoad from "@/components/ButtonLoad";

type FormData = {
  otp: string;
};

function OTPVerificationContent() {
  const [buttonState, setButtonState] = useState(false);
  const [resendButtonState, setResendButtonState] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Get email from URL params first, then localStorage as fallback
    const emailFromParams = searchParams.get("email");
    const emailFromStorage = localStorage.getItem("verificationEmail");

    if (emailFromParams) {
      setEmail(emailFromParams);
      localStorage.setItem("verificationEmail", emailFromParams);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // If no email found, redirect to signup
      toast.error("No email found for verification. Please sign up again.");
      router.push("/signup");
      return;
    }
  }, [searchParams, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    setButtonState(true);
    try {
      const response = await axios.post("/api/otpverification", {
        otp: data.otp,
        email: email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("Login", "true");
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("userid", response.data.userid);
        localStorage.removeItem("verificationEmail");

        // Store email for FirstPromoter tracking
        const email = localStorage.getItem("userEmail");
        if (email) {
          console.log(
            "User verified with email:",
            email,
            "and userid:",
            response.data.userid
          );
        }

        // Small delay before redirect
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error in OTP verification", error);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setButtonState(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    setResendButtonState(true);
    try {
      const response = await axios.post("/api/resendotp", {
        email: email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setCountdown(60); // Start 60 second countdown
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error resending OTP", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendButtonState(false);
    }
  };

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "";

  // Don't render if no email is found
  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
        <Toaster />
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
      <Toaster />
      <Card className="w-full max-w-md bg-formcolor text-white p-6 rounded-2xl shadow-lg">
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-custompink rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl lg:text-[2.8rem] font-bold text-center text-custompink font-headingfont">
              Verify OTP
            </h2>
            <p className="text-center text-gray-400 mt-2">
              We've sent a verification code to
            </p>
            <div className="flex items-center justify-center mt-2">
              <FaEnvelope className="text-gray-400 mr-2" size={14} />
              <span className="text-sm text-gray-300">{maskedEmail}</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 font-bodyfont"
          >
            <div>
              <Label htmlFor="otp" className="text-sm">
                Enter 4-digit OTP
              </Label>
              <div className="relative flex items-center">
                <FaShieldAlt
                  className="absolute left-3 text-gray-400"
                  size={16}
                />
                <Input
                  id="otp"
                  type="text"
                  maxLength={4}
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "OTP must be exactly 4 digits",
                    },
                  })}
                  placeholder="Enter 4-digit OTP"
                  className="pl-9 h-10 text-base w-full text-center text-2xl tracking-widest"
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {"*" + errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-custompink hover:bg-red-500 h-10 text-lg"
              disabled={buttonState}
            >
              {buttonState ? (
                <ButtonLoad buttonName="Verifying..." />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">Didn't receive the code?</p>

            <Button
              onClick={handleResendOTP}
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 h-10"
              disabled={resendButtonState || countdown > 0}
            >
              {resendButtonState ? (
                <ButtonLoad buttonName="Resending..." />
              ) : countdown > 0 ? (
                `Resend OTP in ${countdown}s`
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm font-bodyfont">
              Wrong email?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign up again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
          <Toaster />
          <div className="text-white text-center">
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <OTPVerificationContent />
    </Suspense>
  );
}

export default Page;
