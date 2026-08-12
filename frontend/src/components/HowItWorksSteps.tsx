"use client";

import { useEffect, useRef, useState } from "react";
import { SCHOOLS } from "@/lib/schools";

const FONT_DM = "var(--font-dm), 'DM Sans', sans-serif";
const FONT_SYNE = "var(--font-syne), 'Syne', sans-serif";

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function MiniWidgetShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-auto"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 9,
        padding: 13,
        minHeight: 92,
      }}
    >
      {children}
    </div>
  );
}

function SearchMiniWidget({ inView }: { inView: boolean }) {
  const rows = ["State University", "State College"];
  return (
    <MiniWidgetShell>
      <div
        className="flex items-center gap-1.5"
        style={{ fontFamily: FONT_DM, fontSize: 12, color: "#8a8a8a" }}
      >
        state uni
        <span
          aria-hidden="true"
          className="typewriter-cursor inline-block"
          style={{ width: 1, height: 11, background: "var(--color-gold)" }}
        />
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        {rows.map((row, i) => (
          <div
            key={row}
            className="flex items-center gap-1.5"
            style={{
              fontFamily: FONT_DM,
              fontSize: 12,
              color: "#F5F4EF",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-4px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              transitionDelay: inView ? `${0.5 + i * 0.3}s` : "0s",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block rounded-full shrink-0"
              style={{ width: 5, height: 5, background: "var(--color-gold)" }}
            />
            {row}
          </div>
        ))}
      </div>
    </MiniWidgetShell>
  );
}

function VibeCheckMiniWidget({ inView }: { inView: boolean }) {
  const circumference = 2 * Math.PI * 22;
  const targetOffset = circumference * 0.4; // fills to 60%

  return (
    <MiniWidgetShell>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
          <svg aria-hidden="true" viewBox="0 0 52 52" width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
            <circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={inView ? targetOffset : circumference}
              style={{ transition: "stroke-dashoffset 1s ease", transitionDelay: inView ? "0.3s" : "0s" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 12, color: "#F5F4EF" }}
          >
            60%
          </div>
        </div>
        <div className="flex-1">
          <div
            className="relative"
            style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 5 }}
          >
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                background: "var(--color-rust)",
                borderRadius: 2,
                width: inView ? "55%" : "0%",
                transition: "width 1s ease",
                transitionDelay: inView ? "0.4s" : "0s",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT_DM,
              fontWeight: 600,
              fontSize: 10,
              color: "#F5F4EF",
              letterSpacing: "0.03em",
            }}
          >
            GRIND ↔ TEAM
          </div>
        </div>
      </div>
    </MiniWidgetShell>
  );
}

function VerdictMiniWidget() {
  return (
    <MiniWidgetShell>
      <div
        style={{
          background: "#0F0F0F",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8,
          padding: "11px 13px",
        }}
      >
        <p
          className="mb-1 uppercase"
          style={{
            fontFamily: FONT_DM,
            fontWeight: 600,
            fontSize: 10,
            color: "var(--color-gold)",
            letterSpacing: "0.04em",
          }}
        >
          Bottom line
        </p>
        <p style={{ fontFamily: FONT_DM, fontSize: 12, lineHeight: 1.45, color: "#E8E4DC" }}>
          Great if you&rsquo;re social. Housing takes planning.
        </p>
      </div>
    </MiniWidgetShell>
  );
}

function buildSteps(schoolCount: number) {
  return [
  {
    num: "01 — Search",
    title: "Find your school",
    widget: "search" as const,
  },
  {
    num: "02 — Vibe check",
    title: "Quantify the culture",
    widget: "vibe" as const,
  },
  {
    num: "03 — Verdict",
    title: "Get the bottom line",
    widget: "verdict" as const,
  },
  ];
}

export default function HowItWorksSteps() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const steps = buildSteps(SCHOOLS.length);

  return (
    <section style={{ background: "#0F0F0F" }}>
      <div ref={ref} className="mx-auto max-w-[720px] px-6 py-[72px]">
        <p
          className="mb-8 flex items-center gap-2 uppercase"
          style={{
            fontFamily: FONT_DM,
            fontWeight: 600,
            fontSize: 12,
            color: "var(--color-rust)",
            letterSpacing: "0.06em",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: "var(--color-rust)" }}
          />
          How it works
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col"
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <p
                className="mb-2.5 uppercase"
                style={{
                  fontFamily: FONT_DM,
                  fontWeight: 600,
                  fontSize: 11,
                  color: "#78716c",
                  letterSpacing: "0.05em",
                }}
              >
                {step.num}
              </p>
              <p
                className="mb-4"
                style={{ fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 16, color: "#F5F4EF" }}
              >
                {step.title}
              </p>

              {step.widget === "search" && <SearchMiniWidget inView={inView} />}
              {step.widget === "vibe" && <VibeCheckMiniWidget inView={inView} />}
              {step.widget === "verdict" && <VerdictMiniWidget />}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-6">
        <div
          className="flex flex-wrap gap-8"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            paddingBottom: 40,
            fontFamily: FONT_DM,
            fontSize: 12,
            color: "#78716c",
          }}
        >
          <span>
            <span style={{ color: "var(--color-rust)" }}>•</span> not affiliated with any university
          </span>
          <span>
            <span style={{ color: "var(--color-rust)" }}>•</span> no rankings, no filter
          </span>
          <span>
            <span style={{ color: "var(--color-rust)" }}>•</span> updated weekly
          </span>
        </div>
      </div>
    </section>
  );
}
