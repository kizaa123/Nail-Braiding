import { Suspense } from 'react';
import { loadPublicStyles } from '@/lib/public-catalog';
import { StylesPageSkeleton } from '@/components/ui/skeleton';
import { StylesIndexClient } from './styles-index-client';

export const dynamic = 'force-dynamic';

export default async function StylesIndexPage() {
  const initialStyles = await loadPublicStyles();
  return (
    <Suspense fallback={<StylesPageSkeleton />}>
      <StylesIndexClient initialStyles={initialStyles} />
    </Suspense>
  );
}
