import Heading from "@/components/Heading";
import React from "react";
import Aboutcontent from "./components/Aboutcontent";
import Footer from "@/components/Footer";

function page() {
  const aboutcontent = [
    {
      id:1,
      title:"Our Creative",
      content:"What if you could play Uno at a casino and win 6 figures! Our platform plyzrx lets you play our game Playzo which was inspired from the original Game! ",
afterbr:"Our platform plyzrx solves just that, play our game and if you’re the best at it you will win a cash prize and depending on which tournament you enter you can win up to $250k just by having fun playing our games."
    },
    {
      id: 2,
      title: "Our Mission",
      content:
        "Listen we know how frustrating it is to hit a parley and not get paid or play other skilled based games and have issues withdrawing! We operate",
      afterbr:
        "with full transparency in regards to our games! If you are a skilled player and land in the top 100 YOU WILL GET PAID!",
    },
    {
      id: 3,
      title: "Where We Operate",
      content:
        "Our platform is available in numerous countries, allowing players to participate legally and safely. However, due to",
      afterbr:
        "regional restrictions, access is limited in specific areas. Check our Availability Map to see where you can play.",
    },
    {
      id: 4,
      title: "Security & Fairness",
      content:
        "We use state-of-the-art encryption and AI-driven fraud detection to ensure a secure and fair gaming experience. Our",
      afterbr:
        "RNG-based systems and strict compliance with gaming regulations guarantee fairness for all players.",
    },
    {
      id:5,
      title:"Join the action and earn",
      content:"Plyzrx lets you play fun skilled based games and make a 6 figure income ! Simply choose a",
      afterbr:"tournament to get into and play and win a cash prize"
    }
  ];

  return (
    <>
      <main
        className="w-full text-white min-h-screen flex flex-col relative bg-black"
        style={{
          background: `
          radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          #040811
        `,
        }}
      >
        <section className="pt-10  mt-5">
          <Heading headingname={"About Us"} />

          <p className="text-center my-5 mx-auto p-4 w-[90%]   font-bodyfont text-lg font-thin">
            <span className="text-custompink">PlyzRX</span> is your go-to
            platform for engaging, skill-based gaming experiences. We connect
            players from around the 
            world in fair and competitive gameplay while ensuring compliance
            with regional regulations. We strive to make our games engaging and
            competitive so that everyone has a chance of winning!
          </p>

          {aboutcontent.map((content, index) => (
          <div key={index} className=" my-5 flex flex-col items-center">
          <Aboutcontent
            title={content.title}
            content={content.content}
            afterbr={content.afterbr}
          />
        </div>
        
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default page;
