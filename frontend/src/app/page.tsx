import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HomepageHero from "@/components/HomepageHero";
import HomepageContrast from "@/components/HomepageContrast";
import Wordmark from "@/components/Wordmark";
import { getHeroQuotes } from "@/lib/data";

export const metadata: Metadata = {
  title: "UnfilteredU — Real College Reviews from Reddit",
  description:
    "Real student opinions from Reddit — not official school content. Housing, dining, academics, and more.",
};

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Reddit, YouTube, X",
    body: "We pull thousands of posts from where students actually talk freely — not official surveys or university-sponsored reviews.",
  },
  {
    n: "02",
    title: "AI reads every post",
    body: "Our AI surfaces what students say about housing, dining, academics, social life, and mental health — across hundreds of posts per school.",
  },
  {
    n: "03",
    title: "You get the real picture",
    body: "Honest summaries with real quotes, organized by topic. Read the full picture in under 5 minutes.",
  },
];

export default function HomePage() {
  const quotes = getHeroQuotes();

  return (
    <div style={{ background: "#F5F4EF" }}>
      <Nav />
      <HomepageHero quotes={quotes} />
      <HomepageContrast />

      {/* How it works */}
      <section style={{ background: "#F5F4EF" }}>
        <div className="mx-auto max-w-[720px] px-8 py-[72px]">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-10"
            style={{ fontFamily: "Inter, sans-serif", color: "#aaa" }}
          >
            How it works
          </p>

          <div>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.n}>
                {i > 0 && <div style={{ height: 1, background: "#e0ddd6" }} />}
                <div className="flex gap-6 py-8">
                  <span
                    className="shrink-0 pt-0.5 text-[11px] font-bold"
                    style={{ fontFamily: "Inter, sans-serif", color: "#ccc", width: 24 }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "var(--font-syne), 'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#111",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F0F0F" }}>
        <div className="mx-auto max-w-[720px] px-8 py-[72px] text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#F5F4EF",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Find your school.
          </h2>
          <p
            className="mb-10 text-[16px]"
            style={{ fontFamily: "Inter, sans-serif", color: "#555" }}
          >
            No ratings. No rankings. Just what students said.
          </p>
          <a
            href="#search-bar"
            className="inline-block rounded-md px-7 py-3 text-[14px]"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              background: "#F5F4EF",
              color: "#0F0F0F",
            }}
          >
            Search schools →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-8 py-5"
        style={{ background: "#0F0F0F", borderTop: "1px solid #1a1a1a" }}
      >
        <Wordmark size={15} dark />
        <span
          className="text-[11px]"
          style={{ fontFamily: "Inter, sans-serif", color: "#444" }}
        >
          Not affiliated with any university
        </span>
      </footer>
    </div>
  );
}
