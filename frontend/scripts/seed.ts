import fs from "fs";
import path from "path";
import { SCHOOLS } from "../src/lib/schools";
import { createServerClient } from "../src/lib/supabase";

const VALID_CATEGORIES = [
  "housing",
  "social_life",
  "dining",
  "mental_health",
  "financial_aid",
  "academics",
  "administration",
  "location_and_campus",
  "career_outcomes",
  "value_for_money",
  "overall_vibe",
  "red_flags",
  "hidden_gems",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

interface CategoryData {
  key_points: string[];
  key_quotes: string[];
  score: number;
}

// Summary JSON files live at frontend/data/, one level up from frontend/scripts/
const DATA_DIR = path.join(__dirname, "..", "data");

async function seed() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  let schoolsSeeded = 0;
  let summariesSeeded = 0;
  let skipped = 0;

  for (const school of SCHOOLS) {
    const summaryPath = path.join(DATA_DIR, `${school.slug}_summary.json`);

    if (!fs.existsSync(summaryPath)) {
      console.warn(`  [skip] No summary file for ${school.name} (${school.slug})`);
      skipped++;
      continue;
    }

    console.log(`→ ${school.name}`);

    const { data: schoolRow, error: schoolErr } = await db
      .from("schools")
      .upsert(
        { slug: school.slug, name: school.name, location: school.location },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (schoolErr || !schoolRow) {
      console.error(`  [error] Failed to upsert school: ${schoolErr?.message}`);
      continue;
    }

    const summary: Record<string, CategoryData> = JSON.parse(
      fs.readFileSync(summaryPath, "utf-8")
    );

    const categories = Object.keys(summary).filter((k): k is Category =>
      (VALID_CATEGORIES as readonly string[]).includes(k)
    );

    const rows = categories.map((category) => ({
      school_id: schoolRow.id,
      category,
      key_points: summary[category].key_points ?? [],
      key_quotes: summary[category].key_quotes ?? [],
      score: summary[category].score ?? null,
    }));

    const { error: summaryErr } = await db
      .from("summaries")
      .upsert(rows, { onConflict: "school_id,category" });

    if (summaryErr) {
      console.error(`  [error] Failed to upsert summaries: ${summaryErr.message}`);
      continue;
    }

    console.log(`  ✓ ${categories.length} categories`);
    schoolsSeeded++;
    summariesSeeded += categories.length;
  }

  console.log(
    `\nSeeded ${schoolsSeeded} schools, ${summariesSeeded} summaries` +
      (skipped > 0 ? ` (${skipped} schools skipped — no summary file)` : "")
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
