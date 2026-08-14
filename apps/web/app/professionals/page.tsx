import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, SectionHeading } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Noir Atelier Studio Profile' };

export default function ProfessionalsPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <SectionHeading
        eyebrow="Official Studio Profile"
        title="Noir Atelier Studio."
        body="Signature salon specializing in luxury African hair braiding and high-fashion nail couture in Accra, Ghana."
      />

      <div className="mt-8 rounded-3xl border border-ink/10 bg-paper p-8 shadow-xl md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-ink/8 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
              ✨ Signature Studio
            </div>
            <h2 className="mt-3 font-display text-4xl font-normal text-ink">Noir Atelier Salon</h2>
            <p className="mt-1 text-sm text-muted">Accra, Ghana · WhatsApp: 0531806381</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/discover" variant="gold">
              Book Appointment
            </Button>
            <Button
              href={`https://wa.me/233531806381?text=${encodeURIComponent('Hello Noir Atelier Studio! I want to inquire about booking an appointment.')}`}
              variant="whatsapp"
            >
              💬 WhatsApp 0531806381
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/8 bg-ivory p-6">
            <h3 className="font-display text-2xl font-medium text-ink">Hair Braiding & Locs</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Knotless braids, boho curls, fulani braids, goddess locs, and passion twists crafted to perfection.
            </p>
            <Link href="/styles?kind=HAIR" className="mt-4 inline-block text-xs font-semibold text-champagneMuted hover:underline">
              View Hair Styles →
            </Link>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-ivory p-6">
            <h3 className="font-display text-2xl font-medium text-ink">Nail Couture & Artistry</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Chrome polish, french tips, gel-x extensions, acrylic overlays, and organic almond shapes.
            </p>
            <Link href="/styles?kind=NAILS" className="mt-4 inline-block text-xs font-semibold text-champagneMuted hover:underline">
              View Nail Styles →
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-champagne/30 bg-champagne/10 p-6">
          <h4 className="font-display text-xl font-medium text-ink">Booking Destinations</h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            All appointments booked through our platform are routed directly to the shop owner either through the <span className="font-semibold text-ink">Admin Portal</span> or <span className="font-semibold text-ink">Owner WhatsApp (0531806381)</span>.
          </p>
        </div>
      </div>
    </Container>
  );
}


