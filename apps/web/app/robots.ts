import type { MetadataRoute } from 'next';
import { PUBLIC_SITE_URL } from '@/lib/look-share';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
