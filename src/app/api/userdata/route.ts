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
const PAYMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_COLLECTION || '';

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

interface PaymentRequest {
  $id?: string;
  userId: string;
  paymentValue: number;
  paypalAccount?: string;
  RequestedAt: string;
  Status: 'pending' | 'completed' | 'rejected';
  $createdAt?: string;
  $updatedAt?: string;
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



    // Fetch tier data from the users collection - try with trimmed userId
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId.trim())]
    );

    // If still not found, try searching for userId with newline
    if (userResult.documents.length === 0) {
      console.log('Trying with newline character...');
      const userResultWithNewline = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", userId + '\n')]
      );
      
      if (userResultWithNewline.documents.length > 0) {
        console.log('Found user with newline character');
        // Use this result instead
        Object.assign(userResult, userResultWithNewline);
      }
    }

    // Enhanced debugging
    console.log('User tier query result:', {
      documentsCount: userResult.documents.length,
      documents: userResult.documents,
      total: userResult.total
    });

    // Try alternative queries to debug
    console.log('Attempting to list all documents in users collection (first 10):');
    const allUsersResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.limit(10)]
    );
    console.log('All users sample:', allUsersResult.documents.map(doc => ({ 
      id: doc.$id, 
      userId: doc.userId,
      userIdType: typeof doc.userId 
    })));

    // Try query with string conversion
    console.log('Trying with string conversion:');
    const userResultString = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", String(userId))]
    );
    console.log('String query result count:', userResultString.documents.length);

    // Debug: Log what we got from the users collection
    console.log('User tier query result:', {
      documentsCount: userResult.documents.length,
      documents: userResult.documents
    });

    // Fetch tournament assignments for the user
    const tournamentAssignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Fetch payment/withdrawal requests for the user
    const paymentRequestsResult = await databases.listDocuments(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt")
      ]
    );

    // Get the documents
    const signedUpUserData = signedUpUserResult.documents[0] as unknown as Signedupusers;
    const userData = userResult.documents.length > 0 ? userResult.documents[0] as unknown as UserData : null;
    
    // Debug: Log the actual userData
    console.log('Parsed userData:', userData);
    
    const tournamentAssignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];
    const paymentRequests = paymentRequestsResult.documents as unknown as PaymentRequest[];

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
          earnings: signedUpUserData.amount, // Earnings from signedup collection
          winRate: signedUpUserData.wins && signedUpUserData.loss ? 
            Math.round((signedUpUserData.wins / (signedUpUserData.wins + signedUpUserData.loss)) * 100) : 0
        },
        financialData: {
          totalEarnings: signedUpUserData.amount,
          availableBalance: signedUpUserData.amount,
          withdrawalRequests: {
            total: paymentRequests.length,
            pending: paymentRequests.filter(req => req.Status === 'pending').length,
            completed: paymentRequests.filter(req => req.Status === 'completed').length,
            rejected: paymentRequests.filter(req => req.Status === 'rejected').length,
            requests: paymentRequests.map(request => ({
              id: request.$id,
              amount: request.paymentValue,
              paypalAccount: request.paypalAccount,
              status: request.Status,
              requestedAt: request.RequestedAt,
              createdAt: request.$createdAt,
              updatedAt: request.$updatedAt
            }))
          }
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
        earnings: signedUpUserData.amount, // Earnings from signedup collection
        winRate: signedUpUserData.wins && signedUpUserData.loss ? 
          Math.round((signedUpUserData.wins / (signedUpUserData.wins + signedUpUserData.loss)) * 100) : 0
      },
      financialData: {
        totalEarnings: signedUpUserData.amount,
        availableBalance: signedUpUserData.amount,
        withdrawalRequests: {
          total: paymentRequests.length,
          pending: paymentRequests.filter(req => req.Status === 'pending').length,
          completed: paymentRequests.filter(req => req.Status === 'completed').length,
          rejected: paymentRequests.filter(req => req.Status === 'rejected').length,
          hasWithdrawalRequests: paymentRequests.length > 0,
          latestRequest: paymentRequests.length > 0 ? {
            id: paymentRequests[0].$id,
            amount: paymentRequests[0].paymentValue,
            status: paymentRequests[0].Status,
            requestedAt: paymentRequests[0].RequestedAt
          } : null,
          requests: paymentRequests.map(request => ({
            id: request.$id,
            amount: request.paymentValue,
            paypalAccount: request.paypalAccount,
            status: request.Status,
            requestedAt: request.RequestedAt,
            createdAt: request.$createdAt,
            updatedAt: request.$updatedAt
          }))
        }
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
