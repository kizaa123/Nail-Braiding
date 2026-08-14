import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { SessionUser } from '@beauty/types';
import type { BookingCreateInput } from '@beauty/validation';
import { PrismaService } from '../../database/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Errors } from '../../common/errors';
import { addMinutes, generateBookingReference } from '../../common/utils';

const ACTIVE = ['PENDING', 'CONFIRMED'] as const;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: AvailabilityService,
    private readonly whatsapp: WhatsAppService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(user: SessionUser, input: BookingCreateInput) {
    if (user.role !== 'CUSTOMER' || !user.customerProfileId) {
      throw Errors.forbidden('Only customers can create bookings.');
    }
    const scheduledAt = new Date(input.scheduledAt);

    try {
      const booking = await this.prisma.$transaction(
        async (tx) => {
          const service = await tx.service.findUnique({
            where: { id: input.serviceId },
            include: {
              professional: { include: { whatsapp: true, user: true } },
            },
          });
          if (!service || !service.isActive) throw Errors.notFound('Service');
          if (service.professionalId !== input.professionalId) {
            throw Errors.validation('Service does not belong to this professional.');
          }
          if (service.professional.status !== 'APPROVED') {
            throw Errors.conflict('This professional is not currently accepting bookings.');
          }

          const endAt = addMinutes(scheduledAt, service.durationMinutes);
          await this.availability.assertAvailable(
            service.professionalId,
            scheduledAt,
            endAt,
            service.professional.timezone,
          );

          await tx.$queryRaw`SELECT id FROM "ProfessionalProfile" WHERE id = ${service.professionalId}::uuid FOR UPDATE`;

          const overlap = await tx.booking.findFirst({
            where: {
              professionalId: service.professionalId,
              status: { in: [...ACTIVE] },
              scheduledAt: { lt: endAt },
              endAt: { gt: scheduledAt },
            },
          });
          if (overlap) {
            throw Errors.conflict('This time slot is no longer available.');
          }

          let reference = generateBookingReference();
          for (let i = 0; i < 5; i += 1) {
            const exists = await tx.booking.findUnique({ where: { reference } });
            if (!exists) break;
            reference = generateBookingReference();
          }

          const customer = await tx.customerProfile.findUnique({
            where: { id: user.customerProfileId! },
          });
          if (!customer) throw Errors.notFound('Customer');

          const phone = service.professional.whatsapp?.phoneE164 ?? service.professional.phoneNumber;
          if (!phone) throw Errors.conflict('This professional has not configured WhatsApp yet.');

          const whatsappUrl = this.whatsapp.buildClickToChatUrl({
            professionalName: service.professional.businessName,
            phoneE164: phone,
            reference,
            serviceName: service.name,
            scheduledAt,
            customerFirstName: customer.firstName,
            timezone: service.professional.timezone,
          });

          return tx.booking.create({
            data: {
              reference,
              customerId: customer.id,
              professionalId: service.professionalId,
              serviceId: service.id,
              scheduledAt,
              endAt,
              durationMinutes: service.durationMinutes,
              priceMinor: service.priceMinor,
              currency: service.currency,
              status: 'PENDING',
              notes: input.notes,
              whatsappUrl,
            },
            include: {
              service: true,
              professional: true,
              customer: true,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      await this.notifications.create({
        userId: booking.professional.userId,
        type: 'BOOKING_REQUEST',
        title: 'New booking request',
        body: `${booking.customer.firstName} requested ${booking.service.name} (${booking.reference}).`,
        data: { bookingId: booking.id, reference: booking.reference },
      });

      return booking;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw Errors.conflict('This time slot is no longer available.');
      }
      throw error;
    }
  }

  async listForUser(user: SessionUser, cursor?: string, limit = 20) {
    const where =
      user.role === 'ADMIN'
        ? {}
        : user.role === 'PROFESSIONAL'
          ? { professionalId: user.professionalProfileId }
          : { customerId: user.customerProfileId };
    const items = await this.prisma.booking.findMany({
      where: { ...where, ...(cursor ? { id: { lt: cursor } } : {}) },
      include: { service: true, professional: true, customer: true },
      orderBy: { scheduledAt: 'desc' },
      take: limit + 1,
    });
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    return {
      data,
      meta: { limit, nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null, hasMore },
    };
  }

  async get(user: SessionUser, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true, professional: true, customer: true, review: true },
    });
    if (!booking) throw Errors.notFound('Booking');
    this.assertCanView(user, booking);
    return booking;
  }

  async updateStatus(
    user: SessionUser,
    id: string,
    status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { professional: { include: { user: true } }, customer: { include: { user: true } }, service: true },
    });
    if (!booking) throw Errors.notFound('Booking');

    if (status === 'CANCELLED') {
      if (
        user.role !== 'ADMIN' &&
        user.customerProfileId !== booking.customerId &&
        user.professionalProfileId !== booking.professionalId
      ) {
        throw Errors.forbidden();
      }
    } else if (user.role !== 'ADMIN' && user.professionalProfileId !== booking.professionalId) {
      throw Errors.forbidden('Only the professional can update this booking status.');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status,
        cancelledAt: status === 'CANCELLED' ? new Date() : booking.cancelledAt,
        completedAt: status === 'COMPLETED' ? new Date() : booking.completedAt,
      },
    });

    const targetUserId =
      user.professionalProfileId === booking.professionalId
        ? booking.customer.userId
        : booking.professional.userId;
    await this.notifications.create({
      userId: targetUserId,
      type: `BOOKING_${status}`,
      title: `Booking ${status.toLowerCase()}`,
      body: `${booking.service.name} (${booking.reference}) is now ${status.toLowerCase()}.`,
      data: { bookingId: booking.id },
    });
    return updated;
  }

  private assertCanView(
    user: SessionUser,
    booking: { customerId: string; professionalId: string },
  ) {
    if (user.role === 'ADMIN') return;
    if (user.customerProfileId === booking.customerId) return;
    if (user.professionalProfileId === booking.professionalId) return;
    throw Errors.forbidden();
  }
}
