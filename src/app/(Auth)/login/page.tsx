import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";

function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/stars.png')] bg-cover bg-center px-4">
      <Card className="w-full max-w-md bg-formcolor text-white p-6 rounded-2xl shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-3xl lg:text-[2.8rem] font-bold text-center text-custompink font-headingfont">
            Login
          </h2>
          <p className="text-center text-gray-400">Login to continue PlyzRX</p>
          <div className="space-y-4 font-bodyfont">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative flex items-center">
                <FaEnvelope
                  className="absolute left-3 text-gray-400"
                  size={20}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 text-lg w-full"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3 text-gray-400" size={20} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 h-12 text-lg w-full"
                />
              </div>
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
            <Button className="w-full bg-custompink hover:bg-red-500 h-14 text-lg">
              Sign in
            </Button>
          </div>
          <Separator className="my-4 bg-gray-700" />
          <p className="text-center text-gray-400 font-bodyfont">
            Continue With
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-bodyfont lg:flex-nowrap">
            <Button className="flex items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto">
              <FaGoogle className="w-5 h-5 mr-2 text-red-500" /> Google
            </Button>
            <Button className="flex items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto">
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" /> Facebook
            </Button>
            <Button className="flex items-center bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 w-full sm:w-auto">
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
