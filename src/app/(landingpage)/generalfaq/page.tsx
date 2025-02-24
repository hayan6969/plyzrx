import Footer from "@/components/Footer";
import React from "react";

function page() {
  return (
    <>
      <main
        className=" w-full text-white min-h-screen  pt-10"
        style={{
          background: `
          radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          #040811
        `,
        }}
      >
        <div className="h-[11%] p-4 mb-2 flex justify-center items-center">
          <h1 className="leading-4 lg:leading-5 flex flex-col justify-center items-center">
            <span
              className=" text-[2.2rem] lg:text-[4.2rem] 2xl:text-[4.8rem] font-headingfont text-white outline-text opacity-50"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px #F5004F ",
              }}
            >
              General FAQ
            </span>{" "}
            <br />{" "}
            <span className=" z-10 text-[4rem] text-white lg:text-[5.5rem] 2xl:text-[6rem] font-dripfont">
              General FAQ
            </span>
          </h1>
        </div>

        <section className="pt-10 px-5 mt-5 flex flex-col font-bodyfont">
          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-thin mt-5 font-headingfont text-custompink">
              1. What is PlyzRX?
            </h2>
            <p>
              PlyzRX is a skill-based, Uno-styled mobile gaming app where
              players can compete in cash prize tournaments or enjoy
              free-to-play practice games.
            </p>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-custompink">
              2. How does PlyzRX work?
            </h2>

            <p>
              Players can subscribe to tiered tournaments, earn points through
              gameplay, and redeem them for rewards or cash prizes. The app
              offers fair matchmaking, competitive ranking systems, and a prize
              store for redeeming winnings.
            </p>

            <h1 className=" text-[1.5rem] mt-3 font-headingfont text-custompink">
              Subscription & Tournaments
            </h1>
            <h3 className="text-lg font-semibold mt-3 font-headingfont text-white">
              3. What are the subscription tiers and benefits?
            </h3>
            <p>
              We offer three subscription tiers for tournament entry, each with
              different prize pools:
            </p>
            <ul className="list-disc pl-5">
              <li>Tier 1 ($19.99/7 days) – Prize pool: $200,000</li>
              <li>Tier 2 ($49.99/7 days) – Prize pool: $500,000</li>
              <li>Tier 3 ($1,000/7 days) – Prize pool: $10,000,000</li>
            </ul>
            <p>Subscribers can compete for cash prizes based on rankings. </p>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              4. Can I join a tournament at any time?
            </h2>
            <p>
              No. Players must pre-subscribe to tournaments. Once enough players
              sign up, the tournament opens for a 7-day competition.{" "}
            </p>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              5. What happens after a tournament ends?
            </h2>
            <p>After 7 days, all scores reset, and a new tournament begins.</p>

            <h1 className=" text-[1.5rem] mt-3 font-headingfont text-custompink">
              Free-to-Play Mode & Rewards
            </h1>
            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              6. Can I play PlyzRX for free?
            </h2>
            <p>
              Yes! Free players can join practice games, win points (virtual
              currency), and redeem them for prizes.
            </p>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              7. What is the Losers Raffle?
            </h2>
            <p>
              Subscribed players who don&apos;t win cash prizes are automatically
              entered into a monthly raffle to win additional rewards. Five
              random losers win each month{" "}
            </p>

            <h1 className=" text-[1.5rem] mt-3 font-headingfont text-custompink">
              Points & Rankings
            </h1>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              8. How does the points system work?
            </h2>
            <p>Points are earned based on Uno-style</p>
            <ul className="list-disc pl-5">
              <li>Number cards (0-9) = Face value points</li>
              <li>Action cards (Skip, Reverse, Draw Two) = 20 points</li>
              <li>Wild cards (Wild, Wild Draw Four) = 50 points</li>
              <li>
                The winner of a match gets the sum of points left in opponents
                hands.
              </li>
            </ul>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              9. What are Skill Points (SP)?
            </h2>
            <p>
              SP measures a players overall skill level and determines
              matchmaking. Higher SP = stronger opponents.
            </p>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              10. What are Ticketz?
            </h2>
            <p>
              Ticketz are earned by winning matches and can be redeemed for
              cash, gift cards, or prizes in the store.{" "}
            </p>

            <h1 className=" text-[1.5rem] mt-3 font-headingfont text-custompink">
              Payouts & Withdrawals
            </h1>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              11. How do I get paid if I win?
            </h2>
            <p>
              Payouts are processed through Deel.com. Steps to withdraw
              winnings:
            </p>
            <ul className="list-decimal pl-5">
              <li>Create a Deel account</li>
              <li>Complete KYC verification</li>
              <li>Sign the PlyzRX agreement contract</li>
              <li>Log in to Deel and request a payout</li>
            </ul>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              12. What payout methods are available?
            </h2>

            <ul className="list-disc pl-5">
              <li>Bank Transfer (ACH & Wire)</li>
              <li>Cryptocurrency</li>
              <li>Other methods (Varies by region)</li>
            </ul>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              13. How long does it take to receive my payout?
            </h2>

            <ul className="list-disc pl-5">
              <li>ACH & Wire Transfers: 1-5 business days</li>
              <li>Crypto Payments: Instant to a few hours</li>
            </ul>

            <h1 className=" text-[1.5rem] mt-3 font-headingfont text-custompink">
              Technical Issues & Support
            </h1>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              14. What should I do if I experience technical difficulties?
            </h2>
            <p>
              If you experience issues such as game crashes, connection
              problems, or payment failures, follow these steps:
            </p>
            <ul className="list-decimal pl-5">
              <li>
                {" "}
                Restart the App: Close and reopen the PlyzRX app to see if the
                issue resolves.
              </li>
              <li>
                Check Your Internet Connection: Ensure you have a stable Wi-Fi
                or mobile data connection.
              </li>
              <li>
                Clear Cache & Update: Clear the app cache or update to the
                latest version in the App Store or Google Play.
              </li>
              <li>
                Report the Issue: Contact PlyzRX Support through the in-app Help
                Center or via email at [Support Email].
              </li>
            </ul>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              15. What if I was disconnected during a tournament match?
            </h2>
            <p>If you lose connection during a match: </p>
            <ul className="list-decimal pl-5">
              <li>
                {" "}
                The game will attempt to reconnect automatically within a few
                seconds.
              </li>
              <li>
                If the connection is lost permanently, the match may be
                forfeited based on tournament rules.
              </li>
              <li>
                Contact PlyzRX Support if you believe a glitch or server issue
                affected your game.
              </li>
            </ul>

            <h2 className="text-xl font-thin mt-5 font-headingfont text-white">
              16. My payout request is delayed or rejected. What should I do?
            </h2>

            <ul className="list-decimal pl-5">
              <li>Your KYC verification is complete on Deel.</li>
              <li>Your bank or crypto wallet details are correct.</li>
              <li>You meet the minimum payout threshold</li>
            </ul>
            <br />
            <p>
              If issues persist, contact Deel Customer Service or PlyzRX Support{" "}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default page;
