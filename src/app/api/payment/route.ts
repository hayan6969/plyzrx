import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

const databases = new Databases(client);

export async function POST(request: NextRequest) {
  try {
    const { userId, paymentValue, paypalAccount } = await request.json();

    // Validate required fields
    if (!userId || !paymentValue || !paypalAccount) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, paymentValue, paypalAccount' },
        { status: 400 }
      );
    }

    const requestedAmount = parseFloat(paymentValue);

    if (requestedAmount <= 0) {
      return NextResponse.json(
        { error: 'Payment value must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate PayPal account format (basic email validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalAccount)) {
      return NextResponse.json(
        { error: 'Please provide a valid PayPal email address' },
        { status: 400 }
      );
    }

    // Find the user in the signed up users collection
    const userResult = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );

    if (userResult.documents.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.documents[0];
    const currentBalance = user.amount || 0;

    // Check if user has sufficient balance
    if (currentBalance < requestedAmount) {
      return NextResponse.json(
        { 
          error: 'Insufficient balance',
          currentBalance,
          requestedAmount
        },
        { status: 400 }
      );
    }

    // Calculate new balance after deduction
    const newBalance = currentBalance - requestedAmount;

    // Update user's balance in signed up users collection
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID!,
      user.$id,
      { amount: newBalance }
    );

    // Create payment document in Appwrite with pending status
    const paymentData = {
      userId,
      paymentValue: requestedAmount,
      paypalAccount,
      RequestedAt: new Date().toISOString(),
      Status: 'pending'
    };

    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_COLLECTION!,
      ID.unique(),
      paymentData
    );

    return NextResponse.json({
      success: true,
      message: 'Payment request created successfully',
      paymentId: document.$id,
      data: document,
      userBalance: {
        previousBalance: currentBalance,
        newBalance: newBalance,
        deductedAmount: requestedAmount
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    );
  }
}