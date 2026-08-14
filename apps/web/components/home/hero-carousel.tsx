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
  nailCard: {
    image: string;
    title: string;
    subtitle: string;
    tag: string;
  };
  braidCard: {
    image: string;
    title: string;
    subtitle: string;
    tag: string;
  };
}

const slides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: 'NAILS. BRAIDS. CONFIDENCE.',
    headlineLine1: 'YOUR BEAUTY.',
    headlineLine2: 'YOUR STYLE.',
    scriptTagline: 'Your signature look starts here.',
    bigHeroImage: '/hero-portrait-1.jpg',
    nailCard: {
      image: 'https://images.unsplash.com/photo-1632345031435-8217dcdd2ee1?auto=format&fit=crop&w=600&q=80',
      title: 'NAIL DESIGNS',
      subtitle: 'Explore Now',
      tag: 'French Couture',
    },
    braidCard: {
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
      title: 'HAIR BRAIDS',
      subtitle: 'Explore Now',
      tag: 'Knotless Braids',
    },
  },
  {
    id: 2,
    eyebrow: 'KNOTLESS. BOHO. FULANI.',
    headlineLine1: 'REGAL ELEGANCE.',
    headlineLine2: 'CULTURE & GLAMOUR.',
    scriptTagline: 'Crafted with precision & care.',
    bigHeroImage: '/hero-portrait-2.jpg',
    nailCard: {
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      title: 'CHROME COUTURE',
      subtitle: 'Explore Now',
      tag: 'Mirror Polish',
    },
    braidCard: {
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
      title: 'FULANI BRAIDS',
      subtitle: 'Explore Now',
      tag: 'Gold Cuffs',
    },
  },
  {
    id: 3,
    eyebrow: 'CHROME. FRENCH TIPS. GEL-X.',
    headlineLine1: 'STATEMENT NAILS.',
    headlineLine2: 'BOHEMIAN WAVES.',
    scriptTagline: 'Elegance down to your fingertips.',
    bigHeroImage: '/hero-portrait-3.jpg',
    nailCard: {
      image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=600&q=80',
      title: 'CAT EYE GEL',
      subtitle: 'Explore Now',
      tag: 'Magnetic Glow',
    },
    braidCard: {
      image: 'https://images.unsplash.com/photo-1595475878912-0e881b6273df?auto=format&fit=crop&w=600&q=80',
      title: 'BOHO BRAIDS',
      subtitle: 'Explore Now',
      tag: 'Curly Waves',
    },
  },
  {
    id: 4,
    eyebrow: 'TOP RATED PROFESSIONALS.',
    headlineLine1: 'LUXURY COUTURE.',
    headlineLine2: 'STUDIO EXPERIENCE.',
    scriptTagline: 'Book your dream transformation.',
    bigHeroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=80',
    nailCard: {
      image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80',
      title: 'ALMOND GEL-X',
      subtitle: 'Explore Now',
      tag: 'Tapered Shape',
    },
    braidCard: {
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
      title: 'GODDESS LOCS',
      subtitle: 'Explore Now',
      tag: 'Textured Locs',
    },
  },
];

