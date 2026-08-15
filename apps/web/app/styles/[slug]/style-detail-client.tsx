'use client';

import Link from 'next/link';
import { formatCedis } from '@/lib/api';
import { Container } from '@/components/ui/section';
import { StyleReserve } from '@/components/booking/style-reserve';
import { Reveal } from '@/components/motion/reveal';
import { CatalogImage } from '@/components/ui/catalog-image';
import { StyleDetailSkeleton } from '@/components/ui/skeleton';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';

export function StyleDetailClient({ slug }: { slug: string }) {
  const { publicStyles, ready } = useStudioCatalog();
  const style = publicStyles.find((item) => item.slug === slug);

  if (!ready) return <StyleDetailSkeleton />;

  if (!style) {
    return (
      <Container className="py-20 text-center">
        <p className="font-display text-4xl text-[#171211]">This look is not available</p>
        <p className="mt-3 text-sm text-[#A99B95]">It may be unpublished or no longer in the studio catalog.</p>
        <Link href="/styles" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#D98282] px-6 text-xs font-bold uppercase tracking-widest text-white">
          Back to atelier
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/styles"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-ink"
        >
          Back to Atelier
        </Link>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4" direction="left">
          <div className="relative mx-auto aspect-[4/5] max-h-[320px] w-full overflow-hidden rounded-[22px] border border-ink/10 bg-cream shadow-lg sm:max-h-none sm:max-w-[300px] lg:mx-0 lg:max-w-none">
            <CatalogImage src={style.imageUrl} alt={style.name} className="object-cover" sizes="(max-width: 1024px) 300px, 28vw" priority />
            <div className="absolute left-3 top-3">
              <span className="glass-badge rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                {style.categoryName}
              </span>
            </div>
            <div className="absolute right-3 top-3">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.kind === 'HAIR' ? 'bg-champagne text-obsidian' : 'bg-rose/90 text-white'}`}>
                {style.kind === 'HAIR' ? 'Hair' : 'Nails'}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" direction="right" delay={0.08}>
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8C6D14]">
            {style.kind === 'HAIR' ? 'Hair Braiding' : 'Nail Couture'} · {style.categoryName}
          </div>
          <h1 className="mt-3 font-display text-3xl font-normal leading-[1.08] text-ink md:text-5xl">{style.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-[15px]">{style.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {style.featured ? (
              <span className="rounded-full bg-[#C9A46A] px-3 py-1 text-[11px] font-semibold text-[#171211]">Featured</span>
            ) : null}
            {style.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-ink/10 bg-ivory px-3 py-1 text-[11px] font-semibold text-muted">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid max-w-lg grid-cols-2 gap-3 border-b border-t border-ink/8 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Est. Duration</p>
              <p className="mt-1 text-sm font-medium text-ink">{style.durationMinutes} minutes</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Starting From</p>
              <p className="mt-1 text-sm font-medium text-ink">{formatCedis(style.startingPriceMinor)}</p>
            </div>
          </div>

          <StyleReserve
            look={{
              id: style.id,
              name: style.name,
              categoryName: style.categoryName,
              kind: style.kind,
              imageUrl: style.imageUrl,
              durationMinutes: style.durationMinutes,
              startingPriceMinor: style.startingPriceMinor,
            }}
          />

          <div className="mt-8 flex flex-col gap-1 border-t border-ink/8 pt-4 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>All bookings go direct to shop owner</span>
            <span>LUXÉ Beauty Studio · {style.location}</span>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
