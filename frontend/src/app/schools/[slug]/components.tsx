"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import { toggleSavedSchool } from "./actions";
import SchoolHero from "@/components/SchoolHero";
import Reveal from "@/components/Reveal";

export type Sentiment = "positive" | "mixed" | "concern";

export interface TopicData {
  id: string;
  label: string;
  score: number;
  sentiment: Sentiment;
  sentimentLabel: string;
  tagline: string;
  summary: string;
}

// Everything gated behind login — the verdict and full topic breakdown. Absent
// (not just unrendered) for logged-out visitors, since the page never fetches
// this data for them in the first place.
export interface GatedData {
  verdict: {
    bestFor: string;
    watchOut: string;
    bottomLine: string;
  };
  topics: TopicData[];
  schoolId: string | null;
  initiallySaved: boolean;
}

export interface SchoolProfileProps {
  name: string;
  slug: string;
  location: string;
  initials: string;
  accent: string;
  accentText: string;
  postsAnalyzed: number;
  lastUpdated: string;
  heroDescription: string;
  publicTopics: TopicData[];
  gated: GatedData | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SENTIMENT_CONFIG: Record<Sentiment, { color: string; bg: string; icon: string }> = {
  positive: { color: "#16a34a", bg: "#f0fdf4", icon: "↑" },
  mixed:    { color: "#d97706", bg: "#fffbeb", icon: "~" },
  concern:  { color: "#dc2626", bg: "#fef2f2", icon: "↓" },
};

// ── Vibe Check ────────────────────────────────────────────────────────────────

function ProgressRing({
  percent,
  accent,
  size = 120,
  stroke = 10,
}: {
  percent: number;
  accent: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={accent}
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
        fill="#f5f1eb"
        fontSize={size * 0.2}
        fontWeight={900}
        fontFamily="ui-monospace, monospace"
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function VibeCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "20px 20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {children}
    </div>
  );
}

function VibeLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#a8a29e",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function SocialSceneCard({ topic, accent }: { topic: TopicData; accent: string }) {
  const percent = topic.score * 10;
  return (
    <VibeCard>
      <VibeLabel icon="🎉" text="Social Scene" />
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <ProgressRing percent={percent} accent={accent} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 12, color: "#e7e5e4", fontFamily: "ui-monospace, monospace" }}>
            Social life score:{" "}
            <strong style={{ color: "#fff" }}>{topic.score}/10</strong>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#78716c",
              flexShrink: 0,
              marginTop: 4,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#a8a29e",
              lineHeight: 1.5,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {topic.tagline}
          </span>
        </div>
      </div>
    </VibeCard>
  );
}

function CampusVibeCard({ topic, accent }: { topic: TopicData; accent: string }) {
  return (
    <VibeCard>
      <VibeLabel icon="📚" text="Campus Vibe" />
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#a8a29e",
          lineHeight: 1.5,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {topic.tagline}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "auto" }}>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          defaultValue={topic.score}
          disabled
          style={{ width: "100%", accentColor: accent, cursor: "default" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e7e5e4",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>Grind culture</span>
          <span>Collaborative</span>
        </div>
      </div>
    </VibeCard>
  );
}

