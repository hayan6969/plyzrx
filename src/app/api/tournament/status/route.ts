import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || '';

interface TournamentControl {
  $id?: string;
  tournamentId: string;
  name: string;
  tier: 1 | 2 | 3;
  isManualMode: boolean;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'scheduled' | 'active' | 'ended';
  createdBy: string;
  lastModifiedBy: string;
}

// Function to check and update tournament statuses
const checkAndUpdateTournamentStatus = async (): Promise<{
  totalChecked: number;
  totalStarted: number;
  startedTournaments: Array<{
    tournamentId: string;
    name: string;
    tier: number;
  }>;
  errors: string[];
}> => {
  const currentDate = new Date();
  const errors: string[] = [];
  let totalChecked = 0;
  let totalStarted = 0;
  const startedTournaments: Array<{
    tournamentId: string;
    name: string;
    tier: number;
  }> = [];

  try {
    console.log(`Starting tournament status check at ${currentDate.toISOString()}`);

    // Get all scheduled tournaments that should have started
    const scheduledTournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal("status", "scheduled"),
        Query.orderAsc("scheduledStartDate")
      ]
    );

    const scheduledTournaments = scheduledTournamentsResult.documents as unknown as TournamentControl[];
    totalChecked = scheduledTournaments.length;

    console.log(`Found ${totalChecked} scheduled tournaments to check`);

    for (const tournament of scheduledTournaments) {
      try {
        const startDate = new Date(tournament.scheduledStartDate);
        
        // Check if tournament should start (current time >= start time)
        if (currentDate >= startDate) {
          console.log(`Tournament ${tournament.name} (${tournament.tournamentId}) should start now`);

          // Check if there's already an active tournament in this tier (unless manual mode)
          if (!tournament.isManualMode) {
            const activeTournamentsResult = await databases.listDocuments(
              DATABASE_ID,
              TOURNAMENT_COLLECTION_ID,
              [
                Query.equal("tier", tournament.tier),
                Query.equal("status", "active")
              ]
            );

            if (activeTournamentsResult.documents.length > 0) {
              const activeTournament = activeTournamentsResult.documents[0];
              errors.push(`Cannot start tournament ${tournament.tournamentId}. Tier ${tournament.tier} already has an active tournament: ${activeTournament.name} (${activeTournament.tournamentId})`);
              continue;
            }
          }

          // Update tournament status to active
          await databases.updateDocument(
            DATABASE_ID,
            TOURNAMENT_COLLECTION_ID,
            tournament.$id!,
            {
              status: 'active',
              actualStartDate: currentDate.toISOString(),
              lastModifiedBy: 'system-auto-start'
            }
          );

          totalStarted++;
          startedTournaments.push({
            tournamentId: tournament.tournamentId,
            name: tournament.name,
            tier: tournament.tier
          });

          console.log(`✅ Tournament ${tournament.name} (${tournament.tournamentId}) started successfully`);
        } else {
          console.log(`Tournament ${tournament.name} scheduled for ${startDate.toISOString()}, not yet time to start`);
        }

      } catch (error) {
        const errorMsg = `Failed to process tournament ${tournament.tournamentId}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return {
      totalChecked,
      totalStarted,
      startedTournaments,
      errors
    };

  } catch (error) {
    console.error("Failed to check tournament statuses:", error);
    throw error;
  }
};

// POST method for manual trigger
export async function POST(request: NextRequest) {
  try {
    console.log("Manual tournament status check triggered");

    const result = await checkAndUpdateTournamentStatus();

    const summary = {
      timestamp: new Date().toISOString(),
      ...result
    };

    console.log("Tournament status check completed:", summary);

    return NextResponse.json({
      success: true,
      message: `Tournament status check completed. Started ${result.totalStarted} tournaments out of ${result.totalChecked} checked.`,
      data: summary
    });

  } catch (error) {
    console.error('Tournament status check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check tournament statuses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for status check (can be used by monitoring systems)
export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date();
    console.log(request);

    // Get all scheduled tournaments
    const scheduledTournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [Query.equal("status", "scheduled")]
    );

    const scheduledTournaments = scheduledTournamentsResult.documents as unknown as TournamentControl[];
    
    // Check which tournaments are ready to start
    const readyToStart = scheduledTournaments.filter(tournament => {
      const startDate = new Date(tournament.scheduledStartDate);
      return currentDate >= startDate;
    });

    const upcomingStarts = scheduledTournaments.filter(tournament => {
      const startDate = new Date(tournament.scheduledStartDate);
      const timeDiff = startDate.getTime() - currentDate.getTime();
      return timeDiff > 0 && timeDiff <= 60 * 60 * 1000; // Within 1 hour
    });

    return NextResponse.json({
      success: true,
      data: {
        currentTime: currentDate.toISOString(),
        totalScheduledTournaments: scheduledTournaments.length,
        readyToStart: readyToStart.length,
        upcomingStarts: upcomingStarts.length,
        readyToStartList: readyToStart.map(t => ({
          tournamentId: t.tournamentId,
          name: t.name,
          tier: t.tier,
          scheduledStartDate: t.scheduledStartDate,
          isManualMode: t.isManualMode
        })),
        upcomingStartsList: upcomingStarts.map(t => ({
          tournamentId: t.tournamentId,
          name: t.name,
          tier: t.tier,
          scheduledStartDate: t.scheduledStartDate,
          timeUntilStart: new Date(t.scheduledStartDate).getTime() - currentDate.getTime()
        }))
      }
    });

  } catch (error) {
    console.error('Failed to get tournament status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get tournament status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}