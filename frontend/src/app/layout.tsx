import type { Metadata } from "next";
import { Hanken_Grotesk, Public_Sans } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-hanken",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-public",
});

export const metadata: Metadata = {
  title: "UnfilteredU — Real College Reviews from Reddit",
  description:
    "Real student opinions from Reddit — not official school content. Housing, dining, academics, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${publicSans.variable} h-full`}>
      <body className="min-h-full bg-[#F8FAFC] font-[family-name:var(--font-public)] antialiased">
        {children}
      </body>
    </html>
  );
}
