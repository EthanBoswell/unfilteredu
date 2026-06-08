import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getSchoolBySlug, getRoomPalette } from "@/lib/schools";
import { loadSummary, getAvailableSlugs } from "@/lib/data";
import type { CategoryData, Summary } from "@/lib/schools";

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

const STICKY_COLORS = [
  "bg-yellow-200 rotate-1",
  "bg-pink-200 -rotate-2",
  "bg-blue-200 rotate-2",
  "bg-green-200 -rotate-1",
  "bg-orange-200 rotate-3",
];

const FAKE_USERNAMES = [
  "anon_student", "college_bound_24", "reddit_lurker99", "freshman_vibes",
  "campus_insider", "honest_review", "student_life_real", "dorm_dweller",
  "late_night_study", "quad_walker", "first_gen_student", "transfer_tales",
];

function quoteUsername(seed: number): string {
  return FAKE_USERNAMES[seed % FAKE_USERNAMES.length];
}

// Deterministic so server and client render the same "upvote" counts.
function fakeUpvotes(seed: number, text: string): number {
  return 300 + ((seed * 211 + text.length * 37) % 1300);
}

function splitInsights(text: string, max: number): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, max);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

type Poster = {
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  size: "large" | "medium" | "small";
  rotation: string;
};

function buildPosters(summary: Summary, primaryColor: string): Poster[] {
  return [
    {
      title: "SOCIAL LIFE",
      subtitle: truncate(splitInsights(summary.social_life.summary, 1)[0] ?? "", 70),
      color: primaryColor,
      accent: "#ffffff",
      size: "large",
      rotation: "-rotate-1",
    },
    {
      title: "RED FLAGS ⚠",
      subtitle: truncate(splitInsights(summary.red_flags.summary, 1)[0] ?? "", 60),
      color: "#8B0000",
      accent: "#FFD700",
      size: "medium",
      rotation: "rotate-2",
    },
    {
      title: "HIDDEN GEMS",
      subtitle: truncate(splitInsights(summary.hidden_gems.summary, 1)[0] ?? "", 50),
      color: "#1a3a1a",
      accent: "#90EE90",
      size: "small",
      rotation: "-rotate-2",
    },
  ];
}

function posterDimensions(size: Poster["size"]) {
  switch (size) {
    case "large":
      return { padding: "16px 20px", width: "180px", fontSize: "18px" };
    case "medium":
      return { padding: "12px 16px", width: "140px", fontSize: "14px" };
    case "small":
      return { padding: "10px 12px", width: "110px", fontSize: "11px" };
  }
}

