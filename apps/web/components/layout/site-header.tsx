'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/section';
import { useStudioSession } from '@/hooks/use-studio-session';
import { StudioLogo } from '@/components/brand/studio-logo';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/styles', label: 'ATELIER' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/contact', label: 'CONTACT US' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { session } = useStudioSession();
  const signedIn = Boolean(session);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#171211]/95 text-white backdrop-blur-md">
      <Container className="flex min-h-[6.75rem] items-center justify-between gap-3 px-4 py-2 md:min-h-[8.75rem] md:px-8 md:py-3">
        <StudioLogo className="shrink-0" />

        <nav className="hidden items-center gap-7 text-xs font-semibold tracking-widest lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 ${
                  active ? 'font-bold text-[#D98282]' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                    active ? 'bg-[#D98282] opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-white md:gap-3">
          <Link
            href={signedIn ? '/admin' : '/login'}
            className="rounded-full border border-white/25 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/90 transition-all hover:border-white/60 hover:bg-white/10 md:px-5 md:py-2.5 md:text-xs"
          >
            {signedIn ? 'ADMIN' : 'LOGIN'}
          </Link>
          <Link
            href="/styles"
            className="rounded-full bg-[#D98282] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#C56E6E] active:scale-95 md:px-6 md:py-2.5 md:text-xs"
          >
            BOOK NOW
          </Link>
        </div>
      </Container>
    </header>
  );
}
