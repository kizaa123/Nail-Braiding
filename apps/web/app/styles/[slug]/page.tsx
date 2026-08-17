import type { Metadata } from 'next';
import { requestOrigin } from '@/lib/look-share';
import { dbGetPublicStyleBySlug } from '@/lib/studio-db';
import { loadPublicStyles } from '@/lib/public-catalog';
import { STUDIO_LOCATION, STUDIO_NAME } from '@/lib/studio-bookings';
import { StyleDetailClient } from './style-detail-client';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const origin = await requestOrigin();
  const style = await dbGetPublicStyleBySlug(slug);
  const photo = `${origin}/og/${encodeURIComponent(slug)}/photo.jpg`;
  const title = style ? `${style.name} · ${STUDIO_NAME}` : 'Style — KAS Beauty Plus';
  const description = style
    ? `Book ${style.name} at ${STUDIO_NAME}, ${STUDIO_LOCATION}.`
    : `Book this look at ${STUDIO_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/styles/${slug}` },
    openGraph: {
      type: 'website',
      url: `${origin}/styles/${slug}`,
      siteName: STUDIO_NAME,
      title,
      description,
      images: [{ url: photo, width: 1080, height: 1080, alt: style?.name ?? 'Look', type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [photo],
    },
  };
}

export default async function StyleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialStyles = await loadPublicStyles();
  return <StyleDetailClient slug={slug} initialStyles={initialStyles} />;
}
