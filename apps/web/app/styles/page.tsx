'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/section';
import { StyleCard } from '@/components/cards/cards';
import { CategoryHero } from '@/components/home/category-hero';
import { Stagger } from '@/components/motion/reveal';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';
import { StylesPageSkeleton } from '@/components/ui/skeleton';

const categoryPills = [
  { id: 'all', label: 'All' },
  { id: 'braids', label: 'Braids' },
  { id: 'nails', label: 'Nails' },
  { id: 'locs', label: 'Locs' },
  { id: 'weaves', label: 'Weaves' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'treatments', label: 'Treatments' },
];

function scrollToStyles() {
  document.getElementById('styles-grid')?.scrollIntoView({ behavior: 'smooth' });
}

export default function StylesIndexPage() {
  const searchParams = useSearchParams();
  const kind = searchParams.get('kind')?.toUpperCase() ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { publicStyles, ready } = useStudioCatalog();

  const rows = useMemo(() => {
    return publicStyles.filter((s) => {
      const matchKind = kind === '' || s.kind === kind;
      const matchCat =
        selectedCategory === 'all' ||
        s.kind.toLowerCase().includes(selectedCategory) ||
        s.categoryName.toLowerCase().includes(selectedCategory) ||
        s.name.toLowerCase().includes(selectedCategory);
      const matchQuery =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKind && matchCat && matchQuery;
    });
  }, [kind, selectedCategory, searchQuery, publicStyles]);

  const heroBody =
    kind === 'HAIR'
      ? 'Knotless braids, boho curls, fulani braids, goddess locs, and passion twists crafted to perfection.'
      : kind === 'NAILS'
        ? 'Chrome finish, french tips, gel-x extensions, cat eye, and almond shapes.'
        : 'Browse braids, locs, and nail looks, then book with the studio.';

  // CHANGE BUILT-IN IMAGES HERE (Atelier listing hero when kind is not HAIR/NAILS).
  const heroImage =
    kind === 'NAILS'
      ? '/Untitled-1_1_4d5250bb-4670-495d-9de1-f9b24299614b.webp' // CHANGE: nails fallback hero
      : '/stitch-braids-hero-scaled-1.jpg'; // CHANGE: default Atelier hero

  const showCategoryHero = kind === 'HAIR' || kind === 'NAILS';

  if (!ready) return <StylesPageSkeleton />;

  return (
    <div className="min-h-screen bg-[#F7F1EA]">
      {showCategoryHero ? <CategoryHero kind={kind === 'NAILS' ? 'NAILS' : 'HAIR'} /> : (
        <section className="relative overflow-hidden bg-[#F7F1EA] pb-6 md:pb-8">
          <div className="relative lg:min-h-[640px]">
            <nav className="flex items-center gap-2 px-4 pt-4 text-xs font-light text-[#7A6E68] lg:hidden">
              <Link href="/" className="transition-colors hover:text-[#D98282]">Home</Link>
              <span className="text-[#A99B95]">/</span>
              <span className="font-medium text-[#171211]">Atelier</span>
            </nav>

            <div className="relative mx-4 mt-3 h-[220px] overflow-hidden rounded-[22px] bg-[#3A2924] sm:h-[280px] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mt-0 lg:h-auto lg:w-1/2 lg:rounded-[12rem_0_0_12rem]">
              <Image
                src={heroImage}
                alt="Explore Atelier"
                fill
                priority
                className="object-cover object-center lg:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="relative z-10 flex flex-col justify-center px-4 pt-5 pb-2 sm:px-6 lg:min-h-[640px] lg:w-1/2 lg:px-10 lg:py-14 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-12">
              <nav className="mb-8 hidden items-center gap-2 text-xs font-light text-[#7A6E68] lg:flex">
                <Link href="/" className="transition-colors hover:text-[#D98282]">Home</Link>
                <span className="text-[#A99B95]">/</span>
                <span className="font-medium text-[#171211]">Atelier</span>
              </nav>

              <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D98282] lg:mb-5 lg:text-[11px] lg:tracking-[0.22em]">
                <span>✦</span>
                <span>EXPLORE. CHOOSE. BOOK.</span>
              </p>

              <h1 className="font-display text-[2.15rem] font-normal leading-[1.02] text-[#171211] sm:text-[3.4rem] md:text-[4.6rem] xl:text-[5.2rem]">
                Explore
                <span className="mt-0.5 block lg:mt-1">
                  <span className="font-script text-[2.35rem] italic leading-none text-[#D98282] sm:text-[3.6rem] md:text-[5rem] xl:text-[5.4rem]">
                    All
                  </span>{' '}
                  <span className="font-display text-[2.15rem] font-normal text-[#171211] sm:text-[3.4rem] md:text-[4.6rem] xl:text-[5.2rem]">
                    Atelier
                  </span>
                </span>
              </h1>

              <p className="mt-3 max-w-[360px] text-sm font-light leading-relaxed text-[#7A6E68] lg:mt-6 md:text-[15px]">
                {heroBody}
              </p>

              <button
                type="button"
                onClick={scrollToStyles}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#D98282] px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 hover:bg-[#c87070] active:scale-95 sm:w-fit lg:mt-8 lg:py-3.5"
              >
                EXPLORE ATELIER
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-20 bg-[#F7F1EA] py-5 md:py-6">
        <Container>
          <form
            className="flex flex-row items-center gap-2 rounded-full border border-[#EADBCE] bg-white py-1.5 pl-4 pr-1.5 shadow-[0_12px_36px_rgba(23,18,17,0.08)] lg:gap-3 lg:py-2 lg:pl-5 lg:pr-2"
            onSubmit={(event) => {
              event.preventDefault();
              scrollToStyles();
            }}
          >
            <div className="relative flex min-w-0 flex-1 items-center">
              <svg className="hidden h-4 w-4 text-[#A99B95] lg:absolute lg:left-0 lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search looks, services..."
                className="h-10 w-full bg-transparent pr-2 text-sm text-[#171211] outline-none placeholder:text-[#A99B95] lg:h-11 lg:pl-7"
              />
            </div>

            <button
              type="submit"
              aria-label="Search"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D98282] text-white shadow-md transition-all hover:bg-[#c87070] active:scale-95 lg:h-11 lg:w-auto lg:px-8"
            >
              <svg className="h-4 w-4 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden text-xs font-bold uppercase tracking-widest lg:inline">SEARCH</span>
            </button>
          </form>
        </Container>
      </section>

      <section className="bg-[#F7F1EA] pb-2 pt-6">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryPills.map((pill) => {
              const isActive = selectedCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedCategory(pill.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#171211] text-white shadow-md'
                      : 'border border-[#EADBCE] bg-white text-[#7A6E68] hover:border-[#D98282] hover:text-[#171211]'
                  }`}
                >
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="styles-grid" className="py-12 md:py-16">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#A99B95]">
              {rows.length} {rows.length === 1 ? 'look' : 'looks'} available
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="cursor-pointer text-xs font-medium text-[#D98282] hover:underline"
              >
                Clear Search
              </button>
            ) : null}
          </div>

          {rows.length === 0 ? (
            <div className="rounded-3xl border border-[#EADBCE] bg-white py-16 text-center">
              <p className="font-display text-3xl text-[#171211]">No looks found</p>
              <p className="mt-2 text-sm text-[#A99B95]">Try adjusting your search or filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-6 cursor-pointer rounded-full bg-[#171211] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#3A2924]"
              >
                Reset
              </button>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {rows.map((style) => (
                <StyleCard
                  key={style.id}
                  id={style.id}
                  href={`/styles/${style.slug}`}
                  image={style.imageUrl}
                  name={style.name}
                  category={style.categoryName}
                  description={style.description}
                  durationMinutes={style.durationMinutes}
                  priceMinor={style.startingPriceMinor}
                  featured={style.featured}
                />
              ))}
            </Stagger>
          )}
        </Container>
      </section>
    </div>
  );
}
