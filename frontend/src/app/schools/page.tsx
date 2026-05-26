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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#2B2D42] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-5 pt-14 pb-20 sm:pt-20 sm:pb-28 text-white">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            ← Home
          </a>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Browse Schools
          </h1>
          <p className="text-white/50 text-base sm:text-lg">
            {schools.length} schools with real student reviews · sourced from Reddit
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#F2F3F5] pointer-events-none" />
      </section>

      {/* School grid */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schools.map(({ slug, name, location, vibe }) => (
            <div
              key={slug}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="mb-auto">
                <div className="inline-flex items-center gap-1.5 bg-[#EF6C35]/10 rounded-full px-2.5 py-0.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF6C35]" />
                  <span className="text-xs font-semibold text-[#EF6C35]">Live</span>
                </div>
                <h2 className="font-bold text-[#2B2D42] text-base mb-0.5">{name}</h2>
                {location && (
                  <p className="text-xs text-slate-400 mb-3">{location}</p>
                )}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {vibe}
                </p>
              </div>
              <a
                href={`/schools/${slug}`}
                className="mt-5 w-full text-center text-sm font-bold text-white bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors rounded-full py-2.5"
              >
                View Profile →
              </a>
            </div>
          ))}
        </div>

        {comingSoon.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-black text-[#2B2D42] mb-6">
              Coming Soon
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {comingSoon.map(({ slug, name, location }) => (
                <div
                  key={slug}
                  className="bg-white rounded-xl border border-slate-200 p-4 opacity-60"
                >
                  <p className="font-semibold text-[#2B2D42] text-sm">{name}</p>
                  {location && (
                    <p className="text-xs text-slate-400 mt-0.5">{location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-[#2B2D42] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#EF6C35] rounded-md flex items-center justify-center text-white text-xs font-black">
              U
            </div>
            <span className="font-bold text-white text-sm">UnfilteredU</span>
          </div>
          <p className="text-white/40 text-sm text-center">
            Real opinions. Real students. No filter.
          </p>
          <p className="text-white/25 text-xs">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
