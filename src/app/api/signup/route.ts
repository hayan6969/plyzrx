import { NextResponse } from "next/server";
import axios from "axios";
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
  isVerified:boolean
}

// Function to create signed up user in Appwrite
const createSignedUpUser = async (userId: string, username: string, email: string) => {
  try {
    // Check if user already exists
    const existingUserResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (existingUserResult.documents.length > 0) {
      console.log(`User ${userId} already exists in signed up users collection`);
      return existingUserResult.documents[0];
    }

    const otpgen = await generateotp(); // Remove Number() since it's already a string
    
    // Create new signed up user
    const signedUpUserData: Partial<Signedupusers> = {
      userId: userId,
      username: username,
      email: email,
      paymentId: "",
      wins: 0,
      loss: 0,
      amount: 0,
      otp: otpgen, // Convert to number for storage
      isVerified: false
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      ID.unique(),
      signedUpUserData
    );

    console.log(`Created signed up user in Appwrite: ${userId}`);
    return { ...result, otpString: otpgen }; // Return both document and OTP string
  } catch (error) {
    console.error("Failed to create signed up user in Appwrite:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  const { fullname, username, email, password } = await request.json();
  
  if (!fullname || !username || !email || !password) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }

  try {
    // Sign up with Unity
    const api = await axios.post(
      "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/sign-up",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
          ProjectId: process.env.NEXT_PUBLIC_PROJECTID ?? "",
        },
      }
    );

    // Save user data to Appwrite after successful Unity sign-up
    try {
      const userDoc = await createSignedUpUser(
        api.data.user.id,      // Unity user ID
        api.data.user.username, // Unity username
        email                   // Email from form
      );
      
      // Send OTP email using EmailJS
      await sendOTPEmail(email, (userDoc as any).otpString, username);
      
    } catch (appwriteError) {
      console.error("Failed to save user to Appwrite or send email:", appwriteError);
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully. Please check your email for OTP verification.",
      username: api.data.user.username,
      userId: api.data.user.id,
      requiresVerification: true,
    });
  } catch (error: any) {
    console.log("Error Response:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: error.response?.data.detail || "Can't Create Account",
    });
  }
}
