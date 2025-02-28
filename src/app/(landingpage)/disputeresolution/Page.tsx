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
          <h1 className="text-[1.5rem] md:text-[2rem]  font-headingfont text-custompink">
            Plyzrx Dispute Resolution & Content Moderation Policy
          </h1>
          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This Dispute Resolution & Content Moderation Policy ("Policy")
              outlines the rules and procedures for resolving user disputes and
              ensuring appropriate content moderation on Plyzrx, a platform
              operated by Tributo Capital LLC ("Company," "we," "our," or "us").
              By using Plyzrx, you ("User," "Player," or "you") agree to comply
              with this Policy.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Dispute Resolution Process
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Internal Resolution Procedure
            </h3>
            <p>
              Users must attempt to resolve disputes by first contacting Plyzrx
              Support through the in-app help center or via [Insert Contact
              Info].
            </p>
            <p>
              All dispute claims must be submitted within 7 days of the disputed
              event, along with relevant evidence such as screenshots,
              transaction records, or correspondence. Plyzrx will review
              disputes and respond within 5-10 business days.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.2 Binding Arbitration
            </h3>
            <p>
              If a dispute cannot be resolved through internal resolution, it
              shall be submitted to binding arbitration under the rules of the
              American Arbitration Association (AAA). Arbitration shall take
              place in [Insert Location].
            </p>
            <p>
              Users waive the right to pursue claims through class-action
              lawsuits or traditional court proceedings. Arbitration decisions
              shall be final and legally binding.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.3 Governing Law
            </h3>
            <p>
              This Policy is governed by the laws of [Insert Jurisdiction],
              without regard to conflicts of law principles. Any claims or
              disputes shall be adjudicated exclusively in the designated
              jurisdiction.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Content Moderation Policy
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Prohibited Content
            </h3>
            <ul className="list-disc pl-5">
              <li>Hate Speech & Harassment</li>
              <li>Illegal or Fraudulent Content</li>
              <li>Cheating or Exploit Promotion</li>
              <li>Sexually Explicit or Violent Content</li>
              <li>False or Misleading Information</li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 Content Review & Enforcement
            </h3>
            <p>
              Plyzrx employs AI-driven content monitoring alongside manual
              moderation by compliance teams. If prohibited content is detected,
              Plyzrx reserves the right to remove or restrict access
              immediately.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Reporting & Appeal Process
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Reporting Violations
            </h3>
            <p>
              Users may report content violations or unfair gameplay by
              submitting a complaint through Plyzrx Support.
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Appeal Rights
            </h3>
            <p>
              Users who have been penalized for violations may submit an appeal
              within 7 days of the action taken against their account. Appeals
              must be sent to [Insert Contact Info] with supporting evidence.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Consequences of Violations
            </h2>
            <ul className="list-disc pl-5">
              <li>Temporary account restrictions or suspensions</li>
              <li>Permanent bans for repeated offenses</li>
              <li>
                Forfeiture of prizes, tournament winnings, and account balances
              </li>
              <li>Legal action in severe cases</li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Amendments & Updates
            </h2>
            <p>
              Plyzrx reserves the right to modify this Policy at any time. Users
              will be notified of material changes via email or in-app
              notifications. Continued use of the Platform after updates
              constitutes acceptance of the revised Policy.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
