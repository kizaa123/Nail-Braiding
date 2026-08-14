'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

interface SessionUser {
  id: string;
  email: string;
  role: string;
  customerProfileId?: string;
  professionalProfileId?: string;
}

export default function AccountPage() {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => api<SessionUser>('/api/auth/me'),
  });

  if (me.isLoading) {
    return (
      <Container className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-champagne border-t-transparent" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Loading Atelier Portal…</p>
      </Container>
    );
  }

  if (me.isError) {
    return (
      <div className="ambient-glow py-20">
        <Container className="max-w-lg text-center">
          <div className="rounded-3xl border border-ink/10 bg-paper p-10 shadow-2xl">
            <span className="font-display text-5xl text-ink">Sign In Required</span>
            <p className="mt-4 text-sm text-muted">Please sign in to access your appointments, saved lookbooks, and salon bookings.</p>
            <div className="mt-8 flex justify-center">
              <Button href="/login" variant="gold">
                Sign In to Atelier
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const user = me.data!;
  return (
    <Container className="py-12 md:py-20">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-ink/10 bg-paper p-8 shadow-sm backdrop-blur-md md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-espresso to-obsidian font-display text-3xl font-light text-champagne shadow-md">
              {user.email.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-champagne/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6D14]">
                  {user.role}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
              </div>
              <h1 className="mt-1 font-display text-3xl font-medium text-ink md:text-4xl">{user.email}</h1>
              <p className="text-xs text-muted">Noir Atelier Member Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await api('/api/auth/logout', { method: 'POST' });
              window.location.href = '/';
            }}
            className="self-start rounded-full border border-rose/30 bg-rose/10 px-5 py-2 text-xs font-semibold text-rose hover:bg-rose/20 transition-all md:self-auto"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/bookings"
          className="group card-elevate rounded-3xl border border-ink/8 bg-paper p-8 shadow-sm hover:border-champagne/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl text-champagneMuted">
            📅
          </div>
          <h3 className="mt-5 font-display text-2.5xl font-medium text-ink group-hover:text-champagneMuted transition-colors">
            My Appointments
          </h3>
          <p className="mt-2 text-xs text-muted">View upcoming hair & nail salon appointments and WhatsApp reference codes.</p>
          <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-ink group-hover:underline">
            View Bookings →
          </span>
        </Link>

        <Link
          href="/favorites"
          className="group card-elevate rounded-3xl border border-ink/8 bg-paper p-8 shadow-sm hover:border-champagne/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl text-champagneMuted">
            ♥️
          </div>
          <h3 className="mt-5 font-display text-2.5xl font-medium text-ink group-hover:text-champagneMuted transition-colors">
            Saved Lookbook
          </h3>
          <p className="mt-2 text-xs text-muted">Access your bookmarked braid styles, nail shapes, and favorite stylists.</p>
          <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-ink group-hover:underline">
            View Favorites →
          </span>
        </Link>

        {user.role === 'PROFESSIONAL' ? (
          <Link
            href="/professional/dashboard"
            className="group card-elevate rounded-3xl border border-champagne/40 bg-gradient-to-br from-paper to-champagne/5 p-8 shadow-sm hover:border-champagne"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-obsidian text-xl text-champagne">
              ✂️
            </div>
            <h3 className="mt-5 font-display text-2.5xl font-medium text-ink group-hover:text-champagneMuted transition-colors">
              Beauty Pro Portal
            </h3>
            <p className="mt-2 text-xs text-muted">Manage studio services, portfolio photos, working hours, and bookings.</p>
            <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-ink group-hover:underline">
              Open Dashboard →
            </span>
          </Link>
        ) : null}

        {user.role === 'ADMIN' ? (
          <Link
            href="/admin"
            className="group card-elevate rounded-3xl border border-obsidian/20 bg-obsidian text-ivory p-8 shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-champagne">
              🛡️
            </div>
            <h3 className="mt-5 font-display text-2.5xl font-medium text-ivory">
              Admin Platform Suite
            </h3>
            <p className="mt-2 text-xs text-ivory/70">Access system metrics, revenue reports, user accounts, and studio approvals.</p>
            <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-champagne group-hover:underline">
              Open Admin Suite →
            </span>
          </Link>
        ) : null}
      </div>
    </Container>
  );
}

