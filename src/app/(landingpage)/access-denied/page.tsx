"use client"
import React, { useEffect, useState } from 'react';

 function Page() {
  const [geoData, setGeoData] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          We're sorry, but access to this site is not available in your state.
        </p>
        <div className="text-sm text-gray-500">
          This restriction applies to users from certain US states due to regulatory requirements.
        </div>
        {geoData }
      </div>
    </div>
  )
}


export default Page;