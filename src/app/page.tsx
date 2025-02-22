import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Tournaments from "@/components/Tournaments_conn";
import Image from "next/image";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <>
      {/* main */}
      <main
        className="flex flex-col w-full h-[100vh] lg:min-h-screen px-2"
        style={{
          background: `radial-gradient(circle, rgba(255, 0, 102, 0.4) 0%, rgba(0, 0, 0, 0) 300px)`,
        }}
      >
        <Navbar />
        <section className="flex flex-col gap-4 justify-center items-center w-full min-h-[70vh] lg:min-h-[80vh] text-center px-0 lg:px-4">
          <h1 className="relative opacity-90 text-xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-4 font-headingfont leading-tight">
            Welcome to
            <span className="text-custompink opacity-100"> PlyzRX </span>— The
            <span className="relative inline-block mx-2">
              Ultimate
              <span className="absolute -right-2 sm:right-[-1rem] -top-6 sm:top-[-4rem] h-14 w-14 sm:h-20 sm:w-20 bg-[url(/img/Cards.png)] bg-contain"></span>
            </span>
            <br className="hidden lg:block" />
            <span className="relative inline-block mx-2">
              Gaming
              <span className="absolute -left-2 sm:left-[-3rem] top-4 sm:top-[1rem] h-14 w-14 sm:h-20 sm:w-20 bg-[url(/img/Dice.png)] bg-contain"></span>
            </span>
            Platform!
          </h1>
          <p className="tracking-wide text-[.9rem] sm:text-lg md:text-xl font-headingfont opacity-75 text-white mb-4">
            Real Money Sports Action Made Easy
          </p>
          <Button className="mt-5" size={"lg"} variant={"outline"}>
            Play Now
          </Button>
        </section>
      </main>

      <Tournaments />

      {/* action section */}
      <main className=" w-full lg:mt-10 min-h-screen px-2 pt-1 lg:pt-3 2xl:pt-5 flex flex-col">
        <div className=" flex justify-center items-center">
          <h1 className=" text-[2rem] sm:text-[3rem] w-full leading-tight lg:text-[3.3rem] 2xl:text-[4rem] font-headingfont text-white outline-text  text-center">
            <span className="opacity-85">Join The</span>{" "}
            <span className="font-dripfont text-[4rem] sm:text-[5rem] lg:text-[6rem] 2xl:text-[7rem] opacity-100  text-custompink">
              Action
            </span>
            <br />
            <span className="opacity-85">And Earn</span>
          </h1>
        </div>

        <div className=" flex justify-center items-center p-3 ">
          <p className="text-center lg:text-[.8rem] 2xl:text-[1rem] font-bodyfont font-normal">
            PlyzRX lets you turn your sports expertise into real money action.
            Simply choose More or Less on two or more players across any sport
            for a chance to win <br className="hidden lg:block" /> up to 1000x
            your entry fee. Build your winning lineup, cash out quickly, and be
            part of a thriving community of daily winners. Betting has never
            been this <br className="hidden lg:block" /> easy with PlyzRX!
          </p>
        </div>

        <div
          className=" h-[40vh] md:h-[75vh] w-[100%] relative flex justify-center items-center"
          style={{
            background: `radial-gradient(circle, rgba(255, 0, 102, 0.4) 0%, rgba(0, 0, 0, 0) 220px)`,
          }}
        >
          <Image
            src="/img/actionimg.png"
            fill
            style={{ objectFit: "contain" }}
            alt="ActionImg"
          />
        </div>

        <div className=" pb-5 flex flex-col justify-center items-center">
          <h1 className=" text-[1.7rem] sm:text-[2.4rem] w-full leading-tight lg:text-[2.7rem] 2xl:text-[3.2rem] font-headingfont text-white outline-text  text-center">
            Join Now and Earn Real{" "}
            <span className="font-dripfont text-[4rem] sm:text-[5rem] lg:text-[6rem] 2xl:text-[7rem] opacity-100  text-custompink">
              Cash
            </span>
          </h1>
          <Button variant={"whitebtn"} size={"lg"}>
            Join Now
          </Button>
        </div>
      </main>

      {/* {where i play} */}

      <main className=" px-2 w-full lg:mt-10 lg:mb-10 min-h-screen pt-1 lg:pt-5 2xl:pt-5 flex flex-col">
        <div className=" flex justify-center items-center font-headingfont">
          <h1 className=" text-[2rem] sm:text-[3rem] w-full leading-tight lg:text-[3.5rem] 2xl:text-[4rem]  text-white outline-text  text-center">
            Where can I play <span className="text-custompink">PlyzRX</span>?
          </h1>
        </div>

        <div className=" flex mb-5 justify-center items-center p-3 ">
          <p className="text-center text-[1rem] md:text-[1.2rem] lg:text-[1.5rem] 2xl:text-[1rem] font-bodyfont font-normal">
            PlyzRX is available in <span className="text-custompink">150</span>{" "}
            Countries , <span className="text-custompink">42</span> US States ,{" "}
            <span className="text-custompink">5</span> Australian Regions
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

      <Footer />
    </>
  );
}
