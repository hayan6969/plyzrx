"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import PayPalButton from "./PayPalButton";
// Replaced TebexButton with PayPal Card (Advanced) component
import PayPalCardFields from "./paypal/PayPalCardFields";
import PaymentSelectionModal from "./PaymentSelectionModal";

type Tournament = {
  tier: string;
  price: string;
  player1: string;
  payout1: string;
  player: string;
  payout2: string;
  time: string;
  countdays: any;
  counthr: any;
  countmin: any;
  countsec: any;
  finalprice: string;
  id?: string;
  planId: any;
};

export default function Tourncard(tournament: Tournament) {
  const { tier, price, player1, payout1, player, payout2, time, finalprice } =
    tournament;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [userId, setUserId] = useState<string>("anonymous");
  const [username, setUsername] = useState<string>("guest");

  // Dynamic timer state
  const [timerData, setTimerData] = useState({
    countdays: 0,
    counthr: 0,
    countmin: 0,
    countsec: 0,
  });

  // Retrieve user info from localStorage or another source
  useEffect(() => {
    try {
      // Use the same keys as set during auth flow
      const storedUserId = localStorage.getItem("userid");
      const storedUsername = localStorage.getItem("userName");

      if (storedUserId) setUserId(storedUserId);
      if (storedUsername) setUsername(storedUsername);
    } catch (error) {
      console.error("Error retrieving user info:", error);
    }
  }, []);

  useEffect(() => {
    const fetchTimerData = async () => {
      try {
        const response = await fetch("/api/tournament/timers");
        const data = await response.json();

        if (data.success) {
          const tierNumber = tier.toLowerCase().includes("1")
            ? 1
            : tier.toLowerCase().includes("2")
            ? 2
            : 3;

          const tierKey = `tier${tierNumber}` as keyof typeof data.data;
          const tournamentTimer = data.data[tierKey];

          if (tournamentTimer) {
            const targetDate = new Date(tournamentTimer.targetDate);

            // Set up countdown timer
            const interval = setInterval(() => {
              const currentDate = new Date();
              const diffMs = targetDate.getTime() - currentDate.getTime();

              if (diffMs <= 0) {
                clearInterval(interval);
                setTimerData({
                  countdays: 0,
                  counthr: 0,
                  countmin: 0,
                  countsec: 0,
                });
                return;
              }

              const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const hours = Math.floor(
                (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              const minutes = Math.floor(
                (diffMs % (1000 * 60 * 60)) / (1000 * 60)
              );
              const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

              setTimerData({
                countdays: days,
                counthr: hours,
                countmin: minutes,
                countsec: seconds,
              });
            }, 1000);

            // Cleanup interval on component unmount
            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Error fetching tournament timers:", error);
      }
    };

    fetchTimerData();
  }, [tier]);

  const handlePurchase = () => {
    setShowPaymentModal(true);
  };

  const handleSelectPayPal = () => {
    setShowPaymentModal(false);
    setShowPayPal(true);
  };

  const handleSelectCreditCard = () => {
    setShowPaymentModal(false);
    setShowCreditCard(true);
  };

  return (
    <>
      <div className="w-70 2xl:w-80 h-[85vh] lg:h-[90vh] py-4 bg-[rgba(255,255,255,0.18)] border-1 border-[rgba(255,255,255,0.18)] backdrop-blur-[6.6px] text-white rounded-3xl shadow-lg border border-gray-700 flex flex-col font-bodyfont">
        <div className="mx-2 h-[15%] px-2 flex flex-col justify-center">
          <div className="border-b-2 border-[rgba(255,255,255,0.6)] pb-2">
            <h2 className="text-white text-xl lg:text-2xl 2xl:text-[1.5rem] mb-2 font-medium">
              Plyz
            </h2>
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold">
              {tier}
            </h1>
          </div>
        </div>

        <div className="mt-2 lg:mt-0 h-[10%] px-4 flex items-center">
          <p className="text-[#B9F566] text-3xl lg:text-4xl 2xl:text-5xl font-bold">
            ${price}
          </p>
        </div>

        <div className="mx-1 h-[30%] px-4 flex flex-col justify-evenly">
          <div className="space-y-2 text-sm lg:text-[1rem] 2xl:text-[1.2rem]">
            <p className="flex justify-between">
              <span>Player</span>
              <span>{player1}</span>
            </p>
            <p className="flex justify-between">
              <span>Payout</span>
              <span>${payout1} Each</span>
            </p>
            <p className="flex justify-between">
              <span>Player</span>
              <span>{player}</span>
            </p>
            <p className="flex justify-between">
              <span>Payout</span>
              <span>{payout2}</span>
            </p>
          </div>

          <p className="flex justify-between text-sm lg:text-[1rem] 2xl:text-[1.2rem]">
            <span>Time</span>
            <span>{time}</span>
          </p>
        </div>

        <div className="mx-2 h-[25%] px-4 flex flex-col justify-center border-b-2 border-[rgba(255,255,255,0.6)]">
          <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-center mb-4">
            Time Until Launch
          </p>
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center">
              <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                {timerData.countdays}
              </p>
              <p className="text-xs lg:text-sm">Days</p>
            </div>
            <div className="text-center">
              <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                {timerData.counthr}
              </p>
              <p className="text-xs lg:text-sm">Hours</p>
            </div>
            <div className="text-center">
              <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                {timerData.countmin}
              </p>
              <p className="text-xs lg:text-sm">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold">
                {timerData.countsec}
              </p>
              <p className="text-xs lg:text-sm">Seconds</p>
            </div>
          </div>
        </div>

        <div className="h-[10%] px-5 flex items-center">
          <div className="w-full flex justify-between items-center py-2">
            <p className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-[#B9F566]">
              Price
            </p>
            <p className="text-base lg:text-lg 2xl:text-xl font-bold">
              ${finalprice}
            </p>
          </div>
        </div>

        <div className={`mx-1 h-[10%] p-4 flex items-center`}>
          <Button
            className="rounded-3xl overflow-hidden"
            size={"md"}
            onClick={handlePurchase}
          >
            Purchase
          </Button>
        </div>

        {showPaymentModal && (
          <PaymentSelectionModal
            onClose={() => setShowPaymentModal(false)}
            tier={tier}
            finalprice={finalprice}
            userId={userId}
            username={username}
            onSelectPayPal={handleSelectPayPal}
            onSelectCreditCard={handleSelectCreditCard}
          />
        )}

        {showPayPal && (
          <div
            className="fixed rounded-3xl inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPayPal(false)}
          >
            <div
              className="relative p-6 bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-5 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-300 transition"
                onClick={() => setShowPayPal(false)}
              >
                ✕
              </button>

              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {tier} Tournament
                </h2>
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  Total: ${finalprice}
                </p>
              </div>

              <div className="mt-6">
                <PayPalButton
                  amount={finalprice}
                  userId={userId}
                  username={username}
                />
              </div>
            </div>
          </div>
        )}

        {showCreditCard && (
          <div
            className="fixed inset-0 bg-black/20 flex items-start justify-center z-50 p-4"
            onClick={() => setShowCreditCard(false)}
          >
            <div
              className="relative w-full max-w-lg bg-white  shadow-xl p-5 mt-10 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fixed top-5 right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-300 transition"
                onClick={() => setShowCreditCard(false)}
              >
                ✕
              </button>

              <div className="mb-3 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {tier} Tournament
                </h2>
                <p className="text-base font-medium text-gray-700 mt-1">
                  Total: ${finalprice}
                </p>
              </div>

              <div className="mt-2">
                <PayPalCardFields
                  amount={finalprice}
                  userId={userId}
                  username={username}
                  onClose={() => setShowCreditCard(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
