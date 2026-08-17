-- Run this in the Supabase SQL editor (once).
-- Dashboard → SQL Editor → New query → paste → Run.

create table if not exists studio_styles (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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

create table if not exists studio_settings (
  id text primary key,
  owner_name text not null default '',
  email text not null default '',
  password_hash text not null default '',
  display_phone text not null default '',
  whatsapp_phone text not null default '',
  profile_image_url text not null default '',
  location text not null default '',
  hours text not null default '',
  updated_at timestamptz not null default now()
);

alter table studio_styles enable row level security;
alter table studio_bookings enable row level security;
alter table studio_categories enable row level security;

insert into storage.buckets (id, name, public)
values ('studio-looks', 'studio-looks', true)
on conflict (id) do nothing;

drop policy if exists "Public read published styles" on studio_styles;
create policy "Public read published styles"
on studio_styles for select
to public
using (published = true and archived = false);

drop policy if exists "Public read studio categories" on studio_categories;
create policy "Public read studio categories"
on studio_categories for select
to public
using (true);

drop policy if exists "Public read studio looks" on storage.objects;
create policy "Public read studio looks"
on storage.objects for select
to public
using (bucket_id = 'studio-looks');
