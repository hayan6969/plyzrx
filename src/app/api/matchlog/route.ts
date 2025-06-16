import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'appwrite';

export interface MatchLog {
  $id?: string;
  Match_ID: string;
  Logs: string;
  createdAt?: string;
}

// Appwrite configuration
const client = new Client()
  .setEndpoint( process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT  || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const MATCH_LOGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCH_LOGS_COLLECTION_ID || '';

const createMatchLog = async (
  matchLog: MatchLog
): Promise<MatchLog> => {
  try {
    const matchLogForAppwrite = {
      ...matchLog,
      createdAt: new Date().toISOString(),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      MATCH_LOGS_COLLECTION_ID,
      ID.unique(),
      matchLogForAppwrite
    );

    return result as unknown as MatchLog;
  } catch (error) {
    console.error("Failed to create match log:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const mobileGameData = await request.json();

    console.log('Received data from mobile app:', mobileGameData);

    const response = await createMatchLog(mobileGameData);

    return NextResponse.json({
      success: true,
      message: 'Match data received successfully',
      log: response
    });

  } catch (error) {
    console.error('Error processing mobile game data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process data' },
      { status: 500 }
    );
  }
}