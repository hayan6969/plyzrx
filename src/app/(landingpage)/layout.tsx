import Navbar from '@/components/Navbar'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className=' w-full'
    style={{
      background: `
      radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
      radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
      #040811
    `,
    }}
    >
      <Navbar/>
        {children}
        
        
        </div>
  )
}

export default layout