import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function studioDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''
  )
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

export function studioSupabaseUrl() {
  const direct = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_PROJECT_URL ||
    ''
  ).trim();
  if (direct) return direct.replace(/\/+$/, '');
  return supabaseUrlFromDatabase(studioDatabaseUrl());
}

export function studioSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SECRET ||
    ''
  ).trim();
}

export function studioCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

export function studioDatabaseConfigured() {
  const url = studioDatabaseUrl();
  return Boolean(url) && /^postgres(ql)?:\/\//i.test(url);
}

export function studioSupabaseConfigured() {
  return Boolean(studioSupabaseUrl() && studioSupabaseKey());
}

export function studioCloudConfigured() {
  return studioDatabaseConfigured() || studioSupabaseConfigured();
}

export function studioImageConfigured() {
  return studioCloudinaryConfigured() || studioSupabaseConfigured();
}

export function studioCloudMissingParts() {
  const missing: string[] = [];
  const raw = studioDatabaseUrl();
  if (!studioCloudConfigured()) {
    if (raw && !/^postgres(ql)?:\/\//i.test(raw)) {
      missing.push('DATABASE_URL (must start with postgresql://)');
    } else {
      missing.push('DATABASE_URL');
    }
  }
  if (!studioImageConfigured()) {
    missing.push('CLOUDINARY_CLOUD_NAME');
    missing.push('CLOUDINARY_API_KEY');
    missing.push('CLOUDINARY_API_SECRET');
  }
  return missing;
}

function supabaseUrlFromDatabase(databaseUrl: string) {
  if (!databaseUrl) return '';
  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname;
    const dbMatch = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
    if (dbMatch) return `https://${dbMatch[1]}.supabase.co`;
    const userMatch = parsed.username.match(/^postgres\.([a-z0-9]+)$/i);
    if (userMatch && /supabase/i.test(host)) return `https://${userMatch[1]}.supabase.co`;
  } catch {
    return '';
  }
  return '';
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = studioSupabaseUrl();
  const key = studioSupabaseKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
