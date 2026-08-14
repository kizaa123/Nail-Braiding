'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api, formatCedis } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';

interface BookingRow {
  id: string;
  reference: string;
  status: string;
  scheduledAt: string;
  priceMinor: number;
  whatsappUrl?: string | null;
  service: { name: string };
  professional: { businessName: string; slug: string };
}

export default function BookingsPage() {
  const bookings = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api<{ data: BookingRow[] }>('/api/bookings'),
  });

  const rows = bookings.data?.data ?? [];

  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="My Atelier Schedule"
        title="Your appointments."
        body="Manage your confirmed salon visits, WhatsApp references, and booking details."
      />

      {bookings.isError ? (
        <div className="rounded-3xl border border-ink/10 bg-paper p-10 text-center">
          <p className="font-display text-3xl text-ink">Authentication Required</p>
          <p className="mt-2 text-sm text-muted">Please sign in to your Noir Atelier account to view your salon appointments.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/login" variant="gold">
              Sign In to Atelier
            </Button>
          </div>
        </div>
      ) : null}

      {bookings.isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse rounded-3xl border border-ink/8 bg-paper p-6">
              <div className="h-4 w-32 rounded bg-cream/70" />
              <div className="mt-3 h-6 w-1/2 rounded bg-cream/70" />
              <div className="mt-2 h-4 w-1/3 rounded bg-cream/50" />
            </div>
          ))}
        </div>
      ) : null}

      {bookings.isSuccess && rows.length === 0 ? (
        <div className="rounded-3xl border border-ink/8 bg-paper py-16 text-center">
          <p className="font-display text-3xl text-ink">No appointments booked yet</p>
          <p className="mt-2 text-sm text-muted">Explore signature braid and nail looks to schedule your first salon visit.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/discover" variant="gold">
              Explore Lookbook
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {rows.map((booking) => (
          <article
            key={booking.id}
            className="group card-elevate flex flex-col justify-between gap-6 rounded-3xl border border-ink/8 bg-paper p-6 shadow-sm hover:border-champagne/40 md:flex-row md:items-center md:p-8"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-champagne/15 px-3 py-1 font-mono text-xs font-bold text-[#8C6D14]">
                  Ref: {booking.reference}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-emerald/10 text-emerald'
                      : booking.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-ink/10 text-ink/70'
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl font-medium text-ink group-hover:text-champagneMuted transition-colors">
                {booking.service.name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                  Studio:{' '}
                  <Link href={`/professionals/${booking.professional.slug}`} className="font-semibold text-ink hover:underline">
                    {booking.professional.businessName}
                  </Link>
                </span>
                <span>·</span>
                <span>📅 {new Date(booking.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <span>·</span>
                <span className="font-semibold text-ink text-sm">{formatCedis(booking.priceMinor)}</span>
              </div>
            </div>

            {booking.whatsappUrl ? (
              <Button href={booking.whatsappUrl} variant="whatsapp" className="shrink-0">
                💬 Open WhatsApp Chat
              </Button>
            ) : null}
          </article>
        ))}
      </div>
    </Container>
  );
}

