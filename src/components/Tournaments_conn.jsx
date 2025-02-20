import React from 'react'
import Tourncard from './Tourncard'

function Tournaments_conn() {
  return (
    <main className='w-full  pt-1 h-[110vh] flex flex-col '>
<div className=' h-[18%] p-2 flex justify-center items-center'>
<h1 className='leading-6 flex flex-col justify-center items-center'> <span
  className=" text-[4rem] lg:text-[4.2rem] 2xl:text-[4.8rem] font-headingfont text-white outline-text opacity-50"
  style={{
    color: "transparent",
    WebkitTextStroke: "2px white",
  }}
>
  Tournaments
</span> <br /> <span className=' text-[5.2rem] text-custompink lg:text-[5.5rem] 2xl:text-[6rem] font-dripfont'>Tournaments</span></h1>

</div>
      <section className=' p-3 h-full w-full flex  justify-center items-center'>
        
<Tourncard/>
        </section>  

    </main>
  )
}

export default Tournaments_conn