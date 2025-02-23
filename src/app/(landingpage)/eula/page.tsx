import React from "react";
import {
  grantlience,
  restrictions,
  ownership,
  useraccounts,
  accountsecurity,
  payments,
  paymentprocessing,
  termination,
  disclamer,
  liabilityClauses,
  arbitrationClauses,
  governingLawClause,
  agreementUpdateClauses,
} from "./data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
function page() {
  return (
    <>
      <main
        className=" w-full text-white min-h-screen flex flex-col relative bg-black px-2"
        style={{
          background: `
          radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
          #040811
        `,
        }}
      >

        <section className="pt-10 px-5 mt-5 flex flex-col font-bodyfont">
          <h1 className=" text-[2rem] font-headingfont text-custompink">
            END-USER LICENSE AGREEMENT (EULA)
          </h1>
          <p>Effective Date:</p>
          <p>Last Updated:</p>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This End-User License Agreement (&quot;Agreement&quot;) is a
              legally binding contract between you (&quot;User&quot;,
              &quot;Player,&quot; or &quot;you&quot;) and Tributo Capital LLC
              (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;) governing your access to and use of the Plyzrx
              platform, including but not limited to its software, mobile
              application, website, and related services (collectively, the
              &quot;Platform&quot;).
            </p>

            <p>
              By installing, accessing, or using the Platform, you expressly
              agree to comply with this Agreement. If you do not agree to these
              terms, you must immediately discontinue use of the Platform and
              uninstall any related software.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Grant of License & Scope of Use
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 Limited License
            </h3>
            <ul className="list-disc pl-5">
              {grantlience.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.2 Restrictions on Use
            </h3>
            <ul className="list-disc pl-5">
              {restrictions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              Failure to comply with these restrictions may result in immediate
              termination of access, forfeiture of funds, and legal action.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Ownership & Intellectual Property Rights
            </h2>
            <ul className="list-disc pl-5">
              {ownership.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              4. User Accounts & Security
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              4.1 Account Registration & Verification
            </h3>
            <ul className="list-disc pl-5">
              {useraccounts.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              4.2 Account Security
            </h3>
            <ul className="list-disc pl-5">
              {accountsecurity.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              5. Payments & Subscription Fees
            </h2>
            <h3 className="text-lg font-semibold">
              5.1 Subscription Plans & Fees
            </h3>
            <ul className="list-disc pl-5">
              {payments.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              5.2 Payment Processing & Chargebacks
            </h3>
            <ul className="list-disc pl-5">
              {paymentprocessing.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              6. Termination & Suspension
            </h2>
            <p>
              Plyzrx reserves the right to suspend or terminate your account
              without notice if you:
            </p>
            <ul className="list-disc pl-5">
              {termination.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              Upon termination, you will lose access to your account, including
              any subscription benefits, funds, or rankings. Plyzrx will not be
              liable for any losses arising from termination.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              7. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              7.1 No Warranties
            </h3>

            <ul className="list-disc pl-5">
              {disclamer.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              7.2 Limitation of Liability
            </h3>

            <ul className="list-disc pl-5">
              {liabilityClauses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              8. Dispute Resolution & Governing Law
            </h2>
            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              8.1 Binding Arbitration
            </h3>
            <ul className="list-disc pl-5">
              {arbitrationClauses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              8.2 Governing Law
            </h3>
            <ul className="list-disc pl-5">
              {governingLawClause.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              9. Agreement Updates
            </h2>

            <ul className="list-disc pl-5">
              {agreementUpdateClauses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default page;
