'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/section';
import { StudioLogo } from '@/components/brand/studio-logo';
import { useStudioProfile } from '@/hooks/use-studio-profile';

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function SiteFooter() {
  const { profile } = useStudioProfile();
  const whatsappHref = `https://wa.me/${profile.whatsappPhone}`;

  return (
    <footer className="mt-32 border-t border-white/10 bg-obsidian pb-16 pt-20 text-ivory">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <StudioLogo size="lg" className="items-start text-left" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            Exclusive signature salon dedicated to luxury African hair braiding, protective locs, and high-fashion nail couture. Book online or directly via WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full border border-champagne/40 bg-champagne/10 px-3.5 py-1.5 font-semibold text-champagne">
              {profile.location}
            </span>
            <span className="rounded-full border border-champagne/40 bg-champagne/10 px-3.5 py-1.5 font-semibold text-champagne">
              {profile.hours}
            </span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
            >
              <WhatsAppMark className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Follow us on</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.snapchat.com/add/sarahashie2025"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Snapchat"
                className="inline-flex h-11 w-11 overflow-hidden rounded-[14px] shadow-[0_6px_16px_rgba(0,0,0,0.28)] transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/follow-snapchat.png" alt="" className="h-full w-full object-cover" />
              </a>
              <a
                href="https://www.tiktok.com/@ask4ever0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on TikTok"
                className="inline-flex h-11 w-11 overflow-hidden rounded-[14px] shadow-[0_6px_16px_rgba(0,0,0,0.28)] transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/follow-tiktok.png" alt="" className="h-full w-full object-cover" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li><Link href="/styles" className="transition-colors hover:text-champagne">Atelier</Link></li>
            <li><Link href="/styles?kind=HAIR" className="transition-colors hover:text-champagne">Hair Braiding</Link></li>
            <li><Link href="/styles?kind=NAILS" className="transition-colors hover:text-champagne">Nail Couture</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-champagne">About Us</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-champagne">Contact Us</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Studio</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li><Link href="/styles" className="transition-colors hover:text-champagne">Book an Appointment</Link></li>
            <li><Link href="/login" className="transition-colors hover:text-champagne">Admin Login</Link></li>
            <li><Link href="/admin/styles" className="transition-colors hover:text-champagne">Manage Atelier</Link></li>
            <li><Link href="/admin/bookings" className="transition-colors hover:text-champagne">Studio Bookings Board</Link></li>
          </ul>
        </div>
      </Container>

      <Container className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/50 sm:flex-row">
        <p>© {new Date().getFullYear()} KAS Beauty Plus. All rights reserved.</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp online"
          className="inline-flex items-center gap-2 text-ivory/70 transition-colors hover:text-[#25D366]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
          <WhatsAppMark className="h-4 w-4 text-[#25D366]" />
        </a>
      </Container>
    </footer>
  );
}
