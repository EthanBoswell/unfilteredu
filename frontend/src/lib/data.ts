import { createServerClient } from "./supabase";
import { getContrastTextColor, getSchoolBySlug } from "./schools";
import type { Summary } from "./schools";

export type HeroQuote = {
  text: string;
  school: string;
  slug: string;
  color: string;
  textColor: string;
};

export async function loadSummary(slug: string): Promise<Summary> {
  const db = createServerClient();

  const { data: school, error: schoolErr } = await db
    .from("schools")
    .select("id")
    .eq("slug", slug)
    .single();

  if (schoolErr || !school) throw new Error(`School not found: ${slug}`);

  const { data: rows, error: summaryErr } = await db
    .from("summaries")
    .select("category, key_points, key_quotes, score")
    .eq("school_id", (school as { id: string }).id);

  if (summaryErr || !rows?.length) {
    throw new Error(`No summary data found for: ${slug}`);
  }

  const result: Record<string, { key_points: string[]; key_quotes: string[]; score: number }> = {};
  for (const row of rows as { category: string; key_points: string[]; key_quotes: string[]; score: number }[]) {
    result[row.category] = {
      key_points: row.key_points,
      key_quotes: row.key_quotes,
      score: row.score,
    };
  }

  return result as unknown as Summary;
}

export async function getAvailableSlugs(): Promise<string[]> {
  const db = createServerClient();

  const { data, error } = await db
    .from("schools")
    .select("slug")
    .order("slug");

  if (error) throw new Error(`Failed to fetch slugs: ${error.message}`);

  return (data as { slug: string }[] ?? []).map((r) => r.slug);
}

export async function getSummaryLastUpdated(slug: string): Promise<string> {
  const db = createServerClient();

  const { data: school, error: schoolErr } = await db
    .from("schools")
    .select("id")
    .eq("slug", slug)
    .single();

  if (schoolErr || !school) throw new Error(`School not found: ${slug}`);

  const { data, error } = await db
    .from("summaries")
    .select("created_at")
    .eq("school_id", (school as { id: string }).id)
    .limit(1)
    .single();

  if (error || !data) return "";

  return new Date((data as { created_at: string }).created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export async function getHeroQuotes(): Promise<HeroQuote[]> {
  const db = createServerClient();

  const { data, error } = await db
    .from("summaries")
    .select("key_quotes, schools!inner(slug, name)")
    .eq("category", "overall_vibe");

  if (error || !data) return [];

  return (data as { key_quotes: string[]; schools: { slug: string; name: string } }[]).flatMap(
    (row) => {
      const school = getSchoolBySlug(row.schools.slug);
      if (!school) return [];

      const text = row.key_quotes.find((q) => q && q.trim().length > 0);
      if (!text) return [];

      return [
        {
          text,
          school: row.schools.name,
          slug: row.schools.slug,
          color: school.colors.primary,
          textColor: getContrastTextColor(school.colors.primary),
        },
      ];
    }
  );
}
