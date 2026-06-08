export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
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
