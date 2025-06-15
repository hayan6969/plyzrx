import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  const { username, password } = await request.json();
  const cookiesStore = cookies();
  if (!username || !password) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }

  try {
    const api = await axios.post(
      "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/sign-in",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
          ProjectId: "9353b433-f61e-4b9d-b39b-0b794f99da3c",
        },
      }
    );
    (await cookiesStore).set({
      name: "token",
      value: api.data.idToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: api.data.expiresIn,
    });

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      username:api.data.user.username,
      userid:api.data.user.id
    });
  } catch (error: any) {
    console.log("Error Response:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: error.response?.data?.detail || error.message,
    });
  }
}
