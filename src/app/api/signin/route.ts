import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { Client, Databases, Query } from "appwrite";

// Server-side Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

export async function POST(request: Request) {
  let username, password;

  try {
    const body = await request.json();
    username = body.username;
    password = body.password;
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  const cookiesStore = cookies();

  if (!username || !password) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }

  try {
    // First check if user exists in our signup collection and is verified
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("username", username)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found. Please sign up first."
      }, { status: 404 });
    }

    const user = userResult.documents[0];
    
    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "Please check your email for OTP verification."
      }, { status: 403 });
    }

    // If user is verified, proceed with Unity sign-in
    const api = await axios.post(
      "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/sign-in",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
          ProjectId: process.env.NEXT_PUBLIC_PROJECTID ?? "",
        },
      }
    );

    (await cookiesStore).set({
      name: "token",
      value: api.data.idToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: api.data.expiresIn,
    });

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      username: api.data.user.username,
      userid: api.data.user.id,
    });
  } catch (error: any) {
    console.log("Error Response:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: error.response?.data?.detail || error.message,
    });
  }
}
