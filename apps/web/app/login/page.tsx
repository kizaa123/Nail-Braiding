'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import {
  pathForRole,
  saveStudioSession,
  saveStudioWriteToken,
  signInStudioOwner,
} from '@/lib/studio-session';
import { StudioLogo } from '@/components/brand/studio-logo';

type LoginUser = {
  email: string;
  role: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="ambient-glow py-16 md:py-24">
      <Container className="max-w-lg">
        <div className="rounded-3xl border border-ink/10 bg-paper/90 p-5 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="text-center">
            <StudioLogo href="/" size="md" mottoTone="dark" className="mx-auto" />
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
              Studio Owner Sign In
            </span>
            <h1 className="mt-4 font-display text-3xl font-normal text-ink md:text-5xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to manage the atelier and bookings. Customers book as guests — no sign-in required.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setPending(true);
              const form = new FormData(e.currentTarget);
              const email = String(form.get('email') ?? '');
              const password = String(form.get('password') ?? '');

              try {
                const sessionRes = await fetch('/api/studio/session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ email, password }),
                }).catch(() => null);
                const sessionBody = (await sessionRes?.json().catch(() => null)) as {
                  token?: string;
                  user?: LoginUser;
                } | null;
                if (sessionRes?.ok && sessionBody?.user) {
                  if (sessionBody.token) saveStudioWriteToken(sessionBody.token);
                  saveStudioSession({
                    email: sessionBody.user.email,
                    role: sessionBody.user.role === 'PROFESSIONAL' ? 'PROFESSIONAL' : 'ADMIN',
                    signedInAt: new Date().toISOString(),
                  });
                  router.push(pathForRole(sessionBody.user.role));
                  router.refresh();
                  return;
                }

                const local = signInStudioOwner(email, password);
                if (local) {
                  setError('Could not start a save session. Check your connection, then sign in again.');
                  return;
                }

                const result = await api<{ user: LoginUser }>('/api/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({ email, password }),
                });
                if (result.user.role === 'ADMIN' || result.user.role === 'PROFESSIONAL') {
                  saveStudioSession({
                    email: result.user.email,
                    role: result.user.role,
                    signedInAt: new Date().toISOString(),
                  });
                }
                router.push(pathForRole(result.user.role));
                router.refresh();
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Could not sign in.';
                if (message.includes('Failed to fetch') || message.includes('Cannot reach')) {
                  setError('Wrong email or password for studio owner sign-in.');
                } else {
                  setError(message);
                }
              } finally {
                setPending(false);
              }
            }}
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Studio owner email"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted transition-all focus:border-champagne focus:bg-paper focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Studio password"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted transition-all focus:border-champagne focus:bg-paper focus:outline-none"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-xs font-medium text-rose">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={pending} variant="gold" className="w-full">
              {pending ? 'Signing in…' : 'Sign in to studio'}
            </Button>
          </form>

          <div className="mt-6 border-t border-ink/8 pt-6 text-center text-xs text-muted">
            Customers book as guests — no account required.{' '}
            <Link href="/styles" className="font-semibold text-ink underline hover:text-champagneMuted">
              Book an appointment
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
