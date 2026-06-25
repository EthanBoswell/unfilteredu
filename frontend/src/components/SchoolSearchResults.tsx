"use client";

import { SCHOOLS, type SchoolMeta } from "@/lib/schools";

export function filterSchools(query: string, limit = 5): SchoolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SCHOOLS.filter((s) => s.name.toLowerCase().includes(q)).slice(0, limit);
}

export function SchoolSearchResults({
  schools,
  onSelect,
}: {
  schools: SchoolMeta[];
  onSelect: (school: SchoolMeta) => void;
}) {
  if (schools.length === 0) return null;

  return (
    <ul
      className="absolute left-0 right-0 mt-1 rounded-md overflow-hidden z-10"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      {schools.map((school) => (
        <li key={school.slug}>
          <button
            className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#222] transition-colors"
            style={{ fontFamily: "Inter, sans-serif", color: "#F5F4EF" }}
            onMouseDown={() => onSelect(school)}
          >
            {school.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
