'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, SectionHeading } from '@/components/ui/section';
import { staticStyles, type StaticStyle } from '@/lib/content';
import { formatCedis } from '@/lib/api';

const quickTags = ['Knotless', 'Boho', 'Chrome', 'French Tips', 'Goddess Locs', 'Gel-X', 'Fulani', 'Twists'];

export default function DiscoverPage() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'' | 'HAIR' | 'NAILS'>('');

  const rows = useMemo<StaticStyle[]>(() => {
    return staticStyles.filter((s) => {
      const matchKind = kind === '' || s.kind === kind;
      const matchQ =
        q === '' ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(q.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      return matchKind && matchQ;
    });
  }, [q, kind]);

  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Noir Atelier Studio Booking"
        title="Choose your service kind & style."
        body="Select between Hair Braiding or Nail Art, pick your look, choose a date and time — delivered straight to the shop owner."
      />

      {/* Search & Filter Panel */}
      <div className="mb-10 rounded-3xl border border-ink/8 bg-paper p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="discover-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search styles e.g. knotless braids, chrome nails..."
              className="min-h-13 w-full rounded-2xl border border-ink/10 bg-ivory pl-12 pr-5 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-ink"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="flex gap-2">
            {(['', 'HAIR', 'NAILS'] as const).map((value) => (
              <button
                key={value || 'all'}
                type="button"
                onClick={() => setKind(value)}
                className={`min-h-13 cursor-pointer rounded-2xl px-5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  kind === value
                    ? 'bg-obsidian text-ivory shadow-md'
                    : 'border border-ink/10 bg-ivory text-ink hover:border-ink/20 hover:bg-paper'
                }`}
              >
                {value === '' ? 'All Looks' : value === 'HAIR' ? '💇‍♀️ Hair Braiding' : '💅 Nail Art'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/6 pt-4">
          <span className="text-xs text-muted font-medium mr-1">Quick Search:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQ(tag)}
              className="rounded-full border border-ink/8 bg-ivory/80 px-3 py-1 text-xs text-ink/80 hover:border-champagne/40 hover:bg-champagne/10 hover:text-ink transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {rows.length} {rows.length === 1 ? 'look' : 'looks'} available
        </p>
        {q || kind ? (
          <button
            type="button"
            onClick={() => { setQ(''); setKind(''); }}
            className="text-xs text-rose font-medium hover:underline"
          >
            Reset Filters
          </button>
        ) : null}
      </div>

      {/* Empty State */}
      {rows.length === 0 ? (
        <div className="rounded-3xl border border-ink/8 bg-paper py-16 text-center">
          <p className="font-display text-3xl text-ink">No styles found</p>
          <p className="mt-2 text-sm text-muted">Try adjusting your search or clearing your category filter.</p>
          <button
            type="button"
            onClick={() => { setQ(''); setKind(''); }}
            className="mt-6 rounded-full bg-obsidian px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-espresso"
          >
            Reset Search
          </button>
        </div>
      ) : null}

      {/* Style Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {rows.map((style) => (
          <Link
            key={style.id}
            href={`/styles/${style.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-xl card-elevate"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream img-zoom">
              <Image
                src={style.imageUrl}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="inline-block rounded-full border border-white/20 bg-obsidian/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm">
                  {style.categoryName}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.kind === 'HAIR' ? 'bg-champagne/90 text-obsidian' : 'bg-rose/90 text-white'}`}>
                  {style.kind === 'HAIR' ? 'Hair' : 'Nails'}
                </span>
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="font-display text-xl font-medium text-ink group-hover:text-champagneMuted transition-colors leading-tight">
                {style.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted">{style.durationMinutes} min</p>
                <p className="text-xs font-bold text-ink">{formatCedis(style.startingPriceMinor)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {style.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-medium text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
