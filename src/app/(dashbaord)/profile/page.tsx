"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Toaster, toast } from "sonner";
import ButtonLoad from "@/components/ButtonLoad";
import Link from "next/link";

// Define input types
type Inputs = {
  password: string;
  newPassword: string;
};

function Page() {
  const [buttonState, setButtonState] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setButtonState(true);
    try {
      const response = await axios.post("/api/updatepassword", data, {
        withCredentials: true,
      });

      response.data.success
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
    } catch (error) {
      console.error("Error in updating", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setButtonState(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center p-4 bg-formcolor">
      <Toaster />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
        <Link href={"/"} className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
          &larr; Back
        </Link>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Update Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Old Password Input */}
          <div>
            <Input
              type="password"
              {...register("password", {
                required: "Current password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                  message: "Use at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.",
                },
                minLength: { value: 8, message: "Must be at least 8 characters" },
                maxLength: { value: 30, message: "Must be less than 30 characters" },
              })}
              placeholder="Current Password"
              className="h-12 text-lg border rounded px-3 w-full"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* New Password Input */}
          <div>
            <Input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                  message: "Use at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.",
                },
                minLength: { value: 8, message: "Must be at least 8 characters" },
                maxLength: { value: 30, message: "Must be less than 30 characters" },
              })}
              placeholder="New Password"
              className="h-12 text-lg border rounded px-3 w-full"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>

          <p className="text-gray-600 text-sm italic">*(At least 1 uppercase, 1 lowercase, 1 digit, 1 symbol)</p>

          <Button
            type="submit"
            className="w-full bg-custompink hover:bg-red-400 text-white py-3 rounded-md text-lg font-medium"
            disabled={buttonState}
          >
            {buttonState ? <ButtonLoad buttonName="Updating Password..." /> : "Update Password"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default Page;
