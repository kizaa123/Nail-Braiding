'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStudioSession } from '@/hooks/use-studio-session';

const items = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className={`h-5 w-5 ${active ? 'text-champagne' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/styles',
    label: 'Atelier',
    icon: (active: boolean) => (
      <svg className={`h-5 w-5 ${active ? 'text-champagne' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.75} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (active: boolean) => (
      <svg className={`h-5 w-5 ${active ? 'text-champagne' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: (active: boolean) => (
      <svg className={`h-5 w-5 ${active ? 'text-champagne' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/login',
    label: 'Login',
    icon: (active: boolean) => (
      <svg className={`h-5 w-5 ${active ? 'text-champagne' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function MobileDock() {
  const pathname = usePathname();
  const { session } = useStudioSession();
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-4 md:hidden">
      <nav
        aria-label="Mobile Navigation"
        className="mx-auto max-w-md rounded-full border border-white/20 bg-obsidian/85 p-1.5 shadow-2xl backdrop-blur-xl"
      >
        <ul className="grid grid-cols-5">
          {items.map((item) => {
            const href = item.href === '/login' && session ? '/admin' : item.href;
            const label = item.href === '/login' && session ? 'Admin' : item.label;
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={item.label}>
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-all ${
                    active ? 'bg-white/10 font-semibold text-ivory' : 'text-ivory/60 hover:text-ivory'
                  }`}
                >
                  {item.icon(active)}
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