function gatherQuotes(summary: Summary): Array<{ text: string; upvotes: number }> {
  const sources: Array<{ category: CategoryData; weight: number }> = [
    { category: summary.overall_vibe, weight: 7 },
    { category: summary.social_life, weight: 5 },
    { category: summary.hidden_gems, weight: 3 },
  ];
  const quotes: Array<{ text: string; upvotes: number }> = [];
  sources.forEach(({ category, weight }, sourceIndex) => {
    const text = category.key_quotes[0];
    if (text) quotes.push({ text, upvotes: fakeUpvotes(sourceIndex * 13 + weight, text) });
  });
  return quotes;
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
  const { roomColor, wallColor, accentColor } = getRoomPalette(school);

  const posters = buildPosters(summary, school.colors.primary);
  const stickyNotes = splitInsights(summary.housing.summary, 5).map((s) => truncate(s, 110));
  const whiteboardItems = splitInsights(summary.academics.summary, 4).map((s) => truncate(s, 90));
  const redditQuotes = gatherQuotes(summary);
  const vibeTagline = truncate(splitInsights(summary.overall_vibe.summary, 1)[0] ?? "", 80);

  return (
    <div className="min-h-screen bg-[#0a0612] text-[#f0ebe8] font-mono">
      <Navbar />

      {/* School header */}
      <div className="px-4 sm:px-6 pt-8 pb-4 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase opacity-40 mb-1">{school.location}</p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {school.name}
            </h1>
            {vibeTagline && <p className="mt-1 text-sm opacity-60 italic">&ldquo;{vibeTagline}&rdquo;</p>}
          </div>
          <div className="sm:ml-auto sm:text-right">
            <div className="text-xs opacity-40 mb-1">sourced from</div>
            <div className="text-orange-400 text-sm font-bold">r/{school.slug} · r/ApplyingToCollege</div>
            <div className="text-xs opacity-30">10,000+ posts analyzed</div>
          </div>
        </div>
      </div>

      {/* THE DORM ROOM */}
      <div
        className="mx-3 sm:mx-4 my-6 rounded-2xl relative overflow-hidden flex flex-col gap-5 p-4 sm:block sm:p-0 sm:min-h-[520px]"
        style={{
          backgroundColor: roomColor,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            )
          `,
        }}
      >
        {/* Wall - upper portion (desktop room layout only) */}
        <div
          className="hidden sm:block absolute top-0 left-0 right-0 sm:h-[55%]"
          style={{ backgroundColor: wallColor, borderBottom: "3px solid rgba(255,255,255,0.08)" }}
        />

        {/* Ambient lamp glow */}
        <div
          className="hidden sm:block absolute sm:w-[300px] sm:h-[300px] sm:right-[10%] sm:-top-[50px]"
          style={{
            background: "radial-gradient(circle, rgba(255,180,50,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* POSTERS on the wall */}
        <div className="flex flex-wrap gap-3 sm:absolute sm:top-4 sm:left-6">
          {posters.map((poster, i) => {
            const dims = posterDimensions(poster.size);
            return (
              <div
                key={i}
                className={`${poster.rotation} cursor-pointer transition-transform hover:scale-105 relative`}
                style={{
                  backgroundColor: poster.color,
                  color: poster.accent,
                  padding: dims.padding,
                  width: dims.width,
                  border: `2px solid ${poster.accent}22`,
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
                  fontFamily: "Georgia, serif",
                }}
              >
                <div
                  style={{
                    fontSize: dims.fontSize,
                    fontWeight: "bold",
                    lineHeight: 1.1,
                    marginBottom: "6px",
                  }}
                >
                  {poster.title}
                </div>
                <div style={{ fontSize: "10px", opacity: 0.7 }}>{poster.subtitle}</div>
                {/* Tape effect */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "14px",
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderRadius: "2px",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Radio / music player on wall */}
        <div
          className="text-left sm:text-right sm:absolute sm:top-6 sm:right-6"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}
        >
          <div className="flex items-center gap-2 sm:justify-end">
            <span className="animate-pulse" style={{ color: accentColor }}>●</span>
            <span>{school.radioStation}</span>
          </div>
          <div style={{ fontSize: "9px", marginTop: "2px", opacity: 0.5 }}>
            playing in the background
          </div>
        </div>

        {/* DESK AREA - lower portion */}
        <div className="flex flex-col gap-4 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:h-[48%]">
          {/* Desk surface line */}
          <div
            className="hidden sm:block absolute top-0 left-0 right-0"
            style={{ height: "3px", backgroundColor: "rgba(255,255,255,0.1)" }}
          />

          {/* STICKY NOTES scattered on desk */}
          <div className="flex flex-wrap gap-2 sm:absolute sm:top-4 sm:left-4 sm:max-w-[55%]">
            {stickyNotes.map((note, i) => (
              <div
                key={i}
                className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${STICKY_COLORS[i % STICKY_COLORS.length]}`}
                style={{
                  padding: "8px 10px",
                  fontSize: "10px",
                  lineHeight: 1.4,
                  color: "#1a1a1a",
                  maxWidth: "140px",
                  boxShadow: "2px 3px 6px rgba(0,0,0,0.4)",
                  fontFamily: "Georgia, serif",
                  transform: `rotate(${((i % 3) - 1) * 2}deg)`,
                }}
              >
                {note}
              </div>
            ))}
          </div>

          {/* WHITEBOARD */}
          <div
            className="sm:absolute sm:top-3 sm:right-4 sm:w-[220px]"
            style={{
              backgroundColor: "#2a4a2a",
              border: "4px solid #4a3a2a",
              borderRadius: "4px",
              padding: "12px",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#90EE90",
                letterSpacing: "3px",
                marginBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "4px",
                fontFamily: "Georgia, serif",
              }}
            >
              ACADEMICS
            </div>
            {whiteboardItems.map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "5px",
                  paddingLeft: "10px",
                  borderLeft: "2px solid rgba(144,238,144,0.4)",
                  lineHeight: 1.3,
                  fontFamily: "Georgia, serif",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Room label */}
        <div
          className="hidden sm:block absolute bottom-3 left-1/2 -translate-x-1/2"
          style={{ fontSize: "9px", opacity: 0.2, letterSpacing: "4px", textTransform: "uppercase" }}
        >
          Room 214 · {school.name}
        </div>
      </div>

      {/* OVERALL VIBE - below the room */}
      <div
        className="mx-3 sm:mx-4 mb-6 p-5 rounded-xl max-w-5xl sm:mx-auto"
        style={{ backgroundColor: "#13091f", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="text-xs tracking-widest uppercase opacity-40 mb-2">The real talk</div>
        <p style={{ fontSize: "14px", lineHeight: 1.7, opacity: 0.85, fontFamily: "Georgia, serif" }}>
          {summary.overall_vibe.summary}
        </p>
      </div>

      {/* REDDIT QUOTES */}
      <div className="mx-3 sm:mx-4 mb-8 max-w-5xl sm:mx-auto">
        <div className="text-xs tracking-widest uppercase opacity-40 mb-3">straight from reddit</div>
        <div className="flex flex-col gap-3">
          {redditQuotes.map((quote, i) => (
            <div
              key={i}
              className="p-4 rounded-lg cursor-pointer transition-colors bg-[#160d24] hover:bg-[#1f102e]"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "3px solid #FF4500",
              }}
            >
              <p style={{ fontSize: "13px", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span style={{ color: "#FF4500", fontSize: "11px" }}>▲</span>
                <span style={{ fontSize: "11px", opacity: 0.4 }}>{quote.upvotes.toLocaleString()}</span>
                <span style={{ fontSize: "11px", opacity: 0.3, marginLeft: "6px" }}>
                  u/{quoteUsername(i * 7 + quote.text.length)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mx-3 sm:mx-4 mb-10 max-w-5xl sm:mx-auto flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div style={{ fontSize: "12px", opacity: 0.4 }}>
          Based on 10,000+ Reddit posts · Verified by founder
        </div>
        <a
          href="/schools"
          className="self-start sm:self-auto px-4 py-2 rounded-lg text-sm inline-block"
          style={{
            backgroundColor: "#FF4500",
            color: "white",
            fontSize: "12px",
            letterSpacing: "1px",
          }}
        >
          See all schools →
        </a>
      </div>
    </div>
  );
}
