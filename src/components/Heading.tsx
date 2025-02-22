import React from 'react'

function Heading({headingname}:{headingname:string}) {
  return (
    <div className='h-[11%] p-4 mb-2 flex justify-center items-center'>
<h1 className='leading-4 lg:leading-6 flex flex-col justify-center items-center'> <span
  className=" text-[2.2rem] lg:text-[4.2rem] 2xl:text-[4.8rem] font-headingfont text-white outline-text opacity-50"
  style={{
    color: "transparent",
    WebkitTextStroke: "2px white",
  }}
>
  {headingname}
</span> <br /> <span className=' text-[4rem] text-custompink lg:text-[5.5rem] 2xl:text-[6rem] font-dripfont'>{headingname}</span></h1>

</div>
  )
}

export default Heading