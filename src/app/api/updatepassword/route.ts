import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {

  const { password,newPassword } = await request.json();
  const cookiesStore = cookies();
  if (!password || !newPassword) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }

  try {

console.log(password);

const Recievedcookie=(await cookiesStore).get("token")

console.log("cookies is ",Recievedcookie?.value);

    const api = await axios.post(
      "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/update-password",
      { password, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          ProjectId: process.env.PROJECTID ?? "",
          Authorization:`Bearer ${Recievedcookie?.value}`
        },
      }
    );

    (await cookiesStore).set({
      name: "token",
      value: JSON.stringify(api.data),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: api.data.expiresIn,
    });
    // return NextResponse.json({  }, { status: 201 });
    return NextResponse.json({
      success: true,
      message: "Passowrd Updated successfully",
    });
  } catch (error: any) {
    console.log("Error Response:", error.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: error.response?.data.detail || error.messageerror,
    });
  }
  

}