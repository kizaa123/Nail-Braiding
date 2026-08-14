import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, Alex_Brush } from 'next/font/google';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileDock } from '@/components/layout/mobile-dock';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const script = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Noir Atelier — Hair Braiding & Nail Booking',
    template: '%s · Noir Atelier',
  },
  description:
    'Discover braids, twists, locs, and nail art. Book trusted beauty professionals in Ghana via WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Noir Atelier',
    title: 'Noir Atelier — Your beauty. Your style.',
    description: 'A premium marketplace for hair braiding and nail services.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noir Atelier',
    description: 'Discover your next signature look.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${script.variable} min-h-screen bg-ivory text-ink antialiased`}>
        <QueryProvider>
          <SiteHeader />
          <main className="pb-24 md:pb-0">{children}</main>
          <SiteFooter />
          <MobileDock />
        </QueryProvider>
      </body>
    </html>
  );
}
