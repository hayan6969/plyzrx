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
