import { Client, Databases, ID, Query } from "appwrite";

// Initialize Appwrite Client - this should only run on the client side
let client: Client;
let databases: Databases;

// Initialize the client only on the client side
if (typeof window !== "undefined") {
  client = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://cloud.appwrite.io/v1"
    )
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  databases = new Databases(client);
}

// Database and Collection IDs - replace with your actual IDs after creating them in Appwrite Console
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const PAYMENT_LOGS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_LOGS_COLLECTION_ID || "";
const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "";
const TOURNAMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_COLLECTION_ID || "";
const MATCH_LOGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCH_LOGS_COLLECTION_ID || "";
// Payment Logs Types
export interface PaymentLog {
  $id?: string;
  userId: string;
  username: string;
  dateTime: string;
  platform: string;
  paymentAmount: number;
  paymentId: string;
}

// User Tier Types
export interface UserTier {
  $id?: string;
  userId: string;
  tier1: boolean;
  tier2: boolean;
  tier3: boolean;
}

export interface TournamentControl {
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

export interface MatchLog {
  $id?: string;
  Match_ID: string;
  Logs: string;
  createdAt?: string;
}

// Update the TournamentAssignment interface to use string for tier
// Update the TournamentAssignment interface to include earnings and rank
export interface TournamentAssignment {
  $id?: string;
  userId: string;
  tournamentId: string;
  assignedAt: string;
  tier: '1' | '2' | '3';
  PaymentId?: string;
  AccessStatus: 'Awaiting' | 'Active' | 'Completed' | "Expired";
  TournamentScore?: number;
  wins?: number;
  loss?: number;
  earnings?: number; // Add earnings field
  rank?: number; // Add rank field
}

export interface MatchAssignment{
  $id?: string;
  player1Id: string;
  player2Id: string;
  WinnerId: string;
  WinnerScore: string;
  tournamentid: string; // <-- should be string
  StartedAt: string;    // <-- should be string (ISO)
}



// Report interface
export interface Report {
  $id?: string;
  reporteduser: string;
  reportedBy: string;
  matchId: string;
  matchLog: string;
  createdAt: string;
  Status:string
}


export interface BanUser {
  $id?:string,
  reportedId:string
}

// Add collection ID for tournament assignments
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = 
  process.env.NEXT_PUBLIC_APPWRITE_USER || "";

// Add collection ID for match assignments
const MATCH_ASSIGNMENTS_COLLECTION_ID = 
  process.env.NEXT_PUBLIC_APPWRITE_MATCH_ASSIGNMENTS_COLLECTION_ID || "";

// Add collection ID for reports
const REPORT_COLLECTION_ID = 
  process.env.NEXT_PUBLIC_APPWRITE_REPORT_LOG_COLLECTION || "";

  const BanUsers=
process.env.NEXT_PUBLIC_APPWRITE_BAN_USERS_COLLECTION_ID || ""

// Add collection ID for signed up users
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

// Payment Logs Functions
export const createPaymentLog = async (
  paymentLog: PaymentLog
): Promise<PaymentLog> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create payment log from server side");
    }

    // Convert payment amount to cents (integer) for Appwrite
    const paymentLogForAppwrite = {
      ...paymentLog,
      paymentAmount: Math.round(paymentLog.paymentAmount * 100), // Convert to cents
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      PAYMENT_LOGS_COLLECTION_ID,
      ID.unique(),
      paymentLogForAppwrite
    );

    // Convert back to dollars for the returned object
    return {
      ...result,
      paymentAmount: (result as any).paymentAmount / 100,
    } as unknown as PaymentLog;
  } catch (error) {
    console.error("Failed to create payment log:", error);
    throw error;
  }
};

