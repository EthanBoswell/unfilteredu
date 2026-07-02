import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — UnfilteredU",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F4EF" }}>
      <Nav />

      <section className="px-8 pt-16 pb-0 flex-grow">
        <div className="mx-auto max-w-[720px]">
          <p
            className="text-[11px] font-bold uppercase mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.12em",
              color: "#999",
            }}
          >
            Legal
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
            Privacy Policy
          </h1>
          <div className="mt-5 w-12 h-px" style={{ background: "#e0ddd6" }} />
        </div>
      </section>

      <section className="px-8 pt-16 pb-[72px]">
        <div className="mx-auto max-w-[720px]">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            Coming soon.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
