"use client";
import React from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import ButtonLoad from '@/components/ButtonLoad';

type Inputs = {
    password: string
    newPassword: string
  }

function Page() {
      const [buttonState, setButtonState] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>()

      const onSubmit: SubmitHandler<Inputs> = async(data) => {
        setButtonState(true);
        try {
          const response = await axios.post("/api/updatepassword", data);
    
          if (!response.data.success) {
            toast.error(response.data.message);
          } else {
            toast.success(response.data.message);  
          }
        } catch (error) {
          console.error("Error in sign-in", error);
        } finally {
          setButtonState(false);
        }
        
      }
  return (
 <>
    <main className="w-full h-screen flex justify-center items-center p-4">
    <Toaster />
      <div className="w-full max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold text-center mb-4 text-black">Update Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
                  id="oldpassword"
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
                  className="pl-9 h-10 text-base w-full text-black"
                />
                   {errors.password && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.password.message}
                </p>
              )}
          <Input
                  id="newpassword"
                  type="password"
                  {...register("newPassword", {
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
                  className="pl-9 h-10 text-base w-full text-black"
                />
                   {errors.newPassword && (
                <p className="text-red-500 text-[.8rem]">
                  {"*" + errors.newPassword.message}
                </p>
              )}
           <Button
                type="submit"
                className="w-full bg-custompink hover:bg-red-500 h-10 text-base mt-2"
                disabled={buttonState}
              >
                {buttonState ? (
                  <ButtonLoad buttonName="Updating Passsword.." />
                ) : (
                  "Update Password"
                )}
              </Button>
        </form>
      </div>
    </main>
 
 </>
  )
}

export default Page