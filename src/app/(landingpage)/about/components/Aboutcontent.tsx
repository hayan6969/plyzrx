
import React from 'react'


function Aboutcontent({title,content,afterbr}:{title:string,content:string,afterbr:string}) {

  return (
    <section className="text-center py-10 px-5  text-white">
    <h2 className=" font-headingfont  text-[2rem] md:text-[2.5] lg:text-[3rem] font-bold mb-3">{title}</h2>
    <p className=" w-[90%] flex flex-wrap mx-auto text-lg font-bodyfont font-thin">
        {content}

{afterbr}
    </p>
  </section>
  )
}

export default Aboutcontent