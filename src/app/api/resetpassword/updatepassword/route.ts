import { NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";
import axios from "axios";

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
    const { username, newPassword } = await request.json();

    // Validate required fields
    if (!username || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Username and new password are required" },
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

    // Check if OTP is not empty - prevent password change if OTP is still pending
    if (user.otp && user.otp.trim() !== "") {
      return NextResponse.json(
        { success: false, message: "Please complete OTP verification before changing password" },
        { status: 400 }
      );
    }

    try {
      // Call Unity API to change password
      const unityResponse = await axios.post(
        `https://services.api.unity.com/player-identity/v1/projects/${process.env.NEXT_PUBLIC_PROJECTID}/users/${user.userId}/change-password`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.NEXT_UNITY_API_KEY,
            "ProjectId": process.env.NEXT_PUBLIC_PROJECTID || "",
          },
        }
      );

      return NextResponse.json(
        { 
          success: true, 
          message: "Password updated successfully. You can now login with your new password.",
          username: user.username
        },
        { status: 200 }
      );

    } catch (unityError: any) {
      console.error("Unity password change error:", unityError.response?.data || unityError.message);
      
      // Handle specific Unity API errors
      if (unityError.response?.status === 404) {
        return NextResponse.json(
          { success: false, message: "User not found in Unity system" },
          { status: 404 }
        );
      }
      
      if (unityError.response?.status === 400) {
        return NextResponse.json(
          { success: false, message: "Invalid password format. Please choose a stronger password." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to update password. Please try again later.",
          details: unityError.response?.data?.detail || unityError.message
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Password Update Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update password. Please try again later.",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to update password.' },
    { status: 405 }
  );
}