function VibeCheckSection({ topics, accent }: { topics: TopicData[]; accent: string }) {
  const socialTopic = topics.find((t) => t.id === "social_life");
  const academicsTopic = topics.find((t) => t.id === "academics");

  if (!socialTopic || !academicsTopic) return null;

  return (
    <div style={{ background: "#111" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#78716c",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          Vibe Check
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SocialSceneCard topic={socialTopic} accent={accent} />
          <CampusVibeCard topic={academicsTopic} accent={accent} />
        </div>
      </div>
    </div>
  );
}

// ── Topic accordion ───────────────────────────────────────────────────────────

function TopicCard({
  topic,
  isOpen,
  onToggle,
}: {
  topic: TopicData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const s = SENTIMENT_CONFIG[topic.sentiment];

  return (
    <div
      style={{
        border: `1.5px solid ${isOpen ? "#111" : "#e5e7eb"}`,
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: s.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
            color: s.color,
            flexShrink: 0,
          }}
        >
          {s.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#111",
              }}
            >
              {topic.label}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: s.color,
                background: s.bg,
                padding: "2px 8px",
                borderRadius: 20,
                whiteSpace: "nowrap",
              }}
            >
              {topic.sentimentLabel}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.4 }}>
            {topic.tagline}
          </p>
        </div>

        <div
          style={{
            width: 24,
            height: 24,
            border: "1.5px solid #e5e7eb",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#6b7280",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </div>
      </button>

      {isOpen && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "20px 20px 24px" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
            {topic.summary}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Save school ────────────────────────────────────────────────────────────────

function SaveSchoolButton({
  schoolId,
  slug,
  initiallySaved,
  accent,
  accentText,
}: {
  schoolId: string;
  slug: string;
  initiallySaved: boolean;
  accent: string;
  accentText: string;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        await toggleSavedSchool(schoolId, slug);
      } catch {
        setSaved(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] leading-none font-bold transition-transform hover:scale-105"
      style={{
        fontFamily: "var(--font-syne), 'Syne', sans-serif",
        fontWeight: 700,
        background: saved ? accent : "#fff",
        color: saved ? accentText : "#111",
        border: `2px solid ${accent}`,
        boxShadow: saved ? "0 4px 14px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
        cursor: pending ? "default" : "pointer",
        opacity: pending ? 0.7 : 1,
      }}
    >
      <Star size={16} strokeWidth={2.25} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save school"}
    </button>
  );
}

// ── Gated content (verdict + topic breakdown) ────────────────────────────────

function GatedSchoolContent({
  slug,
  accent,
  accentText,
  verdict,
  topics,
  schoolId,
  initiallySaved,
}: {
  slug: string;
  accent: string;
  accentText: string;
  verdict: GatedData["verdict"];
  topics: TopicData[];
  schoolId: string | null;
  initiallySaved: boolean;
}) {
  const [openTopics, setOpenTopics] = useState<Set<string>>(
    new Set([topics[0]?.id ?? ""])
  );
  const [activeFilter, setActiveFilter] = useState<"all" | Sentiment>("all");

  const toggleTopic = (id: string) => {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filters: Array<{ id: "all" | Sentiment; label: string }> = [
    { id: "all",      label: "All topics" },
    { id: "positive", label: "↑ Highs" },
    { id: "mixed",    label: "~ Mixed" },
    { id: "concern",  label: "↓ Concerns" },
  ];

  const filteredTopics =
    activeFilter === "all"
      ? topics
      : topics.filter((t) => t.sentiment === activeFilter);

  return (
    <>
      {schoolId && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <SaveSchoolButton
            schoolId={schoolId}
            slug={slug}
            initiallySaved={initiallySaved}
            accent={accent}
            accentText={accentText}
          />
        </div>
      )}

      {/* Quick verdict */}
      <Reveal>
        <div
          style={{
            background: "#111",
            borderRadius: 14,
            padding: "22px 24px",
            marginTop: 32,
            marginBottom: 32,
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Quick verdict
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "✓", label: "Best for",      text: verdict.bestFor,    color: "#4ade80" },
              { icon: "⚠", label: "Watch out for", text: verdict.watchOut,   color: "#fb923c" },
              { icon: "→", label: "Bottom line",   text: verdict.bottomLine, color: "#e5e7eb" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 14, color: item.color, flexShrink: 0, marginTop: 1 }}>
                  {item.icon}
                </span>
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginRight: 8,
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 13, color: "#e5e7eb", lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Filter bar */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              border: "1.5px solid",
              borderColor: activeFilter === f.id ? "#111" : "#e5e7eb",
              background: activeFilter === f.id ? "#111" : "#fff",
              color: activeFilter === f.id ? "#fff" : "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setOpenTopics(new Set(filteredTopics.map((t) => t.id)))}
          style={{
            padding: "7px 14px",
            borderRadius: 20,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            marginLeft: "auto",
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
          }}
        >
          Expand all
        </button>
      </div>

      {/* Topic cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredTopics.map((topic) => (
          <Reveal key={topic.id}>
            <TopicCard
              topic={topic}
              isOpen={openTopics.has(topic.id)}
              onToggle={() => toggleTopic(topic.id)}
            />
          </Reveal>
        ))}
        {filteredTopics.length === 0 && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#9ca3af",
              padding: "32px 0",
            }}
          >
            No topics match this filter.
          </p>
        )}
      </div>
    </>
  );
}

// ── Logged-out gate ────────────────────────────────────────────────────────────
// Static placeholder shapes only — never the real verdict/topic content with a
// filter applied. There's nothing real to leak here since the page never
// fetched it for a logged-out visitor in the first place.

function PlaceholderBar({ width, height = 10, color = "#d8d4cb" }: { width: string | number; height?: number; color?: string }) {
  return <div style={{ width, height, borderRadius: 4, background: color }} />;
}

function GatePlaceholder({ slug }: { slug: string }) {
  const next = encodeURIComponent(`/schools/${slug}`);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(5px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, marginBottom: 32 }}>
          <div
            className="flex items-center gap-2"
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "2px solid #111",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
            }}
          >
            <Star size={16} strokeWidth={2.25} />
            Save school
          </div>
        </div>

        <div style={{ background: "#111", borderRadius: 14, padding: "22px 24px", marginBottom: 32 }}>
          <PlaceholderBar width={90} color="#c9a052" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            <PlaceholderBar width="80%" color="#3a3a3a" />
            <PlaceholderBar width="95%" color="#3a3a3a" />
            <PlaceholderBar width="65%" color="#3a3a3a" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["All topics", "↑ Highs", "~ Mixed", "↓ Concerns"].map((label) => (
            <div
              key={label}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[60, 50, 55].map((w, i) => (
            <div key={i} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, background: "#fff", padding: "18px 20px" }}>
              <PlaceholderBar width={`${w}%`} height={12} />
              <div style={{ marginTop: 8 }}>
                <PlaceholderBar width="90%" height={9} color="#eceae4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 200,
          background: "linear-gradient(to bottom, rgba(245,242,234,0) 0%, #F5F2EA 75%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 440,
          margin: "-40px auto 48px",
          background: "#fff",
          border: "1px solid #e8e8e2",
          borderRadius: 16,
          padding: "34px 32px",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#111",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-syne), 'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            margin: "0 0 8px",
            color: "#111",
          }}
        >
          See the full vibe check
        </h3>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.55, margin: "0 0 22px" }}>
          Create a free account to unlock the quick verdict, topic-by-topic breakdown, and the ability to save schools you&rsquo;re considering.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href={`/signup?next=${next}`}
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              background: "#111",
              color: "#fff",
              padding: "13px",
              borderRadius: 24,
            }}
          >
            Create free account
          </Link>
          <Link
            href={`/login?next=${next}`}
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              background: "transparent",
              color: "#111",
              border: "1px solid #e5e7eb",
              padding: "12px",
              borderRadius: 24,
            }}
          >
            Log in
          </Link>
        </div>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 14 }}>Takes about 20 seconds. No credit card.</p>
      </div>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────

export function SchoolProfile({
  name,
  slug,
  location,
  initials,
  accent,
  accentText,
  postsAnalyzed,
  lastUpdated,
  heroDescription,
  publicTopics,
  gated,
}: SchoolProfileProps) {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh" }}>

      {/* ── Desk-scene hero ───────────────────────────────────────── */}
      <SchoolHero
        accentHex={accent}
        schoolName={name}
        initials={initials}
        eyebrow={location}
        description={heroDescription}
      />

      {/* ── Vibe Check (full-width dark) — always public ─────────── */}
      <Reveal>
        <VibeCheckSection topics={publicTopics} accent={accent} />
      </Reveal>

      {/* ── Rest of content (light bg) ───────────────────────────── */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 20px 60px",
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
        }}
      >

        {gated ? (
          <GatedSchoolContent
            slug={slug}
            accent={accent}
            accentText={accentText}
            verdict={gated.verdict}
            topics={gated.topics}
            schoolId={gated.schoolId}
            initiallySaved={gated.initiallySaved}
          />
        ) : (
          <GatePlaceholder slug={slug} />
        )}

        <p
          style={{
            marginTop: 40,
            paddingTop: 24,
            textAlign: "center",
            fontSize: 11,
            fontStyle: "italic",
            color: "#c4c4c0",
            lineHeight: 1.6,
          }}
        >
          Insights are generated from publicly available online discussions and
          are intended for informational purposes. Opinions belong to their
          original authors and do not necessarily reflect the views of
          UnfilteredU.
        </p>

        {/* Footer */}
        <p
          style={{
            marginTop: 40,
            textAlign: "center",
            fontSize: 11,
            color: "#c4c4c0",
            lineHeight: 1.6,
          }}
        >
          Based on analysis of {postsAnalyzed.toLocaleString()}+ publicly available posts and comments

           · Not affiliated with{" "}
          {name} · Last updated {lastUpdated}
        </p>
      </div>
    </div>
  );
}
