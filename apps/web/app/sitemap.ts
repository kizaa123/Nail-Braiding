import type { MetadataRoute } from 'next';
import { PUBLIC_SITE_URL } from '@/lib/look-share';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = PUBLIC_SITE_URL;
  const paths = ['', '/styles', '/about', '/contact'];
  return paths.map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.8,
  }));
}
