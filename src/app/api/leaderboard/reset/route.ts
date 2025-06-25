import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';


const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);


const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || '';
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || '';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '';
const PAYMENT_LOGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_LOGS_COLLECTION_ID || '';
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || '';
const EARNING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EARNING_COLLECTION_ID || '';


const PAYOUT_AMOUNTS = {
  tier1: {
    top10: 5000,
    remaining: 555
  },
  tier2: {
    top10: 12500,
    remaining: 1388
  },
  tier3: {
    top10: 250000,
    remaining: 28000
  }
};

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

interface TournamentAssignment {
  $id?: string;
  userId: string;
  tournamentId: string;
  assignedAt: string;
  tier: '1' | '2' | '3';
  PaymentId?: string;
  AccessStatus: 'Awaiting' | 'Active' | 'Completed' | 'Expired';
  TournamentScore?: number;
  wins?: number;
  loss?: number;
  earnings?: number;
}

interface Signedupusers {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number;
  username: string;
  email: string;
}

interface Earning {
  $id?: string;
  userId: string;
  amount: number;
  createdAt?: string;
  tournamentId?: string;
  tier?: number;
}

// Function to create earning record
const createEarningRecord = async (
  userId: string,
  amount: number,
  tournamentId: string,
  tier: number
): Promise<void> => {
  try {
    await databases.createDocument(
      DATABASE_ID,
      EARNING_COLLECTION_ID,
      'unique()',
      {
        userId,
        amount,
        tournamentId,
        tier,
        createdAt: new Date().toISOString()
      }
    );

    console.log(`Created earning record for user ${userId}: $${amount} from tournament ${tournamentId}`);
  } catch (error) {
    console.error(`Failed to create earning record for user ${userId}:`, error);
    throw error;
  }
};

// Function to update signed up user earnings
const updateSignedupUserEarnings = async (
  userId: string,
  earnings: number
): Promise<void> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      console.warn(`User ${userId} not found in signed up users collection`);
      return;
    }

    const user = result.documents[0] as unknown as Signedupusers;

    const updatedAmount = (user.amount || 0) + earnings;

    await databases.updateDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      user.$id!,
      { amount: updatedAmount }
    );

    console.log(`Updated earnings for user ${userId}: +$${earnings} (Total: $${updatedAmount})`);
  } catch (error) {
    console.error(`Failed to update earnings for user ${userId}:`, error);
    throw error;
  }
};

// Function to distribute tournament payouts
const distributeTournamentPayouts = async (
  tournamentId: string,
  tier: 1 | 2 | 3
): Promise<{
  success: number;
  failed: number;
  totalPayout: number;
  errors: string[];
  payouts: Array<{ userId: string; amount: number; rank: number }>;
  earningRecords: number;
}> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [
        Query.equal("tournamentId", tournamentId),
        Query.equal("AccessStatus", "ended")
      ]
    );

    const assignments = result.documents as unknown as TournamentAssignment[];

    if (assignments.length === 0) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: ["No active tournament assignments found for this tournament"],
        payouts: [],
        earningRecords: 0
      };
    }

    const sortedAssignments = assignments
      .filter(assignment => assignment.TournamentScore !== undefined)
      .sort((a, b) => (b.TournamentScore || 0) - (a.TournamentScore || 0));

    if (sortedAssignments.length === 0) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: ["No tournament scores found for ranking"],
        payouts: [],
        earningRecords: 0
      };
    }

    // Get payout amounts based on tier
    const tierKey = `tier${tier}` as keyof typeof PAYOUT_AMOUNTS;
    const payoutConfig = PAYOUT_AMOUNTS[tierKey];

    let successCount = 0;
    let failedCount = 0;
    let totalPayout = 0;
    let earningRecords = 0;
    const errors: string[] = [];
    const payouts: Array<{ userId: string; amount: number; rank: number }> = [];

    for (let i = 0; i < sortedAssignments.length && i < 100; i++) {
      try {
        const assignment = sortedAssignments[i];
        const rank = i + 1;
        let payoutAmount = 0;

        if (rank <= 10) {
          payoutAmount = payoutConfig.top10;
        } else if (rank <= 100) {
          payoutAmount = payoutConfig.remaining;
        }

        if (payoutAmount > 0) {
          // Update tournament assignment (removed rank field)
          await databases.updateDocument(
            DATABASE_ID,
            TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
            assignment.$id!,
            {
              earnings: payoutAmount,
              AccessStatus: "Completed"
            }
          );

          // Update earnings in signed up users collection
          await updateSignedupUserEarnings(assignment.userId, payoutAmount);

          // Create earning record
          await createEarningRecord(assignment.userId, payoutAmount, tournamentId, tier);
          earningRecords++;

          payouts.push({
            userId: assignment.userId,
            amount: payoutAmount,
            rank: rank
          });

          totalPayout += payoutAmount;
          successCount++;
        } else {
          // Mark as completed even if no payout (removed rank field)
          await databases.updateDocument(
            DATABASE_ID,
            TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
            assignment.$id!,
            {
              AccessStatus: "Completed"
            }
          );
        }
      } catch (error) {
        errors.push(`Failed to process payout for user ${sortedAssignments[i].userId}: ${error}`);
        failedCount++;
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      totalPayout,
      errors,
      payouts,
      earningRecords
    };
  } catch (error) {
    console.error("Failed to distribute tournament payouts:", error);
    throw error;
  }
};

