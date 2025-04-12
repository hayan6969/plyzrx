"use client"
import React, { useEffect, useState } from 'react';

 function page() {
  const [geoData, setGeoData] = useState(null);
  useEffect(() => {

    const checkGeolocation = async () => {
      try {
        const response = await fetch('/api/geolocation');
        const data = await response.json();
        console.log('🌍 Geolocation Data:', data);
        setGeoData(data);
      } catch (error) {
        console.error('Failed to fetch geolocation:', error);
      }
    };

    checkGeolocation();
  }, []);

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
      </div>
    </div>
  )
}


export default page;