export const getPaymentLogs = async (): Promise<PaymentLog[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch payment logs from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      PAYMENT_LOGS_COLLECTION_ID
    );

    // Convert payment amounts from cents back to dollars
    return result.documents.map((doc) => ({
      ...doc,
      paymentAmount: doc.paymentAmount / 100,
    })) as unknown as PaymentLog[];
  } catch (error) {
    console.error("Failed to fetch payment logs:", error);
    return [];
  }
};

// User Tier Functions
export const getUserTier = async (userId: string): Promise<UserTier | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user tier from server side");
    }

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

export const createOrUpdateUserTier = async (
  userTier: UserTier
): Promise<UserTier> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create/update user tier from server side");
    }

    // Check if user already exists
    const existingUser = await getUserTier(userTier.userId);

    if (existingUser) {
      // Update existing user
      const result = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        existingUser.$id as string,
        userTier
      );
      return result as unknown as UserTier;
    } else {
      // Create new user
      const result = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userTier
      );
      return result as unknown as UserTier;
    }
  } catch (error) {
    console.error("Failed to create/update user tier:", error);
    throw error;
  }
};

export const getAllUserTiers = async (): Promise<UserTier[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user tiers from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID
    );

    return result.documents as unknown as UserTier[];
  } catch (error) {
    console.error("Failed to fetch user tiers:", error);
    return [];
  }
};

// Tournament Functions
export const createTournament = async (
  tournamentData: TournamentControl
): Promise<TournamentControl> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create tournament from server side");
    }

    // Convert Date objects to ISO strings for Appwrite storage
    const tournamentForAppwrite = {
      ...tournamentData,
      scheduledStartDate: tournamentData.scheduledStartDate.toISOString(),
      scheduledEndDate: tournamentData.scheduledEndDate.toISOString(),
      actualStartDate: tournamentData.actualStartDate?.toISOString(),
      actualEndDate: tournamentData.actualEndDate?.toISOString(),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      ID.unique(),
      tournamentForAppwrite
    );

    // Convert back to Date objects for the returned object
    return {
      ...result,
      scheduledStartDate: new Date(result.scheduledStartDate),
      scheduledEndDate: new Date(result.scheduledEndDate),
      actualStartDate: result.actualStartDate ? new Date(result.actualStartDate) : undefined,
      actualEndDate: result.actualEndDate ? new Date(result.actualEndDate) : undefined,
    } as unknown as TournamentControl;
  } catch (error) {
    console.error("Failed to create tournament:", error);
    throw error;
  }
};

export const updateTournament = async (
  tournamentId: string,
  tournamentData: Partial<TournamentControl>
): Promise<TournamentControl> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update tournament from server side");
    }

    // Convert Date objects to ISO strings for Appwrite storage
    const updateData: any = { ...tournamentData };
    
    if (tournamentData.scheduledStartDate) {
      updateData.scheduledStartDate = tournamentData.scheduledStartDate.toISOString();
    }
    if (tournamentData.scheduledEndDate) {
      updateData.scheduledEndDate = tournamentData.scheduledEndDate.toISOString();
    }
    if (tournamentData.actualStartDate) {
      updateData.actualStartDate = tournamentData.actualStartDate.toISOString();
    }
    if (tournamentData.actualEndDate) {
      updateData.actualEndDate = tournamentData.actualEndDate.toISOString();
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      tournamentId,
      updateData
    );

    // Convert back to Date objects for the returned object
    return {
      ...result,
      scheduledStartDate: new Date(result.scheduledStartDate),
      scheduledEndDate: new Date(result.scheduledEndDate),
      actualStartDate: result.actualStartDate ? new Date(result.actualStartDate) : undefined,
      actualEndDate: result.actualEndDate ? new Date(result.actualEndDate) : undefined,
    } as unknown as TournamentControl;
  } catch (error) {
    console.error("Failed to update tournament:", error);
    throw error;
  }
};

