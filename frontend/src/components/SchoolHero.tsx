"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { deriveSchoolPalette } from "@/lib/palette";

// Cycled to fake cloth movement on the flag — ported from the reference prototype.
const FLAG_FRAMES = [
  "M0,0 L70,6 L58,18 L70,30 L0,24 Z",
  "M0,0 L70,3 L60,17 L70,33 L0,24 Z",
  "M0,0 L70,8 L56,19 L70,27 L0,24 Z",
  "M0,0 L70,4 L59,16 L70,31 L0,24 Z",
];

// Desk material is a fixed brand color, not derived per-school like the accent is.
const DESK = "#a5754a";
const DESK_DARK = "#7f5934";
const PAPER = "#F5F4EF";
const INK = "#0F0F0F";
const MUTED = "#78716c";

interface SchoolHeroProps {
  accentHex: string;
  schoolName: string;
  initials: string;
  eyebrow: string;
  description: string;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export default function SchoolHero({ accentHex, schoolName, initials, eyebrow, description }: SchoolHeroProps) {
  const reducedMotion = useReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 640px)");
  const isTiny = useMediaQuery("(max-width: 460px)");
  const palette = deriveSchoolPalette(accentHex);

  const deskHeight = isNarrow ? "42%" : "56%";
  const itemsScale = isTiny ? 0.58 : isNarrow ? 0.72 : 1;

  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const [flagFrame, setFlagFrame] = useState(0);

