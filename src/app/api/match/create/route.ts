import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'appwrite';

// Initialize Appwrite Client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const MATCH_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCH_ASSIGNMENTS_COLLECTION_ID || '';
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || '';

interface CreateMatchRequest {
  player1Id: string;
  player2Id: string;
  tournamentId?: string; // Optional, will be auto-detected if not provided
}

interface MatchAssignment {
  $id?: string;
  player1Id: string;
  player2Id: string;
  WinnerId: string;
  WinnerScore: string;
  tournamentid: string;
  StartedAt: string;
}

// // Generate unique match ID
// const generateMatchId = (): string => {
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000);
//   return `MATCH_${timestamp}_${random}`;
// };

export async function POST(request: NextRequest) {
  try {
    const body: CreateMatchRequest = await request.json();
    const { player1Id, player2Id, tournamentId } = body;

    // Validation
    if (!player1Id || !player2Id) {
      return NextResponse.json(
        { error: 'Both player1Id and player2Id are required' },
        { status: 400 }
      );
    }

    if (player1Id === player2Id) {
      return NextResponse.json(
        { error: 'Cannot create a match between the same player' },
        { status: 400 }
      );
    }

    // Auto-detect tournament ID if not provided
    let finalTournamentId = tournamentId;
    
    if (!finalTournamentId) {
      try {
        // Get tournament assignment for player1 using correct Query syntax
        const player1Assignment = await databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [
            Query.equal('userId', player1Id),
            Query.equal('AccessStatus', 'Active')
          ]
        );

        if (player1Assignment.documents.length > 0) {
          finalTournamentId = player1Assignment.documents[0].tournamentId;
        } else {
          return NextResponse.json(
            { error: 'Player1 is not assigned to any active tournament' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error fetching tournament assignment:', error);
        return NextResponse.json(
          { error: 'Failed to fetch player tournament assignment' },
          { status: 500 }
        );
      }
    }

    // Validate that both players are in the same tournament (optional check)
    try {
      const [player1Assignment, player2Assignment] = await Promise.all([
        databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [
            Query.equal('userId', player1Id),
            Query.equal('AccessStatus', 'Active')
          ]
        ),
        databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [
            Query.equal('userId', player2Id),
            Query.equal('AccessStatus', 'Active')
          ]
        )
      ]);

      if (player1Assignment.documents.length === 0) {
        return NextResponse.json(
          { error: 'Player1 is not assigned to any active tournament' },
          { status: 400 }
        );
      }

      if (player2Assignment.documents.length === 0) {
        return NextResponse.json(
          { error: 'Player2 is not assigned to any active tournament' },
          { status: 400 }
        );
      }

      // Check if players are in the same tournament
      const player1Tournament = player1Assignment.documents[0].tournamentId;
      const player2Tournament = player2Assignment.documents[0].tournamentId;

      if (player1Tournament !== player2Tournament) {
        return NextResponse.json(
          { error: 'Players must be in the same tournament to create a match' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error validating player assignments:', error);
      return NextResponse.json(
        { error: 'Failed to validate player tournament assignments' },
        { status: 500 }
      );
    }

    // Check if these players already have an ongoing match
    try {
      const existingMatches = await databases.listDocuments(
        DATABASE_ID,
        MATCH_ASSIGNMENTS_COLLECTION_ID,
        [
          Query.or([
            Query.and([
              Query.equal('player1Id', player1Id),
              Query.equal('player2Id', player2Id)
            ]),
            Query.and([
              Query.equal('player1Id', player2Id),
              Query.equal('player2Id', player1Id)
            ])
          ]),
          Query.equal('WinnerId', '') // Only ongoing matches (no winner yet)
        ]
      );

      if (existingMatches.documents.length > 0) {
        return NextResponse.json(
          { error: 'These players already have an ongoing match' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error checking existing matches:', error);
      // Continue with match creation even if this check fails
    }

    // Create the match
    const matchData: Omit<MatchAssignment, '$id'> = {
      player1Id,
      player2Id,
      WinnerId: "", // Empty until match is completed
      WinnerScore: "", // Empty until match is completed
      tournamentid: finalTournamentId || "",
      StartedAt: new Date().toISOString()
    };

    const createdMatch = await databases.createDocument(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID,
      ID.unique(),
      matchData
    );

    return NextResponse.json({
      success: true,
      matchId: createdMatch.$id,
      match: {
        id: createdMatch.$id,
        player1Id: createdMatch.player1Id,
        player2Id: createdMatch.player2Id,
        tournamentId: createdMatch.tournamentid,
        startedAt: createdMatch.StartedAt,
        winnerId: createdMatch.WinnerId || null,
        winnerScore: createdMatch.WinnerScore || null,
        status: createdMatch.WinnerId ? 'completed' : 'ongoing'
      },
      message: 'Match created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create match:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create match',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve match details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    const match = await databases.getDocument(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID,
      matchId
    );

    return NextResponse.json({
      success: true,
      match: {
        id: match.$id,
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        tournamentId: match.tournamentid,
        startedAt: match.StartedAt,
        winnerId: match.WinnerId || null,
        winnerScore: match.WinnerScore || null,
        status: match.WinnerId ? 'completed' : 'ongoing',
        createdAt: match.$createdAt,
        updatedAt: match.$updatedAt
      }
    });

  } catch (error) {
    console.error('Failed to fetch match:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch match',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}