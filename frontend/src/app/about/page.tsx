import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "About — UnfilteredU",
};

const MISSION_STATS = [
  { value: "19+ Schools", label: "and growing" },
  { value: "100% Student Sourced", label: "no paid content" },
  { value: "Always Free", label: "no paywalls" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#131b2e] relative overflow-hidden pt-16 pb-20 px-6 text-center">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-4 font-[family-name:var(--font-hanken)]"
            style={{ letterSpacing: "-0.02em" }}
          >
            About UnfilteredU
          </h1>
          <div className="flex justify-center">
            <span className="block w-12 h-1 rounded-full bg-[#EF6C35]" />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#F8FAFC] py-16 px-6">
        <div className="max-w-[700px] mx-auto bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-10 sm:p-14">

          {/* Headshot */}
          <div className="flex justify-center mb-10">
            <Image
              src="/ethan.jpeg"
              alt="Ethan Boswell"
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-[#e2e8f0]"
              style={{ width: 150, height: 150 }}
            />
          </div>

          <div className="space-y-5 text-[#45464d] leading-relaxed text-base">
            <p
              className="font-bold text-[#131b2e] text-lg font-[family-name:var(--font-hanken)]"
            >
              Built by a student who learned the hard way.
            </p>
            <p>
              My college journey didn&rsquo;t go as planned. I transferred twice, and along the way I experienced firsthand the gap between what schools promise and what they deliver. What hurt me most wasn&rsquo;t my own experience — it was watching students around me just make the best of it. Already financially invested. Already committed. With no real way out. Nobody told them what they were walking into. There was no honest resource. Just YouTube tours, glossy brochures, and Reddit threads you had to dig through alone at 2am.
            </p>
            <p>So I built the tool I wish existed.</p>
            <p>
              UnfilteredU aggregates thousands of real student opinions from Reddit and uses AI to surface what students actually say about housing, dining, social life, mental health, financial aid, and academics. No marketing. No sponsored content. No tours. Just the truth.
            </p>
            <p>
              I&rsquo;m a CS student who built this in between classes, tournaments, and late nights because I couldn&rsquo;t stop thinking about every student making one of the biggest decisions of their life based on a campus tour and a brochure. The information gap is real — and the students on the other side of it deserve better.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#e2e8f0]">
            <p className="text-[#131b2e] font-semibold text-sm font-[family-name:var(--font-hanken)]">
              — Ethan Boswell, Founder. JMU Student Athlete.
            </p>
          </div>
        </div>
      </section>

      {/* Mission stats */}
      <section className="bg-[#131b2e] py-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {MISSION_STATS.map(({ value, label }) => (
              <div key={value} className="px-8 py-7 text-center">
                <p
                  className="text-xl font-extrabold text-[#EF6C35] mb-1 font-[family-name:var(--font-hanken)]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {value}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-semibold">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#131b2e] py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#EF6C35] rounded-md flex items-center justify-center text-white text-xs font-black font-[family-name:var(--font-hanken)]">
              U
            </div>
            <span className="font-bold text-white text-sm font-[family-name:var(--font-hanken)]">
              UnfilteredU
            </span>
          </div>
          <p className="text-white/35 text-sm text-center">
            Real opinions. Real students. No filter.
          </p>
          <p className="text-white/20 text-xs">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
