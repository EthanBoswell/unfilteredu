export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <nav className="border-b border-white/5" style={{ background: "#1A1612" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-black font-[family-name:var(--font-display)]"
              style={{ background: "#2C3E2D", color: "#E8E0D4" }}
            >
              U
            </div>
            <span
              className="font-bold tracking-tight text-base font-[family-name:var(--font-display)]"
              style={{ color: "#E8E0D4" }}
            >
              UnfilteredU
            </span>
          </a>
          <a
            href="/about"
            className="text-sm font-medium tracking-wide transition-opacity opacity-[0.55] hover:opacity-100"
            style={{ color: "#E8E0D4" }}
          >
            About
          </a>
        </div>
      </nav>
    </div>
  );
}
