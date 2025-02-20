import React from 'react'
import { Button } from './ui/button';


export default function Tourncard() {
    return (
      <div className="w-72 bg-[rgba(255,255,255,0.18)] border-1 border-[rgba(255, 255, 255, 0.18)] backdrop-blur-[6.6px] text-white px-6 py-4 rounded-3xl shadow-lg border border-gray-700 h-[90%]">
        <h2 className="text-gray-400 text-sm">Plyz</h2>
        <h1 className="text-xl font-bold">Tier 2</h1>
        <p className="text-[#B9F566] text-2xl font-bold mt-2">$250,000</p>
        
        <div className="mt-4 text-sm">
          <p>Player <span className="float-right">1-10</span></p>
          <p>Payout <span className="float-right">$12,500 Each</span></p>
          <p className="mt-2">Player <span className="float-right">11-100</span></p>
          <p>Payout <span className="float-right">$1388 Each</span></p>
        </div>
        
        <p className="mt-4 text-sm">Time <span className="float-right">7 Days</span></p>
        
        <div className="mt-4">
          <p className="text-sm">Time Until Launch</p>
          <p className="text-lg font-bold">0 Days 22 Hours 40 Min 24 Sec</p>
        </div>
        <div className='flex  justify-between items-center'>
        <p className="text-xl font-semibold text-[#B9F566] ">Price</p>
        <p className="text-lg font-bold text-white">$49.00</p>
        </div>
        
       <Button className='mt-4' size={"lg"}>Start</Button>
      </div>
    );
  }
  