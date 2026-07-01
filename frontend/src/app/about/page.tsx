import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAvailableSlugs } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — UnfilteredU",
};

export default function AboutPage() {
  const schoolCount = getAvailableSlugs().length;

  const MISSION_STATS = [
    { value: `${schoolCount}`, label: "Schools and growing" },
    { value: "100%", label: "Student sourced, no paid content" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F5F4EF" }}>
      <Nav />

      {/* Hero */}
      <section className="px-8 pt-16 pb-0">
        <div className="mx-auto max-w-[720px]">
          <p
            className="text-[11px] font-bold uppercase mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.12em",
              color: "#999",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
              color: "#0F0F0F",
              lineHeight: 1.1,
            }}
          >
            About UnfilteredU
            <sup
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 400,
                fontSize: "0.4em",
              }}
            >
              ™
            </sup>
          </h1>
          <div className="mt-5 w-12 h-px" style={{ background: "#e0ddd6" }} />
        </div>
      </section>

      {/* Main content */}
      <section className="px-8 pt-16 pb-0">
        <div className="mx-auto max-w-[720px]">

          {/* Heading */}
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: "#0F0F0F",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            Built by a student who learned the hard way.
          </p>

          {/* Body paragraphs */}
          <div className="flex flex-col gap-5">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              My college journey didn&rsquo;t go as planned. I transferred twice, and along the way I experienced firsthand the gap between what schools promise and what they deliver. What hurt me most wasn&rsquo;t my own experience — it was watching students around me just make the best of it. Already financially invested. Already committed. With no real way out. Nobody told them what they were walking into. There was no honest resource. Just YouTube tours, glossy brochures, and Reddit threads you had to dig through alone at 2am.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              So I built the tool I wish existed.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              UnfilteredU aggregates thousands of real student opinions from Reddit and uses AI to surface what students actually say about housing, dining, social life, mental health, financial aid, and academics. No marketing. No sponsored content. No tours. Just the truth.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              I&rsquo;m a CS student who built this in between classes, tournaments, and late nights because I couldn&rsquo;t stop thinking about every student making one of the biggest decisions of their life based on a campus tour and a brochure. The information gap is real — and the students on the other side of it deserve better.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-10 pt-8" style={{ borderTop: "1px solid #e0ddd6" }}>
            <p
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                fontStyle: "italic",
                color: "#0F0F0F",
              }}
            >
              — Ethan Boswell, Founder. JMU Student Athlete.
            </p>
          </div>
        </div>
      </section>

      {/* Mission stats */}
      <section className="px-8 py-[72px]">
        <div className="mx-auto max-w-[720px]">
          <div
            className="rounded-xl p-8 grid grid-cols-1 sm:grid-cols-2"
            style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 12 }}
          >
            {MISSION_STATS.map(({ value, label }, i) => (
              <div
                key={value}
                className={i > 0 ? "pt-8 sm:pt-0 sm:pl-8" : ""}
                style={i > 0 ? { borderTop: "1px solid #e8e8e2" } : undefined}
              >
                <p
                  className="leading-none mb-2"
                  style={{
                    fontFamily: "var(--font-syne), 'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "-0.03em",
                    color: "#0F0F0F",
                  }}
                >
                  {value}
                </p>
                <p
                  className="text-[13px]"
                  style={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
