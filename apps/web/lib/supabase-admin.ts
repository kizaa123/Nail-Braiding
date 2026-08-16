import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function studioCloudConfigured() {
  return Boolean(studioSupabaseUrl() && studioSupabaseKey());
}

export function studioSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

export function studioSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = studioSupabaseUrl();
  const key = studioSupabaseKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
