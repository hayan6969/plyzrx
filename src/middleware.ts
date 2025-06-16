import { NextRequest, NextResponse } from "next/server";

const BLOCKED_STATES = [
  "AR", // Arkansas
  "CT", // Connecticut
  "DE", // Delaware
  "LA", // Louisiana
  "SD", // South Dakota
  "ME", // Maine
  "IN", // Indiana
  "UT", // Utah
  "HI", // Hawaii
  "SC", // South Carolina
  "TN", // Tennessee
  "AL", // Alabama
  "GA", // Georgia
  "NC", // North Carolina
  "ID", // Idaho
];

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  // Handle routes requiring Unity authentication
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Handle API routes
  if (
    pathname.startsWith("/api") &&
    !pathname.includes("/signin") &&
    !pathname.includes("/signup")
  ) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "authentication failed" }),
        { status: 401 }
      );
    }
  }

  // Admin routes are now handled client-side with Appwrite and localStorage
  // No server-side middleware check for admin routes

  // Check for blocked states
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const geo = await res.json();

  console.log("Middleware geo data:", geo); // Debug log

  if (geo.country === "US" && BLOCKED_STATES.includes(geo.region)) {
    console.log(`🚫 Access blocked for US state: ${geo.region}`);
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/check", "/api/paypal","/api/signup","/api/signin","/api/updatepassword"],
};
