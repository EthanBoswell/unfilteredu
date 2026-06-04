import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full bg-[#f5f1eb] font-[family-name:var(--font-dm)] antialiased text-[#1c1917]">
        {children}
      </body>
    </html>
  );
}
