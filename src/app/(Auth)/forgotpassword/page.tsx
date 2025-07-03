"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { useState, Suspense } from "react";
import ButtonLoad from "@/components/ButtonLoad";

type EmailFormData = {
  email: string;
};

type OTPFormData = {
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

function ForgotPasswordContent() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [buttonState, setButtonState] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  
  const emailForm = useForm<EmailFormData>();
  const otpForm = useForm<OTPFormData>();

  const onEmailSubmit: SubmitHandler<EmailFormData> = async (data) => {
    setButtonState(true);
    try {
      const response = await axios.post("/api/resetpassword", { email: data.email });
      
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setUserEmail(data.email);
        setStep('otp');
      }
    } catch (error: any) {
      console.error("Error in password reset request", error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setButtonState(false);
    }
  };

  const onOTPSubmit: SubmitHandler<OTPFormData> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setButtonState(true);
    try {
      // First verify OTP
      const otpResponse = await axios.post("/api/otpverification", {
        email: userEmail,
        otp: data.otp
      });
      
      if (!otpResponse.data.success) {
        toast.error(otpResponse.data.message);
        setButtonState(false);
        return;
      }

      // If OTP is valid, proceed to update password
      const updateResponse = await axios.post("/api/resetpassword/updatepassword", {
        email: userEmail,
        newPassword: data.newPassword
      });
      
      if (!updateResponse.data.success) {
        toast.error(updateResponse.data.message);
      } else {
        toast.success(updateResponse.data.message);
        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error in password reset", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setButtonState(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post("/api/resendotp", { email: userEmail });
      if (response.data.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error resending OTP", error);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
      <Toaster />
      <Card className="w-full max-w-md bg-formcolor text-white p-6 rounded-2xl shadow-lg">
        <CardContent className="space-y-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-[2.8rem] font-bold text-custompink font-headingfont">
              {step === 'email' ? 'Reset Password' : 'Verify OTP'}
            </h2>
            <p className="text-gray-400 mt-2">
              {step === 'email' 
                ? 'Enter your email to receive reset instructions'
                : 'Enter the OTP sent to your email and your new password'
              }
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 font-bodyfont">
              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    id="email"
                    type="email"
                    {...emailForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter your email"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {"*" + emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-custompink hover:bg-red-500 h-10 text-lg"
                disabled={buttonState}
              >
                {buttonState ? <ButtonLoad buttonName="Sending OTP" /> : "Send Reset OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4 font-bodyfont">
              <div>
                <Label htmlFor="otp" className="text-sm">
                  OTP Code
                </Label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    id="otp"
                    type="text"
                    {...otpForm.register("otp", {
                      required: "OTP is required",
                      minLength: { value: 4, message: "OTP must be 4 digits" },
                      maxLength: { value: 6, message: "OTP must be 6 digits" },
                    })}
                    placeholder="Enter 6-digit OTP"
                    className="pl-9 h-10 text-base w-full"
                    maxLength={6}
                  />
                </div>
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {"*" + otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm">
                  New Password
                </Label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    id="newPassword"
                    type="password"
                    {...otpForm.register("newPassword", {
                      required: "New password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                        message: "Password must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol",
                      },
                      minLength: { value: 8, message: "Must be at least 8 characters" },
                      maxLength: { value: 30, message: "Must be less than 30 characters" },
                    })}
                    placeholder="Enter new password"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {otpForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {"*" + otpForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </Label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...otpForm.register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    placeholder="Confirm new password"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {otpForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {"*" + otpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-custompink hover:bg-red-500 h-10 text-lg"
                disabled={buttonState}
              >
                {buttonState ? <ButtonLoad buttonName="Resetting Password" /> : "Reset Password"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 text-lg border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            </form>
          )}

          <Separator className="my-4 bg-gray-700" />
          
          <div className="text-center">
            <p className="text-gray-400 font-bodyfont">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Back to Login
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}

export default Page;