export const getTournament = async (
  tournamentId: string
): Promise<TournamentControl | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournament from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [Query.equal("tournamentId", tournamentId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    const doc = result.documents[0];
    return {
      ...doc,
      scheduledStartDate: new Date(doc.scheduledStartDate),
      scheduledEndDate: new Date(doc.scheduledEndDate),
      actualStartDate: doc.actualStartDate ? new Date(doc.actualStartDate) : undefined,
      actualEndDate: doc.actualEndDate ? new Date(doc.actualEndDate) : undefined,
    } as unknown as TournamentControl;
  } catch (error) {
    console.error("Failed to fetch tournament:", error);
    return null;
  }
};

export const getAllTournaments = async (): Promise<TournamentControl[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournaments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID
    );

    return result.documents.map((doc) => ({
      ...doc,
      scheduledStartDate: new Date(doc.scheduledStartDate),
      scheduledEndDate: new Date(doc.scheduledEndDate),
      actualStartDate: doc.actualStartDate ? new Date(doc.actualStartDate) : undefined,
      actualEndDate: doc.actualEndDate ? new Date(doc.actualEndDate) : undefined,
    })) as unknown as TournamentControl[];
  } catch (error) {
    console.error("Failed to fetch tournaments:", error);
    return [];
  }
};

export const deleteTournament = async (tournamentId: string): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot delete tournament from server side");
    }

    await databases.deleteDocument(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      tournamentId
    );

    return true;
  } catch (error) {
    console.error("Failed to delete tournament:", error);
    return false;
  }
};

// Specific tournament status update functions
export const startTournament = async (
  tournamentId: string,
  adminId: string
): Promise<TournamentControl | null> => {
  try {
    const tournament = await getTournament(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }

    // Check if there's already an active tournament in this tier
    const activeTournaments = await getActiveTournamentsByTier(tournament.tier);
    if (activeTournaments.length > 0) {
      throw new Error(`Cannot start tournament. There is already an active Tier ${tournament.tier} tournament: ${activeTournaments[0].name} (${activeTournaments[0].tournamentId})`);
    }

    return await updateTournament(tournament.$id!, {
      actualStartDate: new Date(),
      status: 'active',
      lastModifiedBy: adminId,
    });
  } catch (error) {
    console.error("Failed to start tournament:", error);
    throw error;
  }
};

export const endTournament = async (
  tournamentId: string,
  adminId: string
): Promise<TournamentControl | null> => {
  try {
    const tournament = await getTournament(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }

    return await updateTournament(tournament.$id!, {
      actualEndDate: new Date(),
      status: 'ended',
      lastModifiedBy: adminId,
    });
  } catch (error) {
    console.error("Failed to end tournament:", error);
    throw error;
  }
};







export const getMatchLog = async (matchId: string): Promise<MatchLog | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch match log from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      MATCH_LOGS_COLLECTION_ID,
      [Query.equal("Match_ID", matchId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as MatchLog;
  } catch (error) {
    console.error("Failed to fetch match log:", error);
    return null;
  }
};

export const getAllMatchLogs = async (): Promise<MatchLog[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch match logs from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      MATCH_LOGS_COLLECTION_ID
    );

    return result.documents as unknown as MatchLog[];
  } catch (error) {
    console.error("Failed to fetch match logs:", error);
    return [];
  }
};

// Tournament Assignment Functions
export const assignUserToTournament = async (
  userId: string,
  transactionId?: string
): Promise<TournamentAssignment | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot assign user to tournament from server side");
    }

    // Get user tier information
    const userTier = await getUserTier(userId);
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
    const existingAssignment = await getUserTournamentAssignment(userId);

    // If already assigned and active, do not reassign
    if (existingAssignment && existingAssignment.AccessStatus === 'Active') {
      throw new Error("User is already assigned to an active tournament");
    }

    // Find scheduled tournaments for the user's tier
    const scheduledTournaments = await getScheduledTournamentsByTier(parseInt(tier) as 1 | 2 | 3);

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
      // No tournament available, set tournamentId to null/empty and AccessStatus to Awaiting
      if (existingAssignment && existingAssignment.AccessStatus === 'Awaiting') {
        // Already awaiting, just return
        return existingAssignment;
      }

      const assignmentData: TournamentAssignment = {
        userId,
        tournamentId: "", // or null if your schema allows
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

export const getScheduledTournamentsByTier = async (
  tier: 1 | 2 | 3
): Promise<TournamentControl[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournaments from server side");
    }

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

export const getUserTournamentAssignment = async (
  userId: string
): Promise<TournamentAssignment | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user tournament assignment from server side");
    }

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

