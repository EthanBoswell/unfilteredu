"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type SchoolOption = { slug: string; name: string; location: string };

export default function SearchBar({
  schools,
  variant = "default",
}: {
  schools: SchoolOption[];
  variant?: "default" | "hero";
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
      )
    : [];

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q) return;
    if (filtered.length > 0) {
      router.push(`/schools/${filtered[0].slug}`);
      setOpen(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <div className="w-full max-w-xl relative" ref={wrapperRef}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row overflow-hidden border bg-white"
        style={{
          borderRadius: "6px",
          borderColor: isHero ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex items-center pl-4 shrink-0" style={{ color: "#BBBBBB" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => { if (query.trim()) setOpen(true); }}
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            placeholder="Search a university..."
            className="flex-1 min-w-0 px-4 py-4 text-sm text-[#111111] placeholder-[#AAAAAA] bg-transparent outline-none font-light"
          />
        </div>
        <button
          type="submit"
          className="font-semibold px-6 py-4 text-sm shrink-0 tracking-wide transition-colors w-full sm:w-auto"
          style={
            isHero
              ? { background: "#2C3E2D", color: "#E8E0D4" }
              : { background: "#EF6C35", color: "#ffffff" }
          }
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = isHero ? "#1e2e1f" : "#d4551c";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = isHero ? "#2C3E2D" : "#EF6C35";
          }}
        >
          Find My School
        </button>
      </form>

      {open && q && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white border border-black/10 shadow-lg overflow-hidden z-50"
          style={{ borderRadius: "6px" }}
        >
          {filtered.length > 0 ? (
            filtered.map((school) => (
              <button
                key={school.slug}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  router.push(`/schools/${school.slug}`);
                  setOpen(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-[#F5F0EA] transition-colors border-b border-black/[0.06] last:border-0"
              >
                <p className="text-sm font-semibold text-[#111111] font-[family-name:var(--font-display)]">
                  {school.name}
                </p>
                {school.location && (
                  <p className="text-xs text-[#777777] font-light">{school.location}</p>
                )}
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-[#777777] text-center font-light">
              No schools found yet — drop your email below to get notified.
            </div>
          )}
        </div>
      )}

      <p
        className="text-xs mt-3 font-light"
        style={{ color: isHero ? "rgba(232,224,212,0.4)" : "#777777" }}
      >
        {schools.length} schools available now
      </p>
    </div>
  );
}
