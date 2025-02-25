import React from "react";
import Footer from "@/components/Footer";

function page() {
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
          <h1 className="text-[2rem] font-headingfont text-custompink">
            Disclaimer & Provisions
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This Disclaimers & Provisions Document (&quot;Document&quot;)
              outlines critical legal protections for Plyzrx, a platform
              operated by Tributo Capital LLC (&quot;Company,&quot;
              &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). The
              provisions included serve to mitigate liability, protect
              intellectual property, and ensure compliance with legal and
              regulatory standards applicable to the Platform.
            </p>
            <p>
              By using Plyzrx, you (&quot;User,&quot; &quot;Player,&quot; or
              &quot;you&quot;) expressly acknowledge and agree to these
              disclaimers and provisions. If you do not agree, you must
              immediately discontinue use of the Platform.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. General Legal Disclaimers
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 No Guarantee of Winnings
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx provides a skill-based gaming environment, but does not
                guarantee that players will earn winnings or profits.
              </li>
              <li>
                Users acknowledge that results depend on individual skill,
                strategy, and competition.
              </li>
              <li>
                Plyzrx is not liable for any financial losses incurred by users
                while participating in tournaments.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.2 No Liability for Third-Party Services
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx may integrate third-party services (e.g., payment
                processors, analytics providers, cloud hosting). These services
                are governed by their respective terms and policies, and Plyzrx
                assumes no liability for third-party failures, outages, or data
                breaches.
              </li>
              <li>
                Users agree that Plyzrx is not responsible for disputes between
                users and third-party service providers.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.3 No Responsibility for User Misconduct
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx is a platform provider and does not control user
                interactions.
              </li>
              <li>
                Users are fully responsible for their conduct, and any abuse,
                harassment, or fraudulent activities may result in account
                termination and legal action.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.4 No Legal, Tax, or Financial Advice
            </h3>
            <ul className="list-disc pl-5">
              <li>Plyzrx does not provide legal, tax, or financial advice.</li>
              <li>
                Users are solely responsible for understanding their local laws
                and reporting any winnings for tax purposes.
              </li>
              <li>
                Plyzrx will comply with tax reporting obligations only where
                required by law (e.g., issuing 1099 forms for U.S. residents
                earning above the required threshold).
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Intellectual Property Protections
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Ownership of Platform Content
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All software, trademarks, branding, and game mechanics on Plyzrx
                are owned exclusively by Tributo Capital LLC.
              </li>
              <li>
                Users may not copy, distribute, reverse-engineer, or exploit any
                Plyzrx content without prior written permission.
              </li>
              <li>
                Unauthorized use of Plyzrx intellectual property will result in
                legal action.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 User-Generated Content License
            </h3>
            <ul className="list-disc pl-5">
              <li>
                By submitting content (e.g., usernames, avatars, chat messages,
                gameplay highlights), users grant Plyzrx a worldwide,
                royalty-free, irrevocable license to use, modify, and distribute
                such content.
              </li>
              <li>
                Plyzrx reserves the right to remove or modify any user-generated
                content that violates community guidelines.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Platform Risks & User Acknowledgments
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Technical Issues & Platform Downtime
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx provides services on an &quot;as is&quot; and &quot;as available&quot; basis.
              </li>
              <li>
                Plyzrx does not guarantee uninterrupted service and is not
                liable for network outages, bugs, or system failures.
              </li>
              <li>
                Refunds will only be issued for verified system-wide failures
                that prevent tournament participation.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 User Device & Security Responsibility
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users are responsible for maintaining the security of their
                devices and login credentials.
              </li>
              <li>
                Plyzrx is not liable for unauthorized account access resulting
                from user negligence (e.g., weak passwords, sharing account
                details).
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.3 Compliance with Local Laws
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users must comply with all applicable laws regarding skill-based
                gaming in their jurisdiction.
              </li>
              <li>
                Plyzrx does not guarantee compliance with gaming laws in all
                locations and reserves the right to restrict access based on
                regulatory changes.
              </li>
              <li>
                Users are responsible for ensuring that participation in Plyzrx
                does not violate local laws.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Financial & Payment Disclaimers
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.1 No Liability for Payment Processing Delays
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All payments and withdrawals are processed by third-party
                financial institutions.
              </li>
              <li>
                Plyzrx is not responsible for delays, errors, or disputes
                arising from bank processing, credit card declines, or
                third-party payment gateway issues.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              5.2 Compliance with AML (Anti-Money Laundering) Regulations
            </h3>

            <ul className="list-disc pl-5">
              <li>
                Plyzrx complies with AML laws and may require identity
                verification (KYC) for large transactions.
              </li>
              <li>
                Suspected fraudulent financial activity will be reported to the
                appropriate regulatory authorities.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Dispute Resolution & Governing Law
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.1 Binding Arbitration Clause
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users agree that any disputes arising from the use of Plyzrx
                shall be resolved through binding arbitration, under the rules
                of the American Arbitration Association (AAA).
              </li>
              <li>Arbitration shall take place in _____________________.</li>
              <li>
                Users waive their right to participate in class-action lawsuits.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.2 Governing Law
            </h3>
            <ul className="list-disc pl-5">
              <li>
                This Document is governed by the laws of ________________,
                without regard to conflict of laws principles.
              </li>
              <li>
                Any claims against Plyzrx must be filed in the jurisdiction of
                its registration.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
            7. Indemnification & Limitation of Liability
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            7.1 User Indemnification
            </h3>
            <p>•	Users agree to indemnify, defend, and hold harmless Plyzrx from any claims, damages, or liabilities arising from: </p>
            <ul className="list-disc pl-5">
<li>User misconduct, fraud, or violation of laws.</li>
<li>Breach of these disclaimers or other Plyzrx policies.</li>
<li>Unauthorized use of Plyzrxs intellectual property.</li>

            </ul>


            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            7.2 Limitation of Liability
            </h3>
            <ul className="list-disc pl-5">
<li>Plyzrxs liability is limited to the amount paid by the user in the past 6 months.</li>
<li>Plyzrx shall not be liable for indirect, incidental, or consequential damages, including loss of winnings, reputational harm, or business losses.</li>


            </ul>


            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
            8. Amendments & Updates
            </h2>
            <ul className="list-disc pl-5">
<li>Plyzrx reserves the right to modify this Custom Disclaimers & Provisions Document at any time.</li>
<li>Users will be notified of material changes via email or in-app notifications.</li>
<li>Continued use of the Platform after updates constitutes acceptance of the revised terms.</li>


            </ul>



          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default page;
