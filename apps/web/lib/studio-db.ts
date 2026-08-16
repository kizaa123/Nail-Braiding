import type { StudioBooking } from '@/lib/studio-bookings';
import type { StudioCategoryMap } from '@/lib/studio-categories';
import { slugifyStyleName, type StyleDraft, type StudioStyle } from '@/lib/studio-styles';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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
  updated_at: string;
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
  created_at: string;
};

export function mapStyle(row: StyleRow): StudioStyle {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: row.kind,
    categoryName: row.category_name,
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    startingPriceMinor: row.starting_price_minor,
    durationMinutes: row.duration_minutes,
    location: row.location || 'Cape Coast, UCC Campus',
    artistIds: row.artist_ids ?? [],
    tags: row.tags ?? [],
    featured: row.featured,
    published: row.published,
    archived: row.archived,
    updatedAt: row.updated_at,
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
    durationMinutes: row.duration_minutes,
    priceMinor: row.price_minor,
    scheduledAt: row.scheduled_at,
    scheduledDate: row.scheduled_date ?? undefined,
    scheduledTime: row.scheduled_time ?? undefined,
    notes: row.notes ?? '',
    destination: row.destination,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function uniqueSlug(name: string, ignoreId?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return slugifyStyleName(name);
  const base = slugifyStyleName(name);
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
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  let query = supabase.from('studio_styles').select('*').order('updated_at', { ascending: false });
  if (scope === 'public') {
    query = query.eq('published', true).eq('archived', false);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as StyleRow[]).map(mapStyle);
}

export async function dbUpsertStyle(draft: StyleDraft & { id?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
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

  if (draft.id) {
    const updateRow = { ...row, ...(draft.published ? { archived: false } : {}) };
    const { data, error } = await supabase
      .from('studio_styles')
      .update(updateRow)
      .eq('id', draft.id)
      .select('*')
      .single();
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
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
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
  const { data, error } = await supabase.from('studio_styles').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapStyle(data as StyleRow);
}

export async function dbDeleteStyle(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error } = await supabase.from('studio_styles').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbListBookings() {
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
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  if (booking.destination === 'WHATSAPP') return booking;
  const { data, error } = await supabase
    .from('studio_bookings')
    .insert({
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
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapBooking(data as BookingRow);
}

export async function dbPatchBooking(id: string, patch: Partial<StudioBooking>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.clientName !== undefined) row.client_name = patch.clientName;
  if (patch.notes !== undefined) row.notes = patch.notes;
  const { data, error } = await supabase.from('studio_bookings').update(row).eq('id', id).select('*').single();
  if (error) throw error;
  return mapBooking(data as BookingRow);
}

export async function dbDeleteBooking(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { error } = await supabase.from('studio_bookings').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbListCategories(): Promise<StudioCategoryMap | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from('studio_categories').select('*');
  if (error) throw error;
  const map: StudioCategoryMap = { HAIR: [], NAILS: [] };
  for (const row of data ?? []) {
    if (row.kind === 'HAIR' || row.kind === 'NAILS') {
      map[row.kind] = Array.isArray(row.names) ? row.names : [];
    }
  }
  return map;
}

export async function dbSaveCategories(categories: StudioCategoryMap) {
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
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  await supabase.from('studio_styles').update({ category_name: to }).eq('category_name', from);
  return true;
}

export async function dbUploadLook(bytes: Buffer, contentType: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('studio-looks').upload(path, bytes, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('studio-looks').getPublicUrl(path);
  return data.publicUrl;
}
