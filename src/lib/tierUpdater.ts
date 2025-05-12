import { UserTier, getUserTier, createOrUpdateUserTier } from "./appwriteDB";

// Define tier price thresholds in cents
const TIER_PRICES = {
  TIER1: 1999, // $19.99
  TIER2: 4999, // $49.99
  TIER3: 9999, // $99.99
};

/**
 * Determines which tier level a payment amount corresponds to
 *
 * @param amount - The payment amount in dollars
 * @returns The tier level (1, 2, or 3) or 0 if amount doesn't match any tier
 */
export const getTierLevelFromAmount = (amount: number): number => {
  // Convert amount to cents for comparison
  const amountInCents = Math.round(amount * 100);

  if (amountInCents >= TIER_PRICES.TIER3) {
    return 3;
  } else if (amountInCents >= TIER_PRICES.TIER2) {
    return 2;
  } else if (amountInCents >= TIER_PRICES.TIER1) {
    return 1;
  }
  return 0; // Not matching any tier
};

/**
 * Updates user tier information based on payment amount
 *
 * @param userId - The user ID
 * @param amount - The payment amount
 * @returns A promise that resolves to true if the update was successful
 */
export const updateUserTierFromPayment = async (
  userId: string,
  amount: number
): Promise<boolean> => {
  try {
    const tierLevel = getTierLevelFromAmount(amount);

    if (tierLevel === 0) {
      console.warn(`Payment amount ${amount} doesn't match any tier level`);
      return false;
    }

    // Get current user tier information
    const existingTier = await getUserTier(userId);

    // Prepare tier updates
    const tierUpdates: { tier1: boolean; tier2: boolean; tier3: boolean } = {
      tier1: false,
      tier2: false,
      tier3: false,
    };

    if (existingTier) {
      // Start with existing tier values
      tierUpdates.tier1 = existingTier.tier1;
      tierUpdates.tier2 = existingTier.tier2;
      tierUpdates.tier3 = existingTier.tier3;
    }

    // Update tiers based on payment
    switch (tierLevel) {
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

    // Create or update user tier
    const userTier: UserTier = {
      userId,
      ...tierUpdates,
    };

    await createOrUpdateUserTier(userTier);
    return true;
  } catch (error) {
    console.error("Failed to update user tier:", error);
    return false;
  }
};
