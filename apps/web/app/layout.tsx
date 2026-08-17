import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppChrome } from '@/components/layout/app-chrome';
import './globals.css';

function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env && !/localhost|127\.0\.0\.1/i.test(env)) return env;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return env || 'http://localhost:3000';
}

const siteUrlResolved = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrlResolved),
  title: {
    default: 'KAS Beauty Plus — Hair Braiding & Nail Booking',
    template: '%s · KAS Beauty Plus',
  },
  description:
    "Adding values to God's creation. Discover braids, twists, locs, and nail art. Book KAS Beauty Plus in Cape Coast, UCC Campus via WhatsApp.",
  icons: {
    icon: [
      { url: '/kas-beauty-plus-logo.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/kas-beauty-plus-logo.png',
    shortcut: '/kas-beauty-plus-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'KAS Beauty Plus',
    title: "KAS Beauty Plus — adding values to God's creation",
    description: 'Luxury hair braiding and nail couture in Cape Coast, UCC Campus.',
    images: [
      {
        url: '/kas-beauty-plus-logo.png',
        width: 1200,
        height: 1200,
        alt: 'KAS Beauty Plus logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAS Beauty Plus',
    description: "Adding values to God's creation. Book hair braiding and nail couture in Cape Coast, UCC Campus.",
    images: ['/kas-beauty-plus-logo.png'],
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'zkuP7wHzgdC4pCNBAWWJ4AuXZKkpYIvRkLaViOnSuHg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <QueryProvider>
          <AppChrome>{children}</AppChrome>
        </QueryProvider>
      </body>
    </html>
  );
}
