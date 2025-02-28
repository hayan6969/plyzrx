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
            Plyzrx Refund & Chargeback Policy
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This <strong>Refund & Chargeback Policy</strong> ("Policy") governs the refund eligibility, chargeback procedures, and dispute resolution terms for financial transactions made on <strong>Plyzrx</strong>, a platform operated by <strong>Tributo Capital LLC</strong> ("Company," "we," "our," or "us"). By making payments, deposits, or withdrawals on Plyzrx, you ("User," "Player," or "you") <strong>agree to comply</strong> with this Policy.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. No Refund Policy
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 General Policy
            </h3>
            <ul className="list-disc pl-5">
              <li><strong>All payments, deposits, and subscription fees are final and non-refundable.</strong></li>
              <li>By completing a transaction on Plyzrx, you <strong>expressly acknowledge</strong> that you <strong>waive your right to request a refund</strong>, except where required by applicable law.</li>
              <li>Refunds will <strong>only</strong> be considered under <strong>exceptional circumstances</strong>, such as a verified <strong>technical failure of the platform</strong> that prevented tournament participation.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.2 Subscription Fees
            </h3>
            <ul className="list-disc pl-5">
              <li>Subscription fees are <strong>non-refundable</strong> once billed.</li>
              <li>Users may <strong>cancel their subscription at any time</strong>, but cancellation will only prevent future billing cycles and <strong>will not</strong> entitle the user to a refund for any remaining period.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.3 Tournament Entry Fees & In-Game Purchases
            </h3>
            <ul className="list-disc pl-5">
              <li>Entry fees for tournaments and other in-game purchases are <strong>non-refundable</strong>, as they contribute to the prize pool and platform maintenance.</li>
              <li>No refunds will be issued for <strong>user error, accidental purchases, or dissatisfaction with gameplay</strong>.</li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Chargeback Policy
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Unauthorized Chargebacks
            </h3>
            <ul className="list-disc pl-5">
              <li>Users <strong>must not</strong> initiate chargebacks or payment disputes without first contacting <strong>Plyzrx Support</strong> to resolve the issue.</li>
              <li><strong>Initiating a chargeback without a valid reason</strong> is a violation of this Policy and may result in:</li>
              <ul className="list-disc pl-5">
                <li><strong>Immediate account suspension or termination</strong>.</li>
                <li><strong>Forfeiture of all winnings, bonuses, and remaining balance</strong>.</li>
                <li><strong>Legal action to recover disputed funds</strong>.</li>
                <li>Reporting the fraudulent chargeback to <strong>financial institutions and credit bureaus</strong>.</li>
              </ul>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 Chargeback Investigation & Resolution
            </h3>
            <ul className="list-disc pl-5">
              <li>If a chargeback is initiated, Plyzrx will conduct an <strong>internal investigation</strong> and provide relevant transaction records to the payment processor.</li>
              <li>If the chargeback is found to be fraudulent or unjustified, Plyzrx <strong>reserves the right to take legal action</strong> to recover lost funds and associated fees.</li>
              <li>Users found abusing the chargeback system may be <strong>permanently banned</strong> from the Platform and reported to authorities.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.3 Recovery of Chargeback Fees
            </h3>
            <ul className="list-disc pl-5">
              <li>Any user who initiates a chargeback <strong>without merit</strong> will be <strong>liable for all fees incurred</strong>, including:</li>
              <ul className="list-disc pl-5">
                <li>Bank processing fees</li>
                <li>Legal fees and administrative costs</li>
                <li>Loss of promotional benefits and bonuses</li>
              </ul>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Refund Exceptions & Special Circumstances
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Technical Issues & Platform Failures
            </h3>
            <ul className="list-disc pl-5">
              <li>If a <strong>verifiable technical failure</strong> on Plyzrx prevents a user from participating in a tournament after payment, Plyzrx <strong>may</strong> issue a refund or tournament credit at its discretion.</li>
              <li>Users must submit <strong>documented proof of the failure</strong> within <strong>24 hours</strong> of the issue occurring.</li>
              <li>Refunds will <strong>not</strong> be granted for internet connectivity issues, lag, or personal device malfunctions.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Unauthorized Transactions
            </h3>
            <ul className="list-disc pl-5">
              <li>If a user believes that a <strong>fraudulent transaction</strong> has been made on their account, they must notify <strong>Plyzrx Support immediately</strong>.</li>
              <li>Plyzrx will investigate the claim, and if verified, a refund <strong>may</strong> be processed.</li>
              <li>Users who fail to report unauthorized transactions within <strong>14 days</strong> of the charge may forfeit the right to claim a refund.</li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Dispute Resolution & Governing Law
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.1 Internal Resolution Process
            </h3>
            <ul className="list-disc pl-5">
              <li>Users <strong>must attempt to resolve disputes directly</strong> with Plyzrx before initiating a chargeback or legal action.</li>
              <li>Disputes must be submitted via email or the support portal, providing <strong>detailed evidence</strong> of the claim.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.2 Arbitration Agreement
            </h3>
            <ul className="list-disc pl-5">
              <li>Any disputes related to refunds or chargebacks shall be resolved <strong>exclusively through binding arbitration</strong>, as per the rules of the <strong>American Arbitration Association (AAA)</strong>.</li>
              <li>Arbitration will take place in <strong>________________</strong>, and users waive their right to participate in class action lawsuits.</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.3 Governing Law
            </h3>
            <ul className="list-disc pl-5">
              <li>This Policy is governed by the laws of <strong>________________</strong>, without regard to conflicts of law principles.</li>
              <li>Any legal action arising from this Policy must be filed <strong>exclusively in the jurisdiction where Plyzrx is registered</strong>.</li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Amendments & Updates
            </h2>
            <ul className="list-disc pl-5">
              <li>Plyzrx reserves the right to <strong>modify this Refund & Chargeback Policy</strong> at any time.</li>
              <li>Users will be notified of material changes via email or in-app notifications.</li>
              <li>Continued use of the Platform following updates constitutes <strong>acceptance of the revised Policy</strong>.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;