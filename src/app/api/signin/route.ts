import { NextResponse } from "next/server";
import axios from "axios";

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message: string;
}

export async function POST(request: Request) {
  const {  username,  password } = await request.json();

  if ( !username ||  !password) {
    return NextResponse.json({ error: "Fields required"}, { status: 400 });
  }

  console.log(username, password);
  console.log(process.env.PROJECTID);
  
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
      console.log(api);
    
    //   return NextResponse.json({  }, { status: 201 });
      return NextResponse.json({ success: true,message: 'User logged in successfully' });  
} catch (error: ApiError) {
  console.log("Error Response:", error.response?.data || error.message);
  
  return NextResponse.json({ 
    success: false, 
    message: error.response?.data?.detail || error.message 
  });
}
}
