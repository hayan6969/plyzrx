import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";


// const blockedStates = ['AR', 'CT', 'DE', 'LA', 'SD', 'ME', 'IN', 'NJ']

export async function middleware(request: NextRequest) {

  try {
   

   
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
