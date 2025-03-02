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
            Plyzrx Payment & Withdrawal Policy
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This <strong>Payment & Withdrawal Policy</strong> (&quot;Policy&quot;) sets
              forth the terms governing payments, deposits, withdrawals, and
              associated financial transactions on Plyzrx, a platform operated
              by <strong>Tributo Capital LLC</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot;
              or &quot;us&quot;). By making payments, depositing funds, or withdrawing
              winnings, you (&quot;User,&quot; &quot;Player,&quot; or &quot;you&quot;) agree to be bound by
              this Policy.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Payment & Deposit Terms
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Accepted Payment Methods
            </h3>
            <p>
              Plyzrx accepts the following{" "}
              <strong>
                payment methods for deposits and subscription fees
              </strong>
              :
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Credit/Debit Cards</strong> (Visa, Mastercard, AMEX,
                Discover)
              </li>
              <li>
                <strong>Digital Wallets</strong> (PayPal, Stripe, Apple Pay,
                Google Pay)
              </li>
              <li>
                <strong>Cryptocurrency</strong> (where legally permitted and
                supported by our platform)
              </li>
              <li>
                <strong>Bank Transfers</strong> (available for high-tier
                subscription users)
              </li>
            </ul>
            <p>
              Plyzrx{" "}
              <strong>does not accept cash, checks, or money orders</strong>.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.2 Payment Processing & Transaction Fees
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All deposits are processed immediately, but some transactions
                may require additional verification for fraud prevention.
              </li>
              <li>
                Users agree to pay all applicable fees imposed by their
                financial institution.
              </li>
              <li>
                Plyzrx reserves the right to apply transaction fees for
                deposits, which will be disclosed prior to payment confirmation.
              </li>
              <li>
                Chargebacks, reversed transactions, or fraudulent payments may
                result in account suspension or legal action.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.3 Subscription Payments
            </h3>
            <p>
              Plyzrx operates on a <strong>tiered subscription model</strong>:
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
                <strong>Tier 4:</strong> Custom-tier for higher stakes
              </li>
            </ul>
            <p>
              <strong>Subscriptions automatically renew</strong> unless canceled
              at least <strong>24 hours</strong> before the next billing cycle.
            </p>
            <p>
              All subscription fees <strong>are non-refundable</strong>, except
              where required by law.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Withdrawal Terms & Conditions
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Eligibility for Withdrawals
            </h3>
            <p>
              To <strong>request a withdrawal</strong>, users must meet the
              following criteria:
            </p>
            <ul className="list-disc pl-5">
              <li>
                Complete <strong>KYC (Know Your Customer) verification</strong>,
                including ID verification and proof of residency.
              </li>
              <li>
                Have a minimum <strong>withdrawable balance of \$50</strong>.
              </li>
              <li>
                Withdrawals may only be processed{" "}
                <strong>to the same payment method</strong> used for deposits,
                unless otherwise approved.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 Withdrawal Processing & Timeframes
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <strong>Standard Withdrawals:</strong> Processed within{" "}
                <strong>3-5 business days</strong>.
              </li>
              <li>
                <strong>Bank Transfers:</strong> May take{" "}
                <strong>5-7 business days</strong>, subject to additional
                security checks.
              </li>
              <li>
                <strong>Cryptocurrency Withdrawals:</strong> Processed within{" "}
                <strong>24 hours</strong>, subject to blockchain network
                conditions.
              </li>
              <li>
                Plyzrx reserves the right to{" "}
                <strong>review and delay withdrawals</strong> if suspicious
                activity is detected.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.3 Withdrawal Limits & Fees
            </h3>
            <p>
              Users are subject to the following{" "}
              <strong>withdrawal limits</strong>:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Daily limit:</strong> \$10,000
              </li>
              <li>
                <strong>Weekly limit:</strong> \$50,000
              </li>
              <li>
                <strong>Monthly limit:</strong> \$200,000
              </li>
            </ul>
            <p>
              <strong>Processing Fees:</strong> Plyzrx applies a{" "}
              <strong>3% processing fee</strong> on withdrawals exceeding
              \$5,000.
            </p>
            <p>
              <strong>Currency Conversion Fees:</strong> If withdrawing in a
              different currency, applicable exchange rate fees may apply.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Chargebacks & Fraud Prevention
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Unauthorized Transactions & Chargebacks
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All transactions are <strong>final and non-reversible</strong>{" "}
                once processed.
              </li>
              <li>
                If a chargeback is initiated, Plyzrx reserves the right to{" "}
                <strong>suspend or terminate your account</strong> and forfeit
                winnings.
              </li>
              <li>
                Plyzrx may dispute chargebacks and provide evidence of
                transactions to financial institutions.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Fraudulent Transactions & Account Security
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users must ensure their payment credentials remain{" "}
                <strong>secure and confidential</strong>.
              </li>
              <li>
                Any suspected fraudulent activity, unauthorized access, or
                payment disputes must be reported to Plyzrx{" "}
                <strong>immediately</strong>.
              </li>
              <li>
                If fraudulent activity is detected, Plyzrx may{" "}
                <strong>
                  freeze funds, delay withdrawals, or report the activity to
                  authorities
                </strong>
                .
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Compliance & Regulatory Requirements
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.1 AML (Anti-Money Laundering) Compliance
            </h3>
            <p>
              Plyzrx complies with{" "}
              <strong>U.S. federal and state AML laws</strong> to prevent money
              laundering, fraud, and financial crime. As part of our compliance
              efforts:
            </p>
            <ul className="list-disc pl-5">
              <li>
                We may require <strong>enhanced due diligence (EDD)</strong> for
                large transactions.
              </li>
              <li>
                We report <strong>suspicious activities</strong> to the
                appropriate regulatory agencies.
              </li>
              <li>
                We reserve the right to <strong>deny withdrawals</strong> if a
                transaction is flagged under AML screening.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.2 Tax & Reporting Obligations
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users are responsible for reporting{" "}
                <strong>winnings and income</strong> earned on Plyzrx to their
                local tax authorities.
              </li>
              <li>
                Plyzrx <strong>may issue 1099 forms</strong> for U.S. players
                receiving winnings above legal thresholds.
              </li>
              <li>
                Any tax obligations arising from participation in the Platform
                are <strong>solely the responsibility of the user</strong>.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Dispute Resolution & Governing Law
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.1 Dispute Process
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users must first attempt to resolve payment or withdrawal
                disputes by <strong>contacting Plyzrx support</strong>.
              </li>
              <li>
                If a dispute is not resolved, users agree to{" "}
                <strong>binding arbitration</strong> as the exclusive remedy.
              </li>
              <li>
                Arbitration shall be conducted in accordance with the rules of
                the <strong>American Arbitration Association (AAA)</strong>.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.2 Governing Law
            </h3>
            <p>
              This Policy is governed by the laws of{" "}
              <strong>________________</strong>, without regard to conflicts of
              law principles.
            </p>
            <p>
              Users agree that all legal actions must be brought{" "}
              <strong>in the jurisdiction where Plyzrx is registered</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Amendments & Updates
            </h2>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx reserves the right to{" "}
                <strong>modify this Payment & Withdrawal Policy</strong> at any
                time.
              </li>
              <li>
                Users will be notified of material changes via email or in-app
                notifications.
              </li>
              <li>
                Continued use of the Platform following updates constitutes{" "}
                <strong>acceptance of the revised Policy</strong>.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
