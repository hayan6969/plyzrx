import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";

function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/img/stars.png')] bg-cover bg-center px-4">
      <Card className="w-full max-w-md bg-formcolor text-white p-4 rounded-2xl shadow-lg">
        <CardContent className="space-y-3 w-full">
          <h2 className="text-2xl lg:text-4xl font-bold text-center text-custompink font-headingfont">
            Sign Up
          </h2>
          <p className="text-center text-gray-400 text-sm">
            Sign up to enjoy PlyzRX
          </p>
          <div className="space-y-3 font-bodyfont w-full">
            <div>
              <Label htmlFor="full-name" className="text-sm">
                Full Name
              </Label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" size={16} />
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-9 h-10 text-base w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dob" className="text-sm">
                Date of Birth
              </Label>
              <div className="relative flex items-center">
                <FaCalendarAlt
                  className="absolute left-3 text-gray-400"
                  size={16}
                />
                <Input
                  id="dob"
                  type="date"
                  className="pl-9 h-10 text-base w-full"
                />
              </div>
            </div>
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
                  placeholder="Enter your email"
                  className="pl-9 h-10 text-base w-full"
                />
              </div>
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
                  placeholder="Enter your password"
                  className="pl-9 h-10 text-base w-full"
                />
              </div>
            </div>
            <Button className="w-full bg-custompink hover:bg-red-500 h-10 text-base mt-2">
              Sign up
            </Button>
          </div>
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
            <Link href="/signin" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
