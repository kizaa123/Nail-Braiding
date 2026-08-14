import { Injectable } from '@nestjs/common';
import type { SessionUser } from '@beauty/types';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(
    user: SessionUser,
    input: { targetType: 'STYLE' | 'PORTFOLIO_ITEM' | 'PROFESSIONAL'; targetId: string },
  ) {
    if (!user.customerProfileId) throw Errors.forbidden('Only customers can save favorites.');
    await this.assertTarget(input.targetType, input.targetId);
    return this.prisma.favorite.upsert({
      where: {
        customerId_targetType_targetId: {
          customerId: user.customerProfileId,
          targetType: input.targetType,
          targetId: input.targetId,
        },
      },
      update: {},
      create: {
        customerId: user.customerProfileId,
        targetType: input.targetType,
        targetId: input.targetId,
      },
    });
  }

  async remove(user: SessionUser, id: string) {
    if (!user.customerProfileId) throw Errors.forbidden();
    const favorite = await this.prisma.favorite.findFirst({
      where: { id, customerId: user.customerProfileId },
    });
    if (!favorite) throw Errors.notFound('Favorite');
    await this.prisma.favorite.delete({ where: { id } });
    return { deleted: true };
  }

  async list(user: SessionUser) {
    if (!user.customerProfileId) throw Errors.forbidden();
    return this.prisma.favorite.findMany({
      where: { customerId: user.customerProfileId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async assertTarget(type: 'STYLE' | 'PORTFOLIO_ITEM' | 'PROFESSIONAL', id: string) {
    if (type === 'STYLE') {
      const style = await this.prisma.style.findUnique({ where: { id } });
      if (!style) throw Errors.notFound('Style');
    } else if (type === 'PROFESSIONAL') {
      const pro = await this.prisma.professionalProfile.findUnique({ where: { id } });
      if (!pro) throw Errors.notFound('Professional');
    } else {
      const item = await this.prisma.portfolioItem.findUnique({ where: { id } });
      if (!item) throw Errors.notFound('Portfolio item');
    }
  }
}
