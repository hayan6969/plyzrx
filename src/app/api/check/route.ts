// app/api/auth/check/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const token =(await cookieStore).get("token")

  if (token) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false });
  }
}