// Function to clean up tournament data
const cleanupTournamentData = async (
  tournamentId: string,
  userIds: string[]
): Promise<{
  assignmentsRemoved: number;
  usersDeleted: number;
  paymentsRemoved: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  let assignmentsRemoved = 0;
  let usersDeleted = 0;
  let paymentsRemoved = 0;

  try {
    // 1. Remove ALL tournament assignments for this tournament (including completed ones)
    const assignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("tournamentId", tournamentId)]
    );

    for (const assignment of assignmentsResult.documents) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          assignment.$id
        );
        assignmentsRemoved++;
      } catch (error) {
        errors.push(`Failed to remove assignment ${assignment.$id}: ${error}`);
      }
    }

    // 2. Delete user tier data for users who participated
    for (const userId of userIds) {
      try {
        const userResult = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );

        for (const user of userResult.documents) {
          await databases.deleteDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id
          );
          usersDeleted++;
          console.log(`Deleted user tier data for user ${userId}`);
        }
      } catch (error) {
        errors.push(`Failed to delete user tier data for user ${userId}: ${error}`);
      }
    }

    // 3. Remove ALL payment logs for users who participated in this tournament
    for (const userId of userIds) {
      try {
        const paymentsResult = await databases.listDocuments(
          DATABASE_ID,
          PAYMENT_LOGS_COLLECTION_ID,
          [Query.equal("userId", userId)]
        );

        for (const payment of paymentsResult.documents) {
          await databases.deleteDocument(
            DATABASE_ID,
            PAYMENT_LOGS_COLLECTION_ID,
            payment.$id
          );
          paymentsRemoved++;
        }
      } catch (error) {
        errors.push(`Failed to remove payment logs for user ${userId}: ${error}`);
      }
    }

    return {
      assignmentsRemoved,
      usersDeleted,
      paymentsRemoved,
      errors
    };
  } catch (error) {
    console.error("Failed to cleanup tournament data:", error);
    throw error;
  }
};

// Unity API configuration
const UNITY_PROJECT_ID = 'b957437b-dce8-40c5-8831-285c9d4eb01e';
const UNITY_ENVIRONMENT_ID = '95a48711-c4dc-4ac2-8bb2-01786ceab3ef';
const UNITY_BASE_URL = `https://services.api.unity.com/leaderboards/v1/projects/${UNITY_PROJECT_ID}/environments/${UNITY_ENVIRONMENT_ID}/leaderboards`;

// Leaderboard IDs mapping
const TIER_LEADERBOARD_IDS = {
  1: 'Tier_1_Leaderboard',
  2: 'Tier_2_Leaderboard',
  3: 'Tier_3_Leaderboard'
};

