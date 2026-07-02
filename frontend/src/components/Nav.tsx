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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 text-[14px] leading-none"
              style={{ fontFamily: "Inter, sans-serif", color: "#fff", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              About
              <svg
                className="w-3 h-3 mt-px"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{ transition: "transform 0.15s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full flex flex-col"
                style={{
                  marginTop: 8,
                  background: "#0F0F0F",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  minWidth: 180,
                  padding: "6px 0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {[
                  { label: "About", href: "/about" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-[13px] leading-none px-4 py-2.5 hover:bg-white/10 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", color: "#fff", display: "block" }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
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
