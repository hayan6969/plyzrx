import React from 'react';
import { Input } from "@/components/ui/input";
import { BiSearch } from 'react-icons/bi';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQSection = () => {
  const faqs = [
    {
      icon: "/svgs/email.svg",
      question: "How do I change my account email?",
      answer: "You can log in to your account and change it from your Profile > Edit Profile. Then go to the general tab to change your email."
    },
    {
      icon: "/svgs/payment.svg",
      question: "What should I do if my payment fails?",
      answer: "If your payment fails, you can use the (COD) payment option, if available on that order. If your payment is debited from your account after a payment failure, it will be credited back within 7-10 days."
    },
    {
      icon: "/svgs/cancel.svg",
      question: "What is your cancellation policy?",
      answer: "You can now cancel an order when it is in packed/shipped status. Any amount paid will be credited into the same payment mode using which the payment was made."
    },
    {
      icon: "/svgs/truck.svg",
      question: "How do I check order delivery status?",
      answer: "Please tap on 'My Orders' section under the main menu of App/Website/M-site to check your order status."
    },
    {
      icon: "/svgs/dollar.svg",
      question: "What is Instant Refunds?",
      answer: "Upon successful pickup of the return product at your doorstep, Myntra will instantly initiate the refund to your source account or chosen method of refund. Instant Refunds is not available in a few select pin codes and for all self-ship returns."
    },
    {
      icon: "/svgs/tag.svg",
      question: "How do I apply a coupon on my order?",
      answer: "You can apply a coupon on the cart page before order placement. The complete list of your unused and valid coupons will be available under 'My Coupons' tab of App/Website/M-site."
    }
  ];

  return (
    <>
    <main className="w-full min-h-screen pb-5  text-white"
    style={{
        background: `
          radial-gradient(circle at 10% 30%, rgba(245, 0, 79, 0.15) 10%, transparent 80%),
          radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          #040811
        `
      }}>
        <Navbar/>
   
      <div className="flex flex-col items-center justify-center space-y-2 p-8 font-bodyfont">
        <h1 className="text-6xl lg:text-[6rem] text-custompink font-dripfont">
          FAQ
        </h1>
        <h2 className="text-lg text-gray-300">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-custompink mb-4">
          Have any questions? We're here to assist you.
        </p>
        

        <div className="w-[30%] lg:w-[20%] max-w-xs relative">
          <Input 
            type="search"
            placeholder="Search here..."
            className="w-full pl-10 py-2 bg-white text-black rounded-md"
          />
          <BiSearch 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>


<div className=' w-full flex justify-center items-center flex-col font-bodyfont p-4'>

      <div className=' w-[90%] shadow-[0_0_15px_5px_rgba(255,255,255,0.5)] '>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-formcolor w-full">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-formcolor rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image 
                    src={faq.icon} 
                    alt=""
                    width={16}
                    height={16}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            </CardContent>
          </Card>
        ))}



      </div>


      <div className="flex w-full flex-col items-center justify-center gap-4 py-5 bg-formcolor">
       <div className='border-2 w-[90%] flex justify-between items-center p-6 rounded-md bg-white'>
       <div >
        <p className=" text-custompink">Still have questions?</p>
        <p className="text-sm text-black">Can't find the answer you're looking for? Please refer to our Friendly team.</p>
        </div>
        <Button className="bg-custompink text-white px-6 py-2 rounded-lg hover:bg-[#d4004d]">
          Get in Touch
        </Button>

        </div>
      </div>

      </div>
      
      </div>


    </main>

    <Footer/>
    </>
  );
};

export default FAQSection;