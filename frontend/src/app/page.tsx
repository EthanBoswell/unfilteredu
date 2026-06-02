import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EmailSignup from "@/components/EmailSignup";
import SearchBar from "@/components/SearchBar";
import { getSchoolBySlug } from "@/lib/schools";
import { getAvailableSlugs, loadSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "UnfilteredU",
};

const STATS = [
  { value: "10,000+", label: "Reddit posts analyzed" },
  { value: "AI-powered", label: "summaries" },
  { value: "100%", label: "student sourced" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🔍",
    title: "We scrape Reddit",
    desc: "We pull thousands of real posts and comments from Reddit communities for every school — the unfiltered stuff admissions offices will never tell you.",
  },
  {
    step: "02",
    icon: "🤖",
    title: "AI finds the patterns",
    desc: "Our AI reads every post to surface what students actually think about housing, dining, academics, mental health, and more.",
  },
  {
    step: "03",
    icon: "✅",
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#131b2e] relative overflow-hidden pt-20 pb-28 px-6">
        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#EF6C35] mb-6">
            <span className="w-5 h-px bg-[#EF6C35]" />
            Unfiltered college reviews
            <span className="w-5 h-px bg-[#EF6C35]" />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-5 font-[family-name:var(--font-hanken)]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Real talk about college.{" "}
            <span className="text-[#EF6C35]">From real students.</span>
          </h1>
          <p className="text-lg text-white/55 max-w-xl mx-auto leading-relaxed mb-10">
            We read thousands of Reddit posts so you don&rsquo;t have to. No
            marketing. No tours. Just the truth.
          </p>
          <SearchBar schools={searchOptions} />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#0f1623] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {STATS.map(({ value, label }) => (
              <div key={value} className="px-8 py-7 text-center">
                <p
                  className="text-3xl font-extrabold text-[#EF6C35] mb-1 font-[family-name:var(--font-hanken)]"
                  style={{ letterSpacing: "-0.02em" }}
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

      {/* How it works */}
      <section className="bg-white py-20 px-6 border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#EF6C35] mb-3">
              The process
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] font-[family-name:var(--font-hanken)]"
              style={{ letterSpacing: "-0.01em" }}
            >
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-[#e2e8f0] z-0" />
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#e2e8f0] flex items-center justify-center text-2xl mb-5 shadow-sm">
                  {icon}
                </div>
                <span className="text-[10px] font-black text-[#EF6C35] tracking-[0.15em] mb-1">
                  STEP {step}
                </span>
                <h3
                  className="text-base font-bold text-[#131b2e] mb-2 font-[family-name:var(--font-hanken)]"
                >
                  {title}
                </h3>
                <p className="text-sm text-[#45464d] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools grid */}
      <section className="bg-[#F8FAFC] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#EF6C35] mb-3">
              Browse schools
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] font-[family-name:var(--font-hanken)]"
              style={{ letterSpacing: "-0.01em" }}
            >
              {schools.length} schools available now
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schools.map(({ slug, name, location, vibe }) => (
              <a
                key={slug}
                href={`/schools/${slug}`}
                className="group bg-white rounded-2xl border border-[#e2e8f0] p-6 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="mb-auto">
                  {/* Live badge */}
                  <div className="inline-flex items-center gap-1.5 bg-[#EF6C35]/10 rounded-full px-2.5 py-0.5 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF6C35]" />
                    <span className="text-[11px] font-bold tracking-wide text-[#EF6C35]">Live</span>
                  </div>
                  <h3
                    className="font-bold text-[#131b2e] text-base mb-0.5 font-[family-name:var(--font-hanken)] group-hover:text-[#EF6C35] transition-colors"
                  >
                    {name}
                  </h3>
                  {location && (
                    <p className="text-xs text-[#45464d]/60 mb-3">{location}</p>
                  )}
                  <p className="text-sm text-[#45464d] leading-relaxed line-clamp-3">
                    {vibe}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#EF6C35] group-hover:gap-2.5 transition-all">
                  View Profile
                  <span className="text-base leading-none">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="bg-white py-20 px-6 border-t border-[#e2e8f0]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#EF6C35] mb-4">
            Stay in the loop
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#131b2e] mb-2 font-[family-name:var(--font-hanken)]"
            style={{ letterSpacing: "-0.01em" }}
          >
            Your school not listed?
          </h2>
          <p className="text-[#45464d] mb-8 leading-relaxed">
            We&rsquo;re adding new schools weekly. Drop your email and
            we&rsquo;ll notify you when your school is live.
          </p>
          <EmailSignup />
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
