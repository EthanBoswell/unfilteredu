import type { CSSProperties } from "react";
import type { CategoryData, Summary } from "@/lib/schools";

const FAKE_USERNAMES = [
  "anon_student", "college_bound_24", "reddit_lurker99", "freshman_vibes",
  "campus_insider", "honest_review", "student_life_real", "dorm_dweller",
  "late_night_study", "quad_walker", "first_gen_student", "transfer_tales",
];

export function quoteUsername(seed: number): string {
  return FAKE_USERNAMES[((seed % FAKE_USERNAMES.length) + FAKE_USERNAMES.length) % FAKE_USERNAMES.length];
}

export function fakeUpvotes(seed: number, text: string): number {
  return 300 + ((seed * 211 + text.length * 37) % 1300);
}

export const GRID_CATEGORIES: Array<{ key: keyof Summary; label: string; icon: string }> = [
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

export function scoreColor(score: number): string {
  if (score <= 3) return "#D62839";
  if (score <= 6) return "#EF9F27";
  return "#3BB273";
}

export function ScoreBar({ score, trackColor = "rgba(0,0,0,0.08)" }: { score: number; trackColor?: string }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: trackColor }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(10, score)) * 10}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

export function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span style={{ display: "inline-block", width: "3px", height: "14px", backgroundColor: color, borderRadius: "2px", flexShrink: 0 }} />
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#777777" }}>
        {text}
      </p>
    </div>
  );
}

