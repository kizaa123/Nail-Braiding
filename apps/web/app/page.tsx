import Image from 'next/image';
import Link from 'next/link';
import { editorialImages } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';
import { MarqueeGallery } from '@/components/home/marquee-gallery';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { Reveal, Stagger } from '@/components/motion/reveal';
import { HomeStyleMenus } from '@/components/home/home-style-menus';

export default async function HomePage() {
  return (
    <>
      <HeroCarousel />

      <section className="bg-[#F7F1EA] py-10 text-[#171211] md:py-20">
        <Container>
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-[10px] text-[#D98282]">✦</span>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D98282]">
                  SELECT YOUR SERVICE KIND
                </span>
                <span className="text-[10px] text-[#D98282]">✦</span>
              </div>
              <h2 className="font-display text-[1.85rem] font-medium leading-tight text-[#171211] md:text-5xl">
                What kind of work <span className="ml-1 font-script text-[1.85rem] font-normal text-[#D98282] md:text-5xl">do you want today?</span>
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid gap-5 lg:grid-cols-2 lg:gap-8">
            <Link
              href="/styles?kind=HAIR"
              className="group relative isolate block overflow-hidden rounded-3xl border border-white/10 bg-[#171211] text-white shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative min-h-[320px] md:grid md:min-h-[360px] md:grid-cols-2">
                {/* CHANGE BUILT-IN IMAGE: home Hair card — edit editorialImages.braids[0] in lib/content.ts */}
                <div className="absolute inset-0 md:relative md:order-last">
                  <Image
                    src={editorialImages.braids[0]!}
                    alt="Hair Braiding & Protective Styles"
                    fill
                    className="object-cover object-[center_42%] transition-transform duration-700 group-hover:scale-105 md:object-center"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-[#171211]/45 to-black/20 md:bg-gradient-to-r md:from-[#171211]/55 md:via-transparent md:to-transparent" />
                </div>
                <div className="relative z-10 flex min-h-[320px] flex-col justify-end space-y-3 p-5 md:min-h-0 md:justify-between md:space-y-6 md:p-10">
                  <div>
                    <h3 className="font-display text-[1.65rem] font-normal leading-tight text-white md:text-4xl">
                      Hair Braiding & Protective Styles
                    </h3>
                    <div className="my-3 h-px w-10 bg-[#D98282]/40 md:my-4" />
                    <p className="text-xs font-light leading-relaxed text-white/80 md:text-sm md:text-[#A99B95]">
                      Knotless, cornrow, box braid, and twist — styled in the studio.
                    </p>
                  </div>
                  <span className="inline-flex min-h-11 w-fit items-center rounded-full border border-[#D98282] bg-[#171211]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#D98282] transition-all group-hover:bg-[#D98282] group-hover:text-white md:px-6 md:py-3">
                    BROWSE BRAIDS & BOOK
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/styles?kind=NAILS"
              className="group relative isolate block overflow-hidden rounded-3xl border border-white/10 bg-[#171211] text-white shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative min-h-[320px] md:grid md:min-h-[360px] md:grid-cols-2">
                {/* CHANGE BUILT-IN IMAGE: home Nails card — edit editorialImages.nails[0] in lib/content.ts */}
                <div className="absolute inset-0 md:relative md:order-last">
                  <Image
                    src={editorialImages.nails[0]!}
                    alt="Nail Couture & Artistry"
                    fill
                    className="object-cover object-[center_58%] transition-transform duration-700 group-hover:scale-105 md:object-center"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-[#171211]/40 to-black/15 md:bg-gradient-to-r md:from-[#171211]/55 md:via-transparent md:to-transparent" />
                </div>
                <div className="relative z-10 flex min-h-[320px] flex-col justify-end space-y-3 p-5 md:min-h-0 md:justify-between md:space-y-6 md:p-10">
                  <div>
                    <h3 className="font-display text-[1.65rem] font-normal leading-tight text-[#C9A46A] md:text-4xl">
                      Nail Couture & Artistry
                    </h3>
                    <div className="my-3 h-px w-10 bg-[#C9A46A]/40 md:my-4" />
                    <p className="text-xs font-light leading-relaxed text-white/80 md:text-sm md:text-[#A99B95]">
                      Studio nail work to finish the look — classic, chrome, and custom art.
                    </p>
                  </div>
                  <span className="inline-flex min-h-11 w-fit items-center rounded-full border border-[#C9A46A] bg-[#171211]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#C9A46A] transition-all group-hover:bg-[#C9A46A] group-hover:text-white md:px-6 md:py-3">
                    BROWSE NAILS & BOOK
                  </span>
                </div>
              </div>
            </Link>
          </Stagger>

          <Stagger className="mt-16 grid grid-cols-1 gap-8 border-t border-[#3A2924]/15 pt-10 sm:grid-cols-3" delay={0.05}>
            {[
              ['EASY BOOKING', 'Book your appointment in a few simple steps.', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
              ['TOP SPECIALISTS', 'Certified professionals you can trust.', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
              ['QUALITY SERVICE', 'Premium products and careful technique.', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
            ].map(([title, body, path]) => (
              <div key={title} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9B4B0]/30 text-[#D98282]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={path} />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#171211]">{title}</h4>
                  <p className="mt-1 text-xs font-light text-[#A99B95]">{body}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </Container>
      </section>

      <HomeStyleMenus />

      <Reveal>
        <section className="py-16">
          <Container>
            <SectionHeading eyebrow="Studio Lookbook" title="Noir Atelier signature gallery." body="Images of recent hair braiding and nail couture work." center />
          </Container>
          <MarqueeGallery />
        </section>
      </Reveal>

      <Reveal>
        <section className="ambient-glow py-16 text-center md:py-28">
          <Container className="max-w-3xl">
            <p className="font-display text-3xl font-light leading-tight text-ink md:text-7xl">
              Book your next <span className="italic text-champagneMuted">signature appointment.</span>
            </p>
            <p className="mt-4 text-lg text-muted">Pick your style, date, and time — delivered straight to the shop owner.</p>
            <div className="mt-9 flex justify-center gap-4">
              <Button href="/styles" variant="gold">
                Book Appointment Now
              </Button>
            </div>
          </Container>
        </section>
      </Reveal>
    </>
  );
}
