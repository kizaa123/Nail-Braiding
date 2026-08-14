import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Errors } from '../../common/errors';
import { slugify } from '../../common/utils';
import type { SearchQueryInput } from '@beauty/validation';
import { parsePriceFromQuery } from '../../common/utils';

@Injectable()
export class ProfessionalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async search(query: SearchQueryInput) {
    const parsed = parsePriceFromQuery(query.q);
    const maxPrice = query.maxPriceMinor ?? parsed.maxPriceMinor;
    const text = parsed.cleaned || undefined;

    const items = await this.prisma.professionalProfile.findMany({
      where: {
        status: 'APPROVED',
        ...(query.location
          ? {
              OR: [
                { locationCity: { contains: query.location, mode: 'insensitive' } },
                { locationRegion: { contains: query.location, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(query.minRating ? { ratingAverage: { gte: query.minRating } } : {}),
        ...(query.professionalId ? { id: query.professionalId } : {}),
        services: {
          some: {
            isActive: true,
            ...(query.styleId ? { styleId: query.styleId } : {}),
            ...(query.categoryId ? { categoryId: query.categoryId } : {}),
            ...(query.kind ? { category: { kind: query.kind } } : {}),
            ...(maxPrice ? { priceMinor: { lte: maxPrice } } : {}),
            ...(query.minPriceMinor ? { priceMinor: { gte: query.minPriceMinor } } : {}),
            ...(text
              ? {
                  OR: [
                    { name: { contains: text, mode: 'insensitive' } },
                    { style: { name: { contains: text, mode: 'insensitive' } } },
                  ],
                }
              : {}),
          },
        },
        ...(text
          ? {
              OR: [
                { businessName: { contains: text, mode: 'insensitive' } },
                { biography: { contains: text, mode: 'insensitive' } },
                { services: { some: { name: { contains: text, mode: 'insensitive' } } } },
              ],
            }
          : {}),
        ...(query.cursor ? { id: { gt: query.cursor } } : {}),
      },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { priceMinor: 'asc' },
          take: 3,
          include: { style: true, category: true },
        },
      },
      orderBy: [{ ratingAverage: 'desc' }, { ratingCount: 'desc' }],
      take: query.limit + 1,
    });

    const hasMore = items.length > query.limit;
    const page = hasMore ? items.slice(0, query.limit) : items;
    return {
      data: page.map((p) => ({
        id: p.id,
        slug: p.slug,
        businessName: p.businessName,
        biography: p.biography,
        locationCity: p.locationCity,
        locationRegion: p.locationRegion,
        profilePhotoUrl: p.profilePhotoUrl,
        ratingAverage: Number(p.ratingAverage),
        ratingCount: p.ratingCount,
        startingPriceMinor: p.services[0]?.priceMinor ?? null,
        currency: p.services[0]?.currency ?? 'GHS',
        services: p.services,
      })),
      meta: {
        limit: query.limit,
        nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
        hasMore,
      },
    };
  }

  async bySlug(slug: string) {
    const cacheKey = `professional:public:${slug}`;
    const cached = await this.redis.get<unknown>(cacheKey);
    if (cached) return cached;

    const professional = await this.prisma.professionalProfile.findUnique({
      where: { slug },
      include: {
        services: {
          where: { isActive: true },
          include: { category: true, style: true },
          orderBy: { name: 'asc' },
        },
        portfolioItems: {
          where: { moderationStatus: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 24,
        },
        reviews: {
          where: { moderationStatus: 'APPROVED' },
          include: { customer: { select: { firstName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        availability: { where: { isActive: true } },
        whatsapp: true,
      },
    });
    if (!professional || professional.status !== 'APPROVED') {
      throw Errors.notFound('Professional');
    }
    await this.prisma.professionalProfile.update({
      where: { id: professional.id },
      data: { profileViews: { increment: 1 } },
    });
    await this.redis.set(cacheKey, professional, 60);
    return professional;
  }

  async updateOwn(
    professionalId: string,
    input: {
      businessName?: string;
      biography?: string;
      locationCity?: string;
      locationRegion?: string;
      locationCountry?: string;
      phoneNumber?: string;
      whatsappNumber?: string;
    },
  ) {
    const existing = await this.prisma.professionalProfile.findUnique({
      where: { id: professionalId },
    });
    if (!existing) throw Errors.notFound('Professional');
    const slug = input.businessName ? `${slugify(input.businessName)}-${existing.id.slice(0, 6)}` : undefined;
    const updated = await this.prisma.$transaction(async (tx) => {
      const profile = await tx.professionalProfile.update({
        where: { id: professionalId },
        data: {
          businessName: input.businessName,
          biography: input.biography,
          locationCity: input.locationCity,
          locationRegion: input.locationRegion,
          locationCountry: input.locationCountry,
          phoneNumber: input.phoneNumber,
          ...(slug ? { slug } : {}),
        },
      });
      if (input.whatsappNumber) {
        await tx.whatsAppContact.upsert({
          where: { professionalId },
          update: { phoneE164: input.whatsappNumber, isActive: true },
          create: { professionalId, phoneE164: input.whatsappNumber, isActive: true },
        });
      }
      return profile;
    });
    await this.redis.del(`professional:public:${updated.slug}`);
    await this.redis.del(`professional:public:${existing.slug}`);
    return updated;
  }

  async setStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED', reason?: string) {
    const updated = await this.prisma.professionalProfile.update({
      where: { id },
      data: { status, rejectionReason: reason },
    });
    await this.redis.del(`professional:public:${updated.slug}`);
    return updated;
  }
}
