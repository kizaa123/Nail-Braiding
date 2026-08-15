'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  id: number;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  scriptTagline: string;
  bigHeroImage: string;
  nailCard: { image: string; title: string; subtitle: string; tag: string };
  braidCard: { image: string; title: string; subtitle: string; tag: string };
}

// CHANGE BUILT-IN IMAGES HERE (home hero carousel).
// Put files in apps/web/public/ then use a path like '/hero-1.jpg'.
const slides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: 'NAILS. BRAIDS. CONFIDENCE.',
    headlineLine1: 'YOUR BEAUTY.',
    headlineLine2: 'YOUR STYLE.',
    scriptTagline: 'Book for mordern styles.',
    bigHeroImage: '/side-view-beautiful-woman-with-braids_23-2151429501.avif', // CHANGE: slide 1 full background
    nailCard: {
      image: '/female-hand-shiny-purple-nails-260nw-1144753946.jpg', // CHANGE: slide 1 nail card
      title: 'NAIL DESIGNS',
      subtitle: 'Explore Now',
      tag: 'Local Nails',
    },
    braidCard: {
      image: '/images (11).jpg', // CHANGE: slide 1 braid card
      title: 'HAIR BRAIDS',
      subtitle: 'Explore Now',
      tag: 'Conrrow Braids',
    },
  },
  {
    id: 2,
    eyebrow: 'KAS. Cape Coast. UCC.',
    headlineLine1: 'KAS BEAUTY PLUS.',
    headlineLine2: 'FINISHED WITH CARE.',
    scriptTagline: 'Crafted with precision & care.',
    bigHeroImage: '/Byr_CelebBraidsInspo_LeadRecirc-32be2effa109441d89a8289f0a6fbf06.jpg', // CHANGE: slide 2 full background
    nailCard: {
      image: '/nail designs.jpg', // CHANGE: slide 2 nail card
      title: 'CHROME COUTURE',
      subtitle: 'Explore Now',
      tag: 'Mirror Polish',
    },
    braidCard: {
      image: '/images (18).jpg', // CHANGE: slide 2 braid card
      title: 'Mordern Style',
      subtitle: 'Explore Now',
      tag: 'Knotless',
    },
  },
  {
    id: 3,
    eyebrow: 'ULOCKED. KAS. NAILS.',
    headlineLine1: 'NEW EDITIONS.',
    headlineLine2: 'BEAUTY PLUS WAVES.',
    scriptTagline: 'Elegance down to your fingertips.',
    bigHeroImage: '/1000_F_100088092_jZipbz3VZrzl8oZ9Ug7g8WzOQ0jwRCR1.jpg', // CHANGE: slide 3 full background
    nailCard: {
      image: '/mirror nail (1).jpg', // CHANGE: slide 3 nail card
      title: 'CAT EYE GEL',
      subtitle: 'Explore Now',
      tag: 'Magnetic Glow',
    },
    braidCard: {
      image: '/mirror nail (2).jpg', // CHANGE: slide 3 braid card
      title: 'Twist',
      subtitle: 'Explore Now',
      tag: 'Curly twist',
    },
  },
  {
    id: 4,
    eyebrow: 'TOP RATED STYLES.',
    headlineLine1: 'LUXURY COUTURE.',
    headlineLine2: 'STUDIO EXPERIENCE.',
    scriptTagline: 'Book your next appointment.',
    bigHeroImage: '/1000_F_267922530_rj890f7YQEyxXDrRFxS2sq1BCnUDrWsY.jpg', // CHANGE: slide 4 full background
    nailCard: {
      image: '/images.jpg', // CHANGE: slide 4 nail card
      title: 'ALMOND GEL-X',
      subtitle: 'Explore Now',
      tag: 'Tapered Shape',
    },
    braidCard: {
      image: '/30733a5dab418c5534fe4180050b3d04.jpg', // CHANGE: slide 4 braid card
      title: 'NATURAL HAIR',
      subtitle: 'Explore Now',
      tag: 'Textured Hair',
    },
  },
];

