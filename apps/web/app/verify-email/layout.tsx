import { Suspense } from 'react';

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className="p-8">Loading…</p>}>{children}</Suspense>;
}
