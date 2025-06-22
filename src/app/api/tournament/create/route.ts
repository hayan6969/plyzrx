import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from "appwrite";

// Server-side Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "";
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || "";
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || "";

interface UserTier {
  $id?: string;
  userId: string;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
}

interface TournamentControl {
  $id?: string;
  tournamentId: string;
  name: string;
  tier: 1 | 2 | 3;
  isManualMode: boolean;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
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
  AccessStatus: 'Awaiting' | 'Active' | 'Completed' | "Expired";
}

// Server-side functions
const getUserTierServer = async (userId: string): Promise<UserTier | null> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as UserTier;
  } catch (error) {
    console.error("Failed to fetch user tier:", error);
    return null;
  }
};

const getScheduledTournamentsByTierServer = async (tier: 1 | 2 | 3): Promise<TournamentControl[]> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal("tier", tier),
        Query.equal("status", "scheduled")
      ]
    );

    return result.documents.map((doc) => ({
      ...doc,
      scheduledStartDate: new Date(doc.scheduledStartDate),
      scheduledEndDate: new Date(doc.scheduledEndDate),
      actualStartDate: doc.actualStartDate ? new Date(doc.actualStartDate) : undefined,
      actualEndDate: doc.actualEndDate ? new Date(doc.actualEndDate) : undefined,
    })) as unknown as TournamentControl[];
  } catch (error) {
    console.error("Failed to fetch scheduled tournaments by tier:", error);
    return [];
  }
};

const getUserTournamentAssignmentServer = async (userId: string): Promise<TournamentAssignment | null> => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as TournamentAssignment;
  } catch (error) {
    console.error("Failed to fetch user tournament assignment:", error);
    return null;
  }
};

const assignUserToTournamentServer = async (userId: string, transactionId?: string): Promise<TournamentAssignment | null> => {
  try {
    // Get user tier information
    const userTier = await getUserTierServer(userId);
    if (!userTier) {
      throw new Error("User tier not found");
    }

    // Determine user's highest tier - return as string
    let tier: '1' | '2' | '3';
    if (userTier.tier3) {
      tier = '3';
    } else if (userTier.tier2) {
      tier = '2';
    } else if (userTier.tier1) {
      tier = '1';
    } else {
      throw new Error("User has no active tier");
    }

    // Check if user already has an assignment
    const existingAssignment = await getUserTournamentAssignmentServer(userId);

    // If already assigned and active, do not reassign
    if (existingAssignment && existingAssignment.AccessStatus === 'Active') {
      throw new Error("User is already assigned to an active tournament");
    }

    // Find scheduled tournaments for the user's tier
    const scheduledTournaments = await getScheduledTournamentsByTierServer(parseInt(tier) as 1 | 2 | 3);

    if (scheduledTournaments.length > 0) {
      const tournamentToAssign = scheduledTournaments[0];

      // If user has an awaiting assignment, update it
      if (existingAssignment && existingAssignment.AccessStatus === 'Awaiting') {
        const updated = await databases.updateDocument(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          existingAssignment.$id!,
          {
            tournamentId: tournamentToAssign.tournamentId,
            assignedAt: new Date().toISOString(),
            tier,
            PaymentId: transactionId,
            AccessStatus: 'Active'
          }
        );
        return updated as unknown as TournamentAssignment;
      }

      // Otherwise, create a new assignment
      const assignmentData: TournamentAssignment = {
        userId,
        tournamentId: tournamentToAssign.tournamentId,
        assignedAt: new Date().toISOString(),
        tier,
        PaymentId: transactionId,
        AccessStatus: 'Active'
      };

      const result = await databases.createDocument(
        DATABASE_ID,
        TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
        ID.unique(),
        assignmentData
      );
      return result as unknown as TournamentAssignment;
    } else {
      // No tournament available, set tournamentId to empty and AccessStatus to Awaiting
      if (existingAssignment && existingAssignment.AccessStatus === 'Awaiting') {
        // Already awaiting, just return
        return existingAssignment;
      }

      const assignmentData: TournamentAssignment = {
        userId,
        tournamentId: "",
        assignedAt: new Date().toISOString(),
        tier,
        PaymentId: transactionId,
        AccessStatus: 'Awaiting'
      };

      const result = await databases.createDocument(
        DATABASE_ID,
        TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
        ID.unique(),
        assignmentData
      );
      return result as unknown as TournamentAssignment;
    }
  } catch (error) {
    console.error("Failed to assign user to tournament:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, paymentId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Assign user to tournament
    const assignment = await assignUserToTournamentServer(userId, paymentId);

    if (!assignment) {
      return NextResponse.json(
        { error: 'Failed to assign user to tournament' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User successfully assigned to tournament',
      data: assignment
    });

  } catch (error) {
    console.error('Tournament assignment API error:', error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process tournament assignment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to assign user to tournament.' },
    { status: 405 }
  );
}