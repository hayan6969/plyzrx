import { NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";
import generateotp from "@/lib/generateOtp";
import { sendOTPEmail } from "@/lib/otpemail";

// Server-side Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

export interface Signedupusers {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number;
  username: string;
  email: string;
  otp: string;
  isVerified: boolean;
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    // Validate required field
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    // Find user by username in signed up users collection
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("username", username)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { success: false, message: "Username not found in our records" },
        { status: 404 }
      );
    }

    const user = userResult.documents[0] as unknown as Signedupusers;

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account not verified. Please verify your account first." },
        { status: 400 }
      );
    }

    // Generate new OTP for password reset
    const resetOtp = await generateotp();

    // Update user with reset OTP in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      user.$id!,
      { otp: resetOtp }
    );

    // Send password reset OTP email to the user's email address
    await sendOTPEmail(user.email, resetOtp, user.username);

    return NextResponse.json(
      { 
        success: true, 
        message: "Password reset OTP sent successfully to your registered email",
        email: user.email
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Reset Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send reset password OTP. Please try again later.",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to request password reset.' },
    { status: 405 }
  );
}