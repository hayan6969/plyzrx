import React from 'react';
import { Search } from 'lucide-react';
import { FaBook, FaTrophy, FaUser, FaMoneyBill, FaClipboard, FaUsers } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import Heading from '@/components/Heading';
import Link from 'next/link';

const HelpCenter = () => {
    const sidebarCategories = [
        { icon: <FaBook />, title: "Getting Started" },
        { icon: <FaTrophy />, title: "Tournaments" },
        { icon: <FaUser />, title: "Account & Profile" },
        { icon: <FaMoneyBill />, title: "Payments" },
        { icon: <FaClipboard />, title: "Safety & Rules" },
        { icon: <FaUsers />, title: "Community" }
    ];

    const policies = [
       { title:"End User License Agreement",link:"/eula"},
       { title:"Cookies Policies",link:"/cookiespolicy"},
       { title:"Disclaimer & Provisions",link:"/disclaimerprovisions"},
       { title:"Dispute Resolution",link:"/cookiespolicy"},
       { title:"Fraud Prevention",link:"/cookiespolicy"},
       { title:"Payment & Withdrawal",link:"/cookiespolicy"},
       { title:"Privacy Policy",link:"/cookiespolicy"},
       { title:"Refund & Chargeback",link:"/cookiespolicy"},
       { title:"Terms & Condition",link:"/cookiespolicy"}
        
    ];

    return (
        <main className='min-h-screen flex flex-col gap-5 font-bodyfont bg-black text-white'
            style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
                  radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
                  #040811
                `,
            }}>
            <div className='py-8 px-4 md:px-8'>
                <Heading headingname='Help Center' />
                <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto mt-5 bg-black rounded-xl overflow-hidden ">
                    
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 flex flex-col items-center  p-5  ">
                        <h2 className="text-xl font-semibold my-4">Help Categories</h2>
                        <nav className="space-y-2 w-full flex flex-col items-center justify-center">
                            {sidebarCategories.map((category, index) => (
                                <button
                                    key={index}
                                    className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-800 transition-colors text-left"
                                >
                                    <span className="text-xl">{category.icon}</span>
                                    <span className="text-sm">{category.title}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4 p-6">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-2xl font-bold mb-2">Help Center</h1>
                            <p className="text-gray-400 mb-4">Find answers to your questions about tournaments, gameplay, and more.</p>
                            
                            {/* Search Bar */}
                            <div className="relative mb-8">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for help articles..."
                                    className="w-full pl-10 pr-4 py-2 bg-white rounded-md text-black focus:outline-none"
                                />
                            </div>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {policies.map((policy, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className=" border rounded-lg overflow-hidden">
                                        <Link href={policy.link} className="   text-left px-4 flex flex-1 items-center justify-between py-4 text-sm">
                                            {policy.title}
                                        </Link>
                                        <AccordionContent className="px-4">
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HelpCenter;
