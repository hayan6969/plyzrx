import {
  createPaymentLog,
  createOrUpdateUserTier,
  PaymentLog,
  UserTier,
} from "./appwriteDB";

// Interface for PayPal transaction data
export interface PayPalTransactionData {
  userId: string;
  username: string;
  transactionId: string;
  amount: number;
  tierLevel: 1 | 2 | 3;
}

/**
 * Processes a successful PayPal payment and saves the data to Appwrite
 *
 * @param paypalData - The PayPal transaction data
 * @returns A promise that resolves to true if the processing was successful
 */
export const processPayPalPayment = async (
  paypalData: PayPalTransactionData
): Promise<boolean> => {
  try {
    // 1. Create a payment log entry
    const paymentLog: PaymentLog = {
      userId: paypalData.userId,
      username: paypalData.username,
      dateTime: new Date().toISOString().replace("T", " ").substring(0, 19), // Format: YYYY-MM-DD HH:MM:SS
      platform: "Web", // Default to Web for now
      paymentAmount: paypalData.amount,
      paymentId: paypalData.transactionId,
    };

    await createPaymentLog(paymentLog);

    // 2. Update user tier information
    // First, determine which tier flags to set based on the purchased tier
    const tierUpdates: { tier1: boolean; tier2: boolean; tier3: boolean } = {
      tier1: false,
      tier2: false,
      tier3: false,
    };

    // Set the purchased tier and all lower tiers to true
    switch (paypalData.tierLevel) {
      case 3:
        tierUpdates.tier3 = true;
        tierUpdates.tier2 = true;
        tierUpdates.tier1 = true;
        break;
      case 2:
        tierUpdates.tier2 = true;
        tierUpdates.tier1 = true;
        break;
      case 1:
        tierUpdates.tier1 = true;
        break;
    }

    // Create or update user tier information
    const userTier: UserTier = {
      userId: paypalData.userId,
      ...tierUpdates,
    };

    await createOrUpdateUserTier(userTier);

    return true;
  } catch (error) {
    console.error("Failed to process PayPal payment:", error);
    return false;
  }
};