export const getTournamentAssignments = async (
  tournamentId: string
): Promise<TournamentAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournament assignments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("tournamentId", tournamentId)]
    );

    return result.documents as unknown as TournamentAssignment[];
  } catch (error) {
    console.error("Failed to fetch tournament assignments:", error);
    return [];
  }
};

// Update the updateTournamentAssignmentStatus function to use correct field name
export const updateTournamentAssignmentStatus = async (
  assignmentId: string,
  status: 'assigned' | 'participating' | 'completed'
): Promise<TournamentAssignment> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update tournament assignment from server side");
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      assignmentId,
      { AccessStatus: status } // Use AccessStatus instead of status
    );

    return result as unknown as TournamentAssignment;
  } catch (error) {
    console.error("Failed to update tournament assignment status:", error);
    throw error;
  }
};

export const getUserTournamentHistory = async (
  userId: string
): Promise<TournamentAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user tournament history from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return result.documents as unknown as TournamentAssignment[];
  } catch (error) {
    console.error("Failed to fetch user tournament history:", error);
    return [];
  }
};

// Auto-assign users to tournaments based on their payment
export const autoAssignUserFromPayment = async (
  paymentLog: PaymentLog
): Promise<TournamentAssignment | null> => {
  try {
    return await assignUserToTournament(paymentLog.userId, paymentLog.paymentId);
  } catch (error) {
    console.error("Failed to auto-assign user from payment:", error);
    return null;
  }
};

// Add function to get all tournament assignments
export const getAllTournamentAssignments = async (): Promise<TournamentAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournament assignments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID
    );

    return result.documents as unknown as TournamentAssignment[];
  } catch (error) {
    console.error("Failed to fetch all tournament assignments:", error);
    return [];
  }
};

// Add function to get assignments by status
export const getTournamentAssignmentsByStatus = async (
  status: 'Awaiting' | 'Active' | 'Completed' | 'Expired'
): Promise<TournamentAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournament assignments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("AccessStatus", status)]
    );

    return result.documents as unknown as TournamentAssignment[];
  } catch (error) {
    console.error("Failed to fetch tournament assignments by status:", error);
    return [];
  }
};

// Add function to bulk assign awaiting users to tournaments
export const bulkAssignAwaitingUsers = async (): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot bulk assign users from server side");
    }

    const awaitingUsers = await getTournamentAssignmentsByStatus('Awaiting');
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const assignment of awaitingUsers) {
      try {
        // Get available tournaments for this user's tier
        const scheduledTournaments = await getScheduledTournamentsByTier(parseInt(assignment.tier) as 1 | 2 | 3);
        
        if (scheduledTournaments.length > 0) {
          const tournamentToAssign = scheduledTournaments[0];
          
          // Update the awaiting assignment to active
          await databases.updateDocument(
            DATABASE_ID,
            TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
            assignment.$id!,
            {
              tournamentId: tournamentToAssign.tournamentId,
              assignedAt: new Date().toISOString(),
              AccessStatus: 'Active'
            }
          );
          
          successCount++;
        } else {
          // No tournament available for this tier
          errors.push(`No tournament available for user ${assignment.userId} (Tier ${assignment.tier})`);
          failedCount++;
        }
      } catch (error) {
        errors.push(`Failed to assign user ${assignment.userId}: ${error}`);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount, errors };
  } catch (error) {
    console.error("Failed to bulk assign awaiting users:", error);
    throw error;
  }
};

