export const HAIR_TREE = [
  {
    name: 'Braids',
    slug: 'braids',
    styles: [
      'Knotless Braids',
      'Box Braids',
      'Jumbo Braids',
      'Small Braids',
      'Medium Braids',
      'Boho Braids',
      'Goddess Braids',
      'Fulani Braids',
      'Tribal Braids',
      'Stitch Braids',
      'Lemonade Braids',
      'Feed-in Braids',
      'Ghana Braids',
      'Cornrows',
      'Straight-back Cornrows',
    ],
  },
  {
    name: 'Twists',
    slug: 'twists',
    styles: ['Passion Twists', 'Senegalese Twists', 'Marley Twists', 'Spring Twists'],
  },
  {
    name: 'Locs',
    slug: 'locs',
    styles: ['Faux Locs', 'Butterfly Locs'],
  },
  {
    name: 'Natural Hair',
    slug: 'natural-hair',
    styles: [
      'Wash & Blow',
      'Silk Press',
      'Natural Styling',
      'Twist-outs',
      'Bantu Knots',
      'Afro Styling',
      'Protective Styles',
      'Hair Treatment',
    ],
  },
  {
    name: 'Wigs & Extensions',
    slug: 'wigs-extensions',
    styles: [
      'Wig Installation',
      'Wig Revamp',
      'Closure Installation',
      'Frontal Installation',
      'Weaving',
      'Ponytails',
    ],
  },
] as const;

export const NAIL_TREE = [
  {
    name: 'Nail Types',
    slug: 'nail-types',
    styles: ['Acrylic', 'Gel', 'Builder Gel', 'Gel-X', 'Polygel', 'Press-on', 'Natural Nails'],
  },
  {
    name: 'Nail Styles',
    slug: 'nail-styles',
    styles: [
      'French Tips',
      'Ombre',
      'Chrome',
      'Cat Eye',
      'Marble',
      '3D Nails',
      'Floral',
      'Abstract',
      'Glitter',
      'Rhinestone',
      'Minimalist',
      'Luxury',
    ],
  },
  {
    name: 'Nail Shapes',
    slug: 'nail-shapes',
    styles: ['Almond', 'Coffin', 'Square', 'Stiletto', 'Oval'],
  },
] as const;

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
