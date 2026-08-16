import postgres from 'postgres';
import { studioDatabaseUrl } from '@/lib/supabase-admin';

const SCHEMA_SQL = `
create table if not exists studio_styles (
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
);

create table if not exists studio_bookings (
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
);

create table if not exists studio_categories (
  kind text primary key check (kind in ('HAIR', 'NAILS')),
  names text[] not null default '{}'
);

insert into studio_categories (kind, names) values
  ('HAIR', array['Protective Braids', 'Twists & Locs', 'Locs', 'Weaves', 'Cornrows']),
  ('NAILS', array['Nail Art', 'Nail Shapes', 'Extensions', 'Gel', 'Acrylic'])
on conflict (kind) do nothing;
`;

let client: postgres.Sql | null | undefined;
let schemaReady = false;

function shouldUseSsl(url: string) {
  if (/localhost|127\.0\.0\.1/i.test(url)) return false;
  if (/sslmode=disable/i.test(url)) return false;
  return true;
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
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    ssl: shouldUseSsl(url) ? 'require' : undefined,
  });
  return client;
}

export function sanitizeDbError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? 'Database error');
  return raw
    .replace(/:[^:@/]+@/g, ':****@')
    .replace(/password=[^&\s]+/gi, 'password=****')
    .slice(0, 280);
}

export async function ensureStudioSchema() {
  const sql = getStudioSql();
  if (!sql) throw new Error('DATABASE_URL is missing or is not a postgres URL.');
  if (schemaReady) return sql;
  try {
    await sql.unsafe(SCHEMA_SQL);
    schemaReady = true;
    return sql;
  } catch (error) {
    schemaReady = false;
    throw new Error(sanitizeDbError(error));
  }
}

export async function pingStudioDatabase() {
  const sql = await ensureStudioSchema();
  const rows = await sql`select 1 as ok`;
  if (!rows.length) throw new Error('Database did not respond.');
  return true;
}
