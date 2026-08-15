'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { formatCedis } from '@/lib/api';
import { CatalogImage } from '@/components/ui/catalog-image';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';
import { useStudioBookings } from '@/hooks/use-studio-bookings';
import { Stagger } from '@/components/motion/reveal';
import {
  formatBookingDuration,
  formatBookingTime,
  formatBookingWhen,
  type BookingStatus,
} from '@/lib/studio-bookings';

const PREVIEW = 4;

function compactDate(booking: { scheduledAt?: string; scheduledDate?: string; scheduledTime?: string }) {
  if (booking.scheduledDate) {
    const [year, month, day] = booking.scheduledDate.split('-').map(Number);
    if (year && month && day) {
      return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
        new Date(year, month - 1, day),
      );
    }
  }
  return formatBookingWhen(booking).day;
}

function compactTime(booking: { scheduledTime?: string; scheduledAt?: string; scheduledDate?: string }) {
  if (booking.scheduledTime) return formatBookingTime(booking.scheduledTime);
  return formatBookingWhen(booking).time;
}

function statusLabel(status: BookingStatus) {
  if (status === 'WAITING') return 'Pending';
  if (status === 'APPROVED') return 'Waiting';
  if (status === 'SERVED') return 'Served';
  return 'Declined';
}

function statusClass(status: BookingStatus) {
  if (status === 'WAITING') return 'bg-[#C9A46A]/15 text-[#8C6D14]';
  if (status === 'APPROVED') return 'bg-[#D98282]/15 text-[#D98282]';
  if (status === 'SERVED') return 'bg-[#2D6A4F]/12 text-[#2D6A4F]';
  return 'bg-black/5 text-[#7A6E68]';
}

export default function AdminPage() {
  const { styles, ready } = useStudioCatalog();
  const { bookings, ready: bookingsReady } = useStudioBookings();

  const catalog = useMemo(() => {
    const live = styles.filter((style) => style.published && !style.archived).length;
    const drafts = styles.filter((style) => !style.published && !style.archived).length;
    const featured = styles.filter((style) => style.featured && !style.archived).length;
    return { live, drafts, featured, total: styles.length };
  }, [styles]);

  const recentPublished = useMemo(
    () =>
      styles
        .filter((style) => style.published && !style.archived)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, PREVIEW),
    [styles],
  );

  const recentBookings = useMemo(() => bookings.slice(0, PREVIEW), [bookings]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D98282]">Welcome back</p>
        <h2 className="mt-1 font-display text-4xl text-[#171211]">Studio overview</h2>
        <p className="mt-2 max-w-xl text-sm text-[#A99B95]">
          Manage the lookbook and incoming appointments from this portal.
        </p>
      </div>

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Live styles', value: ready ? catalog.live : '—' },
          { label: 'Drafts', value: ready ? catalog.drafts : '—' },
          { label: 'Featured', value: ready ? catalog.featured : '—' },
          { label: 'Incoming bookings', value: bookingsReady ? bookings.length : '—' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-[0_8px_24px_rgba(23,18,17,0.04)] transition-transform duration-300 hover:-translate-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A99B95]">{item.label}</p>
            <p className="mt-3 font-display text-4xl text-[#171211]">{item.value}</p>
          </div>
        ))}
      </Stagger>

      <Stagger className="grid gap-4 md:grid-cols-2" delay={0.08}>
        <div className="rounded-2xl border border-[#EADBCE] bg-white p-6 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Atelier</p>
          <h3 className="mt-2 font-display text-3xl text-[#171211]">Lookbook catalog</h3>
          <p className="mt-2 text-sm text-[#A99B95]">Recently published looks.</p>

          <div className="mt-4 space-y-3">
            {!ready ? (
              <p className="text-sm text-[#A99B95]">Loading looks…</p>
            ) : recentPublished.length === 0 ? (
              <p className="text-sm text-[#A99B95]">No published looks yet.</p>
            ) : (
              recentPublished.map((style) => (
                <div key={style.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F7F1EA]">
                    <CatalogImage src={style.imageUrl} alt={style.name} className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#171211]">{style.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#A99B95]">
                      {style.kind === 'HAIR' ? 'Hair' : 'Nails'} · {style.categoryName} · {formatBookingDuration(style.durationMinutes)}
                      {style.featured ? ' · Featured' : ''}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#D98282]">{formatCedis(style.startingPriceMinor)}</p>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/styles"
            className="mt-4 inline-flex text-xs font-bold uppercase tracking-widest text-[#D98282] hover:underline"
          >
            View more
          </Link>
        </div>

        <div className="rounded-2xl border border-[#EADBCE] bg-white p-6 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A46A]">Board</p>
          <h3 className="mt-2 font-display text-3xl text-[#171211]">Incoming bookings</h3>
          <p className="mt-2 text-sm text-[#A99B95]">Latest client reservations.</p>

          <div className="mt-4 space-y-3">
            {!bookingsReady ? (
              <p className="text-sm text-[#A99B95]">Loading bookings…</p>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-[#A99B95]">No bookings yet.</p>
            ) : (
              recentBookings.map((booking) => {
                const time = compactTime(booking);
                return (
                  <div key={booking.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F7F1EA]">
                      <CatalogImage src={booking.imageUrl} alt={booking.styleName} className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#171211]">{booking.styleName}</p>
                      <p className="mt-0.5 truncate text-[11px] text-[#A99B95]">
                        {booking.clientName}
                        {booking.clientPhone ? ` · ${booking.clientPhone}` : ''}
                        {booking.location ? ` · ${booking.location}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium text-[#171211]">{compactDate(booking)}</p>
                      {time ? <p className="text-[11px] text-[#A99B95]">{time}</p> : null}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${statusClass(booking.status)}`}>
                      {statusLabel(booking.status)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/admin/bookings"
            className="mt-4 inline-flex text-xs font-bold uppercase tracking-widest text-[#C9A46A] hover:underline"
          >
            View more
          </Link>
        </div>
      </Stagger>
    </div>
  );
}
