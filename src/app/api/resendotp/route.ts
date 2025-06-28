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
    const { username, email } = await request.json();

    // Validate required fields
    if (!username && !email) {
      return NextResponse.json(
        { success: false, message: "Either username or email is required" },
        { status: 400 }
      );
    }

    // Find user by username or email
    let userQuery;
    if (username) {
      userQuery = [Query.equal("username", username)];
    } else {
      userQuery = [Query.equal("email", email)];
    }

    const userResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      userQuery
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult.documents[0] as unknown as Signedupusers;

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified" },
        { status: 400 }
      );
    }

    // Generate new OTP
    const newOtp = await generateotp();

    // Update user with new OTP in Appwrite
    await databases.updateDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      user.$id!,
      { otp: newOtp }
    );

    // Send new OTP email
    await sendOTPEmail(user.email, newOtp, user.username);

    return NextResponse.json(
      { 
        success: true, 
        message: "New OTP sent successfully to your email",
        email: user.email
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Resend OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to resend OTP. Please try again later.",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to resend OTP.' },
    { status: 405 }
  );
}