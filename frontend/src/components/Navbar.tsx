const SCHOOL_NAMES = [
  "DUKE UNIVERSITY", "UNC CHAPEL HILL", "GEORGIA TECH", "STANFORD UNIVERSITY",
  "UC BERKELEY", "NOTRE DAME", "VIRGINIA TECH", "FLORIDA STATE",
  "CLEMSON UNIVERSITY", "UNIVERSITY OF MIAMI", "WAKE FOREST", "BOSTON COLLEGE",
  "SYRACUSE UNIVERSITY", "UNIVERSITY OF PITTSBURGH", "UNIVERSITY OF LOUISVILLE",
  "SMU", "HOWARD UNIVERSITY", "UNIVERSITY OF ALABAMA", "AUBURN UNIVERSITY",
  "UNIVERSITY OF FLORIDA", "UGA", "UNIVERSITY OF TENNESSEE",
  "UNIVERSITY OF KENTUCKY", "SOUTH CAROLINA", "UVA", "NC STATE",
];

export default function Navbar() {
  const repeated = [...SCHOOL_NAMES, ...SCHOOL_NAMES];

  return (
    <div className="sticky top-0 z-50">
      {/* Bloomberg-style ticker */}
      <div className="bg-[#0a0806] overflow-hidden border-b border-white/5 py-1.5">
        <div className="ticker-track">
          {repeated.map((name, i) => (
            <span key={i} className="flex items-center">
              <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#c9a052] px-4">
                {name}
              </span>
              <span className="text-[#c9a052]/30 text-[8px] select-none">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-[#1c1917] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#c9a052] rounded flex items-center justify-center text-[#1c1917] text-xs font-black font-[family-name:var(--font-display)]">
              U
            </div>
            <span className="font-bold text-white tracking-tight text-base font-[family-name:var(--font-display)]">
              UnfilteredU
            </span>
          </a>
          <a
            href="/about"
            className="text-sm font-medium text-white/55 hover:text-white/90 transition-colors tracking-wide"
          >
            About
          </a>
        </div>
      </nav>
    </div>
  );
}
