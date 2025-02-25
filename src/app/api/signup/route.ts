import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
  const { fullname, username, email, password } = await request.json();

  if (!fullname || !username || !email || !password) {
    return NextResponse.json({ error: "Fields required" }, { status: 400 });
  }


  
try {
    const api = await axios.post(
        "https://player-auth.services.api.unity.com/v1/authentication/usernamepassword/sign-up",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            ProjectId: process.env.PROJECTID ?? "",
          },
        }
      );
      console.log(api);
    
      // return NextResponse.json({  }, { status: 201 });
      return NextResponse.json({ success: true,message: 'User created successfully' });  
} catch (error:any) {
  console.log("Error Response:", error.response?.data || error.message);

  
    return NextResponse.json({ success: false,message:error.response?.data.detail || error.messageerror });  

    

}
 
}
