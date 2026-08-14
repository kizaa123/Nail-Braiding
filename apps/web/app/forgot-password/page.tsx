'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="ambient-glow py-16 md:py-24">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-ink/10 bg-paper/90 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="text-center">
            <h1 className="font-display text-4xl font-normal text-ink">Reset Password</h1>
            <p className="mt-2 text-sm text-muted">Enter your email address to receive password recovery instructions.</p>
          </div>

          {sent ? (
            <div className="mt-8 rounded-2xl border border-emerald/30 bg-emerald/10 p-6 text-center text-sm font-medium text-emerald">
              If an atelier account exists for that email, a password reset link has been sent. Check your inbox.
              <div className="mt-6">
                <Link href="/login" className="text-xs font-semibold underline text-ink hover:text-champagneMuted">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                await api('/api/auth/forgot-password', {
                  method: 'POST',
                  body: JSON.stringify({ email: String(form.get('email')) }),
                });
                setSent(true);
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

              <Button type="submit" variant="gold" className="w-full">
                Send Recovery Link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-muted">
            <Link href="/login" className="hover:text-ink font-semibold">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

