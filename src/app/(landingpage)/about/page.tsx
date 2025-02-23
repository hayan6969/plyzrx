import Heading from "@/components/Heading";
import Navbar from "@/components/Navbar";
import React from "react";
import Aboutcontent from "./components/Aboutcontent";
import Footer from "@/components/Footer";

function page() {
  const aboutcontent = [
    {
      id: 1,
      title: "Our Mission",
      content:
        "We aim to provide a seamless, fun, and responsible gaming environment where players can compete, win, and enjoy",
      afterbr:
        "their favorite games safely. We are dedicated to fair play, transparency, and top-tier security for all our users.",
    },
    {
      id: 2,
      title: "Where We Operate",
      content:
        "Our platform is available in numerous countries, allowing players to participate legally and safely. However, due to",
      afterbr:
        "regional restrictions, access is limited in specific areas. Check our Availability Map to see where you can play.",
    },
    {
      id: 3,
      title: "Security & Fairness",
      content:
        "We use state-of-the-art encryption and AI-driven fraud detection to ensure a secure and fair gaming experience. Our",
      afterbr:
        "RNG-based systems and strict compliance with gaming regulations guarantee fairness for all players.",
    },
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

          <p className="text-center my-5 p-4 font-bodyfont text-lg font-thin">
            <span className="text-custompink">PlyzRX</span> is your go-to
            platform for engaging, skill-based gaming experiences. We connect
            players from around the <br className="hidden lg:block" />
            world in fair and competitive gameplay while ensuring compliance
            with regional regulations.
          </p>

          {aboutcontent.map((content, index) => (
            <div key={index} className="my-5">
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
