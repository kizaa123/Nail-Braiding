import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/look-share';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteOrigin();
  const paths = ['', '/styles', '/about', '/contact'];
  return paths.map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.8,
  }));
}
