import { Errors } from '../../common/errors';

describe('booking overlap rule', () => {
  function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && aEnd > bStart;
  }

  it('detects colliding appointments', () => {
    const existingStart = new Date('2026-08-22T14:00:00.000Z');
    const existingEnd = new Date('2026-08-22T18:00:00.000Z');
    const candidateStart = new Date('2026-08-22T16:00:00.000Z');
    const candidateEnd = new Date('2026-08-22T20:00:00.000Z');
    expect(overlaps(existingStart, existingEnd, candidateStart, candidateEnd)).toBe(true);
  });

  it('allows back-to-back appointments', () => {
    const existingStart = new Date('2026-08-22T14:00:00.000Z');
    const existingEnd = new Date('2026-08-22T18:00:00.000Z');
    const candidateStart = new Date('2026-08-22T18:00:00.000Z');
    const candidateEnd = new Date('2026-08-22T20:00:00.000Z');
    expect(overlaps(existingStart, existingEnd, candidateStart, candidateEnd)).toBe(false);
  });

  it('maps overlap to a conflict error contract', () => {
    const error = Errors.conflict('This time slot is no longer available.');
    expect(error.code).toBe('CONFLICT');
    expect(error.status).toBe(409);
  });
});
