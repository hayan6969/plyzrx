import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlyzRX",
  description: "The Ultimate Gaming Platform!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
         {/* Apple Touch Icon */}
         <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Favicon 32x32 */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        
        {/* Favicon 16x16 */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Site Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        </Head>
      <body className={`${gabarito.variable}`}>
        
        {children}
        
        
        
        </body>
    </html>
  );
}