function CompactQuote({ quote, seed, accentColor }: { quote: string; seed: number; accentColor: string }) {
  return (
    <div
      className="rounded-lg"
      style={{
        padding: "8px 10px",
        backgroundColor: "#F7F7F7",
        border: "1px solid rgba(0,0,0,0.06)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <p className="text-[12px] leading-relaxed italic" style={{ color: "#333333", fontFamily: "Georgia, serif" }}>
        &ldquo;{quote}&rdquo;{" "}
        <span className="not-italic font-bold" style={{ color: "#999999" }}>
          — u/{quoteUsername(seed)}
        </span>
      </p>
    </div>
  );
}

export function BulletList({
  points, dotColor, textColor = "#444444", textClassName = "text-sm leading-relaxed",
}: {
  points: string[];
  dotColor: string;
  textColor?: string;
  textClassName?: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {points.map((point, i) => (
        <li key={i} className={`flex items-start gap-2.5 ${textClassName}`} style={{ color: textColor, fontFamily: "Georgia, serif" }}>
          <span className="shrink-0 mt-[9px] rounded-full" style={{ width: "6px", height: "6px", background: dotColor }} />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function ScoreOverviewBar({ summary }: { summary: Summary }) {
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

export function CategoryCard({ icon, label, data, cardIndex, primaryColor }: {
  icon: string;
  label: string;
  data: CategoryData;
  cardIndex: number;
  primaryColor: string;
}) {
  const topQuote = data.key_quotes
    .map((quote, i) => {
      const seed = cardIndex * 7 + i * 3;
      return { quote, seed, upvotes: fakeUpvotes(seed, quote) };
    })
    .sort((a, b) => b.upvotes - a.upvotes)[0];

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
      <BulletList points={data.key_points} dotColor={primaryColor} textColor="#444444" />
      {topQuote && <CompactQuote quote={topQuote.quote} seed={topQuote.seed} accentColor={primaryColor} />}
    </div>
  );
}

/* ───────────────────────── Section 2 — Vibe Check ───────────────────────── */

function VibeCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {children}
    </div>
  );
}

function VibeCardLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#C4B89A" }}>{text}</span>
    </div>
  );
}

function ProgressRing({ percent, color, size = 128, stroke = 10 }: { percent: number; color: string; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fill="#F5F1EB"
        fontSize={size * 0.22}
        fontWeight={900}
        fontFamily="Georgia, serif"
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function SocialSceneCard({ social }: { social: CategoryData }) {
  const percent = social.score * 10;
  const color = scoreColor(social.score);
  return (
    <VibeCard>
      <VibeCardLabel icon="🎉" text="Social Scene" />
      <div className="flex justify-center py-1">
        <ProgressRing percent={percent} color={color} />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full shrink-0" style={{ width: "8px", height: "8px", background: color }} />
          <span className="text-xs" style={{ color: "#E8E0D4" }}>
            Social life score: <strong>{social.score}/10</strong>
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="rounded-full shrink-0 mt-1" style={{ width: "8px", height: "8px", background: "#C4B89A" }} />
          <span className="text-xs leading-relaxed" style={{ color: "#C4B89A" }}>
            {social.key_points[0]}
          </span>
        </div>
      </div>
    </VibeCard>
  );
}

function CampusVibeCard({ academics }: { academics: CategoryData }) {
  return (
    <VibeCard>
      <VibeCardLabel icon="📚" text="Campus Vibe" />
      <p className="text-xs leading-relaxed" style={{ color: "#C4B89A" }}>
        {academics.key_points[0]}
      </p>
      <div className="flex-1 flex flex-col justify-end gap-2">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={academics.score}
          disabled
          readOnly
          className="w-full"
          style={{ accentColor: scoreColor(academics.score) }}
        />
        <div className="flex justify-between text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: "#E8E0D4" }}>
          <span>Grind culture</span>
          <span>Collaborative</span>
        </div>
      </div>
    </VibeCard>
  );
}

function BarRow({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wide" style={{ color: "#E8E0D4" }}>{label}</span>
        <span className="text-[11px] font-black" style={{ color, fontFamily: "Georgia, serif" }}>
          {(score / 2).toFixed(1)}/5
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(0, Math.min(10, score)) * 10}%`, background: color }}
        />
      </div>
    </div>
  );
}

function AdminRatingCard({ summary }: { summary: Summary }) {
  const rows: Array<{ label: string; key: keyof Summary }> = [
    { label: "Financial Aid", key: "financial_aid" },
    { label: "Academics", key: "academics" },
    { label: "Administration", key: "administration" },
    { label: "Housing", key: "housing" },
  ];
  return (
    <VibeCard>
      <VibeCardLabel icon="🏛️" text="Admin Rating" />
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {rows.map(({ label, key }) => (
          <BarRow key={key} label={label} score={summary[key].score} />
        ))}
      </div>
    </VibeCard>
  );
}

export function VibeCheckGrid({ summary }: { summary: Summary }) {
  return (
    <div style={{ background: "#1A1612" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: "#C4B89A" }}>
          Vibe Check
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SocialSceneCard social={summary.social_life} />
          <CampusVibeCard academics={summary.academics} />
          <AdminRatingCard summary={summary} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Section 3 — Pros & Cons ───────────────────────── */

function ProsConsCard({ point, quote, accentColor, isFlag = false }: {
  point: string;
  quote?: string;
  accentColor: string;
  isFlag?: boolean;
}) {
  const colonIndex = isFlag ? point.indexOf(":") : -1;
  const title = colonIndex !== -1 ? point.slice(0, colonIndex).trim() : point;
  const rest = colonIndex !== -1 ? point.slice(colonIndex + 1).trim() : null;

  return (
    <div
      className="flex flex-col gap-2 p-5 rounded-xl bg-white"
      style={{ border: "1px solid rgba(0,0,0,0.08)", borderLeft: `4px solid ${accentColor}` }}
    >
      <h3 className="font-bold text-sm" style={{ color: "#1A1612", fontFamily: "Georgia, serif" }}>
        {title}
      </h3>
      {rest && (
        <p className="text-sm leading-relaxed" style={{ color: "#444444", fontFamily: "Georgia, serif" }}>
          {rest}
        </p>
      )}
      {quote && (
        <p className="text-[12px] leading-relaxed italic mt-1" style={{ color: "#888888", fontFamily: "Georgia, serif" }}>
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
  );
}

export function ProsConsSection({ summary }: { summary: Summary }) {
  const gems = summary.hidden_gems;
  const flags = summary.red_flags;

  return (
    <div style={{ background: "#EFEFED" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SectionLabel text="What Reddit Loves" color="#3BB273" />
            <div className="flex flex-col gap-3">
              {gems.key_points.map((point, i) => (
                <ProsConsCard key={i} point={point} quote={gems.key_quotes[i]} accentColor="#3BB273" />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span style={{ display: "inline-block", width: "3px", height: "14px", backgroundColor: "#D62839", borderRadius: "2px", flexShrink: 0 }} />
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#777777" }}>
                  The Realities
                </p>
              </div>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "#D62839" }}>
                Severity {flags.score}/10
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {flags.key_points.map((point, i) => (
                <ProsConsCard key={i} point={point} quote={flags.key_quotes[i]} accentColor="#D62839" isFlag />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Section 4 — Reddit quotes + sidebar ─────────────────── */

function extractTopic(point: string): string {
  const colonIndex = point.indexOf(":");
  if (colonIndex !== -1 && colonIndex <= 24) return point.slice(0, colonIndex).trim();
  return point.split(" ").slice(0, 2).join(" ");
}

export function gatherHotTopics(summary: Summary): string[] {
  const topics = [
    ...summary.red_flags.key_points.map(extractTopic),
    ...summary.hidden_gems.key_points.map(extractTopic),
  ];
  return Array.from(new Set(topics)).slice(0, 6);
}

export function gatherTopQuotes(summary: Summary): Array<{ text: string; upvotes: number; seed: number }> {
  const categories: Array<keyof Summary> = [...GRID_CATEGORIES.map((c) => c.key), "overall_vibe", "hidden_gems", "red_flags"];
  const candidates: Array<{ text: string; upvotes: number; seed: number }> = [];
  categories.forEach((key, ci) => {
    summary[key].key_quotes.forEach((text, qi) => {
      const seed = ci * 17 + qi * 5;
      candidates.push({ text, upvotes: fakeUpvotes(seed, text), seed });
    });
  });
  return candidates.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
}

export function RedditAndSidebar({
  summary, primary, slug, lastUpdated,
}: {
  summary: Summary;
  primary: string;
  slug: string;
  lastUpdated: string;
}) {
  const quotes = gatherTopQuotes(summary);
  const hotTopics = gatherHotTopics(summary);

  return (
    <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#E8E8E6" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionLabel text="Straight from Reddit" color={primary} />
            <div className="flex flex-col gap-3">
              {quotes.map((quote, i) => (
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
                      u/{quoteUsername(quote.seed)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            <div className="p-5 rounded-xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
              <SectionLabel text="At a Glance" color={primary} />
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#aaaaaa" }}>Posts analyzed</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#1A1612", fontFamily: "Georgia, serif" }}>10,000+</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#aaaaaa" }}>Last updated</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#1A1612", fontFamily: "Georgia, serif" }}>{lastUpdated}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#aaaaaa" }}>Sources</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#1A1612", fontFamily: "Georgia, serif" }}>
                    r/{slug} · r/ApplyingToCollege
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
              <SectionLabel text="Hot Topics" color={primary} />
              <div className="flex flex-wrap gap-2">
                {hotTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: `${primary}18`, color: primary }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
