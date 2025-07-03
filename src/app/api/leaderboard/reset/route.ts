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
        amount: amount.toString(), // Convert number to string
        tournamentId,
        tier: tier.toString(), // Also convert tier to string if needed
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
  payouts: Array<{ userId: string; amount: number; score: number }>; // Removed rank
  earningRecords: number;
  usersWithScores: number;
  usersWithoutScores: number;
}> => {
  try {
    console.log(`Starting payout distribution for tournament ${tournamentId}, tier ${tier}`);

    // Get ALL tournament assignments for this specific ended tournament (regardless of AccessStatus)
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("tournamentId", tournamentId)]
    );

    const assignments = result.documents as unknown as TournamentAssignment[];

    console.log(`Found ${assignments.length} total assignments for ended tournament ${tournamentId}`);

    if (assignments.length === 0) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: [`No users participated in tournament ${tournamentId}`],
        payouts: [],
        earningRecords: 0,
        usersWithScores: 0,
        usersWithoutScores: 0
      };
    }

    // Log each assignment for debugging
    assignments.forEach((assignment, index) => {
      console.log(`User ${index + 1}: ${assignment.userId}, Status: ${assignment.AccessStatus}, Score: ${assignment.TournamentScore}`);
    });

    // Separate users with scores and users without scores
    const usersWithScores = assignments.filter(assignment => {
      const hasScore = assignment.TournamentScore !== undefined && assignment.TournamentScore !== null;
      return hasScore;
    });

    const usersWithoutScores = assignments.filter(assignment => {
      const hasScore = assignment.TournamentScore !== undefined && assignment.TournamentScore !== null;
      return !hasScore;
    });

    console.log(`Users with valid scores: ${usersWithScores.length}`);
    console.log(`Users without scores: ${usersWithoutScores.length}`);

    // Log all users with their scores for debugging
    usersWithScores.forEach((assignment, index) => {
      console.log(`User ${index + 1} with score: ${assignment.userId}, Score: ${assignment.TournamentScore}`);
    });

    // Sort users with scores by tournament score (highest first)
    // This will properly handle negative scores - higher scores (even if negative) rank better
    const sortedAssignments = usersWithScores.sort((a, b) => {
      const scoreA = a.TournamentScore || 0;
      const scoreB = b.TournamentScore || 0;
      return scoreB - scoreA; // Descending order (highest first)
    });

    // Log sorted rankings for debugging
    sortedAssignments.forEach((assignment, index) => {
      console.log(`Rank ${index + 1}: User ${assignment.userId}, Score: ${assignment.TournamentScore}`);
    });

    // Get payout amounts based on tier
    const tierKey = `tier${tier}` as keyof typeof PAYOUT_AMOUNTS;
    const payoutConfig = PAYOUT_AMOUNTS[tierKey];

    let successCount = 0;
    let failedCount = 0;
    let totalPayout = 0;
    let earningRecords = 0;
    const errors: string[] = [];
    const payouts: Array<{ userId: string; amount: number; score: number }> = [];

    console.log(`Processing payouts for ${sortedAssignments.length} users with scores in tier ${tier}`);
    console.log(`Payout config: Top 10 = $${payoutConfig.top10}, Remaining = $${payoutConfig.remaining}`);

    // Process users with scores for payouts (up to 100) - INCLUDING NEGATIVE SCORES
    for (let i = 0; i < sortedAssignments.length && i < 100; i++) {
      try {
        const assignment = sortedAssignments[i];
        const rank = i + 1;
        let payoutAmount = 0;

        // Determine payout amount based on rank (regardless of score being positive or negative)
        if (rank <= 10) {
          payoutAmount = payoutConfig.top10;
          console.log(`Rank ${rank} (Top 10): Score ${assignment.TournamentScore}, Payout = $${payoutAmount}`);
        } else if (rank <= 100) {
          payoutAmount = payoutConfig.remaining;
          console.log(`Rank ${rank} (Remaining): Score ${assignment.TournamentScore}, Payout = $${payoutAmount}`);
        }

        console.log(`Processing User ${assignment.userId} - Rank: ${rank}, Score: ${assignment.TournamentScore}, Payout: $${payoutAmount}`);

        // Update tournament assignment with earnings and mark as completed
        await databases.updateDocument(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          assignment.$id!,
          {
            earnings: payoutAmount,
            AccessStatus: "Completed"
          }
        );

        // Process the payout (including for negative scores if they rank in top 100)
        if (payoutAmount > 0) {
          // Update earnings in signed up users collection
          await updateSignedupUserEarnings(assignment.userId, payoutAmount);

          // Create earning record
          await createEarningRecord(assignment.userId, payoutAmount, tournamentId, tier);
          earningRecords++;

          payouts.push({
            userId: assignment.userId,
            amount: payoutAmount,
            score: assignment.TournamentScore || 0
          });

          totalPayout += payoutAmount;
          console.log(`✅ Successfully processed payout for user ${assignment.userId}: $${payoutAmount} (Score: ${assignment.TournamentScore})`);
        } else {
          console.log(`ℹ️ User ${assignment.userId} marked as completed with $0 payout for rank ${rank}`);
        }

        successCount++;
      } catch (error) {
        console.error(`❌ Failed to process payout for user ${sortedAssignments[i].userId}:`, error);
        errors.push(`Failed to process payout for user ${sortedAssignments[i].userId}: ${error}`);
        failedCount++;
      }
    }

    // Process users without scores - mark them as completed but no payouts
    console.log(`Processing ${usersWithoutScores.length} users without scores (marking as completed, no payouts)`);
    for (const assignment of usersWithoutScores) {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          assignment.$id!,
          {
            earnings: 0,
            AccessStatus: "Completed"
          }
        );
        console.log(`ℹ️ User ${assignment.userId} marked as completed (no score, no payout)`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to mark user ${assignment.userId} as completed:`, error);
        errors.push(`Failed to mark user ${assignment.userId} as completed: ${error}`);
        failedCount++;
      }
    }

    console.log(`Payout distribution completed for tournament ${tournamentId}:`);
    console.log(`- Total users processed: ${successCount}`);
    console.log(`- Failed: ${failedCount}`);
    console.log(`- Users with payouts: ${payouts.length}`);
    console.log(`- Total Payout: $${totalPayout}`);
    console.log(`- Earning Records Created: ${earningRecords}`);
    console.log(`- Users with scores: ${usersWithScores.length}`);
    console.log(`- Users without scores: ${usersWithoutScores.length}`);

    return {
      success: successCount,
      failed: failedCount,
      totalPayout,
      errors,
      payouts,
      earningRecords,
      usersWithScores: usersWithScores.length,
      usersWithoutScores: usersWithoutScores.length
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
console.log(request);

    const currentDate = new Date();

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
    const totalErrors: string[] = [];

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

// GET method for cron service to process tournaments
export async function GET(request: NextRequest) {
  try {
    console.log("Starting tournament end date check and cleanup via GET (cron)...");
    console.log(request);

    const currentDate = new Date();

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
    const totalErrors: string[] = [];

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
      message: `Tournament end date check completed via cron. Processed and completely deleted ${totalProcessed} tournaments.`,
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