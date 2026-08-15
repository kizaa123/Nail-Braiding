import type { Metadata } from 'next';
import { StyleDetailClient } from './style-detail-client';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: 'Style — KAS Beauty Plus',
    alternates: { canonical: `/styles/${slug}` },
  };
}

export default async function StyleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StyleDetailClient slug={slug} />;
}
