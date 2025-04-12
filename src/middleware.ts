import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";


// const blockedStates = ['AR', 'CT', 'DE', 'LA', 'SD', 'ME', 'IN', 'NJ']

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";

  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const geo = await res.json();
  console.log(geo);
  if (geo.country === 'Pakistan') {
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
}

// Middleware Configuration
export const config = {
  matcher: ["/profile/:path*", "/", "/((?!access-denied).*)"],
};
