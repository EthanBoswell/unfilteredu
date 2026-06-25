"use client";

import { useState } from "react";
import Wordmark from "./Wordmark";
import SchoolSearchOverlay from "./SchoolSearchOverlay";

interface NavProps {
  schoolName?: string;
  schoolColor?: string;
  schoolTextColor?: string;
}

export default function Nav({ schoolName, schoolColor, schoolTextColor = "#ffffff" }: NavProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between px-6"
      style={{ background: "#0F0F0F", height: 52 }}
    >
      <a href="/">
        <Wordmark size={18} dark />
      </a>

      <div className="flex items-center gap-5">
        {!schoolName && (
          <a
            href="/about"
            className="text-[14px] leading-none"
            style={{ fontFamily: "Inter, sans-serif", color: "#fff" }}
          >
            About
          </a>
        )}

        {schoolName && schoolColor ? (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-[12px] leading-none font-bold"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              background: schoolColor,
              color: schoolTextColor,
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            Search schools
          </button>
        ) : null}
      </div>

      <SchoolSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
