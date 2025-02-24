import React from "react";
import Heading from "@/components/Heading";
import Footer from "@/components/Footer";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

function Play() {
  const pricedata = [
    {
      title: "Tier 1",
      con1: "Players Who land in the Top 10 ",
      con11: " Each get a Payout Amount of $5,000",
      con2: "Players 11 - 100",
      con3: "Players who Land in the Top 100 from 11-100 Each win $555",
    },
    {
      title: "Tier 2",
      con1: "Players Who land in the Top 10",
      con11: " Each get a Payout Amount of $12,500.00",
      con2: "Players 11 - 100",
      con3: "Players who Land in the Top 100 from 11-100 Each win $1,388",
    },
    {
      title: "Tier 3",
      con1: "Players Who land in the Top 10",
      con11: " Each get a Payout Amount of $250,000",
      con2: "Players 11 - 100",
      con3: "Players who Land in the Top 100 from 11-100 Each win $25,000",
    },
  ];

  const rules = [
    "Tournament is for 7 Days",
    "Must play once for each day for the 7 days",
    "Once the tournament begins, you can't sign up until it's over",
    "No Cheating",
    "No bots",
  ];

  return (
    <>
      <div
        className="text-white min-h-screen pb-10 font-bodyfont"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
            radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
            #040811
          `,
        }}
      >
        <section className="pt-10 w-[90%] lg:w-[85%] mx-auto rounded-xl">
          <Heading headingname="How to Play" />

          <div className="flex flex-col w-full">
            <div className="p-6 flex flex-col justify-center items-center text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-headingfont">
                Tournament Prize
              </h1>
              <p className="text-lg">
                Each tournament tier allows players a chance to win cash prizes
              </p>
            </div>

            <div className="w-full flex flex-wrap justify-center gap-6 p-6">
              {pricedata.map((data, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-lg text-white rounded-2xl p-6 sm:p-8 w-full sm:w-80 shadow-lg relative border border-white border-opacity-20"
                >
                  <div
                    className="absolute -top-3 left-4 text-white text-sm px-3 py-1 rounded-md"
                    style={{
                      background: `linear-gradient(90deg, #5797D1 0%, #0F3782 100%)`,
                    }}
                  >
                    {data.title}
                  </div>
                  <div className="flex items-center justify-start mb-4">
                    <Image
                      width={40}
                      height={40}
                      src={"/svgs/Frame.svg"}
                      alt="logo"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-left mb-4">
                    {data.title}
                  </h2>
                  <ul className="space-y-2 text-md">
                    <li className="flex items-center gap-2 ">
                      <FaCheckCircle className="text-green-500 w-8 h-8" />
                      {data.con1}
                      <br className="hidden lg:block" />
                      {data.con11}
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 w-4 h-4" />
                      {data.con2}
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 w-8 h-8" />
                      {data.con3}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="p-6 flex flex-col justify-center items-center text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-headingfont text-custompink">
                Tournament Rules
              </h1>
              <p className="text-lg">
                Each tournament tier allows players a chance to win cash prizes
              </p>
            </div>

            <div className="bg-black rounded-lg p-6 sm:p-10 flex flex-col items-start">
              {rules.map((rule, index) => (
                <li className="mx-5 text-lg md:text-xl lg:text-2xl" key={index}>
                  {rule}
                </li>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Play;
