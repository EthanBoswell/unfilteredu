import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

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
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-[#F2F3F5] font-[var(--font-geist)] antialiased">
        {children}
      </body>
    </html>
  );
}
