import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/section';
import { Reveal, Stagger } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'About Us — KAS Beauty Plus',
  description: 'KAS Beauty Plus in Cape Coast, UCC Campus — hair styling, knotless, cornrow, box braid, twist, and nails.',
};

const studioServices = [
  { title: 'Hair styling', body: 'Everyday and occasion looks finished in the studio.' },
  { title: 'Knotless', body: 'Lightweight protective braids that start from your natural hair.' },
  { title: 'Cornrow', body: 'Clean, close-to-the-scalp patterns styled with care.' },
  { title: 'Box braid', body: 'Classic boxed parts, neat from root to end.' },
  { title: 'Twist', body: 'Two-strand twists for a soft, lasting protective finish.' },
  { title: 'Nails', body: 'Studio nail work to complete your look.' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F7F1EA]">
      <section className="relative overflow-hidden bg-[#171211] py-12 text-white md:py-28">
        <Container>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D98282]">✦ Our Story</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-normal leading-[1.05] md:text-7xl">
              Beauty, crafted with <span className="font-script italic text-[#D98282]">care.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#A99B95] md:text-base">
              KAS Beauty Plus is Cape Coast’s studio for hair styling, knotless, cornrow, box braid, twist, and nails — a calm space on UCC Campus where every look is finished with intention.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="grid items-start gap-8 py-16 md:gap-12 md:py-24 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="overflow-hidden rounded-[24px] bg-white p-2 shadow-[0_24px_60px_rgba(23,18,17,0.12)] md:rounded-[32px] md:p-3">
            {/* CHANGE BUILT-IN IMAGE: About page studio photo */}
            <Image
              src="/about-us-image.png"
              alt="KAS Beauty Plus studio"
              width={1600}
              height={1200}
              className="h-auto w-full rounded-[18px] object-contain md:rounded-[24px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </Reveal>
        <Reveal direction="right" delay={0.08}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D98282]">The Studio</p>
          <h2 className="mt-3 font-display text-3xl text-[#171211] md:text-5xl">Hair, braids, and nails.</h2>
          <p className="mt-5 text-sm leading-relaxed text-[#7A6E68] md:text-[15px]">
            KAS Beauty Plus is a modern beauty studio in Cape Coast, UCC Campus. We specialise in hair styling, knotless, cornrow, box braid, twist, and nails — combining professional care with looks that feel like you.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#7A6E68] md:text-[15px]">
            You do not need an account to book. Choose a look, send your name, date, and location, and the studio confirms on WhatsApp or the owner portal.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              ['Cape Coast, UCC Campus', 'Open Monday – Sunday'],
              ['Direct booking', 'Portal or WhatsApp'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-[#EADBCE] bg-white p-3 sm:p-4">
                <p className="font-display text-lg text-[#171211] sm:text-xl">{title}</p>
                <p className="mt-1 text-xs text-[#A99B95]">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      <section className="border-y border-[#EADBCE] bg-white py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D98282]">What we do</p>
            <h2 className="mt-3 font-display text-3xl text-[#171211] md:text-5xl">
              Studio <span className="font-script italic text-[#D98282]">services.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#7A6E68]">
              These are the services we offer in the studio. Browse the atelier and book the look you want.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {studioServices.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-[#EADBCE] bg-[#F7F1EA] p-4 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-xl text-[#171211] sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#7A6E68] sm:text-sm">{item.body}</p>
              </article>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Stagger className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Certified specialists', body: 'Experienced braiders and nail artists who work with premium products and gentle technique.' },
              { title: 'Guest-friendly booking', body: 'No customer sign-up. Pick a style, fill a short form, and we take it from there.' },
              { title: 'Owner-led studio', body: 'Every booking reaches the shop owner — so confirmation is personal, not automated noise.' },
            ].map((item) => (
              <article key={item.title}>
                <p className="text-[#D98282]">✦</p>
                <h3 className="mt-3 font-display text-2xl text-[#171211]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7A6E68]">{item.body}</p>
              </article>
            ))}
          </Stagger>
        </Container>
      </section>

      <Reveal>
        <Container className="py-16 text-center md:py-24">
        <h2 className="font-display text-4xl text-[#171211] md:text-5xl">Ready for your next look?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#7A6E68]">Browse the lookbook and book as a guest in a few steps.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/styles"
            className="inline-flex min-h-12 items-center rounded-full bg-[#D98282] px-7 text-xs font-bold uppercase tracking-widest text-white"
          >
            Book now
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center rounded-full border border-[#171211]/15 px-7 text-xs font-bold uppercase tracking-widest text-[#171211]"
          >
            Contact us
          </Link>
        </div>
        </Container>
      </Reveal>
    </div>
  );
}
