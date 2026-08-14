import { Injectable } from '@nestjs/common';
import type { SessionUser } from '@beauty/types';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user: SessionUser,
    input: { bookingId: string; rating: number; comment: string },
  ) {
    if (!user.customerProfileId) throw Errors.forbidden('Only customers can leave reviews.');
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: { review: true },
    });
    if (!booking) throw Errors.notFound('Booking');
    if (booking.customerId !== user.customerProfileId) throw Errors.forbidden();
    if (booking.status !== 'COMPLETED') {
      throw Errors.forbidden('You can only review completed bookings.');
    }
    if (booking.review) throw Errors.conflict('This booking has already been reviewed.');

    const review = await this.prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          bookingId: booking.id,
          customerId: booking.customerId,
          professionalId: booking.professionalId,
          rating: input.rating,
          comment: input.comment,
          moderationStatus: 'PENDING',
        },
      });
      const agg = await tx.review.aggregate({
        where: { professionalId: booking.professionalId, moderationStatus: 'APPROVED' },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.professionalProfile.update({
        where: { id: booking.professionalId },
        data: {
          ratingAverage: agg._avg.rating ?? 0,
          ratingCount: agg._count.rating,
        },
      });
      return created;
    });
    return review;
  }

  async moderate(id: string, status: 'APPROVED' | 'REJECTED') {
    const review = await this.prisma.review.update({
      where: { id },
      data: { moderationStatus: status },
    });
    const agg = await this.prisma.review.aggregate({
      where: { professionalId: review.professionalId, moderationStatus: 'APPROVED' },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await this.prisma.professionalProfile.update({
      where: { id: review.professionalId },
      data: {
        ratingAverage: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });
    return review;
  }

  async listForProfessional(professionalId: string, cursor?: string, limit = 20) {
    const items = await this.prisma.review.findMany({
      where: {
        professionalId,
        moderationStatus: 'APPROVED',
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      include: { customer: { select: { firstName: true } } },
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
}
