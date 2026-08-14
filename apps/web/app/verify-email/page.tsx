'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Container } from '@/components/ui/section';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const [message, setMessage] = useState('Verifying…');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setMessage('This verification link is missing a token.');
      return;
    }
    api('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) })
      .then(() => setMessage('Email verified. You can sign in.'))
      .catch(() => setMessage('This verification link is invalid or expired.'));
  }, [params]);

  return (
    <Container className="py-16">
      <h1 className="font-display text-5xl">Email verification</h1>
      <p className="mt-6 text-muted">{message}</p>
    </Container>
  );
}
