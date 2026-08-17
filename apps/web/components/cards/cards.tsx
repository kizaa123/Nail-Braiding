'use client';

import Link from 'next/link';
import { formatCedis } from '@/lib/api';
import { CatalogImage } from '@/components/ui/catalog-image';
import { useStyleFavorite } from '@/hooks/use-style-favorites';

function formatDuration(minutes?: number | null) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours}hr ${mins}min`;
  if (hours) return `${hours}hr`;
  return `${mins}min`;
}

export function StyleCard({
  id,
  href,
  image,
  name,
  category,
  description,
  durationMinutes,
  priceMinor,
  featured = false,
}: {
  id: string;
  href: string;
  image: string;
  name: string;
  category: string;
  description?: string;
  durationMinutes?: number | null;
  priceMinor?: number | null;
  featured?: boolean;
}) {
  const { saved, toggle } = useStyleFavorite(id);
  const duration = formatDuration(durationMinutes ?? 90);
  const displayDescription = description ?? 'Curated by our certified studio specialists with premium care.';
  const displayPrice = priceMinor ?? 20000;

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#EADBCE] bg-[#FAF7F2] p-2 shadow-[0_4px_20px_rgba(23,18,17,0.04)] transition-all duration-300 hover:border-[#D98282]/40 hover:shadow-[0_14px_34px_rgba(23,18,17,0.09)] sm:rounded-[24px] sm:p-3.5"
    >
      <div className="relative aspect-[4/3.7] w-full overflow-hidden rounded-[14px] bg-[#F0EAE1] sm:rounded-[18px]">
        <Link href={href} className="absolute inset-0">
          <CatalogImage
            src={image}
            alt=""
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <span
          className={`pointer-events-none absolute left-1.5 top-1.5 z-10 inline-flex max-w-[72%] items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:max-w-none sm:px-2.5 sm:py-1 sm:text-[9.5px] sm:tracking-[0.14em] ${
            featured
              ? 'bg-[#D98282] text-white'
              : 'bg-[#C9A46A]/90 text-white'
          }`}
        >
          <span className="hidden text-[8px] sm:inline">✦</span>
          {featured ? 'TRENDING' : category.toUpperCase()}
        </span>

        <button
          type="button"
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#171211] shadow-sm transition-transform hover:scale-110 active:scale-95 sm:right-3 sm:top-3 sm:h-8 sm:w-8"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill={saved ? '#D98282' : 'none'}
            stroke={saved ? '#D98282' : '#171211'}
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Card Content Panel */}
      <div className="flex flex-1 flex-col justify-between px-0.5 pt-2.5 pb-0 sm:px-1 sm:pt-3.5 sm:pb-0.5">
        <div>
          <h3 className="font-display text-[1.05rem] font-normal leading-tight text-[#171211] transition-colors group-hover:text-[#D98282] sm:text-2xl md:text-[1.55rem]">
            <Link href={href}>{name}</Link>
          </h3>
          <p className="mt-1 hidden text-[12.5px] font-light leading-relaxed text-[#7A6E68] line-clamp-2 sm:mt-1.5 sm:block">
            {displayDescription}
          </p>
        </div>

        <div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-[#7A6E68] sm:mt-3.5 sm:gap-2.5 sm:text-xs">
            <span className="inline-flex items-center gap-1 font-light sm:gap-1.5">
              <svg className="h-3 w-3 shrink-0 text-[#A99B95] sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{duration}</span>
            </span>
            <span className="hidden h-3 w-px bg-[#171211]/15 sm:block" />
            <span className="font-light">
              <span className="hidden sm:inline">From </span>
              <span className="font-semibold text-[#D98282]">{formatCedis(displayPrice)}</span>
            </span>
          </div>

          <Link
            href={href}
            className="mt-2.5 inline-flex min-h-[36px] w-full items-center justify-center rounded-xl border border-[#E5B5B5] bg-[#FDF8F6] text-[9px] font-bold uppercase tracking-[0.12em] text-[#C86A6A] transition-all duration-200 hover:border-[#D98282] hover:bg-[#D98282] hover:text-white hover:shadow-[0_4px_14px_rgba(217,130,130,0.3)] active:scale-[0.98] sm:mt-4 sm:min-h-[42px] sm:rounded-2xl sm:text-[11px] sm:tracking-[0.18em]"
          >
            SELECT & BOOK
          </Link>
        </div>
      </div>
    </article>
  );
}

