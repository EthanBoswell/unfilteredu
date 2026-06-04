import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getAvailableSlugs } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — UnfilteredU",
};

export default function AboutPage() {
  const schoolCount = getAvailableSlugs().length;

  const MISSION_STATS = [
    { value: `${schoolCount}`, label: "Schools and growing" },
    { value: "100%", label: "Student sourced, no paid content" },
    { value: "Free", label: "No paywalls, ever" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1c1917] pt-16 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a052]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a052]">
              Our Story
            </span>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] font-bold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}
          >
            About UnfilteredU
          </h1>
          <div className="mt-5 h-px w-12 bg-[#c9a052]" />
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#f5f1eb] py-16 px-6">
        <div className="max-w-[680px] mx-auto">

          {/* Headshot */}
          <div className="flex justify-center mb-12">
            <Image
              src="/ethan.jpeg"
              alt="Ethan Boswell"
              width={150}
              height={150}
              className="rounded-full object-cover border border-[#d6d1c8]"
              style={{ width: 150, height: 150 }}
            />
          </div>

          <div className="space-y-5 text-[#78716c] leading-relaxed text-base font-light">
            <p className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-xl leading-snug">
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

          <div className="mt-10 pt-8 border-t border-[#d6d1c8]">
            <p className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] text-sm italic">
              — Ethan Boswell, Founder. JMU Student Athlete.
            </p>
          </div>
        </div>
      </section>

      {/* Mission stats */}
      <section className="bg-[#ede9e1] py-16 px-6 border-t border-[#d6d1c8]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#d6d1c8]">
            {MISSION_STATS.map(({ value, label }) => (
              <div key={value} className="px-8 first:pl-0 last:pr-0 py-8 sm:py-0">
                <p
                  className="font-[family-name:var(--font-display)] font-bold text-[#1c1917] leading-none mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
                >
                  {value}
                </p>
                <p className="text-xs text-[#78716c] font-light tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0d0a] py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#c9a052] rounded flex items-center justify-center text-[#1c1917] text-xs font-black font-[family-name:var(--font-display)]">
              U
            </div>
            <span className="font-bold text-white text-sm font-[family-name:var(--font-display)]">UnfilteredU</span>
          </div>
          <p className="text-white/30 text-sm font-light">Real opinions. Real students. No filter.</p>
          <p className="text-white/15 text-xs font-light">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
