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

const updateSignedupUserStatsServer = async (
  userId: string,
  updates: {
    wins?: number;
    losses?: number;
    earnings?: number;
  }
): Promise<void> => {
  try {
    const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";
    
    // Find the user in signed up collection
    const result = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      console.warn(`User ${userId} not found in signed up users collection`);
      return;
    }

    const user = result.documents[0];
    const updateData: any = {};

    // Update wins (add to existing)
    if (updates.wins !== undefined) {
      updateData.wins = (user.wins || 0) + updates.wins;
    }

    // Update losses (add to existing)
    if (updates.losses !== undefined) {
      updateData.loss = (user.loss || 0) + updates.losses;
    }

    // Update earnings (add to existing total)
    if (updates.earnings !== undefined) {
      updateData.amount = (user.amount || 0) + updates.earnings;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        SIGNEDUP_COLLECTION_ID,
        user.$id,
        updateData
      );
      
      console.log(`Updated signed up user ${userId}:`, updateData);
    }
  } catch (error) {
    console.error("Failed to update signed up user stats:", error);
    // Don't throw error to avoid breaking the main flow
  }
};

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

    const { WinnerId, WinnerScore, LoserId, LoserScore } = await request.json();
    if (!WinnerId || WinnerScore === undefined || !LoserId || LoserScore === undefined) {
      return NextResponse.json(
        { error: "WinnerId, WinnerScore, LoserId, and LoserScore are required" },
        { status: 400 }
      );
    }

    // Check if match exists and get match details
    let matchDoc;
    try {
      matchDoc = await databases.getDocument(
        DATABASE_ID,
        MATCH_ASSIGNMENTS_COLLECTION_ID,
        matchId
      );
    } catch (error) {
      return NextResponse.json(
        { error: `Match not found ${error}` },
        { status: 404 }
      );
    }

    // Verify that winner and loser IDs are valid players in this match
    const player1Id = matchDoc.player1Id;
    const player2Id = matchDoc.player2Id;
    
    if (!player1Id || !player2Id) {
      return NextResponse.json(
        { error: "Match is missing player assignments" },
        { status: 400 }
      );
    }

    const validPlayerIds = [player1Id, player2Id];
    
    if (!validPlayerIds.includes(WinnerId)) {
      return NextResponse.json(
        { error: "Winner ID is not a valid player in this match" },
        { status: 400 }
      );
    }

    if (!validPlayerIds.includes(LoserId)) {
      return NextResponse.json(
        { error: "Loser ID is not a valid player in this match" },
        { status: 400 }
      );
    }

    if (WinnerId === LoserId) {
      return NextResponse.json(
        { error: "Winner and Loser cannot be the same player" },
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
        WinnerScore: String(WinnerScore),
        LoserId,
        LoserScore: String(LoserScore),
        endedAt: new Date().toISOString(),
      }
    );

    // 2. Find and update winner user
    const winnerResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", WinnerId)]
    );

    if (winnerResult.documents.length === 0) {
      return NextResponse.json(
        { error: "Winner user not found" },
        { status: 404 }
      );
    }

    const winnerDoc = winnerResult.documents[0];
    const winnerPrevScore = Number(winnerDoc.TournamentScore) || 0;
    const winnerScoreNum = Number(WinnerScore) || 0;
    const winnerNewScore = winnerPrevScore + winnerScoreNum;
    const winnerPrevWins = Number(winnerDoc.wins) || 0;

    // Update winner's stats
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      winnerDoc.$id,
      { 
        TournamentScore: String(winnerNewScore),
        wins: winnerPrevWins + 1
      }
    );


    await updateSignedupUserStatsServer(WinnerId, { wins: 1 });

    // 3. Find and update loser user
    const loserResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", LoserId)]
    );

    if (loserResult.documents.length === 0) {
      return NextResponse.json(
        { error: "Loser user not found" },
        { status: 404 }
      );
    }

    const loserDoc = loserResult.documents[0];
    const loserPrevScore = Number(loserDoc.TournamentScore) || 0;
    const loserScoreNum = Number(LoserScore) || 0; // Can be negative
    const loserNewScore = loserPrevScore + loserScoreNum;
    const loserPrevLosses = Number(loserDoc.loss) || 0;

    // Update loser's stats
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      loserDoc.$id,
      { 
        TournamentScore: String(loserNewScore),
        loss: loserPrevLosses + 1
      }
    );


    await updateSignedupUserStatsServer(LoserId, { losses: 1 });

    return NextResponse.json({
      success: true,
      updatedMatch,
      winner: {
        userId: WinnerId,
        newScore: winnerNewScore,
        newWins: winnerPrevWins + 1
      },
      loser: {
        userId: LoserId,
        newScore: loserNewScore,
        newLosses: loserPrevLosses + 1
      }
    });
  } catch (error) {
    console.error("Failed to update match and user scores:", error);
    return NextResponse.json(
      {
        error: "Failed to update match and user scores",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
