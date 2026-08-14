import type { Metadata } from 'next';
import { Container, SectionHeading } from '@/components/ui/section';
import { StyleCard } from '@/components/cards/cards';
import { staticStyles } from '@/lib/content';

export const metadata: Metadata = { title: 'Style Lookbook — Noir Atelier Studio' };

export default async function StylesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const rows = kind
    ? staticStyles.filter((s) => s.kind === kind.toUpperCase())
    : staticStyles;

  const title =
    kind?.toUpperCase() === 'HAIR'
      ? 'Hair Braiding & Protective Styles.'
      : kind?.toUpperCase() === 'NAILS'
        ? 'Nail Couture & Artistry.'
        : 'Complete studio lookbook.';

  const body =
    kind?.toUpperCase() === 'HAIR'
      ? 'Knotless braids, boho curls, fulani braids, goddess locs, and passion twists.'
      : kind?.toUpperCase() === 'NAILS'
        ? 'Chrome finish, french tips, gel-x extensions, cat eye, and almond shapes.'
        : 'All hair braiding and nail couture services offered at Noir Atelier Studio.';

  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow={kind?.toUpperCase() === 'HAIR' ? 'Studio Menu · Hair' : kind?.toUpperCase() === 'NAILS' ? 'Studio Menu · Nails' : 'Noir Atelier Lookbook'}
        title={title}
        body={body}
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {rows.map((style) => (
          <StyleCard
            key={style.id}
            href={`/styles/${style.slug}`}
            image={style.imageUrl}
            name={style.name}
            category={style.categoryName}
            priceMinor={style.startingPriceMinor}
          />
        ))}
      </div>
    </Container>
  );
}
