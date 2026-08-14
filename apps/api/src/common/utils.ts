import { createHash, randomBytes } from 'node:crypto';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function formatMoney(amountMinor: number, currency = 'GHS'): string {
  const amount = amountMinor / 100;
  return `${currency === 'GHS' ? 'GH₵' : currency}${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function generateBookingReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `NB-${suffix}`;
}

export function toE164Digits(phoneE164: string): string {
  return phoneE164.replace(/[^\d]/g, '');
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function dayOfWeekFromDate(date: Date, timeZone: string): string {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone }).format(date);
  return weekday.toUpperCase();
}

export function minutesFromMidnight(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function parsePriceFromQuery(q?: string): { cleaned: string; maxPriceMinor?: number } {
  if (!q) return { cleaned: '' };
  const match = q.match(/under\s+(\d+)/i);
  if (!match?.[1]) return { cleaned: q.trim() };
  return {
    cleaned: q.replace(/under\s+\d+/i, '').trim(),
    maxPriceMinor: Number(match[1]) * 100,
  };
}
