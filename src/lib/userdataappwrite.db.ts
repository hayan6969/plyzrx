import { Client, Databases, Query } from "appwrite";

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

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "";
const TOURNAMENT_ASSIGNMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER || "";
const PAYMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_COLLECTION || "";
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

// User interface matching your collection structure
export interface UserData {
  $id?: string;
  userId: string;
  tier1?: boolean;
  tier2?: boolean;
  tier3?: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

// Tournament Assignment interface for getting scores, wins, losses
export interface TournamentAssignment {
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

// Payment interface for payout requests - UPDATED to include PayPal account
export interface PaymentRequest {
  $id?: string;
  userId: string;
  paymentValue: number;
  paypalAccount?: string; // Added PayPal account field
  RequestedAt: string;
  Status: 'pending' | 'completed' | 'rejected';
  $createdAt?: string;
  $updatedAt?: string;
}

// Add Signedupusers interface
export interface Signedupusers {
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

// Combined user data with tournament stats
export interface UserWithStats extends UserData {
  tournamentStats: {
    totalScore: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    activeAssignments: number;
    completedAssignments: number;
  };
}

// Combined signed up user data with additional stats
export interface SignedupUserWithStats extends Signedupusers {
  tournamentStats: {
    totalScore: number;
    winRate: number;
    activeAssignments: number;
    completedAssignments: number;
  };
}

// Get all users from the users collection with tier data
export const getAllUsers = async (): Promise<UserWithStats[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch users from server side");
    }

    // Fetch users from the correct collection
    const usersResult = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID
    );

    const users = usersResult.documents as unknown as UserData[];
    const usersWithStats: UserWithStats[] = [];

    // For each user, fetch their tournament assignments to get stats
    for (const user of users) {
      try {
        const tournamentAssignmentsResult = await databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [Query.equal("userId", user.userId)]
        );

        const assignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

        // Calculate stats from tournament assignments
        const totalScore = assignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);
        const totalWins = assignments.reduce((sum, assignment) => sum + (assignment.wins || 0), 0);
        const totalLosses = assignments.reduce((sum, assignment) => sum + (assignment.loss || 0), 0);
        const winRate = totalWins && totalLosses ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
        const activeAssignments = assignments.filter(a => a.AccessStatus === 'Active').length;
        const completedAssignments = assignments.filter(a => a.AccessStatus === 'Completed').length;

        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore,
            totalWins,
            totalLosses,
            winRate,
            activeAssignments,
            completedAssignments
          }
        });
      } catch (error) {
        console.error(`Failed to fetch tournament stats for user ${user.userId}:`, error);
        // Add user with zero stats if tournament data fetch fails
        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore: 0,
            totalWins: 0,
            totalLosses: 0,
            winRate: 0,
            activeAssignments: 0,
            completedAssignments: 0
          }
        });
      }
    }

    return usersWithStats;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

// Get user by ID from users collection with tier data
export const getUserById = async (userId: string): Promise<UserWithStats | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    const user = result.documents[0] as unknown as UserData;

    // Fetch tournament assignments for this user
    const tournamentAssignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    const assignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

    // Calculate stats
    const totalScore = assignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);
    const totalWins = assignments.reduce((sum, assignment) => sum + (assignment.wins || 0), 0);
    const totalLosses = assignments.reduce((sum, assignment) => sum + (assignment.loss || 0), 0);
    const winRate = totalWins && totalLosses ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
    const activeAssignments = assignments.filter(a => a.AccessStatus === 'Active').length;
    const completedAssignments = assignments.filter(a => a.AccessStatus === 'Completed').length;

    return {
      ...user,
      tournamentStats: {
        totalScore,
        totalWins,
        totalLosses,
        winRate,
        activeAssignments,
        completedAssignments
      }
    };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

// Update user data in users collection
export const updateUserData = async (
  documentId: string,
  updateData: Partial<UserData>
): Promise<UserData> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update user from server side");
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      documentId,
      updateData
    );

    return result as unknown as UserData;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// Get users by tier
export const getUsersByTier = async (tier: 1 | 2 | 3): Promise<UserWithStats[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch users from server side");
    }

    const tierField = `tier${tier}`;
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal(tierField, true)]
    );

    const users = result.documents as unknown as UserData[];
    const usersWithStats: UserWithStats[] = [];

    // For each user, fetch their tournament assignments
    for (const user of users) {
      try {
        const tournamentAssignmentsResult = await databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [Query.equal("userId", user.userId)]
        );

        const assignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

        const totalScore = assignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);
        const totalWins = assignments.reduce((sum, assignment) => sum + (assignment.wins || 0), 0);
        const totalLosses = assignments.reduce((sum, assignment) => sum + (assignment.loss || 0), 0);
        const winRate = totalWins && totalLosses ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
        const activeAssignments = assignments.filter(a => a.AccessStatus === 'Active').length;
        const completedAssignments = assignments.filter(a => a.AccessStatus === 'Completed').length;

        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore,
            totalWins,
            totalLosses,
            winRate,
            activeAssignments,
            completedAssignments
          }
        });
      } catch (error) {
        console.error(`Failed to fetch tournament stats for user ${user.userId}:`, error);
        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore: 0,
            totalWins: 0,
            totalLosses: 0,
            winRate: 0,
            activeAssignments: 0,
            completedAssignments: 0
          }
        });
      }
    }

    return usersWithStats;
  } catch (error) {
    console.error("Failed to fetch users by tier:", error);
    return [];
  }
};

