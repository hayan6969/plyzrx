import { NextResponse } from "next/server";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const SIGNEDUP_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SIGNEDUP_COLLECTION_ID || "";

export interface Signedupusers {
  $id?: string;
  userId: string;
  paymentId: string;
  wins: number;
  loss: number;
  amount: number;
  username: string;
  email: string;
  otp:string,
  isVerified:boolean
}



export async function POST(request: Request) {

const {otp,userId}= await request.json()

const savedotp=await databases.listDocuments(
    DATABASE_ID,
    SIGNEDUP_COLLECTION_ID,
       [Query.equal("userId", userId)]
)

if (savedotp.documents.length>0) {
    console.log(savedotp.documents[0].otp);
    const savedOtp=savedotp.documents[0].otp

    if (otp==savedOtp) {
      await databases.updateDocument(
            DATABASE_ID,
            SIGNEDUP_COLLECTION_ID,
            savedotp.documents[0].$id,
            { otp:"",
              isVerified: true }
        );


        return NextResponse.json(
            { success: true, message: "OTP verified successfully" },
            { status: 200 }
        );
    }
      return NextResponse.json(
            { success: false, message: "Invalid OTP" },
            { status: 400 }
        );
}
 else {
    return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
    );
}
}