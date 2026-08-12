import { createServerClient } from "./supabase";
import type { Summary } from "./schools";

// Categories needed for the always-public hero + Vibe Check section. Everything
// else (verdict + the other 8 topics) is gated behind login — and gating means
// never querying those rows for a logged-out request, not fetching-then-hiding.
const PUBLIC_CATEGORIES = ["social_life", "academics", "overall_vibe"] as const;

export type PublicSummary = Pick<Summary, "social_life" | "academics"> & {
  overallVibeTagline: string;
};

export async function loadPublicSummary(slug: string): Promise<PublicSummary> {
  const db = createServerClient();

  const { data: school, error: schoolErr } = await db
    .from("schools")
    .select("id")
    .eq("slug", slug)
    .single();

  if (schoolErr || !school) throw new Error(`School not found: ${slug}`);

  const { data: rows, error: summaryErr } = await db
    .from("summaries")
    .select("category, key_points, score")
    .eq("school_id", (school as { id: string }).id)
    .in("category", PUBLIC_CATEGORIES);

  if (summaryErr || !rows?.length) {
    throw new Error(`No summary data found for: ${slug}`);
  }

  const result: Record<string, { key_points: string[]; score: number }> = {};
  for (const row of rows as { category: string; key_points: string[]; score: number }[]) {
    result[row.category] = { key_points: row.key_points, score: row.score };
  }

  return {
    social_life: result.social_life,
    academics: result.academics,
    overallVibeTagline: result.overall_vibe?.key_points[0] ?? "",
  };
}

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
    .select("category, key_points, score")
    .eq("school_id", (school as { id: string }).id);

  if (summaryErr || !rows?.length) {
    throw new Error(`No summary data found for: ${slug}`);
  }

  const result: Record<string, { key_points: string[]; score: number }> = {};
  for (const row of rows as { category: string; key_points: string[]; score: number }[]) {
    result[row.category] = {
      key_points: row.key_points,
      score: row.score,
    };
  }

  return result as unknown as Summary;
}

export async function getSchoolId(slug: string): Promise<string | null> {
  const db = createServerClient();

  const { data, error } = await db
    .from("schools")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return (data as { id: string }).id;
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
