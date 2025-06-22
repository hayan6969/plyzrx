import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '';
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || '';

interface UserData {
  $id?: string;
  userId: string;
  tier1?: boolean;
  tier2?: boolean;
  tier3?: boolean;
  $createdAt?: string;
  $updatedAt?: string;
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

    // Fetch user data from the users collection
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          message: `No user found with ID: ${userId}`
        },
        { status: 404 }
      );
    }

    // Fetch tournament assignments for the user (contains scores, wins, losses)
    const tournamentAssignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Get the user document
    const userData = userResult.documents[0] as unknown as UserData;
    const tournamentAssignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

    // Calculate total game stats from tournament assignments
    const totalWins = tournamentAssignments.reduce((sum, assignment) => sum + (assignment.wins || 0), 0);
    const totalLosses = tournamentAssignments.reduce((sum, assignment) => sum + (assignment.loss || 0), 0);
    const totalTournamentScore = tournamentAssignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);

    // Separate assignments by status
    const activeAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Active');
    const awaitingAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Awaiting');
    const completedAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Completed');
    const expiredAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Expired');

    // Format the response with all user data including tournament assignments
    const formattedUserData = {
      id: userData.$id,
      userId: userData.userId,
      tiers: {
        tier1: userData.tier1 || false,
        tier2: userData.tier2 || false,
        tier3: userData.tier3 || false
      },
      gameStats: {
        tournamentScore: totalTournamentScore,
        wins: totalWins,
        losses: totalLosses,
        winRate: totalWins && totalLosses ? 
          Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0
      },
      tournamentAssignments: {
        total: tournamentAssignments.length,
        active: activeAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore || 0,
          wins: assignment.wins || 0,
          losses: assignment.loss || 0
        })),
        awaiting: awaitingAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore || 0,
          wins: assignment.wins || 0,
          losses: assignment.loss || 0
        })),
        completed: completedAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore || 0,
          wins: assignment.wins || 0,
          losses: assignment.loss || 0
        })),
        expired: expiredAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore || 0,
          wins: assignment.wins || 0,
          losses: assignment.loss || 0
        })),
        allAssignments: tournamentAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore || 0,
          wins: assignment.wins || 0,
          losses: assignment.loss || 0
        }))
      },
      metadata: {
        createdAt: userData.$createdAt,
        updatedAt: userData.$updatedAt
      }
    };

    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      data: formattedUserData
    });

  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