// Match Assignment Functions
export const createMatchAssignment = async (
  matchData: MatchAssignment
): Promise<MatchAssignment> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create match assignment from server side");
    }

    const result = await databases.createDocument(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID,
      ID.unique(),
      matchData
    );

    return result as unknown as MatchAssignment;
  } catch (error) {
    console.error("Failed to create match assignment:", error);
    throw error;
  }
};

export const getAllMatchAssignments = async (): Promise<MatchAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch match assignments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID
    );

    return result.documents as unknown as MatchAssignment[];
  } catch (error) {
    console.error("Failed to fetch match assignments:", error);
    return [];
  }
};

export const updateMatchAssignment = async (
  matchId: string,
  updateData: Partial<MatchAssignment>
): Promise<MatchAssignment> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update match assignment from server side");
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      MATCH_ASSIGNMENTS_COLLECTION_ID,
      matchId,
      updateData
    );

    return result as unknown as MatchAssignment;
  } catch (error) {
    console.error("Failed to update match assignment:", error);
    throw error;
  }
};

// Get active users by tier for match creation
export const getActiveUsersByTier = async (tier: '1' | '2' | '3'): Promise<TournamentAssignment[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch active users from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [
        Query.equal("tier", tier),
        Query.equal("AccessStatus", "Active")
      ]
    );

    return result.documents as unknown as TournamentAssignment[];
  } catch (error) {
    console.error("Failed to fetch active users by tier:", error);
    return [];
  }
};

// Create automatic matches for a specific tier
export const createAutomaticMatches = async (tier: '1' | '2' | '3'): Promise<{
  success: number;
  failed: number;
  matches: MatchAssignment[];
  errors: string[];
}> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot create automatic matches from server side");
    }

    const activeUsers = await getActiveUsersByTier(tier);
    
    if (activeUsers.length < 2) {
      return {
        success: 0,
        failed: 0,
        matches: [],
        errors: [`Not enough active users in Tier ${tier} to create matches (minimum 2 required)`]
      };
    }

    // Shuffle the users array for random pairing
    const shuffledUsers = [...activeUsers].sort(() => Math.random() - 0.5);
    const matches: MatchAssignment[] = [];
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    // Create matches by pairing users
    for (let i = 0; i < shuffledUsers.length - 1; i += 2) {
      try {
        const player1 = shuffledUsers[i];
        const player2 = shuffledUsers[i + 1];

        const matchData: MatchAssignment = {
          player1Id: player1.userId,
          player2Id: player2.userId,
          WinnerId: "", // Empty until match is completed
          WinnerScore: "", // Empty until match is completed
          tournamentid: player1.tournamentId, // Use tournament ID from player assignment
          StartedAt: new Date().toISOString() // Set current timestamp as start time
        };

        const createdMatch = await createMatchAssignment(matchData);
        matches.push(createdMatch);
        successCount++;
      } catch (error) {
        errors.push(`Failed to create match for users ${shuffledUsers[i].userId} vs ${shuffledUsers[i + 1].userId}: ${error}`);
        failedCount++;
      }
    }

    // If there's an odd number of users, the last one gets a bye
    if (shuffledUsers.length % 2 !== 0) {
      errors.push(`User ${shuffledUsers[shuffledUsers.length - 1].userId} gets a bye (odd number of players)`);
    }

    return {
      success: successCount,
      failed: failedCount,
      matches,
      errors
    };
  } catch (error) {
    console.error("Failed to create automatic matches:", error);
    throw error;
  }
};

// Generate unique match ID
export const generateMatchId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `MATCH_${timestamp}_${random}`;
};

// Report Functions
export const getAllReports = async (): Promise<Report[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch reports from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      REPORT_COLLECTION_ID
    );

    return result.documents as unknown as Report[];
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return [];
  }
};

