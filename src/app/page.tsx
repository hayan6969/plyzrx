import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Tournaments from "@/components/Tournaments_conn";
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

</>
  );
}
