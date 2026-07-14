import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Syne, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UnfilteredU — Real College Reviews",
  description:
    "Real student opinions — not official school content. Housing, dining, academics, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${syne.variable} ${inter.variable} h-full scroll-smooth`}>

      <body className="min-h-full bg-[#f5f1eb] font-[family-name:var(--font-dm)] antialiased text-[#1c1917]">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}