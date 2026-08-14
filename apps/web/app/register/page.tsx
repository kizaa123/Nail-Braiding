'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="ambient-glow py-16 md:py-24">
      <Container className="max-w-xl">
        <div className="rounded-3xl border border-ink/10 bg-paper/90 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
              Join Noir Atelier
            </span>
            <h1 className="mt-4 font-display text-4xl font-normal text-ink md:text-5xl">Create your Account</h1>
            <p className="mt-2 text-sm text-muted">Join Ghana's premier hair braiding and nail artistry community.</p>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setPending(true);
              const form = new FormData(e.currentTarget);
              try {
                await api('/api/auth/register', {
                  method: 'POST',
                  body: JSON.stringify({
                    firstName: String(form.get('firstName')),
                    lastName: String(form.get('lastName')),
                    email: String(form.get('email')),
                    password: String(form.get('password')),
                    role: String(form.get('role')),
                  }),
                });
                router.push('/login');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not register.');
              } finally {
                setPending(false);
              }
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                  First Name
                </label>
                <input
                  name="firstName"
                  required
                  placeholder="Ama"
                  className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                  Last Name
                </label>
                <input
                  name="lastName"
                  required
                  placeholder="Mensah"
                  className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="ama@example.com"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
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
                minLength={10}
                placeholder="At least 10 characters"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
                Account Type
              </label>
              <select
                name="role"
                className="mt-2 min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink focus:border-champagne focus:bg-paper focus:outline-none transition-all cursor-pointer"
              >
                <option value="CUSTOMER">Client (Book Appointments & Save Styles)</option>
                <option value="PROFESSIONAL">Beauty Professional (List Studio & Accept Bookings)</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-xs font-medium text-rose">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={pending} variant="gold" className="w-full mt-2">
              {pending ? 'Creating account…' : 'Create Atelier Account'}
            </Button>
          </form>

          <div className="mt-8 border-t border-ink/8 pt-6 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-ink underline hover:text-champagneMuted">
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

