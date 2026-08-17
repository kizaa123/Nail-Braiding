import type { StudioBooking } from '@/lib/studio-bookings';
import type { StudioCategoryMap } from '@/lib/studio-categories';
import { slugifyStyleName, type StyleDraft, type StudioStyle } from '@/lib/studio-styles';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { uploadLookImage } from '@/lib/studio-images';
import { ensureStudioSchema, getStudioSql } from '@/lib/studio-pg';

type StyleRow = {
  id: string;
  name: string;
  slug: string;
  kind: 'HAIR' | 'NAILS';
  category_name: string;
  description: string;
  image_url: string;
  starting_price_minor: number;
  duration_minutes: number;
  location: string;
  artist_ids: string[] | null;
  tags: string[] | null;
  featured: boolean;
  published: boolean;
  archived: boolean;
  updated_at: string | Date;
};

type BookingRow = {
  id: string;
  reference: string;
  client_name: string;
  client_phone: string;
  location: string | null;
  style_id: string;
  style_name: string;
  style_kind: 'HAIR' | 'NAILS';
  category_name: string;
  image_url: string;
  duration_minutes: number;
  price_minor: number;
  scheduled_at: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  notes: string;
  destination: 'PORTAL' | 'WHATSAPP';
  status: StudioBooking['status'];
  created_at: string | Date;
};

function asIso(value: string | Date | null | undefined) {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? '');
}

export function mapStyle(row: StyleRow): StudioStyle {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: row.kind,
    categoryName: row.category_name,
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    startingPriceMinor: Number(row.starting_price_minor ?? 0),
    durationMinutes: Number(row.duration_minutes ?? 0),
    location: row.location || 'Cape Coast, UCC Campus',
    artistIds: row.artist_ids ?? [],
    tags: row.tags ?? [],
    featured: Boolean(row.featured),
    published: row.published !== false,
    archived: Boolean(row.archived),
    updatedAt: asIso(row.updated_at),
  };
}

