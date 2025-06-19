import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const REPORT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REPORT_LOG_COLLECTION || '';

export async function POST(request: NextRequest) {
  try {
    const { reporteduser, reportedBy, matchId, matchLog } = await request.json();

    if (!reporteduser || !reportedBy || !matchId || !matchLog) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reportData = {
      reporteduser,
      reportedBy,
      matchId,
      matchLog,
      createdAt: new Date().toISOString(),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      REPORT_COLLECTION_ID,
      ID.unique(),
      reportData
    );

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      report: result,
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit report' },
      { status: 500 }
    );
  }
}