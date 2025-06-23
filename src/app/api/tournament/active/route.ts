import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side usage
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || '';

interface ActiveTournamentResponse {
  tier: number;
  tournamentId: string;
  name: string;
  status: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  isManualMode: boolean;
  createdBy: string;
  lastModifiedBy: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get all active tournaments across all tiers
    const activeTournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.orderAsc('tier')
      ]
    );

    if (activeTournamentsResult.documents.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          tier1: null,
          tier2: null,
          tier3: null
        },
        message: 'No active tournaments found'
      });
    }

    // Group tournaments by tier
    const tournamentsByTier: { [key: number]: ActiveTournamentResponse } = {};

    activeTournamentsResult.documents.forEach((tournament: any) => {
      const formattedTournament: ActiveTournamentResponse = {
        tier: tournament.tier,
        tournamentId: tournament.tournamentId,
        name: tournament.name,
        status: tournament.status,
        scheduledStartDate: tournament.scheduledStartDate,
        scheduledEndDate: tournament.scheduledEndDate,
        actualStartDate: tournament.actualStartDate || undefined,
        actualEndDate: tournament.actualEndDate || undefined,
        isManualMode: tournament.isManualMode,
        createdBy: tournament.createdBy,
        lastModifiedBy: tournament.lastModifiedBy
      };

      tournamentsByTier[tournament.tier] = formattedTournament;
    });

    return NextResponse.json({
      success: true,
      data: {
        tier1: tournamentsByTier[1] || null,
        tier2: tournamentsByTier[2] || null,
        tier3: tournamentsByTier[3] || null
      },
      total: activeTournamentsResult.documents.length
    });

  } catch (error) {
    console.error('Failed to fetch active tournaments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch active tournaments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}