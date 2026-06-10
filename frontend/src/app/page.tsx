import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EmailSignup from "@/components/EmailSignup";
import SearchBar from "@/components/SearchBar";
import { getSchoolBySlug } from "@/lib/schools";
import { getAvailableSlugs, loadSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "UnfilteredU",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "We go where students actually talk",
    desc: "We pull thousands of real posts and comments from Reddit, YouTube, X, and other platforms where students speak freely about their college experience.",
  },
  {
    step: "02",
    title: "AI cuts through the noise",
    desc: "Our AI reads every post to surface what students actually think about housing, dining, academics, mental health, and more.",
  },
  {
    step: "03",
    title: "You get the truth in minutes",
    desc: "Honest, specific summaries with real quotes — organized by topic, ready to read in under 5 minutes. No marketing. No tours.",
  },
];

export default function HomePage() {
  const availableSlugs = getAvailableSlugs();

  const schools = availableSlugs
    .map((slug) => {
      const meta = getSchoolBySlug(slug);
      const summary = loadSummary(slug);
      return {
        slug,
        name: meta?.name ?? slug,
        location: meta?.location ?? "",
        vibe: summary.overall_vibe.summary,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const searchOptions = schools.map(({ slug, name, location }) => ({ slug, name, location }));

  return (
    <div className="min-h-screen" style={{ background: "#1A1612" }}>
      <Navbar />

      {/* ── Hero ── full viewport, dark gradient */}
      <section
        className="relative overflow-hidden"
        style={{
          height: "100vh",
          background: "linear-gradient(180deg, #1A1612 0%, #2C3E2D 30%, #1A1612 100%)",
        }}
      >
        {/* Sage radial glow — upper center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(74,124,89,0.35) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Giant watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-[family-name:var(--font-display)] font-black uppercase whitespace-nowrap"
            style={{
              fontSize: "clamp(5rem, 16vw, 15rem)",
              color: "rgba(232,224,212,0.08)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            UNFILTEREDU
          </span>
        </div>

        {/* Left vertical label */}
        <div
          className="absolute left-6 top-1/2 font-mono pointer-events-none select-none"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "rgba(232,224,212,0.22)",
            transform: "translateY(-50%) rotate(-90deg)",
            whiteSpace: "nowrap",
            zIndex: 1,
          }}
          aria-hidden
        >
          EST. 2026 · STUDENT SOURCED
        </div>

        {/* Main content — centered */}
        <div
          className="relative flex flex-col items-center justify-center text-center px-6"
          style={{ height: "100%", zIndex: 10 }}
        >
          {/* Tag */}
          <p
            className="font-mono font-semibold mb-8"
            style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#4A7C59" }}
          >
            — UNFILTERED COLLEGE REVIEWS —
          </p>

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-display)] font-bold mb-6"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Real talk about college.</span>
            <br />
            <span style={{ color: "#4A7C59" }}>From real students.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-light leading-relaxed mb-10 max-w-md"
            style={{ fontSize: "1.05rem", color: "rgba(232,224,212,0.55)" }}
          >
            We read thousands of Reddit posts so you don&rsquo;t have to.
            No marketing. No tours. Just the truth.
          </p>

          {/* Search */}
          <SearchBar schools={searchOptions} variant="hero" />
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute left-1/2 flex flex-col items-center gap-2"
          style={{ bottom: "32px", transform: "translateX(-50%)" }}
        >
          <p
            className="font-mono"
            style={{ fontSize: "9px", letterSpacing: "0.28em", color: "rgba(232,224,212,0.3)" }}
          >
            SCROLL
          </p>
          <div
            style={{ width: "1px", height: "36px", background: "rgba(232,224,212,0.18)" }}
          />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-black/15" style={{ background: "#E8E0D4" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-black/15">
          {[
            { value: "10K+", label: "Reddit posts analyzed" },
            { value: String(schools.length), label: "Schools reviewed" },
            { value: "100%", label: "Free forever" },
          ].map(({ value, label }) => (
            <div key={label} className="px-8 py-12 text-center">
              <p
                className="font-[family-name:var(--font-display)] font-bold leading-none mb-1.5"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  letterSpacing: "-0.03em",
                  color: "#1A1612",
                }}
              >
                {value}
              </p>
              <p className="text-xs font-light tracking-wide" style={{ color: "#5C5446" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="py-20 px-6 border-b border-black/10"
        style={{ background: "#E8E0D4" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="h-px w-8" style={{ background: "#4A7C59" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#4A7C59" }}
            >
              The Process
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step}>
                <div
                  className="font-[family-name:var(--font-display)] font-bold leading-none select-none mb-4"
                  style={{
                    fontSize: "clamp(4rem, 10vw, 7rem)",
                    letterSpacing: "-0.04em",
                    color: "rgba(44,62,45,0.12)",
                  }}
                  aria-hidden
                >
                  {step}
                </div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-lg mb-2"
                  style={{ color: "#1A1612" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#5C5446" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schools grid ── */}
      <section className="py-20 px-6" style={{ background: "#E8E0D4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "#4A7C59" }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "#4A7C59" }}
              >
                Browse Schools
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold text-xl"
              style={{ letterSpacing: "-0.01em", color: "#1A1612" }}
            >
              {schools.length} available now
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10">
            {schools.map(({ slug, name, location, vibe }) => (
              <a
                key={slug}
                href={`/schools/${slug}`}
                className="group block border-b border-r border-black/10 p-6 bg-white hover:bg-[#F5F0EA] transition-colors duration-150"
              >
                <span
                  className="inline-block font-mono text-[9px] font-bold uppercase tracking-[0.18em] mb-3"
                  style={{ color: "#4A7C59" }}
                >
                  ● Live
                </span>

                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-base leading-snug w-fit border-b border-transparent group-hover:border-[#2C3E2D] transition-colors duration-200 mb-1"
                  style={{ color: "#1A1612" }}
                >
                  {name}
                </h3>

                {location && (
                  <p className="text-xs font-light mb-3" style={{ color: "#777777" }}>
                    {location}
                  </p>
                )}

                <p className="text-sm leading-relaxed line-clamp-3 font-light" style={{ color: "#5C5446" }}>
                  {vibe}
                </p>

                <div className="mt-4 pt-4 border-t border-black/10">
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "#2C3E2D" }}
                  >
                    Read Reviews →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email CTA ── */}
      <section className="py-20 px-6" style={{ background: "#1A1612" }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8" style={{ background: "#4A7C59" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#4A7C59" }}
            >
              Stay In The Loop
            </span>
            <span className="h-px w-8" style={{ background: "#4A7C59" }} />
          </div>
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-3xl sm:text-4xl mb-3"
            style={{ letterSpacing: "-0.02em", color: "#E8E0D4" }}
          >
            Your school not listed?
          </h2>
          <p className="font-light leading-relaxed mb-8" style={{ color: "rgba(232,224,212,0.45)" }}>
            We&rsquo;re adding new schools weekly. Drop your email and
            we&rsquo;ll notify you when your school is live.
          </p>
          <EmailSignup />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-10 px-6 border-t"
        style={{ background: "#1A1612", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-black font-[family-name:var(--font-display)]"
              style={{ background: "#2C3E2D", color: "#E8E0D4" }}
            >
              U
            </div>
            <span
              className="font-bold text-sm font-[family-name:var(--font-display)]"
              style={{ color: "#E8E0D4" }}
            >
              UnfilteredU
            </span>
          </div>
          <p className="text-sm text-center font-light" style={{ color: "rgba(232,224,212,0.3)" }}>
            Real opinions. Real students. No filter.
          </p>
          <p className="text-xs font-light" style={{ color: "rgba(232,224,212,0.15)" }}>
            Not affiliated with any university.
          </p>
        </div>
      </footer>
    </div>
  );
}
