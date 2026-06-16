// ─── Quote ────────────────────────────────────────────────────────────────────

export type Quote = {
  text: string;
  author?: string; // MISSING: JSON key_quotes are plain strings with no author field
};

// ─── Topic ────────────────────────────────────────────────────────────────────

export type TopicStat = {
  label: string;
  value: string; // e.g. "74%", "3.2 / 5"
};

export type Topic = {
  id: string;    // e.g. "housing" — derived from JSON key; not stored in JSON itself
  label: string; // e.g. "Housing" — MISSING from JSON

  sentiment: "positive" | "mixed" | "concern"; // MISSING: JSON has score (0–10) but no enum
  sentimentLabel: string;                       // MISSING: e.g. "Strong Positive", "Mixed"

  tagline: string;  // MISSING: one-line hook for the topic card
  postCount?: number; // MISSING: JSON has no per-category post count

  summary?: string;  // MISSING: JSON has key_points: string[] instead of a prose summary
  quotes: Quote[];   // Partial match: JSON has key_quotes: string[], but no author
  stats?: TopicStat[]; // MISSING: no computed stats in JSON

  // Raw fields that DO exist in the current JSON (used while migrating)
  score?: number;        // 0–10 integer in JSON
  key_points?: string[]; // bullet list in JSON
};

// ─── Brand ────────────────────────────────────────────────────────────────────

export type SchoolBrand = {
  accent: string;      // Closest match: SchoolMeta.colors.primary (hex)
  accentLight: string; // MISSING: light wash variant for backgrounds
  accentText: string;  // MISSING: "#fff" or "#111" based on contrast
};

// ─── Verdict ──────────────────────────────────────────────────────────────────

export type Verdict = {
  bestFor: string;    // MISSING from JSON
  watchOut: string;   // MISSING from JSON
  bottomLine: string; // MISSING from JSON
};

// ─── School ───────────────────────────────────────────────────────────────────

export type School = {
  slug: string;     // in SchoolMeta
  name: string;     // in SchoolMeta
  location: string; // in SchoolMeta

  postsAnalyzed?: number; // MISSING: hardcoded as "10,000+" in the page component
  lastUpdated?: string;   // MISSING: currently derived from file mtime at runtime

  heroQuote?: Quote;   // MISSING: no designated featured quote in JSON
  verdict?: Verdict;   // MISSING: no verdict object in JSON

  // MISSING as an array: current JSON is a flat object keyed by category (e.g. summary.housing).
  // This is the desired forward-looking shape; build it by iterating the flat Summary keys.
  topics?: Topic[];

  // MISSING: current data only has primary/secondary hex values in SchoolMeta.colors
  brand?: SchoolBrand;
};
