import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await res.json();

    console.log('Server-side geolocation:', geoData);
    if (geoData.country === 'Pakistan') {
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    return NextResponse.json({
      ip,
      country: geoData.country,
      region: geoData.region,
      city: geoData.city
    });
  } catch (error) {
    console.error('Geolocation error:', error);
    return NextResponse.json({ error: 'Failed to fetch geolocation' }, { status: 500 });
  }
}


 