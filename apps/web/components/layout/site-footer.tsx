'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/section';

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-obsidian text-ivory border-t border-white/10 pt-20 pb-16">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2">
            <span className="font-display text-4xl text-ivory">Noir Atelier Studio</span>
            <span className="h-2 w-2 rounded-full bg-champagne shadow-gold" />
          </div>
          <p className="mt-4 max-w-sm text-sm text-ivory/70 leading-relaxed">
            Exclusive signature salon dedicated to luxury African hair braiding, protective locs, and high-fashion nail couture. Book online or directly via WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full border border-champagne/40 bg-champagne/10 px-3.5 py-1.5 font-semibold text-champagne">
              📍 Studio Location: Accra, Ghana
            </span>
            <a
              href="https://wa.me/233531806381"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#128C7E]/40 bg-[#128C7E]/20 px-3.5 py-1.5 font-semibold text-white hover:bg-[#128C7E]/40 transition-colors"
            >
              💬 Owner WhatsApp: 0531806381
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Services Menu</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li><Link href="/styles?kind=HAIR" className="hover:text-champagne transition-colors">Hair Braiding & Protective Styles</Link></li>
            <li><Link href="/styles?kind=NAILS" className="hover:text-champagne transition-colors">Nail Couture & Gel-X</Link></li>
            <li><Link href="/discover" className="hover:text-champagne transition-colors">Book an Appointment</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Shop Owner Portals</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li><Link href="/admin" className="hover:text-champagne transition-colors">🏛️ Owner Admin Portal (View All Bookings)</Link></li>
            <li><Link href="/account" className="hover:text-champagne transition-colors">👤 Client Account Dashboard</Link></li>
            <li><Link href="/bookings" className="hover:text-champagne transition-colors">📅 Client Bookings Timeline</Link></li>
          </ul>
        </div>
      </Container>

      <Container className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/50 sm:flex-row">
        <p>© {new Date().getFullYear()} Noir Atelier Studio. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
          <span>Shop Owner WhatsApp Online: 0531806381</span>
        </div>
      </Container>
    </footer>
  );
}


