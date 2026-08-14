import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { api, formatCedis } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { editorialImages } from '@/lib/content';

interface ProfessionalDetail {
  id: string;
  slug: string;
  businessName: string;
  biography: string;
  locationCity: string;
  locationRegion: string;
  profilePhotoUrl: string | null;
  coverPhotoUrl: string | null;
  ratingAverage: number | string;
  ratingCount: number;
  services: Array<{
    id: string;
    name: string;
    priceMinor: number;
    durationMinutes: number;
    category: { name: string };
  }>;
  portfolioItems: Array<{ id: string; url: string; alt: string; mediumUrl: string }>;
  reviews: Array<{ id: string; rating: number; comment: string; customer: { firstName: string } }>;
  whatsapp: { phoneE164: string } | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, ' '), alternates: { canonical: `/professionals/${slug}` } };
}

export default async function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let pro: ProfessionalDetail | null = null;
  try {
    pro = await api<ProfessionalDetail>(`/api/professionals/${slug}`, { next: { revalidate: 30 } });
  } catch {
    pro = null;
  }
  if (!pro) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: pro.businessName,
    address: { '@type': 'PostalAddress', addressLocality: pro.locationCity, addressRegion: pro.locationRegion },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(pro.ratingAverage),
      reviewCount: pro.ratingCount,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Cover Header Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-espresso">
        <Image
          src={pro.coverPhotoUrl ?? editorialImages.hero}
          alt=""
          fill
          priority
          className="object-cover opacity-85"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
      </div>

      {/* Studio Header Card */}
      <Container className="relative -mt-20 pb-20">
        <div className="rounded-3xl border border-white/20 bg-paper/95 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-ivory bg-cream shadow-md">
                {pro.profilePhotoUrl ? (
                  <Image src={pro.profilePhotoUrl} alt={pro.businessName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-4xl font-light text-muted">
                    {pro.businessName.slice(0, 1)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-4xl font-medium text-ink md:text-5xl lg:text-6xl">{pro.businessName}</h1>
                  <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-bold text-emerald uppercase tracking-wider">
                    Verified Studio
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted flex items-center gap-2">
                  <span>📍 {pro.locationCity}, {pro.locationRegion}</span>
                  <span>·</span>
                  <span className="font-semibold text-amber-500">★ {Number(pro.ratingAverage).toFixed(1)}</span>
                  <span>({pro.ratingCount} reviews)</span>
                </p>
              </div>
            </div>

            <Button href={pro.services[0] ? `/book/${pro.slug}/${pro.services[0].id}` : '/discover'} variant="whatsapp" className="shrink-0">
              💬 Book on WhatsApp
            </Button>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted md:text-base">{pro.biography}</p>
        </div>

        {/* Studio Services List */}
        <div className="mt-16">
          <div className="flex items-center justify-between border-b border-ink/8 pb-4">
            <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">Studio Service Menu</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{pro.services.length} Available Services</span>
          </div>

          <div className="mt-6 space-y-4">
            {pro.services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between gap-4 rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:border-champagne/50 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-champagneMuted">
                    {service.category.name}
                  </span>
                  <h3 className="mt-1 font-display text-2.5xl font-medium text-ink group-hover:text-champagneMuted transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted flex items-center gap-2">
                    <span>⏱ {service.durationMinutes} minutes duration</span>
                    <span>·</span>
                    <span>Includes consultation & finish</span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-xl font-semibold text-ink">{formatCedis(service.priceMinor)}</p>
                  <Button href={`/book/${pro.slug}/${service.id}`} variant="gold">
                    Book Service
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Gallery */}
        {pro.portfolioItems.length > 0 ? (
          <div className="mt-20">
            <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mb-6">Atelier Portfolio</h2>
            <div className="columns-2 gap-4 md:columns-3">
              {pro.portfolioItems.map((item) => (
                <div key={item.id} className="mb-4 overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-sm img-zoom">
                  <Image
                    src={item.mediumUrl || item.url}
                    alt={item.alt}
                    width={600}
                    height={800}
                    className="h-auto w-full object-cover transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Customer Reviews */}
        <div className="mt-20">
          <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mb-6">Client Reviews</h2>
          {pro.reviews.length === 0 ? (
            <div className="rounded-2xl border border-ink/8 bg-paper p-8 text-center text-muted">
              No client reviews published yet for this studio.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pro.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-ink/8 bg-paper p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink">{review.customer.firstName}</p>
                    <span className="text-sm text-amber-500 font-bold">★ {review.rating}.0</span>
                  </div>
                  <p className="mt-3 text-sm text-muted italic">“{review.comment}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

