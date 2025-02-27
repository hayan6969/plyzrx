import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";


function UserProfileIcon() {
  return (
    <Avatar className="w-12 h-12">
      <AvatarImage />
      <AvatarFallback className="bg-gray-200 text-gray-500">
        <User className="w-6 h-6" />
      </AvatarFallback>
    </Avatar>
  )
}

export default UserProfileIcon