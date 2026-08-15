'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useStudioSession } from '@/hooks/use-studio-session';
import { clearStudioSession } from '@/lib/studio-session';
import { StudioLogo } from '@/components/brand/studio-logo';

const nav = [
  {
    label: 'Studio',
    items: [
      { href: '/admin', label: 'Overview', icon: 'grid' },
      { href: '/admin/bookings', label: 'Bookings', icon: 'calendar' },
      { href: '/admin/styles', label: 'Atelier', icon: 'spark' },
      { href: '/admin/categories', label: 'Categories', icon: 'tag' },
      { href: '/admin/settings', label: 'Settings', icon: 'cog' },
    ],
  },
] as const;

const titles: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/bookings': 'Bookings',
  '/admin/styles': 'Atelier',
  '/admin/categories': 'Categories',
  '/admin/settings': 'Settings',
};

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ name }: { name: string }) {
  const className = 'h-[18px] w-[18px] shrink-0';
  switch (name) {
    case 'grid':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 5h7v7H4V5zm9 0h7v7h-7V5zM4 14h7v7H4v-7zm9 0h7v7h-7v-7z" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 3v3m10-3v3M4 9h16M6 7h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
        </svg>
      );
    case 'spark':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-4.99L6 9.4l4.4-1.6L12 3zm6 11l.8 2.4 2.2.8-2.2.8L18 21l-.8-2.99L15 17.2l2.2-.8L18 14zM5 14l.7 2.1 2.1.7-2.1.7L5 20l-.7-2.5L2.2 16.8l2.1-.7L5 14z" />
        </svg>
      );
    case 'tag':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 11.5V6a2 2 0 012-2h5.5l8.2 8.2a2 2 0 010 2.8l-4.7 4.7a2 2 0 01-2.8 0L4 11.5zM8 8h.01" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </svg>
      );
  }
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {nav.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{group.label}</p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                      active
                        ? 'bg-white/10 font-semibold text-white shadow-[inset_3px_0_0_0_#D98282]'
                        : 'text-white/65 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${active ? 'text-[#D98282]' : 'text-white/45'}`}>
                      <NavIcon name={item.icon} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session } = useStudioSession();
  const [open, setOpen] = useState(false);
  const title = titles[pathname] ?? 'Studio portal';

  const signOut = async () => {
    clearStudioSession();
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {
      // Local studio session is enough.
    }
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#F4EEE6]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-[#171211] lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <StudioLogo href="/admin" size="md" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A46A]">Studio portal</p>
        </div>
        <SidebarNav pathname={pathname} />
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 px-3 py-3">
            <p className="truncate text-xs font-medium text-white">{session?.email ?? 'Studio owner'}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">Administrator</p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                className="flex-1 rounded-full border border-white/15 px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex-1 rounded-full border border-[#D98282]/30 bg-[#D98282]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E9B4B0] hover:bg-[#D98282]/20"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-[#171211]/50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-[#171211] shadow-2xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <div>
                  <StudioLogo href="/admin" size="sm" />
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A46A]">Studio portal</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10"
                >
                  Close
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="border-t border-white/10 p-4">
                <p className="truncate text-xs text-white">{session?.email ?? 'Studio owner'}</p>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-3 w-full rounded-full border border-[#D98282]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E9B4B0] transition-colors hover:bg-[#D98282]/20"
                >
                  Sign out
                </button>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#EADBCE] bg-[#FAF7F2]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EADBCE] bg-white text-[#171211] lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A99B95]">Studio portal</p>
              <h1 key={pathname} className="font-display text-xl leading-none text-[#171211] admin-page-enter">
                {title}
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[#EADBCE] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#171211] transition-colors hover:border-[#D98282]/50"
          >
            View site
          </Link>
        </header>
        <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
