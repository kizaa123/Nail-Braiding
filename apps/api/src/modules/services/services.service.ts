import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';
import type { SessionUser } from '@beauty/types';
import type { ServiceCreateInput } from '@beauty/validation';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(professionalId: string) {
    return this.prisma.service.findMany({
      where: { professionalId, isActive: true, professional: { status: 'APPROVED' } },
      include: { category: true, style: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(user: SessionUser, professionalId: string, input: ServiceCreateInput) {
    this.assertOwner(user, professionalId);
    const category = await this.prisma.serviceCategory.findUnique({ where: { id: input.categoryId } });
    if (!category || !category.isActive) throw Errors.notFound('Category');
    if (input.styleId) {
      const style = await this.prisma.style.findUnique({ where: { id: input.styleId } });
      if (!style || !style.isActive) throw Errors.notFound('Style');
    }
    return this.prisma.service.create({
      data: { ...input, professionalId },
    });
  }

  async update(
    user: SessionUser,
    professionalId: string,
    serviceId: string,
    input: Partial<ServiceCreateInput> & { isActive?: boolean },
  ) {
    this.assertOwner(user, professionalId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, professionalId },
    });
    if (!service) throw Errors.notFound('Service');
    return this.prisma.service.update({ where: { id: serviceId }, data: input });
  }

  private assertOwner(user: SessionUser, professionalId: string) {
    if (user.role === 'ADMIN') return;
    if (user.role !== 'PROFESSIONAL' || user.professionalProfileId !== professionalId) {
      throw Errors.forbidden('You can only manage your own services.');
    }
  }
}
