"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SchoolOption = { slug: string; name: string };

export default function SearchBar({ schools }: { schools: SchoolOption[] }) {
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const match = schools.find(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );

    if (match) {
      router.push(`/schools/${match.slug}`);
    } else {
      setNotFound(true);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex rounded-full overflow-hidden shadow-lg border border-slate-200 bg-white"
      >
        <div className="flex items-center pl-5 text-slate-400 shrink-0">
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
            setNotFound(false);
          }}
          placeholder="Search a university..."
          className="flex-1 px-4 py-4 text-base text-slate-700 placeholder-slate-400 bg-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors text-white font-bold px-6 py-4 text-sm shrink-0"
        >
          Find My School
        </button>
      </form>

      {notFound && (
        <p className="text-sm text-slate-500 mt-3 text-center">
          We haven&rsquo;t added{" "}
          <span className="font-semibold text-[#2B2D42]">&ldquo;{query}&rdquo;</span>{" "}
          yet — drop your email below and we&rsquo;ll notify you when it&rsquo;s live.
        </p>
      )}

      {!notFound && (
        <p className="text-xs text-slate-400 mt-3 text-center">
          {schools.length} schools available now
        </p>
      )}
    </div>
  );
}
