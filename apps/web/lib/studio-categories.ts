import { listStudioStyles, saveStudioStyles } from '@/lib/studio-styles';

export const STUDIO_CATEGORIES_KEY = 'luxe-studio-categories';
export const STUDIO_CATEGORIES_EVENT = 'luxe-categories-changed';

export type StyleKind = 'HAIR' | 'NAILS';
export type StudioCategoryMap = Record<StyleKind, string[]>;

export const DEFAULT_CATEGORIES: StudioCategoryMap = {
  HAIR: ['Protective Braids', 'Twists & Locs', 'Locs', 'Weaves', 'Cornrows'],
  NAILS: ['Nail Art', 'Nail Shapes', 'Extensions', 'Gel', 'Acrylic'],
};

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STUDIO_CATEGORIES_EVENT));
}

function cleanName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

function normalizeMap(input: Partial<StudioCategoryMap> | null): StudioCategoryMap {
  const hair = Array.isArray(input?.HAIR) ? input.HAIR.map(cleanName).filter(Boolean) : [];
  const nails = Array.isArray(input?.NAILS) ? input.NAILS.map(cleanName).filter(Boolean) : [];
  return {
    HAIR: hair.length ? Array.from(new Set(hair)) : [...DEFAULT_CATEGORIES.HAIR],
    NAILS: nails.length ? Array.from(new Set(nails)) : [...DEFAULT_CATEGORIES.NAILS],
  };
}

export function listStudioCategories(): StudioCategoryMap {
  if (typeof window === 'undefined') return { HAIR: [...DEFAULT_CATEGORIES.HAIR], NAILS: [...DEFAULT_CATEGORIES.NAILS] };
  try {
    const raw = window.localStorage.getItem(STUDIO_CATEGORIES_KEY);
    if (!raw) {
      const seeded = { HAIR: [...DEFAULT_CATEGORIES.HAIR], NAILS: [...DEFAULT_CATEGORIES.NAILS] };
      window.localStorage.setItem(STUDIO_CATEGORIES_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<StudioCategoryMap>;
    return normalizeMap(parsed);
  } catch {
    return { HAIR: [...DEFAULT_CATEGORIES.HAIR], NAILS: [...DEFAULT_CATEGORIES.NAILS] };
  }
}

export function saveStudioCategories(categories: StudioCategoryMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STUDIO_CATEGORIES_KEY, JSON.stringify(normalizeMap(categories)));
  notify();
}

async function persistCategories(categories: StudioCategoryMap, rename?: { kind: StyleKind; from: string; to: string }) {
  saveStudioCategories(categories);
  const { studioRequest } = await import('@/lib/studio-http');
  await studioRequest('/api/studio/categories', {
    method: 'PUT',
    body: JSON.stringify({ categories, rename }),
  });
}

export async function fetchStudioCategories() {
  const { studioRequest } = await import('@/lib/studio-http');
  const result = await studioRequest<{ categories?: StudioCategoryMap }>('/api/studio/categories');
  if (result.ok && result.data?.categories) {
    saveStudioCategories(result.data.categories);
    return result.data.categories;
  }
  return listStudioCategories();
}

export async function addStudioCategory(kind: StyleKind, name: string) {
  const nextName = cleanName(name);
  if (!nextName) return { ok: false, message: 'Enter a category name.' };
  const categories = listStudioCategories();
  const exists = [...categories.HAIR, ...categories.NAILS].some((item) => item.toLowerCase() === nextName.toLowerCase());
  if (exists) return { ok: false, message: 'That category already exists.' };
  categories[kind] = [...categories[kind], nextName];
  await persistCategories(categories);
  return { ok: true, name: nextName };
}

export async function renameStudioCategory(kind: StyleKind, from: string, to: string) {
  const nextName = cleanName(to);
  if (!nextName) return { ok: false, message: 'Enter a category name.' };
  const categories = listStudioCategories();
  if (!categories[kind].includes(from)) return { ok: false, message: 'Category not found.' };
  const clash = [...categories.HAIR, ...categories.NAILS].some(
    (item) => item.toLowerCase() === nextName.toLowerCase() && item !== from,
  );
  if (clash) return { ok: false, message: 'That category already exists.' };
  categories[kind] = categories[kind].map((item) => (item === from ? nextName : item));
  if (from !== nextName) {
    saveStudioStyles(
      listStudioStyles().map((style) => (style.categoryName === from ? { ...style, categoryName: nextName } : style)),
    );
  }
  await persistCategories(categories, from !== nextName ? { kind, from, to: nextName } : undefined);
  return { ok: true, name: nextName };
}

export async function deleteStudioCategory(kind: StyleKind, name: string) {
  const categories = listStudioCategories();
  if (categories[kind].length <= 1) return { ok: false, message: 'Keep at least one category for this service.' };
  const used = listStudioStyles().filter((style) => style.categoryName === name).length;
  if (used) return { ok: false, message: `${used} ${used === 1 ? 'style uses' : 'styles use'} this category. Move them first.` };
  categories[kind] = categories[kind].filter((item) => item !== name);
  await persistCategories(categories);
  return { ok: true };
}
