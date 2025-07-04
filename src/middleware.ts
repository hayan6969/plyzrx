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

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/access-denied",
  "/", // Homepage
  "/about",
  "/termsandcondition",
  "/privacypolicy",
  "/refund",
  "/payoutfaq",
  "/generalfaq",
  "/helpcenter",
  "/howplay",
  "/dispute",
  "/eula",
  "/fraudprevention",
  "/paymentwithdrawl",
  "/cookiespolicy",
  "/disclaimerprovisions",
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/signin",
  "/api/signup",
  "/api/check",
  "/api/leaderboard/reset",
  "/api/otpverification",
  "/api/resendotp",
  "/api/resetpassword",
  "/api/resetpassword/updatepassword",
  "/api/tournament/status",
  "/api/rewards/buy",
];

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
  const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  const cookieToken = request.cookies.get("token")?.value;

  const isAuthenticated = token || cookieToken;

  
  if (!isAuthenticated && !isPublicRoute && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle dashboard routes
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle API routes
  if (pathname.startsWith("/api") && !isPublicApiRoute) {
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Authentication failed",
          debug: {
            hasBearerToken: !!token,
            hasCookieToken: !!cookieToken,
          },
        }),
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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.ico$|.*\\.svg$|.*\\.webmanifest$|font/).*)",
  ],
};