export function HeroCarousel() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Auto-play the single unified hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[activeSlideIndex]!;

  return (
    <section className="relative min-h-[88vh] lg:min-h-[92vh] w-full bg-[#120D0D] text-white overflow-hidden flex flex-col justify-between pt-4 pb-20">
      
      {/* ── BIG HERO MODEL PORTRAIT CAROUSEL (RIGHT-CENTER POSITIONED & CLEAR) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Model Image wrapper positioned right-center so the portrait face, hair & nails pop */}
            <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[62%] h-full">
              <Image
                src={slide.bigHeroImage}
                alt={slide.headlineLine1}
                fill
                priority={index === 0}
                className="object-cover object-center scale-100 transition-transform duration-[8000ms] ease-out"
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
              {/* Fade edges into dark background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#120D0D] via-transparent to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#120D0D]/60 via-transparent to-[#120D0D]" />
            </div>

            {/* Dark gradient for text readability on left side */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#120D0D] via-[#120D0D]/90 to-transparent lg:w-[50%]" />
          </div>
        ))}
      </div>

      {/* ── Main Container Grid ── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16 pt-8 md:pt-14 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow">
        
        {/* ── Left Content Column (7 cols on desktop) ── */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start space-y-6 max-w-2xl">
          
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#D87D7D]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D87D7D]">
              {currentSlide.eyebrow}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.02]">
            {currentSlide.headlineLine1} <br />
            {currentSlide.headlineLine2}
          </h1>

          {/* Cursive Tagline */}
          <p className="font-script text-3xl sm:text-4xl text-[#D87D7D] -mt-2 tracking-wide leading-none">
            {currentSlide.scriptTagline}
          </p>

          {/* Body Description */}
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-lg font-light pt-2">
            Discover trending hairstyles and nail designs. Book with top beauty professionals near you.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Link
              href="/styles"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D87D7D] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-[#C66B6B] hover:scale-105 active:scale-95 transition-all"
            >
              <span>EXPLORE STYLES</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/professionals"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/15 hover:border-white/60 active:scale-95 transition-all"
            >
              FIND A PROFESSIONAL
            </Link>
          </div>

          {/* ── Stats Bar (Bottom Left) ── */}
          <div className="pt-10 w-full">
            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-6 border-t border-white/15">
              
              {/* Stat 1: Professionals */}
              <div className="flex items-center gap-3">
                <div className="text-[#D87D7D]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">2,500+</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">Beauty Professionals</p>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-white/15" />

              {/* Stat 2: Happy Clients */}
              <div className="flex items-center gap-3">
                <div className="text-[#D87D7D]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">15K+</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">Happy Clients</p>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-white/15" />

              {/* Stat 3: Bookings Completed */}
              <div className="flex items-center gap-3">
                <div className="text-[#D87D7D]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">25K+</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">Bookings Completed</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Right Small Cards (Synced to Main Carousel) ── */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-6 justify-center items-end w-full">
          
          {/* ── CARD 1: NAIL DESIGNS (SYNCED TO HERO CAROUSEL SLIDE) ── */}
          <Link
            href="/styles?kind=NAILS"
            className="group relative w-full sm:w-1/2 lg:w-72 rounded-2xl overflow-hidden bg-[#241C1C]/80 border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#D87D7D]/70"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              {slides.map((slide, idx) => (
                <div
                  key={`nail-${slide.id}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === activeSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={slide.nailCard.image}
                    alt={slide.nailCard.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1616] via-transparent to-black/20" />
                </div>
              ))}

              {/* Next slide arrow button — advances the overall Hero Carousel */}
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Carousel Slide"
                className="absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="p-4 bg-[#1F1818]/90">
              <h2 className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#D87D7D] transition-colors">
                {currentSlide.nailCard.title}
              </h2>
              <p className="text-[11px] text-white/70 font-light mt-0.5 flex items-center justify-between">
                <span>{currentSlide.nailCard.subtitle}</span>
                <span className="text-[10px] text-[#D87D7D] font-semibold">{currentSlide.nailCard.tag}</span>
              </p>
            </div>
          </Link>

          {/* ── CARD 2: HAIR BRAIDS (SYNCED TO HERO CAROUSEL SLIDE) ── */}
          <Link
            href="/styles?kind=HAIR"
            className="group relative w-full sm:w-1/2 lg:w-72 rounded-2xl overflow-hidden bg-[#241C1C]/80 border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#D87D7D]/70"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden">
              {slides.map((slide, idx) => (
                <div
                  key={`braid-${slide.id}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === activeSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={slide.braidCard.image}
                    alt={slide.braidCard.title}
                    fill
                    className="object-cover object-top"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1616] via-transparent to-black/20" />
                </div>
              ))}

              {/* Next slide arrow button — advances the overall Hero Carousel */}
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Carousel Slide"
                className="absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="p-4 bg-[#1F1818]/90">
              <h2 className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#D87D7D] transition-colors">
                {currentSlide.braidCard.title}
              </h2>
              <p className="text-[11px] text-white/70 font-light mt-0.5 flex items-center justify-between">
                <span>{currentSlide.braidCard.subtitle}</span>
                <span className="text-[10px] text-[#D87D7D] font-semibold">{currentSlide.braidCard.tag}</span>
              </p>
            </div>
          </Link>

        </div>

      </div>

      {/* ── Bottom Main Hero Carousel Indicators (Dots) ── */}
      <div className="relative z-20 flex items-center justify-center gap-3 pb-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveSlideIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeSlideIndex
                ? 'w-8 bg-[#D87D7D]'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ── Organic Bottom Wave Curve Divider ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-14 lg:h-16 text-[#F9F6F0] preserve-3d"
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
