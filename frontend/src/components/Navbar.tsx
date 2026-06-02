const TICKER_QUOTES = [
  '"UNC: Gorgeous campus, chaotic housing lottery — start praying early"',
  '"Duke: The libraries never close and neither do your stress levels"',
  '"Georgia Tech: If you survive freshman year, you can survive anything"',
  '"Stanford: Silicon Valley in your backyard, imposter syndrome in your chest"',
  '"UC Berkeley: Best professors, worst bureaucracy, unbeatable energy"',
  '"UVA: Honor code is real — also the social hierarchy"',
  '"FSU: Best weather in the ACC, parking is a fever dream"',
  '"Notre Dame: Football Saturdays are transcendent, winter is not"',
];

export default function Navbar() {
  const repeated = [...TICKER_QUOTES, ...TICKER_QUOTES];

  return (
    <div className="sticky top-0 z-50">
      {/* Scrolling ticker */}
      <div className="bg-[#0a0f1a] text-white py-2 overflow-hidden border-b border-white/10">
        <div className="ticker-track">
          {repeated.map((quote, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/75">
                {quote}
              </span>
              <span className="text-[#EF6C35] text-xs select-none">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-[#131b2e] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#EF6C35] rounded-lg flex items-center justify-center text-white text-xs font-black font-[family-name:var(--font-hanken)]">
              U
            </div>
            <span className="font-bold text-white tracking-tight text-base font-[family-name:var(--font-hanken)]">
              UnfilteredU
            </span>
          </a>
          <a
            href="/about"
            className="text-sm font-semibold text-white/70 hover:text-white transition-colors tracking-wide"
          >
            About
          </a>
        </div>
      </nav>
    </div>
  );
}
