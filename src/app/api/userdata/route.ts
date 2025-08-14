import { NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";

// Server-side Appwrite client
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const SIGNEDUP_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

export async function POST(request: Request) {
  try {
    const { userId, username } = await request.json();

    if (!userId && !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Either userId or username is required",
        },
        { status: 400 }
      );
    }

    // Query based on what we have
    let query = [];
    if (userId && userId !== "anonymous") {
      query.push(Query.equal("userId", userId));
    } else if (username && username !== "guest") {
      query.push(Query.equal("username", username));
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Valid userId or username is required",
        },
        { status: 400 }
      );
    }

    const userResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      query
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const user = userResult.documents[0];

    return NextResponse.json({
      success: true,
      email: user.email,
      username: user.username,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user data",
      },
      { status: 500 }
    );
  }
}
