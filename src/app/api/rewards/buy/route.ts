import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite Client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || '';
const REWARDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_COLLECTION_ID || '';

interface PurchaseRequest {
  userId: string;
  rewardId: string;
}

interface Reward {
  $id: string;
  rewardname: string;
  categoryName: string;
  price: number;
  image: string;
}

interface SignedupUser {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number;
  username: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, rewardId }: PurchaseRequest = await request.json();

    // Validate required fields
    if (!userId || !rewardId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and rewardId' },
        { status: 400 }
      );
    }

    // 1. Fetch the reward details
    let reward: Reward;
    try {
      const rewardDoc = await databases.getDocument(
        DATABASE_ID,
        REWARDS_COLLECTION_ID,
        rewardId
      );
      reward = rewardDoc as unknown as Reward;
    } catch (error) {
        console.log(error);
        
      return NextResponse.json(
        { error: 'Reward not found' },
        { status: 404 }
      );
    }

    // 2. Fetch the user from signed up users collection
    const userResult = await databases.listDocuments(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.documents[0] as unknown as SignedupUser;
    const currentBalance = user.amount || 0;
    const rewardPrice = reward.price;

    // 3. Check if user has sufficient balance
    if (currentBalance < rewardPrice) {
      return NextResponse.json(
        { 
          error: 'Insufficient balance',
          currentBalance,
          rewardPrice,
          shortfall: rewardPrice - currentBalance
        },
        { status: 400 }
      );
    }

    // 4. Calculate new balance after purchase
    const newBalance = currentBalance - rewardPrice;

    // 5. Update user's balance in signed up users collection
    const updatedUser = await databases.updateDocument(
      DATABASE_ID,
      SIGNEDUP_COLLECTION_ID,
      user.$id!,
      { amount: newBalance }
    );
 console.log(updatedUser);
 
    // 6. Return success response with purchase details
    return NextResponse.json({
      success: true,
      message: 'Reward purchased successfully',
      purchase: {
        rewardId: reward.$id,
        rewardName: reward.rewardname,
        price: rewardPrice,
        purchasedAt: new Date().toISOString()
      },
      user: {
        userId: user.userId,
        username: user.username,
        previousBalance: currentBalance,
        newBalance: newBalance,
        amountDeducted: rewardPrice
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Reward purchase API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process reward purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
