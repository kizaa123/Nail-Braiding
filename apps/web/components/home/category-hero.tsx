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
  mobileBody: 'Knotless, cornrow, box braid, and twist — styled in the studio.',
  ctaLabel: 'BROWSE BRAIDS & BOOK',
  ctaHref: '/styles?kind=HAIR#styles-grid',
  image: '/stitch-braids-hero-scaled-1.jpg', // CHANGE BUILT-IN IMAGE: Hair category hero
  imageAlt: 'Hair Braiding & Protective Styles',
  imageClass: 'object-cover object-[28%_42%] md:object-[30%_center]',
};

const NAILS_CONFIG = {
  accentColor: '#C9A46A',
  title: 'Nail Couture & Artistry',
  body: 'Explore beautiful nail designs, from timeless classics to modern artistic details, created to complement your style and make every look feel uniquely yours.',
  mobileBody: 'Classic, chrome, and custom art to finish the look.',
  ctaLabel: 'BROWSE NAILS & BOOK',
  ctaHref: '/styles?kind=NAILS#styles-grid',
  image: '/julynails_recirc-0b2f36695d8c42e58c108cb59e406fcc.jpg', // CHANGE BUILT-IN IMAGE: Nails category hero
  imageAlt: 'Nail Couture & Artistry',
  imageClass: 'object-cover object-[center_55%] md:object-center',
};

function HeroCopy({
  kind,
  cfg,
  accent,
  compact,
}: {
  kind: 'HAIR' | 'NAILS';
  cfg: typeof HAIR_CONFIG;
  accent: string;
  compact?: boolean;
}) {
  return (
    <>
      <h1
        className={`font-display font-normal leading-[1.12] ${
          compact
            ? 'text-[1.85rem] drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]'
            : 'text-[1.7rem] sm:text-4xl md:text-5xl lg:text-[3.5rem]'
        }`}
        style={{ color: kind === 'NAILS' ? accent : 'white' }}
      >
        {cfg.title}
      </h1>
      <div className="h-px w-10" style={{ background: `${accent}40` }} />
      <p
        className={`max-w-md font-light leading-relaxed ${
          compact ? 'text-[13px] text-white/85' : 'text-sm text-[#A99B95] md:text-base'
        }`}
      >
        {compact ? cfg.mobileBody : cfg.body}
      </p>
      <div>
        <Link
          href={cfg.ctaHref}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 sm:w-auto md:px-6 md:py-3"
          style={{ borderColor: accent, color: accent, background: 'rgba(23,18,17,0.35)' }}
        >
          {cfg.ctaLabel}
        </Link>
      </div>
      {compact ? null : (
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
      )}
    </>
  );
}

export function CategoryHero({ kind }: CategoryHeroProps) {
  const cfg = kind === 'NAILS' ? NAILS_CONFIG : HAIR_CONFIG;
  const accent = cfg.accentColor;

  return (
    <section className="relative overflow-hidden bg-[#171211] text-white">
      <div className="relative md:hidden">
        <div className="relative h-[min(52dvh,430px)] w-full overflow-hidden">
          <Image
            src={cfg.image}
            alt={cfg.imageAlt}
            fill
            className={cfg.imageClass}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-[#171211]/70 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-5 pb-7 pt-24">
            <HeroCopy kind={kind} cfg={cfg} accent={accent} compact />
          </div>
        </div>
      </div>

      <div className="relative z-20 hidden md:mx-auto md:block md:max-w-7xl md:px-8 lg:px-12">
        <div className="md:grid md:min-h-[540px] md:grid-cols-12">
          <div className="relative overflow-hidden md:col-span-5 md:col-start-8 md:row-start-1 md:min-h-full">
            <Image
              src={cfg.image}
              alt={cfg.imageAlt}
              fill
              className={cfg.imageClass}
              priority
              sizes="42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171211]/70 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-center space-y-6 md:col-span-7 md:col-start-1 md:row-start-1 md:py-20 md:pr-10">
            <HeroCopy kind={kind} cfg={cfg} accent={accent} />
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
