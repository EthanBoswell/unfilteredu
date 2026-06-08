import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs } from "@/lib/data";
import type { CategoryData } from "@/lib/schools";
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

const CARD_ICONS: Record<string, string> = {
  housing:       "🏠",
  social_life:   "🎉",
  dining:        "🍽️",
  mental_health: "🧠",
  financial_aid: "💰",
  academics:     "📚",
};

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        style={{ display: "inline-block", width: "3px", height: "14px", backgroundColor: color, borderRadius: "2px", flexShrink: 0 }}
      />
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
        {text}
      </p>
    </div>
  );
}

function QuoteRow({ quote, seed, accentColor }: { quote: string; seed: number; accentColor: string }) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${accentColor}55`,
      }}
    >
      <div className="flex items-start gap-2">
        <span style={{ color: accentColor, fontSize: "9px", marginTop: "3px", flexShrink: 0 }}>▲</span>
        <div>
          <span className="text-[10px] font-bold tracking-wide" style={{ color: `${accentColor}99` }}>
            u/{quoteUsername(seed)}
          </span>
          <p className="text-[12px] leading-relaxed mt-1 italic" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "Georgia, serif" }}>
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ themeKey, label, data, cardIndex, primaryColor }: {
  themeKey: string;
  label: string;
  data: CategoryData;
  cardIndex: number;
  primaryColor: string;
}) {
  return (
    <div
      className="cat-card flex flex-col gap-4 p-6 rounded-xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        "--glow-border": `${primaryColor}45`,
        "--glow-shadow": `${primaryColor}22`,
      } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 flex items-center justify-center text-lg rounded-xl shrink-0"
          style={{ backgroundColor: `${primaryColor}18` }}
        >
          {CARD_ICONS[themeKey]}
        </div>
        <span
          className="text-[11px] font-bold tracking-[0.18em] uppercase"
          style={{ color: primaryColor }}
        >
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
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

  const mainCategories: Array<{ key: keyof typeof summary; label: string }> = [
    { key: "housing",       label: "Housing"       },
    { key: "social_life",   label: "Social Life"   },
    { key: "dining",        label: "Dining"        },
    { key: "mental_health", label: "Mental Health" },
    { key: "financial_aid", label: "Financial Aid" },
    { key: "academics",     label: "Academics"     },
  ];

  const bottomQuotes = gatherBottomQuotes([
    summary.overall_vibe,
    summary.social_life,
    summary.hidden_gems,
  ]);

  return (
    <div className="min-h-screen bg-[#0a0612] text-[#f0ebe8] font-mono">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${primary}2e 0%, #0a0612 55%)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          <a
            href="/schools"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase opacity-30 hover:opacity-70 transition-opacity mb-10"
          >
            ← All schools
          </a>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: `${primary}cc` }}>
                {school.location}
              </p>
              <h1
                className="font-bold leading-none mb-4"
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
              >
                {school.name}
              </h1>
              {/* Colored accent line under name */}
              <div style={{ width: "48px", height: "3px", backgroundColor: primary, borderRadius: "2px" }} />
            </div>

            <div className="sm:text-right shrink-0 pt-1">
              <div className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>sourced from</div>
              <div className="text-sm font-bold" style={{ color: primary === "#ffffff" ? "#ccc" : `${primary}dd` }}>
                r/{school.slug} · r/ApplyingToCollege
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>10,000+ posts analyzed</div>
            </div>
          </div>

          {/* Overall vibe — editorial statement */}
          <div
            className="mt-8 pl-5"
            style={{ borderLeft: `4px solid ${primary}` }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: `${primary}aa` }}>
              Overall Vibe
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "rgba(255,255,255,0.88)", fontFamily: "Georgia, serif" }}
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: `${primary}cc`, color: "#ffffff" }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Category cards ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <SectionLabel text="What students are saying" color={primary} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mainCategories.map(({ key, label }, i) => (
            <CategoryCard
              key={key}
              themeKey={key}
              label={label}
              data={summary[key]}
              cardIndex={i}
              primaryColor={primary}
            />
          ))}
        </div>
      </div>

      {/* ── Red Flags ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#0c0308", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SectionLabel text="⚠ Red Flags" color="#D62839" />
          <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
            {summary.red_flags.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.red_flags.key_quotes.map((quote, i) => (
              <div
                key={i}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(214,40,57,0.07)",
                  border: "1px solid rgba(214,40,57,0.18)",
                  borderLeft: "4px solid rgba(214,40,57,0.55)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span style={{ color: "#D62839", fontSize: "9px", marginTop: "4px", flexShrink: 0 }}>▲</span>
                  <div>
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: "rgba(214,40,57,0.6)" }}>
                      u/{quoteUsername(i * 11 + 99)}
                    </span>
                    <p className="text-[13px] leading-relaxed mt-1 italic" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hidden Gems ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <SectionLabel text="◆ Hidden Gems" color="#3BB273" />
        <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
          {summary.hidden_gems.summary}
        </p>
        <div className="flex flex-col gap-3">
          {summary.hidden_gems.key_quotes.map((quote, i) => (
            <div
              key={i}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(59,178,115,0.07)",
                border: "1px solid rgba(59,178,115,0.18)",
                borderLeft: "4px solid rgba(59,178,115,0.5)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <span style={{ color: "#3BB273", fontSize: "9px", marginTop: "4px", flexShrink: 0 }}>▲</span>
                <div>
                  <span className="text-[10px] font-bold tracking-wide" style={{ color: "rgba(59,178,115,0.65)" }}>
                    u/{quoteUsername(i * 9 + 88)}
                  </span>
                  <p className="text-[13px] leading-relaxed mt-1 italic" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Straight from Reddit ──────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0d0818" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SectionLabel text="Straight from Reddit" color={primary} />
          <div className="flex flex-col gap-3">
            {bottomQuotes.map((quote, i) => (
              <div
                key={i}
                className="cat-card p-5 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `4px solid ${primary}`,
                  "--glow-border": `${primary}40`,
                  "--glow-shadow": `${primary}18`,
                } as CSSProperties}
              >
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Georgia, serif" }}>
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ color: primary, fontSize: "10px" }}>▲</span>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{quote.upvotes.toLocaleString()}</span>
                  <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.25)" }}>
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
          className="inline-flex items-start gap-3 p-4 rounded-xl text-left max-w-xl w-full"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-sm shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>
            <span className="font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>Disclaimer: </span>
            Based on real student opinions from Reddit — not official school content. Views reflect individual
            student experiences and may not represent the full picture. Always visit campus and do your own research.
          </p>
        </div>
        <p
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{ color: "rgba(255,255,255,0.08)" }}
        >
          Room 214 · {school.name}
        </p>
      </div>
    </div>
  );
}
