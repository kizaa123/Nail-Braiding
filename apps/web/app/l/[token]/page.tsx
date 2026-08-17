import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeLookShareToken, publicLookImageUrl, requestOrigin } from '@/lib/look-share';
import { STUDIO_LOCATION, STUDIO_NAME } from '@/lib/studio-bookings';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const look = decodeLookShareToken(token);
  if (!look) return { title: 'Look' };
  const origin = await requestOrigin();
  const photo = publicLookImageUrl(look.u, origin) || `${origin}/l/${token}/image`;
  const title = `${look.n} · ${STUDIO_NAME}`;
  const description = `Book ${look.n} at ${STUDIO_NAME}, ${STUDIO_LOCATION}.`;
  return {
    title: look.n,
    description,
    metadataBase: new URL(origin),
    openGraph: {
      type: 'website',
      url: `${origin}/l/${token}`,
      siteName: STUDIO_NAME,
      title,
      description,
      images: [{ url: photo, width: 1080, height: 1080, alt: look.n, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [photo],
    },
  };
}

export default async function LookSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const look = decodeLookShareToken(token);
  if (!look) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center bg-[#171211] px-5 py-10 text-center text-[#FAF7F2]">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A46A]">{STUDIO_NAME}</p>
      <h1 className="mt-3 font-display text-4xl">{look.n}</h1>
      <p className="mt-2 text-sm text-[#A99B95]">{STUDIO_LOCATION}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/l/${token}/image`} alt={look.n} className="mt-8 w-full rounded-[28px] object-cover" />
      <Link
        href="/styles"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#C9A46A] px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#171211]"
      >
        Book this look
      </Link>
    </main>
  );
}
