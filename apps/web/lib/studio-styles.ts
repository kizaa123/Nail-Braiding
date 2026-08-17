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

export function allowLocalCatalog() {
  if (typeof window === 'undefined') return false;
  return /localhost|127\.0\.0\.1/.test(window.location.hostname);
}

export const CLOUD_REQUIRED_MESSAGE =
  'Shared catalog is not connected. Check DATABASE_URL on Vercel, redeploy, then sign in on the live site and save the look again.';

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_STYLES_EVENT));
}

export function isPublicLookImageUrl(url: string | null | undefined) {
  const raw = url?.trim() ?? '';
  if (!raw || raw.startsWith('data:') || raw.includes('/look-image/')) return false;
  return /^https?:\/\//i.test(raw);
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

function compactCatalog(styles: StudioStyle[]) {
  return styles.map((style) => ({
    ...style,
    imageUrl: isPublicLookImageUrl(style.imageUrl)
      ? style.imageUrl.trim()
      : allowLocalCatalog()
        ? style.imageUrl
        : '',
  }));
}

function cacheStudioStyles(styles: StudioStyle[], emitEvent: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STUDIO_STYLES_KEY, JSON.stringify(compactCatalog(styles)));
  } catch {
    try {
      const compact = styles.map((style) => ({
        ...style,
        imageUrl: isPublicLookImageUrl(style.imageUrl) ? style.imageUrl.trim() : '',
      }));
      window.localStorage.setItem(STUDIO_STYLES_KEY, JSON.stringify(compact));
    } catch {
      /* ignore quota */
    }
  }
  if (emitEvent) notify();
}

export function saveStudioStyles(styles: StudioStyle[]) {
  cacheStudioStyles(styles, true);
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
    return new File([blob], 'look.jpg', { type: 'image/jpeg' });
  } catch {
    if (/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      return new File([file], 'look.jpg', { type: file.type === 'image/png' ? 'image/png' : 'image/jpeg' });
    }
    throw new Error('Could not read that photo. Try a JPG or PNG.');
  }
}

export async function fileToStyleImage(file: File) {
  const jpeg = await compressStyleFile(file);
  const { studioRequest, cloudMissing, requestError } = await import('@/lib/studio-http');
  const form = new FormData();
  form.append('file', jpeg, 'look.jpg');
  let result = await studioRequest<{ url?: string; error?: string; cloud?: boolean }>('/api/studio/upload', {
    method: 'POST',
    body: form,
    timeoutMs: 45000,
  });
  if (!result.ok) {
    result = await studioRequest<{ url?: string; error?: string; cloud?: boolean }>('/api/studio/upload', {
      method: 'POST',
      body: form,
      timeoutMs: 45000,
    });
  }
  const uploadedUrl = result.data?.url ?? '';
  if (result.ok && isPublicLookImageUrl(uploadedUrl)) return uploadedUrl.trim();
  if (cloudMissing(result.status, result.data) && allowLocalCatalog()) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read image'));
      reader.readAsDataURL(jpeg);
    });
  }
  throw new Error(requestError(result, 'Could not upload that photo. Sign in again and retry.'));
}

function mergeStyle(style: StudioStyle) {
  const styles = listStudioStyles().filter((item) => item.id !== style.id);
  saveStudioStyles([style, ...styles]);
}

export async function fetchStudioStyles() {
  const { studioRequest } = await import('@/lib/studio-http');
  const session = await import('@/lib/studio-session');
  const admin = Boolean(session.readStudioWriteToken() || session.readStudioSession());
  const result = await studioRequest<{ styles?: StudioStyle[]; cloud?: boolean }>(
    admin ? '/api/studio/styles?scope=all' : '/api/studio/styles',
  );
  if (result.ok && Array.isArray(result.data?.styles)) {
    cacheStudioStyles(result.data.styles, false);
    return result.data.styles;
  }
  if (!allowLocalCatalog()) return [];
  return listStudioStyles();
}

export async function studioCloudEnabled() {
  const { studioRequest } = await import('@/lib/studio-http');
  const result = await studioRequest<{ cloud?: boolean }>('/api/studio/health');
  return Boolean(result.ok && result.data?.cloud);
}

