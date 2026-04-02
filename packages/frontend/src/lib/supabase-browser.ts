import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Create or return a cached Supabase browser client.
 * Returns null when env vars are missing (e.g. static export / GitHub Pages).
 */
export function createClient(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    client = createSupabaseClient(url, key);
    return client;
  } catch {
    return null;
  }
}
