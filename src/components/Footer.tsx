import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWordpress,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-footercolor font-bodyfont py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-[90%] 2xl:max-w-[86%] flex flex-wrap justify-between items-start gap-6 md:gap-10">
        <div className="w-full sm:w-[40%] md:w-[25%] lg:w-[15%] flex justify-center md:justify-start">
          <div className="w-[80%] h-20 relative">
            <Image
              src="/img/Logo.png"
              style={{ objectFit: "contain" }}
              alt="Logo"
              fill
            />
          </div>
        </div>

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[20%] flex flex-col p-4">
          <h3 className="text-xl mb-5">Learn More</h3>
          <ul className="opacity-85 font-thin">
            <li>
              <Link href="/privacypolicy">Privacy & Policy</Link>
            </li>
            <li>License Agreement</li>
            <li>Cookies</li>
            <li>Dispute Resolution</li>
            <li>Fraud Prevention</li>
            <li>Refund</li>
          </ul>
        </div>

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[19%] flex flex-col p-4">
          <h3 className="text-xl mb-5">Agreement</h3>
          <ul className="opacity-85 font-thin">
            <li>Disclaimer & Provision</li>
            <li>Terms & Condition</li>
            <li>Payment & Withdrawal</li>
          </ul>
        </div>

        <div className="w-full sm:w-[45%] md:w-[25%] lg:w-[25%] p-4 text-white">
          <h2 className="text-xl font-semibold mb-5">Contact Us</h2>
          <div className="flex justify-between">
            <span className="text-gray-400">Phone #1</span>
            <span className="font-medium">123-456-7890</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-400">Email</span>
            <span className="font-medium">abc@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[90%] 2xl:max-w-[86%] flex justify-center lg:justify-end p-4 text-white">
        <div className="flex space-x-4">
          <FaFacebookF className="text-2xl hover:text-blue-500 transition" />
          <FaInstagram className="text-2xl hover:text-pink-500 transition" />
          <FaTwitter className="text-2xl hover:text-blue-400 transition" />
          <FaYoutube className="text-2xl hover:text-red-500 transition" />
          <FaWordpress className="text-2xl hover:text-blue-600 transition" />
        </div>
      </div>

      <div className="w-full max-w-[90%] 2xl:max-w-[86%] border-t-2 border-[rgba(255,255,255,0.5)] flex justify-center items-center mt-6 pt-4">
        <p>&copy; 2019 Lift Media | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
