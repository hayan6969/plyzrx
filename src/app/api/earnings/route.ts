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

    // Fetch the specific user
    const user = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER!, // User collection ID
      userId
    );

    // Fetch tournaments where this user participated
    const tournamentsResponse = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS!, // Tournament collection ID
      [
        Query.equal('participants', userId), // Assuming participants field contains user IDs
        Query.limit(100)
      ]
    );

    // Calculate total earnings for this user
    const earnings = tournamentsResponse.documents.map(tournament => {
      // Assuming tournament has earnings/prize fields
      const userEarning = tournament.earnings?.[userId] || tournament.prize || 0;
      return {
        tournamentId: tournament.$id,
        tournamentName: tournament.name,
        earning: userEarning,
        date: tournament.$createdAt
      };
    });

    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.earning, 0);

    const userEarnings = {
      userId: user.$id,
      userName: user.name || user.email,
      tournaments: earnings,
      totalEarnings: totalEarnings,
      earningsArray: earnings.map(e => e.earning) // Array of earning values
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
          error: 'User not found',
          details: 'The specified user ID does not exist'
        },
        { status: 404 }
      );

  }
}