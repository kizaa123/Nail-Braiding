import { Injectable } from '@nestjs/common';
import type { SessionUser } from '@beauty/types';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';
import { loadEnv } from '../../config/env';
import type { ImageStorage } from './image-storage';
import { CloudinaryStorage } from './cloudinary.storage';
import { LocalDevStorage } from './local-dev.storage';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PortfolioService {
  private readonly storage: ImageStorage;

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {
    const env = loadEnv();
    this.storage = env.CLOUDINARY_CLOUD_NAME ? new CloudinaryStorage() : new LocalDevStorage();
  }

  async upload(
    user: SessionUser,
    professionalId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    meta: { categoryId?: string; styleId?: string; alt: string; caption?: string },
  ) {
    if (user.role !== 'ADMIN' && user.professionalProfileId !== professionalId) {
      throw Errors.forbidden('You can only upload to your own portfolio.');
    }
    const stored = await this.storage.upload(file.buffer, file.originalname, file.mimetype);
    return this.prisma.portfolioItem.create({
      data: {
        professionalId,
        categoryId: meta.categoryId,
        styleId: meta.styleId,
        storageKey: stored.storageKey,
        url: stored.url,
        thumbnailUrl: stored.thumbnailUrl,
        smallUrl: stored.smallUrl,
        mediumUrl: stored.mediumUrl,
        largeUrl: stored.largeUrl,
        width: stored.width,
        height: stored.height,
        alt: meta.alt,
        caption: meta.caption,
        mimeType: stored.mimeType,
        bytes: stored.bytes,
        moderationStatus: 'PENDING',
      },
    });
  }

  async list(professionalId: string, cursor?: string, limit = 20) {
    const items = await this.prisma.portfolioItem.findMany({
      where: {
        professionalId,
        moderationStatus: 'APPROVED',
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    return {
      data,
      meta: { limit, nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null, hasMore },
    };
  }

  async moderate(actorId: string, id: string, status: 'APPROVED' | 'REJECTED') {
    const item = await this.prisma.portfolioItem.update({
      where: { id },
      data: { moderationStatus: status },
    });
    await this.audit.log({
      actorId,
      action: `PORTFOLIO_${status}`,
      entity: 'PortfolioItem',
      entityId: id,
    });
    return item;
  }

  async remove(user: SessionUser, id: string) {
    const item = await this.prisma.portfolioItem.findUnique({ where: { id } });
    if (!item) throw Errors.notFound('Portfolio item');
    if (user.role !== 'ADMIN' && user.professionalProfileId !== item.professionalId) {
      throw Errors.forbidden();
    }
    await this.storage.destroy(item.storageKey);
    await this.prisma.portfolioItem.delete({ where: { id } });
    if (user.role === 'ADMIN') {
      await this.audit.log({
        actorId: user.id,
        action: 'PORTFOLIO_DELETED',
        entity: 'PortfolioItem',
        entityId: id,
      });
    }
    return { deleted: true };
  }
}
