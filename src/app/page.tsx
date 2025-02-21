
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Tournaments from "@/components/Tournaments_conn"
import Image from "next/image";
import Footer from "@/components/Footer";
export default function Home() {
  return (
<>
{/* main */}
<main className=" flex w-full flex-col  h-[100vh]">
<Navbar/>
<section className="  flex flex-col gap-3 justify-center items-center w-full h-full text-center"
style={{background: `radial-gradient(circle, rgba(255, 0, 102, 0.4) 0%, rgba(0, 0, 0, 0) 291px)`}}>
    <h1 className=" relative opacity-90 text-4xl tracking-wider  md:text-[2rem]/[3.3rem] lg:text-[2.3rem] 2xl:text-[3rem]/[5rem] font-bold mb-2 lg:mb-1 font-headingfont  w-[100%]  lg:w-[100%]  2xl:min-w-[60%] px-3">
        Welcome to <span className="text-custompink opacity-100">PlyzRX</span> — The 

       <div className="relative inline-block  ml-3"> Ultimate
       <div className="absolute lg:right-[-1rem] lg:top-[-4.6rem] h-24 w-24 bg-[url(/img/Cards.png)] bg-contain"></div>
         </div>



        <br className="hidden lg:block" /> 
        <div className="relative inline-block   mr-3"> Gaming
       <div className="  absolute lg:left-[-5rem] lg:top-[1rem] h-24 w-24 bg-[url(/img/Dice.png)] bg-contain"></div>
         </div>
          Platform!
      </h1>
      <p className=" tracking-wide  text-lg md:text-[1rem] font-headingfont opacity-75 text-white mb-3">
        Real Money Sports Action Made Easy
      </p>

      <Button className="mt-5" size={"lg"} variant={"outline"}>Play Now</Button>
</section>
</main>

<Tournaments/>

{/* action section */}
<main className=" w-full lg:mt-10 min-h-screen pt-1 lg:pt-3 2xl:pt-5 flex flex-col">
<div className=" flex justify-center items-center">
<h1 className=" text-[2rem] sm:text-[3rem] w-full leading-tight lg:text-[3.3rem] 2xl:text-[4rem] font-headingfont text-white outline-text  text-center">
<span className="opacity-85">Join The</span> <span className="font-dripfont text-[4rem] sm:text-[5rem] lg:text-[6rem] 2xl:text-[7rem] opacity-100  text-custompink">Action</span>
<br />
<span className="opacity-85">And Earn</span> 

</h1>

</div>

<div className=" flex justify-center items-center p-3 ">
<p className="text-center lg:text-[.8rem] 2xl:text-[1rem] font-bodyfont font-normal">
PlyzRX lets you turn your sports expertise into real money action. Simply choose More or Less on two or more players across any sport for a chance to win <br className="hidden lg:block"/> up to 1000x your entry fee. Build your winning lineup, cash out quickly, and be part of a thriving community of daily winners. Betting has never been this <br className="hidden lg:block"/> easy with PlyzRX!
</p>

</div>

<div className=" h-[40vh] md:h-[75vh] w-[100%] relative flex justify-center items-center">
  <Image 
    src="/img/actionimg.png" 
 fill
 style={{ objectFit: "contain" }}
    alt="ActionImg"
  />
</div>

<div className=" pb-5 flex flex-col justify-center items-center">

<h1 className=" text-[1.7rem] sm:text-[2.4rem] w-full leading-tight lg:text-[2.7rem] 2xl:text-[3.2rem] font-headingfont text-white outline-text  text-center">
Join Now and Earn Real <span className="font-dripfont text-[4rem] sm:text-[5rem] lg:text-[6rem] 2xl:text-[7rem] opacity-100  text-custompink">Cash</span>


</h1>
<Button variant={"whitebtn"} size={"lg"}>Join Now</Button>
</div>
</main>


{/* {where i play} */}

<main className=" w-full lg:mt-10 lg:mb-10 min-h-screen pt-1 lg:pt-5 2xl:pt-5 flex flex-col">
<div className=" flex justify-center items-center font-headingfont">
<h1 className=" text-[2rem] sm:text-[3rem] w-full leading-tight lg:text-[3.5rem] 2xl:text-[4rem]  text-white outline-text  text-center">
Where can I play <span className="text-custompink">PlyzRX</span>
?
</h1>
</div>
  
<div className=" flex mb-5 justify-center items-center p-3 ">
<p className="text-center text-[1rem] md:text-[1.2rem] lg:text-[1.5rem] 2xl:text-[1rem] font-bodyfont font-normal">
PlyzRX is available in <span className="text-custompink">150</span> Countries , <span className="text-custompink">42</span> US States , <span className="text-custompink">5</span> Australian Regions

</p>

</div>

<div className=" h-[40vh] mt-5 md:h-[85vh] w-[100%] relative flex justify-center items-center">
<Image 
  src="/img/Map.png" 
  fill 
  alt="ActionImg"
  style={{ objectFit: "contain" }}
/>
</div>

</main>


<Footer/>
</>
  );
}
