export const editorialImages = {
  hero: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=80',
  heroAlt: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=80',
  braids: [
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1595475878912-0e881b6273df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80',
  ],
  nails: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1632345031435-8217dcdd2ee1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1632345031435-8217dcdd2ee1?auto=format&fit=crop&w=900&q=80',
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

export const staticStyles: StaticStyle[] = [
  // ─── HAIR BRAIDING ─────────────────────────────────────────────────────────
  {
    id: 'h1',
    slug: 'knotless-braids',
    name: 'Knotless Braids',
    categoryName: 'Protective Braids',
    kind: 'HAIR',
    description: 'A tension-free protective style where each braid starts with natural hair and gradually incorporates extensions. Gentle on edges and scalp, perfect for long-term wear.',
    imageUrl: editorialImages.braids[0]!,
    startingPriceMinor: 35000,
    durationMinutes: 180,
    tags: ['Knotless', 'Protective', 'Lightweight'],
  },
  {
    id: 'h2',
    slug: 'boho-braids',
    name: 'Boho Braids',
    categoryName: 'Protective Braids',
    kind: 'HAIR',
    description: 'Romantic, carefree knotless braids with flowing curly ends. A gorgeous mix of braids and loose waves that gives a bohemian, natural look.',
    imageUrl: editorialImages.braids[1]!,
    startingPriceMinor: 48000,
    durationMinutes: 240,
    tags: ['Boho', 'Curly Ends', 'Romantic'],
  },
  {
    id: 'h3',
    slug: 'goddess-braids',
    name: 'Goddess Braids',
    categoryName: 'Protective Braids',
    kind: 'HAIR',
    description: 'Thick, cornrow-style braids close to the scalp styled into elaborate patterns. Regal, timeless and great for occasions and everyday elegance.',
    imageUrl: editorialImages.braids[2]!,
    startingPriceMinor: 40000,
    durationMinutes: 150,
    tags: ['Goddess', 'Cornrow', 'Regal'],
  },
  {
    id: 'h4',
    slug: 'fulani-braids',
    name: 'Fulani Braids',
    categoryName: 'Protective Braids',
    kind: 'HAIR',
    description: 'Inspired by the Fulani people of West Africa — centrally parted cornrows or braids, accented with beads, cuffs, and unique side patterns.',
    imageUrl: editorialImages.braids[3]!,
    startingPriceMinor: 38000,
    durationMinutes: 180,
    tags: ['Fulani', 'Cultural', 'Beads'],
  },
  {
    id: 'h5',
    slug: 'passion-twists',
    name: 'Passion Twists',
    categoryName: 'Twists & Locs',
    kind: 'HAIR',
    description: 'Effortlessly gorgeous two-strand twists done with wavy, textured hair extensions. Lightweight, stunning and full of personality.',
    imageUrl: editorialImages.braids[4]!,
    startingPriceMinor: 32000,
    durationMinutes: 180,
    tags: ['Twists', 'Wavy', 'Lightweight'],
  },
  {
    id: 'h6',
    slug: 'goddess-locs',
    name: 'Goddess Locs',
    categoryName: 'Twists & Locs',
    kind: 'HAIR',
    description: 'Free-flowing, textured faux locs with curly wisps at the ends and throughout. A gorgeous bohemian loc style that feels organic and ethereal.',
    imageUrl: editorialImages.braids[5]!,
    startingPriceMinor: 55000,
    durationMinutes: 300,
    tags: ['Locs', 'Faux Locs', 'Bohemian'],
  },

  // ─── NAIL COUTURE ──────────────────────────────────────────────────────────
  {
    id: 'n1',
    slug: 'french-tips',
    name: 'French Tips',
    categoryName: 'Nail Art',
    kind: 'NAILS',
    description: 'The timeless classic — nude or soft pink base with crisp white tips. Clean, elegant, and versatile for any occasion.',
    imageUrl: editorialImages.nails[0]!,
    startingPriceMinor: 18000,
    durationMinutes: 60,
    tags: ['Classic', 'Elegant', 'Minimalist'],
  },
  {
    id: 'n2',
    slug: 'chrome-nails',
    name: 'Chrome Nails',
    categoryName: 'Nail Art',
    kind: 'NAILS',
    description: 'Mirror-finish nails achieved using chrome powder over gel. Bold, futuristic, and impossibly glossy — available in silver, gold, rose gold and holographic.',
    imageUrl: editorialImages.nails[1]!,
    startingPriceMinor: 22000,
    durationMinutes: 75,
    tags: ['Chrome', 'Mirror', 'Bold'],
  },
  {
    id: 'n3',
    slug: 'cat-eye-nails',
    name: 'Cat Eye Nails',
    categoryName: 'Nail Art',
    kind: 'NAILS',
    description: 'Magnetic gel polish creates a mesmerising linear shimmer effect that resembles a cat\'s eye. Deep, rich tones with an otherworldly finish.',
    imageUrl: editorialImages.nails[2]!,
    startingPriceMinor: 20000,
    durationMinutes: 75,
    tags: ['Cat Eye', 'Magnetic', 'Shimmer'],
  },
  {
    id: 'n4',
    slug: 'almond-gel-nails',
    name: 'Almond Gel Nails',
    categoryName: 'Nail Shapes',
    kind: 'NAILS',
    description: 'Slim, tapered almond-shaped gel nails that elongate your fingers. Available in any colour, finish or nail art design.',
    imageUrl: editorialImages.nails[3]!,
    startingPriceMinor: 16000,
    durationMinutes: 60,
    tags: ['Almond', 'Gel', 'Shape'],
  },
  {
    id: 'n5',
    slug: 'gel-x-extensions',
    name: 'Gel-X Extensions',
    categoryName: 'Extensions',
    kind: 'NAILS',
    description: 'Full-cover soft gel nail extensions applied with structured gel. Lightweight, flexible, and damage-free. Perfect for short or bitten nails.',
    imageUrl: editorialImages.nails[4]!,
    startingPriceMinor: 28000,
    durationMinutes: 90,
    tags: ['Extensions', 'Gel-X', 'Length'],
  },
  {
    id: 'n6',
    slug: 'acrylic-overlay',
    name: 'Acrylic Overlay',
    categoryName: 'Extensions',
    kind: 'NAILS',
    description: 'A strong acrylic overlay applied directly to your natural nails for added strength and length. Ideal for nail biters wanting to grow out healthy nails.',
    imageUrl: editorialImages.nails[5]!,
    startingPriceMinor: 24000,
    durationMinutes: 90,
    tags: ['Acrylic', 'Strong', 'Overlay'],
  },
];

export const howItWorks = [
  { step: '01', title: 'Choose Service', body: 'Pick Hair Braiding or Nail Couture and select your preferred style from our lookbook.' },
  { step: '02', title: 'Pick Date & Time', body: 'Choose your preferred appointment date and time slot at the studio.' },
  { step: '03', title: 'Confirm & Book', body: 'Your booking goes straight to the shop owner via Admin Portal or WhatsApp (0531806381).' },
];

