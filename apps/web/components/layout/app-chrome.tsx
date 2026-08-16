'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileDock } from '@/components/layout/mobile-dock';
import { AdminShell } from '@/components/admin/admin-shell';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith('/admin');
  const isLookShare = pathname.startsWith('/l/');

  if (isPortal) {
    return <AdminShell>{children}</AdminShell>;
  }

  if (isLookShare) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileDock />
    </>
  );
}

