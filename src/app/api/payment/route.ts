import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

const databases = new Databases(client);

export async function POST(request: NextRequest) {
  try {
    const { userId, paymentValue } = await request.json();

    // Validate required fields
    if (!userId || !paymentValue) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, PaymentValue, RequestedAt' },
        { status: 400 }
      );
    }

    // Create payment document in Appwrite
    const paymentData = {
      userId,
      paymentValue: parseFloat(paymentValue),
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
      data: document
    }, { status: 201 });

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    );
  }
}