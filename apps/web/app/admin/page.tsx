'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';

interface Dashboard {
  totalCustomers: number;
  totalProfessionals: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingProfessionals: number;
  popularStyles: Array<{ name: string; count: number }>;
  topProfessionals: Array<{ businessName: string; ratingAverage: number }>;
}

const links = [
  ['/admin/users', 'Users'],
  ['/admin/professionals', 'Professionals'],
  ['/admin/styles', 'Styles'],
  ['/admin/categories', 'Categories'],
  ['/admin/bookings', 'Bookings'],
  ['/admin/reviews', 'Reviews'],
  ['/admin/reports', 'Reports'],
  ['/admin/audit-logs', 'Audit Logs'],
  ['/admin/settings', 'Settings'],
];

export default function AdminPage() {
  const stats = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api<Dashboard>('/api/admin/analytics'),
  });

  if (stats.isError) {
    return (
      <Container className="py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-paper p-10 shadow-2xl">
          <span className="font-display text-4xl text-ink">Administrator Access Required</span>
          <p className="mt-3 text-sm text-muted">Sign in with an administrative account to access platform analytics and controls.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/login" variant="gold">
              Sign In to Admin Console
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const d = stats.data;
  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Noir Atelier Studio Operations"
        title="Shop Owner Executive Dashboard."
        body="Manage your hair braiding & nail appointment requests, client roster, service catalog, and studio metrics."
      />

      {/* Navigation Pills */}
      <nav className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/8 bg-paper p-2 shadow-sm">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink/80 hover:bg-ivory hover:text-ink transition-all"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Analytics KPI Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Total Clients', value: d?.totalCustomers, icon: '👥', hint: 'Active customer accounts' },
          { label: 'Beauty Studios', value: d?.totalProfessionals, icon: '✂️', hint: 'Registered professionals' },
          { label: 'Gross Bookings', value: d?.totalBookings, icon: '📈', hint: 'Lifetime appointment requests' },
          { label: 'Completed Services', value: d?.completedBookings, icon: '✅', hint: 'Fulfilled appointments' },
          { label: 'Cancelled Appointments', value: d?.cancelledBookings, icon: '🚫', hint: 'Cancelled by client/pro' },
          { label: 'Pending Studio Reviews', value: d?.pendingProfessionals, icon: '⏳', hint: 'Awaiting verification' },
        ].map((item) => (
          <div
            key={item.label}
            className="group card-elevate rounded-3xl border border-ink/8 bg-paper p-6 shadow-sm hover:border-champagne/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</span>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <p className="mt-4 font-display text-5xl font-light text-ink group-hover:text-champagneMuted transition-colors">
              {item.value ?? '—'}
            </p>
            <p className="mt-2 text-xs text-muted font-medium">{item.hint}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

