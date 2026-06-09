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
    title: "We scrape Reddit",
    desc: "We pull thousands of real posts and comments from Reddit communities for every school — the unfiltered stuff admissions offices will never tell you.",
  },
  {
    step: "02",
    title: "AI finds the patterns",
    desc: "Our AI reads every post to surface what students actually think about housing, dining, academics, mental health, and more.",
  },
  {
    step: "03",
    title: "You get the truth",
    desc: "Get honest, specific summaries with real quotes — organized by topic, ready to read in under 5 minutes.",
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
    <div className="min-h-screen bg-[#EFEFED]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#EFEFED] pt-20 pb-0 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-[#EF6C35]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF6C35]">
              Real College Reviews
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-display)] font-bold leading-[1.05] text-[#111111] mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            Real talk about college.
            <br />
            <em className="text-[#EF6C35]">No filter.</em>
          </h1>

          <p className="text-lg text-[#777777] font-light max-w-xl leading-relaxed mb-10">
            We read thousands of Reddit posts so you don&rsquo;t have to.
            No marketing. No tours. Just the truth.
          </p>

          <SearchBar schools={searchOptions} />

          {/* Stats — promoted into hero */}
          <div className="mt-16 pt-10 border-t border-black/10 grid grid-cols-3 gap-0 divide-x divide-black/10">
            {[
              { value: "10K+", label: "Reddit posts analyzed" },
              { value: String(schools.length), label: "Schools reviewed" },
              { value: "100%", label: "Free forever" },
            ].map(({ value, label }) => (
              <div key={label} className="px-8 first:pl-0 last:pr-0 pb-10">
                <p
                  className="font-[family-name:var(--font-display)] font-bold text-[#111111] leading-none mb-1"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
                >
                  {value}
                </p>
                <p className="text-xs text-[#777777] font-light tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — ghosted numbers */}
      <section className="bg-[#E8E8E6] py-20 px-6 border-t border-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="h-px w-8 bg-[#EF6C35]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF6C35]">
              The Process
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step}>
                {/* Ghosted number — the dominant visual */}
                <div
                  className="font-[family-name:var(--font-display)] font-bold leading-none text-[#CCCCCC] select-none mb-4"
                  style={{ fontSize: "clamp(4rem, 10vw, 7rem)", letterSpacing: "-0.04em" }}
                  aria-hidden
                >
                  {step}
                </div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-[#111111] text-lg mb-2"
                >
                  {title}
                </h3>
                <p className="text-sm text-[#777777] leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools — newspaper grid */}
      <section className="bg-[#EFEFED] py-20 px-6 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#EF6C35]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF6C35]">
                Browse Schools
              </span>
            </div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold text-[#111111] text-xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {schools.length} available now
            </h2>
          </div>

          {/* 1px border grid — no shadows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10">
            {schools.map(({ slug, name, location, vibe }) => (
              <a
                key={slug}
                href={`/schools/${slug}`}
                className="group block border-b border-r border-black/10 p-6 bg-white hover:bg-[#F7F7F5] transition-colors duration-150"
              >
                {/* Live badge */}
                <span className="inline-block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#EF6C35] mb-3">
                  ● Live
                </span>

                {/* School name with gold underline reveal */}
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-[#111111] text-base leading-snug w-fit border-b border-transparent group-hover:border-[#EF6C35] transition-colors duration-200 mb-1"
                >
                  {name}
                </h3>

                {location && (
                  <p className="text-xs text-[#777777] font-light mb-3">{location}</p>
                )}

                <p className="text-sm text-[#777777] leading-relaxed line-clamp-3 font-light">
                  {vibe}
                </p>

                <div className="mt-4 pt-4 border-t border-black/10">
                  <span className="text-xs font-semibold text-[#EF6C35] tracking-wide">
                    Read Reviews →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="bg-[#2B2D42] py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-[#EF6C35]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF6C35]">
              Stay In The Loop
            </span>
            <span className="h-px w-8 bg-[#EF6C35]" />
          </div>
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-white text-3xl sm:text-4xl mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Your school not listed?
          </h2>
          <p className="text-[#777777] mb-8 font-light leading-relaxed">
            We&rsquo;re adding new schools weekly. Drop your email and
            we&rsquo;ll notify you when your school is live.
          </p>
          <EmailSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2D42] py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#EF6C35] rounded flex items-center justify-center text-[#111111] text-xs font-black font-[family-name:var(--font-display)]">
              U
            </div>
            <span className="font-bold text-white text-sm font-[family-name:var(--font-display)]">
              UnfilteredU
            </span>
          </div>
          <p className="text-white/30 text-sm text-center font-light">
            Real opinions. Real students. No filter.
          </p>
          <p className="text-white/15 text-xs font-light">Not affiliated with any university.</p>
        </div>
      </footer>
    </div>
  );
}
