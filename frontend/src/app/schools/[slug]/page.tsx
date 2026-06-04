import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs } from "@/lib/data";
import type { CategoryData } from "@/lib/schools";

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

function quoteUsername(quoteIndex: number, cardIndex: number): string {
  return FAKE_USERNAMES[(quoteIndex * 3 + cardIndex) % FAKE_USERNAMES.length];
}

function UpvoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 3l7 14H3L10 3z" />
    </svg>
  );
}

function RedditQuote({ quote, username }: { quote: string; username: string }) {
  return (
    <div className="bg-[#f5f1eb] border border-[#d6d1c8] p-3 text-sm" style={{ borderRadius: "6px" }}>
      <div className="flex items-start gap-2">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#c9a052] mt-1 shrink-0" />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-[#c9a052]">u/{username}</span>
          <p className="text-[#78716c] mt-0.5 leading-relaxed italic font-light">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

type CardTheme = { icon: string; iconBg: string; labelColor: string };

const CARD_THEMES: Record<string, CardTheme> = {
  housing:       { icon: "🏠", iconBg: "bg-blue-50",   labelColor: "text-blue-700"   },
  social_life:   { icon: "🎉", iconBg: "bg-purple-50", labelColor: "text-purple-700" },
  dining:        { icon: "🍽️", iconBg: "bg-amber-50",  labelColor: "text-amber-700"  },
  mental_health: { icon: "🧠", iconBg: "bg-teal-50",   labelColor: "text-teal-700"   },
  financial_aid: { icon: "💰", iconBg: "bg-yellow-50", labelColor: "text-yellow-700" },
  academics:     { icon: "📚", iconBg: "bg-indigo-50", labelColor: "text-indigo-700" },
};

function CategoryCard({
  title, themeKey, data, cardIndex,
}: {
  title: string; themeKey: string; data: CategoryData; cardIndex: number;
}) {
  const theme = CARD_THEMES[themeKey];
  return (
    <div className="bg-white border border-[#d6d1c8] p-5 flex flex-col gap-4" style={{ borderRadius: "8px" }}>
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 ${theme.iconBg} flex items-center justify-center text-lg shrink-0`} style={{ borderRadius: "6px" }}>
          {theme.icon}
        </div>
        <span className={`text-sm font-bold ${theme.labelColor} font-[family-name:var(--font-display)]`}>
          {title}
        </span>
      </div>
      <p className="text-[#78716c] text-sm leading-relaxed font-light">{data.summary}</p>
      <div className="flex flex-col gap-2">
        {data.key_quotes.map((quote, i) => (
          <RedditQuote key={i} quote={quote} username={quoteUsername(i, cardIndex)} />
        ))}
      </div>
    </div>
  );
}

function DarkRedditQuote({ quote, username }: { quote: string; username: string }) {
  return (
    <div className="bg-[#D62839]/10 border border-[#D62839]/20 p-4 text-sm" style={{ borderRadius: "6px" }}>
      <div className="flex items-start gap-2.5">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#D62839] mt-1 shrink-0" />
        <div>
          <span className="text-xs font-semibold text-[#D62839]/70">u/{username}</span>
          <p className="text-red-100 mt-0.5 leading-relaxed italic font-light">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function GreenRedditQuote({ quote, username }: { quote: string; username: string }) {
  return (
    <div className="bg-white border border-[#3BB273]/25 p-4 text-sm" style={{ borderRadius: "6px" }}>
      <div className="flex items-start gap-2.5">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#3BB273] mt-1 shrink-0" />
        <div>
          <span className="text-xs font-semibold text-[#3BB273]">u/{username}</span>
          <p className="text-[#78716c] mt-0.5 leading-relaxed italic font-light">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
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
  const name = school?.name ?? slug;
  const location = school?.location ?? "";
  const stats = school?.stats ?? [];
  const summary = loadSummary(slug);

  const mainCategories: Array<{ key: keyof typeof summary; label: string }> = [
    { key: "housing",       label: "Housing"       },
    { key: "social_life",   label: "Social Life"   },
    { key: "dining",        label: "Dining"        },
    { key: "mental_health", label: "Mental Health" },
    { key: "financial_aid", label: "Financial Aid" },
    { key: "academics",     label: "Academics"     },
  ];

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1c1917] relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 pt-14 pb-32 sm:pt-20 sm:pb-44 text-white">
          <a
            href="/schools"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-sm mb-8 font-light"
          >
            ← All schools
          </a>

          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#c9a052]" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#c9a052]">
              School Profile
            </span>
          </div>

          <h1
            className="font-[family-name:var(--font-display)] font-bold text-white leading-tight mb-2"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}
          >
            {name}
          </h1>
          {location && (
            <p className="text-white/35 text-base font-light mb-10">{location}</p>
          )}

          <div className="bg-white/[0.05] border border-white/10 p-5 sm:p-7 max-w-2xl" style={{ borderRadius: "8px" }}>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.18em] mb-3">
              Overall Vibe
            </p>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light">
              {summary.overall_vibe.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            {summary.overall_vibe.key_quotes.map((q, i) => (
              <div
                key={i}
                className="bg-white/[0.05] border border-white/10 px-4 py-2 text-sm text-white/50 max-w-xs font-light"
                style={{ borderRadius: "6px" }}
              >
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#f5f1eb] pointer-events-none" />
      </section>

      {/* Stats chips */}
      {stats.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 mb-16">
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white border border-[#d6d1c8] px-5 py-2.5 text-sm font-semibold text-[#1c1917] font-[family-name:var(--font-display)]"
                style={{ borderRadius: "100px" }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category cards */}
      <div className={`max-w-4xl mx-auto px-6 pb-20 ${stats.length === 0 ? "pt-10" : ""}`}>
        <h2
          className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-2xl mb-1"
          style={{ letterSpacing: "-0.01em" }}
        >
          What Students Are Saying
        </h2>
        <p className="text-[#78716c] text-sm mb-8 font-light">
          Sourced from Reddit · student communities &amp; r/ApplyingToCollege, r/college
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mainCategories.map(({ key, label }, i) => (
            <CategoryCard
              key={key}
              title={label}
              themeKey={key}
              data={summary[key]}
              cardIndex={i}
            />
          ))}
        </div>
      </div>

      {/* Red Flags */}
      <section className="bg-[#1a0505] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#D62839]/50" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#D62839]/60">
              Red Flags
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-white text-2xl mb-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            Things to know before you commit
          </h2>
          <p className="text-white/40 leading-relaxed mb-7 max-w-2xl text-sm font-light">
            {summary.red_flags.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.red_flags.key_quotes.map((quote, i) => (
              <DarkRedditQuote key={i} quote={quote} username={quoteUsername(i, 99)} />
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <section className="bg-white border border-[#d6d1c8] p-6 sm:p-8" style={{ borderRadius: "8px" }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#3BB273]/50" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#3BB273]">
              Hidden Gems
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-xl mb-2"
          >
            Insider tips from current students
          </h2>
          <p className="text-[#78716c] leading-relaxed mb-5 text-sm font-light">
            {summary.hidden_gems.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.hidden_gems.key_quotes.map((quote, i) => (
              <GreenRedditQuote key={i} quote={quote} username={quoteUsername(i, 88)} />
            ))}
          </div>
        </section>

        <footer className="border-t border-[#d6d1c8] pt-10 pb-4 text-center">
          <div
            className="inline-flex items-start gap-3 bg-white border border-[#d6d1c8] px-5 py-4 max-w-xl text-sm text-[#78716c] text-left"
            style={{ borderRadius: "8px" }}
          >
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            <p className="font-light">
              <span className="font-semibold text-[#1c1917]">Disclaimer: </span>
              Based on real student opinions from Reddit — not official school
              content. Views reflect individual student experiences and may not
              represent the full picture. Always visit campus and do your own research.
            </p>
          </div>
          <p className="mt-6 font-mono text-[9px] font-bold text-[#c9a052]/50 tracking-[0.2em] uppercase">
            UnfilteredU
          </p>
        </footer>
      </div>
    </div>
  );
}
