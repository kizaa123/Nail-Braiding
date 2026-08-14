import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatCedis } from '@/lib/api';
import { Container } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { staticStyles } from '@/lib/content';

const STUDIO_SLUG = 'noir-atelier-studio';
const STUDIO_NAME = 'Noir Atelier Studio';
const WHATSAPP = '233531806381';
const DISPLAY_PHONE = '0531806381';

export async function generateStaticParams() {
  return staticStyles.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const style = staticStyles.find((s) => s.slug === slug);
  if (!style) return { title: 'Style Not Found' };
  return {
    title: `${style.name} — Noir Atelier Studio`,
    description: style.description,
    alternates: { canonical: `/styles/${slug}` },
  };
}

export default async function StyleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = staticStyles.find((s) => s.slug === slug);
  if (!style) notFound();

  const whatsappText = encodeURIComponent(
    `Hello Noir Atelier Studio! I want to book the ${style.name} style.\n\n• Service: ${style.name}\n• Duration: ${style.durationMinutes} min\n• Starting Price: ${formatCedis(style.startingPriceMinor)}\n\nPlease confirm availability. Thanks!`,
  );

  return (
    <Container className="py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink transition-colors"
        >
          ← Back to Studio Lookbook
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Column — Image */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-ink/10 bg-cream shadow-2xl">
            <Image
              src={style.imageUrl}
              alt={style.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div className="absolute top-4 left-4">
              <span className="glass-badge rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
                {style.categoryName}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.kind === 'HAIR' ? 'bg-champagne text-obsidian' : 'bg-rose/90 text-white'}`}>
                {style.kind === 'HAIR' ? '💇‍♀️ Hair' : '💅 Nails'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column — Info */}
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
              {style.kind === 'HAIR' ? 'Hair Braiding' : 'Nail Couture'} · Atelier Service
            </div>
            <h1 className="mt-4 font-display text-5xl font-normal leading-[1.05] text-ink md:text-6xl lg:text-7xl">
              {style.name}
            </h1>
            <p className="mt-6 text-base text-muted leading-relaxed">{style.description}</p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {style.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-ink/10 bg-ivory px-3 py-1 text-xs font-semibold text-muted">
                  {tag}
                </span>
              ))}
            </div>

            {/* Spec chips */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-b border-ink/8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagneMuted">⏱</div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Est. Duration</p>
                  <p className="text-sm font-medium text-ink">{style.durationMinutes} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagneMuted">💎</div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Starting From</p>
                  <p className="text-sm font-medium text-ink">{formatCedis(style.startingPriceMinor)}</p>
                </div>
              </div>
            </div>

            {/* Booking Options */}
            <div className="mt-8">
              <h3 className="font-display text-2xl font-medium text-ink">Reserve This Look</h3>
              <p className="mt-1 text-xs text-muted">Choose your booking destination below.</p>

              <div className="mt-4 space-y-3">
                {/* Option 1: Platform Booking */}
                <div className="group rounded-2xl border border-ink/8 bg-paper p-5 transition-all hover:border-champagne/50 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏛️</span>
                        <p className="font-display text-xl font-medium text-ink">{STUDIO_NAME}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {style.durationMinutes} min · <span className="font-semibold text-ink">{formatCedis(style.startingPriceMinor)}</span> · Saved to Admin Portal
                      </p>
                    </div>
                    <Button href={`/book/${STUDIO_SLUG}/${style.id}`} variant="gold" className="shrink-0">
                      Book via Portal
                    </Button>
                  </div>
                </div>

                {/* Option 2: WhatsApp Direct */}
                <div className="group rounded-2xl border border-[#128C7E]/20 bg-[#128C7E]/5 p-5 transition-all hover:border-[#128C7E]/50 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <p className="font-display text-xl font-medium text-ink">WhatsApp Direct</p>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Message shop owner directly at <span className="font-semibold text-ink">{DISPLAY_PHONE}</span>
                      </p>
                    </div>
                    <Button
                      href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
                      variant="whatsapp"
                      className="shrink-0"
                    >
                      💬 {DISPLAY_PHONE}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-ink/8 pt-6 flex items-center justify-between text-xs text-muted">
            <span>All bookings go direct to shop owner</span>
            <span>Noir Atelier Studio · Accra, Ghana</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