// Function to reset Unity leaderboard
const resetUnityLeaderboard = async (tier: 1 | 2 | 3): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const leaderboardId = TIER_LEADERBOARD_IDS[tier];
    const url = `${UNITY_BASE_URL}/${leaderboardId}/scores`;
    
    console.log(`Resetting Unity leaderboard for Tier ${tier}: ${leaderboardId}`);
    
    // Make DELETE request to reset leaderboard
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add Unity authentication headers if required
        'Authorization': `Basic YTIwMjM1OWYtNzM4Mi00ODM5LWJlYTItYmQ0MmNjNGYxNjEwOkVvWXY0VVV0ZWFoMmlrUm00eEhEbnNkYlBubXYyQ3Ns`,
      }
    });

    if (response.ok) {
      console.log(`Successfully reset Unity leaderboard for Tier ${tier}`);
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error(`Failed to reset Unity leaderboard for Tier ${tier}:`, response.status, errorText);
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${errorText}` 
      };
    }
  } catch (error) {
    console.error(`Error resetting Unity leaderboard for Tier ${tier}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log("Starting tournament end date check and cleanup...");

    const currentDate = new Date();
    const currentISOString = currentDate.toISOString();

    // Get all tournaments that need processing (both active that have ended and already ended ones)
    const tournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [Query.or([
        Query.equal("status", "active"),
        Query.equal("status", "ended")
      ])]
    );

    const tournaments = tournamentsResult.documents as unknown as TournamentControl[];
    const processedTournaments: Array<{
      tournamentId: string;
      name: string;
      tier: number;
      payoutResult: any;
      cleanupResult: any;
      unityLeaderboardReset: any;
    }> = [];

    let totalProcessed = 0;
    let totalErrors: string[] = [];

    for (const tournament of tournaments) {
      try {
        const endDate = new Date(tournament.actualEndDate || tournament.scheduledEndDate);
        
        // Check if tournament has ended (current time >= end time)
        if (currentDate >= endDate) {
          console.log(`Processing ended tournament: ${tournament.name} (${tournament.tournamentId})`);

          // Get all users who participated in this tournament
          const participantsResult = await databases.listDocuments(
            DATABASE_ID,
            TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
            [Query.equal("tournamentId", tournament.tournamentId)]
          );

          const participants = participantsResult.documents as unknown as TournamentAssignment[];
          const userIds = participants.map(p => p.userId);

          // 1. Distribute payouts first (this adds earnings to signedupusers collection AND creates earning records)
          const payoutResult = await distributeTournamentPayouts(
            tournament.tournamentId,
            tournament.tier
          );

          // 2. Clean up tournament data (removes payment logs, deletes user tiers, removes assignments)
          const cleanupResult = await cleanupTournamentData(
            tournament.tournamentId,
            userIds
          );

          // 3. Reset Unity leaderboard for this tier
          const unityLeaderboardReset = await resetUnityLeaderboard(tournament.tier);
          
          if (!unityLeaderboardReset.success) {
            totalErrors.push(`Failed to reset Unity leaderboard for Tier ${tournament.tier}: ${unityLeaderboardReset.error}`);
          }

          // 4. Delete the tournament completely
          try {
            await databases.deleteDocument(
              DATABASE_ID,
              TOURNAMENT_COLLECTION_ID,
              tournament.$id!
            );
            console.log(`Tournament ${tournament.tournamentId} deleted successfully`);
          } catch (error) {
            console.error(`Failed to delete tournament ${tournament.tournamentId}:`, error);
            totalErrors.push(`Failed to delete tournament ${tournament.tournamentId}: ${error}`);
          }

          processedTournaments.push({
            tournamentId: tournament.tournamentId,
            name: tournament.name,
            tier: tournament.tier,
            payoutResult,
            cleanupResult,
            unityLeaderboardReset
          });

          totalProcessed++;
          totalErrors.push(...payoutResult.errors, ...cleanupResult.errors);

          console.log(`Completed processing and deleting tournament: ${tournament.name}`);
          console.log(`Cleanup summary: ${cleanupResult.assignmentsRemoved} assignments removed, ${cleanupResult.usersDeleted} users deleted, ${cleanupResult.paymentsRemoved} payments removed`);
          console.log(`Earning records created: ${payoutResult.earningRecords}`);
          console.log(`Unity leaderboard reset: ${unityLeaderboardReset.success ? 'Success' : 'Failed'}`);
        }
      } catch (error) {
        const errorMsg = `Failed to process tournament ${tournament.tournamentId}: ${error}`;
        console.error(errorMsg);
        totalErrors.push(errorMsg);
      }
    }

    const summary = {
      totalTournamentsChecked: tournaments.length,
      totalTournamentsProcessed: totalProcessed,
      processedTournaments,
      totalErrors: totalErrors.length,
      errors: totalErrors
    };

    console.log("Tournament cleanup summary:", summary);

    return NextResponse.json({
      success: true,
      message: `Tournament end date check completed. Processed and completely deleted ${totalProcessed} tournaments.`,
      data: summary
    });

  } catch (error) {
    console.error('Tournament end date check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check tournament end dates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for manual trigger or status check
export async function GET(request: NextRequest) {
  try {
    const currentDate = new Date();
    
    // Get all active tournaments
    const tournamentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [Query.equal("status", "active")]
    );

    const tournaments = tournamentsResult.documents as unknown as TournamentControl[];
    const endingSoon = tournaments.filter(t => {
      const endDate = new Date(t.scheduledEndDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      return timeDiff <= 24 * 60 * 60 * 1000; // Within 24 hours
    });

    const endedTournaments = tournaments.filter(t => {
      const endDate = new Date(t.scheduledEndDate);
      return currentDate >= endDate;
    });

    return NextResponse.json({
      success: true,
      data: {
        currentTime: currentDate.toISOString(),
        totalActiveTournaments: tournaments.length,
        tournamentsEndingSoon: endingSoon.length,
        tournamentsNeedingProcessing: endedTournaments.length,
        endedTournaments: endedTournaments.map(t => ({
          tournamentId: t.tournamentId,
          name: t.name,
          tier: t.tier,
          scheduledEndDate: t.scheduledEndDate
        }))
      }
    });

  } catch (error) {
    console.error('Failed to check tournament status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check tournament status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}