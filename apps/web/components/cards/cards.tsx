import Image from 'next/image';
import Link from 'next/link';
import { formatCedis } from '@/lib/api';

export function StyleCard({
  href,
  image,
  name,
  category,
  professional,
  priceMinor,
}: {
  href: string;
  image: string;
  name: string;
  category: string;
  professional?: string;
  priceMinor?: number | null;
}) {
  return (
    <Link href={href} className="group card-elevate block overflow-hidden rounded-2xl border border-ink/8 bg-paper p-2.5 transition-all duration-300 hover:border-champagne/40 shadow-sm hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-cream img-zoom">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute top-3 left-3">
          <span className="glass-badge rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {category}
          </span>
        </div>
        {priceMinor ? (
          <div className="absolute bottom-3 right-3 rounded-full bg-obsidian/85 px-3 py-1 text-xs font-semibold text-champagneLight backdrop-blur-md border border-champagne/30">
            {formatCedis(priceMinor)}
          </div>
        ) : null}
      </div>
      <div className="px-1.5 pt-3.5 pb-1">
        <h3 className="font-display text-2xl font-normal leading-tight text-ink group-hover:text-champagneMuted transition-colors">
          {name}
        </h3>
        {professional ? (
          <p className="mt-1 text-xs text-muted font-medium flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-champagne" />
            {professional}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function ProfessionalCard({
  href,
  image,
  name,
  location,
  rating,
  startingPriceMinor,
}: {
  href: string;
  image: string | null;
  name: string;
  location: string;
  rating: number;
  startingPriceMinor: number | null;
}) {
  return (
    <Link href={href} className="group card-elevate block overflow-hidden rounded-2xl border border-ink/8 bg-paper p-3 transition-all duration-300 hover:border-champagne/50 shadow-sm hover:shadow-md">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-cream img-zoom">
        {image ? (
          <Image src={image} alt={name} fill sizes="(max-width: 768px) 80vw, 30vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cream to-blush/30 font-display text-5xl font-light text-muted">
            {name.slice(0, 1)}
          </div>
        )}
        <div className="absolute top-3 right-3 rounded-full bg-obsidian/75 px-2.5 py-1 text-xs font-semibold text-ivory backdrop-blur-md border border-white/10 flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="px-1 pt-4 pb-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2.5xl leading-none text-ink group-hover:text-champagneMuted transition-colors">
            {name}
          </h3>
          <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald uppercase tracking-wider">
            Verified
          </span>
        </div>
        <p className="mt-2 text-xs text-muted flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-champagneMuted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-ink/6 pt-3 text-xs">
          <span className="text-muted">Starting from</span>
          <span className="font-semibold text-ink text-sm">{formatCedis(startingPriceMinor)}</span>
        </div>
      </div>
    </Link>
  );
}

