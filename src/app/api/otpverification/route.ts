import { NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";
import axios from "axios";
import { cookies } from "next/headers";

const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const SIGNEDUP_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

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
  password?: string;
}

export async function POST(request: Request) {
  const { otp, email } = await request.json();

  const savedotp = await databases.listDocuments(
    DATABASE_ID,
    SIGNEDUP_COLLECTION_ID,
    [Query.equal("email", email)]
  );
  const cookiesStore = cookies();
  if (savedotp.documents.length > 0) {
    const userDoc = savedotp.documents[0];
    const savedOtp = userDoc.otp;

    if (otp == savedOtp) {
      // If user is already verified, just verify OTP without Unity signup
      if (userDoc.isVerified) {
        await databases.updateDocument(
          DATABASE_ID,
          SIGNEDUP_COLLECTION_ID,
          userDoc.$id,
          { otp: "" }
        );

        return NextResponse.json(
          {
            success: true,
            message: "OTP verified successfully. You are already registered.",
            username: userDoc.username,
            userid: userDoc.userId,
            alreadyVerified: true,
          },
          { status: 200 }
        );
      }

      // If user is not verified, proceed with Unity signup
      try {
        // Sign up with Unity first
        const unitySignup = await axios.post(
          "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/sign-up",
          {
            username: userDoc.username,
            password: userDoc.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              ProjectId: process.env.NEXT_PUBLIC_PROJECTID ?? "",
            },
          }
        );

        // Update user document with Unity user ID and verification status
        await databases.updateDocument(
          DATABASE_ID,
          SIGNEDUP_COLLECTION_ID,
          userDoc.$id,
          {
            otp: "",
            isVerified: true,
            userId: unitySignup.data.user.id,
            username: unitySignup.data.user.username,
            password: "", // Clear password after successful signup
          }
        );

        (await cookiesStore).set({
          name: "token",
          value: unitySignup.data.idToken,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          maxAge: unitySignup.data.expiresIn,
        });

        return NextResponse.json(
          {
            success: true,
            message: "OTP verified and account created successfully",
            username: unitySignup.data.user.username,
            userid: unitySignup.data.user.id,
            alreadyVerified: false,
          },
          { status: 200 }
        );
      } catch (unityError: any) {
        console.error(
          "Unity signup failed:",
          unityError.response?.data || unityError.message
        );

        return NextResponse.json(
          {
            success: false,
            message:
              unityError.response?.data.detail ||
              "Failed to create Unity account",
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
}
