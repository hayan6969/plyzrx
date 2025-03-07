'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PopupCard() {

  return (


    <Card className="w-52 lg:w-56 p-1 md:p-2 relative">
    <CardContent>
      <h2 className="text-xl font-bold mb-4">Welcome</h2>
      <p className="mb-4">Login or Create Account to purchase</p>
      <div className="flex justify-between">
        <Link
          href="/login"
          className="w-1/2 mr-2 bg-custompink text-white font-semibold text-center py-2 rounded-lg transition duration-300 hover:bg-pink-600"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="w-1/2 lg:h-10 ml-2 bg-custompink text-white font-semibold text-center py-2 rounded-lg transition duration-300 hover:bg-pink-600"
        >
          Sign Up
        </Link>
      </div>
    </CardContent>
  </Card>
  

        

  );
}
