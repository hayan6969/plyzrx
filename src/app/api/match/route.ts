import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const MATCH_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCH_ASSIGNMENTS_COLLECTION_ID || '';

interface MatchAssignment {
  $id?: string;
  player1Id: string;
  player2Id: string;
  WinnerId: string;
  WinnerScore: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface UserMatchDetails {
  matchId: string;
  opponentId: string;
  isPlayer1: boolean;
  status: 'ongoing' | 'won' | 'lost';
  winnerScore?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Query matches where user is either player1 or player2
    const [player1Matches, player2Matches] = await Promise.all([
      databases.listDocuments(
        DATABASE_ID,
        MATCH_ASSIGNMENTS_COLLECTION_ID,
        [Query.equal('player1Id', userId)]
      ),
      databases.listDocuments(
        DATABASE_ID,
        MATCH_ASSIGNMENTS_COLLECTION_ID,
        [Query.equal('player2Id', userId)]
      )
    ]);

    // Combine and process match data
    const allMatches: MatchAssignment[] = [
      ...player1Matches.documents,
      ...player2Matches.documents
    ] as unknown as MatchAssignment[];

    // Transform matches to user-friendly format
    const userMatchDetails: UserMatchDetails[] = allMatches.map(match => {
      const isPlayer1 = match.player1Id === userId;
      const opponentId = isPlayer1 ? match.player2Id : match.player1Id;
      
      let status: 'ongoing' | 'won' | 'lost' = 'ongoing';
      
      if (match.WinnerId) {
        status = match.WinnerId === userId ? 'won' : 'lost';
      }

      return {
        matchId: match.$id || '',
        opponentId,
        isPlayer1,
        status,
        winnerScore: match.WinnerScore || undefined,
        createdAt: match.$createdAt,
        updatedAt: match.$updatedAt
      };
    });

    // Sort matches by creation date (newest first)
    userMatchDetails.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      userId,
      totalMatches: userMatchDetails.length,
      matches: userMatchDetails,
      stats: {
        won: userMatchDetails.filter(m => m.status === 'won').length,
        lost: userMatchDetails.filter(m => m.status === 'lost').length,
        ongoing: userMatchDetails.filter(m => m.status === 'ongoing').length
      }
    });

  } catch (error) {
    console.error('Failed to fetch user match details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch match details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}