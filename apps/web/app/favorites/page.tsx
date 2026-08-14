'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';

interface Favorite {
  id: string;
  targetType: string;
  targetId: string;
}

export default function FavoritesPage() {
  const favorites = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api<Favorite[]>('/api/favorites'),
  });

  const items = favorites.data ?? [];

  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Personal Collection"
        title="Saved Lookbook."
        body="Your saved braid styles, nail shapes, and preferred beauty studios."
      />

      {favorites.isError ? (
        <div className="rounded-3xl border border-ink/10 bg-paper p-10 text-center">
          <p className="font-display text-3xl text-ink">Authentication Required</p>
          <p className="mt-2 text-sm text-muted">Please sign in to save and access your favorite styles.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/login" variant="gold">
              Sign In to Atelier
            </Button>
          </div>
        </div>
      ) : null}

      {favorites.isSuccess && items.length === 0 ? (
        <div className="rounded-3xl border border-ink/8 bg-paper py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15 text-2xl text-champagneMuted">
            ♥️
          </div>
          <p className="mt-4 font-display text-3xl text-ink">No saved favorites yet</p>
          <p className="mt-2 text-sm text-muted">Tap the heart icon on any style or studio in the lookbook to save it here.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/discover" variant="gold">
              Explore Lookbook
            </Button>
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-ink/8 bg-paper p-5 shadow-sm">
              <span className="rounded-full bg-champagne/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C6D14]">
                {item.targetType.toLowerCase().replace('_', ' ')}
              </span>
              <p className="mt-3 font-display text-2xl font-medium text-ink">Item #{item.targetId.slice(0, 8)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Container>
  );
}

