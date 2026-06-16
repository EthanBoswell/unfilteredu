import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs, getSummaryLastUpdated } from "@/lib/data";
import { schoolColors } from "@/data/schoolColors";
import {
  GRID_CATEGORIES,
  SectionLabel,
  ScoreOverviewBar,
  CategoryCard,
  VibeCheckGrid,
  ProsConsSection,
  RedditAndSidebar,
} from "./components";

export async function generateStaticParams() {
  return getAvailableSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  const name = school?.name ?? slug;
  return {
    title: `${name} — UnfilteredU`,
    description: `Real student opinions about ${name} from Reddit. Housing, dining, academics, red flags, and hidden gems.`,
  };
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const availableSlugs = getAvailableSlugs();
  if (!availableSlugs.includes(slug)) notFound();

  const school = getSchoolBySlug(slug);
  if (!school) notFound();

  const summary = loadSummary(slug);
  const colors = schoolColors[slug] ?? school.colors;
  const primary = colors.primary;
  const lastUpdated = getSummaryLastUpdated(slug);

  return (
    <div className="min-h-screen bg-[#EFEFED] font-mono">
      <Navbar />

      {/* ── Section 1 — Header ───────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${primary}18 0%, #EFEFED 60%)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: `${primary}cc` }}>
                {school.location}
              </p>
              <h1
                className="font-bold leading-none mb-4"
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", color: "#111111" }}
              >
                {school.name}
              </h1>
              <div style={{ width: "48px", height: "3px", backgroundColor: primary, borderRadius: "2px" }} />
            </div>
            <div className="sm:text-right shrink-0 pt-1">
              <div className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: "#aaaaaa" }}>sourced from</div>
              <div className="text-sm font-bold" style={{ color: primary }}>
                r/{school.slug} · r/ApplyingToCollege
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "#aaaaaa" }}>10,000+ posts analyzed</div>
            </div>
          </div>

          {/* Tagline — punchy one-liner from overall vibe */}
          <div className="mt-8 pl-5" style={{ borderLeft: `4px solid ${primary}` }}>
            <p
              className="leading-snug"
              style={{ fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)", color: "#222222", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              &ldquo;{summary.overall_vibe.key_points[0]}&rdquo;
            </p>
          </div>

          {/* Stats pills */}
          {school.stats.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">
              {school.stats.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: primary }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2 — Vibe Check ───────────────────────────────────── */}
      <VibeCheckGrid summary={summary} />

      {/* ── Section 3 — Unfiltered Pros & Cons ───────────────────────── */}
      <ProsConsSection summary={summary} />

      {/* ── Section 4 — Straight from Reddit + sidebar ───────────────── */}
      <RedditAndSidebar summary={summary} primary={primary} slug={slug} lastUpdated={lastUpdated} />

      {/* ── Section 5 — Full category breakdown ──────────────────────── */}
      <ScoreOverviewBar summary={summary} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <SectionLabel text="What students are saying" color={primary} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GRID_CATEGORIES.map(({ key, label, icon }, i) => (
            <CategoryCard
              key={key}
              icon={icon}
              label={label}
              data={summary[key]}
              cardIndex={i}
              primaryColor={primary}
            />
          ))}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-5 text-center">
        <div
          className="inline-flex items-start gap-3 p-4 rounded-xl text-left max-w-xl w-full bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <span className="text-sm shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#888888" }}>
            <span className="font-bold" style={{ color: "#555555" }}>Disclaimer: </span>
            Based on real student opinions from Reddit — not official school content. Views reflect individual
            student experiences and may not represent the full picture. Always visit campus and do your own research.
          </p>
        </div>

        {/* Footer dark bar */}
        <div className="w-full -mx-4 sm:-mx-6">
          <footer className="py-8 px-6" style={{ background: "#1A1612" }}>
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black font-[family-name:var(--font-display)]"
                  style={{ background: "#2C3E2D", color: "#E8E0D4" }}
                >
                  U
                </div>
                <span className="font-bold text-sm font-[family-name:var(--font-display)]" style={{ color: "#E8E0D4" }}>
                  UnfilteredU
                </span>
              </div>
              <p className="font-mono text-[9px] tracking-[0.35em] uppercase" style={{ color: "#C4B89A" }}>
                Room 305 · {school.name}
              </p>
              <p className="text-xs font-light" style={{ color: "#C4B89A" }}>
                Not affiliated with any university.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
