import Navbar from '@/components/Navbar'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className=' w-full'>
      <Navbar/>
        {children}
        
        
        </div>
  )
}

export default layout