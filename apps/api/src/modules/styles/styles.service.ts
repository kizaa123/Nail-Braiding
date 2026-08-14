import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Errors } from '../../common/errors';

@Injectable()
export class StylesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async list(input: { kind?: 'HAIR' | 'NAILS'; categoryId?: string; cursor?: string; limit: number }) {
    const items = await this.prisma.style.findMany({
      where: {
        isActive: true,
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        ...(input.kind ? { category: { kind: input.kind } } : {}),
        ...(input.cursor ? { id: { gt: input.cursor } } : {}),
      },
      include: {
        category: true,
        services: {
          where: { isActive: true, professional: { status: 'APPROVED' } },
          orderBy: { priceMinor: 'asc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
      take: input.limit + 1,
    });
    const hasMore = items.length > input.limit;
    const data = (hasMore ? items.slice(0, input.limit) : items).map((style) => ({
      id: style.id,
      slug: style.slug,
      name: style.name,
      description: style.description,
      imageUrl: style.imageUrl,
      kind: style.category.kind,
      categoryName: style.category.name,
      categorySlug: style.category.slug,
      startingPriceMinor: style.services[0]?.priceMinor ?? null,
      currency: style.services[0]?.currency ?? 'GHS',
    }));
    return {
      data,
      meta: { limit: input.limit, nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null, hasMore },
    };
  }

  async bySlug(slug: string) {
    const cacheKey = `style:${slug}`;
    const cached = await this.redis.get<unknown>(cacheKey);
    if (cached) return cached;
    const style = await this.prisma.style.findUnique({
      where: { slug },
      include: {
        category: true,
        services: {
          where: { isActive: true, professional: { status: 'APPROVED' } },
          include: { professional: true },
          orderBy: { priceMinor: 'asc' },
          take: 20,
        },
        portfolioItems: {
          where: { moderationStatus: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 24,
        },
      },
    });
    if (!style || !style.isActive) throw Errors.notFound('Style');
    await this.redis.set(cacheKey, style, 120);
    return style;
  }

  async create(input: {
    name: string;
    slug: string;
    categoryId: string;
    description?: string;
    imageUrl?: string;
  }) {
    const created = await this.prisma.style.create({ data: input });
    await this.redis.delByPrefix('style:');
    return created;
  }

  async update(id: string, input: Partial<{ name: string; description: string; isActive: boolean; imageUrl: string }>) {
    const existing = await this.prisma.style.findUnique({ where: { id } });
    if (!existing) throw Errors.notFound('Style');
    const updated = await this.prisma.style.update({ where: { id }, data: input });
    await this.redis.delByPrefix('style:');
    return updated;
  }
}
