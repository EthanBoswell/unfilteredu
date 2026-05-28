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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#2B2D42] pt-20 pb-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-white mb-4">
            About UnfilteredU
          </h1>
          <div className="flex justify-center">
            <span className="block w-16 h-1 rounded-full bg-[#EF6C35]" />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#F2F3F5] py-16 px-4">
        <div className="max-w-[700px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-10 sm:p-14">

          {/* Headshot */}
          <div className="flex justify-center mb-10">
            <Image
              src="/ethan.jpeg"
              alt="Ethan Boswell"
              width={150}
              height={150}
              className="rounded-full object-cover border-2 border-slate-200"
              style={{ width: 150, height: 150 }}
            />
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-5 text-base">
            <p className="font-bold text-[#2B2D42] text-lg">
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

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-[#2B2D42] font-semibold text-sm">
              — Ethan Boswell, Founder. JMU Student Athlete.
            </p>
          </div>
        </div>
      </section>

      {/* Mission stats bar */}
      <section className="bg-[#2B2D42] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {MISSION_STATS.map(({ value, label }) => (
              <div key={value} className="bg-[#2B2D42] px-8 py-7 text-center">
                <p className="text-2xl font-black text-[#EF6C35] mb-1">{value}</p>
                <p className="text-sm text-white/60 uppercase tracking-wider font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2D42] py-10 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#EF6C35] rounded-md flex items-center justify-center text-white text-xs font-black">
              U
            </div>
            <span className="font-bold text-white text-sm">UnfilteredU</span>
          </div>
          <p className="text-white/40 text-sm text-center">
            Real opinions. Real students. No filter.
          </p>
          <p className="text-white/25 text-xs">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
