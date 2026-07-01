import { createClient } from "@supabase/supabase-js";

// Placeholder until `npx supabase gen types` is run
export type Database = {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser client — safe to use in Client Components and browser code. */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Server-only client — uses the service role key which bypasses Row Level
 * Security. Import only in server-side code (Route Handlers, Server Actions,
 * server components). Never import this in Client Components or expose it to
 * the browser.
 */
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
