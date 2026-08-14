import { registerSchema, bookingCreateSchema } from '@beauty/validation';

describe('validation', () => {
  it('rejects weak passwords', () => {
    const result = registerSchema.safeParse({
      email: 'ama@example.com',
      password: 'short',
      firstName: 'Ama',
      lastName: 'Mensah',
    });
    expect(result.success).toBe(false);
  });

  it('rejects client-supplied booking payloads missing a service', () => {
    const result = bookingCreateSchema.safeParse({
      professionalId: 'not-a-uuid',
      scheduledAt: '2026-08-22T14:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});
