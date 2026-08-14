'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Container, SectionHeading } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

interface Overview {
  todayBookings: number;
  completedBookings: number;
  ratingAverage: number;
  ratingCount: number;
  profileViews: number;
  upcoming: Array<{
    id: string;
    reference: string;
    scheduledAt: string;
    service: { name: string };
    customer: { firstName: string };
  }>;
  popularServices: Array<{ name: string; count: number }>;
}

const nav = [
  { href: '/professional/dashboard', label: 'Overview', active: true },
  { href: '/professional/bookings', label: 'Bookings' },
  { href: '/professional/services', label: 'Services' },
  { href: '/professional/portfolio', label: 'Portfolio' },
  { href: '/professional/availability', label: 'Availability' },
  { href: '/professional/reviews', label: 'Reviews' },
  { href: '/professional/profile', label: 'Profile' },
  { href: '/professional/settings', label: 'Settings' },
];

export default function ProfessionalDashboardPage() {
  const overview = useQuery({
    queryKey: ['pro-overview'],
    queryFn: () => api<Overview>('/api/professional/overview'),
  });

  if (overview.isError) {
    return (
      <Container className="py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-paper p-10 shadow-2xl">
          <span className="font-display text-4xl text-ink">Professional Access Required</span>
          <p className="mt-3 text-sm text-muted">Sign in with a registered beauty professional account to manage your studio.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/login" variant="gold">
              Sign In to Studio Portal
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const data = overview.data;
  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Studio Control Center"
        title="Beauty Studio Overview."
        body="Monitor daily client bookings, ratings performance, and studio metrics."
      />

      {/* Navigation Tabs */}
      <nav className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/8 bg-paper p-2 shadow-sm">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              item.active
                ? 'bg-obsidian text-ivory shadow-md'
                : 'text-ink/75 hover:bg-ivory hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Today’s Bookings', value: data?.todayBookings ?? '—', icon: '📅', hint: 'Confirmed for today' },
          { label: 'Completed Services', value: data?.completedBookings ?? '—', icon: '✅', hint: 'Lifetime completed' },
          {
            label: 'Studio Rating',
            value: data ? `${data.ratingAverage.toFixed(1)} ★` : '—',
            icon: '⭐',
            hint: `${data?.ratingCount ?? 0} reviews`,
          },
          { label: 'Profile Views', value: data?.profileViews ?? '—', icon: '👁️', hint: 'Client discovery' },
        ].map((item) => (
          <div
            key={item.label}
            className="group card-elevate rounded-3xl border border-ink/8 bg-paper p-6 shadow-sm hover:border-champagne/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</span>
              <span className="text-xl">{item.icon}</span>
            </div>
            <p className="mt-4 font-display text-4.5xl font-light text-ink group-hover:text-champagneMuted transition-colors">
              {item.value}
            </p>
            <p className="mt-2 text-[11px] text-muted font-medium">{item.hint}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-16">
        <div className="flex items-center justify-between border-b border-ink/8 pb-4">
          <h2 className="font-display text-3xl font-medium text-ink">Upcoming Appointments</h2>
          <Link href="/professional/bookings" className="text-xs font-semibold uppercase tracking-wider text-champagneMuted hover:underline">
            View All Bookings →
          </Link>
        </div>

        {overview.isLoading ? (
          <div className="mt-6 space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl border border-ink/8 bg-paper p-5">
                <div className="h-4 w-1/3 rounded bg-cream/70" />
                <div className="mt-2 h-3 w-1/4 rounded bg-cream/50" />
              </div>
            ))}
          </div>
        ) : null}

        {!(data?.upcoming?.length) && !overview.isLoading ? (
          <div className="mt-6 rounded-2xl border border-ink/8 bg-paper p-8 text-center text-sm text-muted">
            No upcoming client appointments scheduled.
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {(data?.upcoming ?? []).map((b) => (
            <div
              key={b.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-ink/8 bg-paper p-5 transition-all hover:border-champagne/40 sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#8C6D14]">
                    {b.reference}
                  </span>
                  <span className="font-semibold text-ink">{b.customer.firstName}</span>
                </div>
                <p className="mt-1 font-display text-2xl font-medium text-ink">{b.service.name}</p>
              </div>
              <div className="text-xs text-muted font-medium">
                🗓 {new Date(b.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

