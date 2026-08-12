"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Wordmark from "./Wordmark";
import SchoolSearchOverlay from "./SchoolSearchOverlay";

interface NavClientProps {
  schoolName?: string;
  schoolColor?: string;
  schoolTextColor?: string;
  userEmail?: string | null;
}

export default function NavClient({
  schoolName,
  schoolColor,
  schoolTextColor = "#ffffff",
  userEmail,
}: NavClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const menuLinks = userEmail
    ? [
        { label: "About", href: "/about" },
        { label: "Profile", href: "/profile" },
      ]
    : [
        { label: "About", href: "/about" },
        { label: "Sign in", href: "/login" },
        { label: "Create account", href: "/signup", cta: true },
      ];

  const avatarInitial = userEmail?.[0]?.toUpperCase() ?? "";
  const hasSearchButton = Boolean(schoolName && schoolColor);

  return (
    <nav
      className="sticky top-0 z-[100] items-center px-6"
      style={
        hasSearchButton
          ? { background: "#0F0F0F", height: 52, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center" }
          : { background: "#0F0F0F", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }
      }
    >
      <div className="flex items-center" style={{ order: hasSearchButton ? 1 : 2 }}>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center"
            style={{ color: "#fff", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {dropdownOpen ? (
              <X size={20} strokeWidth={2} />
            ) : userEmail ? (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#F5F4EF",
                  color: "#0F0F0F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                }}
              >
                {avatarInitial}
              </span>
            ) : (
              <Menu size={20} strokeWidth={2} />
            )}
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
              {menuLinks.map(({ label, href, cta }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] leading-none px-4 py-2.5 hover:bg-white/10 transition-colors"
                  style={{
                    fontFamily: cta ? "var(--font-syne), 'Syne', sans-serif" : "Inter, sans-serif",
                    fontWeight: cta ? 700 : 400,
                    color: "#fff",
                    display: "block",
                    borderTop: cta ? "1px solid rgba(255,255,255,0.1)" : undefined,
                    marginTop: cta ? 4 : undefined,
                    paddingTop: cta ? 12 : undefined,
                  }}
                >
                  {label}
                </Link>
              ))}

              {userEmail && (
                <form
                  action="/auth/signout"
                  method="post"
                  style={{ marginTop: 4, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 4 }}
                >
                  <button
                    type="submit"
                    className="text-[13px] leading-none px-4 py-2.5 hover:bg-white/10 transition-colors"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      color: "#fff",
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sign out
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center" style={{ order: hasSearchButton ? 2 : 1 }}>
        <a href="/">
          <Wordmark size={18} dark />
        </a>
      </div>

      {hasSearchButton ? (
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-[12px] leading-none font-bold"
          style={{
            order: 3,
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

      <SchoolSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
