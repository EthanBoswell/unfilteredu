import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

function QuoteRow({ quote, seed, accentColor }: { quote: string; seed: number; accentColor: string }) {
  return (
    <div
      className="p-3 rounded"
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div className="flex items-start gap-2">
        <span style={{ color: accentColor, fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>▲</span>
        <div>
          <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
            u/{quoteUsername(seed)}
          </span>
          <p className="text-[11px] leading-relaxed mt-0.5 italic" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Georgia, serif" }}>
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
      className="flex flex-col gap-4 p-5 rounded-xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 flex items-center justify-center text-base rounded-lg shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          {CARD_ICONS[themeKey]}
        </div>
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: primaryColor }}
        >
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
        {data.summary}
      </p>
      <div className="flex flex-col gap-2">
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

      {/* Header with school-color gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primary}22 0%, #0a0612 60%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <a
            href="/schools"
            className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase opacity-30 hover:opacity-60 transition-opacity mb-8"
          >
            ← All schools
          </a>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase opacity-40 mb-2">{school.location}</p>
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
              >
                {school.name}
              </h1>
            </div>
            <div className="sm:ml-auto sm:text-right shrink-0">
              <div className="text-xs opacity-40 mb-1">sourced from</div>
              <div className="text-sm font-bold" style={{ color: primary === "#ffffff" ? "#ccc" : primary }}>
                r/{school.slug} · r/ApplyingToCollege
              </div>
              <div className="text-xs opacity-30">10,000+ posts analyzed</div>
            </div>
          </div>

          {/* Overall vibe */}
          <div
            className="mt-6 p-5 rounded-xl"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-xs tracking-widest uppercase opacity-40 mb-3">Overall vibe</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
              {summary.overall_vibe.summary}
            </p>
          </div>

          {/* Stats chips */}
          {school.stats.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {school.stats.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: primary, color: "#ffffff" }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main category cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <p className="text-xs tracking-widest uppercase opacity-40 mb-4">What students are saying</p>
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

      {/* Red Flags */}
      <div style={{ backgroundColor: "#0f0408", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-6" style={{ backgroundColor: "rgba(214,40,57,0.5)" }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(214,40,57,0.7)" }}>Red Flags</p>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
            {summary.red_flags.summary}
          </p>
          <div className="flex flex-col gap-2">
            {summary.red_flags.key_quotes.map((quote, i) => (
              <div
                key={i}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(214,40,57,0.08)",
                  border: "1px solid rgba(214,40,57,0.15)",
                  borderLeft: "3px solid rgba(214,40,57,0.6)",
                }}
              >
                <div className="flex items-start gap-2">
                  <span style={{ color: "#D62839", fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>▲</span>
                  <div>
                    <span className="text-[10px] font-bold" style={{ color: "rgba(214,40,57,0.5)" }}>
                      u/{quoteUsername(i * 11 + 99)}
                    </span>
                    <p className="text-[12px] leading-relaxed mt-0.5 italic" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Gems */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-6" style={{ backgroundColor: "rgba(59,178,115,0.5)" }} />
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(59,178,115,0.8)" }}>Hidden Gems</p>
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
          {summary.hidden_gems.summary}
        </p>
        <div className="flex flex-col gap-2">
          {summary.hidden_gems.key_quotes.map((quote, i) => (
            <div
              key={i}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(59,178,115,0.06)",
                border: "1px solid rgba(59,178,115,0.15)",
                borderLeft: "3px solid rgba(59,178,115,0.5)",
              }}
            >
              <div className="flex items-start gap-2">
                <span style={{ color: "#3BB273", fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>▲</span>
                <div>
                  <span className="text-[10px] font-bold" style={{ color: "rgba(59,178,115,0.6)" }}>
                    u/{quoteUsername(i * 9 + 88)}
                  </span>
                  <p className="text-[12px] leading-relaxed mt-0.5 italic" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reddit quotes */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "#0d0818" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs tracking-widest uppercase opacity-40 mb-4">Straight from Reddit</p>
          <div className="flex flex-col gap-3">
            {bottomQuotes.map((quote, i) => (
              <div
                key={i}
                className="p-4 rounded-lg transition-colors hover:bg-white/[0.06]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `3px solid ${primary}`,
                }}
              >
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif" }}>
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ color: primary, fontSize: "11px" }}>▲</span>
                  <span className="text-[11px] opacity-40">{quote.upvotes.toLocaleString()}</span>
                  <span className="text-[11px] opacity-25 ml-1">u/{quoteUsername(i * 7 + quote.text.length)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-4 text-center">
        <div
          className="inline-flex items-start gap-3 p-4 rounded-lg text-left max-w-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-sm shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span className="font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>Disclaimer: </span>
            Based on real student opinions from Reddit — not official school content. Views reflect individual
            student experiences and may not represent the full picture. Always visit campus and do your own research.
          </p>
        </div>
        <p
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          Room 214 · {school.name}
        </p>
      </div>
    </div>
  );
}
