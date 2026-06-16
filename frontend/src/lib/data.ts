import fs from "fs";
import path from "path";
import type { Summary } from "./schools";

function dataDir(): string {
  // When cwd = .../frontend/ (local dev, Vercel with rootDirectory=frontend)
  const fromParent = path.join(process.cwd(), "..", "data");
  if (fs.existsSync(fromParent)) return fromParent;
  // When cwd = repo root (Vercel without explicit rootDirectory)
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
