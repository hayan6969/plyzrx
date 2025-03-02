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
            PlyzRX Fraud Prevention & Fair Play Policy
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This <strong>Fraud Prevention & Fair Play Policy</strong>{" "}
              (&quot;Policy&quot;) sets forth the
              <strong>rules, responsibilities, and enforcement measures</strong>{" "}
              to ensure that all users of <strong>Plyzrx</strong>, a platform
              operated by <strong>Tributo Capital LLC</strong> (&quot;Company,&quot; &quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;), participate in a fair, transparent, and lawful
              manner. By using the Platform, you (&quot;User,&quot; &quot;Player,&quot; or &quot;you&quot;)
              agree to abide by this Policy.
            </p>
            <p>
              Plyzrx is committed to maintaining{" "}
              <strong>a secure and integrity-driven gaming environment</strong>{" "}
              by implementing strict fraud prevention measures and enforcing
              fair play guidelines. Violations of this Policy may result in{" "}
              <strong>
                account suspension, forfeiture of funds, legal action, and
                permanent bans
              </strong>
              .
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Fair Play Standards
            </h2>
            <p>
              To maintain a{" "}
              <strong>competitive and trustworthy gaming environment</strong>,
              all players must adhere to the following{" "}
              <strong>Fair Play Rules</strong>:
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Prohibited Activities
            </h3>
            <p>
              Users are <strong>strictly prohibited</strong> from engaging in
              the following:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Collusion & Cheating:</strong> Coordinating with other
                players to manipulate game outcomes.
              </li>
              <li>
                <strong>Use of Bots or Automated Scripts:</strong> Utilizing
                external software, bots, or artificial intelligence to gain an
                unfair advantage.
              </li>
              <li>
                <strong>Exploiting Game Bugs or Glitches:</strong> Intentionally
                exploiting system vulnerabilities for personal gain.
              </li>
              <li>
                <strong>Account Sharing or Multiple Accounts:</strong> Creating
                multiple accounts to bypass rules or gain unfair advantages.
              </li>
              <li>
                <strong>Circumventing Geographic Restrictions:</strong> Using
                VPNs, proxies, or other means to bypass Plyzrx location-based
                restrictions.
              </li>
              <li>
                <strong>Match Fixing & Fraudulent Play:</strong> Engaging in
                behaviors that compromise the integrity of tournaments and
                competitions.
              </li>
            </ul>
            <p>
              Violating these terms will result in{" "}
              <strong>immediate account suspension</strong>, and in severe
              cases, <strong>legal action and permanent bans</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Fraud Prevention Measures
            </h2>
            <p>
              To prevent fraud and maintain{" "}
              <strong>a legally compliant gaming environment</strong>, Plyzrx
              employs the following security protocols:
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Identity Verification & KYC (Know Your Customer)
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All users must complete <strong>KYC verification</strong> before
                withdrawing winnings.
              </li>
              <li>
                Plyzrx may require additional verification at any time to
                confirm a user identity and prevent fraudulent activity.
              </li>
              <li>
                Users providing{" "}
                <strong>false, misleading, or incomplete information</strong>{" "}
                may face account suspension and legal action.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.2 Anti-Money Laundering (AML) Compliance
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx complies with{" "}
                <strong>U.S. federal and state AML regulations</strong> to
                prevent financial crimes.
              </li>
              <li>
                High-value transactions may be flagged for{" "}
                <strong>enhanced due diligence (EDD)</strong>.
              </li>
              <li>
                Suspected fraudulent financial activities will be{" "}
                <strong>reported to relevant authorities</strong>.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.3 Payment & Transaction Monitoring
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx uses <strong>AI-driven fraud detection</strong> to
                monitor all financial transactions.
              </li>
              <li>
                Any unauthorized or suspicious transactions will be{" "}
                <strong>blocked, reviewed, and reported</strong>.
              </li>
              <li>
                Users attempting chargeback fraud will face{" "}
                <strong>account termination and legal consequences</strong>.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.4 Data Security & Encryption
            </h3>
            <ul className="list-disc pl-5">
              <li>
                All user data, including payment and identity verification
                records, is <strong>encrypted and securely stored</strong>.
              </li>
              <li>
                Plyzrx enforces{" "}
                <strong>multi-factor authentication (MFA)</strong> to prevent
                unauthorized account access.
              </li>
              <li>
                Account credentials and personal data must be{" "}
                <strong>kept confidential by the user</strong>.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Enforcement & Penalties for Violations
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Investigation & Review Process
            </h3>
            <p>If fraud, cheating, or fair play violations are suspected:</p>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx will <strong>immediately suspend</strong> the user
                account pending investigation.
              </li>
              <li>
                Investigations will be conducted by{" "}
                <strong>a dedicated compliance and security team</strong>.
              </li>
              <li>
                Users may be required to provide additional information,
                including proof of identity.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Consequences of Violations
            </h3>
            <p>Violations of this Policy may result in:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Account suspension or permanent banning</strong> from
                the Plyzrx platform.
              </li>
              <li>
                <strong>Forfeiture of funds and winnings</strong> associated
                with fraudulent activity.
              </li>
              <li>
                <strong>Reporting to law enforcement</strong> for cases
                involving criminal fraud or cybercrime.
              </li>
              <li>
                <strong>Civil or legal action</strong> for damages caused to
                Plyzrx, its users, or its financial operations.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.3 Appeal Process
            </h3>
            <p>
              Users whose accounts have been suspended may submit an appeal
              within <strong>7 days</strong> of receiving notice. Appeals must
              be sent to <strong>________________</strong>, with
              supporting documentation to prove compliance with the Policy.
            </p>
            <p>
              Plyzrx reserves the right to <strong>deny appeals</strong> if
              evidence of fraudulent activity is conclusive.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Responsible Gaming Commitment
            </h2>
            <p>
              Plyzrx is dedicated to promoting{" "}
              <strong>responsible gaming</strong> and ensuring users play within
              their limits. We offer:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Self-exclusion tools</strong> to allow users to
                temporarily or permanently suspend their accounts.
              </li>
              <li>
                <strong>Deposit limits & time reminders</strong> to help users
                manage their gameplay responsibly.
              </li>
              <li>
                <strong>Support resources & helplines</strong> for users who
                believe they may have a gaming-related issue.
              </li>
            </ul>
            <p>
              Users engaging in{" "}
              <strong>excessive spending or compulsive gaming behavior</strong>{" "}
              may be contacted for intervention and support.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Dispute Resolution & Legal Compliance
            </h2>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.1 Dispute Process
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Users must first attempt to resolve fair play or fraud-related
                disputes by contacting <strong>Plyzrx Support</strong>.
              </li>
              <li>
                If a dispute remains unresolved, users may{" "}
                <strong>submit a formal dispute resolution request</strong>.
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              6.2 Governing Law & Arbitration
            </h3>
            <ul className="list-disc pl-5">
              <li>
                Any disputes arising from this Policy shall be resolved{" "}
                <strong>through binding arbitration</strong>, in accordance with
                the rules of the{" "}
                <strong>American Arbitration Association (AAA)</strong>.
              </li>
              <li>
                Arbitration shall be conducted in{" "}
                <strong>________________</strong>, and users waive
                their right to participate in a class-action lawsuit.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Amendments & Updates
            </h2>
            <ul className="list-disc pl-5">
              <li>
                Plyzrx reserves the right to{" "}
                <strong>modify this Fraud Prevention & Fair Play Policy</strong>{" "}
                at any time.
              </li>
              <li>
                Users will be notified of material changes via{" "}
                <strong>email or in-app notifications</strong>.
              </li>
              <li>
                Continued use of the Platform after updates constitutes{" "}
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
