export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationMeta {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorPageQuery {
  cursor?: string;
  limit?: number;
}

export interface PublicUser {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  emailVerified: boolean;
  customerProfileId?: string;
  professionalProfileId?: string;
}

export interface Money {
  amountMinor: number;
  currency: string;
  formatted: string;
}

export interface ImageVariants {
  url: string;
  thumbnailUrl: string;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
  width: number;
  height: number;
  alt: string;
}

export interface StyleSummary {
  id: string;
  slug: string;
  name: string;
  kind: 'HAIR' | 'NAILS';
  categoryName: string;
  imageUrl: string | null;
  startingPriceMinor: number | null;
  currency: string;
}

export interface ProfessionalSummary {
  id: string;
  slug: string;
  businessName: string;
  locationCity: string;
  locationRegion: string;
  profilePhotoUrl: string | null;
  ratingAverage: number;
  ratingCount: number;
  startingPriceMinor: number | null;
  currency: string;
}

export interface ServiceSummary {
  id: string;
  name: string;
  durationMinutes: number;
  priceMinor: number;
  currency: string;
  styleName: string | null;
  categoryName: string | null;
}

export interface BookingSummary {
  id: string;
  reference: string;
  status: string;
  scheduledAt: string;
  endAt: string;
  priceMinor: number;
  currency: string;
  serviceName: string;
  professionalName: string;
  customerName: string;
}
