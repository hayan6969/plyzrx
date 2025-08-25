"use client";
import {

  FaInstagram,

} from "react-icons/fa";
import { RiDiscordFill } from "react-icons/ri";
import Link from "next/link";
import { useEffect, useState } from "react";



const Footer = () => {
  const [theYear,setYear]=useState(0)
useEffect(()=>
{
  const currentYear = new Date().getFullYear();

  setYear(currentYear)
},[])


  return (
    <footer className="footerglassy font-bodyfont py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-[90%] 2xl:max-w-[86%] flex flex-wrap justify-between items-start gap-6 md:gap-10">
     

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[20%] flex flex-col p-4">
          <h3 className="text-xl mb-5">Learn More</h3>
          <ul className="opacity-85 font-thin">
            <li className="my-1">
              <Link href="/privacypolicy">Privacy & Policy</Link>
            </li>
            <li className="my-1"><Link href="/cookiespolicy">Cookies</Link></li>
            <li className="my-1"><Link href="/dispute">Dispute Resolution</Link></li>
            <li className="my-1"><Link href="/fraudprevention">Fraud Prevention</Link></li>
            <li className="my-1"><Link href="/refund">Refund</Link></li>
          </ul>
        </div>

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[19%] flex flex-col p-4">
          <h3 className="text-xl mb-5">Agreement</h3>
          <ul className="opacity-85 font-thin">
            <li><Link href="/disclaimerprovisions">Disclaimer & Provision</Link></li>
            <li><Link href="/termsandcondition">Terms & Condition</Link></li>
            <li><Link href="/termsandcondition">Payment & Withdrawal</Link></li>
          </ul>
        </div>

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[25%] p-4 text-white">
          <h2 className="text-xl font-semibold mb-5">Contact Us</h2>
          <div className="flex justify-between mt-2">
            <span className="text-gray-400">Email</span>
            <span className="font-medium"><Link href={"mailto:Support@plyzrx.com "}>Support@plyzrx.com </Link></span>
          </div>
        </div>
        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[25%] flex justify-center lg:flex-col lg:justify-end p-4 text-white">
        <h3 className="text-xl mb-5 lg:block hidden">Social Links</h3>
        <div className="flex space-x-4">
       <Link href={"https://discord.gg/XYyxYhvDHF"}> <RiDiscordFill  className="text-2xl hover:text-blue-500 transition" /></Link>
         <Link href={"https://www.instagram.com/plyzrx?igsh=MTB3dTF2YTBlNHBzZQ=="}> <FaInstagram className="text-2xl hover:text-pink-500 transition" /></Link>
          {/* <FaTwitter className="text-2xl hover:text-blue-400 transition" />
          <FaYoutube className="text-2xl hover:text-red-500 transition" /> */}
        </div>
      </div>
      </div>

    

      <div className="w-full max-w-[90%] 2xl:max-w-[86%] border-t-2 border-[rgba(255,255,255,0.5)] flex justify-center items-center mt-6 pt-4">
        <p>&copy; {theYear} Plyzrx | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
