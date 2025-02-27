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
          ProjectId: process.env.PROJECTID ?? "",
        },
      }
    );
    console.log(api.data);

    (await cookiesStore).set({
      name: "token",
      value: JSON.stringify(api.data),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: api.data.expiresIn,
    });

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error: any) {
    console.log("Error Response:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: error.response?.data?.detail || error.message,
    });
  }
}