export function HeroCarousel({ initialSlideIndex = 0 }: { initialSlideIndex?: number }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialSlideIndex);
  const currentSlide = slides[activeSlideIndex] ?? slides[0]!;

  useEffect(() => {
    setActiveSlideIndex(initialSlideIndex);
  }, [initialSlideIndex]);

  // 7 second smooth autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-0 w-full flex-col justify-between overflow-hidden bg-[#171211] pt-2 pb-16 text-white sm:pt-4 sm:pb-20 lg:min-h-[92vh]">

      {/* ── Background big hero portrait (full-bleed crossfade) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Portrait sits in the center-right (w-full lg:w-[60%] xl:w-[58%]) */}
              <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[60%] xl:w-[58%] h-full">
                <Image
                  src={slide.bigHeroImage}
                  alt={slide.headlineLine1}
                  fill
                  priority={index === 0}
                  className="object-cover object-[center_18%] lg:object-center"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-[#171211] via-transparent to-transparent lg:block" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#171211]/80 via-[#171211]/50 to-[#171211] lg:from-[#171211]/60 lg:via-transparent" />
              </div>
              <div className="absolute inset-0 bg-[#171211]/40 lg:w-[52%] lg:bg-gradient-to-r lg:from-[#171211] lg:via-[#171211]/90 lg:to-transparent" />
            </div>
          );
        })}
      </div>

      {/* ── Main 12-col Grid ── */}
      <div className="relative z-20 mx-auto grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-5 px-4 pb-6 pt-4 sm:px-6 sm:pt-8 md:px-12 md:pt-12 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:pb-10">

        {/* ── Left Content (cols 1-7): Jitter-free CSS Grid Stack (all slides occupy same space) ── */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start max-w-2xl">

          {/* Stacked Headlines Container — zero height shift or shaking */}
          <div className="grid min-h-[148px] w-full grid-cols-1 grid-rows-1 sm:min-h-[240px] md:min-h-[260px]">
            {slides.map((slide, index) => {
              const isActive = index === activeSlideIndex;
              return (
                <div
                  key={slide.id}
                  className={`col-start-1 row-start-1 flex flex-col items-start justify-center space-y-2.5 transition-all duration-700 ease-out sm:space-y-4 ${
                    isActive
                      ? 'z-10 translate-y-0 opacity-100 pointer-events-auto'
                      : 'z-0 -translate-y-2 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="h-[2px] w-6 bg-[#D98282] sm:w-8" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282] sm:text-xs sm:tracking-[0.25em]">
                      {slide.eyebrow}
                    </span>
                  </div>

                  <h1 className="font-display text-[2.05rem] font-normal uppercase leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.headlineLine1} <br />
                    {slide.headlineLine2}
                  </h1>

                  <p className="font-script text-[1.65rem] italic leading-none tracking-wide text-[#D98282] sm:text-3xl md:text-4xl">
                    {slide.scriptTagline}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="max-w-lg pt-2 text-[13px] font-light leading-relaxed text-[#A99B95] sm:text-sm md:text-base">
            Discover trending hairstyles and nail designs. Book with top beauty professionals near you.
          </p>

          <div className="flex w-full flex-col items-stretch gap-2.5 pt-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/styles"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D98282] px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:bg-[#c87070] active:scale-95 sm:min-h-0 sm:px-8 sm:py-3.5 sm:text-xs"
            >
              EXPLORE ATELIER
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15 active:scale-95 sm:min-h-0 sm:px-8 sm:py-3.5 sm:text-xs"
            >
              ABOUT THE STUDIO
            </Link>
          </div>

          {/* Stats row */}
          <div className="w-full pt-4 sm:pt-6">
            <div className="flex flex-wrap items-center gap-4 border-t border-white/15 pt-4 sm:gap-6 sm:pt-5 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="text-[#D98282]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">2,500+</p>
                  <p className="text-[10px] text-[#A99B95] uppercase tracking-wider mt-1">Beauty Professionals</p>
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-white/15" />
              <div className="flex items-center gap-3">
                <div className="text-[#D98282]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">15K+</p>
                  <p className="text-[10px] text-[#A99B95] uppercase tracking-wider mt-1">Happy Clients</p>
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-white/15" />
              <div className="flex items-center gap-3">
                <div className="text-[#D98282]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">25K+</p>
                  <p className="text-[10px] text-[#A99B95] uppercase tracking-wider mt-1">Bookings Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Small Cards: Shifted to the far right edge to leave big hero model portrait completely clear ── */}
        <div className="grid min-h-0 w-full grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:ml-auto lg:flex lg:min-h-[460px] lg:translate-x-8 lg:flex-col lg:items-end lg:justify-between lg:gap-14 xl:translate-x-12 2xl:translate-x-16">

          {/* NAIL Card (Top-Right) */}
          <Link
            href="/styles?kind=NAILS"
            className="group relative w-full overflow-hidden rounded-xl border border-white/15 bg-[#3A2924]/85 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#D98282]/70 hover:shadow-[#D98282]/10 sm:rounded-2xl lg:w-60 xl:w-68"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
              {slides.map((slide, idx) => (
                <div
                  key={`nail-${slide.id}`}
                  className="absolute inset-0"
                  style={{
                    opacity: idx === activeSlideIndex ? 1 : 0,
                    transition: 'opacity 700ms ease-in-out',
                  }}
                >
                  <Image
                    src={slide.nailCard.image}
                    alt={slide.nailCard.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-transparent to-black/15" />
                </div>
              ))}
              {/* Tag badge top-left */}
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D98282] border border-[#D98282]/30">
                {currentSlide.nailCard.tag}
              </span>
            </div>
            <div className="bg-[#171211]/90 px-2.5 py-2 sm:px-3.5 sm:py-2.5">
              <h2 className="text-[10px] font-bold uppercase leading-none tracking-wider text-white transition-colors group-hover:text-[#D98282] sm:text-[11px]">
                {currentSlide.nailCard.title}
              </h2>
              <p className="mt-1 hidden text-[10px] font-light text-[#A99B95] sm:block">{currentSlide.nailCard.subtitle}</p>
            </div>
          </Link>

          {/* HAIR Card (Bottom-Right) */}
          <Link
            href="/styles?kind=HAIR"
            className="group relative w-full overflow-hidden rounded-xl border border-white/15 bg-[#3A2924]/85 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#D98282]/70 hover:shadow-[#D98282]/10 sm:rounded-2xl lg:w-60 xl:w-68"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
              {slides.map((slide, idx) => (
                <div
                  key={`braid-${slide.id}`}
                  className="absolute inset-0"
                  style={{
                    opacity: idx === activeSlideIndex ? 1 : 0,
                    transition: 'opacity 700ms ease-in-out',
                  }}
                >
                  <Image
                    src={slide.braidCard.image}
                    alt={slide.braidCard.title}
                    fill
                    className="object-cover object-top"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171211] via-transparent to-black/15" />
                </div>
              ))}
              {/* Tag badge top-left */}
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D98282] border border-[#D98282]/30">
                {currentSlide.braidCard.tag}
              </span>
            </div>
            <div className="bg-[#171211]/90 px-2.5 py-2 sm:px-3.5 sm:py-2.5">
              <h2 className="text-[10px] font-bold uppercase leading-none tracking-wider text-white transition-colors group-hover:text-[#D98282] sm:text-[11px]">
                {currentSlide.braidCard.title}
              </h2>
              <p className="mt-1 hidden text-[10px] font-light text-[#A99B95] sm:block">{currentSlide.braidCard.subtitle}</p>
            </div>
          </Link>

        </div>

      </div>

      {/* ── Dot Navigation: Clean circular dots with reduced spacing ── */}
      <div className="relative z-20 flex items-center justify-center gap-2.5 pb-3 sm:pb-6">
        {slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlideIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-125"
            >
              <span
                className="block transition-all duration-300 ease-out"
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#D98282' : 'rgba(255, 255, 255, 0.35)',
                  boxShadow: isActive ? '0 0 8px rgba(217, 130, 130, 0.6)' : 'none',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Bottom Wave Divider ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-14 lg:h-16 text-[#F7F1EA]"
        >
          <path
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}

