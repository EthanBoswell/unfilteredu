import Navbar from "@/components/Navbar";

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

const FEATURED_SCHOOLS = [
  {
    name: "UNC Chapel Hill",
    location: "Chapel Hill, NC",
    vibe: "Strong Tar Heel spirit, but housing is brutally competitive and merit aid is nearly non-existent.",
    href: "/schools/unc",
    live: true,
  },
  {
    name: "Duke University",
    location: "Durham, NC",
    vibe: null,
    href: null,
    live: false,
  },
  {
    name: "NC State",
    location: "Raleigh, NC",
    vibe: null,
    href: null,
    live: false,
  },
  {
    name: "Georgia Tech",
    location: "Atlanta, GA",
    vibe: null,
    href: null,
    live: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#F2F3F5] pt-20 pb-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#EF6C35] mb-6">
            <span className="w-6 h-px bg-[#EF6C35]" />
            Unfiltered college reviews
            <span className="w-6 h-px bg-[#EF6C35]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-[#2B2D42] mb-4">
            Real talk about college.{" "}
            <span className="text-[#EF6C35]">From real students.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
            We read thousands of Reddit posts so you don&rsquo;t have to. No
            marketing. No tours. Just the truth.
          </p>
          {/* Search bar */}
          <div className="max-w-xl mx-auto flex rounded-full overflow-hidden shadow-lg border border-slate-200 bg-white">
            <div className="flex items-center pl-5 text-slate-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search a university..."
              className="flex-1 px-4 py-4 text-base text-slate-700 placeholder-slate-400 bg-transparent outline-none"
              readOnly
            />
            <button className="bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors text-white font-bold px-6 py-4 text-sm shrink-0">
              Find My School
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            UNC Chapel Hill available now · More schools coming soon
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#2B2D42] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {STATS.map(({ value, label }) => (
              <div
                key={value}
                className="bg-[#2B2D42] px-8 py-7 text-center"
              >
                <p className="text-3xl font-black text-[#EF6C35] mb-1">
                  {value}
                </p>
                <p className="text-sm text-white/60 uppercase tracking-wider font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#EF6C35] mb-3">
              The process
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2B2D42]">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-slate-200 z-0" />
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F2F3F5] border border-slate-200 flex items-center justify-center text-2xl mb-5 shadow-sm">
                  {icon}
                </div>
                <span className="text-xs font-black text-[#EF6C35] tracking-widest mb-1">
                  STEP {step}
                </span>
                <h3 className="text-base font-bold text-[#2B2D42] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured schools */}
      <section className="bg-[#F2F3F5] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#EF6C35] mb-3">
              Browse schools
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2B2D42]">
              Featured schools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_SCHOOLS.map(({ name, location, vibe, href, live }) =>
              live ? (
                <div
                  key={name}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="mb-auto">
                    <div className="inline-flex items-center gap-1.5 bg-[#EF6C35]/10 rounded-full px-2.5 py-0.5 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF6C35]" />
                      <span className="text-xs font-semibold text-[#EF6C35]">Live</span>
                    </div>
                    <h3 className="font-bold text-[#2B2D42] text-base mb-0.5">
                      {name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">{location}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {vibe}
                    </p>
                  </div>
                  <a
                    href={href!}
                    className="mt-5 w-full text-center text-sm font-bold text-white bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors rounded-full py-2.5"
                  >
                    View Profile →
                  </a>
                </div>
              ) : (
                <div
                  key={name}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col opacity-60"
                >
                  <div className="mb-auto">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-full px-2.5 py-0.5 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span className="text-xs font-semibold text-slate-500">Coming Soon</span>
                    </div>
                    <h3 className="font-bold text-[#2B2D42] text-base mb-0.5">
                      {name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">{location}</p>
                  </div>
                  <div className="mt-5 w-full text-center text-sm font-semibold text-slate-400 bg-slate-100 rounded-full py-2.5 cursor-default">
                    Coming Soon
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-20 px-4 border-t border-slate-200">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#EF6C35] mb-4">
            Stay in the loop
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2D42] mb-2">
            Your school not listed?
          </h2>
          <p className="text-slate-500 mb-8">
            We&rsquo;re adding new schools weekly. Drop your email and
            we&rsquo;ll notify you when your school is live.
          </p>
          <div className="flex rounded-full overflow-hidden shadow border border-slate-200 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-white outline-none"
              readOnly
            />
            <button className="bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors text-white font-bold px-5 py-3.5 text-sm shrink-0">
              Subscribe →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B2D42] py-10 px-4">
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
          <p className="text-white/25 text-xs">
            Not affiliated with any university.
          </p>
        </div>
      </footer>
    </div>
  );
}
