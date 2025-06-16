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







// export const getMatchLog = async (matchId: string): Promise<MatchLog | null> => {
//   try {
//     if (typeof window === "undefined") {
//       throw new Error("Cannot fetch match log from server side");
//     }

//     const result = await databases.listDocuments(
//       DATABASE_ID,
//       MATCH_LOGS_COLLECTION_ID,
//       [Query.equal("Match_ID", matchId)]
//     );

//     if (result.documents.length === 0) {
//       return null;
//     }

//     return result.documents[0] as unknown as MatchLog;
//   } catch (error) {
//     console.error("Failed to fetch match log:", error);
//     return null;
//   }
// };