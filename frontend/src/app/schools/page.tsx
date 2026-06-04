import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { SCHOOLS, getSchoolBySlug } from "@/lib/schools";
import { getAvailableSlugs, loadSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Browse Schools — UnfilteredU",
  description:
    "Browse real student opinions for every school on UnfilteredU. Sourced from Reddit.",
};

export default function SchoolsPage() {
  const availableSlugs = getAvailableSlugs();

  const schools = availableSlugs
    .map((slug) => {
      const meta = getSchoolBySlug(slug);
      const summary = loadSummary(slug);
      return {
        slug,
        name: meta?.name ?? slug,
        location: meta?.location ?? "",
        vibe: summary.overall_vibe.summary,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const comingSoon = SCHOOLS.filter((s) => !availableSlugs.includes(s.slug));

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1c1917] relative overflow-hidden pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-white">
          <a href="/" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-sm mb-8 font-light">
            ← Home
          </a>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a052]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a052]">
              Browse Schools
            </span>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] font-bold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            {schools.length} schools reviewed.
          </h1>
          <p className="text-white/40 text-base font-light mt-3">
            Sourced from Reddit · student communities &amp; r/ApplyingToCollege
          </p>
        </div>
      </section>

      {/* School grid */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#d6d1c8]">
          {schools.map(({ slug, name, location, vibe }) => (
            <a
              key={slug}
              href={`/schools/${slug}`}
              className="group block border-b border-r border-[#d6d1c8] p-6 bg-[#f5f1eb] hover:bg-[#ede9e1] transition-colors duration-150"
            >
              <span className="inline-block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#c9a052] mb-3">
                ● Live
              </span>
              <h2
                className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-base leading-snug w-fit border-b border-transparent group-hover:border-[#c9a052] transition-colors duration-200 mb-1"
              >
                {name}
              </h2>
              {location && (
                <p className="text-xs text-[#78716c] font-light mb-3">{location}</p>
              )}
              <p className="text-sm text-[#78716c] leading-relaxed line-clamp-3 font-light">
                {vibe}
              </p>
              <div className="mt-4 pt-4 border-t border-[#d6d1c8]">
                <span className="text-xs font-semibold text-[#c9a052] tracking-wide">
                  Read Reviews →
                </span>
              </div>
            </a>
          ))}
        </div>

        {comingSoon.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#d6d1c8]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
                Coming Soon
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-[#d6d1c8]">
              {comingSoon.map(({ slug, name, location }) => (
                <div
                  key={slug}
                  className="border-b border-r border-[#d6d1c8] p-4 opacity-50"
                >
                  <p className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-sm">{name}</p>
                  {location && (
                    <p className="text-xs text-[#78716c] font-light mt-0.5">{location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#0f0d0a] py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#c9a052] rounded flex items-center justify-center text-[#1c1917] text-xs font-black font-[family-name:var(--font-display)]">
              U
            </div>
            <span className="font-bold text-white text-sm font-[family-name:var(--font-display)]">UnfilteredU</span>
          </div>
          <p className="text-white/30 text-sm font-light">Real opinions. Real students. No filter.</p>
          <p className="text-white/15 text-xs font-light">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
