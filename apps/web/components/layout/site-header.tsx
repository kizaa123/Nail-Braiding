import Link from 'next/link';
import { Container } from '@/components/ui/section';

const navLinks = [
  { href: '/', label: 'HOME', active: true },
  { href: '/discover', label: 'DISCOVER' },
  { href: '/styles', label: 'STYLES' },
  { href: '/professionals', label: 'PROFESSIONALS' },
  { href: '/account', label: 'BOOKINGS' },
  { href: '/admin', label: 'ABOUT US' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#120D0D]/90 backdrop-blur-md border-b border-white/10 text-white">
      <Container className="flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Brand Logo - LUXÉ BEAUTY STUDIO */}
        <Link href="/" className="group flex flex-col items-start leading-none">
          <span className="font-display text-2xl md:text-3xl font-semibold tracking-wider text-white group-hover:text-[#D87D7D] transition-colors">
            LUXÉ
          </span>
          <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/70">
            BEAUTY STUDIO
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-widest text-white/80" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative py-1 transition-colors hover:text-white ${
                link.active ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D87D7D] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Icons & Book Now CTA */}
        <div className="flex items-center gap-4 text-white">
          {/* Search Icon */}
          <button
            type="button"
            aria-label="Search"
            className="p-2 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Heart / Wishlist Icon */}
          <button
            type="button"
            aria-label="Favorites"
            className="p-2 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer hidden sm:block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Shopping Bag Icon with Badge */}
          <Link
            href="/account"
            aria-label="Shopping Bag"
            className="relative p-2 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer hidden sm:block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D87D7D] text-[10px] font-bold text-white shadow-sm">
              2
            </span>
          </Link>

          {/* Book Now Button */}
          <Link
            href="/discover"
            className="rounded-full bg-[#D87D7D] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#C66B6B] hover:shadow-rose-500/20 active:scale-95 transition-all"
          >
            BOOK NOW
          </Link>
        </div>
      </Container>
    </header>
  );
}


