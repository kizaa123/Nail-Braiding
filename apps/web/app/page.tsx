import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { editorialImages } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';
import { StyleCard } from '@/components/cards/cards';
import { MarqueeGallery } from '@/components/home/marquee-gallery';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { Reveal } from '@/components/motion/reveal';

interface StyleRow {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  imageUrl: string | null;
  startingPriceMinor: number | null;
}

async function safeList<T>(path: string): Promise<T[]> {
  try {
    const result = await api<{ data: T[] }>(path, { next: { revalidate: 60 } });
    return Array.isArray(result) ? result : result.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [hair, nails] = await Promise.all([
    safeList<StyleRow>('/api/styles?kind=HAIR&limit=8'),
    safeList<StyleRow>('/api/styles?kind=NAILS&limit=8'),
  ]);

  return (
    <>
      {/* ── LUXÉ Beauty Studio Hero Carousel Section ─────────── */}
      <HeroCarousel />

      {/* Category Selection Cards */}
      <section className="py-12 bg-paper border-y border-ink/8">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">Select Your Service Kind</span>
            <h2 className="mt-2 font-display text-4xl font-normal text-ink">What kind of work do you want today?</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Category 1: Hair Braiding */}
            <Link
              href="/styles?kind=HAIR"
              className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-obsidian p-10 text-ivory shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-champagne/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-champagne">
                  Category 01
                </span>
                <h3 className="mt-6 font-display text-4xl md:text-5xl font-medium text-ivory group-hover:text-champagne transition-colors">
                  Hair Braiding & Protective Styles
                </h3>
                <p className="mt-3 text-sm text-ivory/70 max-w-md leading-relaxed">
                  Knotless braids, boho curls, fulani braids, goddess locs, and twists crafted by our studio specialists.
                </p>
                <div className="mt-8 flex items-center gap-2 font-semibold text-xs text-champagne uppercase tracking-wider">
                  <span>Browse Braid Styles & Book →</span>
                </div>
              </div>
            </Link>

            {/* Category 2: Nail Couture */}
            <Link
              href="/styles?kind=NAILS"
              className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-espresso p-10 text-ivory shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-champagne/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-champagne">
                  Category 02
                </span>
                <h3 className="mt-6 font-display text-4xl md:text-5xl font-medium text-ivory group-hover:text-champagne transition-colors">
                  Nail Couture & Artistry
                </h3>
                <p className="mt-3 text-sm text-ivory/70 max-w-md leading-relaxed">
                  Chrome polish, classic french tips, gel-x extensions, acrylic overlay, and organic almond shapes.
                </p>
                <div className="mt-8 flex items-center gap-2 font-semibold text-xs text-champagne uppercase tracking-wider">
                  <span>Browse Nail Styles & Book →</span>
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* Hair Styles Section */}
      <Reveal>
        <Container className="py-16 md:py-24">
          <SectionHeading
            eyebrow="Studio Menu · Hair"
            title="Hair braiding artistry."
            body="Select a style below to pick your date and time for booking."
            action={
              <Button href="/styles?kind=HAIR" variant="outline">
                View All Braids →
              </Button>
            }
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {(hair.length ? hair : fallbackStyles()).slice(0, 4).map((style) => (
              <StyleCard
                key={`hair-${style.slug}`}
                href={`/styles/${style.slug}`}
                image={style.imageUrl ?? editorialImages.braids[0]!}
                name={style.name}
                category={style.categoryName}
                priceMinor={style.startingPriceMinor}
              />
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Nails Section */}
      <Reveal>
        <Container className="py-8 md:py-16">
          <SectionHeading
            eyebrow="Studio Menu · Nails"
            title="Nail couture & artistry."
            body="High-fashion nail design, French tips, and chrome finishes."
            action={
              <Button href="/styles?kind=NAILS" variant="outline">
                View All Nails →
              </Button>
            }
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {(nails.length ? nails : fallbackNails()).map((style) => (
              <StyleCard
                key={`nail-${style.slug}`}
                href={`/styles/${style.slug}`}
                image={style.imageUrl ?? editorialImages.nails[0]!}
                name={style.name}
                category={style.categoryName}
                priceMinor={style.startingPriceMinor}
              />
            ))}
          </div>
        </Container>
      </Reveal>

      {/* Booking Destination Guide */}
      <section className="my-16 bg-obsidian py-24 text-ivory">
        <Container>
          <SectionHeading
            eyebrow="Direct Studio Destination"
            title="How your booking reaches the shop owner."
            body="Choose how you prefer your booking reservation to be delivered when you check out."
            dark
          />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏛️</span>
                <span className="font-display text-2xl font-medium text-ivory">Destination 1: Admin Portal</span>
              </div>
              <p className="mt-4 text-sm text-ivory/70 leading-relaxed">
                Saves your appointment directly into the shop owner's Noir Atelier Admin Portal database. The owner can view, manage, and confirm your appointment from their executive dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-[#128C7E]/40 bg-[#128C7E]/10 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💬</span>
                <span className="font-display text-2xl font-medium text-ivory">Destination 2: Owner WhatsApp (0531806381)</span>
              </div>
              <p className="mt-4 text-sm text-ivory/70 leading-relaxed">
                Sends your pre-formatted booking details (Service, Date, Time, Price, Reference Code) directly to the shop owner's WhatsApp account (<span className="font-semibold text-white">0531806381</span>) for instant chat confirmation.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Marquee Gallery */}
      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Studio Lookbook" title="Noir Atelier signature gallery." body="Images of recent hair braiding and nail couture work." center />
        </Container>
        <MarqueeGallery />
      </section>

      {/* Bottom CTA */}
      <section className="py-28 text-center ambient-glow">
        <Container className="max-w-3xl">
          <p className="font-display text-5xl md:text-7xl font-light text-ink leading-tight">
            Book your next <span className="italic text-champagneMuted">signature appointment.</span>
          </p>
          <p className="mt-4 text-muted text-lg">Pick your style, date, and time — delivered straight to the shop owner.</p>
          <div className="mt-9 flex justify-center gap-4">
            <Button href="/discover" variant="gold">
              Book Appointment Now
            </Button>
            <Button
              href={`https://wa.me/233531806381?text=${encodeURIComponent('Hello Noir Atelier Studio! I want to book an appointment.')}`}
              variant="whatsapp"
            >
              💬 WhatsApp 0531806381
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function fallbackStyles(): StyleRow[] {
  return [
    { id: '1', slug: 'knotless-braids', name: 'Knotless Braids', categoryName: 'Braids', imageUrl: editorialImages.braids[0]!, startingPriceMinor: 35000 },
    { id: '2', slug: 'boho-braids', name: 'Boho Braids', categoryName: 'Braids', imageUrl: editorialImages.braids[1]!, startingPriceMinor: 48000 },
    { id: '3', slug: 'goddess-braids', name: 'Goddess Braids', categoryName: 'Braids', imageUrl: editorialImages.braids[2]!, startingPriceMinor: 40000 },
    { id: '4', slug: 'fulani-braids', name: 'Fulani Braids', categoryName: 'Braids', imageUrl: editorialImages.braids[3]!, startingPriceMinor: 38000 },
  ];
}

function fallbackNails(): StyleRow[] {
  return [
    { id: 'n1', slug: 'french-tips', name: 'French Tips', categoryName: 'Nail Styles', imageUrl: editorialImages.nails[0]!, startingPriceMinor: 18000 },
    { id: 'n2', slug: 'chrome', name: 'Chrome', categoryName: 'Nail Styles', imageUrl: editorialImages.nails[1]!, startingPriceMinor: 22000 },
    { id: 'n3', slug: 'cat-eye', name: 'Cat Eye', categoryName: 'Nail Styles', imageUrl: editorialImages.nails[2]!, startingPriceMinor: 20000 },
    { id: 'n4', slug: 'almond', name: 'Almond', categoryName: 'Nail Shapes', imageUrl: editorialImages.nails[3]!, startingPriceMinor: 16000 },
  ];
}


