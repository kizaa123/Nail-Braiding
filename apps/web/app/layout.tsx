import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppChrome } from '@/components/layout/app-chrome';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KAS Beauty Plus — Hair Braiding & Nail Booking',
    template: '%s · KAS Beauty Plus',
  },
  description:
    "Adding values to God's creation. Discover braids, twists, locs, and nail art. Book KAS Beauty Plus in Cape Coast, UCC Campus via WhatsApp.",
  icons: {
    icon: '/kas-beauty-plus-logo-gold.png',
    apple: '/kas-beauty-plus-logo-gold.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'KAS Beauty Plus',
    title: "KAS Beauty Plus — adding values to God's creation",
    description: 'Luxury hair braiding and nail couture in Cape Coast, UCC Campus.',
    images: ['/kas-beauty-plus-logo-gold.png'],
  },
  twitter: {
    card: 'summary',
    title: 'KAS Beauty Plus',
    description: "Adding values to God's creation. Book hair braiding and nail couture in Cape Coast, UCC Campus.",
  },
  robots: { index: true, follow: true },
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
