"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
  // FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import FlashCard from "@/components/FlashCard";
import { useState } from "react";
import SuccessFlashCard from "@/components/SuccessFlashCard";
type FormData = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};

function Page() {
  const [errorstate,seterrorstate]=useState(false)
  const [errorMSg,SeterroMSg]=useState("");
  const [successtate,setsuccessstate]=useState(false)
  const [SuccessMSg,SetSuccessMSg]=useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
 try {
     const responce = await axios.post("/api/signup", data);
 if(responce.data.success===false)
 {
  seterrorstate(true);
  setsuccessstate(false);

  SeterroMSg(responce.data.message);
 }
 else{
  setsuccessstate(true);
  seterrorstate(false);

  SetSuccessMSg(responce.data.message);
  
  setTimeout(()=>
    {
  setsuccessstate(false);
  
    },4000)
 }


     console.log(responce.data);
 } catch (error) {
  console.log(error);
  
 }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/stars.jpg')] bg-cover bg-center px-4">
      <Card className="w-full max-w-md bg-formcolor text-white p-4 rounded-2xl shadow-lg">
       
        <CardContent className="space-y-3 w-full">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-custompink font-headingfont">
              Sign Up
            </h2>
            <p className="text-center text-gray-400 text-sm">
              Sign up to enjoy PlyzRX
            </p>
            {
              errorstate&&
      <FlashCard message={errorMSg} />

            }

{
              successtate&&
      <SuccessFlashCard message={SuccessMSg} />

            }

            <div className="space-y-3 font-bodyfont w-full">
              {/* Full Name */}
              <div>
                <Label htmlFor="full-name" className="text-sm">
                  Full Name
                </Label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-gray-400" size={16} />
                  <Input
                    id="full-name"
                    type="text"
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
                  <p className="text-red-500 text-[.9rem]">
                    {"*" + errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Username */}
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
                  <p className="text-red-500">
                    {"*" + errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <div className="relative flex items-center">
                  <FaEnvelope
                    className="absolute left-3 text-gray-400"
                    size={16}
                  />
                  <Input
                    id="email"
                    type="email"
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
                  <p className="text-red-500">{"*" + errors.email.message}</p>
                )}
              </div>

              {/* Password */}
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

              <Button
                type="submit"
                className="w-full bg-custompink hover:bg-red-500 h-10 text-base mt-2"
              >
                Sign up
              </Button>
            </div>
          </form>

          <Separator className="my-3 bg-gray-700" />
          <p className="text-center text-gray-400 text-sm font-bodyfont">
            Or sign up with
          </p>
          <div className="flex justify-center font-bodyfont w-full">
            <Button className="flex items-center w-full bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 h-10 text-base">
              <FaGoogle className="w-4 h-4 mr-2 text-red-500" /> Google
            </Button>
          </div>
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
