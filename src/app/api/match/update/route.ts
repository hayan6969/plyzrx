import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const MATCH_ASSIGNMENTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_MATCH_ASSIGNMENTS_COLLECTION_ID || "";
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER || "";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("id");
    if (!matchId) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      );
    }

    const { WinnerId, WinnerScore } = await request.json();
    if (!WinnerId || !WinnerScore) {
      return NextResponse.json(
        { error: "WinnerId and WinnerScore are required" },
        { status: 400 }
      );
    }

    // 1. Update the match assignment
    const updatedMatch = await databases.updateDocument(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID,
      matchId,
      {
        WinnerId,
        WinnerScore,
        endedAt: new Date().toISOString(),
      }
    );

    // 2. Find the user in the user collection by userId
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", WinnerId)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { error: "Winner user not found" },
        { status: 404 }
      );
    }

    const userDoc = userResult.documents[0];
    // TournamentScore is string or null
    const prevScore = Number(userDoc.TournamentScore) || 0;
    const winnerScoreNum = Number(WinnerScore) || 0;
    const newScore = prevScore + winnerScoreNum;

    // 3. Update the user's tournament score (as string)
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userDoc.$id, // still need $id to update the document
      { TournamentScore: String(newScore) }
    );

    return NextResponse.json({
      success: true,
      updatedMatch,
      newUserScore: newScore,
    });
  } catch (error) {
    console.error("Failed to update match and user score:", error);
    return NextResponse.json(
      {
        error: "Failed to update match and user score",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
