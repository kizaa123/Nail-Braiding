'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const [done, setDone] = useState(false);
  return (
    <Container className="max-w-md py-16">
      <h1 className="font-display text-5xl">Choose a new password</h1>
      {done ? (
        <p className="mt-6">
          Password updated.{' '}
          <a className="underline" href="/login">
            Sign in
          </a>
        </p>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            await api('/api/auth/reset-password', {
              method: 'POST',
              body: JSON.stringify({
                token: params.get('token'),
                password: String(form.get('password')),
              }),
            });
            setDone(true);
          }}
        >
          <label className="block text-sm">
            New password
            <input name="password" type="password" required minLength={10} className="mt-2 min-h-12 w-full border border-ink/15 bg-paper px-4" />
          </label>
          <Button type="submit">Update password</Button>
        </form>
      )}
    </Container>
  );
}
