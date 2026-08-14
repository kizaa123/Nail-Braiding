import { Injectable } from '@nestjs/common';
import type { SessionUser } from '@beauty/types';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(user: SessionUser) {
    if (!user.customerProfileId) throw Errors.forbidden();
    return this.prisma.customerProfile.findUnique({
      where: { id: user.customerProfileId },
    });
  }

  async update(
    user: SessionUser,
    input: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string },
  ) {
    if (!user.customerProfileId) throw Errors.forbidden();
    return this.prisma.customerProfile.update({
      where: { id: user.customerProfileId },
      data: input,
    });
  }
}
