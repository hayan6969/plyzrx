import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || '';

export async function GET(request: NextRequest) {
  try {
    console.log(request);
    
    // Get active tournaments for all tiers
    const activeTournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.orderAsc('tier')
      ]
    );

    // Get scheduled tournaments for all tiers
    const scheduledTournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal('status', 'scheduled'),
        Query.orderAsc('tier')
      ]
    );

    type Timer = {
      tournamentId: any;
      name: any;
      status: any;
      targetDate: any;
      type: string;
    } | null;
    
    const timers: { tier1: Timer; tier2: Timer; tier3: Timer } = {
      tier1: null,
      tier2: null,
      tier3: null
    };

    // Process active tournaments first (they have priority)
    activeTournamentsResult.documents.forEach((tournament: any) => {
      const tierKey = `tier${tournament.tier}` as keyof typeof timers;
      timers[tierKey] = {
        tournamentId: tournament.tournamentId,
        name: tournament.name,
        status: tournament.status,
        targetDate: tournament.actualEndDate || tournament.scheduledEndDate,
        type: 'end' // counting down to end
      };
    });

    // Process scheduled tournaments (only if no active tournament for that tier)
    scheduledTournamentsResult.documents.forEach((tournament: any) => {
      const tierKey = `tier${tournament.tier}` as keyof typeof timers;
      if (!timers[tierKey]) {
        timers[tierKey] = {
          tournamentId: tournament.tournamentId,
          name: tournament.name,
          status: tournament.status,
          targetDate: tournament.scheduledStartDate,
          type: 'start' // counting down to start
        };
      }
    });
 
    

    return NextResponse.json({
      success: true,
      data: timers
    });

  } catch (error) {
    console.error('Failed to fetch tournament timers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tournament timers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}