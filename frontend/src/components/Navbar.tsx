export default function Navbar() {
  return (
    <nav className="bg-[#2B2D42] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#EF6C35] rounded-lg flex items-center justify-center text-white text-xs font-black">
            U
          </div>
          <span className="font-bold text-white tracking-tight text-base">
            UnfilteredU
          </span>
        </a>
        <a
          href="/"
          className="text-sm font-semibold text-white bg-[#EF6C35] rounded-full px-4 py-1.5 hover:bg-[#d45f2a] transition-colors"
        >
          Search Schools
        </a>
      </div>
    </nav>
  );
}
