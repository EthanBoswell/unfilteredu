import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HomepageHero from "@/components/HomepageHero";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "UnfilteredU — Real College Reviews",
  description:
    "Real student opinions — not official school content. Housing, dining, academics, and more.",
};

export default async function HomePage() {
  return (
    <div style={{ background: "#F5F4EF" }}>
      <Nav />
      <HomepageHero />
      <HowItWorksSteps />

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

      <Footer />
    </div>
  );
}
