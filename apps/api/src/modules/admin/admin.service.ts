import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { Errors } from '../../common/errors';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly professionals: ProfessionalsService,
  ) {}

  async users(cursor?: string, limit = 20) {
    const items = await this.prisma.user.findMany({
      where: cursor ? { id: { gt: cursor } } : undefined,
      include: { customerProfile: true, professionalProfile: true },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });
    const hasMore = items.length > limit;
    const data = (hasMore ? items.slice(0, limit) : items).map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      customer: u.customerProfile,
      professional: u.professionalProfile,
    }));
    return {
      data,
      meta: { limit, nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null, hasMore },
    };
  }

  async setUserStatus(actorId: string, userId: string, status: 'ACTIVE' | 'SUSPENDED') {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { status } });
    await this.audit.log({
      actorId,
      action: status === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      entity: 'User',
      entityId: userId,
    });
    return user;
  }

  async setProfessionalStatus(
    actorId: string,
    professionalId: string,
    status: 'APPROVED' | 'REJECTED' | 'SUSPENDED',
    reason?: string,
  ) {
    const updated = await this.professionals.setStatus(professionalId, status, reason);
    await this.audit.log({
      actorId,
      action: `PROFESSIONAL_${status}`,
      entity: 'ProfessionalProfile',
      entityId: professionalId,
      metadata: reason ? { reason } : undefined,
    });
    return updated;
  }

  async bookings(cursor?: string, limit = 20) {
    const items = await this.prisma.booking.findMany({
      where: cursor ? { id: { lt: cursor } } : undefined,
      include: { service: true, professional: true, customer: true },
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

  async settings() {
    return this.prisma.platformSetting.findMany();
  }

  async upsertSetting(actorId: string, key: string, value: unknown) {
    const json = value as Prisma.InputJsonValue;
    const setting = await this.prisma.platformSetting.upsert({
      where: { key },
      update: { value: json },
      create: { key, value: json },
    });
    await this.audit.log({
      actorId,
      action: 'SETTING_UPDATED',
      entity: 'PlatformSetting',
      entityId: setting.id,
      metadata: { key },
    });
    return setting;
  }

  async reviews(cursor?: string, limit = 20) {
    const items = await this.prisma.review.findMany({
      where: cursor ? { id: { lt: cursor } } : undefined,
      include: { customer: true, professional: true },
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

  async reports() {
    return {
      pendingProfessionals: await this.prisma.professionalProfile.count({ where: { status: 'PENDING' } }),
      pendingPortfolio: await this.prisma.portfolioItem.count({ where: { moderationStatus: 'PENDING' } }),
      pendingReviews: await this.prisma.review.count({ where: { moderationStatus: 'PENDING' } }),
    };
  }

  async requireAdminUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw Errors.notFound('User');
    return user;
  }
}
