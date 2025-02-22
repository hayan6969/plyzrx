import React from "react";
import Tourncard from "./Tourncard";

function Tournaments_conn() {
  return (
    <main className="w-full min-h-screen pt-1 lg:pt-3 2xl:pt-5 flex flex-col">
      <div className="h-[11%] p-2 mb-10 flex justify-center items-center">
        <h1 className="leading-4 lg:leading-6 flex flex-col justify-center items-center">
          {" "}
          <span
            className=" text-[2.2rem] lg:text-[4.2rem] 2xl:text-[4.8rem] font-headingfont text-white outline-text opacity-50"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px white",
            }}
          >
            Tournaments
          </span>{" "}
          <br />{" "}
          <span className=" text-[4rem] text-custompink lg:text-[5.5rem] 2xl:text-[6rem] font-dripfont">
            Tournaments
          </span>
        </h1>
      </div>
      <section className=" flex-grow p-3 flex flex-col lg:flex-row gap-5 justify-around items-center">
        <Tourncard />
      </section>
    </main>
  );
}

export default Tournaments_conn;
