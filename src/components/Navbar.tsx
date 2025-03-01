"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import UserProfileIcon from "@/app/(landingpage)/components/UserProfileIcon";
import axios from "axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
const [username,SetUsername]=useState("")
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/check");

      if (response.data.success) {
        setProfile(true);

        localStorage.setItem("Login", "true");
      } else {
        setProfile(false);
        localStorage.setItem("Login", "false");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setProfile(false);
      localStorage.setItem("Login", "false");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) {
      SetUsername(storedUsername);
    }
    checkAuthStatus();
  }, []);

  const navlinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How to Play", href: "/howplay" },
    { name: "Help Center", href: "/helpcenter" },
  ];

  return (
    <>
      <nav className="bg-transparent h-[12%] flex justify-between items-center w-full py-3 px-4 md:px-6 lg:px-8">
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

        <div className="hidden md:flex justify-evenly items-center w-[22%] sm:w-[20%] md:w-[24%] lg:w-[24%] h-[55px] px-2 lg:px-4">
          {isLoading ? (
            <div className="flex justify-center items-center w-full">
              <div className="w-6 h-6 border-2 border-custompink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : showProfile ? (
            <Link href={"/profile"} className="flex justify-center items-center">
              <UserProfileIcon />
              <span className="text-sm ml-6 text-white">{username}</span>

            </Link>
          ) : (
            <>
              <Link
                href={"/login"}
                className="flex justify-center items-center text-sm lg:text-base bg-custompink text-white shadowds h-[85%] w-[39%] rounded-3xl text-[1rem]"
              >
                Log in
              </Link>

              <Link
                href={"/signup"}
                className="flex justify-center items-center text-sm lg:text-base bg-white text-custompink shadow font-bodyfont font-regular h-[85%] w-[39%] rounded-3xl text-[1rem]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-custompink focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-white p-4 rounded-lg shadow-md flex flex-col items-center absolute mx-auto top-[12%] w-[100%] z-50">
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
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="w-6 h-6 border-2 border-custompink border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : showProfile ? (
              <Link
                className="flex items-center justify-center gap-2 w-2/4 py-2 mb-2 rounded-3xl border"
                href={"/profile"}
              >
                <UserProfileIcon />
                <span className="text-sm text-black">{username}</span>
              </Link>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="bg-custompink text-white shadow font-bodyfont font-regular flex justify-center items-center w-2/4 py-2 mb-2 border h-[85%] rounded-3xl text-[1rem]"
                >
                  Log in
                </Link>
                <Link
                  href={"/signup"}
                  className="bg-white text-custompink shadow font-bodyfont font-regular flex justify-center items-center w-2/4 py-2 mb-2 border border-custompink h-[85%] rounded-3xl text-[1rem]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
