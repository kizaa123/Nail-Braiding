'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="ambient-glow py-16 md:py-24">
      <Container className="max-w-lg">
        <div className="rounded-3xl border border-ink/10 bg-paper/90 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
              Noir Atelier Sign In
            </span>
            <h1 className="mt-4 font-display text-4xl font-normal text-ink md:text-5xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted">Access your appointments, saved looks, and salon bookings.</p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setPending(true);
              const form = new FormData(e.currentTarget);
              try {
                await api('/api/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({
                    email: String(form.get('email')),
                    password: String(form.get('password')),
                  }),
                });
                router.push('/account');
                router.refresh();
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Could not sign in.';
                setError(
                  message.includes('Failed to fetch') || message.includes('Cannot reach')
                    ? 'Cannot reach the booking API. Keep this site on port 3000 and start the API on port 4000.'
                    : message,
                );
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
                placeholder="name@example.com"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-champagneMuted hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-xs font-medium text-rose">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={pending} variant="gold" className="w-full">
              {pending ? 'Signing in…' : 'Sign in to Atelier'}
            </Button>
          </form>

          <div className="mt-8 border-t border-ink/8 pt-6 text-center text-xs text-muted">
            Don’t have an account yet?{' '}
            <Link href="/register" className="font-semibold text-ink underline hover:text-champagneMuted">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

