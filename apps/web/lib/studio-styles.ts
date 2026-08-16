import { type StaticStyle } from '@/lib/content';

export const STUDIO_STYLES_KEY = 'luxe-studio-styles-v2';
export const STUDIO_STYLES_EVENT = 'luxe-styles-changed';

export const STYLE_CATEGORIES: Record<'HAIR' | 'NAILS', string[]> = {
  HAIR: ['Protective Braids', 'Twists & Locs', 'Locs', 'Weaves', 'Cornrows'],
  NAILS: ['Nail Art', 'Nail Shapes', 'Extensions', 'Gel', 'Acrylic'],
};

export const STUDIO_ARTISTS = [
  { id: 'ama', name: 'Ama Boateng', specialty: 'Hair' },
  { id: 'efua', name: 'Efua Mensah', specialty: 'Hair' },
  { id: 'akosua', name: 'Akosua Adjei', specialty: 'Nails' },
  { id: 'yaa', name: 'Yaa Owusu', specialty: 'Nails' },
] as const;

export interface StudioStyle extends StaticStyle {
  location: string;
  artistIds: string[];
  featured: boolean;
  published: boolean;
  archived: boolean;
  updatedAt: string;
}

export type StyleDraft = {
  id?: string;
  name: string;
  kind: 'HAIR' | 'NAILS';
  categoryName: string;
  description: string;
  imageUrl: string;
  startingPriceMinor: number;
  durationMinutes: number;
  location: string;
  artistIds: string[];
  featured: boolean;
  published: boolean;
};

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_STYLES_EVENT));
}

export function slugifyStyleName(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'style';
}

function normalize(row: Partial<StudioStyle> & StaticStyle): StudioStyle {
  return {
    ...row,
    location: row.location?.trim() || 'Cape Coast, UCC Campus',
    artistIds: Array.isArray(row.artistIds) ? row.artistIds : [],
    featured: Boolean(row.featured),
    published: row.published !== false,
    archived: Boolean(row.archived),
    updatedAt: row.updatedAt ?? new Date().toISOString(),
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export function listStudioStyles(): StudioStyle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STUDIO_STYLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioStyle[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) => normalize(row));
  } catch {
    return [];
  }
}

export function listPublicStyles(): StudioStyle[] {
  return listStudioStyles()
    .filter((style) => style.published && !style.archived)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt));
}

export function saveStudioStyles(styles: StudioStyle[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_STYLES_KEY, JSON.stringify(styles));
  notify();
}

export function uniqueStyleSlug(name: string, ignoreId?: string) {
  const existing = listStudioStyles();
  const base = slugifyStyleName(name);
  let slug = base;
  let n = 2;
  while (existing.some((style) => style.slug === slug && style.id !== ignoreId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export function upsertStudioStyleLocal(draft: StyleDraft) {
  const styles = listStudioStyles();
  const now = new Date().toISOString();
  if (draft.id) {
    const next = styles.map((style) =>
      style.id === draft.id
        ? {
            ...style,
            name: draft.name.trim(),
            slug: uniqueStyleSlug(draft.name, draft.id),
            kind: draft.kind,
            categoryName: draft.categoryName.trim(),
            description: draft.description.trim(),
            imageUrl: draft.imageUrl,
            startingPriceMinor: draft.startingPriceMinor,
            durationMinutes: draft.durationMinutes,
            location: draft.location.trim() || 'Cape Coast, UCC Campus',
            artistIds: draft.artistIds,
            featured: draft.featured,
            published: draft.published,
            archived: draft.published ? false : style.archived,
            tags: style.tags,
            updatedAt: now,
          }
        : style,
    );
    saveStudioStyles(next);
    return next.find((style) => style.id === draft.id)!;
  }

  const created: StudioStyle = {
    id: crypto.randomUUID(),
    slug: uniqueStyleSlug(draft.name),
    name: draft.name.trim(),
    kind: draft.kind,
    categoryName: draft.categoryName.trim(),
    description: draft.description.trim(),
    imageUrl: draft.imageUrl,
    startingPriceMinor: draft.startingPriceMinor,
    durationMinutes: draft.durationMinutes,
    location: draft.location.trim() || 'Cape Coast, UCC Campus',
    artistIds: draft.artistIds,
    featured: draft.featured,
    published: draft.published,
    archived: false,
    tags: [],
    updatedAt: now,
  };
  saveStudioStyles([created, ...styles]);
  return created;
}

export function patchStudioStyleLocal(id: string, patch: Partial<StudioStyle>) {
  const next = listStudioStyles().map((style) =>
    style.id === id ? { ...style, ...patch, updatedAt: new Date().toISOString() } : style,
  );
  saveStudioStyles(next);
}

export function archiveStudioStyleLocal(id: string) {
  patchStudioStyleLocal(id, { archived: true, published: false });
}

export function restoreStudioStyleLocal(id: string) {
  patchStudioStyleLocal(id, { archived: false });
}

export function deleteStudioStyleLocal(id: string) {
  saveStudioStyles(listStudioStyles().filter((style) => style.id !== id));
}

export function artistNames(ids: string[]) {
  return STUDIO_ARTISTS.filter((artist) => ids.includes(artist.id)).map((artist) => artist.name);
}

async function compressStyleFile(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const max = 900;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not read image');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Could not compress image'))), 'image/jpeg', 0.82);
    });
    return blob;
  } catch {
    return file;
  }
}

