"use client";

import { useState } from "react";
import SchoolSearchOverlay from "@/components/SchoolSearchOverlay";

export default function SearchSchoolsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] leading-none font-bold"
        style={{
          fontFamily: "var(--font-syne), 'Syne', sans-serif",
          fontWeight: 700,
          background: "#0F0F0F",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        Search schools
      </button>

      <SchoolSearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
