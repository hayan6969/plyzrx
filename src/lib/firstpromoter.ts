/**
 * FirstPromoter API integration utilities
 */

// Plan IDs for different tiers
export const FIRSTPROMOTER_PLANS = {
  BASIC: "basic-tier",
  PREMIUM: "premium-tier",
  PRO: "pro-tier",
};

/**
 * Track a user signup/referral with FirstPromoter
 * @param email User's email address
 * @param uid Optional user ID from database
 * @param tid Optional tracking ID from cookie
 */
export async function trackFirstPromoterSignup(
  email: string,
  uid?: string,
  tid?: string
): Promise<Response | null> {
  try {
    const accountId = process.env.FIRSTPROMPT_ACCOUNT_ID;
    const apiKey = process.env.FIRSTPROMPT_API_KEY;

    if (!accountId || !apiKey) {
      console.error("FirstPromoter credentials not configured");
      return null;
    }

    const params = {
      ...(email ? { email } : {}),
      ...(uid ? { uid } : {}),
      ...(tid ? { tid } : {}),
    };

    // Ensure we have either email or uid
    if (!email && !uid) {
      console.error(
        "FirstPromoter signup tracking requires either email or uid"
      );
      return null;
    }

    const response = await fetch(
      "https://v2.firstpromoter.com/api/v2/track/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Account-ID": accountId,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      console.error(
        "FirstPromoter signup tracking failed:",
        await response.text()
      );
    }

    return response;
  } catch (error) {
    console.error("Error tracking FirstPromoter signup:", error);
    return null;
  }
}

/**
 * Track a sale with FirstPromoter
 * @param params Sale tracking parameters
 */
export async function trackFirstPromoterSale(params: {
  email?: string;
  uid?: string;
  event_id: string; // Transaction ID
  amount: number; // Amount in cents
  quantity?: number;
  plan: string; // Plan ID
  currency?: string;
  tid?: string; // Tracking ID from cookie
}): Promise<Response | null> {
  try {
    const accountId = process.env.FIRSTPROMPT_ACCOUNT_ID;
    const apiKey = process.env.FIRSTPROMPT_API_KEY;

    if (!accountId || !apiKey) {
      console.error("FirstPromoter credentials not configured");
      return null;
    }

    // Ensure we have either email or uid
    if (!params.email && !params.uid && !params.tid) {
      console.error(
        "FirstPromoter sale tracking requires either email, uid, or tid"
      );
      return null;
    }

    const response = await fetch(
      "https://v2.firstpromoter.com/api/v2/track/sale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Account-ID": accountId,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok && response.status !== 204) {
      // 204 means it's not a referral sale, which is fine
      console.error(
        "FirstPromoter sale tracking failed:",
        await response.text()
      );
    }

    return response;
  } catch (error) {
    console.error("Error tracking FirstPromoter sale:", error);
    return null;
  }
}

/**
 * Get the FirstPromoter tracking ID from cookies
 * @param cookieStore Next.js cookie store
 */
export async function getFirstPromoterTrackingId(
  cookieStore: any
): Promise<string | undefined> {
  try {
    // Make sure to await the cookies() result
    const cookie = await cookieStore.get?.("_fprom_tid");
    return cookie?.value;
  } catch (error) {
    console.error("Error getting FirstPromoter tracking ID:", error);
    return undefined;
  }
}
