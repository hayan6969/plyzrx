"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navlinks = [
    { name: "Home", href: "/" },
    { name: "Tournaments", href: "/about" },
    { name: "How to Play", href: "/howplay" },
    { name: "Help Center", href: "/policies" },
  ];

  return (
    <>
      <nav className="  h-[12%] flex justify-between items-center w-full py-3 px-4 md:px-6 lg:px-8 mt-3">
        <div className="w-[20%] md:w-[15%] lg:w-[20%]"></div>

        <div className="hidden md:flex h-[50px] w-[55%] lg:w-[50%] justify-center items-center">
          <ul className="p-3 flex justify-around font-bodyfont font-medium items-center rounded-3xl bg-white text-black h-full w-full md:text-[.9rem] lg:text-[1rem]">
            {navlinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="p-2 hover:text-custompink transition"
              >
                {link.name}
              </Link>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex justify-evenly items-center  w-[22%] sm:w-[20%] md:w-[24%] lg:w-[24%] h-[55px] px-2 lg:px-4">
         <Link href={"/login"} className=" flex justify-center items-center text-sm lg:text-base bg-custompink text-white shadowds h-[85%] w-[39%] rounded-3xl text-[1rem]">Log in</Link>
         
         <Link href={"/signup"} className=" flex justify-center items-center text-sm lg:text-base bg-white text-custompink  shadow font-bodyfont font-regular h-[85%] w-[39%] rounded-3xl text-[1rem] ">Sign Up</Link>


        </div>

        <button
          className="md:hidden text-custompink focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-white p-4 rounded-lg shadow-md flex flex-col items-center absolute top-[12%] left-0 w-full z-50">
          {navlinks.map((link, index) => (
            <Link
            key={index}
              href={link.href}
              className="block py-2 text-black text-lg w-full text-center hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="w-full flex flex-col items-center mt-2">
            <Button
              variant={"pinkbtn"}
              size={"authheight"}
              className="w-3/4 mb-2"
            >
              Log in
            </Button>
            <Button variant={"whitebtn"} size={"authheight"} className="w-3/4">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

