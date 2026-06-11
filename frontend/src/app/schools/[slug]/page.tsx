import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs } from "@/lib/data";
import type { CategoryData, Summary } from "@/lib/schools";
import { schoolColors } from "@/data/schoolColors";

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

const FAKE_USERNAMES = [
  "anon_student", "college_bound_24", "reddit_lurker99", "freshman_vibes",
  "campus_insider", "honest_review", "student_life_real", "dorm_dweller",
  "late_night_study", "quad_walker", "first_gen_student", "transfer_tales",
];

function quoteUsername(seed: number): string {
  return FAKE_USERNAMES[seed % FAKE_USERNAMES.length];
}

function fakeUpvotes(seed: number, text: string): number {
  return 300 + ((seed * 211 + text.length * 37) % 1300);
}

const GRID_CATEGORIES: Array<{ key: keyof Summary; label: string; icon: string }> = [
  { key: "housing",             label: "Housing",             icon: "🏠" },
  { key: "social_life",         label: "Social Life",         icon: "🎉" },
  { key: "dining",               label: "Dining",              icon: "🍽️" },
  { key: "mental_health",       label: "Mental Health",       icon: "🧠" },
  { key: "financial_aid",       label: "Financial Aid",       icon: "💰" },
  { key: "academics",           label: "Academics",           icon: "📚" },
  { key: "administration",      label: "Administration",      icon: "🏛️" },
  { key: "location_and_campus", label: "Location & Campus",   icon: "📍" },
  { key: "career_outcomes",     label: "Career Outcomes",     icon: "💼" },
  { key: "value_for_money",     label: "Value for Money",     icon: "💵" },
];

function scoreColor(score: number): string {
  if (score <= 3) return "#D62839";
  if (score <= 6) return "#E8A33D";
  return "#3BB273";
}

function ScoreBar({ score, trackColor = "rgba(0,0,0,0.08)" }: { score: number; trackColor?: string }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: trackColor }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(10, score)) * 10}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span style={{ display: "inline-block", width: "3px", height: "14px", backgroundColor: color, borderRadius: "2px", flexShrink: 0 }} />
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#777777" }}>
        {text}
      </p>
    </div>
  );
}

