"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SCHOOLS } from "@/lib/schools";

const quotes = [
  { text: "The dining hall is legitimately good. I know that sounds insane but it's true.", school: "UCLA", color: "#2774AE", textColor: "#fff" },
  { text: "Nobody warns you that the housing lottery is basically a hunger games situation.", school: "UCLA", color: "#2774AE", textColor: "#fff" },
  { text: "Ann Arbor in the fall is something you have to experience. The whole city is alive.", school: "U of Michigan", color: "#FFCB05", textColor: "#111" },
  { text: "Waited 3 weeks for a counseling appointment during midterms. That part needs work.", school: "Ohio State", color: "#BB0000", textColor: "#fff" },
  { text: "NYU is not a college experience. It's a New York experience. Know which one you're signing up for.", school: "NYU", color: "#57068C", textColor: "#fff" },
];

export default function HomepageHero() {
  const router = useRouter();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % quotes.length);
        setQuoteVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered =
    query.trim().length > 0
      ? SCHOOLS.filter((s) =>
          s.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      : [];

  const handleSelect = (school: (typeof SCHOOLS)[number]) => {
    setQuery(school.name);
    setShowDropdown(false);
    router.push(`/school/${school.slug}`);
  };

  const quote = quotes[quoteIndex];

  return (
    <section className="relative w-full" style={{ background: "#0F0F0F" }}>
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-[720px] px-6 py-[72px]">
        {/* 1. Eyebrow */}
        <div className="flex items-center gap-2.5 mb-10">
          <span
            className="shrink-0 rounded-full animate-pulse"
            style={{
              display: "inline-block",
              width: 4,
              height: 4,
              background: "#4ade80",
              boxShadow: "0 0 6px 2px rgba(74,222,128,0.45)",
            }}
          />
          <span
            className="text-[11px] font-bold uppercase"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#555",
              letterSpacing: "0.12em",
            }}
          >
            Real students · Real posts · No marketing
          </span>
        </div>

        {/* 2. Quote ticker */}
        <div style={{ minHeight: 180 }}>
          <div
            style={{
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: quoteVisible ? 1 : 0,
              transform: quoteVisible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <p
              className="mb-5"
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(22px, 4vw, 36px)",
                color: "#F5F4EF",
                lineHeight: 1.25,
              }}
            >
              &ldquo;{quote.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[12px] font-semibold leading-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: quote.color,
                  color: quote.textColor,
                }}
              >
                {quote.school}
              </span>
              <span
                className="text-[12px]"
                style={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                via Reddit
              </span>
            </div>
          </div>
        </div>

        {/* 3. Divider */}
        <div
          style={{
            width: 40,
            height: 1,
            background: "#333",
            marginTop: 32,
            marginBottom: 32,
          }}
        />

        {/* 4. Headline */}
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-syne), 'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 5vw, 48px)",
            color: "#F5F4EF",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          What students actually say about your school.
        </h1>

        {/* Subtext */}
        <p
          className="mb-8"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: "#666",
            maxWidth: 460,
            lineHeight: 1.6,
          }}
        >
          We read thousands of real posts from Reddit, YouTube, and X — then
          surface what students actually think. No surveys. No ratings. No
          filter.
        </p>

        {/* Search bar */}
        <div ref={searchRef} className="relative">
          <div
            className="flex items-center rounded-md bg-white overflow-hidden"
            style={{
              border: `2px solid ${focused ? "#F5F4EF" : "transparent"}`,
              transition: "border-color 0.15s ease",
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                setFocused(true);
                if (query.trim().length > 0) setShowDropdown(true);
              }}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered.length > 0)
                  handleSelect(filtered[0]);
              }}
              placeholder="Search your school..."
              className="flex-1 px-4 py-3 bg-white text-[15px] text-[#0F0F0F] outline-none placeholder:text-[#aaa]"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              onClick={() => {
                if (filtered.length > 0) handleSelect(filtered[0]);
              }}
              className="shrink-0 px-4 py-3 text-[13px]"
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 700,
                background: "#0F0F0F",
                color: "#F5F4EF",
              }}
            >
              Find it →
            </button>
          </div>

          {showDropdown && filtered.length > 0 && (
            <ul
              className="absolute left-0 right-0 mt-1 rounded-md overflow-hidden z-10"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
            >
              {filtered.map((school) => (
                <li key={school.slug}>
                  <button
                    className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#222] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", color: "#F5F4EF" }}
                    onMouseDown={() => handleSelect(school)}
                  >
                    {school.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p
          className="mt-3 text-[12px]"
          style={{ fontFamily: "Inter, sans-serif", color: "#555" }}
        >
          {SCHOOLS.length} schools available · more added weekly
        </p>
      </div>
    </section>
  );
}
