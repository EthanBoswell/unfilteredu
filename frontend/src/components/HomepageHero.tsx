"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SCHOOLS } from "@/lib/schools";
import { filterSchools, SchoolSearchResults } from "./SchoolSearchResults";

export default function HomepageHero() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = filterSchools(query);

  const handleSelect = (school: (typeof SCHOOLS)[number]) => {
    setQuery(school.name);
    setShowDropdown(false);
    router.push(`/schools/${school.slug}`);
  };

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
        <div id="search-bar" ref={searchRef} className="relative scroll-mt-32">
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

          {showDropdown && (
            <SchoolSearchResults schools={filtered} onSelect={handleSelect} />
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
