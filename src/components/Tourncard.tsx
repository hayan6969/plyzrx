import React from "react";
import { Button } from "./ui/button";

const packages = [
  {
    id: "1",
    tier: "Tier 1",
    price: "10,000",
    player1: "1-10",
    payout1: "5,000",
    player: "11-100",
    payout2: "$555",
    time: "7 Days",
    countdays: "0",
    counthr: "22",
    countmin: "40",
    countsec: "24",
    finalprice: "19.00",
  },
  {
    id: "2",
    tier: "Tier 2",
    price: "250,000",
    player1: "1-10",
    payout1: "12,500",
    player: "11-100",
    payout2: "$1388 Each",
    time: "7 Days",
    countdays: "0",
    counthr: "22",
    countmin: "40",
    countsec: "24",
    finalprice: "49.00",
  },

  {
    id: "3",
    tier: "Tier 3",
    price: "5,000,000",
    player1: "1-10",
    payout1: "250,000",
    player: "11-100",
    payout2: "$28,000 Each",
    time: "7 Days",
    countdays: "0",
    counthr: "22",
    countmin: "40",
    countsec: "24",
    finalprice: "1,000",
  },
];

export default function Tourncard() {
  return (
    <>
      {packages.map((pack) => (
        <div
          key={pack.id}
          className="w-70   2xl:w-80 h-[70vh] lg:h-[85vh] py-4 bg-[rgba(255,255,255,0.18)] border-1 border-[rgba(255,255,255,0.18)] backdrop-blur-[6.6px] text-white rounded-3xl shadow-lg border border-gray-700 flex flex-col font-bodyfont"
        >
          <div className=" mx-2  h-[15%] px-2 flex flex-col justify-center">
            <div className="border-b-2 border-[rgba(255,255,255,0.6)] pb-2">
              <h2 className="text-white text-xl lg:text-2xl 2xl:text-[1.5rem] mb-2 font-medium">
                Plyz
              </h2>
              <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold">
                {pack.tier}
              </h1>
            </div>
          </div>

          <div className="mt-2 lg:mt-0 h-[10%] px-4 flex items-center">
            <p className="text-[#B9F566] text-3xl lg:text-4xl 2xl:text-5xl font-bold">
              ${pack.price}
            </p>
          </div>

          <div className="mx-1 h-[30%] px-4 flex flex-col justify-evenly">
            <div className="space-y-2 text-sm lg:text-[1rem] 2xl:text-[1.2rem]">
              <p className="flex justify-between">
                <span>Player</span>
                <span>{pack.player1}</span>
              </p>
              <p className="flex justify-between">
                <span>Payout</span>
                <span>${pack.payout1} Each</span>
              </p>
              <p className="flex justify-between">
                <span>Player</span>
                <span>{pack.player}</span>
              </p>
              <p className="flex justify-between">
                <span>Payout</span>
                <span>${pack.payout2} Each</span>
              </p>
            </div>

            <p className="flex justify-between text-sm lg:text-[1rem] 2xl:text-[1.2rem]">
              <span>Time</span>
              <span>{pack.time}</span>
            </p>
          </div>

          <div className="mx-2 h-[25%] px-4 flex flex-col justify-center border-b-2 border-[rgba(255,255,255,0.6)]">
            <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-center mb-4">
              Time Until Launch
            </p>
            <div className="grid grid-cols-4 gap-1">
              <div className="text-center">
                <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                  {pack.countdays}
                </p>
                <p className="text-xs lg:text-sm">Days</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                  {pack.counthr}
                </p>
                <p className="text-xs lg:text-sm">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                  {pack.countmin}
                </p>
                <p className="text-xs lg:text-sm">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                  {pack.countsec}
                </p>
                <p className="text-xs lg:text-sm">Seconds</p>
              </div>
            </div>
          </div>

          <div className="h-[10%] px-5 flex items-center">
            <div className="w-full flex justify-between items-center  py-2">
              <p className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-[#B9F566]">
                Price
              </p>
              <p className="text-base lg:text-lg 2xl:text-xl font-bold">
                ${pack.finalprice}
              </p>
            </div>
          </div>

          <div className="mx-1 h-[10%] p-4 flex items-center">
            <Button
              variant={"tournamentvarient"}
              className="rounded-3xl overflow-hidden"
              size={"md"}
            >
              Start
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
