import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Best-effort event log — never let metrics break the actual user flow. */
export async function logEvent(
  supabase: SupabaseServerClient,
  userId: string,
  eventName: string,
  metadata: Record<string, unknown> = {},
) {
  try {
    await supabase.from("events").insert({ user_id: userId, event_name: eventName, metadata });
  } catch {
    // swallow — logging failures shouldn't surface to the user
  }
}
