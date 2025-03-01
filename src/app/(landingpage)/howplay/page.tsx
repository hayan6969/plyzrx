"use client";
import React from "react";
import Heading from "@/components/Heading";
import Footer from "@/components/Footer";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { pricedata, rules } from "./data";
import "swiper/css";
import "swiper/css/pagination";

function Play() {
  const PriceCard = ({ data }: { data: typeof pricedata[0] }) => (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg text-white rounded-2xl p-10 sm:p-6 w-full min-w-[260px] max-w-[300px] shadow-lg relative border border-white border-opacity-20">
      <div
        className="absolute top-[0rem] sm:-top-3 left-4 text-white text-sm px-3 py-1 rounded-md"
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
      <h2 className="text-2xl font-bold text-left mb-4">
        {data.title}
      </h2>
      <ul className="space-y-2 text-md">
        <li className="flex items-center gap-2 ">
          <FaCheckCircle className="text-green-500 w-7 h-7" />
          <span>
            {data.con1}
            {data.con11}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500 w-4 h-4" />
          {data.con2}
        </li>
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500 w-7 h-7" />
          {data.con3}
        </li>
      </ul>
    </div>
  );

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
        <section className="pt-10 w-[95%] lg:w-[85%] mx-auto rounded-xl">
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


<div className="w-full sm:block md:hidden p-0">
  <Swiper 
    slidesPerView="auto" 
    centeredSlides={true} 
    spaceBetween={10} 
    pagination={false} 
    loop={false} 
  >
    {pricedata.map((data, index) => (
      <SwiperSlide key={index} className="!w-auto max-w-full">
        <PriceCard data={data} />
      </SwiperSlide>
    ))}
  </Swiper>
</div>

<div className="hidden md:flex flex-wrap justify-center gap-6 p-6">
  {pricedata.map((data, index) => (
    <div key={index} className="w-full sm:w-80">
      <PriceCard data={data} />
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