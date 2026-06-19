import Wordmark from "./Wordmark";

interface NavProps {
  schoolName?: string;
  schoolColor?: string;
  schoolTextColor?: string;
}

export default function Nav({ schoolName, schoolColor, schoolTextColor = "#ffffff" }: NavProps) {
  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between px-6"
      style={{ background: "#0F0F0F", height: 52 }}
    >
      <a href="/">
        <Wordmark size={18} dark />
      </a>

      <div className="flex items-center gap-5">
        {schoolName ? (
          <a
            href="/schools"
            className="text-[12px] leading-none"
            style={{ fontFamily: "Inter, sans-serif", color: "#555" }}
          >
            ← All schools
          </a>
        ) : (
          <a
            href="/about"
            className="text-[12px] leading-none"
            style={{ fontFamily: "Inter, sans-serif", color: "#555" }}
          >
            About
          </a>
        )}

        {schoolName && schoolColor ? (
          <span
            className="rounded-md px-4 py-1.5 text-[12px] leading-none font-bold"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              background: schoolColor,
              color: schoolTextColor,
            }}
          >
            {schoolName}
          </span>
        ) : null}
      </div>
    </nav>
  );
}
