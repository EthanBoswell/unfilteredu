import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { getSchoolBySlug } from "@/lib/schools";
import { loadSummary, getAvailableSlugs, getSummaryLastUpdated } from "@/lib/data";
import { schoolColors } from "@/data/schoolColors";
import { SchoolProfile } from "./components";
import type { TopicData } from "./components";
import type { Summary } from "@/lib/schools";

// ── Color utilities ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function computeAccentText(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum > 0.35 ? "#111" : "#fff";
}

// ── Data mapping ─────────────────────────────────────────────────────────────

const TOPIC_CATEGORIES: Array<{ key: keyof Summary; label: string }> = [
  { key: "housing",             label: "Housing" },
  { key: "social_life",         label: "Social Life" },
  { key: "dining",              label: "Dining" },
  { key: "mental_health",       label: "Mental Health" },
  { key: "financial_aid",       label: "Financial Aid" },
  { key: "academics",           label: "Academics" },
  { key: "administration",      label: "Administration" },
  { key: "location_and_campus", label: "Campus & Location" },
  { key: "career_outcomes",     label: "Career Outcomes" },
  { key: "value_for_money",     label: "Value for Money" },
];

function getSentiment(score: number): "positive" | "mixed" | "concern" {
  if (score >= 7) return "positive";
  if (score >= 4) return "mixed";
  return "concern";
}

function getSentimentLabel(score: number): string {
  if (score >= 8) return "Strongly positive";
  if (score >= 7) return "Mostly positive";
  if (score >= 4) return "Mixed feelings";
  return "Some concerns";
}

function mapTopics(summary: Summary): TopicData[] {
  return TOPIC_CATEGORIES.map(({ key, label }) => {
    const data = summary[key];
    return {
      id: key,
      label,
      score: data.score,
      sentiment: getSentiment(data.score),
      sentimentLabel: getSentimentLabel(data.score),
      tagline: data.key_points[0] ?? "",
      summary: data.key_points.join(" "),
    };
  });
}

// ── Route handlers ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return (await getAvailableSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  const name = school?.name ?? slug;
  return {
    title: `${name} — UnfilteredU`,
    description: `Real student opinions about ${name} from Reddit. Housing, dining, academics, and more.`,
  };
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const availableSlugs = await getAvailableSlugs();
  if (!availableSlugs.includes(slug)) notFound();

  const school = getSchoolBySlug(slug);
  if (!school) notFound();

  const summary = await loadSummary(slug);
  const lastUpdated = await getSummaryLastUpdated(slug);

  const colors = schoolColors[slug] ?? school.colors;
  const accent = colors.primary;
  const accentText = computeAccentText(accent);

  return (
    <>
      <Nav schoolName={school.name} schoolColor={accent} schoolTextColor={accentText} />
      <SchoolProfile
        name={school.name}
        location={school.location}
        image={school.image}
        accent={accent}
        accentText={accentText}
        postsAnalyzed={10000}
        lastUpdated={lastUpdated}
        verdict={{
          bestFor: summary.hidden_gems.key_points[0] ?? "",
          watchOut: summary.red_flags.key_points[0] ?? "",
          bottomLine: summary.overall_vibe.key_points[0] ?? "",
        }}
        topics={mapTopics(summary)}
      />
    </>
  );
}
