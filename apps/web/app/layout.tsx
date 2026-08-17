import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppChrome } from '@/components/layout/app-chrome';
import { siteOrigin } from '@/lib/look-share';
import './globals.css';

const siteUrlResolved = siteOrigin();

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
    google: 'FJr-xuQsTBtvIJjWX4sIlkirNFHssRPBgZWdj-weNfQ',
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
