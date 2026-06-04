"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type SchoolOption = { slug: string; name: string; location: string };

export default function SearchBar({ schools }: { schools: SchoolOption[] }) {
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

  return (
    <div className="max-w-xl relative" ref={wrapperRef}>
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden border border-[#d6d1c8] bg-white"
        style={{ borderRadius: "6px" }}
      >
        <div className="flex items-center pl-4 text-[#d6d1c8] shrink-0">
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
          className="flex-1 px-4 py-4 text-sm text-[#1c1917] placeholder-[#c6bfb4] bg-transparent outline-none font-light"
        />
        <button
          type="submit"
          className="bg-[#be4b26] hover:bg-[#a83e20] transition-colors text-white font-semibold px-6 py-4 text-sm shrink-0 tracking-wide"
        >
          Find My School
        </button>
      </form>

      {open && q && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-[#d6d1c8] shadow-lg overflow-hidden z-50" style={{ borderRadius: "6px" }}>
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
                className="w-full text-left px-5 py-3 hover:bg-[#f5f1eb] transition-colors border-b border-[#ede9e1] last:border-0"
              >
                <p className="text-sm font-semibold text-[#1c1917] font-[family-name:var(--font-display)]">
                  {school.name}
                </p>
                {school.location && (
                  <p className="text-xs text-[#78716c] font-light">{school.location}</p>
                )}
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-[#78716c] text-center font-light">
              No schools found yet — drop your email below to get notified.
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[#78716c] mt-3 font-light">
        {schools.length} schools available now
      </p>
    </div>
  );
}
