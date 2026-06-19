import fs from "fs";
import path from "path";
import type { Summary } from "./schools";
import { getContrastTextColor, getSchoolBySlug } from "./schools";

function dataDir(): string {
  return path.join(process.cwd(), "data");
}

export function loadSummary(slug: string): Summary {
  const jsonPath = path.join(dataDir(), `${slug}_summary.json`);
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Summary;
}

export function getAvailableSlugs(): string[] {
  try {
    return fs
      .readdirSync(dataDir())
      .filter((f) => f.endsWith("_summary.json"))
      .map((f) => f.replace("_summary.json", ""));
  } catch {
    return [];
  }
}

export function getSummaryLastUpdated(slug: string): string {
  const jsonPath = path.join(dataDir(), `${slug}_summary.json`);
  const { mtime } = fs.statSync(jsonPath);
  return mtime.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export type HeroQuote = {
  text: string;
  school: string;
  slug: string;
  color: string;
  textColor: string;
};

export function getHeroQuotes(): HeroQuote[] {
  return getAvailableSlugs()
    .map((slug): HeroQuote | null => {
      const school = getSchoolBySlug(slug);
      if (!school) return null;

      let text: string | undefined;
      try {
        const summary = loadSummary(slug);
        text = summary.overall_vibe?.key_quotes?.find((q) => q && q.trim().length > 0);
      } catch {
        return null;
      }
      if (!text) return null;

      return {
        text,
        school: school.name,
        slug,
        color: school.colors.primary,
        textColor: getContrastTextColor(school.colors.primary),
      };
    })
    .filter((q): q is HeroQuote => q !== null);
}
