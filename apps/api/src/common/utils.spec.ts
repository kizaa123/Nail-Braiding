import { parsePriceFromQuery, slugify, toE164Digits } from './utils';

describe('query helpers', () => {
  it('extracts max price from natural search text', () => {
    expect(parsePriceFromQuery('nails under 200')).toEqual({
      cleaned: 'nails',
      maxPriceMinor: 20000,
    });
  });

  it('slugifies names for SEO URLs', () => {
    expect(slugify('Knotless Braids')).toBe('knotless-braids');
  });

  it('strips non-digits from E.164 numbers', () => {
    expect(toE164Digits('+233 20 000 0010')).toBe('233200000010');
  });
});
