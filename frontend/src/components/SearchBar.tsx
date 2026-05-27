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
    <div className="max-w-xl mx-auto relative" ref={wrapperRef}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row sm:rounded-full overflow-hidden shadow-lg border border-slate-200 bg-white rounded-2xl"
      >
        <div className="flex items-center pl-5 pt-1 sm:pt-0 text-slate-400 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
          className="flex-1 px-4 py-4 text-base text-slate-700 placeholder-slate-400 bg-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors text-white font-bold px-6 py-4 text-sm w-full sm:w-auto"
        >
          Find My School
        </button>
      </form>

      {open && q && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
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
                className="w-full text-left px-5 py-3.5 hover:bg-[#EF6C35]/10 transition-colors group border-b border-slate-100 last:border-0"
              >
                <p className="text-sm font-semibold text-[#2B2D42] group-hover:text-[#EF6C35] transition-colors">
                  {school.name}
                </p>
                {school.location && (
                  <p className="text-xs text-slate-400">{school.location}</p>
                )}
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-slate-500 text-center">
              No schools found yet — drop your email below to get notified.
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3 text-center">
        {schools.length} schools available now
      </p>
    </div>
  );
}