function QuoteRow({ quote, seed, accentColor, dark = false }: { quote: string; seed: number; accentColor: string; dark?: boolean }) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: dark ? "rgba(255,255,255,0.05)" : "#F7F7F7",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div className="flex items-start gap-2">
        <span style={{ color: accentColor, fontSize: "9px", marginTop: "3px", flexShrink: 0 }}>▲</span>
        <div>
          <span className="text-[10px] font-bold tracking-wide" style={{ color: `${accentColor}cc` }}>
            u/{quoteUsername(seed)}
          </span>
          <p
            className="text-[12px] leading-relaxed mt-1 italic"
            style={{ color: dark ? "rgba(255,255,255,0.85)" : "#333333", fontFamily: "Georgia, serif" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreOverviewBar({ summary }: { summary: Summary }) {
  return (
    <div style={{ background: "#1A1612" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: "#C4B89A" }}>
          Score Overview
        </p>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {GRID_CATEGORIES.map(({ key, label }) => {
            const score = summary[key].score;
            return (
              <div key={key} className="flex flex-col items-center gap-2 shrink-0" style={{ width: "82px" }}>
                <span
                  className="text-[8px] font-bold tracking-wide uppercase text-center leading-tight h-6 flex items-center"
                  style={{ color: "#C4B89A" }}
                >
                  {label}
                </span>
                <ScoreBar score={score} trackColor="rgba(255,255,255,0.08)" />
                <span className="text-base font-black" style={{ color: scoreColor(score), fontFamily: "Georgia, serif" }}>
                  {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SpotlightCard({
  icon, label, data, primaryColor, kind,
}: {
  icon: string;
  label: string;
  data: CategoryData;
  primaryColor: string;
  kind: "warning" | "highlight";
}) {
  const accent = kind === "warning" ? "#D62839" : "#3BB273";
  const tag = kind === "warning" ? "Heads up" : "Standout";

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-xl bg-white"
      style={{ border: "1px solid rgba(0,0,0,0.08)", borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 flex items-center justify-center text-base rounded-lg shrink-0"
            style={{ backgroundColor: `${primaryColor}18` }}
          >
            {icon}
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "#444444" }}>
            {label}
          </span>
        </div>
        <span className="text-2xl font-black" style={{ color: accent, fontFamily: "Georgia, serif" }}>
          {data.score}
        </span>
      </div>
      <span className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: accent }}>
        {tag}
      </span>
      <p className="text-[13px] leading-relaxed line-clamp-4" style={{ color: "#444444", fontFamily: "Georgia, serif" }}>
        {data.summary}
      </p>
    </div>
  );
}

function CategoryCard({ icon, label, data, cardIndex, primaryColor }: {
  icon: string;
  label: string;
  data: CategoryData;
  cardIndex: number;
  primaryColor: string;
}) {
  return (
    <div
      className="cat-card flex flex-col gap-4 p-6 rounded-xl bg-white"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        "--glow-border": `${primaryColor}40`,
        "--glow-shadow": `${primaryColor}18`,
      } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center text-lg rounded-xl shrink-0"
            style={{ backgroundColor: `${primaryColor}18` }}
          >
            {icon}
          </div>
          <span
            className="text-[11px] font-bold tracking-[0.18em] uppercase"
            style={{ color: primaryColor }}
          >
            {label}
          </span>
        </div>
        <span className="text-sm font-black shrink-0" style={{ color: scoreColor(data.score), fontFamily: "Georgia, serif" }}>
          {data.score}/10
        </span>
      </div>
      <ScoreBar score={data.score} />
      <p className="text-sm leading-relaxed" style={{ color: "#444444", fontFamily: "Georgia, serif" }}>
        {data.summary}
      </p>
      <div className="flex flex-col gap-2 mt-1">
        {data.key_quotes.map((quote, i) => (
          <QuoteRow key={i} quote={quote} seed={cardIndex * 7 + i * 3} accentColor={primaryColor} />
        ))}
      </div>
    </div>
  );
}

function gatherBottomQuotes(categories: CategoryData[]): Array<{ text: string; upvotes: number }> {
  return categories
    .map((cat, i) => {
      const text = cat.key_quotes[0];
      return text ? { text, upvotes: fakeUpvotes(i * 17 + 5, text) } : null;
    })
    .filter((q): q is { text: string; upvotes: number } => q !== null)
    .slice(0, 3);
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

  const sortedByScore = [...GRID_CATEGORIES].sort((a, b) => summary[a.key].score - summary[b.key].score);
  const lowestThree = sortedByScore.slice(0, 3);
  const highestOne = sortedByScore[sortedByScore.length - 1];

  const bottomQuotes = gatherBottomQuotes([
    summary.overall_vibe,
    summary.social_life,
    summary.hidden_gems,
  ]);

  return (
    <div className="min-h-screen bg-[#EFEFED] font-mono">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
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

          {/* Overall vibe — editorial statement */}
          <div className="mt-8 pl-5" style={{ borderLeft: `4px solid ${primary}` }}>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: primary }}>
              Overall Vibe
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#333333", fontFamily: "Georgia, serif" }}
            >
              {summary.overall_vibe.summary}
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

      {/* ── Score Overview ───────────────────────────────────────────── */}
      <ScoreOverviewBar summary={summary} />

      {/* ── Spotlight ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <SectionLabel text="Before You Commit" color={primary} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lowestThree.map(({ key, label, icon }) => (
            <SpotlightCard key={key} icon={icon} label={label} data={summary[key]} primaryColor={primary} kind="warning" />
          ))}
          <SpotlightCard
            key={highestOne.key}
            icon={highestOne.icon}
            label={highestOne.label}
            data={summary[highestOne.key]}
            primaryColor={primary}
            kind="highlight"
          />
        </div>
      </div>

      {/* ── Category cards ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
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

      {/* ── Red Flags ─────────────────────────────────────────────────── */}
      <div style={{ background: "#2D0A0A" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚠️</span>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#FF6B6B" }}>
              Red Flags
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#F2C9C9", fontFamily: "Georgia, serif" }}>
            {summary.red_flags.summary}
          </p>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FF6B6B" }}>
                Severity
              </span>
              <span className="text-sm font-black" style={{ color: "#FF6B6B", fontFamily: "Georgia, serif" }}>
                {summary.red_flags.score}/10
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(0, Math.min(10, summary.red_flags.score)) * 10}%`, background: "#FF6B6B" }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {summary.red_flags.key_quotes.map((quote, i) => (
              <QuoteRow key={i} quote={quote} seed={i * 11 + 99} accentColor="#FF6B6B" dark />
            ))}
          </div>
        </div>
      </div>

      {/* ── Hidden Gems ───────────────────────────────────────────────── */}
      <div style={{ background: "#0A2D0F" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl" style={{ color: "#6FE08C" }}>◆</span>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#6FE08C" }}>
              Hidden Gems
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#CDEFD6", fontFamily: "Georgia, serif" }}>
            {summary.hidden_gems.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.hidden_gems.key_quotes.map((quote, i) => (
              <QuoteRow key={i} quote={quote} seed={i * 9 + 88} accentColor="#6FE08C" dark />
            ))}
          </div>
        </div>
      </div>

      {/* ── Straight from Reddit ──────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#E8E8E6" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SectionLabel text="Straight from Reddit" color={primary} />
          <div className="flex flex-col gap-3">
            {bottomQuotes.map((quote, i) => (
              <div
                key={i}
                className="cat-card p-5 rounded-xl bg-white"
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${primary}`,
                  "--glow-border": `${primary}35`,
                  "--glow-shadow": `${primary}12`,
                } as CSSProperties}
              >
                <p className="text-sm leading-relaxed italic" style={{ color: "#333333", fontFamily: "Georgia, serif" }}>
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ color: primary, fontSize: "10px" }}>▲</span>
                  <span className="text-[11px]" style={{ color: "#999999" }}>{quote.upvotes.toLocaleString()}</span>
                  <span className="text-[11px] ml-1" style={{ color: "#bbbbbb" }}>
                    u/{quoteUsername(i * 7 + quote.text.length)}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
