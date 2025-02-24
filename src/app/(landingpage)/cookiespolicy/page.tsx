import React from "react";
import Footer from "@/components/Footer";
import { retentionExceptions,
  dataSecurityMeasures,
  userRights,
  dataDeletion,
  optOutOptions,
  gdprCompliance,
  ccpaCompliance,
  policyUpdates} from "./data"
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
            Cookies Policy & Data Retention Policy
          </h1>
          <p>Effective Date:</p>
          <p>Last Updated:</p>

          <div className="text-white text-lg leading-relaxed pb-6">
            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              1. Introduction
            </h2>
            <p>
              This Cookies Policy & Data Retention Policy (&quot;Policy&quot;) outlines
              how Plyzrx, operated by Tributo Capital LLC (&quot;Company,&quot; &quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;), collects, stores, and retains user data,
              including the use of cookies and tracking technologies. By using
              the Plyzrx platform (&quot;Platform&quot;), you (&quot;User,&quot; &quot;Player,&quot; or
              &quot;you&quot;) agree to the collection and retention of your data under
              this Policy. Plyzrx is committed to transparency, data
              protection, and compliance with privacy laws, including GDPR,
              CCPA, and other applicable regulations.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              2. Cookies Policy
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              2.1 What Are Cookies?
            </h3>
            <p>
              Cookies are small data files stored on your device when you visit
              or interact with the Platform. Cookies help us enhance user
              experience, improve functionality, and ensure platform security.
            </p>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.2 Types of Cookies Used
            </h3>
            <ul className="list-disc pl-5">
              <li>Essential Cookies – Required for platform operation, authentication, and security.</li>
              <li>Analytical Cookies – Track user interactions to improve performance and gameplay experience.</li>
              <li>Functional Cookies – Remember preferences such as language settings and gameplay configurations.</li>
              <li>Marketing & Advertising Cookies – Deliver relevant promotions and advertisements.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.3 Managing Cookies Preferences
            </h3>
            <ul className="list-disc pl-5">
              <li>Users may accept or reject non-essential cookies through our Cookie Consent Banner.</li>
              <li>Users may modify cookie settings via their browser settings.</li>
              <li>Disabling cookies may impact Platform functionality but will not prevent access.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              2.4 Third-Party Cookies
            </h3>
            <p>
              Plyzrx may use third-party services (e.g., Google Analytics,
              Facebook Pixel) to collect and analyze user data. These providers
              have their own privacy policies, and Plyzrx is not responsible
              for third-party cookie practices.
            </p>

            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
              3. Data Retention Policy
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
              3.1 Purpose of Data Retention
            </h3>
            <p>Plyzrx retains user data only as long as necessary to:</p>
            <ul className="list-disc pl-5">
              <li>Ensure compliance with legal, regulatory, and security requirements.</li>
              <li>Provide a seamless gaming experience.</li>
              <li>Resolve disputes, enforce platform policies, and prevent fraud.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-3 font-headingfont text-custompink">
              3.2 Data Retention Periods
            </h3>
            <table className="w-full border-collapse border border-white my-5">
              <thead>
                <tr>
                  <th className="border border-white px-4 py-2">Data Type</th>
                  <th className="border border-white px-4 py-2">Retention Period</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-white px-4 py-2">User Account Data</td>
                  <td className="border border-white px-4 py-2">Retained while the account is active</td>
                </tr>
                <tr>
                  <td className="border border-white px-4 py-2">Transaction Records</td>
                  <td className="border border-white px-4 py-2">Minimum 5 years (financial compliance)</td>
                </tr>
                <tr>
                  <td className="border border-white px-4 py-2">Gameplay Data</td>
                  <td className="border border-white px-4 py-2">2 years (fraud detection & analytics)</td>
                </tr>
                <tr>
                  <td className="border border-white px-4 py-2">Support Inquiries</td>
                  <td className="border border-white px-4 py-2">Stored for 6 months after case resolution</td>
                </tr>
                <tr>
                  <td className="border border-white px-4 py-2">Deleted Accounts</td>
                  <td className="border border-white px-4 py-2">Data retained for 90 days, then permanently erased</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            3.3 Exceptions to Retention Periods
            </h3>
            <p>Plyzrx may retain data beyond the stated periods if:</p>
            <ul className="list-disc pl-5">
{
  retentionExceptions.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
            </ul>


            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            3.4 Data Security Measures
            </h3>

            <ul className="list-disc pl-5">
            {
  dataSecurityMeasures.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}

            </ul>


            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
            4. User Rights & Data Deletion Requests
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            4.1 Right to Access & Data Portability
            </h3>
            <p>Users have the right to:</p>
            <ul className="list-disc pl-5">
            {
  userRights.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            4.2 Right to Request Data Deletion
            </h3>

            <ul className="list-disc pl-5">
            {
  dataDeletion.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
            </ul>


            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            4.3 Opting Out of Data Collection
            </h3>

            <ul className="list-disc pl-5">
            {
  optOutOptions.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
     
            
            </ul>


            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
            5. Compliance with Global Data Protection Laws
            </h2>
            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            5.1 General Data Protection Regulation (GDPR)
            </h3>
            <p>For EU users, Plyzrx complies with GDPR by ensuring:</p>
            <ul className="list-disc pl-5">
            
            {
  gdprCompliance.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
     
            </ul>

            <h3 className="text-lg font-semibold font-headingfont text-custompink">
            5.2 California Consumer Privacy Act (CCPA)
            </h3>
            <p>For California residents, Plyzrx complies with CCPA by providing:</p>
            <ul className="list-disc pl-5">
            {
  ccpaCompliance.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
            
            </ul>


            <h2 className="text-xl font-bold mt-5 font-headingfont text-custompink">
            6. Amendments & Updates
            </h2>
      
            <ul className="list-disc pl-5">
                          {
  policyUpdates.map((item,index)=>(
    <li key={index}>{item}</li>
  ))
}
            
            </ul>






          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default page;
