"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  // FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
  // FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import ButtonLoad from "@/components/ButtonLoad";
import { useRouter } from "next/navigation";
type FormData = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};

function Page() {
  const [buttonState, SetButtonState] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    SetButtonState(true);

    try {
      const responce = await axios.post("/api/signup", data);
      if (!responce.data.success) {
        toast.error(responce.data.message);
      } else {
        toast.success(responce.data.message);
        localStorage.setItem("Login", "true");
        localStorage.setItem("userName",responce.data.username)
        router.push("/");
      }

      console.log(responce.data);
    } catch (error) {
      console.log(error);
    } finally {
      SetButtonState(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
      <Toaster />
      <Card className="w-full max-w-md bg-formcolor text-white p-4 rounded-2xl shadow-lg">
        <CardContent className="space-y-3 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-custompink font-headingfont">
              Sign Up
            </h2>
            <p className="text-center text-gray-400 text-sm">
              Sign up to enjoy PlyzRX
            </p>

            <div className="space-y-3 font-bodyfont w-full">
              <div>
                <Label className="text-sm ">
                  Full Name <span className="italic">(e.g., John Doe)</span>
                </Label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    {...register("fullname", {
                      required: "Full name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Invalid name format",
                      },
                    })}
                    placeholder="Enter your full name"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {errors.fullname && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.fullname.message}
                </p>
              )}
              </div>

              <div>
                <Label className="text-sm ">
                  UserName{" "}
                  <span className="italic">(e.g., xyz_123 or xyz)</span>
                </Label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    {...register("username", {
                      required: "Handle is required",
                      pattern: {
                        value: /^[A-Za-z0-9_]+$/,
                        message: "Invalid handle format",
                      },
                    })}
                    placeholder="Enter your handle"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {errors.username && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.username.message}
                </p>
              )}
              </div>

              <div>
                <Label className="text-sm ">
                  Email <span className="italic">(e.g., example@mail.com)</span>{" "}
                </Label>
                <div className="relative flex items-center">
                  <FaEnvelope
                    className="absolute left-3 text-gray-400"
                    size={16}
                  />
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter your email"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {errors.email && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.email.message}
                </p>
)}
              </div>

              <div>
                <Label className="text-sm ">
                  Password{" "}
                  <span className="italic">
                    (1 uppercase, 1 lowercase, 1 digit, 1 symbol)
                  </span>
                </Label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                        message:
                          "Insert at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.",
                      },
                      minLength: {
                        value: 8,
                        message: "Must be at least 8 characters",
                      },
                      maxLength: {
                        value: 30,
                        message: "Must be less than 30 characters",
                      },
                    })}
                    type="password"
                    placeholder="Enter your password"
                    className="pl-9 h-10 text-base w-full"
                  />
                </div>
                {errors.password && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.password.message}
                </p>
)}
              </div>

              <Button
                type="submit"
                className="w-full bg-custompink hover:bg-red-500 h-10 text-base mt-2"
                disabled={buttonState}
              >
                {buttonState ? (
                  <ButtonLoad buttonName="Signing Up" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>

          <Separator className="my-3 bg-gray-700" />
          {/* <p className="text-center text-gray-400 text-sm font-bodyfont">
            Or sign up with
          </p> */}
          {/* <div className="flex justify-center font-bodyfont w-full">
            <Button className="flex items-center w-full bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 h-10 text-base">
              <FaGoogle className="w-4 h-4 mr-2 text-red-500" /> Google
            </Button>
          </div> */}
          <p className="text-center text-gray-400 text-sm font-bodyfont">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
