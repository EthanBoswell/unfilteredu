"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SchoolMeta } from "@/lib/schools";
import { filterSchools, SchoolSearchResults } from "./SchoolSearchResults";

export default function SchoolSearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = filterSchools(query);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Autofocus after the overlay mounts.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (school: SchoolMeta) => {
    onClose();
    router.push(`/schools/${school.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-6 pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div ref={panelRef} className="w-full max-w-xl relative">
        <div
          className="flex items-center rounded-md bg-white overflow-hidden"
          style={{ border: "2px solid #F5F4EF" }}
        >
          <div className="flex items-center pl-4 shrink-0" style={{ color: "#BBBBBB" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length > 0) handleSelect(filtered[0]);
            }}
            placeholder="Search your school..."
            className="flex-1 px-4 py-3 bg-white text-[15px] text-[#0F0F0F] outline-none placeholder:text-[#aaa]"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>

        <SchoolSearchResults schools={filtered} onSelect={handleSelect} />
      </div>
    </div>
  );
}
