import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
  const { fullname, username, email, password } = await request.json();

  if (!fullname || !username || !email || !password) {
    return NextResponse.json({ error: "Fieldds required" }, { status: 400 });
  }

  console.log(username, password);
  console.log(process.env.PROJECTID);
  
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
    
      // return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
      return NextResponse.json({ success: true });  
} catch (error) {
   console.log(error);
   
    return NextResponse.json({ success: false,message:"Couldn't Sign up" });  

    

}
 
}
