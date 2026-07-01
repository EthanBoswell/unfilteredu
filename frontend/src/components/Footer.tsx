"use client";

import Wordmark from "@/components/Wordmark";

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "YOUR_LINKEDIN_URL",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
  {
    href: "YOUR_INSTAGRAM_URL",
    label: "Instagram",
    Icon: InstagramIcon,
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0F0F0F", borderTop: "1px solid #1a1a1a" }}>
      {/* Social links */}
      <div
        className="flex flex-col items-center gap-2 px-8 pt-6 pb-4"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "Inter, sans-serif", color: "#444" }}
        >
          Follow the journey
        </span>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{ color: "#444", transition: "color 0.15s" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#aaa")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#444")
              }
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <Wordmark size={15} dark />
        <span
          className="text-[11px]"
          style={{ fontFamily: "Inter, sans-serif", color: "#444" }}
        >
          Not affiliated with any university
        </span>
      </div>
    </footer>
  );
}
