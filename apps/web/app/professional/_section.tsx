import Link from 'next/link';
import { Container } from '@/components/ui/section';

const nav = [
  { href: '/professional/dashboard', label: 'Overview' },
  { href: '/professional/bookings', label: 'Bookings' },
  { href: '/professional/services', label: 'Services' },
  { href: '/professional/portfolio', label: 'Portfolio' },
  { href: '/professional/availability', label: 'Availability' },
  { href: '/professional/reviews', label: 'Reviews' },
  { href: '/professional/profile', label: 'Profile' },
  { href: '/professional/settings', label: 'Settings' },
];

export default function ProfessionalSectionPage({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="py-12 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-ink/10 pb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
            Studio Atelier Management
          </span>
          <h1 className="mt-3 font-display text-4xl font-normal text-ink md:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{body}</p>
        </div>
        <Link
          href="/professional/dashboard"
          className="self-start rounded-full border border-ink/10 bg-paper px-4 py-2 text-xs font-semibold text-ink hover:border-champagne/50 hover:bg-ivory transition-all md:self-auto"
        >
          ← Back to Studio Overview
        </Link>
      </div>

      {/* Subpage Tab Navigation Bar */}
      <nav className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/8 bg-paper p-2 shadow-sm">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-ink/75 hover:bg-ivory hover:text-ink transition-all"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">{children}</div>
    </Container>
  );
}

