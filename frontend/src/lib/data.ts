import fs from "fs";
import path from "path";
import type { Summary } from "./schools";

function dataDir(): string {
  return path.join(process.cwd(), "..", "data");
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
