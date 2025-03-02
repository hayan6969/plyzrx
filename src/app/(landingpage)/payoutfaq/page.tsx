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
            PlyzRX Payout FAQs
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. How do I receive my payouts from PlyzRX?
            </h2>
            <p>
              We process all payouts through <strong>Deel.com</strong>, a secure
              and global payment platform. To receive your winnings, follow
              these steps:
            </p>
            <ol className="list-decimal pl-5">
              <li>
                <strong>Create an account on Deel.</strong>
              </li>
              <li>
                <strong>
                  Complete the KYC (Know Your Customer) verification process.
                </strong>
              </li>
              <li>
                <strong>Sign the PlyzRX agreement contract within Deel.</strong>
              </li>
              <li>
                Once verified, log in to Deel under our organization and request
                your payout.
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. What payout methods are available?
            </h2>
            <p>Deel offers multiple payout options, including:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Bank Transfers (ACH & Wire)</strong>
              </li>
              <li>
                <strong>Cryptocurrency Payments</strong>
              </li>
              <li>
                <strong>Other Supported Methods (Varies by Region)</strong>
              </li>
            </ul>
            <p>
              You can select your preferred method when requesting a withdrawal.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. How long does it take to receive my payout?
            </h2>
            <p>Processing times depend on the chosen payment method:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>ACH & Wire Transfers:</strong> Typically 1-5 business
                days
              </li>
              <li>
                <strong>Crypto Payments:</strong> Usually instant to a few hours
              </li>
              <li>
                <strong>Other Methods:</strong> Varies based on Deel
                processing time
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Do I need to pay any fees for withdrawals?
            </h2>
            <p>
              PlyzRX does not charge withdrawal fees, but Deel or your selected
              payment provider may have transaction fees depending on your
              chosen payout method. Check Deel platform for specific details.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Is there a minimum payout amount?
            </h2>
            <p>
              Yes, the minimum payout threshold is <strong>\$50</strong>. You
              must accumulate this amount in winnings before requesting a
              withdrawal.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. What happens if my payout request is delayed or rejected?
            </h2>
            <p>If you experience issues, ensure:</p>
            <ul className="list-disc pl-5">
              <li>Your KYC verification is complete on Deel.</li>
              <li>Your bank or crypto wallet details are correct.</li>
              <li>You meet the minimum payout threshold.</li>
            </ul>
            <p>
              If issues persist, please contact <strong>PlyzRX Support</strong>{" "}
              or <strong>Deel Customer Service</strong> for assistance.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Can I change my payout method after signing up?
            </h2>
            <p>
              Yes! Deel allows you to update your preferred payment method at
              any time within your account settings.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
