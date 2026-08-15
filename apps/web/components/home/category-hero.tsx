'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CategoryHeroProps {
  kind: 'HAIR' | 'NAILS';
}

const HAIR_CONFIG = {
  accentColor: '#D98282',
  title: 'Hair Braiding & Protective Styles',
  body: 'Discover stunning hairstyles, from elegant braids to modern protective styles, carefully crafted to express your personality and make you feel confident',
  ctaLabel: 'BROWSE BRAIDS & BOOK',
  ctaHref: '/styles?kind=HAIR#styles-grid',
  image: '/images (2).jpg', // CHANGE BUILT-IN IMAGE: Hair category hero
  imageAlt: 'Hair Braiding & Protective Styles',
};

const NAILS_CONFIG = {
  accentColor: '#C9A46A',
  title: 'Nail Couture & Artistry',
  body: 'Explore beautiful nail designs, from timeless classics to modern artistic details, created to complement your style and make every look feel uniquely yours.',
  ctaLabel: 'BROWSE NAILS & BOOK',
  ctaHref: '/styles?kind=NAILS#styles-grid',
  image: '/julynails_recirc-0b2f36695d8c42e58c108cb59e406fcc.jpg', // CHANGE BUILT-IN IMAGE: Nails category hero
  imageAlt: 'Nail Couture & Artistry',
};

export function CategoryHero({ kind }: CategoryHeroProps) {
  const cfg = kind === 'NAILS' ? NAILS_CONFIG : HAIR_CONFIG;
  const accent = cfg.accentColor;

  return (
    <section className="relative overflow-hidden bg-[#171211] text-white">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.6,
        }}
      />

      <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:grid md:min-h-[540px] md:grid-cols-12">
          <div className="relative mx-0 h-[200px] overflow-hidden sm:h-[260px] md:col-span-5 md:col-start-8 md:row-start-1 md:mx-0 md:h-auto md:min-h-full">
            <Image
              src={cfg.image}
              alt={cfg.imageAlt}
              fill
              className="object-cover object-[center_18%] md:object-center"
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-transparent to-transparent opacity-80 md:bg-gradient-to-r md:opacity-100" />
          </div>

          <div className="flex flex-col justify-center space-y-3 py-6 pr-0 md:col-span-7 md:col-start-1 md:row-start-1 md:space-y-6 md:py-20 md:pr-10">
            <h1
              className="font-display text-[1.7rem] font-normal leading-[1.12] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
              style={{ color: kind === 'NAILS' ? accent : 'white' }}
            >
              {cfg.title}
            </h1>

            <div className="h-px w-10" style={{ background: `${accent}40` }} />

            <p className="max-w-md text-sm font-light leading-relaxed text-[#A99B95] md:text-base">
              {cfg.body}
            </p>

            <div>
              <Link
                href={cfg.ctaHref}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 sm:w-auto md:px-6 md:py-3"
                style={{
                  borderColor: accent,
                  color: accent,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = accent;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = accent;
                }}
              >
                {cfg.ctaLabel}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 sm:gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold text-white">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A99B95]">
                  {kind === 'HAIR' ? 'Braid Looks' : 'Nail Designs'}
                </span>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold text-white">12+</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A99B95]">Studio Artists</span>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold text-white">4.9★</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A99B95]">Client Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-30 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
        }}
      />
    </section>
  );
}
