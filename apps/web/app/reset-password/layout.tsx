import { Suspense } from 'react';

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className="p-8">Loading…</p>}>{children}</Suspense>;
}
