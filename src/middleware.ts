import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";


// const blockedStates = ['AR', 'CT', 'DE', 'LA', 'SD', 'ME', 'IN', 'NJ']

export async function middleware(request: NextRequest) {

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    
    if (!res.ok) {
      console.error('IP API request failed');
      return NextResponse.next();
    }

    const geo = await res.json();
    
    if (geo.status === 'fail') {
      console.error('Geolocation lookup failed');
      return NextResponse.next();
    }

    if (geo.country === 'PK') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

   
  const cookiesStore = cookies();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/profile")) {
    const Recievedcookie = (await cookiesStore).get("token");

    if (Recievedcookie) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }


}

// Middleware Configuration
export const config = {
  matcher: ["/profile/:path*", "/", "/((?!access-denied).*)"],
};
