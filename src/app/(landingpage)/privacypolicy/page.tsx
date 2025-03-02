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
            Plyzrx Privacy Policy
          </h1>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              Plyzrx, operated by <strong>Tributo Capital LLC</strong>{" "}
              (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), respects your privacy and is
              committed to protecting your personal information. This{" "}
              <strong>Privacy Policy</strong> outlines how we collect, use,
              disclose, and safeguard your information when you access or use
              Plyzrx (the &quot;Platform&quot;). By using the Platform, you{" "}
              <strong>consent to the collection and use</strong> of your
              information in accordance with this Privacy Policy.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Information We Collect
            </h2>
            <p>
              We may collect the following categories of personal and
              non-personal information:
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Personal Information
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <strong>Identity Information:</strong> Name, date of birth,
                government-issued ID (for KYC verification)
              </li>
              <li>
                <strong>Contact Information:</strong> Email address, phone
                number, billing address
              </li>
              <li>
                <strong>Financial Information:</strong> Payment details,
                withdrawal preferences, transaction history
              </li>
              <li>
                <strong>User Authentication Data:</strong> Login credentials,
                account security settings
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.2 Non-Personal Information
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <strong>Gameplay Data:</strong> Tournament participation,
                leaderboard rankings, game activity
              </li>
              <li>
                <strong>Device & Technical Data:</strong> IP address,
                geolocation data, browser type, operating system, device
                identifiers
              </li>
              <li>
                <strong>Behavioral Data:</strong> User preferences, session
                activity, interactions with the Platform
              </li>
              <li>
                <strong>Marketing & Communication Preferences:</strong> Email
                subscriptions, notification settings
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. How We Use Your Information
            </h2>
            <p>We process your information for the following purposes:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Account Registration & Authentication:</strong>{" "}
                Verifying identity, creating secure accounts, preventing
                unauthorized access
              </li>
              <li>
                <strong>Transaction Processing:</strong> Managing payments,
                deposits, withdrawals, and prize distributions
              </li>
              <li>
                <strong>Platform Functionality & Improvement:</strong> Enhancing
                gameplay experience, troubleshooting technical issues, improving
                algorithms
              </li>
              <li>
                <strong>Compliance & Legal Obligations:</strong> Meeting
                regulatory requirements, conducting fraud detection, enforcing
                terms of service
              </li>
              <li>
                <strong>Marketing & Promotions:</strong> Sending promotional
                offers, personalized content, user engagement notifications
              </li>
              <li>
                <strong>User Support & Dispute Resolution:</strong> Responding
                to inquiries, handling chargeback disputes, assisting with KYC
                verification
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. Data Sharing & Third-Party Disclosure
            </h2>
            <p>
              Plyzrx does not <strong>sell, rent, or trade</strong> your
              personal information. However, we may share your information with
              third parties in the following circumstances:
            </p>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Service Providers & Business Partners
            </h3>
            <p>
              We work with trusted{" "}
              <strong>third-party service providers</strong> to facilitate
              payments, user authentication, fraud prevention, and analytics.
              These providers include:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Payment Processors:</strong> Stripe, PayPal (for secure
                transactions)
              </li>
              <li>
                <strong>KYC & Identity Verification:</strong> Third-party
                verification platforms
              </li>
              <li>
                <strong>Security & Anti-Fraud Services:</strong> AI-based
                monitoring for detecting fraud and collusion
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.2 Legal & Regulatory Compliance
            </h3>
            <p>We may disclose personal information:</p>
            <ul className="list-disc pl-5">
              <li>
                To comply with <strong>legal obligations</strong>, court orders,
                or regulatory requirements
              </li>
              <li>
                To enforce our <strong>Terms & Conditions</strong> and other
                agreements
              </li>
              <li>
                To prevent{" "}
                <strong>
                  fraudulent activity, financial crimes, or threats to user
                  safety
                </strong>
              </li>
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.3 Business Transfers
            </h3>
            <p>
              In the event of a <strong>merger, acquisition, or sale</strong> of
              assets, user data may be transferred as part of the business
              transaction. Users will be notified of such changes.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Data Security Measures
            </h2>
            <p>
              We implement strict security measures to{" "}
              <strong>protect user data</strong> from unauthorized access, loss,
              or misuse. These measures include:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Encryption & Secure Storage:</strong> All sensitive data
                is encrypted and stored in secure environments
              </li>
              <li>
                <strong>Multi-Factor Authentication (MFA):</strong> Additional
                security for user accounts
              </li>
              <li>
                <strong>Regular Security Audits:</strong> Compliance with
                industry security standards (e.g., PCI-DSS for payment security)
              </li>
              <li>
                <strong>Access Control Policies:</strong> Limiting access to
                personal information to authorized personnel only
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. User Rights & Choices
            </h2>
            <p>
              Users have the following rights regarding their personal data:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Access & Correction:</strong> Request access to personal
                data and correct inaccuracies
              </li>
              <li>
                <strong>Data Portability:</strong> Receive a copy of collected
                data in a structured format
              </li>
              <li>
                <strong>Opt-Out of Marketing:</strong> Manage email
                subscriptions and push notifications
              </li>
              <li>
                <strong>Account Deletion:</strong> Request permanent deletion of
                your Plyzrx account and associated data
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <strong>________________</strong>.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Cookies & Tracking Technologies
            </h2>
            <p>
              Plyzrx uses cookies and similar tracking technologies to enhance
              the user experience and collect analytical data.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Essential Cookies:</strong> Required for platform
                functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Monitor user behavior to
                improve gameplay and platform performance
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Deliver targeted ads and
                promotional content
              </li>
            </ul>
            <p>
              Users can <strong>adjust cookie preferences</strong> via browser
              settings or by using the Platform cookie management tool.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              8. Data Retention Policy
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfill
              legal, contractual, and operational requirements:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>User account data:</strong> Retained while the account
                remains active
              </li>
              <li>
                <strong>Transaction records:</strong> Retained for a minimum of{" "}
                <strong>5 years</strong> for financial compliance
              </li>
              <li>
                <strong>Gameplay data:</strong> Retained for fraud detection and
                game integrity monitoring
              </li>
              <li>
                <strong>Deleted accounts:</strong> Data may be retained for a
                period of <strong>90 days</strong> for dispute resolution, after
                which it is permanently erased
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              9. International Data Transfers
            </h2>
            <p>
              Plyzrx may transfer data outside the U.S. to service providers in
              jurisdictions with <strong>adequate data protection laws</strong>.
              In cases where international transfers occur,{" "}
              <strong>we implement appropriate safeguards</strong> to protect
              your information.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              10. Children Privacy
            </h2>
            <p>
              Plyzrx is{" "}
              <strong>not intended for users under 18 years old</strong>. We do
              not knowingly collect personal data from minors. If a minor is
              found using the Platform, their account will be{" "}
              <strong>terminated</strong>, and their data will be deleted.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              11. Updates to This Privacy Policy
            </h2>
            <p>
              We may <strong>update this Privacy Policy periodically</strong> to
              reflect changes in laws, regulations, or business operations.
              Users will be notified of <strong>material changes</strong> via
              email or platform notifications.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Page;
