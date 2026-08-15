'use client';

import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';
import { StyleCard } from '@/components/cards/cards';
import { Reveal, Stagger } from '@/components/motion/reveal';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';
import { StyleCardSkeleton } from '@/components/ui/skeleton';

export function HomeStyleMenus() {
  const { publicStyles, ready } = useStudioCatalog();
  const hair = publicStyles.filter((style) => style.kind === 'HAIR').slice(0, 4);
  const nails = publicStyles.filter((style) => style.kind === 'NAILS').slice(0, 4);

  return (
    <>
      <Reveal>
        <Container className="py-10 md:py-24">
          <SectionHeading
            eyebrow="STUDIO MENU · ALL SERVICES"
            title="Beauty in every"
            script="detail."
            body="Select a look below to view details and book."
            action={
              <Button
                href="/styles"
                variant="outline"
                className="rounded-full border border-[#D98282] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#D98282] hover:border-[#D98282] hover:bg-[#D98282] hover:text-white transition-all"
              >
                VIEW ATELIER
              </Button>
            }
          />
          {!ready ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <StyleCardSkeleton key={index} />
              ))}
            </div>
          ) : hair.length === 0 ? (
            <div className="rounded-3xl border border-[#EADBCE] bg-white px-6 py-12 text-center">
              <p className="font-display text-2xl text-[#171211]">No hair looks yet</p>
              <p className="mt-2 text-sm text-[#A99B95]">Published looks from the Admin Atelier will appear here.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {hair.map((style) => (
                <StyleCard
                  key={`hair-${style.slug}`}
                  id={style.id}
                  href={`/styles/${style.slug}`}
                  image={style.imageUrl}
                  name={style.name}
                  category={style.categoryName}
                  description={style.description}
                  durationMinutes={style.durationMinutes}
                  priceMinor={style.startingPriceMinor}
                  featured={style.featured}
                />
              ))}
            </Stagger>
          )}
        </Container>
      </Reveal>

      <Reveal>
        <Container className="py-8 md:py-16">
          <SectionHeading
            eyebrow="STUDIO MENU · NAIL COUTURE"
            title="Nail couture"
            script="artistry."
            body="High-fashion nail design, French tips, and chrome finishes."
            action={
              <Button
                href="/styles?kind=NAILS"
                variant="outline"
                className="rounded-full border border-[#D98282] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#D98282] hover:border-[#D98282] hover:bg-[#D98282] hover:text-white transition-all"
              >
                VIEW ALL NAILS
              </Button>
            }
          />
          {!ready ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <StyleCardSkeleton key={index} />
              ))}
            </div>
          ) : nails.length === 0 ? (
            <div className="rounded-3xl border border-[#EADBCE] bg-white px-6 py-12 text-center">
              <p className="font-display text-2xl text-[#171211]">No nail looks yet</p>
              <p className="mt-2 text-sm text-[#A99B95]">Published looks from the Admin Atelier will appear here.</p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {nails.map((style) => (
                <StyleCard
                  key={`nail-${style.slug}`}
                  id={style.id}
                  href={`/styles/${style.slug}`}
                  image={style.imageUrl}
                  name={style.name}
                  category={style.categoryName}
                  description={style.description}
                  durationMinutes={style.durationMinutes}
                  priceMinor={style.startingPriceMinor}
                  featured={style.featured}
                />
              ))}
            </Stagger>
          )}
        </Container>
      </Reveal>
    </>
  );
}