async function dataUrlToFile(dataUrl: string, name: string) {
  const match = dataUrl.match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const binary = atob(match[2].replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const type = match[1];
  const ext = type.split('/')[1]?.split('+')[0] || 'jpg';
  return new File([bytes], `${name}.${ext}`, { type });
}

async function uploadLocalImage(imageUrl: string) {
  if (isPublicLookImageUrl(imageUrl)) return imageUrl.trim();
  if (!imageUrl.startsWith('data:image/')) return '';
  const file = await dataUrlToFile(imageUrl, 'look');
  if (!file) return '';
  const jpeg = await compressStyleFile(file).catch(() => new File([file], 'look.jpg', { type: file.type || 'image/jpeg' }));
  const { studioRequest } = await import('@/lib/studio-http');
  const form = new FormData();
  form.append('file', jpeg, 'look.jpg');
  const uploaded = await studioRequest<{ url?: string }>('/api/studio/upload', {
    method: 'POST',
    body: form,
    timeoutMs: 45000,
  });
  const uploadedUrl = uploaded.data?.url ?? '';
  return isPublicLookImageUrl(uploadedUrl) ? uploadedUrl.trim() : '';
}

export async function syncLocalStylesToCloud(localSnapshot?: StudioStyle[]) {
  if (!(await studioCloudEnabled())) return { cloud: false, synced: 0 };
  const { studioRequest } = await import('@/lib/studio-http');
  const remoteRes = await studioRequest<{ styles?: StudioStyle[] }>('/api/studio/styles?scope=all');
  if (!remoteRes.ok) return { cloud: true, synced: 0 };
  const remote = remoteRes.data?.styles ?? [];
  const remoteById = new Map(remote.map((style) => [style.id, style]));
  const remoteBySlug = new Map(remote.map((style) => [style.slug, style]));
  const local = localSnapshot?.length ? localSnapshot : listStudioStyles();
  let synced = 0;

  for (const style of local) {
    const existing = remoteById.get(style.id) ?? remoteBySlug.get(style.slug);
    const remoteHasPhoto = isPublicLookImageUrl(existing?.imageUrl);
    const localHasPhoto = isPublicLookImageUrl(style.imageUrl) || style.imageUrl.startsWith('data:');

    if (existing && remoteHasPhoto) continue;

    const imageUrl = localHasPhoto ? await uploadLocalImage(style.imageUrl) : '';
    if (existing) {
      if (!imageUrl) continue;
      const saved = await studioRequest<{ style?: StudioStyle }>(`/api/studio/styles/${existing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ imageUrl }),
        timeoutMs: 30000,
      });
      if (saved.ok) synced += 1;
      continue;
    }

    const saved = await studioRequest<{ style?: StudioStyle }>('/api/studio/styles', {
      method: 'POST',
      body: JSON.stringify({
        name: style.name,
        kind: style.kind,
        categoryName: style.categoryName,
        description: style.description,
        imageUrl,
        startingPriceMinor: style.startingPriceMinor,
        durationMinutes: style.durationMinutes,
        location: style.location,
        artistIds: style.artistIds,
        featured: style.featured,
        published: style.published,
      }),
      timeoutMs: 30000,
    });
    if (saved.ok) synced += 1;
  }
  if (synced) await fetchStudioStyles();
  return { cloud: true, synced };
}

async function durableDraft(draft: StyleDraft): Promise<StyleDraft> {
  const imageUrl = draft.imageUrl?.trim() ?? '';
  if (!imageUrl || isPublicLookImageUrl(imageUrl)) return { ...draft, imageUrl };
  if (imageUrl.startsWith('data:image/')) {
    const file = await dataUrlToFile(imageUrl, 'look');
    if (!file) throw new Error('Could not read that photo. Choose the image again.');
    return { ...draft, imageUrl: await fileToStyleImage(file) };
  }
  return draft;
}

export async function upsertStudioStyle(draft: StyleDraft) {
  const payload = await durableDraft(draft);
  const { studioRequest, cloudMissing, requestError } = await import('@/lib/studio-http');
  let result = await studioRequest<{ style?: StudioStyle; error?: string; cloud?: boolean }>('/api/studio/styles', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 45000,
  });
  if (!result.ok && result.status === 0) {
    result = await studioRequest<{ style?: StudioStyle; error?: string; cloud?: boolean }>('/api/studio/styles', {
      method: 'POST',
      body: JSON.stringify(payload),
      timeoutMs: 45000,
    });
  }
  if (result.ok && result.data?.style) {
    mergeStyle(result.data.style);
    return result.data.style;
  }
  if (cloudMissing(result.status, result.data) && allowLocalCatalog()) {
    return upsertStudioStyleLocal(payload);
  }
  throw new Error(requestError(result, 'Could not save this look. Sign in again and try once more.'));
}

export async function patchStudioStyle(id: string, patch: Partial<StudioStyle>) {
  const nextPatch = { ...patch };
  if (typeof nextPatch.imageUrl === 'string' && nextPatch.imageUrl.startsWith('data:image/')) {
    const file = await dataUrlToFile(nextPatch.imageUrl, 'look');
    if (!file) throw new Error('Could not read that photo. Choose the image again.');
    nextPatch.imageUrl = await fileToStyleImage(file);
  }
  const { studioRequest, cloudMissing, requestError } = await import('@/lib/studio-http');
  const result = await studioRequest<{ style?: StudioStyle; error?: string; cloud?: boolean }>(`/api/studio/styles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(nextPatch),
    timeoutMs: 45000,
  });
  if (result.ok && result.data?.style) {
    mergeStyle(result.data.style);
    return result.data.style;
  }
  if (cloudMissing(result.status, result.data) && allowLocalCatalog()) {
    patchStudioStyleLocal(id, patch);
    return;
  }
  throw new Error(requestError(result, 'Could not update this look. Sign in again and try once more.'));
}

export async function archiveStudioStyle(id: string) {
  await patchStudioStyle(id, { archived: true, published: false });
}

export async function restoreStudioStyle(id: string) {
  await patchStudioStyle(id, { archived: false });
}

export async function deleteStudioStyle(id: string) {
  const { studioRequest, cloudMissing } = await import('@/lib/studio-http');
  const result = await studioRequest<{ error?: string; cloud?: boolean }>(`/api/studio/styles/${id}`, { method: 'DELETE' });
  if (result.ok) {
    deleteStudioStyleLocal(id);
    return;
  }
  if (cloudMissing(result.status, result.data) && allowLocalCatalog()) {
    deleteStudioStyleLocal(id);
    return;
  }
  throw new Error(result.data?.error || CLOUD_REQUIRED_MESSAGE);
}
