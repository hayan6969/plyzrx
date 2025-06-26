import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

export async function GET(request: NextRequest) {
  try {
    // Get user ID from URL search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User ID is required. Please provide userId in the query parameters.' 
        },
        { status: 400 }
      );
    }

  
    const earningsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_EARNING_COLLECTION_ID!, 
      [
        Query.equal('userId', userId), 
        Query.limit(1000), 
        Query.orderDesc('$createdAt')
      ]
    );

    const earningsArray = earningsResponse.documents.map(earning => {
 
      return earning.amount || earning.earning || 0;
    });

    const totalEarnings = earningsArray.reduce((sum, amount) => sum + amount, 0);

    const userEarnings = {
      userId: userId,
      totalEarnings: totalEarnings,
      earningsCount: earningsArray.length,
      earnings: earningsArray 
    };

    return NextResponse.json({
      success: true,
      data: userEarnings
    });

  } catch (error) {
    console.error('Error fetching user earnings:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch earnings',
        details: 'Could not retrieve earnings data for the specified user'
      },
      { status: 500 }
    );
  }
}