export function mapBooking(row: BookingRow): StudioBooking {
  return {
    id: row.id,
    reference: row.reference,
    clientName: row.client_name,
    clientPhone: row.client_phone ?? '',
    location: row.location ?? '',
    styleId: row.style_id,
    styleName: row.style_name,
    styleKind: row.style_kind,
    categoryName: row.category_name,
    imageUrl: row.image_url ?? '',
    durationMinutes: Number(row.duration_minutes ?? 0),
    priceMinor: Number(row.price_minor ?? 0),
    scheduledAt: row.scheduled_at,
    scheduledDate: row.scheduled_date ?? undefined,
    scheduledTime: row.scheduled_time ?? undefined,
    notes: row.notes ?? '',
    destination: row.destination,
    status: row.status,
    createdAt: asIso(row.created_at),
  };
}

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugifyStyleName(name);
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    let slug = base;
    let n = 2;
    for (;;) {
      const rows = ignoreId
        ? await sql`select id from studio_styles where slug = ${slug} and id::text <> ${ignoreId} limit 1`
        : await sql`select id from studio_styles where slug = ${slug} limit 1`;
      if (!rows.length) return slug;
      slug = `${base}-${n}`;
      n += 1;
      if (n > 40) return `${base}-${Date.now()}`;
    }
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return base;
  let slug = base;
  let n = 2;
  for (;;) {
    const { data } = await supabase.from('studio_styles').select('id').eq('slug', slug).maybeSingle();
    if (!data || data.id === ignoreId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export async function dbListStyles(scope: 'public' | 'all') {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const rows =
      scope === 'public'
        ? await sql<StyleRow[]>`
            select * from studio_styles
            where published = true and archived = false
            order by updated_at desc
          `
        : await sql<StyleRow[]>`select * from studio_styles order by updated_at desc`;
    return rows.map(mapStyle);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  let query = supabase.from('studio_styles').select('*').order('updated_at', { ascending: false });
  if (scope === 'public') query = query.eq('published', true).eq('archived', false);
  const { data, error } = await query;
  if (error) throw error;
  return (data as StyleRow[]).map(mapStyle);
}

export async function dbUpsertStyle(draft: StyleDraft & { id?: string }) {
  const now = new Date().toISOString();
  const slug = await uniqueSlug(draft.name, draft.id);
  const row = {
    name: draft.name.trim(),
    slug,
    kind: draft.kind,
    category_name: draft.categoryName.trim(),
    description: draft.description.trim(),
    image_url: draft.imageUrl,
    starting_price_minor: draft.startingPriceMinor,
    duration_minutes: draft.durationMinutes,
    location: draft.location.trim() || 'Cape Coast, UCC Campus',
    artist_ids: draft.artistIds ?? [],
    featured: draft.featured,
    published: draft.published,
    updated_at: now,
  };

  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    if (draft.id) {
      const updateRow = { ...row, ...(draft.published ? { archived: false } : {}) };
      const rows = await sql<StyleRow[]>`
        update studio_styles set ${sql(updateRow)} where id::text = ${draft.id} returning *
      `;
      if (!rows[0]) throw new Error('Look was not found.');
      return mapStyle(rows[0]);
    }
    const id = crypto.randomUUID();
    const artistIds = row.artist_ids;
    const emptyTags: string[] = [];
    const rows = await sql<StyleRow[]>`
      insert into studio_styles (
        id, name, slug, kind, category_name, description, image_url,
        starting_price_minor, duration_minutes, location, artist_ids, tags,
        featured, published, archived, updated_at
      ) values (
        ${id}, ${row.name}, ${row.slug}, ${row.kind}, ${row.category_name}, ${row.description}, ${row.image_url},
        ${row.starting_price_minor}, ${row.duration_minutes}, ${row.location}, ${artistIds}, ${emptyTags},
        ${row.featured}, ${row.published}, false, ${row.updated_at}
      )
      returning *
    `;
    if (!rows[0]) throw new Error('Could not save look.');
    return mapStyle(rows[0]);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  if (draft.id) {
    const updateRow = { ...row, ...(draft.published ? { archived: false } : {}) };
    const { data, error } = await supabase.from('studio_styles').update(updateRow).eq('id', draft.id).select('*').single();
    if (error) throw error;
    return mapStyle(data as StyleRow);
  }
  const { data, error } = await supabase
    .from('studio_styles')
    .insert({ ...row, archived: false, tags: [] })
    .select('*')
    .single();
  if (error) throw error;
  return mapStyle(data as StyleRow);
}

export async function dbPatchStyle(id: string, patch: Partial<StudioStyle>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.kind !== undefined) row.kind = patch.kind;
  if (patch.categoryName !== undefined) row.category_name = patch.categoryName;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl;
  if (patch.startingPriceMinor !== undefined) row.starting_price_minor = patch.startingPriceMinor;
  if (patch.durationMinutes !== undefined) row.duration_minutes = patch.durationMinutes;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.artistIds !== undefined) row.artist_ids = patch.artistIds;
  if (patch.tags !== undefined) row.tags = patch.tags;
  if (patch.featured !== undefined) row.featured = patch.featured;
  if (patch.published !== undefined) row.published = patch.published;
  if (patch.archived !== undefined) row.archived = patch.archived;

  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const rows = await sql<StyleRow[]>`
      update studio_styles set ${sql(row)} where id::text = ${id} returning *
    `;
    if (!rows[0]) throw new Error('Look was not found.');
    return mapStyle(rows[0]);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from('studio_styles').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapStyle(data as StyleRow);
}

export async function dbDeleteStyle(id: string) {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    await sql`delete from studio_styles where id::text = ${id}`;
    return true;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error } = await supabase.from('studio_styles').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbListBookings() {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const rows = await sql<BookingRow[]>`
      select * from studio_bookings
      where destination <> 'WHATSAPP'
      order by created_at desc
    `;
    return rows.map(mapBooking);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('studio_bookings')
    .select('*')
    .neq('destination', 'WHATSAPP')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as BookingRow[]).map(mapBooking);
}

