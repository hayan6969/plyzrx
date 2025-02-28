import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const cookiesStore = cookies();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/profile')) {
    // Read token from cookies
    const Recievedcookie=(await cookiesStore).get("token")

    if(Recievedcookie)
    {
  return NextResponse.next(); // Allow other requests to continue
    }
    else{
      return NextResponse.redirect(new URL('/login', request.url));
    }

  }


}

// Middleware Configuration
export const config = {
  matcher: ['/profile/:path*', '/'], // Ensure it applies to /profile and /dashboard
};
