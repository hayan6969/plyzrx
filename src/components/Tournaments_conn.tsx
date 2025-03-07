"use client";
import React from "react";
import Tourncard from "./Tourncard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
// import { useState, useEffect } from "react";
// const targetDate = new Date(2025, 3, 2, 0, 0, 0);

const tournamentsData = [
  {
    id: "1",
    tier: "Tier 1",
    price: "100,000",
    player1: "1-10",
    payout1: "5,000",
    player: "11-100",
    payout2: "$555",
    time: "7 Days",
    countdays: 0,
    counthr: 0,
    countmin: 0,
    countsec: 0,
    finalprice: "19.99",
  },
  {
    id: "2",
    tier: "Tier 2",
    price: "250,000",
    player1: "1-10",
    payout1: "12,500",
    player: "11-100",
    payout2: "$1,388 Each",
    time: "7 Days",
    countdays: 0,
    counthr: 0,
    countmin: 0,
    countsec: 0,
    finalprice: "49.99",
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
    countdays: 0,
    counthr: 0,
    countmin: 0,
    countsec: 0,
    finalprice: "1000",
  },
];
function Tournaments_conn() {
  // const [tournaments, setTournaments] = useState(tournamentsData);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentDate = new Date();
  //     const diffMs = targetDate.getTime() - currentDate.getTime();

  //     if (diffMs <= 0) {
  //       clearInterval(interval);
  //       setTournaments((prevTournaments) =>
  //         prevTournaments.map((tournament) => ({
  //           ...tournament,
  //           countdays: 0,
  //           counthr: 0,
  //           countmin: 0,
  //           countsec: 0,
  //         }))
  //       );
  //       return;
  //     }

  //     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  //     const hours = Math.floor(
  //       (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //     );
  //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  //     setTournaments((prevTournaments) =>
  //       prevTournaments.map((tournament) => ({
  //         ...tournament,
  //         countdays: days,
  //         counthr: hours,
  //         countmin: minutes,
  //         countsec: seconds,
  //       }))
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <main
      id="tournament"
      className="w-full min-h-screen pt-3 sm:pt-1 lg:pt-3 2xl:pt-5 flex flex-col"
    >
      <div className="h-[11%] p-2 mb-10 flex justify-center items-center">
        <h1 className="leading-4 md:leading-5 lg:leading-6 flex flex-col justify-center items-center">
          {" "}
          <span
            className="text-[2.2rem] md:text-[3rem] lg:text-[4.2rem] 2xl:text-[4.8rem] font-headingfont text-white outline-text opacity-50"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px white",
            }}
          >
            Tournaments
          </span>{" "}
          <br />{" "}
          <span className="text-[4rem] md:text-[5rem] text-custompink lg:text-[5.5rem] 2xl:text-[6rem] font-dripfont">
            Tournaments
          </span>
        </h1>
      </div>
      <section className="flex-grow sm:p-3 flex flex-col lg:flex-row gap-5 justify-center items-center w-full">
        <div className="w-full hidden sm:flex justify-center">
          <div className="max-w-5xl w-full flex flex-wrap justify-center lg:justify-around gap-5">
            {tournamentsData?.map((tournament) => (
              <Tourncard key={tournament.id} {...tournament} />
            ))}
          </div>
        </div>

        {/* Mobile View - Only visible below md screens */}
        <div className="w-full block sm:hidden">
          <Swiper
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={30}
            pagination={false}
            loop={false}
          >
            {tournamentsData?.map((tournament) => (
              <SwiperSlide key={tournament.id} className="!w-auto max-w-full">
                <Tourncard key={tournament.id} {...tournament} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </main>
  );
}

export default Tournaments_conn;
