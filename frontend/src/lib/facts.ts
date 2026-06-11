import { getAvailableSlugs, loadSummary } from "./data";
import { getSchoolBySlug } from "./schools";

const MAX_FACTS = 20;
const MAX_FACT_LENGTH = 150;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim() + "…";
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getHomepageFacts(): string[] {
  const facts = getAvailableSlugs().map((slug) => {
    const meta = getSchoolBySlug(slug);
    const name = meta?.name ?? slug;
    const summary = loadSummary(slug);
    const prefix = `At ${name}, `;
    const sentence = truncate(summary.red_flags.key_points[0] ?? "", MAX_FACT_LENGTH - prefix.length);
    return prefix + sentence;
  });

  return shuffle(facts).slice(0, MAX_FACTS);
}
