"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaUser,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import ButtonLoad from "@/components/ButtonLoad";

type FormData = {
  username: string;
  password: string;
};

function Page() {
  const [buttonState, setButtonState] = useState(false);
  const router= useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setButtonState(true);
    try {
      const response = await axios.post("/api/signin", data);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        localStorage.setItem("Login","true");
        router.push("/")

      }
    } catch (error) {
      console.error("Error in sign-in", error);
    } finally {
      setButtonState(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
      <Toaster />
      <Card className="w-full max-w-md bg-formcolor text-white p-6 rounded-2xl shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-3xl lg:text-[2.8rem] font-bold text-center text-custompink font-headingfont">
            Login
          </h2>
          <p className="text-center text-gray-400">Login to continue PlyzRX</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="space-y-4 font-bodyfont"
          >
            <div>
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" size={16} />
                <Input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[A-Za-z0-9_]+$/,
                      message: "Invalid username format",
                    },
                  })}
                  placeholder="Enter your username"
                  className="pl-9 h-10 text-base w-full"
                />
              </div>
              {errors.username && (
                <p className="text-red-500">{"*" + errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3 text-gray-400" size={16} />
                <Input
                  id="password"
                  type="password"
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-gray-400">
                  Remember Me
                </Label>
              </div>
              <a
                href="#"
                className="text-white underline hover:underline mt-2 sm:mt-0"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-custompink hover:bg-red-500 h-10 text-lg"
              disabled={buttonState}
            >
              {buttonState ? <ButtonLoad buttonName="Signing In" /> : "Sign In"}
            </Button>
          </form>

          <Separator className="my-4 bg-gray-700" />
          <p className="text-center text-gray-400 font-bodyfont">
            Continue With
          </p>

          <div className="grid grid-cols-2 lg:flex lg:flex-nowrap justify-center gap-4 font-bodyfont">
            <Button className="flex items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto">
              <FaGoogle className="w-5 h-5 mr-2 text-red-500" /> Google
            </Button>
            <Button className="flex items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto">
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" /> Facebook
            </Button>
            <Button className="items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto sm:col-span-2 flex justify-center">
              <FaInstagram className="w-5 h-5 mr-2 text-pink-500" /> Instagram
            </Button>
          </div>

          <p className="text-center text-gray-400 font-bodyfont">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
