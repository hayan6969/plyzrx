import React from "react";
import Footer from "@/components/Footer";

function Page() {
  return (
    <>
      <main
        className="w-full text-white min-h-screen flex flex-col relative bg-black px-2"
        style={{
          background: `
          radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          #040811
        `,
        }}
      >
        <section className="pt-10 px-5 mt-5 flex flex-col font-bodyfont">
          <h1 className="text-[1.5rem] md:text-[2rem] font-headingfont text-custompink">
            Plyzrx Terms & Conditions
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              Welcome to Plyzrx, a skill-based gaming platform operated by{" "}
              <strong>Tributo Capital LLC</strong> ("Company," "we," "our," or
              "us"). By accessing or using Plyzrx (the "Platform"), you ("User,"
              "Player," or "you") agree to be bound by these{" "}
              <strong>Terms & Conditions</strong> ("Terms"). If you do not agree
              to these Terms, you must <strong>immediately discontinue</strong>{" "}
              use of the Platform.
            </p>
            <p>
              These Terms constitute a{" "}
              <strong>legally binding agreement</strong> between you and Plyzrx.
              By registering an account, participating in tournaments, or using
              any services provided by the Platform, you{" "}
              <strong>acknowledge and accept</strong> these Terms.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Eligibility & User Restrictions
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Age Requirement
            </h3>
            <p>
              You must be at least <strong>18 years old</strong> (or the age of
              majority in your jurisdiction) to use the Platform.
            </p>
            <p>
              Users from certain states may have a{" "}
              <strong>higher age requirement</strong> (e.g., 21+), and it is
              your responsibility to comply with local laws.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.2 Geographic Restrictions
            </h3>
            <p>
              Plyzrx is available{" "}
              <strong>only in states where skill-based gaming is legal</strong>.
              Users from <strong>prohibited states</strong> (including but not
              limited to <strong>Utah, Washington, and Arizona</strong>) are
              strictly prohibited from participating.
            </p>
            <p>
              The Platform uses <strong>geolocation services</strong> to enforce
              location restrictions. Any attempt to circumvent these measures
              may result in account suspension.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.3 Identity Verification (KYC)
            </h3>
            <p>
              All users must complete{" "}
              <strong>Know Your Customer (KYC) verification</strong> before
              making deposits or withdrawals.
            </p>
            <p>
              We reserve the right to{" "}
              <strong>request additional identity verification</strong> at any
              time.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.4 Multiple Accounts & Fraud Prevention
            </h3>
            <p>
              Each user may <strong>only maintain one account</strong>. Any
              attempts to create multiple accounts, collude with other players,
              or engage in fraudulent activity will result in a{" "}
              <strong>permanent ban</strong> and forfeiture of funds.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Subscription & Monetization
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Subscription Plans
            </h3>
            <p>
              Plyzrx operates on a <strong>tiered subscription model</strong>,
              granting access to competitive tournaments:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Tier 1:</strong> \$19.99/month (Max payout: \$50K)
              </li>
              <li>
                <strong>Tier 2:</strong> \$29.99/month (Max payout: \$100K)
              </li>
              <li>
                <strong>Tier 3:</strong> \$1,000/month (Max payout: \$200K)
              </li>
              <li>
                <strong>Tier 4:</strong> Future tier with a \$1M max payout
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 Payments & Billing
            </h3>
            <p>
              All subscriptions are <strong>billed automatically</strong> on a
              recurring basis.
            </p>
            <p>
              Users may cancel their subscription at any time; however,{" "}
              <strong>no refunds</strong> will be issued for partial billing
              periods.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.3 Alternative Free Entry (AMOE)
            </h3>
            <p>
              Plyzrx offers <strong>a free-to-play mode</strong> where users can
              practice without financial commitment.
            </p>
            <p>
              Select tournaments may allow <strong>free entry</strong> through
              achievement-based or referral-based rewards.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Tournament Rules & Prize Distribution
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Skill-Based Gaming Acknowledgment
            </h3>
            <p>
              Plyzrx is a <strong>100% skill-based gaming platform</strong> and
              is <strong>not classified as gambling</strong> under U.S. laws.
            </p>
            <p>
              Games are structured to ensure that{" "}
              <strong>skill, rather than chance</strong>, determines outcomes.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Tournament Format & Leaderboard System
            </h3>
            <p>
              Tournaments run on a <strong>7-day leaderboard cycle</strong>,
              where the <strong>top 10 players</strong> receive cash prizes.
            </p>
            <p>
              Points are awarded based on{" "}
              <strong>performance, strategy, and consistency</strong>.
            </p>
            <p>
              Tournament results are <strong>final and non-disputable</strong>,
              except in cases of technical malfunctions.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.3 Cash Prize Distribution
            </h3>
            <p>
              Prize payments are{" "}
              <strong>processed within 3-5 business days</strong> after
              tournament completion.
            </p>
            <p>
              Plyzrx <strong>deducts a 3% processing fee</strong> on all
              withdrawals.
            </p>
            <p>
              Users may only{" "}
              <strong>withdraw funds after completing KYC verification</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Prohibited Conduct
            </h2>
            <p>
              You agree <strong>not</strong> to engage in the following
              activities:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Cheating or Hacking:</strong> Use of bots, automated
                scripts, or exploiting game vulnerabilities.
              </li>
              <li>
                <strong>Collusion:</strong> Working with other users to
                manipulate tournament outcomes.
              </li>
              <li>
                <strong>False Identity:</strong> Providing misleading or
                fraudulent information.
              </li>
              <li>
                <strong>Circumventing Geographic Restrictions:</strong> Using
                VPNs or proxies to bypass geolocation rules.
              </li>
              <li>
                <strong>Harassment or Abuse:</strong> Engaging in hate speech,
                threats, or any form of harassment within the community.
              </li>
            </ul>
            <p>
              Violation of these rules may result in{" "}
              <strong>
                account suspension, prize forfeiture, and legal action
              </strong>
              .
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Payments, Refunds & Chargebacks
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.1 Deposits & Withdrawals
            </h3>
            <p>
              Plyzrx accepts <strong>credit/debit cards</strong> (with future
              plans for PayPal & Crypto payments).
            </p>
            <p>
              Withdrawals are{" "}
              <strong>only processed at the end of tournament cycles</strong>.
            </p>
            <p>
              Minimum withdrawal amount: <strong>\$50</strong>.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.2 Refund & Chargeback Policy
            </h3>
            <p>
              <strong>All sales are final.</strong> No refunds are issued unless
              a <strong>verified system malfunction</strong> prevented
              participation.
            </p>
            <p>
              Unauthorized chargebacks will result in{" "}
              <strong>account suspension and possible legal action</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Liability & Disclaimers
            </h2>
            <p>
              Plyzrx <strong>does not guarantee</strong> winnings and is{" "}
              <strong>not responsible for losses</strong>.
            </p>
            <p>
              The Platform operates <strong>on an "as is" basis</strong>, with
              no warranties regarding uninterrupted or error-free gameplay.
            </p>
            <p>
              Users participate <strong>at their own risk</strong>, and Plyzrx
              assumes no liability for{" "}
              <strong>
                network issues, software bugs, or other system failures
              </strong>
              .
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              8. Intellectual Property
            </h2>
            <p>
              Plyzrx <strong>owns all rights</strong> to its games, branding,
              and content.
            </p>
            <p>
              Users{" "}
              <strong>
                may not copy, distribute, or modify any Plyzrx content
              </strong>{" "}
              without permission.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              9. Dispute Resolution & Governing Law
            </h2>
            <p>
              All disputes will be{" "}
              <strong>resolved through binding arbitration</strong> in
              accordance with <strong>U.S. federal arbitration laws</strong>.
            </p>
            <p>
              This agreement is governed by the laws of{" "}
              <strong>________________</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              10. Amendments & Termination
            </h2>
            <p>
              Plyzrx reserves the right to{" "}
              <strong>modify these Terms at any time</strong>, with notice
              provided to users.
            </p>
            <p>
              We may suspend or terminate access to the Platform for{" "}
              <strong>violations of these Terms</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              11. Contact Information
            </h2>
            <p>For legal inquiries or support, contact us at:</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
