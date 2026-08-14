export const USER_ROLES = ['CUSTOMER', 'PROFESSIONAL', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['ACTIVE', 'SUSPENDED', 'DELETED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const PROFESSIONAL_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
] as const;
export type ProfessionalStatus = (typeof PROFESSIONAL_STATUSES)[number];

export const BOOKING_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const MODERATION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

export const CATEGORY_KINDS = ['HAIR', 'NAILS'] as const;
export type CategoryKind = (typeof CATEGORY_KINDS)[number];

export const FAVORITE_TARGET_TYPES = ['STYLE', 'PORTFOLIO_ITEM', 'PROFESSIONAL'] as const;
export type FavoriteTargetType = (typeof FAVORITE_TARGET_TYPES)[number];

export const NOTIFICATION_CHANNELS = ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const CURRENCIES = ['GHS'] as const;
export type Currency = (typeof CURRENCIES)[number];