export const getReportById = async (reportId: string): Promise<Report | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch report from server side");
    }

    const result = await databases.getDocument(
      DATABASE_ID,
      REPORT_COLLECTION_ID,
      reportId
    );

    return result as unknown as Report;
  } catch (error) {
    console.error("Failed to fetch report:", error);
    return null;
  }
};

export const updateReportStatus = async (
  reportId: string,
  status: string
): Promise<Report> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update report from server side");
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      REPORT_COLLECTION_ID,
      reportId,
      { Status: status }
    );

    return result as unknown as Report;
  } catch (error) {
    console.error("Failed to update report status:", error);
    throw error;
  }
};

// Ban User Functions
export const createBanUser = async (
  reportedUserId: string
): Promise<BanUser> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot ban user from server side");
    }

    // Check if user is already banned
    const existingBan = await getBanUserById(reportedUserId);
    if (existingBan) {
      throw new Error("User is already banned");
    }

    const banData: BanUser = {
      reportedId: reportedUserId
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      BanUsers,
      ID.unique(),
      banData
    );

    return result as unknown as BanUser;
  } catch (error) {
    console.error("Failed to ban user:", error);
    throw error;
  }
};

export const getAllBannedUsers = async (): Promise<BanUser[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch banned users from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      BanUsers
    );

    return result.documents as unknown as BanUser[];
  } catch (error) {
    console.error("Failed to fetch banned users:", error);
    return [];
  }
};

export const getBanUserById = async (reportedUserId: string): Promise<BanUser | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch ban user from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      BanUsers,
      [Query.equal("reportedId", reportedUserId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    return result.documents[0] as unknown as BanUser;
  } catch (error) {
    console.error("Failed to fetch ban user:", error);
    return null;
  }
};

export const unbanUser = async (banId: string): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot unban user from server side");
    }

    await databases.deleteDocument(
      DATABASE_ID,
      BanUsers,
      banId
    );

    return true;
  } catch (error) {
    console.error("Failed to unban user:", error);
    return false;
  }
};

export const isUserBanned = async (userId: string): Promise<boolean> => {
  try {
    const bannedUser = await getBanUserById(userId);
    return bannedUser !== null;
  } catch (error) {
    console.error("Failed to check if user is banned:", error);
    return false;
  }
};

// Add helper function to check for active tournaments in a tier
export const getActiveTournamentsByTier = async (tier: 1 | 2 | 3): Promise<TournamentControl[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch tournaments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_COLLECTION_ID,
      [
        Query.equal("tier", tier),
        Query.equal("status", "active")
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
    console.error("Failed to fetch active tournaments by tier:", error);
    return [];
  }
};

// Tournament payout configuration
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

