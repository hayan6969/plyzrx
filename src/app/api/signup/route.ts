import { NextResponse } from "next/server";
import { Client, Databases, ID, Query } from "appwrite";
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
  otp:string,
  isVerified:boolean,
  password?: string;
}

// Function to create signed up user in Appwrite (before Unity signup)
const createPendingUser = async (username: string, email: string, password: string) => {
  try {
    // Check if email already exists
    const existingEmailResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("email", email)]
    );

    if (existingEmailResult.documents.length > 0) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const otpgen = await generateotp();
    
    // Create new pending user (without Unity ID)
    const pendingUserData: Partial<Signedupusers> = {
      userId: "", // Will be set after Unity signup
      username: username,
      email: email,
      password: password, // Store temporarily for Unity signup
      paymentId: "",
      wins: 0,
      loss: 0,
      amount: 0,
      otp: otpgen,
      isVerified: false
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      ID.unique(),
      pendingUserData
    );

    console.log(`Created pending user in Appwrite: ${username}`);
    return { ...result, otpString: otpgen };
  } catch (error) {
    console.error("Failed to create pending user in Appwrite:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  const { fullname, username, email, password } = await request.json();
  
  if (!fullname || !username || !email || !password) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }

  // Check if email already exists
  try {
    const existingEmailResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("email", email)]
    );

    if (existingEmailResult.documents.length > 0) {
      return NextResponse.json({
        success: false,
        message: "An account with this email already exists. Please use a different email or sign in.",
      }, { status: 409 });
    }
  } catch (emailCheckError) {
    console.error("Failed to check email existence:", emailCheckError);
    return NextResponse.json({
      success: false,
      message: "Unable to verify email. Please try again.",
    }, { status: 500 });
  }

  try {
    // Create pending user in Appwrite (without Unity signup)
    const userDoc = await createPendingUser(username, email, password);
    
    // Send OTP email using EmailJS
    await sendOTPEmail(email, (userDoc as any).otpString, username);

    return NextResponse.json({
      success: true,
      message: "Please check your email for OTP verification to complete your account creation.",
      username: username,
      requiresVerification: true,
    });
  } catch (error: any) {
    console.log("Error:", error.message);

    // Handle specific email already exists error
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json({
        success: false,
        message: "An account with this email already exists. Please use a different email.",
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to create account. Please try again.",
    }, { status: 500 });
  }
}
