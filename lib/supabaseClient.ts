import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * Uses the service role key, which bypasses Row Level Security. That's safe
 * here because this client is only ever imported from server-side code --
 * API routes (app/api/**) and server components (e.g. the dashboard page).
 * It is never imported into a "use client" component or shipped to the
 * browser. Every read in lib/db.ts is manually scoped to the requesting
 * user's id, which is what RLS would otherwise enforce.
 *
 * Do NOT import this file from a client component.
 */

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.local.example)."
    );
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return client;
}
