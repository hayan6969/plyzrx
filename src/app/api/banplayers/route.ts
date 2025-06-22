import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

// Server-side Appwrite client initialization
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const BAN_USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BAN_USERS_COLLECTION_ID || "";

export async function GET(request: NextRequest) {
  try {
    // Get userId from URL search parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user is banned
    const result = await databases.listDocuments(
      DATABASE_ID,
      BAN_USERS_COLLECTION_ID,
      [Query.equal("reportedId", userId)]
    );

    const isBanned = result.documents.length > 0;
    const banInfo = isBanned ? result.documents[0] : null;

    return NextResponse.json({
      userId,
      isBanned,
      banInfo: banInfo ? {
        id: banInfo.$id,
        reportedId: banInfo.reportedId,
        createdAt: banInfo.$createdAt
      } : null
    });

  } catch (error) {
    console.error('Error checking ban status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
