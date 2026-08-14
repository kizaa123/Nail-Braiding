import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Errors } from '../../common/errors';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async list(kind?: 'HAIR' | 'NAILS') {
    const cacheKey = `categories:${kind ?? 'all'}`;
    const cached = await this.redis.get<unknown>(cacheKey);
    if (cached) return cached;
    const data = await this.prisma.serviceCategory.findMany({
      where: { isActive: true, ...(kind ? { kind } : {}) },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }],
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  async create(input: {
    name: string;
    slug: string;
    kind: 'HAIR' | 'NAILS';
    parentId?: string | null;
    description?: string;
    sortOrder?: number;
  }) {
    const created = await this.prisma.serviceCategory.create({ data: input });
    await this.redis.delByPrefix('categories:');
    return created;
  }

  async update(
    id: string,
    input: Partial<{
      name: string;
      slug: string;
      description: string;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    const existing = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!existing) throw Errors.notFound('Category');
    const updated = await this.prisma.serviceCategory.update({ where: { id }, data: input });
    await this.redis.delByPrefix('categories:');
    return updated;
  }
}
