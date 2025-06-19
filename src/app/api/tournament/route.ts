import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side usage
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || '';
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || '';

interface UserTournamentResponse {
  tournamentId: string;
  startDate: string;
  endDate: string;
  status: string;
  name: string;
  tier: number;
  accessStatus: string;
  assignedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // First, get all tournament assignments for the user
    const assignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    if (assignmentsResult.documents.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No tournaments found for this user'
      });
    }

    // Extract tournament IDs from assignments
    const tournamentIds = assignmentsResult.documents.map((doc: any) => doc.tournamentId);

    // Get tournament details for all assigned tournaments
    const tournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [Query.equal('tournamentId', tournamentIds)]
    );

    // Combine tournament data with assignment data
    const userTournaments: UserTournamentResponse[] = assignmentsResult.documents.map((assignment: any) => {
      const tournament = tournamentsResult.documents.find((t: any) => t.tournamentId === assignment.tournamentId);
      
      return {
        tournamentId: assignment.tournamentId,
        startDate: tournament?.scheduledStartDate || '',
        endDate: tournament?.scheduledEndDate || '',
        status: tournament?.status || 'unknown',
        name: tournament?.name || 'Unknown Tournament',
        tier: parseInt(assignment.tier),
        accessStatus: assignment.AccessStatus,
        assignedAt: assignment.assignedAt
      };
    });

    // Sort by assigned date (most recent first)
    userTournaments.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

    return NextResponse.json({
      success: true,
      data: userTournaments,
      total: userTournaments.length
    });

  } catch (error) {
    console.error('Failed to fetch user tournaments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user tournaments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
