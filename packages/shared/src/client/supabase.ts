import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client with service role key for server-side operations.
 * Has full access bypassing Row Level Security.
 */
export function createServiceClient(
  url: string,
  serviceRoleKey: string,
): SupabaseClient {
  if (!url) {
    throw new Error('Supabase URL is required');
  }
  if (!serviceRoleKey) {
    throw new Error('Supabase service role key is required');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a Supabase client with anon key for browser/public operations.
 * Respects Row Level Security policies.
 */
export function createBrowserClient(
  url: string,
  anonKey: string,
): SupabaseClient {
  if (!url) {
    throw new Error('Supabase URL is required');
  }
  if (!anonKey) {
    throw new Error('Supabase anon key is required');
  }

  return createClient(url, anonKey);
}