export async function fileToStyleImage(file: File) {
  const blob = await compressStyleFile(file);
  const { studioRequest, cloudMissing } = await import('@/lib/studio-http');
  const form = new FormData();
  form.append('file', blob, `${file.name ? file.name.replace(/\.[^.]+$/, '') : 'look'}.jpg`);
  const result = await studioRequest<{ url?: string }>('/api/studio/upload', { method: 'POST', body: form });
  if (result.ok && result.data?.url) return result.data.url;
  if (!cloudMissing(result.status)) {
    throw new Error((result.data as { error?: string } | null)?.error || 'Could not upload photo.');
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}

function mergeStyle(style: StudioStyle) {
  const styles = listStudioStyles().filter((item) => item.id !== style.id);
  saveStudioStyles([style, ...styles]);
}

export async function fetchStudioStyles() {
  const { studioRequest } = await import('@/lib/studio-http');
  const result = await studioRequest<{ styles?: StudioStyle[] }>('/api/studio/styles?scope=all');
  if (result.ok && Array.isArray(result.data?.styles)) {
    saveStudioStyles(result.data.styles);
    return result.data.styles;
  }
  return listStudioStyles();
}

export async function upsertStudioStyle(draft: StyleDraft) {
  const { studioRequest, cloudMissing } = await import('@/lib/studio-http');
  const result = await studioRequest<{ style?: StudioStyle }>('/api/studio/styles', {
    method: 'POST',
    body: JSON.stringify(draft),
  });
  if (result.ok && result.data?.style) {
    mergeStyle(result.data.style);
    return result.data.style;
  }
  if (!cloudMissing(result.status) && result.status !== 401) {
    throw new Error((result.data as { error?: string } | null)?.error || 'Could not save look.');
  }
  return upsertStudioStyleLocal(draft);
}

export async function patchStudioStyle(id: string, patch: Partial<StudioStyle>) {
  const { studioRequest, cloudMissing } = await import('@/lib/studio-http');
  const result = await studioRequest<{ style?: StudioStyle }>(`/api/studio/styles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (result.ok && result.data?.style) {
    mergeStyle(result.data.style);
    return result.data.style;
  }
  if (!cloudMissing(result.status) && result.status !== 401) {
    throw new Error((result.data as { error?: string } | null)?.error || 'Could not update look.');
  }
  patchStudioStyleLocal(id, patch);
}

export async function archiveStudioStyle(id: string) {
  await patchStudioStyle(id, { archived: true, published: false });
}

export async function restoreStudioStyle(id: string) {
  await patchStudioStyle(id, { archived: false });
}

export async function deleteStudioStyle(id: string) {
  const { studioRequest, cloudMissing } = await import('@/lib/studio-http');
  const result = await studioRequest(`/api/studio/styles/${id}`, { method: 'DELETE' });
  if (result.ok || cloudMissing(result.status) || result.status === 401) {
    deleteStudioStyleLocal(id);
    return;
  }
  throw new Error((result.data as { error?: string } | null)?.error || 'Could not delete look.');
}