  // Flag-wave cycle
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setFlagFrame((f) => (f + 1) % FLAG_FRAMES.length), 260);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Scroll parallax — rAF-throttled, direct style writes (no re-render per frame)
  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;

    function update() {
      ticking = false;
      const hero = heroRef.current;
      if (!hero) return;
      const y = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (y >= heroHeight) return;
      if (bgRef.current) bgRef.current.style.transform = `translate(-50%, ${y * 0.15}px)`;
      if (deskRef.current) deskRef.current.style.transform = `translateY(${y * 0.25}px)`;
      if (itemsRef.current) itemsRef.current.style.transform = `translateY(${y * 0.4}px)`;
      hero.style.opacity = String(Math.max(1 - y / (heroHeight * 0.85), 0));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  const itemClass = reducedMotion ? "" : "desk-item-rise";
  const entranceStyle = (delay: string): CSSProperties => (reducedMotion ? { opacity: 1 } : { animationDelay: delay });

  return (
    <header
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        height: "min(100vh, 700px)",
        minHeight: 560,
        background: `linear-gradient(to bottom, ${palette.accentLight} 0%, ${PAPER} 100%)`,
      }}
    >
      <div className="absolute inset-0 flex items-end justify-center">
        {/* background blob — parallax layer 1 (slowest) */}
        <div
          ref={bgRef}
          className="absolute rounded-full"
          style={{
            top: "8%",
            left: "50%",
            width: 620,
            height: 620,
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${palette.accent} 0%, transparent 70%)`,
            opacity: 0.16,
            willChange: reducedMotion ? undefined : "transform",
          }}
        />

        {/* desk — parallax layer 2 */}
        <div ref={deskRef} className="absolute left-0 right-0 bottom-0" style={{ height: deskHeight, willChange: reducedMotion ? undefined : "transform" }}>
          <div style={{ position: "absolute", top: 0, left: "-5%", right: "-5%", height: 22, background: DESK_DARK, transform: "perspective(600px) rotateX(3deg)" }} />
          <div style={{ position: "absolute", top: 20, left: "-5%", right: "-5%", bottom: 0, background: `linear-gradient(to bottom, ${DESK}, ${DESK_DARK})` }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 26px)",
              }}
            />
          </div>
        </div>

        {/* items — parallax layer 3 (fastest / closest) */}
        <div className="absolute left-0 right-0" style={{ bottom: "14%", height: 300, transform: `scale(${itemsScale})`, transformOrigin: "bottom center" }}>
        <div ref={itemsRef} className="relative w-full h-full" style={{ willChange: reducedMotion ? undefined : "transform" }}>
          {/* flag */}
          <div className={itemClass} style={{ position: "absolute", left: "50%", marginLeft: 130, bottom: 8, ...entranceStyle("0s") }}>
            <div style={{ width: 4, height: 150, background: INK, borderRadius: 2, margin: "0 auto", position: "relative" }}>
              <div style={{ position: "absolute", top: 4, left: 4 }}>
                <svg width="90" height="60" viewBox="0 0 90 60" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))" }}>
                  <path fill={palette.accent} d={FLAG_FRAMES[reducedMotion ? 0 : flagFrame]} />
                  <text x="8" y="18" fontFamily="Syne, sans-serif" fontWeight={800} fontSize={13} fill="rgba(255,255,255,0.92)">
                    {initials}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* notebook */}
          <div className={itemClass} style={{ position: "absolute", left: "50%", marginLeft: -210, width: 70, bottom: 0, ...entranceStyle("0.42s") }}>
            <div style={{ width: 70, height: 50, background: PAPER, border: `2px solid ${INK}`, borderRadius: 2, transform: "rotate(-6deg)", position: "relative" }}>
              {[14, 22, 30].map((top) => (
                <div key={top} style={{ position: "absolute", left: 8, right: 8, top, height: 2, background: "rgba(15,15,15,0.15)" }} />
              ))}
            </div>
          </div>

          {/* laptop */}
          <div className={itemClass} style={{ position: "absolute", left: "50%", marginLeft: -150, width: 190, bottom: 0, ...entranceStyle("0.15s") }}>
            <div style={{ width: 168, height: 112, margin: "0 auto -4px", background: "#1a1a1a", borderRadius: "8px 8px 2px 2px", padding: 8 }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(160deg, ${palette.accent}, ${palette.accentRotated})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.6rem",
                }}
              >
                {initials}
              </div>
            </div>
            <div style={{ width: 190, height: 12, background: "#3a3a3a", borderRadius: 3 }} />
          </div>

          {/* mug */}
          <div className={itemClass} style={{ position: "absolute", left: "50%", marginLeft: 60, width: 46, bottom: 0, ...entranceStyle("0.3s") }}>
            {!reducedMotion && (
              <>
                <div className="desk-mug-steam" style={{ position: "absolute", top: -14, left: 10, width: 3, height: 14, background: "rgba(120,113,108,0.4)", borderRadius: 3 }} />
                <div
                  className="desk-mug-steam"
                  style={{ position: "absolute", top: -14, left: 22, width: 3, height: 14, background: "rgba(120,113,108,0.4)", borderRadius: 3, animationDelay: "0.6s" }}
                />
              </>
            )}
            <div style={{ width: 42, height: 46, background: "#fff", border: `2px solid ${INK}`, borderRadius: "0 0 10px 10px", position: "relative" }}>
              <div style={{ position: "absolute", right: -14, top: 8, width: 16, height: 22, border: `2px solid ${INK}`, borderLeft: "none", borderRadius: "0 10px 10px 0" }} />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div
        className={reducedMotion ? "" : "desk-hero-fade-up"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: deskHeight,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          ...(reducedMotion ? { opacity: 1 } : {}),
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: palette.accentDark,
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-syne), 'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 6vw, 3.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            marginBottom: 10,
            color: INK,
            padding: "0 12px",
          }}
        >
          {schoolName}
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.85rem, 2.6vw, 0.98rem)", color: MUTED, maxWidth: 420, margin: "0 auto", padding: "0 16px" }}>{description}</p>
      </div>

      <div
        className="absolute flex flex-col items-center"
        style={{
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          gap: 6,
          fontSize: "0.68rem",
          fontWeight: 600,
          color: MUTED,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        <span>Scroll</span>
        <span className={reducedMotion ? "" : "desk-scroll-bob"} style={{ width: 5, height: 5, borderRadius: "50%", background: palette.accent }} />
      </div>
    </header>
  );
}
