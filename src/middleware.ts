import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_STATES = [
  'AR',  // Arkansas
  'CT',  // Connecticut
  'DE',  // Delaware
  'LA',  // Louisiana
  'SD',  // South Dakota
  'ME',  // Maine
  'IN',  // Indiana
  'UT',  // Utah
  'HI',  // Hawaii
  'SC',  // South Carolina
  'TN',  // Tennessee
  'AL',  // Alabama
  'GA',  // Georgia
  'NC',  // North Carolina
  'ID'   // Idaho
];

export async function middleware(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await res.json();

    console.log('Middleware geo data:', geo); // Debug log

    if (geo.country === 'US' && BLOCKED_STATES.includes(geo.region)) {
      console.log(`🚫 Access blocked for US state: ${geo.region}`);
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    if (request.nextUrl.pathname.startsWith("/profile")) {
      const token = request.cookies.get("token");
      return token 
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|access-denied).*)',
  ]
};
