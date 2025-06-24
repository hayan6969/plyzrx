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
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || '';
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

interface Signedupusers {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number;
  username: string;
  email: string;
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

    // Fetch user data from the signed up users collection (for wins, losses, amount, etc.)
    const signedUpUserResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (signedUpUserResult.documents.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          message: `No user found with ID: ${userId}`
        },
        { status: 404 }
      );
    }

    // Fetch tier data from the users collection
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Fetch tournament assignments for the user
    const tournamentAssignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Get the documents
    const signedUpUserData = signedUpUserResult.documents[0] as unknown as Signedupusers;
    const userData = userResult.documents.length > 0 ? userResult.documents[0] as unknown as UserData : null;
    const tournamentAssignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

    // Check if user has tournament assignments
    if (tournamentAssignments.length === 0) {
      const formattedUserData = {
        id: signedUpUserData.$id,
        userId: signedUpUserData.userId,
        username: signedUpUserData.username,
        email: signedUpUserData.email,
        tiers: {
          tier1: userData?.tier1 || false,
          tier2: userData?.tier2 || false,
          tier3: userData?.tier3 || false
        },
        gameStats: {
          tournamentScore: 0,
          wins: signedUpUserData.wins,
          losses: signedUpUserData.loss,
          earnings: signedUpUserData.amount,
          winRate: signedUpUserData.wins && signedUpUserData.loss ? 
            Math.round((signedUpUserData.wins / (signedUpUserData.wins + signedUpUserData.loss)) * 100) : 0
        },
        tournamentAssignments: {
          total: 0,
          message: 'User not assigned to any tournaments',
          active: [],
          awaiting: [],
          completed: [],
          expired: [],
          allAssignments: []
        },
        metadata: {
          createdAt: signedUpUserData.$createdAt,
          updatedAt: signedUpUserData.$updatedAt
        }
      };

      return NextResponse.json({
        success: true,
        message: 'User data retrieved successfully - No tournament assignments found',
        userId: signedUpUserData.userId,
        username: signedUpUserData.username,
        data: formattedUserData
      });
    }

    // Calculate total tournament score from tournament assignments (can be negative)
    const totalTournamentScore = tournamentAssignments.reduce((sum, assignment) => sum + (assignment.TournamentScore ?? 0), 0);

    // Separate assignments by status
    const activeAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Active');
    const awaitingAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Awaiting');
    const completedAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Completed');
    const expiredAssignments = tournamentAssignments.filter(assignment => assignment.AccessStatus === 'Expired');

    // Format the response with all user data
    const formattedUserData = {
      id: signedUpUserData.$id,
      userId: signedUpUserData.userId,
      username: signedUpUserData.username,
      email: signedUpUserData.email,
      tiers: {
        tier1: userData?.tier1 || false,
        tier2: userData?.tier2 || false,
        tier3: userData?.tier3 || false
      },
      gameStats: {
        tournamentScore: totalTournamentScore,
        wins: signedUpUserData.wins,
        losses: signedUpUserData.loss,
        earnings: signedUpUserData.amount,
        winRate: signedUpUserData.wins && signedUpUserData.loss ? 
          Math.round((signedUpUserData.wins / (signedUpUserData.wins + signedUpUserData.loss)) * 100) : 0
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
          tournamentScore: assignment.TournamentScore ?? 0,
          wins: assignment.wins ?? 0,
          losses: assignment.loss ?? 0
        })),
        awaiting: awaitingAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore ?? 0,
          wins: assignment.wins ?? 0,
          losses: assignment.loss ?? 0
        })),
        completed: completedAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore ?? 0,
          wins: assignment.wins ?? 0,
          losses: assignment.loss ?? 0
        })),
        expired: expiredAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore ?? 0,
          wins: assignment.wins ?? 0,
          losses: assignment.loss ?? 0
        })),
        allAssignments: tournamentAssignments.map(assignment => ({
          id: assignment.$id,
          tournamentId: assignment.tournamentId,
          tier: assignment.tier,
          assignedAt: assignment.assignedAt,
          paymentId: assignment.PaymentId,
          status: assignment.AccessStatus,
          tournamentScore: assignment.TournamentScore ?? 0,
          wins: assignment.wins ?? 0,
          losses: assignment.loss ?? 0
        }))
      },
      metadata: {
        createdAt: signedUpUserData.$createdAt,
        updatedAt: signedUpUserData.$updatedAt
      }
    };

    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      userId: signedUpUserData.userId,
      username: signedUpUserData.username,
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
