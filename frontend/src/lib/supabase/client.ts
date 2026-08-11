import { createBrowserClient } from "@supabase/ssr";

/** Browser client for use in Client Components — reads/writes the auth cookies directly. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