// Function to calculate and distribute tournament payouts
export const distributeTournamentPayouts = async (
  tournamentId: string
): Promise<{
  success: number;
  failed: number;
  totalPayout: number;
  errors: string[];
  payouts: Array<{ userId: string; amount: number; rank: number }>;
}> => {
  try {
    // Get all assignments for this tournament
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [
        Query.equal("tournamentId", tournamentId),
        Query.equal("AccessStatus", "Active")
      ]
    );

    const assignments = result.documents as unknown as TournamentAssignment[];

    if (assignments.length === 0) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: ["No active tournament assignments found for this tournament"],
        payouts: []
      };
    }

    // Get tournament details to determine tier
    const tournament = await getTournament(tournamentId);
    if (!tournament) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: ["Tournament not found"],
        payouts: []
      };
    }

    // Sort assignments by TournamentScore (descending order)
    const sortedAssignments = assignments
      .filter(assignment => assignment.TournamentScore !== undefined)
      .sort((a, b) => (b.TournamentScore || 0) - (a.TournamentScore || 0));

    if (sortedAssignments.length === 0) {
      return {
        success: 0,
        failed: 0,
        totalPayout: 0,
        errors: ["No tournament scores found for ranking"],
        payouts: []
      };
    }

    // Get payout amounts based on tier
    const tierKey = `tier${tournament.tier}` as keyof typeof PAYOUT_AMOUNTS;
    const payoutConfig = PAYOUT_AMOUNTS[tierKey];

    let successCount = 0;
    let failedCount = 0;
    let totalPayout = 0;
    const errors: string[] = [];
    const payouts: Array<{ userId: string; amount: number; rank: number }> = [];

    // Calculate payouts for each player
    for (let i = 0; i < sortedAssignments.length && i < 100; i++) {
      try {
        const assignment = sortedAssignments[i];
        const rank = i + 1;
        let payoutAmount = 0;

        // Determine payout amount based on rank
        if (rank <= 10) {
          payoutAmount = payoutConfig.top10;
        } else if (rank <= 100) {
          payoutAmount = payoutConfig.remaining;
        }

        if (payoutAmount > 0) {
          // Update the assignment with earnings
          await databases.updateDocument(
            DATABASE_ID,
            TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
            assignment.$id!,
            {
              earnings: payoutAmount,
              rank: rank,
              AccessStatus: "Completed"
            }
          );

          // Update earnings in signed up users collection
          await updateSignedupUserStats(assignment.userId, { earnings: payoutAmount });

          payouts.push({
            userId: assignment.userId,
            amount: payoutAmount,
            rank: rank
          });

          totalPayout += payoutAmount;
          successCount++;
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
      payouts
    };
  } catch (error) {
    console.error("Failed to distribute tournament payouts:", error);
    throw error;
  }
};

// Function to get tournament leaderboard
export const getTournamentLeaderboard = async (
  tournamentId: string
): Promise<Array<{
  userId: string;
  score: number;
  rank: number;
  earnings?: number;
}>> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch leaderboard from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [
        Query.equal("tournamentId", tournamentId),
        Query.equal("AccessStatus", ["Active", "Completed"])
      ]
    );

    const assignments = result.documents as unknown as (TournamentAssignment & { earnings?: number; rank?: number })[];

    // Sort by score and assign ranks
    const sortedAssignments = assignments
      .filter(assignment => assignment.TournamentScore !== undefined)
      .sort((a, b) => (b.TournamentScore || 0) - (a.TournamentScore || 0))
      .map((assignment, index) => ({
        userId: assignment.userId,
        score: assignment.TournamentScore || 0,
        rank: index + 1,
        earnings: assignment.earnings || 0
      }));

    return sortedAssignments;
  } catch (error) {
    console.error("Failed to fetch tournament leaderboard:", error);
    return [];
  }
};

// Add interface for signed up users
export interface Signedupusers {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number; // Total earnings
  username: string;
  email: string;
}

// Function to update signed up user stats
export const updateSignedupUserStats = async (
  userId: string,
  updates: {
    wins?: number;
    losses?: number;
    earnings?: number;
  }
): Promise<void> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update signed up user from server side");
    }

    // Find the user in signed up collection
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
    const updateData: Partial<Signedupusers> = {};

    // Update wins (add to existing)
    if (updates.wins !== undefined) {
      updateData.wins = (user.wins || 0) + updates.wins;
    }

    // Update losses (add to existing)
    if (updates.losses !== undefined) {
      updateData.loss = (user.loss || 0) + updates.losses;
    }

    // Update earnings (add to existing total)
    if (updates.earnings !== undefined) {
      updateData.amount = (user.amount || 0) + updates.earnings;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        SIGNEDUP_COLLECTION_ID,
        user.$id!,
        updateData
      );
      
      console.log(`Updated signed up user ${userId}:`, updateData);
    }
  } catch (error) {
    console.error("Failed to update signed up user stats:", error);
    // Don't throw error to avoid breaking the main flow
  }
};
