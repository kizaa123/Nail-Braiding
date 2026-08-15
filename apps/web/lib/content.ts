// CHANGE BUILT-IN IMAGES HERE (shared lookbook photos).
// Used by the home service cards and marquee strip.
// Put files in apps/web/public/ then use a path like '/braids-1.jpg'.
export const editorialImages = {
  hero: '/images (2).jpg', // CHANGE: extra hero photo
  heroAlt: '/julynails_recirc-0b2f36695d8c42e58c108cb59e406fcc.jpg', // CHANGE: extra hero photo
  braids: [
    '/home-hair-card.jpg', // CHANGE: braid 1 (also home Hair card)
    '/61FdJT+sdVL._AC_UF894,1000_QL80_.jpg', // CHANGE: braid 2
    '/Image-of-Box-Braids-With-Heart-in-the-style-of-box-braids-852x1024.jpg', // CHANGE: braid 3
    '/images (17).jpg', // CHANGE: braid 4
    '/images (4).jpg', // CHANGE: braid 5
    '/images (6).jpg', // CHANGE: braid 6
  ],
  nails: [
    '/home-nails-card.jpg', // CHANGE: nail 1 (also home Nails card)
    '/images (11).jpg', // CHANGE: nail 2
    '/images (8).jpg', // CHANGE: nail 3
    '/images.jpg', // CHANGE: nail 4
    '/marquee image.jpg', // CHANGE: nail 5
    '/images (14).jpg', // CHANGE: nail 6
  ],
};

export interface StaticStyle {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  kind: 'HAIR' | 'NAILS';
  description: string;
  imageUrl: string;
  startingPriceMinor: number;
  durationMinutes: number;
  tags: string[];
}

// Booking cards are created in the Admin Atelier — not seeded here.
export const staticStyles: StaticStyle[] = [];

export const howItWorks = [
  { step: '01', title: 'Choose Service', body: 'Pick Hair Braiding or Nail Couture and select your preferred style from our lookbook.' },
  { step: '02', title: 'Pick Date & Time', body: 'Choose your preferred appointment date and time slot at the studio.' },
  { step: '03', title: 'Confirm & Book', body: 'Your booking goes straight to the shop owner via Admin Portal or WhatsApp (0559535682).' },
];

