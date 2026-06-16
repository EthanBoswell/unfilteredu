import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Wordmark from "@/components/Wordmark";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs, getSummaryLastUpdated } from "@/lib/data";
import {
  SectionLabel,
  ScoreOverviewBar,
  CategorySection,
  VibeCheckGrid,
  ProsConsSection,
  RedditAndSidebar,
} from "./components";

/* ── Accent color lookup ────────────────────────────────────────────────────── */

const ACCENT_COLORS: Record<string, { accent: string; accentLight: string; accentText: string }> = {
  ucla:          { accent: "#2774AE", accentLight: "#EBF4FF", accentText: "#fff" },
  michigan:      { accent: "#FFCB05", accentLight: "#FFFBDC", accentText: "#111" },
  nyu:           { accent: "#57068C", accentLight: "#F5EEFF", accentText: "#fff" },
  "ohio-state":  { accent: "#BB0000", accentLight: "#FFECEC", accentText: "#fff" },
};

const DEFAULT_ACCENT = { accent: "#0F0F0F", accentLight: "#F0F0EC", accentText: "#fff" };

function getAccent(slug: string) {
  return ACCENT_COLORS[slug] ?? DEFAULT_ACCENT;
}

/* ── Static params + metadata ───────────────────────────────────────────────── */

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

/* ── Page ────────────────────────────────────────────────────────────────────── */

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

  const summary     = loadSummary(slug);
  const lastUpdated = getSummaryLastUpdated(slug);
  const { accent, accentLight, accentText } = getAccent(slug);

  return (
    <div className="min-h-screen" style={{ background: "#F5F4EF" }}>
      <Nav schoolName={school.name} schoolColor={accent} schoolTextColor={accentText} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#F5F4EF" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Left: location + name */}
            <div className="flex-1 min-w-0">
              <p
                className="mb-3 uppercase"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                }}
              >
                {school.location}
              </p>
              <h1
                className="leading-none mb-4"
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: "-0.02em",
                  color: "#0F0F0F",
                }}
              >
                {school.name}
              </h1>
              <div style={{ width: 48, height: 3, background: accent, borderRadius: 2 }} />
            </div>

            {/* Right: posts analyzed */}
            <div className="sm:text-right shrink-0 pt-1">
              <p
                className="uppercase mb-1"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                }}
              >
                sourced from
              </p>
              <p
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#0F0F0F",
                  letterSpacing: "-0.02em",
                }}
              >
                10,000+
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#9ca3af",
                  marginTop: 2,
                }}
              >
                posts analyzed
              </p>
            </div>
          </div>

          {/* Hero quote — highlight tape effect */}
          <div className="mt-8">
            <div className="relative inline-block">
              <div
                className="absolute inset-0"
                style={{
                  background: accentLight,
                  borderRadius: 2,
                  transform: "rotate(-0.4deg)",
                }}
              />
              <p
                className="relative px-2 py-1 leading-snug"
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)",
                  letterSpacing: "-0.015em",
                  color: "#0F0F0F",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{summary.overall_vibe.key_points[0]}&rdquo;
              </p>
            </div>
          </div>

          {/* Stats pills */}
          {school.stats.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">
              {school.stats.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    backgroundColor: accent,
                    color: accentText,
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Vibe Check (dark) ─────────────────────────────────────────────── */}
      <VibeCheckGrid summary={summary} />

      {/* ── Pros & Cons ───────────────────────────────────────────────────── */}
      <ProsConsSection summary={summary} />

      {/* ── Reddit quotes + sidebar ───────────────────────────────────────── */}
      <RedditAndSidebar summary={summary} primary={accent} slug={slug} lastUpdated={lastUpdated} />

      {/* ── Score Overview (dark) ─────────────────────────────────────────── */}
      <ScoreOverviewBar summary={summary} />

      {/* ── Topic breakdown ───────────────────────────────────────────────── */}
      <div style={{ background: "#F5F4EF" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SectionLabel text="What students are saying" color={accent} />
          <CategorySection summary={summary} accent={accent} />
        </div>
      </div>

      {/* ── Disclaimer ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div
          className="inline-flex items-start gap-3 p-4 rounded-xl text-left w-full bg-white"
          style={{ border: "1px solid #e8e8e2" }}
        >
          <span className="text-sm shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif", color: "#888" }}>
            <span className="font-bold" style={{ color: "#555" }}>Disclaimer: </span>
            Based on real student opinions from Reddit — not official school content. Views reflect individual
            student experiences and may not represent the full picture. Always visit campus and do your own research.
          </p>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-6 py-5"
        style={{ background: "#0F0F0F", borderTop: "1px solid #1a1a1a" }}
      >
        <Wordmark size={15} dark />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#444" }}>
          Not affiliated with any university.
        </p>
      </footer>
    </div>
  );
}
