import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/look-share';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const site = siteOrigin();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: `${site}/sitemap.xml`,
  };
}
