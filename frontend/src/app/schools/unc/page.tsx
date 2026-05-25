import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UNC Chapel Hill — UnfilteredU",
  description:
    "Real student opinions about UNC Chapel Hill from Reddit. Housing, dining, academics, red flags, and hidden gems.",
};

type CategoryData = {
  summary: string;
  key_quotes: string[];
};

type Summary = {
  housing: CategoryData;
  social_life: CategoryData;
  dining: CategoryData;
  mental_health: CategoryData;
  financial_aid: CategoryData;
  academics: CategoryData;
  overall_vibe: CategoryData;
  red_flags: CategoryData;
  hidden_gems: CategoryData;
};

function loadSummary(): Summary {
  const jsonPath = path.join(process.cwd(), "..", "data", "unc_summary.json");
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Summary;
}

const FAKE_USERNAMES = [
  "tar_heel_2024",
  "unc_freshman",
  "chapel_hill_local",
  "anon_student",
  "ram_student_99",
  "carolina_blue",
  "franklin_st_fan",
  "north_carolina_born",
  "heel_alum",
  "unc_survivor",
  "study_hall_hero",
  "quad_walker",
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
    <div className="bg-[#F2F3F5] rounded-lg border border-slate-200 p-3 text-sm">
      <div className="flex items-start gap-2">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#EF6C35] mt-1 shrink-0" />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-[#EF6C35]">
            u/{username}
          </span>
          <p className="text-slate-600 mt-0.5 leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

type CardTheme = {
  icon: string;
  iconBg: string;
  labelColor: string;
};

const CARD_THEMES: Record<string, CardTheme> = {
  housing:      { icon: "🏠", iconBg: "bg-blue-50",   labelColor: "text-blue-700"   },
  social_life:  { icon: "🎉", iconBg: "bg-purple-50", labelColor: "text-purple-700" },
  dining:       { icon: "🍽️", iconBg: "bg-amber-50",  labelColor: "text-amber-700"  },
  mental_health:{ icon: "🧠", iconBg: "bg-teal-50",   labelColor: "text-teal-700"   },
  financial_aid:{ icon: "💰", iconBg: "bg-yellow-50", labelColor: "text-yellow-700" },
  academics:    { icon: "📚", iconBg: "bg-indigo-50", labelColor: "text-indigo-700" },
};

function CategoryCard({
  title,
  themeKey,
  data,
  cardIndex,
}: {
  title: string;
  themeKey: string;
  data: CategoryData;
  cardIndex: number;
}) {
  const theme = CARD_THEMES[themeKey];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl ${theme.iconBg} flex items-center justify-center text-lg shrink-0`}>
          {theme.icon}
        </div>
        <span className={`text-sm font-bold ${theme.labelColor}`}>{title}</span>
      </div>
      <p className="text-slate-500 text-sm leading-relaxed">{data.summary}</p>
      <div className="flex flex-col gap-2">
        {data.key_quotes.map((quote, i) => (
          <RedditQuote
            key={i}
            quote={quote}
            username={quoteUsername(i, cardIndex)}
          />
        ))}
      </div>
    </div>
  );
}

function DarkRedditQuote({ quote, username }: { quote: string; username: string }) {
  return (
    <div className="bg-[#D62839]/10 border border-[#D62839]/30 rounded-xl p-4 text-sm">
      <div className="flex items-start gap-2.5">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#D62839] mt-1 shrink-0" />
        <div>
          <span className="text-xs font-semibold text-[#D62839]/80">u/{username}</span>
          <p className="text-red-100 mt-0.5 leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function GreenRedditQuote({ quote, username }: { quote: string; username: string }) {
  return (
    <div className="bg-white/70 rounded-xl border border-[#3BB273]/30 p-4 text-sm">
      <div className="flex items-start gap-2.5">
        <UpvoteIcon className="w-3.5 h-3.5 text-[#3BB273] mt-1 shrink-0" />
        <div>
          <span className="text-xs font-semibold text-[#3BB273]">u/{username}</span>
          <p className="text-slate-700 mt-0.5 leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UNCPage() {
  const summary = loadSummary();

  const mainCategories: Array<{ key: keyof Summary; label: string }> = [
    { key: "housing",      label: "Housing"       },
    { key: "social_life",  label: "Social Life"   },
    { key: "dining",       label: "Dining"        },
    { key: "mental_health",label: "Mental Health" },
    { key: "financial_aid",label: "Financial Aid" },
    { key: "academics",    label: "Academics"     },
  ];

  const stats = [
    { icon: "📋", label: "84K+ Applicants"     },
    { icon: "🏠", label: "Competitive Housing" },
    { icon: "🐏", label: "Strong School Spirit" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#2B2D42] relative overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-5 pt-14 pb-32 sm:pt-20 sm:pb-44 text-white">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            ← All schools
          </a>
          <div className="inline-flex items-center gap-2 bg-[#EF6C35]/20 border border-[#EF6C35]/30 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#EF6C35] mb-5 ml-2">
            🎓 School Profile
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-3 leading-tight">
            UNC Chapel Hill
          </h1>
          <p className="text-white/50 text-base sm:text-lg mb-10">
            University of North Carolina at Chapel Hill · Chapel Hill, NC
          </p>
          <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 sm:p-7 max-w-2xl border border-white/10">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              Overall Vibe
            </p>
            <p className="text-white text-base sm:text-lg leading-relaxed">
              {summary.overall_vibe.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {summary.overall_vibe.key_quotes.map((q, i) => (
              <div
                key={i}
                className="bg-white/8 rounded-xl px-4 py-2 text-sm text-white/70 border border-white/10 max-w-xs"
              >
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>
        {/* Bottom bleed */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F2F3F5] pointer-events-none" />
      </section>

      {/* Stats bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-16">
        <div className="flex flex-wrap justify-center gap-3">
          {stats.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md border border-slate-100 text-sm font-semibold text-[#2B2D42]"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black text-[#2B2D42] mb-1">
          What Students Are Saying
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Sourced from Reddit · r/UNC, r/chapelhill, r/ApplyingToCollege, r/college
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* Red Flags — full bleed, dark */}
      <section className="bg-[#1a0505] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D62839]/20 border border-[#D62839]/30 flex items-center justify-center text-2xl shrink-0 mt-0.5">
              🚩
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Red Flags</h2>
              <p className="text-[#D62839]/70 text-sm mt-0.5">
                Things to know before you commit
              </p>
            </div>
          </div>
          <p className="text-white/60 leading-relaxed mb-7 max-w-2xl text-sm">
            {summary.red_flags.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.red_flags.key_quotes.map((quote, i) => (
              <DarkRedditQuote
                key={i}
                quote={quote}
                username={quoteUsername(i, 99)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3BB273]/15 border border-[#3BB273]/30 flex items-center justify-center text-2xl shrink-0 mt-0.5">
              💎
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2B2D42]">Hidden Gems</h2>
              <p className="text-[#3BB273] text-sm mt-0.5">
                Insider tips from current students
              </p>
            </div>
          </div>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            {summary.hidden_gems.summary}
          </p>
          <div className="flex flex-col gap-3">
            {summary.hidden_gems.key_quotes.map((quote, i) => (
              <GreenRedditQuote
                key={i}
                quote={quote}
                username={quoteUsername(i, 88)}
              />
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-10 pb-4 text-center">
          <div className="inline-flex items-start gap-3 bg-white rounded-2xl border border-slate-200 px-5 py-4 max-w-xl text-sm text-slate-500 text-left shadow-sm">
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            <p>
              <span className="font-semibold text-slate-600">Disclaimer: </span>
              Based on real student opinions from Reddit — not official school
              content. Views reflect individual student experiences and may not
              represent the full picture. Always visit campus and do your own
              research.
            </p>
          </div>
          <p className="mt-6 text-xs font-bold text-slate-400 tracking-widest uppercase">
            UnfilteredU
          </p>
        </footer>
      </div>
    </div>
  );
}
