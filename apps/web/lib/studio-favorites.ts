export const STYLE_FAVORITES_KEY = 'luxe-style-favorites';
export const STYLE_FAVORITE_COUNTS_KEY = 'luxe-style-favorite-counts';
export const STYLE_FAVORITES_EVENT = 'luxe-favorites-changed';

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STYLE_FAVORITES_EVENT));
}

function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STYLE_FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STYLE_FAVORITE_COUNTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STYLE_FAVORITES_KEY, JSON.stringify(ids));
}

function writeCounts(counts: Record<string, number>) {
  window.localStorage.setItem(STYLE_FAVORITE_COUNTS_KEY, JSON.stringify(counts));
}

export function isStyleFavorited(styleId: string) {
  return readIds().includes(styleId);
}

export function getStyleFavoriteCount(styleId: string) {
  return Math.max(0, readCounts()[styleId] ?? 0);
}

export function listStyleFavoriteCounts() {
  return readCounts();
}

export function toggleStyleFavorite(styleId: string) {
  if (typeof window === 'undefined' || !styleId) return false;
  const ids = readIds();
  const counts = readCounts();
  const saved = ids.includes(styleId);

  if (saved) {
    writeIds(ids.filter((id) => id !== styleId));
    counts[styleId] = Math.max(0, (counts[styleId] ?? 1) - 1);
  } else {
    writeIds([...ids, styleId]);
    counts[styleId] = (counts[styleId] ?? 0) + 1;
  }

  writeCounts(counts);
  notify();
  return !saved;
}
