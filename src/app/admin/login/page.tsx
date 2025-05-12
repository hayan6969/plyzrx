"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { FaUser, FaLock } from "react-icons/fa";
import { Client, Account } from "appwrite";
import { isAdminAuthenticated } from "@/lib/authStorage";
import ButtonLoad from "@/components/ButtonLoad";

// Initialize Appwrite Client directly in the component
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const account = new Account(client);

export default function AdminLoginPage() {
  const [buttonState, setButtonState] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setButtonState(true);
    try {
      // Direct login using Appwrite
      const session = await account.createEmailPasswordSession(email, password);

      // Store auth info in localStorage
      localStorage.setItem("admin-auth", "true");
      localStorage.setItem("admin-session", session.$id);
      localStorage.setItem("admin-email", email);

      toast.success("Login successful");

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
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
            Admin Login
          </h2>
          <p className="text-center text-gray-400">
            Login to access admin dashboard
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4 font-bodyfont"
          >
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3 text-gray-400" size={16} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-9 h-10 text-base w-full"
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 h-10 text-base w-full"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-custompink hover:bg-red-500 h-10 text-lg"
              disabled={buttonState}
            >
              {buttonState ? <ButtonLoad buttonName="Signing In" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
