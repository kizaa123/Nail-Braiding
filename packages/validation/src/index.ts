import { z } from 'zod';

export const paginationQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const emailSchema = z.string().trim().email().max(254).toLowerCase();

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[0-9]/, 'Password must include a number');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  role: z.enum(['CUSTOMER', 'PROFESSIONAL']).default('CUSTOMER'),
  phone: z.string().trim().min(8).max(20).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(20).max(200),
});

export const e164PhoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format, e.g. +233241234567');

export const professionalProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  biography: z.string().trim().min(20).max(2000),
  locationCity: z.string().trim().min(2).max(80),
  locationRegion: z.string().trim().min(2).max(80),
  locationCountry: z.string().trim().min(2).max(80).default('Ghana'),
  phoneNumber: e164PhoneSchema,
  whatsappNumber: e164PhoneSchema,
});

export const serviceCreateSchema = z.object({
  categoryId: z.string().uuid(),
  styleId: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional(),
  priceMinor: z.number().int().positive().max(100_000_00),
  currency: z.literal('GHS').default('GHS'),
  durationMinutes: z.number().int().min(15).max(12 * 60),
});

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]),
  startMinutes: z.number().int().min(0).max(24 * 60 - 1),
  endMinutes: z.number().int().min(1).max(24 * 60),
  timezone: z.string().min(3).max(64).default('Africa/Accra'),
  isActive: z.boolean().default(true),
});

export const bookingCreateSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime({ offset: true }),
  notes: z.string().trim().max(500).optional(),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  reason: z.string().trim().max(500).optional(),
});

export const favoriteCreateSchema = z.object({
  targetType: z.enum(['STYLE', 'PORTFOLIO_ITEM', 'PROFESSIONAL']),
  targetId: z.string().uuid(),
});

export const reviewCreateSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1500),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  kind: z.enum(['HAIR', 'NAILS']).optional(),
  styleId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  location: z.string().trim().max(80).optional(),
  minPriceMinor: z.coerce.number().int().min(0).optional(),
  maxPriceMinor: z.coerce.number().int().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  availableOn: z.string().date().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(['HAIR', 'NAILS']),
  parentId: z.string().uuid().nullable().optional(),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const styleCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid(),
  description: z.string().trim().max(1000).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
