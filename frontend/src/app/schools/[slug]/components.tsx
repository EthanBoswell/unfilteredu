"use client";

import { useState } from "react";

export type Sentiment = "positive" | "mixed" | "concern";

export interface TopicData {
  id: string;
  label: string;
  sentiment: Sentiment;
  sentimentLabel: string;
  tagline: string;
  summary: string;
  quotes: Array<{ text: string; author: string }>;
}

export interface SchoolProfileProps {
  name: string;
  location: string;
  accent: string;
  accentLight: string;
  accentText: string;
  postsAnalyzed: number;
  lastUpdated: string;
  heroQuote: string;
  heroAuthor: string;
  verdict: {
    bestFor: string;
    watchOut: string;
    bottomLine: string;
  };
  topics: TopicData[];
}

const SENTIMENT_CONFIG: Record<Sentiment, { color: string; bg: string; icon: string }> = {
  positive: { color: "#16a34a", bg: "#f0fdf4", icon: "↑" },
  mixed:    { color: "#d97706", bg: "#fffbeb", icon: "~" },
  concern:  { color: "#dc2626", bg: "#fef2f2", icon: "↓" },
};

function TopicCard({
  topic,
  isOpen,
  onToggle,
  accent,
}: {
  topic: TopicData;
  isOpen: boolean;
  onToggle: () => void;
  accent: string;
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
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
          <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
            {topic.summary}
          </p>

          {topic.quotes.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                What students say
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topic.quotes.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f9f9f7",
                      borderLeft: `3px solid ${accent}`,
                      padding: "12px 14px",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: 13,
                        color: "#111",
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{q.author}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SchoolProfile({
  name,
  location,
  accent,
  accentLight,
  postsAnalyzed,
  lastUpdated,
  heroQuote,
  heroAuthor,
  verdict,
  topics,
}: SchoolProfileProps) {
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
    <div
      style={{
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
        background: "#F7F6F2",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* ── School header ─────────────────────────────────────── */}
        <div style={{ paddingTop: 36, paddingBottom: 28, borderBottom: "1px solid #e5e7eb" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 6,
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {location}
              </p>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 6vw, 40px)",
                  color: "#111",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </h1>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#111",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                }}
              >
                {postsAnalyzed.toLocaleString()}+
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>posts analyzed</p>
            </div>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#c4c4c0" }}>
            Updated {lastUpdated} · Student posts from Reddit
          </p>
        </div>

        {/* ── Hero quote (highlight tape) ────────────────────────── */}
        <div style={{ margin: "28px 0" }}>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "#9ca3af",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Most upvoted take
          </p>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: -4,
                right: -4,
                bottom: 0,
                background: accentLight,
                transform: "rotate(-0.4deg)",
                borderRadius: 2,
              }}
            />
            <p
              style={{
                position: "relative",
                margin: 0,
                fontSize: 20,
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.35,
                padding: "2px 4px",
              }}
            >
              &ldquo;{heroQuote}&rdquo;
            </p>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "#9ca3af" }}>— {heroAuthor}</p>
        </div>

        {/* ── Quick verdict ─────────────────────────────────────── */}
        <div
          style={{
            background: "#111",
            borderRadius: 14,
            padding: "22px 24px",
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

        {/* ── Filter bar ────────────────────────────────────────── */}
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

        {/* ── Topic cards ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isOpen={openTopics.has(topic.id)}
              onToggle={() => toggleTopic(topic.id)}
              accent={accent}
            />
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

        {/* ── Footer disclaimer ─────────────────────────────────── */}
        <p
          style={{
            marginTop: 40,
            textAlign: "center",
            fontSize: 11,
            color: "#c4c4c0",
            lineHeight: 1.6,
          }}
        >
          Based on {postsAnalyzed.toLocaleString()}+ real student posts · Not affiliated with{" "}
          {name} · Last updated {lastUpdated}
        </p>
      </div>
    </div>
  );
}
