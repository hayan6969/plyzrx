import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_STATES = ['AR', 'CT', 'DE', 'LA', 'SD', 'ME', 'IN', 'NJ'];

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