// Payment-related functions
export const getAllPaymentRequests = async (): Promise<PaymentRequest[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch payments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return result.documents as unknown as PaymentRequest[];
  } catch (error) {
    console.error("Failed to fetch payment requests:", error);
    return [];
  }
};

// Add function to refund payment amount back to user
export const refundPaymentToUser = async (userId: string, refundAmount: number): Promise<boolean> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot refund payment from server side");
    }

    // Find the user in signed up users collection
    const result = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      console.error(`User ${userId} not found in signed up users collection`);
      return false;
    }

    const user = result.documents[0];
    const currentBalance = user.amount || 0;
    const newBalance = currentBalance + refundAmount;

    // Update user's balance by adding back the refund amount
    await databases.updateDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      user.$id,
      { amount: newBalance }
    );

    console.log(`Refunded ${refundAmount} to user ${userId}. Balance: ${currentBalance} -> ${newBalance}`);
    return true;
  } catch (error) {
    console.error("Failed to refund payment to user:", error);
    return false;
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'rejected'
): Promise<PaymentRequest> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update payment from server side");
    }

    // Get the payment details first
    const paymentDoc = await databases.getDocument(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      paymentId
    );

    const payment = paymentDoc as unknown as PaymentRequest;

    // If payment is being rejected and was previously pending, refund the amount
    if (status === 'rejected' && payment.Status === 'pending') {
      const refunded = await refundPaymentToUser(payment.userId, payment.paymentValue);
      if (!refunded) {
        throw new Error('Failed to refund payment amount to user');
      }
    }

    // Update payment status
    const result = await databases.updateDocument(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      paymentId,
      { Status: status }
    );

    return result as unknown as PaymentRequest;
  } catch (error) {
    console.error("Failed to update payment status:", error);
    throw error;
  }
};

export const getPaymentsByStatus = async (status: 'pending' | 'completed' | 'rejected'): Promise<PaymentRequest[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch payments from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      PAYMENT_COLLECTION_ID,
      [
        Query.equal("Status", status),
        Query.orderDesc("$createdAt")
      ]
    );

    return result.documents as unknown as PaymentRequest[];
  } catch (error) {
    console.error("Failed to fetch payments by status:", error);
    return [];
  }
};

// Get all signed up users with tournament stats
export const getAllSignedupUsers = async (): Promise<SignedupUserWithStats[]> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch signed up users from server side");
    }

    // Fetch users from the signed up users collection
    const usersResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID
    );

    const users = usersResult.documents as unknown as Signedupusers[];
    const usersWithStats: SignedupUserWithStats[] = [];

    // For each user, fetch their tournament assignments to get additional stats
    for (const user of users) {
      try {
        const tournamentAssignmentsResult = await databases.listDocuments(
          DATABASE_ID,
          TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
          [Query.equal("userId", user.userId)]
        );

        const assignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

        // Calculate stats from tournament assignments
        const totalScore = assignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);
        const winRate = user.wins && user.loss ? Math.round((user.wins / (user.wins + user.loss)) * 100) : 0;
        const activeAssignments = assignments.filter(a => a.AccessStatus === 'Active').length;
        const completedAssignments = assignments.filter(a => a.AccessStatus === 'Completed').length;

        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore,
            winRate,
            activeAssignments,
            completedAssignments
          }
        });
      } catch (error) {
        console.error(`Failed to fetch tournament stats for user ${user.userId}:`, error);
        // Add user with zero stats if tournament data fetch fails
        usersWithStats.push({
          ...user,
          tournamentStats: {
            totalScore: 0,
            winRate: 0,
            activeAssignments: 0,
            completedAssignments: 0
          }
        });
      }
    }

    return usersWithStats;
  } catch (error) {
    console.error("Failed to fetch signed up users:", error);
    return [];
  }
};

// Get signed up user by ID
export const getSignedupUserById = async (userId: string): Promise<SignedupUserWithStats | null> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch signed up user from server side");
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (result.documents.length === 0) {
      return null;
    }

    const user = result.documents[0] as unknown as Signedupusers;

    // Fetch tournament assignments for this user
    const tournamentAssignmentsResult = await databases.listDocuments(
      DATABASE_ID,
      TOURNAMENT_ASSIGNMENTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    const assignments = tournamentAssignmentsResult.documents as unknown as TournamentAssignment[];

    // Calculate stats
    const totalScore = assignments.reduce((sum, assignment) => sum + (assignment.TournamentScore || 0), 0);
    const winRate = user.wins && user.loss ? Math.round((user.wins / (user.wins + user.loss)) * 100) : 0;
    const activeAssignments = assignments.filter(a => a.AccessStatus === 'Active').length;
    const completedAssignments = assignments.filter(a => a.AccessStatus === 'Completed').length;

    return {
      ...user,
      tournamentStats: {
        totalScore,
        winRate,
        activeAssignments,
        completedAssignments
      }
    };
  } catch (error) {
    console.error("Failed to fetch signed up user:", error);
    return null;
  }
};