export async function dbCreateBooking(booking: StudioBooking) {
  if (booking.destination === 'WHATSAPP') return booking;
  const insertRow = {
    id: booking.id,
    reference: booking.reference,
    client_name: booking.clientName,
    client_phone: booking.clientPhone,
    location: booking.location ?? '',
    style_id: booking.styleId,
    style_name: booking.styleName,
    style_kind: booking.styleKind,
    category_name: booking.categoryName,
    image_url: booking.imageUrl,
    duration_minutes: booking.durationMinutes,
    price_minor: booking.priceMinor,
    scheduled_at: booking.scheduledAt,
    scheduled_date: booking.scheduledDate ?? null,
    scheduled_time: booking.scheduledTime ?? null,
    notes: booking.notes,
    destination: booking.destination,
    status: booking.status,
    created_at: booking.createdAt,
  };

  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const rows = await sql<BookingRow[]>`insert into studio_bookings ${sql(insertRow)} returning *`;
    return mapBooking(rows[0]);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from('studio_bookings').insert(insertRow).select('*').single();
  if (error) throw error;
  return mapBooking(data as BookingRow);
}

export async function dbPatchBooking(id: string, patch: Partial<StudioBooking>) {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.clientName !== undefined) row.client_name = patch.clientName;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const rows = await sql<BookingRow[]>`
      update studio_bookings set ${sql(row)} where id::text = ${id} returning *
    `;
    if (!rows[0]) throw new Error('Booking was not found.');
    return mapBooking(rows[0]);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from('studio_bookings').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapBooking(data as BookingRow);
}

export async function dbDeleteBooking(id: string) {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    await sql`delete from studio_bookings where id::text = ${id}`;
    return true;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error } = await supabase.from('studio_bookings').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbListCategories(): Promise<StudioCategoryMap | null> {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    const data = await sql<{ kind: string; names: string[] }[]>`select * from studio_categories`;
    const map: StudioCategoryMap = { HAIR: [], NAILS: [] };
    for (const row of data) {
      if (row.kind === 'HAIR') map.HAIR = Array.isArray(row.names) ? row.names : [];
      else if (row.kind === 'NAILS') map.NAILS = Array.isArray(row.names) ? row.names : [];
    }
    return map;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from('studio_categories').select('*');
  if (error) throw error;
  const map: StudioCategoryMap = { HAIR: [], NAILS: [] };
  for (const row of data ?? []) {
    if (row.kind === 'HAIR') map.HAIR = Array.isArray(row.names) ? row.names : [];
    else if (row.kind === 'NAILS') map.NAILS = Array.isArray(row.names) ? row.names : [];
  }
  return map;
}

export async function dbSaveCategories(categories: StudioCategoryMap) {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    await sql`
      insert into studio_categories ${sql([
        { kind: 'HAIR', names: categories.HAIR },
        { kind: 'NAILS', names: categories.NAILS },
      ])}
      on conflict (kind) do update set names = excluded.names
    `;
    return categories;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error } = await supabase.from('studio_categories').upsert([
    { kind: 'HAIR', names: categories.HAIR },
    { kind: 'NAILS', names: categories.NAILS },
  ]);
  if (error) throw error;
  return categories;
}

export async function dbRenameCategory(kind: 'HAIR' | 'NAILS', from: string, to: string) {
  if (getStudioSql()) {
    const sql = await ensureStudioSchema();
    await sql`update studio_styles set category_name = ${to} where category_name = ${from} and kind = ${kind}`;
    return true;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  await supabase.from('studio_styles').update({ category_name: to }).eq('category_name', from);
  return true;
}

export async function dbUploadLook(bytes: Buffer, contentType: string) {
  return uploadLookImage(bytes, contentType);
}
