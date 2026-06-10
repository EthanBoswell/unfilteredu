import { getAvailableSlugs, loadSummary } from "./data";
import { getSchoolBySlug } from "./schools";

const MAX_FACTS = 20;
const MAX_FACT_LENGTH = 150;

// Matches sentence-ending punctuation, ignoring decimals (e.g. "$1.1") and
// short abbreviations (e.g. "Dr."), and including any trailing closing quotes.
const SENTENCE_END = /[.!?]+(?=['"”’)\]]*\s+[A-Z]|['"”’)\]]*\s*$)/g;

function firstSentence(text: string): string {
  SENTENCE_END.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SENTENCE_END.exec(text))) {
    const idx = match.index;
    const punct = text[idx];
    const prevChar = text[idx - 1];
    const nextChar = text[idx + 1];

    // Skip decimal points, e.g. "$1.1 billion"
    if (punct === "." && /\d/.test(prevChar) && /\d/.test(nextChar)) continue;

    // Skip short abbreviations, e.g. "Dr."
    const precedingWord = text.slice(0, idx).match(/([A-Za-z]+)$/)?.[1] ?? "";
    if (punct === "." && precedingWord.length <= 2 && /^[A-Z]/.test(precedingWord)) continue;

    let end = idx + match[0].length;
    while (end < text.length && /['"”’)\]]/.test(text[end])) end++;
    return text.slice(0, end).trim();
  }
  return text.trim();
}

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
    const sentence = truncate(firstSentence(summary.red_flags.summary), MAX_FACT_LENGTH - prefix.length);
    return prefix + sentence;
  });

  return shuffle(facts).slice(0, MAX_FACTS);
}
