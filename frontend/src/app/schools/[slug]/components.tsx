"use client";

import { useState, useEffect } from "react";
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
  { key: "housing",             label: "Housing",           icon: "🏠" },
  { key: "social_life",         label: "Social Life",       icon: "🎉" },
  { key: "dining",              label: "Dining",            icon: "🍽️" },
  { key: "mental_health",       label: "Mental Health",     icon: "🧠" },
  { key: "financial_aid",       label: "Financial Aid",     icon: "💰" },
  { key: "academics",           label: "Academics",         icon: "📚" },
  { key: "administration",      label: "Administration",    icon: "🏛️" },
  { key: "location_and_campus", label: "Location & Campus", icon: "📍" },
  { key: "career_outcomes",     label: "Career Outcomes",   icon: "💼" },
  { key: "value_for_money",     label: "Value for Money",   icon: "💵" },
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
      <p
        className="uppercase"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "#999" }}
      >
        {text}
      </p>
    </div>
  );
}

function CompactQuote({ quote, accentColor }: { quote: string; accentColor: string }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "#f9f9f7",
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 4,
      }}
    >
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.7, color: "#444", fontStyle: "italic" }}>
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

export function BulletList({
  points, dotColor, textColor = "#444", textClassName = "",
}: {
  points: string[];
  dotColor: string;
  textColor?: string;
  textClassName?: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {points.map((point, i) => (
        <li
          key={i}
          className={`flex items-start gap-2.5 ${textClassName}`}
          style={{ color: textColor, fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.7 }}
        >
          <span
            className="shrink-0 rounded-full"
            style={{ width: "5px", height: "5px", background: dotColor, flexShrink: 0, marginTop: 9 }}
          />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── Score Overview ────────────────────────────────── */

export function ScoreOverviewBar({ summary }: { summary: Summary }) {
  return (
    <div style={{ background: "#111" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <p
          className="uppercase mb-5"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "#555" }}
        >
          Score Overview
        </p>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {GRID_CATEGORIES.map(({ key, label }) => {
            const score = summary[key].score;
            return (
              <div key={key} className="flex flex-col items-center gap-2 shrink-0" style={{ width: "82px" }}>
                <span
                  className="text-[8px] font-bold tracking-wide uppercase text-center leading-tight h-6 flex items-center"
                  style={{ color: "#888" }}
                >
                  {label}
                </span>
                <ScoreBar score={score} trackColor="rgba(255,255,255,0.10)" />
                <span
                  className="text-base font-black"
                  style={{ color: scoreColor(score), fontFamily: "var(--font-syne), 'Syne', sans-serif" }}
                >
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

/* ───────────────────────── Category Cards (accordion) ───────────────────── */

export function CategoryCard({ icon, label, data, cardIndex, primaryColor, forceOpen }: {
  icon: string;
  label: string;
  data: CategoryData;
  cardIndex: number;
  primaryColor: string;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceOpen !== undefined) setOpen(forceOpen);
  }, [forceOpen]);

  // cardIndex kept for API compat
  void cardIndex;

  return (
    <div
      style={{
        border: `1.5px solid ${open ? "#111" : "#e5e7eb"}`,
        borderRadius: 12,
        background: "#fff",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: 14,
          padding: "18px 20px",
          cursor: "pointer",
          background: "none",
          border: "none",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: "#0F0F0F",
              letterSpacing: "-0.015em",
            }}
          >
            {label}
          </span>
          <span
            style={{
              display: "inline-block",
              background: `${scoreColor(data.score)}22`,
              color: scoreColor(data.score),
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            {data.score}/10
          </span>
        </div>
        <span
          style={{
            display: "inline-block",
            color: "#9ca3af",
            fontSize: 14,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "0 20px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderTop: "1px solid #f0f0ee",
          }}
        >
          <div style={{ paddingTop: 14 }}>
            <BulletList points={data.key_points} dotColor={primaryColor} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.key_quotes.map((quote, i) => (
              <CompactQuote key={i} quote={quote} accentColor={primaryColor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Topic Filter Bar + Section ───────────────────── */

export function CategorySection({ summary, accent }: { summary: Summary; accent: string }) {
  const [filter, setFilter] = useState<string>("all");
  const [expandAll, setExpandAll] = useState(false);

  const filtered =
    filter === "all" ? GRID_CATEGORIES : GRID_CATEGORIES.filter((c) => c.key === filter);

  const pillStyle = (active: boolean) =>
    ({
      display: "inline-block",
      padding: "5px 12px",
      borderRadius: 99,
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      fontSize: 11,
      cursor: "pointer",
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#6b7280",
      border: `1.5px solid ${active ? "#111" : "#e5e7eb"}`,
      transition: "all 0.1s",
    } as React.CSSProperties);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-start gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button onClick={() => setFilter("all")} style={pillStyle(filter === "all")}>
            All
          </button>
          {GRID_CATEGORIES.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={pillStyle(filter === key)}>
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpandAll((e) => !e)}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "5px 0",
            flexShrink: 0,
          }}
        >
          {expandAll ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Accordion cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(({ key, label, icon }, i) => (
          <CategoryCard
            key={key}
            icon={icon}
            label={label}
            data={summary[key]}
            cardIndex={i}
            primaryColor={accent}
            forceOpen={expandAll}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Section 2 — Vibe Check ───────────────────────── */

function VibeCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-xl"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
    >
      {children}
    </div>
  );
}

function VibeCardLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <span
        className="uppercase"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: "#888" }}
      >
        {text}
      </span>
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
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dy="0.35em"
        fill="#F5F4EF"
        fontSize={size * 0.22}
        fontWeight={900}
        fontFamily="var(--font-syne), 'Syne', sans-serif"
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
          <span className="text-xs" style={{ fontFamily: "Inter, sans-serif", color: "#ccc" }}>
            Social life score: <strong>{social.score}/10</strong>
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="rounded-full shrink-0 mt-1" style={{ width: "8px", height: "8px", background: "#666" }} />
          <span className="text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif", color: "#999" }}>
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
      <p className="text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif", color: "#999" }}>
        {academics.key_points[0]}
      </p>
      <div className="flex-1 flex flex-col justify-end gap-2">
        <input
          type="range" min={0} max={10} step={1}
          value={academics.score} disabled readOnly
          className="w-full"
          style={{ accentColor: scoreColor(academics.score) }}
        />
        <div className="flex justify-between text-[9px] font-bold tracking-[0.15em] uppercase" style={{ fontFamily: "Inter, sans-serif", color: "#ccc" }}>
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
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, color: "#ccc" }}>{label}</span>
        <span className="text-[11px] font-black" style={{ color, fontFamily: "var(--font-syne), 'Syne', sans-serif" }}>
          {(score / 2).toFixed(1)}/5
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(10, score)) * 10}%`, background: color }} />
      </div>
    </div>
  );
}

function AdminRatingCard({ summary }: { summary: Summary }) {
  const rows: Array<{ label: string; key: keyof Summary }> = [
    { label: "Financial Aid",  key: "financial_aid" },
    { label: "Academics",      key: "academics" },
    { label: "Administration", key: "administration" },
    { label: "Housing",        key: "housing" },
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
    <div style={{ background: "#111" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p
          className="uppercase mb-5"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "#555" }}
        >
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
  const rest  = colonIndex !== -1 ? point.slice(colonIndex + 1).trim() : null;

  return (
    <div
      className="flex flex-col gap-2 p-5"
      style={{
        background: "#fff",
        border: "1px solid #e8e8e2",
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: 12,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-syne), 'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 14,
          color: "#0F0F0F",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      {rest && (
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 14, color: "#444", lineHeight: 1.7 }}>
          {rest}
        </p>
      )}
      {quote && (
        <p
          className="text-[12px] leading-relaxed italic mt-1"
          style={{ fontFamily: "Inter, sans-serif", color: "#888" }}
        >
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
  );
}

export function ProsConsSection({ summary }: { summary: Summary }) {
  const gems  = summary.hidden_gems;
  const flags = summary.red_flags;

  return (
    <div style={{ background: "#F5F4EF" }}>
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
                <p className="uppercase" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "#999" }}>
                  The Realities
                </p>
              </div>
              <span
                className="uppercase"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: "#D62839" }}
              >
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
  const quotes    = gatherTopQuotes(summary);
  const hotTopics = gatherHotTopics(summary);

  return (
    <div style={{ background: "#F5F4EF", borderTop: "1px solid #e8e8e2" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quotes */}
          <div className="lg:col-span-2">
            <SectionLabel text="Straight from Reddit" color={primary} />
            <div className="flex flex-col gap-3">
              {quotes.map((quote, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white"
                  style={{ border: "1px solid #e8e8e2", borderLeft: `4px solid ${primary}` }}
                >
                  <p
                    className="text-sm leading-relaxed italic"
                    style={{ fontFamily: "Inter, sans-serif", color: "#444", lineHeight: 1.7 }}
                  >
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span style={{ color: primary, fontSize: "10px" }}>▲</span>
                    <span className="text-[11px]" style={{ fontFamily: "Inter, sans-serif", color: "#aaa" }}>
                      {quote.upvotes.toLocaleString()}
                    </span>
                    <span className="text-[11px] ml-1" style={{ fontFamily: "Inter, sans-serif", color: "#bbb" }}>
                      u/{quoteUsername(quote.seed)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
            <div className="p-5 rounded-xl bg-white" style={{ border: "1px solid #e8e8e2" }}>
              <SectionLabel text="At a Glance" color={primary} />
              <div className="flex flex-col gap-4">
                <div>
                  <p
                    className="uppercase mb-0.5"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: "#bbb" }}
                  >
                    Posts analyzed
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-syne), 'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      color: "#0F0F0F",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    10,000+
                  </p>
                </div>
                <div>
                  <p
                    className="uppercase mb-0.5"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: "#bbb" }}
                  >
                    Last updated
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#444" }}>
                    {lastUpdated}
                  </p>
                </div>
                <div>
                  <p
                    className="uppercase mb-0.5"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", color: "#bbb" }}
                  >
                    Sources
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#444" }}>
                    r/{slug} · r/ApplyingToCollege
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white" style={{ border: "1px solid #e8e8e2" }}>
              <SectionLabel text="Hot Topics" color={primary} />
              <div className="flex flex-wrap gap-2">
                {hotTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{ fontFamily: "Inter, sans-serif", background: `${primary}18`, color: primary }}
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
