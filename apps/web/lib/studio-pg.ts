import postgres from 'postgres';
import { studioDatabaseUrl } from '@/lib/supabase-admin';

const SCHEMA_STATEMENTS = [
  `create table if not exists studio_styles (
    id text primary key,
    name text not null,
    slug text not null unique,
    kind text not null check (kind in ('HAIR', 'NAILS')),
    category_name text not null,
    description text not null default '',
    image_url text not null default '',
    starting_price_minor integer not null default 0,
    duration_minutes integer not null default 0,
    location text not null default 'Cape Coast, UCC Campus',
    artist_ids text[] not null default '{}',
    tags text[] not null default '{}',
    featured boolean not null default false,
    published boolean not null default true,
    archived boolean not null default false,
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now()
  )`,
  `create table if not exists studio_bookings (
    id text primary key,
    reference text not null,
    client_name text not null,
    client_phone text not null default '',
    location text not null default '',
    style_id text not null,
    style_name text not null,
    style_kind text not null,
    category_name text not null,
    image_url text not null default '',
    duration_minutes integer not null default 0,
    price_minor integer not null default 0,
    scheduled_at text not null,
    scheduled_date text,
    scheduled_time text,
    notes text not null default '',
    destination text not null default 'PORTAL',
    status text not null default 'WAITING',
    created_at timestamptz not null default now()
  )`,
  `create table if not exists studio_categories (
    kind text primary key check (kind in ('HAIR', 'NAILS')),
    names text[] not null default '{}'
  )`,
  `insert into studio_categories (kind, names) values
    ('HAIR', array['Protective Braids', 'Twists & Locs', 'Locs', 'Weaves', 'Cornrows']),
    ('NAILS', array['Nail Art', 'Nail Shapes', 'Extensions', 'Gel', 'Acrylic'])
  on conflict (kind) do nothing`,
  `create table if not exists studio_settings (
    id text primary key,
    owner_name text not null default '',
    email text not null default '',
    password_hash text not null default '',
    display_phone text not null default '',
    whatsapp_phone text not null default '',
    profile_image_url text not null default '',
    location text not null default '',
    hours text not null default '',
    open_time text not null default '09:00',
    close_time text not null default '17:00',
    updated_at timestamptz not null default now()
  )`,
];

const SCHEMA_MIGRATIONS = [
  `alter table studio_settings add column if not exists open_time text not null default '09:00'`,
  `alter table studio_settings add column if not exists close_time text not null default '17:00'`,
];

let client: postgres.Sql | null | undefined;
let schemaReady = false;

function shouldUseSsl(url: string) {
  if (/localhost|127\.0\.0\.1/i.test(url)) return false;
  if (/sslmode=disable/i.test(url)) return false;
  return true;
}

async function withTimeout<T>(work: Promise<T>, ms: number, label: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out.`)), ms);
      }),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('timed out')) void resetStudioSql();
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getStudioSql() {
  if (client !== undefined) return client;
  const url = studioDatabaseUrl();
  if (!url || !/^postgres(ql)?:\/\//i.test(url)) {
    client = null;
    return null;
  }
  client = postgres(url, {
    max: 1,
    idle_timeout: 8,
    max_lifetime: 60,
    connect_timeout: 8,
    prepare: false,
    ssl: shouldUseSsl(url) ? { rejectUnauthorized: false } : undefined,
    connection: { statement_timeout: 8000 },
  });
  return client;
}

export async function resetStudioSql() {
  const current = client;
  client = undefined;
  schemaReady = false;
  if (current) {
    try {
      await current.end({ timeout: 1 });
    } catch {
      /* ignore */
    }
  }
}

function errorText(error: unknown) {
  if (!error) return 'Database error';
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message && error.message !== '[object Object]') {
    return error.message;
  }
  if (typeof error === 'object') {
    const row = error as Record<string, unknown>;
    const parts = [row.message, row.detail, row.hint, row.code].filter(Boolean).map(String);
    if (parts.length) return parts.join(' — ');
    try {
      return JSON.stringify(error);
    } catch {
      return 'Database error';
    }
  }
  return String(error);
}

export function sanitizeDbError(error: unknown) {
  return errorText(error)
    .replace(/:[^:@/]+@/g, ':****@')
    .replace(/password=[^&\s]+/gi, 'password=****')
    .slice(0, 280);
}

export async function ensureStudioSchema() {
  const sql = getStudioSql();
  if (!sql) throw new Error('DATABASE_URL is missing or is not a postgres URL.');
  if (schemaReady) return sql;
  try {
    await withTimeout(sql`select 1 from studio_styles limit 1`, 8000, 'Catalog lookup');
    for (const statement of SCHEMA_MIGRATIONS) {
      await withTimeout(sql.unsafe(statement), 8000, 'Catalog migrate');
    }
    schemaReady = true;
    return sql;
  } catch {
    /* tables are missing, create them one statement at a time */
  }
  try {
    for (const statement of SCHEMA_STATEMENTS) {
      await withTimeout(sql.unsafe(statement), 8000, 'Catalog setup');
    }
    schemaReady = true;
    return sql;
  } catch (error) {
    schemaReady = false;
    await resetStudioSql();
    throw new Error(sanitizeDbError(error));
  }
}

export async function pingStudioDatabase() {
  const sql = getStudioSql();
  if (!sql) throw new Error('DATABASE_URL is missing or is not a postgres URL.');
  const rows = await withTimeout(sql`select 1 as ok`, 8000, 'Database ping');
  if (!rows.length) throw new Error('Database did not respond.');
  await ensureStudioSchema();
  return true;
}
